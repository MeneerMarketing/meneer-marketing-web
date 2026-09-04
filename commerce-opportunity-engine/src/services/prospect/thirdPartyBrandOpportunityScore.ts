/**
 * Milestone 9.7 — third_party_brand_opportunity_score
 */

import { gapScoreBand } from "../../config/designGapWideScreen.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
import { purchaseModeScore } from "./purchaseModeDetector.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";

export type ThirdPartyOpportunityInput = {
  brandMarketPresenceScore: number;
  independentSourceCount: number;
  firstPartyConfidence: number;
  officialDomainConfidence: number;
  brandScaleFit: number;
  catalogFocusScore: number | null;
  ownBrandSignal: number | null;
  heroPrice: number | null;
  heroConfidence: number | null;
  purchaseMode: PurchaseMode;
  thirdPartyStoryPotential: number;
  assetContentAvailability: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentPresentationQuality: number | null;
  paidAcquisitionLevel: PaidAcquisitionLevel;
};

function norm(v: number | null, fallback = 45): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function paidBonus(level: PaidAcquisitionLevel): number {
  if (level === "CONFIRMED") return 6;
  if (level === "LIKELY") return 3;
  if (level === "NOT_FOUND") return -2;
  return 0;
}

export function computeThirdPartyBrandOpportunityScore(
  input: ThirdPartyOpportunityInput
): {
  thirdPartyBrandOpportunityScore: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  components: Record<string, number>;
} {
  const marketPresence = norm(input.brandMarketPresenceScore);
  const firstParty = norm(
    (norm(input.firstPartyConfidence) * 0.6 + norm(input.officialDomainConfidence) * 0.4)
  );
  const scaleFit = norm(input.brandScaleFit);
  const catalogFocus = norm(input.catalogFocusScore);
  const ownBrand = norm(input.ownBrandSignal);
  const story = norm(input.thirdPartyStoryPotential);
  const assets = norm(input.assetContentAvailability);
  const purchaseFit = purchaseModeScore(input.purchaseMode);

  let heroEconomics = 40;
  const price = input.heroPrice;
  if (price != null) {
    if (price >= 150 && price <= 750) heroEconomics = 92;
    else if (price >= 100) heroEconomics = 74;
    else if (price >= 60) heroEconomics = 48;
  }
  heroEconomics = Math.round(heroEconomics * 0.75 + norm(input.heroConfidence, 50) * 0.25);

  const visualGap = norm(input.preauditVisualGap);
  const purchaseGap = norm(input.preauditPurchaseGap);
  const mobileGap = norm(input.mobileGap);
  const presentation = norm(input.contentPresentationQuality, 55);
  const presentationGap = Math.max(
    0,
    Math.min(
      100,
      Math.round(visualGap * 0.42 + purchaseGap * 0.33 + mobileGap * 0.2 - presentation * 0.1)
    )
  );

  const independentBoost = Math.min(10, input.independentSourceCount * 2);

  const score = Math.round(
    marketPresence * 0.1 +
      firstParty * 0.12 +
      scaleFit * 0.08 +
      catalogFocus * 0.06 +
      ownBrand * 0.07 +
      heroEconomics * 0.1 +
      purchaseFit * 0.07 +
      story * 0.08 +
      assets * 0.08 +
      presentationGap * 0.22 +
      independentBoost +
      paidBonus(input.paidAcquisitionLevel)
  );

  const finalScore = Math.max(0, Math.min(100, score));
  let confidence: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (firstParty >= 70 && input.independentSourceCount >= 2) confidence = "MEDIUM";
  if (
    firstParty >= 75 &&
    presentationGap >= 50 &&
    gapScoreBand(visualGap) !== "LOW"
  ) {
    confidence = "HIGH";
  }

  return {
    thirdPartyBrandOpportunityScore: finalScore,
    confidence,
    components: {
      marketPresence,
      firstParty,
      scaleFit,
      catalogFocus,
      ownBrand,
      heroEconomics,
      purchaseFit,
      story,
      assets,
      presentationGap,
      visualGap,
      purchaseGap,
      mobileGap,
    },
  };
}

export function manualReviewVerdictM97(input: {
  opportunityScore: number;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  presentationQuality: number | null;
  purchaseMode: PurchaseMode;
  independentSourceCount: number;
}): "TRUE_MANUAL_REVIEW_CANDIDATE" | "NO_TARGET" {
  if (input.opportunityScore < 54) return "NO_TARGET";
  if (input.purchaseMode === "LEAD_GENERATION" || input.purchaseMode === "SHOWROOM_ASSISTED") {
    return "NO_TARGET";
  }
  if (input.independentSourceCount < 2) return "NO_TARGET";
  const visualBand = gapScoreBand(input.preauditVisualGap);
  const purchaseBand = gapScoreBand(input.preauditPurchaseGap);
  if (
    visualBand === "LOW" &&
    purchaseBand === "LOW" &&
    (input.presentationQuality ?? 0) >= 68
  ) {
    return "NO_TARGET";
  }
  if (visualBand === "LOW" && purchaseBand === "LOW") return "NO_TARGET";
  return "TRUE_MANUAL_REVIEW_CANDIDATE";
}
