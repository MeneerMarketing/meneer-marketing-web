/**
 * Milestone 9.3.2 — traceable archetype keyword seeding.
 *
 * Every keyword that enters discovery carries its origin: branch, product
 * family, seed and archetype fit. No keyword without lineage.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ARCHETYPE_BY_ID,
  type ProductArchetypeId,
} from "../../config/idealProductArchetypes.js";
import { evaluateKeywordPreGate } from "./keywordPreGate.js";
import { normalizeKeyword } from "../keywords/normalizeKeyword.js";

const KEYWORD_LOCALE = "nl-NL";

export interface SeededArchetypeKeyword {
  id: string;
  keyword: string;
  category: string;
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  archetypeFit: number;
  preGateClass: string;
  prospectingValue: number;
  searchVolume: number | null;
  cpc: number | null;
  lastScannedAt: string | null;
}

/**
 * Upserts the configured family seeds for the given branches and returns them
 * with their database ids. Seeds that fail their own pre-gate are skipped, so a
 * misconfigured family cannot smuggle a bad keyword into a run.
 */
export async function seedArchetypeKeywords(
  client: SupabaseClient,
  archetypeIds: ProductArchetypeId[]
): Promise<{ seeded: SeededArchetypeKeyword[]; skipped: Array<{ keyword: string; reason: string }> }> {
  const skipped: Array<{ keyword: string; reason: string }> = [];
  const rows: Array<Record<string, unknown>> = [];
  const meta = new Map<
    string,
    Omit<SeededArchetypeKeyword, "id" | "searchVolume" | "cpc" | "lastScannedAt">
  >();

  for (const archetypeId of archetypeIds) {
    const archetype = ARCHETYPE_BY_ID.get(archetypeId);
    if (!archetype) continue;
    if (!archetype.enabled) {
      skipped.push({ keyword: archetype.label, reason: "branch_disabled" });
      continue;
    }

    for (const family of archetype.families) {
      for (const seed of family.seeds) {
        const preGate = evaluateKeywordPreGate({ keyword: seed });
        if (!preGate.accepted) {
          skipped.push({ keyword: seed, reason: preGate.rejectReason ?? "pre_gate_rejected" });
          continue;
        }

        rows.push({
          keyword: seed,
          locale: KEYWORD_LOCALE,
          category: archetype.keywordCategory,
          active: true,
          cluster: family.id,
          seed_keyword: family.seeds[0],
          normalized_keyword: normalizeKeyword(seed),
          keyword_source: "ARCHETYPE_SEED",
          keyword_intent_type: preGate.preGateClass.startsWith("PROBLEM")
            ? "NON_BRANDED_PRODUCT"
            : "NON_BRANDED_PRODUCT",
          product_archetype_id: archetype.id,
          product_family_id: family.id,
          product_archetype_fit_score: preGate.archetype.productArchetypeFitScore,
          keyword_pre_gate_class: preGate.preGateClass,
          prospecting_value_score: preGate.prospectingValue,
        });

        meta.set(seed.toLowerCase(), {
          keyword: seed,
          category: archetype.keywordCategory,
          archetypeId: archetype.id,
          familyId: family.id,
          familyLabel: family.label,
          archetypeFit: preGate.archetype.productArchetypeFitScore,
          preGateClass: preGate.preGateClass,
          prospectingValue: preGate.prospectingValue,
        });
      }
    }
  }

  if (rows.length === 0) return { seeded: [], skipped };

  const { error } = await client
    .from("keywords")
    .upsert(rows, { onConflict: "keyword,locale", ignoreDuplicates: false });

  if (error) throw new Error(`Failed to seed archetype keywords: ${error.message}`);

  const { data, error: loadError } = await client
    .from("keywords")
    .select(
      "id, keyword, category, product_archetype_id, product_family_id, product_archetype_fit_score, keyword_pre_gate_class, prospecting_value_score, search_volume, cpc, last_scanned_at"
    )
    .in(
      "keyword",
      rows.map((r) => String(r.keyword))
    )
    .eq("locale", KEYWORD_LOCALE);

  if (loadError) throw new Error(`Failed to reload archetype keywords: ${loadError.message}`);

  const seeded: SeededArchetypeKeyword[] = [];
  for (const row of data ?? []) {
    const info = meta.get(String(row.keyword).toLowerCase());
    if (!info) continue;
    seeded.push({
      id: String(row.id),
      keyword: info.keyword,
      category: info.category,
      archetypeId: info.archetypeId,
      familyId: info.familyId,
      familyLabel: info.familyLabel,
      archetypeFit: info.archetypeFit,
      preGateClass: info.preGateClass,
      prospectingValue: info.prospectingValue,
      searchVolume: row.search_volume as number | null,
      cpc: row.cpc as number | null,
      lastScannedAt: row.last_scanned_at as string | null,
    });
  }

  return { seeded, skipped };
}

/**
 * Picks the calibration set: spread across product families first, then the
 * strongest remaining keyword per branch. Never selects on search volume.
 */
export function selectCalibrationKeywords(
  seeded: SeededArchetypeKeyword[],
  options: { maxPerBranch: number; maxPerFamily: number; maxTotal: number }
): SeededArchetypeKeyword[] {
  const byBranch = new Map<string, SeededArchetypeKeyword[]>();
  for (const keyword of seeded) {
    if (!byBranch.has(keyword.archetypeId)) byBranch.set(keyword.archetypeId, []);
    byBranch.get(keyword.archetypeId)!.push(keyword);
  }

  const selected: SeededArchetypeKeyword[] = [];

  for (const [, keywords] of byBranch) {
    const ranked = [...keywords].sort((a, b) => {
      const fit = b.archetypeFit - a.archetypeFit;
      if (fit !== 0) return fit;
      const value = b.prospectingValue - a.prospectingValue;
      if (value !== 0) return value;
      // Longer queries are more specific, which is what we want to test.
      return b.keyword.length - a.keyword.length;
    });

    const perFamily = new Map<string, number>();
    const branchPicks: SeededArchetypeKeyword[] = [];

    for (const keyword of ranked) {
      if (branchPicks.length >= options.maxPerBranch) break;
      const used = perFamily.get(keyword.familyId) ?? 0;
      if (used >= options.maxPerFamily) continue;
      perFamily.set(keyword.familyId, used + 1);
      branchPicks.push(keyword);
    }

    // Fewer families than slots: top up with the next best from any family.
    for (const keyword of ranked) {
      if (branchPicks.length >= options.maxPerBranch) break;
      if (branchPicks.includes(keyword)) continue;
      branchPicks.push(keyword);
    }

    selected.push(...branchPicks);
  }

  return selected.slice(0, options.maxTotal);
}
