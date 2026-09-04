/**
 * Milestone 9.6 — brand_first_opportunity_score with separate components.
 */

import { gapScoreBand } from "../../config/designGapWideScreen.js";
import { catalogBandForBrandFirst } from "../../config/brandFirstHighTicket.js";

export type BrandFirstOpportunityInput = {
  brandScaleFit: number | null;
  firstPartyConfidence: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  ownBrandSignal: number | null;
  heroPrice: number | null;
  heroConfidence: number | null;
  productStoryPotential: number | null;
  assetContentAvailability: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentPresentationQuality: number | null;
  paidAcquisitionBonus: number;
};

export type BrandFirstOpportunityResult = {
  brandFirstOpportunityScore: number;
  components: {
    brandQuality: number;
    companyScaleFit: number;
    catalogFocus: number;
    ownBrand: number;
    heroEconomics: number;
    productStoryPotential: number;
    assetContentAvailability: number;
    presentationGap: number;
    purchaseGap: number;
    mobileGap: number;
  };
  sweetSpotProfile: "IDEAL" | "STRONG_BUSINESS_WEAK_GAP" | "STRONG_GAP_WEAK_BUSINESS" | "MIXED";
  evidence: string[];
};

function norm(v: number | null, fallback = 45): number {
  if (v == null || !Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function computeBrandFirstOpportunityScore(
  input: BrandFirstOpportunityInput
): BrandFirstOpportunityResult {
  const brandQuality = norm(
    (norm(input.firstPartyConfidence) * 0.55 + norm(input.brandScaleFit) * 0.45)
  );
  const companyScaleFit = norm(input.brandScaleFit);
  const catalogFocus = norm(input.catalogFocusScore, input.catalogVerified ? 48 : 40);
  const catalogBand = catalogBandForBrandFirst(input.estimatedCatalogSize);
  const ownBrand = norm(input.ownBrandSignal);

  let heroEconomics = 40;
  const price = input.heroPrice;
  if (price != null) {
    if (price >= 150 && price <= 750) heroEconomics = 95;
    else if (price >= 100) heroEconomics = 78;
    else if (price >= 60) heroEconomics = 52;
    else heroEconomics = 28;
  }

  const heroConf = norm(input.heroConfidence, 50);
  heroEconomics = Math.round((heroEconomics * 0.75 + heroConf * 0.25));

  const productStory = norm(input.productStoryPotential);
  const assets = norm(input.assetContentAvailability);
  const visualGap = norm(input.preauditVisualGap);
  const purchaseGap = norm(input.preauditPurchaseGap);
  const mobileGap = norm(input.mobileGap);
  const presentation = norm(input.contentPresentationQuality, 55);

  const presentationGap = Math.max(
    0,
    Math.min(100, Math.round((visualGap * 0.45 + purchaseGap * 0.35 + mobileGap * 0.2) - presentation * 0.15))
  );

  const score = Math.round(
    brandQuality * 0.14 +
      companyScaleFit * 0.1 +
      catalogFocus * 0.08 +
      catalogBand.score * 0.06 +
      ownBrand * 0.1 +
      heroEconomics * 0.12 +
      productStory * 0.1 +
      assets * 0.1 +
      presentationGap * 0.2 +
      input.paidAcquisitionBonus
  );

  let sweetSpotProfile: BrandFirstOpportunityResult["sweetSpotProfile"] = "MIXED";
  const businessHigh = brandQuality >= 68 && heroEconomics >= 65;
  const gapHigh = presentationGap >= 60 || gapScoreBand(visualGap) === "HIGH" || gapScoreBand(visualGap) === "VERY_HIGH";
  const presentationHigh = presentation >= 68;

  if (businessHigh && gapHigh && !presentationHigh) sweetSpotProfile = "IDEAL";
  else if (businessHigh && presentationHigh) sweetSpotProfile = "STRONG_BUSINESS_WEAK_GAP";
  else if (!businessHigh && gapHigh) sweetSpotProfile = "STRONG_GAP_WEAK_BUSINESS";

  return {
    brandFirstOpportunityScore: Math.max(0, Math.min(100, score)),
    components: {
      brandQuality,
      companyScaleFit,
      catalogFocus,
      ownBrand,
      heroEconomics,
      productStoryPotential: productStory,
      assetContentAvailability: assets,
      presentationGap,
      purchaseGap,
      mobileGap,
    },
    sweetSpotProfile,
    evidence: [`catalog_band:${catalogBand.label}`, `sweet_spot:${sweetSpotProfile}`],
  };
}
