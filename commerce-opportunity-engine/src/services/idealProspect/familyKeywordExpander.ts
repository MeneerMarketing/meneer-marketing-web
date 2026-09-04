/**
 * Milestone 9.3.3 — keyword expansion that cannot drift out of its family.
 *
 * Expansion starts from the configured family seeds and may be widened with
 * DataForSEO keyword ideas, but every candidate must still match the family's
 * own tokens and clear the pre-gate. A keyword without complete lineage never
 * reaches a SERP call.
 */

import type { AxiosInstance } from "axios";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../../config/env.js";
import {
  ARCHETYPE_BY_ID,
  type ProductArchetypeId,
  type ProductFamily,
} from "../../config/idealProductArchetypes.js";
import type { ProductionBranch } from "../../config/productionDiscovery.js";
import { evaluateKeywordPreGate } from "./keywordPreGate.js";
import { normalizeKeyword } from "../keywords/normalizeKeyword.js";
import { fetchKeywordIdeas } from "../dataforseo/keywordIdeas.js";

const KEYWORD_LOCALE = "nl-NL";

export type KeywordGenerationSource = "family_seed" | "dataforseo_ideas";

export interface FamilyKeyword {
  id: string | null;
  keyword: string;
  category: string;
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  /** The seed this keyword descends from. */
  seed: string;
  generationSource: KeywordGenerationSource;
  archetypeFit: number;
  preGateClass: string;
  prospectingValue: number;
  searchVolume: number | null;
  cpc: number | null;
}

export interface RejectedKeyword {
  keyword: string;
  familyId: string | null;
  reason: string;
  source: KeywordGenerationSource;
}

export interface FamilyExpansionResult {
  keywords: FamilyKeyword[];
  rejected: RejectedKeyword[];
  ideasCost: number;
  ideasFetched: number;
}

function activeFamilies(branch: ProductionBranch): ProductFamily[] {
  const archetype = ARCHETYPE_BY_ID.get(branch.archetypeId);
  if (!archetype) return [];
  return archetype.families.filter((family) => branch.familyIds.includes(family.id));
}

/** A candidate belongs to a family only if the family's own tokens say so. */
function matchFamily(keyword: string, families: ProductFamily[]): ProductFamily | null {
  const lower = keyword.toLowerCase();
  let best: { family: ProductFamily; tokenLength: number } | null = null;
  for (const family of families) {
    for (const token of family.matchTokens) {
      if (!lower.includes(token.toLowerCase())) continue;
      // Longest matching token wins, so "zelfreinigende kattenbak" beats "kattenbak".
      if (!best || token.length > best.tokenLength) {
        best = { family, tokenLength: token.length };
      }
    }
  }
  return best?.family ?? null;
}

function familyRejects(keyword: string, family: ProductFamily): string | null {
  const lower = keyword.toLowerCase();
  for (const token of family.rejectTokens) {
    if (lower.includes(token.toLowerCase())) return `family_reject_token:${token}`;
  }
  return null;
}

function buildKeyword(
  keyword: string,
  family: ProductFamily,
  archetypeId: ProductArchetypeId,
  keywordCategory: string,
  seed: string,
  source: KeywordGenerationSource,
  volume: number | null,
  cpc: number | null
): { keyword: FamilyKeyword } | { rejected: RejectedKeyword } {
  const familyReject = familyRejects(keyword, family);
  if (familyReject) {
    return { rejected: { keyword, familyId: family.id, reason: familyReject, source } };
  }

  const preGate = evaluateKeywordPreGate({ keyword });
  if (!preGate.accepted) {
    return {
      rejected: {
        keyword,
        familyId: family.id,
        reason: preGate.rejectReason ?? `pre_gate:${preGate.preGateClass}`,
        source,
      },
    };
  }

  return {
    keyword: {
      id: null,
      keyword,
      category: keywordCategory,
      archetypeId,
      familyId: family.id,
      familyLabel: family.label,
      seed,
      generationSource: source,
      archetypeFit: preGate.archetype.productArchetypeFitScore,
      preGateClass: preGate.preGateClass,
      prospectingValue: preGate.prospectingValue,
      searchVolume: volume,
      cpc,
    },
  };
}

export async function expandFamilyKeywords(input: {
  branches: ProductionBranch[];
  client: AxiosInstance | null;
  env: Env | null;
  ideasLimit: number;
  /** Skip the Labs call when there is no budget headroom. */
  allowIdeas: boolean;
}): Promise<FamilyExpansionResult> {
  const keywords: FamilyKeyword[] = [];
  const rejected: RejectedKeyword[] = [];
  const seen = new Set<string>();

  const familyIndex: Array<{
    branch: ProductionBranch;
    family: ProductFamily;
    keywordCategory: string;
  }> = [];

  for (const branch of input.branches) {
    const archetype = ARCHETYPE_BY_ID.get(branch.archetypeId);
    if (!archetype?.enabled) continue;
    for (const family of activeFamilies(branch)) {
      familyIndex.push({ branch, family, keywordCategory: archetype.keywordCategory });
    }
  }

  for (const entry of familyIndex) {
    for (const seed of entry.family.seeds) {
      const key = seed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const built = buildKeyword(
        seed,
        entry.family,
        entry.branch.archetypeId,
        entry.keywordCategory,
        entry.family.seeds[0]!,
        "family_seed",
        null,
        null
      );
      if ("keyword" in built) keywords.push(built.keyword);
      else rejected.push(built.rejected);
    }
  }

  let ideasCost = 0;
  let ideasFetched = 0;

  if (input.allowIdeas && input.client && input.env) {
    const seeds = familyIndex.flatMap((entry) => entry.family.seeds.slice(0, 2));
    const ideas = await fetchKeywordIdeas({
      client: input.client,
      env: input.env,
      seeds,
      limit: input.ideasLimit,
    });
    ideasCost = ideas.cost;
    ideasFetched = ideas.items.length;

    const families = familyIndex.map((entry) => entry.family);
    for (const item of ideas.items) {
      const candidate = item.keyword.trim().toLowerCase();
      if (!candidate || seen.has(candidate)) continue;
      seen.add(candidate);

      const family = matchFamily(candidate, families);
      if (!family) {
        rejected.push({
          keyword: candidate,
          familyId: null,
          reason: "outside_active_families",
          source: "dataforseo_ideas",
        });
        continue;
      }

      const owner = familyIndex.find((entry) => entry.family.id === family.id)!;
      const built = buildKeyword(
        candidate,
        family,
        owner.branch.archetypeId,
        owner.keywordCategory,
        family.seeds[0]!,
        "dataforseo_ideas",
        item.searchVolume,
        item.cpc
      );
      if ("keyword" in built) keywords.push(built.keyword);
      else rejected.push(built.rejected);
    }
  }

  return { keywords, rejected, ideasCost, ideasFetched };
}

/**
 * Ranks within each family, then interleaves families so one family cannot eat
 * the whole SERP budget. Search volume is a tiebreaker only: prospect quality
 * comes from archetype fit, never from popularity.
 */
export function selectProductionKeywords(
  keywords: FamilyKeyword[],
  options: { maxTotal: number; maxPerFamily: number; branches: ProductionBranch[] }
): FamilyKeyword[] {
  const byFamily = new Map<string, FamilyKeyword[]>();
  for (const keyword of keywords) {
    if (!byFamily.has(keyword.familyId)) byFamily.set(keyword.familyId, []);
    byFamily.get(keyword.familyId)!.push(keyword);
  }

  const shareByArchetype = new Map(
    options.branches.map((branch) => [branch.archetypeId, branch.keywordShare])
  );

  const queues: FamilyKeyword[][] = [];
  for (const [, familyKeywords] of byFamily) {
    const ranked = [...familyKeywords].sort((a, b) => {
      // Seeds are hand-picked and always tested first.
      if (a.generationSource !== b.generationSource) {
        return a.generationSource === "family_seed" ? -1 : 1;
      }
      const fit = b.archetypeFit - a.archetypeFit;
      if (fit !== 0) return fit;
      const value = b.prospectingValue - a.prospectingValue;
      if (value !== 0) return value;
      return (b.searchVolume ?? 0) - (a.searchVolume ?? 0);
    });
    queues.push(ranked.slice(0, options.maxPerFamily));
  }

  // Branch budget share, converted into slots.
  const slots = new Map<ProductArchetypeId, number>();
  for (const [archetypeId, share] of shareByArchetype) {
    slots.set(archetypeId, Math.max(1, Math.round(options.maxTotal * share)));
  }

  const selected: FamilyKeyword[] = [];
  let index = 0;
  let progressed = true;
  while (selected.length < options.maxTotal && progressed) {
    progressed = false;
    for (const queue of queues) {
      const next = queue[index];
      if (!next) continue;
      const remaining = slots.get(next.archetypeId) ?? 0;
      if (remaining <= 0) continue;
      slots.set(next.archetypeId, remaining - 1);
      selected.push(next);
      progressed = true;
      if (selected.length >= options.maxTotal) break;
    }
    index += 1;
  }

  return selected;
}

/** Persists lineage so a keyword can be traced back long after the run. */
export async function persistFamilyKeywords(
  client: SupabaseClient,
  keywords: FamilyKeyword[]
): Promise<FamilyKeyword[]> {
  if (keywords.length === 0) return [];

  const rows = keywords.map((keyword) => ({
    keyword: keyword.keyword,
    locale: KEYWORD_LOCALE,
    category: keyword.category,
    active: true,
    cluster: keyword.familyId,
    seed_keyword: keyword.seed,
    normalized_keyword: normalizeKeyword(keyword.keyword),
    keyword_source:
      keyword.generationSource === "family_seed" ? "ARCHETYPE_SEED" : "ARCHETYPE_EXPANSION",
    keyword_intent_type: "NON_BRANDED_PRODUCT",
    product_archetype_id: keyword.archetypeId,
    product_family_id: keyword.familyId,
    product_archetype_fit_score: keyword.archetypeFit,
    keyword_pre_gate_class: keyword.preGateClass,
    prospecting_value_score: keyword.prospectingValue,
  }));

  const { error } = await client
    .from("keywords")
    .upsert(rows, { onConflict: "keyword,locale", ignoreDuplicates: false });
  if (error) throw new Error(`Failed to persist family keywords: ${error.message}`);

  const { data, error: loadError } = await client
    .from("keywords")
    .select("id, keyword, search_volume, cpc")
    .in(
      "keyword",
      keywords.map((keyword) => keyword.keyword)
    )
    .eq("locale", KEYWORD_LOCALE);
  if (loadError) throw new Error(`Failed to reload family keywords: ${loadError.message}`);

  const byKeyword = new Map((data ?? []).map((row) => [String(row.keyword).toLowerCase(), row]));

  return keywords.map((keyword) => {
    const row = byKeyword.get(keyword.keyword.toLowerCase());
    return {
      ...keyword,
      id: row ? String(row.id) : null,
      searchVolume: keyword.searchVolume ?? ((row?.search_volume as number | null) ?? null),
      cpc: keyword.cpc ?? ((row?.cpc as number | null) ?? null),
    };
  });
}
