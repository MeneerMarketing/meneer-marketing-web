/**
 * Milestone 9.6 — brand_scale_fit_score (0-100).
 */

import { COMPANY_SCALE } from "../../config/highTicketProspect.js";

export interface BrandScaleFitInput {
  businessType: string | null;
  isEcommerce: boolean | null;
  retailerScaleScore: number | null;
  retailerBreadthScore: number | null;
  businessMaturityScore: number | null;
  estimatedCatalogSize: number | null;
  homepageProductLinks: number;
  ownBrandSignal: number | null;
  firstPartyBrandConfidence: number | null;
}

export interface BrandScaleFitResult {
  brandScaleFitScore: number;
  band: "AMATEUR" | "SMALL_BRAND" | "MID_BRAND" | "LARGE_PLAYER" | "UNKNOWN";
  evidence: string[];
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeBrandScaleFit(input: BrandScaleFitInput): BrandScaleFitResult {
  const evidence: string[] = [];
  const type = (input.businessType ?? "").toUpperCase();

  if (
    type === "MARKETPLACE" ||
    type === "COMPARISON_SITE" ||
    type === "GENERAL_RETAILER"
  ) {
    return {
      brandScaleFitScore: 8,
      band: "LARGE_PLAYER",
      evidence: [`business type ${type}`],
    };
  }

  let score = 72;

  const scale = input.retailerScaleScore;
  if (scale != null && scale >= COMPANY_SCALE.largeRetailerScale) {
    score -= 38;
    evidence.push(`retailschaal ${scale}: te groot`);
  } else if (scale != null && scale <= 22) {
    score += 6;
    evidence.push("compacte ecommerce operatie");
  }

  const breadth = input.retailerBreadthScore;
  if (breadth != null && breadth >= COMPANY_SCALE.chainBreadthLimit) {
    score -= 22;
    evidence.push(`breed assortiment signaal ${breadth}`);
  }

  const maturity = input.businessMaturityScore;
  if (maturity != null && maturity < COMPANY_SCALE.amateurMaturity) {
    score -= 28;
    evidence.push(`volwassenheid ${maturity}: amateur signalen`);
  } else if (maturity != null && maturity >= 45) {
    score += 8;
    evidence.push(`professionele maturity ${maturity}`);
  }

  if (input.isEcommerce === false) {
    score -= 40;
    evidence.push("geen ecommerce");
  }

  if (input.homepageProductLinks < COMPANY_SCALE.minHomepageProductLinks) {
    score -= 10;
    evidence.push("weinig productlinks op homepage");
  }

  const own = input.ownBrandSignal ?? 0;
  if (own >= 65) score += 8;
  else if (own < 40) score -= 8;

  const fp = input.firstPartyBrandConfidence ?? 0;
  if (fp >= 70) score += 6;
  else if (fp < 45) score -= 10;

  const catalog = input.estimatedCatalogSize;
  if (catalog != null && catalog >= 3 && catalog <= 60) score += 8;
  else if (catalog != null && catalog > 200) score -= 12;

  score = clamp(score);

  let band: BrandScaleFitResult["band"] = "UNKNOWN";
  if (score >= 72) band = "SMALL_BRAND";
  else if (score >= 55) band = "MID_BRAND";
  else if (score >= 35) band = "AMATEUR";
  else band = "LARGE_PLAYER";

  return { brandScaleFitScore: score, band, evidence };
}
