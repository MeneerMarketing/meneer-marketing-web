/**
 * Milestone 9.5.1 — preview_case_potential_v2.
 *
 * Visual gap stays visible even when catalog/own-brand/maturity are unknown.
 * Confidence is reported separately from the score.
 */

export type FieldConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export type PreviewCaseV2Input = {
  rawDesignGapOpportunity: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  highTicketFocusedFit: number | null;
  companyScaleFit: number | null;
  businessMaturity: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  ownBrandSignal: number | null;
  heroPrice: number | null;
  heroPriceConfidence: FieldConfidence;
  assetReadinessProxy: number | null;
  contentAvailableScore: number | null;
  adKeywordCount: number;
  businessType: string | null;
};

export type PreviewCaseV2Result = {
  economicFitScore: number;
  previewCasePotentialV2: number;
  overallConfidence: FieldConfidence;
  confidenceFactors: Record<string, FieldConfidence>;
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function norm(value: number | null, fallback = 48): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return clamp(value);
}

function confidenceFromVerified(verified: boolean, score: number | null): FieldConfidence {
  if (!verified || score == null) return "UNKNOWN";
  return score >= 70 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW";
}

export function computePreviewCasePotentialV2(input: PreviewCaseV2Input): PreviewCaseV2Result {
  const gap = norm(input.rawDesignGapOpportunity, 45);
  const visual = norm(input.preauditVisualGap, 45);
  const purchase = norm(input.preauditPurchaseGap, 45);

  const catalogConf = input.catalogVerified
    ? confidenceFromVerified(true, input.catalogFocusScore)
    : "UNKNOWN";
  const ownBrandConf =
    input.ownBrandSignal != null
      ? input.ownBrandSignal >= 65
        ? "HIGH"
        : input.ownBrandSignal >= 45
          ? "MEDIUM"
          : "LOW"
      : "UNKNOWN";
  const maturityConf =
    input.businessMaturity != null
      ? input.businessMaturity >= 60
        ? "HIGH"
        : input.businessMaturity >= 40
          ? "MEDIUM"
          : "LOW"
      : "UNKNOWN";

  const catalogSizeScore =
    input.estimatedCatalogSize != null
      ? input.estimatedCatalogSize <= 50
        ? 88
        : input.estimatedCatalogSize <= 100
          ? 72
          : input.estimatedCatalogSize <= 200
            ? 52
            : 28
      : 50;

  const economicFit = clamp(
    norm(input.highTicketFocusedFit, 50) * 0.32 +
      norm(input.companyScaleFit, 50) * 0.18 +
      norm(input.ownBrandSignal, 48) * 0.16 +
      norm(input.catalogFocusScore, 48) * 0.12 +
      catalogSizeScore * 0.1 +
      norm(input.businessMaturity, 48) * 0.08 +
      norm(input.assetReadinessProxy, 48) * 0.14
  );

  let heroEconomics = 45;
  if (input.heroPrice != null) {
    if (input.heroPrice >= 500) heroEconomics = 95;
    else if (input.heroPrice >= 150) heroEconomics = 88;
    else if (input.heroPrice >= 100) heroEconomics = 78;
    else if (input.heroPrice >= 80) heroEconomics = 65;
    else heroEconomics = 38;
  }

  const adsBoost = input.adKeywordCount >= 2 ? 8 : input.adKeywordCount >= 1 ? 4 : 0;

  const preview = clamp(
    gap * 0.38 +
      visual * 0.14 +
      purchase * 0.1 +
      economicFit * 0.28 +
      heroEconomics * 0.06 +
      adsBoost
  );

  const unknownCount = [catalogConf, ownBrandConf, maturityConf, input.heroPriceConfidence].filter(
    (entry) => entry === "UNKNOWN"
  ).length;
  const overallConfidence: FieldConfidence =
    unknownCount >= 3 ? "LOW" : unknownCount >= 2 ? "MEDIUM" : unknownCount === 1 ? "MEDIUM" : "HIGH";

  return {
    economicFitScore: economicFit,
    previewCasePotentialV2: preview,
    overallConfidence,
    confidenceFactors: {
      catalogFocus: catalogConf,
      catalogSize: input.catalogVerified ? "MEDIUM" : "UNKNOWN",
      ownBrand: ownBrandConf,
      maturity: maturityConf,
      heroPrice: input.heroPriceConfidence,
      designGap: visual >= 55 || purchase >= 55 ? "MEDIUM" : "LOW",
    },
  };
}
