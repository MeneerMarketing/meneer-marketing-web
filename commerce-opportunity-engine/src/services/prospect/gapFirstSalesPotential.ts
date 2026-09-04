/**
 * Milestone 9.8 — business_economic_fit + gap_first_sales_potential.
 */

import { catalogBandForBrandFirst } from "../../config/brandFirstHighTicket.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
import { purchaseModeScore } from "./purchaseModeDetector.js";
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function norm(v: number | null, fallback = 45): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return clamp(v);
}

export function computeBusinessEconomicFit(input: {
  brandScaleFit: number | null;
  firstPartyConfidence: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  ownBrandSignal: number | null;
  businessMaturityScore: number | null;
  heroPrice: number | null;
  heroConfidence: number | null;
  purchaseMode: PurchaseMode;
  paidAcquisitionLevel: PaidAcquisitionLevel;
}): { score: number; evidence: string[] } {
  const evidence: string[] = [];
  const brandQuality = norm(
    norm(input.firstPartyConfidence) * 0.55 + norm(input.brandScaleFit) * 0.45
  );
  const catalogFocus = norm(input.catalogFocusScore, input.catalogVerified ? 48 : 40);
  const catalogBand = catalogBandForBrandFirst(input.estimatedCatalogSize);
  const ownBrand = norm(input.ownBrandSignal);
  const maturity = norm(input.businessMaturityScore, 52);

  let heroEconomics = 38;
  const price = input.heroPrice;
  if (price != null) {
    if (price >= 150 && price <= 750) heroEconomics = 94;
    else if (price >= 120 && price <= 3000) heroEconomics = 76;
    else if (price >= 80) heroEconomics = 52;
    else heroEconomics = 24;
    if (price > 3000) heroEconomics = Math.max(20, heroEconomics - 12);
  }
  heroEconomics = Math.round(heroEconomics * 0.72 + norm(input.heroConfidence, 50) * 0.28);

  const purchaseFit = purchaseModeScore(input.purchaseMode);
  let paidBonus = 0;
  if (input.paidAcquisitionLevel === "CONFIRMED") paidBonus = 6;
  else if (input.paidAcquisitionLevel === "LIKELY") paidBonus = 3;

  const score = clamp(
    brandQuality * 0.22 +
      norm(input.brandScaleFit) * 0.16 +
      catalogFocus * 0.12 +
      catalogBand.score * 0.1 +
      ownBrand * 0.14 +
      maturity * 0.08 +
      heroEconomics * 0.18 +
      purchaseFit * 0.06 +
      paidBonus
  );

  if (catalogBand.label === "sweet_spot") evidence.push("catalog_sweet_spot");
  if (ownBrand >= 65) evidence.push("own_brand_strong");

  return { score, evidence };
}

export function computeMaterialQualityScore(input: {
  contentAvailableScore: number | null;
  assetQualityProxy: number | null;
  contentPresentationQuality: number | null;
  materialSweetSpot: boolean;
}): number {
  const available = norm(input.contentAvailableScore);
  const assets = norm(input.assetQualityProxy);
  const presentation = norm(input.contentPresentationQuality, 55);
  let score = available * 0.45 + assets * 0.35 + (100 - presentation) * 0.2;
  if (input.materialSweetSpot) score += 8;
  return clamp(score);
}

export function computeGapFirstSalesPotential(input: {
  rawPdpRedesignOpportunity: number;
  materialQualityScore: number;
  businessEconomicFit: number;
  heroEconomicsComponent: number;
}): { score: number; confidence: "HIGH" | "MEDIUM" | "LOW"; profile: string } {
  const gap = input.rawPdpRedesignOpportunity;
  const material = input.materialQualityScore;
  const business = input.businessEconomicFit;
  const economics = input.heroEconomicsComponent;

  const score = clamp(gap * 0.34 + material * 0.22 + business * 0.26 + economics * 0.18);

  const allSufficient =
    gap >= 58 && material >= 55 && business >= 58 && economics >= 55;
  const weakBusiness = business < 45 || economics < 40;
  const strongBusinessWeakGap = gap < 45 && business >= 70;

  let profile = "MIXED";
  if (allSufficient) profile = "IDEAL_GAP_FIRST";
  else if (strongBusinessWeakGap) profile = "STRONG_BUSINESS_WEAK_GAP";
  else if (gap >= 65 && weakBusiness) profile = "STRONG_GAP_WEAK_BUSINESS";

  let confidence: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (allSufficient && score >= 72) confidence = "HIGH";
  else if (score >= 58 && gap >= 55) confidence = "MEDIUM";

  return { score, confidence, profile };
}

export function manualReviewVerdictM98(input: {
  gapFirstSalesPotential: number;
  rawPdpRedesignOpportunity: number;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  materialQualityScore: number;
  businessEconomicFit: number;
  purchaseMode: PurchaseMode;
  profile: string;
}): string {
  if (input.profile === "STRONG_BUSINESS_WEAK_GAP") return "NO_TARGET";
  if (input.purchaseMode === "LEAD_GENERATION" || input.purchaseMode === "SHOWROOM_ASSISTED") {
    return "NO_TARGET";
  }
  if (input.rawPdpRedesignOpportunity < 52) return "NO_TARGET";
  if (input.materialQualityScore < 40) return "NO_TARGET";
  if (input.gapFirstSalesPotential >= 62 && input.rawPdpRedesignOpportunity >= 58) {
    return "TRUE_MANUAL_REVIEW_CANDIDATE";
  }
  if (input.gapFirstSalesPotential >= 54) return "PROMISING";
  return "NO_TARGET";
}
