/**
 * Milestone 9.2 — Outreach concept fit scoring.
 * Optimizes for "where does a redesign preview create convincing contrast?"
 */

import {
  CATALOG_SWEET_SPOT_BANDS,
  CRO_EXCEPTIONAL_THRESHOLD,
  CRO_STRONG_THRESHOLD,
  OUTREACH_FIT_WEIGHTS,
  OUTREACH_GATE_THRESHOLDS,
  OUTREACH_PENALTIES,
  OWN_BRAND_FIT_SCORES,
  PLATFORM_FIT_SCORES,
} from "../../config/outreachScoring.js";
import type { BrandCommerceModel } from "../../config/conceptScoring.js";
import {
  croAlreadyStrongPenaltyFromQuality,
} from "./currentPdpQuality.js";
import {
  computeConceptContrastPotential,
  type ConceptContrastResult,
} from "./conceptContrastPotential.js";

export type CroDataSource = "AUDITED" | "PROXY" | "MISSING";

export type OutreachScoringInput = {
  domain: string;
  brandCommerceModel: BrandCommerceModel | string;
  platform: string | null;
  businessMaturityScore: number | null;
  retailerScaleScore: number | null;
  confirmedGoogleAdvertiser: boolean;
  paidConfirmed: boolean;
  transparencyConfirmed: boolean;
  exactPaidFunnelLikely: boolean;
  pdpTransformationPotential: number | null;
  conceptAssetReadinessScore: number | null;
  catalogFocusScore: number | null;
  estimatedProductCount: number | null;
  estimatedBrandCount: number | null;
  heroProductScore: number | null;
  productCommercialSignalScore: number | null;
  primaryProductPrice: number | null;
  croQualityComposite: number | null;
  currentPdpQualityScore: number | null;
  croDataSource: CroDataSource;
  auditConfidence: number | null;
  productStorytellingQuality: number | null;
  aboveFoldQuality: number | null;
  productPresentationQuality: number | null;
  trustNearBuyblockQuality: number | null;
  /** M9.3.4 — how premium the current page already looks and reads. */
  visualDesignQuality: number | null;
  deepDiveQuality: number | null;
  /** M9.3.4 — the purchase moment and the phone, the two loudest before/after surfaces. */
  buyblockQuality?: number | null;
  mobilePurchaseQuality?: number | null;
  conversionLeakCount: number;
  strengthCount: number;
  siteTechnicallyBroken: boolean;
  mmFitScore: number | null;
  reviewCount: number | null;
  rating: number | null;
  productDescriptionLength: number;
  benefitsRichnessHint: boolean;
};

export type OutreachComponentScores = {
  pdpTransformation: number;
  currentPdpWeakness: number;
  conceptContrast: number;
  conceptAssetReadiness: number;
  catalogFocus: number;
  catalogSweetSpot: number;
  ownBrandFit: number;
  heroProductQuality: number;
  commercialSignal: number;
  googleAdsConfirmation: number;
  businessMaturity: number;
  platformFit: number;
  projectEconomicFit: number;
  deepDivePdpFit: number;
};

export type OutreachPenaltyBreakdown = {
  croAlreadyStrong: number;
  hugeCatalog: number;
  generalRetailer: number;
  resellerHeavy: number;
  weakAssets: number;
  tinyBusiness: number;
  technicalFailure: number;
  lowProductValue: number;
  decentPdpWithoutAudit: number;
  total: number;
};

export type OutreachScoringResult = {
  outreachConceptFitScore: number;
  engineeringScore: number;
  outreachScoreConfidence: number;
  croDataSource: CroDataSource;
  components: OutreachComponentScores;
  penalties: OutreachPenaltyBreakdown;
  contrast: ConceptContrastResult;
  evidence: string[];
  formula: string;
};

/** M9.3.4 — the before/after question, answered from whatever we already know. */
export function scoreConceptContrast(input: OutreachScoringInput): ConceptContrastResult {
  return computeConceptContrastPotential({
    currentPdpQuality: input.currentPdpQualityScore,
    croQualityComposite: input.croQualityComposite,
    croDataSource: input.croDataSource,
    auditConfidence: input.auditConfidence,
    visualDesignQuality: input.visualDesignQuality,
    productStorytellingQuality: input.productStorytellingQuality,
    productPresentationQuality: input.productPresentationQuality,
    deepDiveQuality: input.deepDiveQuality,
    buyblockQuality: input.buyblockQuality ?? input.trustNearBuyblockQuality ?? null,
    mobilePurchaseQuality: input.mobilePurchaseQuality ?? null,
    conceptAssetReadiness: input.conceptAssetReadinessScore,
    productCommercialSignal: input.productCommercialSignalScore,
    catalogFocus: input.catalogFocusScore,
    businessMaturity: input.businessMaturityScore,
    brandCommerceModel: String(input.brandCommerceModel),
    productDescriptionLength: input.productDescriptionLength,
    reviewCount: input.reviewCount,
    siteTechnicallyBroken: input.siteTechnicallyBroken,
  });
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function num(v: number | null | undefined, fallback = 0): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return v;
}

export function scoreCatalogSweetSpot(estimatedProducts: number | null): {
  score: number;
  label: string;
} {
  if (estimatedProducts == null) {
    return { score: 50, label: "unknown_catalog_size" };
  }
  for (const band of CATALOG_SWEET_SPOT_BANDS) {
    if (estimatedProducts >= band.min && estimatedProducts <= band.max) {
      return { score: band.score, label: band.label };
    }
  }
  return { score: 18, label: "huge_catalog" };
}

export function scoreCurrentPdpWeakness(input: OutreachScoringInput): number {
  if (input.croDataSource === "AUDITED" && input.currentPdpQualityScore != null) {
    return clamp(100 - input.currentPdpQualityScore);
  }
  if (input.croQualityComposite != null) {
    return clamp(100 - input.croQualityComposite);
  }
  let score = 55;
  if (input.aboveFoldQuality != null && input.aboveFoldQuality < 55) score += 12;
  if (input.productStorytellingQuality != null && input.productStorytellingQuality < 55) {
    score += 10;
  }
  if (input.productPresentationQuality != null && input.productPresentationQuality < 60) {
    score += 10;
  }
  if (input.trustNearBuyblockQuality != null && input.trustNearBuyblockQuality < 55) {
    score += 8;
  }
  score += Math.min(12, input.conversionLeakCount * 3);
  score -= Math.min(10, input.strengthCount * 2);
  return clamp(score);
}

export function scoreCroAlreadyStrongPenalty(
  croComposite: number | null,
  currentPdpQuality: number | null,
  croDataSource: CroDataSource
): number {
  if (croDataSource === "AUDITED" && currentPdpQuality != null) {
    return croAlreadyStrongPenaltyFromQuality(currentPdpQuality);
  }
  if (croComposite == null) return 0;
  if (croComposite >= CRO_EXCEPTIONAL_THRESHOLD) {
    return OUTREACH_PENALTIES.croAlreadyStrongMax;
  }
  if (croComposite >= CRO_STRONG_THRESHOLD) {
    const ramp =
      ((croComposite - CRO_STRONG_THRESHOLD) /
        (CRO_EXCEPTIONAL_THRESHOLD - CRO_STRONG_THRESHOLD)) *
      OUTREACH_PENALTIES.croAlreadyStrongMax;
    return clamp(ramp, 0, OUTREACH_PENALTIES.croAlreadyStrongMax);
  }
  if (croComposite >= 60) {
    return clamp(((croComposite - 60) / 12) * 8, 0, 8);
  }
  return 0;
}

export function scoreDeepDivePdpFit(input: OutreachScoringInput): {
  score: number;
  evidence: string[];
} {
  const evidence: string[] = [];
  let score = 42;

  const catalogSweet = scoreCatalogSweetSpot(input.estimatedProductCount);
  score += Math.round(catalogSweet.score * 0.22);
  evidence.push(`catalog_sweet_spot:${catalogSweet.label}`);

  score += Math.round(num(input.catalogFocusScore) * 0.14);
  score += Math.round(num(input.heroProductScore) * 0.12);
  score += Math.round(num(input.productCommercialSignalScore) * 0.1);
  score += Math.round(num(input.conceptAssetReadinessScore) * 0.12);

  const weakness = scoreCurrentPdpWeakness(input);
  score += Math.round(weakness * 0.16);
  if (weakness >= 60) evidence.push("current_pdp_underutilized");

  if (input.productDescriptionLength >= 200) {
    score += 8;
    evidence.push("rich_source_content");
  } else if (input.productDescriptionLength < 80) {
    score -= 10;
    evidence.push("thin_product_content");
  }

  if (input.benefitsRichnessHint) {
    score += 6;
    evidence.push("benefits_storytelling_possible");
  }

  const model = String(input.brandCommerceModel);
  if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
    score -= 28;
    evidence.push("reseller_catalog_penalty");
  } else if (model === "DTC_OWN_BRAND" || model === "MOSTLY_OWN_BRAND") {
    score += 8;
    evidence.push("own_brand_story_fit");
  }

  if (input.croDataSource === "AUDITED" && input.currentPdpQualityScore != null) {
    if (input.currentPdpQualityScore >= CRO_STRONG_THRESHOLD) {
      score -= 18;
      evidence.push("current_pdp_audited_strong");
    }
  } else if (input.croQualityComposite != null && input.croQualityComposite >= CRO_STRONG_THRESHOLD) {
    score -= 18;
    evidence.push("current_pdp_already_strong");
  }

  return { score: clamp(score), evidence };
}

export function scoreProjectEconomicFit(input: OutreachScoringInput): {
  score: number;
  evidence: string[];
} {
  const evidence: string[] = [];
  let score = 28;

  const price = input.primaryProductPrice;
  if (price != null) {
    if (price >= 75 && price <= 500) {
      score += 24;
      evidence.push("hero_price_band_strong");
    } else if (price >= 30) {
      score += 14;
      evidence.push("hero_price_band_moderate");
    } else if (price >= 15) {
      score += 6;
      evidence.push("hero_price_low");
    } else {
      score += 2;
      evidence.push("hero_price_commodity_risk");
    }
  }

  score += Math.round(num(input.businessMaturityScore) * 0.18);
  score += Math.round(num(input.catalogFocusScore) * 0.1);
  score += Math.round(num(input.productCommercialSignalScore) * 0.1);
  score += Math.round(num(input.heroProductScore) * 0.08);

  const ownBrand =
    OWN_BRAND_FIT_SCORES[String(input.brandCommerceModel)] ?? OWN_BRAND_FIT_SCORES.UNKNOWN;
  score += Math.round(ownBrand * 0.1);

  if (input.confirmedGoogleAdvertiser || input.paidConfirmed) {
    score += 10;
    evidence.push("paid_acquisition_signal");
  }
  if (input.exactPaidFunnelLikely) {
    score += 6;
    evidence.push("exact_paid_funnel_bonus");
  }

  const platform =
    PLATFORM_FIT_SCORES[(input.platform ?? "UNKNOWN").toUpperCase()] ??
    PLATFORM_FIT_SCORES.UNKNOWN;
  score += Math.round(platform * 0.06);

  if (input.reviewCount != null && input.reviewCount > 20) {
    score += Math.min(8, Math.round(Math.log10(input.reviewCount + 1) * 4));
    evidence.push(`social_proof:${input.reviewCount}`);
  }

  if (num(input.mmFitScore) < 35) {
    score -= 12;
    evidence.push("low_mm_fit");
  }

  return { score: clamp(score), evidence };
}

export function scoreGoogleAdsConfirmation(input: OutreachScoringInput): number {
  if (input.confirmedGoogleAdvertiser && input.exactPaidFunnelLikely) return 95;
  if (input.confirmedGoogleAdvertiser && input.paidConfirmed) return 88;
  if (input.confirmedGoogleAdvertiser || input.transparencyConfirmed) return 78;
  if (input.paidConfirmed) return 65;
  return 22;
}

function computePenalties(input: OutreachScoringInput): OutreachPenaltyBreakdown {
  const croAlreadyStrong = scoreCroAlreadyStrongPenalty(
    input.croQualityComposite,
    input.currentPdpQualityScore,
    input.croDataSource
  );

  let hugeCatalog = 0;
  if ((input.estimatedProductCount ?? 0) >= 500) {
    hugeCatalog = OUTREACH_PENALTIES.hugeCatalogMax;
  } else if ((input.estimatedProductCount ?? 0) >= 150) {
    hugeCatalog = Math.round(OUTREACH_PENALTIES.hugeCatalogMax * 0.55);
  }

  let generalRetailer = 0;
  const model = String(input.brandCommerceModel);
  if (model === "GENERAL_RESELLER") generalRetailer = OUTREACH_PENALTIES.generalRetailerMax;
  else if (model === "MARKETPLACE") generalRetailer = OUTREACH_PENALTIES.generalRetailerMax;

  let resellerHeavy = 0;
  if ((input.estimatedBrandCount ?? 0) >= 20) {
    resellerHeavy = OUTREACH_PENALTIES.resellerHeavyMax;
  } else if ((input.estimatedBrandCount ?? 0) >= 8) {
    resellerHeavy = Math.round(OUTREACH_PENALTIES.resellerHeavyMax * 0.5);
  }

  let weakAssets = 0;
  if (num(input.conceptAssetReadinessScore) < 45) {
    weakAssets = OUTREACH_PENALTIES.weakAssetsMax;
  } else if (num(input.conceptAssetReadinessScore) < OUTREACH_GATE_THRESHOLDS.minAssetReadiness) {
    weakAssets = Math.round(OUTREACH_PENALTIES.weakAssetsMax * 0.45);
  }

  let tinyBusiness = 0;
  if (num(input.businessMaturityScore) < 30) {
    tinyBusiness = OUTREACH_PENALTIES.tinyBusinessMax;
  } else if (num(input.businessMaturityScore) < 40) {
    tinyBusiness = Math.round(OUTREACH_PENALTIES.tinyBusinessMax * 0.5);
  }

  const technicalFailure = input.siteTechnicallyBroken
    ? OUTREACH_PENALTIES.technicalFailureMax
    : 0;

  let lowProductValue = 0;
  if (input.primaryProductPrice != null && input.primaryProductPrice < 12) {
    lowProductValue = OUTREACH_PENALTIES.lowProductValueMax;
  } else if (input.primaryProductPrice != null && input.primaryProductPrice < 20) {
    lowProductValue = Math.round(OUTREACH_PENALTIES.lowProductValueMax * 0.5);
  }

  let decentPdpWithoutAudit = 0;
  if (
    input.croDataSource !== "AUDITED" &&
    input.croQualityComposite == null &&
    num(input.pdpTransformationPotential) < 68 &&
    num(input.conceptAssetReadinessScore) >= 70 &&
    num(input.catalogFocusScore) >= 78
  ) {
    decentPdpWithoutAudit = OUTREACH_PENALTIES.decentPdpWithoutAuditMax;
  }

  const total =
    croAlreadyStrong +
    hugeCatalog +
    generalRetailer +
    resellerHeavy +
    weakAssets +
    tinyBusiness +
    technicalFailure +
    lowProductValue +
    decentPdpWithoutAudit;

  return {
    croAlreadyStrong,
    hugeCatalog,
    generalRetailer,
    resellerHeavy,
    weakAssets,
    tinyBusiness,
    technicalFailure,
    lowProductValue,
    decentPdpWithoutAudit,
    total,
  };
}

export function computeOutreachScoreConfidence(input: OutreachScoringInput): number {
  if (input.croDataSource === "AUDITED") {
    const auditPart = num(input.auditConfidence, 70);
    const qualityKnown = input.currentPdpQualityScore != null ? 12 : 0;
    return clamp(auditPart * 0.85 + qualityKnown + 8);
  }
  if (input.croDataSource === "PROXY") {
    let c = 42;
    if (input.croQualityComposite != null) c += 12;
    if (num(input.conceptAssetReadinessScore) >= 60) c += 8;
    return clamp(c);
  }
  return 28;
}

export function scoreOutreachConceptFit(
  input: OutreachScoringInput,
  engineeringScore: number
): OutreachScoringResult {
  const evidence: string[] = [];
  const catalogSweet = scoreCatalogSweetSpot(input.estimatedProductCount);

  const deepDive = scoreDeepDivePdpFit(input);
  evidence.push(...deepDive.evidence);

  const projectEconomic = scoreProjectEconomicFit(input);
  evidence.push(...projectEconomic.evidence);

  const contrast = scoreConceptContrast(input);
  evidence.push(`concept_contrast:${contrast.concept_contrast_potential}:${contrast.band}`);
  if (contrast.ceilingApplied) {
    evidence.push(`contrast_ceiling:${contrast.ceilingApplied}`);
  }

  const components: OutreachComponentScores = {
    pdpTransformation: clamp(num(input.pdpTransformationPotential, 40)),
    currentPdpWeakness: scoreCurrentPdpWeakness(input),
    conceptContrast: contrast.concept_contrast_potential,
    conceptAssetReadiness: clamp(num(input.conceptAssetReadinessScore)),
    catalogFocus: clamp(num(input.catalogFocusScore)),
    catalogSweetSpot: catalogSweet.score,
    ownBrandFit:
      OWN_BRAND_FIT_SCORES[String(input.brandCommerceModel)] ?? OWN_BRAND_FIT_SCORES.UNKNOWN,
    heroProductQuality: clamp(num(input.heroProductScore)),
    commercialSignal: clamp(num(input.productCommercialSignalScore)),
    googleAdsConfirmation: scoreGoogleAdsConfirmation(input),
    businessMaturity: clamp(num(input.businessMaturityScore, 40)),
    platformFit:
      PLATFORM_FIT_SCORES[(input.platform ?? "UNKNOWN").toUpperCase()] ??
      PLATFORM_FIT_SCORES.UNKNOWN,
    projectEconomicFit: projectEconomic.score,
    deepDivePdpFit: deepDive.score,
  };

  const w = OUTREACH_FIT_WEIGHTS;
  const weighted =
    components.pdpTransformation * w.pdpTransformation +
    components.currentPdpWeakness * w.currentPdpWeakness +
    components.conceptContrast * w.conceptContrast +
    components.conceptAssetReadiness * w.conceptAssetReadiness +
    components.catalogFocus * w.catalogFocus +
    components.catalogSweetSpot * w.catalogSweetSpot +
    components.ownBrandFit * w.ownBrandFit +
    components.heroProductQuality * w.heroProductQuality +
    components.commercialSignal * w.commercialSignal +
    components.googleAdsConfirmation * w.googleAdsConfirmation +
    components.businessMaturity * w.businessMaturity +
    components.platformFit * w.platformFit +
    components.projectEconomicFit * w.projectEconomicFit;

  const penalties = computePenalties(input);
  const outreachConceptFitScore = clamp(weighted - penalties.total);
  const outreachScoreConfidence = computeOutreachScoreConfidence(input);

  if (penalties.croAlreadyStrong > 0) {
    evidence.push(`cro_already_strong_penalty:${penalties.croAlreadyStrong}`);
  }
  evidence.push(`cro_data_source:${input.croDataSource}`);

  return {
    outreachConceptFitScore,
    engineeringScore,
    outreachScoreConfidence,
    croDataSource: input.croDataSource,
    components,
    penalties,
    contrast,
    evidence,
    formula:
      "weighted(OUTREACH_FIT_WEIGHTS) - penalties; confidence from audit coverage",
  };
}
