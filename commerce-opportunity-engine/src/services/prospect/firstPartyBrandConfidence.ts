/**
 * Milestone 9.6 — first_party_brand_confidence (0-100).
 */

import type { LightBrandCheckResult } from "./lightBrandCheck.js";

export function computeFirstPartyBrandConfidence(input: {
  light: LightBrandCheckResult | null;
  ownBrandSignal: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  domain: string;
}): { score: number; evidence: string[] } {
  const evidence: string[] = [];
  let score = 35;

  if (!input.light || input.light.crawlStatus !== "success") {
    return { score: 20, evidence: ["homepage_niet_leesbaar"] };
  }

  const light = input.light;
  if (light.isEcommerce) {
    score += 12;
    evidence.push("ecommerce_aanwezig");
  }

  const type = (light.businessType ?? "").toUpperCase();
  if (type === "BRAND") {
    score += 18;
    evidence.push("business_type_brand");
  } else if (type === "SPECIALIST_WEBSHOP") {
    score += 10;
    evidence.push("specialist_webshop");
  } else if (type === "GENERAL_RETAILER" || type === "MARKETPLACE") {
    score -= 25;
    evidence.push(`reseller_type_${type}`);
  }

  const own = input.ownBrandSignal ?? light.ownBrandSignal;
  if (own >= 70) {
    score += 20;
    evidence.push(`own_brand_${own}`);
  } else if (own >= 55) {
    score += 12;
  } else if (own < 40) {
    score -= 10;
    evidence.push("weinig_eigen_merk_signaal");
  }

  if (light.ownBrandEvidence.length > 0) {
    score += 6;
    evidence.push(...light.ownBrandEvidence.slice(0, 2));
  }

  if (light.title && light.title.toLowerCase().includes(input.domain.split(".")[0].replace(/^www\./, ""))) {
    score += 8;
    evidence.push("domain_title_match");
  }

  if (input.catalogVerified && (input.catalogFocusScore ?? 0) >= 60) {
    score += 10;
    evidence.push("focused_catalog");
  }

  if (input.estimatedCatalogSize != null && input.estimatedCatalogSize <= 80) {
    score += 6;
    evidence.push("compact_catalog");
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), evidence };
}
