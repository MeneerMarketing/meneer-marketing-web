/**
 * Milestone 9.4 — company_scale_fit_score.
 *
 * Both ends of the scale are wrong for us. A hobby shop cannot pay for the
 * work and has nothing to protect; a national chain does not need it and will
 * never hand over one product page. The score peaks in the middle.
 *
 * Selling in several countries is explicitly not a retailer signal. That was
 * the M9.3.3 mistake: it excluded exactly the specialist brands we want.
 */

import { COMPANY_SCALE } from "../../config/highTicketProspect.js";

export interface CompanyScaleInput {
  businessType: string | null;
  isEcommerce: boolean | null;
  retailerScaleScore: number | null;
  retailerBreadthScore: number | null;
  businessMaturityScore: number | null;
  internationalPresenceScore: number | null;
  estimatedCatalogSize: number | null;
  homepageProductLinks: number;
  ownBrandSignal: number | null;
}

export interface CompanyScaleResult {
  companyScaleFitScore: number;
  band: "AMATEUR" | "SMALL_SPECIALIST" | "MID_BRAND" | "LARGE_RETAILER" | "UNKNOWN";
  evidence: string[];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function computeCompanyScaleFit(input: CompanyScaleInput): CompanyScaleResult {
  const evidence: string[] = [];
  const type = (input.businessType ?? "").toUpperCase();

  if (type === "MARKETPLACE" || type === "COMPARISON_SITE" || type === "GENERAL_RETAILER") {
    return {
      companyScaleFitScore: 5,
      band: "LARGE_RETAILER",
      evidence: [`business type ${type}`],
    };
  }

  let score = 68;

  const scale = input.retailerScaleScore;
  if (scale != null && scale >= COMPANY_SCALE.largeRetailerScale) {
    score -= Math.min(45, (scale - COMPANY_SCALE.largeRetailerScale) * 1.4 + 15);
    evidence.push(`retailschaal ${scale}: te groot voor deze opdracht`);
  } else if (scale != null && scale <= 20) {
    score += 8;
    evidence.push("geen ketensignalen");
  }

  const breadth = input.retailerBreadthScore;
  if (breadth != null && breadth >= COMPANY_SCALE.chainBreadthLimit) {
    score -= Math.min(28, (breadth - COMPANY_SCALE.chainBreadthLimit) * 0.9 + 8);
    evidence.push(`assortimentsbreedte ${breadth}: eerder retailer dan merk`);
  }

  const maturity = input.businessMaturityScore;
  if (maturity != null) {
    if (maturity < COMPANY_SCALE.amateurMaturity) {
      score -= 26;
      evidence.push(`volwassenheid ${maturity}: te klein om mee te werken`);
    } else if (maturity >= COMPANY_SCALE.matureBusiness && (scale ?? 0) >= 40) {
      score -= 14;
      evidence.push(`volwassen speler (${maturity}) met retailschaal ${scale}`);
    } else if (maturity >= 45) {
      score += 10;
      evidence.push(`serieuze business (volwassenheid ${maturity})`);
    }
  }

  // A webshop whose homepage barely links to products is usually unfinished.
  if (input.isEcommerce !== false && input.homepageProductLinks < COMPANY_SCALE.minHomepageProductLinks) {
    score -= 12;
    evidence.push("homepage toont nauwelijks producten");
  }

  const catalog = input.estimatedCatalogSize;
  if (catalog != null && catalog >= 400) {
    score -= 18;
    evidence.push(`${catalog} producten: catalogusshop`);
  } else if (catalog != null && catalog >= 3 && catalog <= 100) {
    score += 8;
    evidence.push(`${catalog} producten: overzichtelijk merk`);
  }

  const ownBrand = input.ownBrandSignal;
  if (ownBrand != null && ownBrand >= 60) {
    score += 8;
    evidence.push(`eigen merk (${ownBrand})`);
  }

  // International reach is scale, not breadth. It never counts against a brand.
  const international = input.internationalPresenceScore;
  if (international != null && international >= 60 && (breadth ?? 0) < COMPANY_SCALE.chainBreadthLimit) {
    evidence.push("internationaal actief, maar smal assortiment: blijft specialist");
  }

  const finalScore = clamp(score);
  const band: CompanyScaleResult["band"] =
    input.businessType == null && maturity == null
      ? "UNKNOWN"
      : finalScore >= 72
        ? "SMALL_SPECIALIST"
        : finalScore >= 55
          ? "MID_BRAND"
          : maturity != null && maturity < COMPANY_SCALE.amateurMaturity
            ? "AMATEUR"
            : "LARGE_RETAILER";

  return { companyScaleFitScore: finalScore, band, evidence };
}
