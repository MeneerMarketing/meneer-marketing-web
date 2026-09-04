/**
 * Milestone 9.6.1 — brand_first_opportunity_score_v2 with purchase mode.
 */

import { gapScoreBand } from "../../config/designGapWideScreen.js";
import { catalogBandForBrandFirst } from "../../config/brandFirstHighTicket.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import { purchaseModeScore } from "./purchaseModeDetector.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";

export type BrandFirstOpportunityV2Input = {
  brandScaleFit: number | null;
  firstPartyConfidence: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  ownBrandSignal: number | null;
  heroPrice: number | null;
  heroConfidence: number | null;
  purchaseMode: PurchaseMode;
  productStoryPotential: number | null;
  assetContentAvailability: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentPresentationQuality: number | null;
  paidAcquisitionLevel: PaidAcquisitionLevel;
};

export type BrandFirstOpportunityV2Result = {
  brandFirstOpportunityScoreV2: number;
  components: {
    brandQuality: number;
    companyScaleFit: number;
    catalogFocus: number;
    ownBrand: number;
    heroEconomics: number;
    purchaseModeFit: number;
    assetContentAvailability: number;
    visualGap: number;
    purchaseGap: number;
    mobileGap: number;
    paidEvidenceBonus: number;
  };
  sweetSpotProfile: "IDEAL" | "STRONG_BUSINESS_WEAK_GAP" | "STRONG_GAP_WEAK_BUSINESS" | "MIXED";
  evidence: string[];
};

function norm(v: number | null, fallback = 45): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function paidBonus(level: PaidAcquisitionLevel): number {
  if (level === "CONFIRMED") return 6;
  if (level === "LIKELY") return 3;
  if (level === "NOT_FOUND") return -3;
  return 0;
}

export function computeBrandFirstOpportunityScoreV2(
  input: BrandFirstOpportunityV2Input
): BrandFirstOpportunityV2Result {
  const brandQuality = norm(
    norm(input.firstPartyConfidence) * 0.55 + norm(input.brandScaleFit) * 0.45
  );
  const companyScaleFit = norm(input.brandScaleFit);
  const catalogFocus = norm(input.catalogFocusScore, input.catalogVerified ? 48 : 40);
  const catalogBand = catalogBandForBrandFirst(input.estimatedCatalogSize);
  const ownBrand = norm(input.ownBrandSignal);

  let heroEconomics = 38;
  const price = input.heroPrice;
  if (price != null) {
    if (price >= 150 && price <= 750) heroEconomics = 94;
    else if (price >= 120 && price <= 3000) heroEconomics = 76;
    else if (price >= 80) heroEconomics = 52;
    else heroEconomics = 24;
    if (price > 3000) heroEconomics = Math.max(20, heroEconomics - 12);
  }

  const heroConf = norm(input.heroConfidence, 50);
  heroEconomics = Math.round(heroEconomics * 0.72 + heroConf * 0.28);

  const purchaseModeFit = purchaseModeScore(input.purchaseMode);
  const assets = norm(input.assetContentAvailability);
  const visualGap = norm(input.preauditVisualGap);
  const purchaseGap = norm(input.preauditPurchaseGap);
  const mobileGap = norm(input.mobileGap);
  const presentation = norm(input.contentPresentationQuality, 55);
  const paidEvidenceBonus = paidBonus(input.paidAcquisitionLevel);

  const presentationGap = Math.max(
    0,
    Math.min(
      100,
      Math.round(visualGap * 0.42 + purchaseGap * 0.33 + mobileGap * 0.2 - presentation * 0.12)
    )
  );

  const score = Math.round(
    brandQuality * 0.13 +
      companyScaleFit * 0.09 +
      catalogFocus * 0.07 +
      catalogBand.score * 0.05 +
      ownBrand * 0.09 +
      heroEconomics * 0.11 +
      purchaseModeFit * 0.08 +
      assets * 0.09 +
      presentationGap * 0.22 +
      paidEvidenceBonus
  );

  let sweetSpotProfile: BrandFirstOpportunityV2Result["sweetSpotProfile"] = "MIXED";
  const businessHigh = brandQuality >= 68 && heroEconomics >= 62 && purchaseModeFit >= 70;
  const gapHigh =
    presentationGap >= 58 ||
    gapScoreBand(visualGap) === "HIGH" ||
    gapScoreBand(visualGap) === "VERY_HIGH" ||
    gapScoreBand(purchaseGap) === "HIGH" ||
    gapScoreBand(purchaseGap) === "VERY_HIGH";
  const presentationHigh = presentation >= 68;

  if (businessHigh && gapHigh && !presentationHigh) sweetSpotProfile = "IDEAL";
  else if (businessHigh && presentationHigh) sweetSpotProfile = "STRONG_BUSINESS_WEAK_GAP";
  else if (!businessHigh && gapHigh) sweetSpotProfile = "STRONG_GAP_WEAK_BUSINESS";

  return {
    brandFirstOpportunityScoreV2: Math.max(0, Math.min(100, score)),
    components: {
      brandQuality,
      companyScaleFit,
      catalogFocus,
      ownBrand,
      heroEconomics,
      purchaseModeFit,
      assetContentAvailability: assets,
      visualGap,
      purchaseGap,
      mobileGap,
      paidEvidenceBonus,
    },
    sweetSpotProfile,
    evidence: [`catalog_band:${catalogBand.label}`, `purchase_mode:${input.purchaseMode}`],
  };
}

export function manualReviewVerdict(input: {
  opportunityScoreV2: number | null;
  sweetSpotProfile: string | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  purchaseMode: PurchaseMode;
  presentationQuality: number | null;
}): "TRUE_MANUAL_REVIEW_CANDIDATE" | "NO_TARGET" {
  if ((input.opportunityScoreV2 ?? 0) < 52) return "NO_TARGET";
  if (input.sweetSpotProfile === "STRONG_BUSINESS_WEAK_GAP") return "NO_TARGET";
  if (input.purchaseMode === "LEAD_GENERATION" || input.purchaseMode === "SHOWROOM_ASSISTED") {
    return "NO_TARGET";
  }
  const visualBand = gapScoreBand(input.preauditVisualGap);
  const purchaseBand = gapScoreBand(input.preauditPurchaseGap);
  if (visualBand === "LOW" && purchaseBand === "LOW" && (input.presentationQuality ?? 0) >= 65) {
    return "NO_TARGET";
  }
  return "TRUE_MANUAL_REVIEW_CANDIDATE";
}
