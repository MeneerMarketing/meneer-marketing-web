/**
 * Milestone 9.3 — ideal prospect pre-score and proxy fits (pre-Claude).
 */

import {
  IDEAL_CATALOG_SWEET_SPOT,
  IDEAL_OWN_BRAND_SCORES,
  IDEAL_PLATFORM_SCORES,
  IDEAL_PRE_SCORE_WEIGHTS,
} from "../../config/idealProspectProfile.js";
import { scoreConceptAssetReadiness } from "../concept/assetReadiness.js";
import type { BrandCommerceModel } from "../../config/conceptScoring.js";

export type IdealProspectScoreInput = {
  confirmedGoogleAdvertiser: boolean;
  paidConfirmed: boolean;
  transparencyConfirmed: boolean;
  platform: string | null;
  brandCommerceModel: BrandCommerceModel | string;
  catalogFocusScore: number | null;
  estimatedProductCount: number | null;
  heroProductScore: number | null;
  productCommercialSignalScore: number | null;
  primaryProductPrice: number | null;
  productDescriptionLength: number;
  businessMaturityScore: number | null;
  retailerScaleScore: number | null;
  pdpWeaknessProxy: number;
  imageCount: number | null;
  reviewCount: number | null;
  rating: number | null;
  benefitsRichnessHint: boolean;
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function num(v: number | null | undefined, fallback = 0): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return v;
}

export function scoreCatalogSweetSpotIdeal(estimatedProducts: number | null): {
  score: number;
  label: string;
} {
  if (estimatedProducts == null) return { score: 50, label: "unknown" };
  for (const band of IDEAL_CATALOG_SWEET_SPOT) {
    if (estimatedProducts >= band.min && estimatedProducts <= band.max) {
      return { score: band.score, label: band.label };
    }
  }
  return { score: 12, label: "huge" };
}

export function scoreDeepDiveFitProxy(input: IdealProspectScoreInput): {
  score: number;
  evidence: string[];
} {
  const evidence: string[] = [];
  let score = 38;

  const catalogSweet = scoreCatalogSweetSpotIdeal(input.estimatedProductCount);
  score += Math.round(catalogSweet.score * 0.2);
  evidence.push(`catalog_sweet:${catalogSweet.label}`);

  score += Math.round(num(input.catalogFocusScore) * 0.14);
  score += Math.round(num(input.heroProductScore) * 0.14);
  score += Math.round(num(input.productCommercialSignalScore) * 0.12);

  if (input.productDescriptionLength >= 200) {
    score += 10;
    evidence.push("rich_source_content");
  } else if (input.productDescriptionLength < 80) {
    score -= 12;
    evidence.push("thin_content");
  }

  if (input.benefitsRichnessHint) {
    score += 8;
    evidence.push("benefits_story_possible");
  }

  const price = input.primaryProductPrice;
  if (price != null && price >= 75) {
    score += 10;
    evidence.push("hero_price_consideration");
  } else if (price != null && price >= 35) {
    score += 5;
  } else if (price != null && price < 15) {
    score -= 14;
    evidence.push("commodity_price");
  }

  const model = String(input.brandCommerceModel);
  if (model === "DTC_OWN_BRAND" || model === "MOSTLY_OWN_BRAND") {
    score += 10;
    evidence.push("own_brand_story");
  } else if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
    score -= 25;
    evidence.push("reseller_penalty");
  }

  score += Math.round(input.pdpWeaknessProxy * 0.12);
  if (input.pdpWeaknessProxy >= 60) evidence.push("current_pdp_underexplained");

  return { score: clamp(score), evidence };
}

export function scoreAssetReadinessProxy(input: IdealProspectScoreInput): number {
  const assets = scoreConceptAssetReadiness({
    productTitle: "product",
    price: input.primaryProductPrice,
    descriptionLength: input.productDescriptionLength,
    reviewCount: input.reviewCount,
    rating: input.rating,
    hasLogo: null,
    brandColorsDetected: null,
    imageCount: input.imageCount,
    highResImagesLikely: input.imageCount != null ? input.imageCount >= 4 : null,
    lifestyleImageryLikely: input.imageCount != null ? input.imageCount >= 3 : null,
    benefitsPresent: input.benefitsRichnessHint ? true : null,
    featuresPresent: input.productDescriptionLength >= 120 ? true : null,
    faqPresent: null,
    deliveryReturnsPresent: null,
    specsPresent: null,
    videoPresent: null,
    beforeAfterPresent: null,
    hasScreenshots: false,
  });
  return assets.concept_asset_readiness_score;
}

export function scoreGoogleAdsSignalIdeal(input: IdealProspectScoreInput): number {
  if (input.confirmedGoogleAdvertiser && input.paidConfirmed) return 95;
  if (input.confirmedGoogleAdvertiser) return 88;
  if (input.transparencyConfirmed) return 78;
  if (input.paidConfirmed) return 68;
  return 18;
}

export function computeIdealProspectPreScore(input: IdealProspectScoreInput): {
  ideal_prospect_pre_score: number;
  components: Record<string, number>;
  evidence: string[];
} {
  const w = IDEAL_PRE_SCORE_WEIGHTS;
  const catalogSweet = scoreCatalogSweetSpotIdeal(input.estimatedProductCount);
  const deepDive = scoreDeepDiveFitProxy(input);
  const assetProxy = scoreAssetReadinessProxy(input);
  const googleAds = scoreGoogleAdsSignalIdeal(input);

  const platform =
    IDEAL_PLATFORM_SCORES[(input.platform ?? "UNKNOWN").toUpperCase()] ??
    IDEAL_PLATFORM_SCORES.UNKNOWN;
  const ownBrand =
    IDEAL_OWN_BRAND_SCORES[String(input.brandCommerceModel)] ??
    IDEAL_OWN_BRAND_SCORES.UNKNOWN;

  let retailerPenalty = 0;
  if ((input.retailerScaleScore ?? 0) >= 75) retailerPenalty = 28;
  else if ((input.retailerScaleScore ?? 0) >= 65) retailerPenalty = 16;
  else if ((input.retailerScaleScore ?? 0) >= 55) retailerPenalty = 8;

  const components = {
    googleAdsSignal: googleAds,
    platform: platform,
    ownBrandModel: ownBrand,
    catalogFocus: num(input.catalogFocusScore),
    catalogSweetSpot: catalogSweet.score,
    heroProduct: num(input.heroProductScore),
    deepDiveFitProxy: deepDive.score,
    assetReadinessProxy: assetProxy,
    pdpWeaknessProxy: input.pdpWeaknessProxy,
    businessMaturity: num(input.businessMaturityScore),
    retailerScalePenalty: retailerPenalty,
  };

  let score =
    components.googleAdsSignal * w.googleAdsSignal +
    components.platform * w.platform +
    components.ownBrandModel * w.ownBrandModel +
    components.catalogFocus * w.catalogFocus +
    components.catalogSweetSpot * w.catalogSweetSpot +
    components.heroProduct * w.heroProduct +
    components.deepDiveFitProxy * w.deepDiveFitProxy +
    components.assetReadinessProxy * w.assetReadinessProxy +
    components.pdpWeaknessProxy * w.pdpWeaknessProxy +
    components.businessMaturity * w.businessMaturity;

  score -= components.retailerScalePenalty * w.retailerScalePenalty;
  score = clamp(score);

  return {
    ideal_prospect_pre_score: score,
    components,
    evidence: [
      ...deepDive.evidence,
      `catalog_sweet:${catalogSweet.label}`,
      `asset_proxy:${assetProxy}`,
    ],
  };
}
