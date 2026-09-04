/**
 * Milestone 9.9.5 — generic pre-vision business classification.
 */

import { MARKETPLACE_DOMAIN_PATTERNS } from "../../config/prospectExclusion.js";
import {
  KNOWN_MARKETPLACE_DOMAIN_TOKENS,
} from "../../config/preVisionIntegrity.js";
import { classifyDiscoveryDomain } from "./discoveryEntityGate.js";
import { isMassRetailerDomain } from "./pdpCandidateGate.js";
import type { BusinessModelClass } from "./businessModelClassifier.js";

export type PreVisionBusinessType =
  | "MARKETPLACE"
  | "MASS_RETAILER"
  | "GENERAL_RETAILER"
  | "GENERAL_RESELLER"
  | "DIRECT_BRAND_OR_SPECIALIST"
  | "UNKNOWN";

export type PreVisionConfidence = "HIGH" | "MEDIUM" | "LOW";

const MARKETPLACE_HTML_PATTERNS = [
  /\bmarketplace\b/i,
  /\bverkoper\b/i,
  /\bseller\b/i,
  /\bmerchant\b/i,
  /\bthird[- ]party\b/i,
  /\bmeerdere verkopers\b/i,
  /\bshop from\b/i,
  /\bverkocht door\b/i,
  /\bsold by\b/i,
  /"@type"\s*:\s*"Product"[^}]*"offers"[^}]*"seller"/i,
  /"@type"\s*:\s*"Organization"[^}]*"Marketplace"/i,
];

const MARKETPLACE_URL_PATTERNS = [
  /\/seller\//i,
  /\/merchants?\//i,
  /\/marketplace\//i,
  /\/stores?\//i,
];

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/^www\./, "");
}

function domainMatchesTokens(domain: string, tokens: readonly string[]): boolean {
  return tokens.some((token) => {
    if (token.endsWith(".")) return domain.includes(token);
    return domain === token || domain.endsWith(`.${token}`);
  });
}

function scoreMarketplaceSignals(input: {
  domain: string;
  html: string | null;
  productUrl: string | null;
}): { score: number; evidence: string[] } {
  const evidence: string[] = [];
  let score = 0;
  const domain = normalizeDomain(input.domain);

  if (domainMatchesTokens(domain, KNOWN_MARKETPLACE_DOMAIN_TOKENS)) {
    score += 0.85;
    evidence.push("known_marketplace_domain");
  }
  if (domainMatchesTokens(domain, MARKETPLACE_DOMAIN_PATTERNS)) {
    score += 0.75;
    evidence.push("marketplace_domain_pattern");
  }

  const gate = classifyDiscoveryDomain(domain);
  if (gate.entityClass === "MARKETPLACE_BLACKLIST") {
    score += 0.9;
    evidence.push("marketplace_blacklist_gate");
  }

  const html = input.html ?? "";
  if (html.length > 200) {
    for (const pattern of MARKETPLACE_HTML_PATTERNS) {
      if (pattern.test(html)) {
        score += 0.12;
        evidence.push(`html_${pattern.source.slice(0, 24)}`);
      }
    }
    const sellerHits = (html.match(/\b(verkoper|seller|merchant)\b/gi) ?? []).length;
    if (sellerHits >= 4) {
      score += 0.25;
      evidence.push("multi_seller_language");
    }
  }

  const url = input.productUrl ?? "";
  for (const pattern of MARKETPLACE_URL_PATTERNS) {
    if (pattern.test(url)) {
      score += 0.15;
      evidence.push("marketplace_url_shape");
    }
  }

  return { score: Math.min(score, 1), evidence };
}

function scoreGeneralRetailer(input: {
  domain: string;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  retailerScaleScore: number | null;
}): { score: number; evidence: string[] } {
  const evidence: string[] = [];
  let score = 0;
  const domain = normalizeDomain(input.domain);

  if (isMassRetailerDomain(domain)) {
    score += 0.85;
    evidence.push("mass_retailer_domain");
  }

  const catalog = input.catalogEstimate;
  const focus = input.catalogFocus ?? 50;
  const scale = input.retailerScaleScore ?? 0;

  if (catalog != null && catalog >= 400 && focus <= 25) {
    score += 0.45;
    evidence.push("very_broad_catalog");
  }
  if (scale >= 72) {
    score += 0.2;
    evidence.push("high_retailer_scale");
  }

  return { score: Math.min(score, 1), evidence };
}

function scoreGeneralReseller(input: {
  reportedBusinessModel: BusinessModelClass | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  ownBrandSignal: number | null;
}): { score: number; evidence: string[] } {
  const evidence: string[] = [];
  let score = 0;

  if (input.reportedBusinessModel === "GENERAL_RESELLER") {
    score += 0.7;
    evidence.push("reported_general_reseller");
  }
  if (input.reportedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
    score += 0.35;
    evidence.push("reported_specialist_reseller");
  }

  const catalog = input.catalogEstimate;
  const focus = input.catalogFocus ?? 50;
  const own = input.ownBrandSignal ?? 50;

  if (catalog != null && catalog >= 180 && focus <= 20) {
    score += 0.35;
    evidence.push("broad_reseller_catalog");
  }
  if (own < 45 && catalog != null && catalog >= 120) {
    score += 0.2;
    evidence.push("low_own_brand_broad_catalog");
  }

  return { score: Math.min(score, 1), evidence };
}

export function classifyPreVisionBusiness(input: {
  domain: string;
  html?: string | null;
  productUrl?: string | null;
  reportedBusinessModel?: BusinessModelClass | null;
  catalogEstimate?: number | null;
  catalogFocus?: number | null;
  retailerScaleScore?: number | null;
  ownBrandSignal?: number | null;
}): {
  businessType: PreVisionBusinessType;
  confidence: PreVisionConfidence;
  hardRejectBeforeVision: boolean;
  evidence: string[];
} {
  const marketplace = scoreMarketplaceSignals({
    domain: input.domain,
    html: input.html ?? null,
    productUrl: input.productUrl ?? null,
  });
  const retailer = scoreGeneralRetailer({
    domain: input.domain,
    catalogEstimate: input.catalogEstimate ?? null,
    catalogFocus: input.catalogFocus ?? null,
    retailerScaleScore: input.retailerScaleScore ?? null,
  });
  const reseller = scoreGeneralReseller({
    reportedBusinessModel: input.reportedBusinessModel ?? null,
    catalogEstimate: input.catalogEstimate ?? null,
    catalogFocus: input.catalogFocus ?? null,
    ownBrandSignal: input.ownBrandSignal ?? null,
  });

  const scores: Array<{ type: PreVisionBusinessType; score: number; evidence: string[] }> = [
    { type: "MARKETPLACE", score: marketplace.score, evidence: marketplace.evidence },
    { type: "MASS_RETAILER", score: retailer.score >= 0.75 ? retailer.score : 0, evidence: retailer.evidence },
    {
      type: "GENERAL_RETAILER",
      score: retailer.score >= 0.45 && retailer.score < 0.75 ? retailer.score : retailer.score >= 0.45 ? retailer.score * 0.85 : 0,
      evidence: retailer.evidence,
    },
    { type: "GENERAL_RESELLER", score: reseller.score, evidence: reseller.evidence },
  ];

  const best = scores.sort((a, b) => b.score - a.score)[0];
  const domain = normalizeDomain(input.domain);

  if (isMassRetailerDomain(domain) && best.type !== "MARKETPLACE") {
    return {
      businessType: "MASS_RETAILER",
      confidence: "HIGH",
      hardRejectBeforeVision: true,
      evidence: ["mass_retailer_domain_override", ...retailer.evidence],
    };
  }

  if (best.score < 0.42) {
    return {
      businessType: "DIRECT_BRAND_OR_SPECIALIST",
      confidence: "MEDIUM",
      hardRejectBeforeVision: false,
      evidence: ["no_strong_retail_marketplace_signal"],
    };
  }

  if (best.type === "MARKETPLACE" && best.score >= 0.55) {
    return {
      businessType: "MARKETPLACE",
      confidence: best.score >= 0.75 ? "HIGH" : "MEDIUM",
      hardRejectBeforeVision: true,
      evidence: best.evidence,
    };
  }

  if (best.type === "MASS_RETAILER" && best.score >= 0.7) {
    return {
      businessType: "MASS_RETAILER",
      confidence: "HIGH",
      hardRejectBeforeVision: true,
      evidence: best.evidence,
    };
  }

  if (best.type === "GENERAL_RETAILER" && best.score >= 0.5) {
    return {
      businessType: "GENERAL_RETAILER",
      confidence: best.score >= 0.7 ? "HIGH" : "MEDIUM",
      hardRejectBeforeVision: true,
      evidence: best.evidence,
    };
  }

  if (best.type === "GENERAL_RESELLER" && best.score >= 0.65) {
    return {
      businessType: "GENERAL_RESELLER",
      confidence: best.score >= 0.8 ? "HIGH" : "MEDIUM",
      hardRejectBeforeVision: true,
      evidence: best.evidence,
    };
  }

  if (best.score >= 0.42) {
    return {
      businessType: best.type,
      confidence: "LOW",
      hardRejectBeforeVision: false,
      evidence: best.evidence,
    };
  }

  return {
    businessType: "UNKNOWN",
    confidence: "LOW",
    hardRejectBeforeVision: false,
    evidence: ["insufficient_classification_signal"],
  };
}

/** Backward-compatible gate used by M9.9.4 harvest path. */
export function evaluatePreVisionHardReject(input: {
  domain: string;
  html?: string | null;
  productUrl?: string | null;
  reportedBusinessModel?: BusinessModelClass | null;
  catalogEstimate?: number | null;
  catalogFocus?: number | null;
}): { rejected: boolean; reason: PreVisionBusinessType | null; evidence: string[] } {
  const cls = classifyPreVisionBusiness(input);
  if (!cls.hardRejectBeforeVision) {
    return { rejected: false, reason: null, evidence: cls.evidence };
  }
  return {
    rejected: true,
    reason: cls.businessType,
    evidence: cls.evidence,
  };
}
