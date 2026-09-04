/**
 * Milestone 9.6.1 — per-family yield and verdict for calibration.
 */

import type { FamilyVerdict } from "../../config/brandFirstBalancedCalibration.js";
import { gapScoreBand } from "../../config/designGapWideScreen.js";

export type FamilyYieldRow = {
  familyId: string;
  familyLabel: string;
  queriesTested: number;
  organicRows: number;
  candidateBrands: number;
  validatedFirstParty: number;
  economicQualified: number;
  designGapScreened: number;
  highGapBrands: number;
  firstPartyYield: number;
  economicYield: number;
  designGapYield: number;
  verdict: FamilyVerdict;
  verdictReason: string;
};

export type FamilyYieldCandidate = {
  productFamilyId: string;
  productFamilyLabel: string;
  firstPartyConfidence: number;
  economicQualified: boolean;
  designGapScreened: boolean;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  contentPresentation: number | null;
};

export function computeFamilyYieldAnalytics(input: {
  queriesByFamily: Map<string, number>;
  organicRowsByFamily: Map<string, number>;
  candidates: FamilyYieldCandidate[];
  highGapVisualMin: number;
  highGapPurchaseMin: number;
}): FamilyYieldRow[] {
  const familyIds = new Set<string>();
  for (const key of input.queriesByFamily.keys()) familyIds.add(key);
  for (const candidate of input.candidates) familyIds.add(candidate.productFamilyId);

  return [...familyIds].map((familyId) => {
    const familyCandidates = input.candidates.filter((c) => c.productFamilyId === familyId);
    const familyLabel = familyCandidates[0]?.productFamilyLabel ?? familyId;
    const queriesTested = input.queriesByFamily.get(familyId) ?? 0;
    const organicRows = input.organicRowsByFamily.get(familyId) ?? 0;
    const candidateBrands = familyCandidates.length;
    const validatedFirstParty = familyCandidates.filter(
      (c) => c.firstPartyConfidence >= 58
    ).length;
    const economicQualified = familyCandidates.filter((c) => c.economicQualified).length;
    const designGapScreened = familyCandidates.filter((c) => c.designGapScreened).length;
    const highGapBrands = familyCandidates.filter((c) => {
      if (!c.designGapScreened) return false;
      const visualHigh =
        (c.preauditVisualGap ?? 0) >= input.highGapVisualMin ||
        gapScoreBand(c.preauditVisualGap) === "HIGH" ||
        gapScoreBand(c.preauditVisualGap) === "VERY_HIGH";
      const purchaseHigh =
        (c.preauditPurchaseGap ?? 0) >= input.highGapPurchaseMin ||
        gapScoreBand(c.preauditPurchaseGap) === "HIGH" ||
        gapScoreBand(c.preauditPurchaseGap) === "VERY_HIGH";
      return visualHigh || purchaseHigh;
    }).length;

    const firstPartyYield =
      organicRows > 0 ? Math.round((validatedFirstParty / organicRows) * 100) : 0;
    const economicYield =
      validatedFirstParty > 0
        ? Math.round((economicQualified / validatedFirstParty) * 100)
        : 0;
    const designGapYield =
      economicQualified > 0
        ? Math.round((highGapBrands / economicQualified) * 100)
        : 0;

    let verdict: FamilyVerdict = "WEAK";
    let verdictReason = "weinig first-party brands";

    if (economicQualified >= 2 && highGapBrands >= 1) {
      verdict = "STRONG";
      verdictReason = "meerdere economic brands + minstens één hoge gap";
    } else if (validatedFirstParty >= 2 && designGapScreened > 0 && highGapBrands === 0) {
      verdict = "PROMISING";
      verdictReason = "goede brands, design gap nog onzeker of laag";
    } else if (candidateBrands > 0 && validatedFirstParty === 0) {
      verdict = "PARK";
      verdictReason = "vooral media/retailers of geen first-party match";
    } else if (validatedFirstParty >= 1) {
      verdict = "PROMISING";
      verdictReason = "beperkte maar bruikbare first-party yield";
    }

    return {
      familyId,
      familyLabel,
      queriesTested,
      organicRows,
      candidateBrands,
      validatedFirstParty,
      economicQualified,
      designGapScreened,
      highGapBrands,
      firstPartyYield,
      economicYield,
      designGapYield,
      verdict,
      verdictReason,
    };
  });
}

export function recommendProductionFamilies(rows: FamilyYieldRow[]): string[] {
  const ranked = [...rows]
    .filter((row) => row.verdict === "STRONG" || row.verdict === "PROMISING")
    .sort((a, b) => {
      const scoreA = a.highGapBrands * 100 + a.economicQualified * 10 + a.validatedFirstParty;
      const scoreB = b.highGapBrands * 100 + b.economicQualified * 10 + b.validatedFirstParty;
      return scoreB - scoreA;
    });

  return ranked.slice(0, 3).map((row) => row.familyId);
}
