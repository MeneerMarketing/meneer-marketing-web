/**
 * Milestone 9.3 — profile-aware keyword selection for ideal prospect discovery.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  IDEAL_KEYWORD_INTENT_BLOCK,
  IDEAL_KEYWORD_INTENTS,
  IDEAL_PROSPECT_CATEGORIES,
  M93_DEFAULTS,
} from "../../config/idealProspectProfile.js";
import { enabledArchetypeCategories } from "../../config/idealProductArchetypes.js";
import { scoreDiscoveryPriority } from "../keywords/discoveryPriority.js";
import { normalizeKeyword } from "../keywords/normalizeKeyword.js";
import { evaluateKeywordPreGate } from "./keywordPreGate.js";

export interface IdealSelectableKeyword {
  id: string;
  keyword: string;
  category: string;
  cluster: string | null;
  keyword_intent_type: string | null;
  prospecting_tier: string | null;
  prospecting_value_score: number | null;
  keyword_quality_score: number | null;
  commercial_intent_score: number | null;
  product_intent_score: number | null;
  discovery_priority_score: number;
  archetype_id: string | null;
  product_family_id: string | null;
  product_archetype_fit_score: number;
  pre_gate_class: string;
}

export interface IdealKeywordSelectionResult {
  selected: IdealSelectableKeyword[];
  byCategory: Record<string, number>;
  brandedCount: number;
  skippedCooldown: number;
  /** Keywords stopped before any SERP call, grouped by pre-gate class. */
  preGateRejected: Array<{ keyword: string; preGateClass: string; reason: string }>;
}

function nearDupeKey(keyword: string): string {
  return normalizeKeyword(keyword)
    .replace(/\b(kopen|bestellen|beste|goedkoop|prijs)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function selectIdealProspectKeywords(
  client: SupabaseClient,
  options?: { maxKeywords?: number; cooldownDays?: number }
): Promise<IdealKeywordSelectionResult> {
  const maxKeywords = options?.maxKeywords ?? M93_DEFAULTS.maxKeywords;
  const cooldownDays = options?.cooldownDays ?? M93_DEFAULTS.rescanCooldownDays;
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const enabledCategories = enabledArchetypeCategories();
  const activeCategories = enabledCategories.length
    ? enabledCategories.filter((c) => (IDEAL_PROSPECT_CATEGORIES as readonly string[]).includes(c))
    : [...IDEAL_PROSPECT_CATEGORIES];

  const { data, error } = await client
    .from("keywords")
    .select(
      `id, keyword, category, cluster, keyword_intent_type, prospecting_tier,
       prospecting_value_score, keyword_quality_score, commercial_intent_score,
       product_intent_score, prospect_yield_score, unique_domains_found, retailer_ratio,
       category_relevance_score, search_volume, cpc, last_scanned_at, rejected, paused, active`
    )
    .in("category", activeCategories)
    .eq("rejected", false)
    .eq("paused", false)
    .or("prospecting_tier.is.null,prospecting_tier.neq.REJECT");

  if (error) throw new Error(`Failed to load ideal keywords: ${error.message}`);

  const scored: IdealSelectableKeyword[] = [];
  const preGateRejected: IdealKeywordSelectionResult["preGateRejected"] = [];
  let skippedCooldown = 0;

  for (const row of data ?? []) {
    if (row.last_scanned_at) {
      const age = now - new Date(row.last_scanned_at).getTime();
      if (age < cooldownMs / 2) {
        skippedCooldown += 1;
        continue;
      }
    }

    const intent = row.keyword_intent_type ?? "";
    if (IDEAL_KEYWORD_INTENT_BLOCK.includes(intent as never)) continue;
    if (
      intent &&
      !IDEAL_KEYWORD_INTENTS.includes(intent as never) &&
      intent !== "OTHER"
    ) {
      continue;
    }

    const tier = row.prospecting_tier ?? "";
    if (tier === "LOW_VALUE" && intent !== "NON_BRANDED_PRODUCT") continue;

    // Prospect-first: archetype and pre-gate decide before any SERP spend.
    const preGate = evaluateKeywordPreGate({
      keyword: row.keyword,
      searchVolume: row.search_volume,
      cpc: row.cpc,
    });
    if (!preGate.accepted) {
      preGateRejected.push({
        keyword: row.keyword,
        preGateClass: preGate.preGateClass,
        reason: preGate.rejectReason ?? "pre_gate_rejected",
      });
      continue;
    }

    const priority = scoreDiscoveryPriority({
      prospectingValue: row.prospecting_value_score,
      keywordQuality: row.keyword_quality_score,
      commercialIntent: row.commercial_intent_score,
      productIntent: row.product_intent_score,
      historicalYield: row.prospect_yield_score,
      uniqueDomainsFound: row.unique_domains_found,
      retailerRatio: row.retailer_ratio,
      categoryRelevance: row.category_relevance_score,
    });

    // Prospecting value outranks raw commercial intent in ideal mode.
    const idealBoost =
      Math.round(preGate.prospectingValue * 0.12) +
      Math.round(preGate.archetype.productArchetypeFitScore * 0.08);

    scored.push({
      id: row.id,
      keyword: row.keyword,
      category: row.category,
      cluster: row.cluster,
      keyword_intent_type: row.keyword_intent_type,
      prospecting_tier: row.prospecting_tier,
      prospecting_value_score: row.prospecting_value_score,
      keyword_quality_score: row.keyword_quality_score,
      commercial_intent_score: row.commercial_intent_score,
      product_intent_score: row.product_intent_score,
      discovery_priority_score: priority.score + idealBoost,
      archetype_id: preGate.archetype.archetypeId,
      product_family_id: preGate.archetype.familyId,
      product_archetype_fit_score: preGate.archetype.productArchetypeFitScore,
      pre_gate_class: preGate.preGateClass,
    });
  }

  scored.sort((a, b) => b.discovery_priority_score - a.discovery_priority_score);

  const selected: IdealSelectableKeyword[] = [];
  const byCategory: Record<string, number> = {};
  const clusterCounts: Record<string, number> = {};
  const dupeKeys = new Set<string>();
  let brandedCount = 0;
  const maxBranded = Math.max(1, Math.floor(maxKeywords * M93_DEFAULTS.maxProductBrandedShare));

  for (const kw of scored) {
    if (selected.length >= maxKeywords) break;

    const cat = kw.category;
    const catCount = byCategory[cat] ?? 0;
    const catQuota = Math.ceil(maxKeywords / IDEAL_PROSPECT_CATEGORIES.length) + 2;
    if (catCount >= catQuota) continue;

    const clusterKey = `${cat}:${kw.cluster ?? "none"}`;
    const clusterCount = clusterCounts[clusterKey] ?? 0;
    if (clusterCount >= M93_DEFAULTS.maxClusterPerCategory) continue;

    const dupe = nearDupeKey(kw.keyword);
    if (dupeKeys.has(dupe)) continue;

    if (kw.keyword_intent_type === "PRODUCT_BRANDED") {
      if (brandedCount >= maxBranded) continue;
      brandedCount += 1;
    }

    selected.push(kw);
    byCategory[cat] = catCount + 1;
    clusterCounts[clusterKey] = clusterCount + 1;
    dupeKeys.add(dupe);
  }

  return { selected, byCategory, brandedCount, skippedCooldown, preGateRejected };
}