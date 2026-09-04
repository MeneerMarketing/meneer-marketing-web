/**
 * Milestone 9.8 — early PDP harvest reject + valid PDP detection.
 */

import { evaluatePreVisionHardReject } from "./preVisionBusinessClassifier.js";
import { classifyDiscoveryDomain } from "./discoveryEntityGate.js";
import { isUsableHeroUrl } from "../idealProspect/newProspectPreselection.js";
import { M96_RETAILER_DOMAIN_HINTS } from "../../config/brandFirstHighTicket.js";
import { isBlacklistedDomain } from "../../config/blacklist.js";
import type { PdpHarvestSourceType } from "../../config/pdpGapFirstHarvest.js";
import { extractContentPresentationSignals } from "./contentPresentationGap.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { extractProductPageDetails } from "../crawler/productPageExtractor.js";
import type { ProductCandidate } from "../crawler/productPageFinder.js";

const NON_PRODUCT_PATH =
  /\/collections?\/|\/categor|\/product-categorie\/|\/blog\/|\/vergelijk|\/compare|\/search\?|\/zoeken|\/reviews?\//i;

const LEAD_ONLY_PATH =
  /\/contact|\/showroom|\/dealer|\/informatie-aanvragen|\/offerte|\/appointment/i;

const EDITORIAL_PATH = /\/artikel\/|\/nieuws\/|\/magazine\/|\/editorial\//i;

export type PdpEarlyRejectReason =
  | "marketplace_blacklist"
  | "agency_excluded"
  | "social_platform"
  | "content_platform"
  | "media_publisher"
  | "mass_retailer"
  | "non_product_url"
  | "collection_category_url"
  | "editorial_url"
  | "lead_only_url"
  | "no_url"
  | "invalid_url";

export function isMassRetailerDomain(domain: string): boolean {
  const lower = domain.toLowerCase().replace(/^www\./, "");
  return M96_RETAILER_DOMAIN_HINTS.some((hint) => lower.includes(hint)) || isBlacklistedDomain(lower);
}

export function isLikelyNonProductUrl(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (NON_PRODUCT_PATH.test(path)) return true;
    if (LEAD_ONLY_PATH.test(path)) return true;
    if (EDITORIAL_PATH.test(path)) return true;
    return false;
  } catch {
    return true;
  }
}

export function evaluatePdpHarvestEarlyReject(input: {
  normalizedDomain: string;
  productUrl: string | null;
  title: string | null;
}): { rejected: boolean; reason: PdpEarlyRejectReason | null } {
  if (!input.productUrl) {
    return { rejected: true, reason: "no_url" };
  }

  try {
    new URL(input.productUrl);
  } catch {
    return { rejected: true, reason: "invalid_url" };
  }

  const gate = classifyDiscoveryDomain(input.normalizedDomain);
  if (gate.hardExclude) {
    if (gate.entityClass === "AGENCY_EXCLUDED") return { rejected: true, reason: "agency_excluded" };
    if (gate.entityClass === "MARKETPLACE_BLACKLIST") {
      return { rejected: true, reason: "marketplace_blacklist" };
    }
    if (gate.entityClass === "SOCIAL_PLATFORM") return { rejected: true, reason: "social_platform" };
    if (gate.entityClass === "CONTENT_PLATFORM") return { rejected: true, reason: "content_platform" };
    if (gate.entityClass === "MEDIA_PUBLISHER") return { rejected: true, reason: "media_publisher" };
    return { rejected: true, reason: "marketplace_blacklist" };
  }

  if (isMassRetailerDomain(input.normalizedDomain)) {
    return { rejected: true, reason: "mass_retailer" };
  }

  if (isLikelyNonProductUrl(input.productUrl)) {
    if (/\/collections?\/|\/categor/i.test(input.productUrl)) {
      return { rejected: true, reason: "collection_category_url" };
    }
    if (EDITORIAL_PATH.test(input.productUrl)) {
      return { rejected: true, reason: "editorial_url" };
    }
    if (LEAD_ONLY_PATH.test(input.productUrl)) {
      return { rejected: true, reason: "lead_only_url" };
    }
    return { rejected: true, reason: "non_product_url" };
  }

  const titleLower = (input.title ?? "").toLowerCase();
  if (/vergelijk|beste \d+|top \d+|review roundup|kopen bij/i.test(titleLower)) {
    return { rejected: true, reason: "editorial_url" };
  }

  return { rejected: false, reason: null };
}

/** Hard exclude obvious retailer/marketplace noise before cheap vision. UNKNOWN does not fail. */
export function evaluatePreVisionBusinessNoise(
  domain: string,
  hints?: {
    html?: string | null;
    productUrl?: string | null;
    reportedBusinessModel?: import("./businessModelClassifier.js").BusinessModelClass | null;
    catalogEstimate?: number | null;
    catalogFocus?: number | null;
  }
): {
  rejected: boolean;
  reason: string | null;
} {
  const gate = evaluatePreVisionHardReject({
    domain,
    html: hints?.html ?? null,
    productUrl: hints?.productUrl ?? null,
    reportedBusinessModel: hints?.reportedBusinessModel ?? null,
    catalogEstimate: hints?.catalogEstimate ?? null,
    catalogFocus: hints?.catalogFocus ?? null,
  });
  if (gate.rejected) {
    return { rejected: true, reason: gate.reason ?? "PRE_VISION_REJECT" };
  }
  return { rejected: false, reason: null };
}

export function scorePdpUrlPlausibility(productUrl: string, domain: string): number {
  if (isUsableHeroUrl(productUrl, domain)) return 100;
  try {
    const path = new URL(productUrl).pathname.toLowerCase();
    if (/\/products?\/|\/producten\/|\/p\/|\/item\//.test(path)) return 72;
    if (path.split("/").filter(Boolean).length >= 2) return 48;
    return 20;
  } catch {
    return 0;
  }
}

export function validatePdpFromCrawl(input: {
  html: string;
  productUrl: string;
  domain: string;
}): {
  valid: boolean;
  productTitle: string | null;
  observedPrice: number | null;
  hasPurchaseCta: boolean;
  hasProductImagery: boolean;
  evidence: string[];
} {
  const signals = extractPageSignals(input.html, input.productUrl);
  const candidate: ProductCandidate = {
    url: input.productUrl,
    score: 0.75,
    source: "internal_link",
    nameHint: null,
    priceHint: null,
    currencyHint: null,
    reasons: ["harvest_url"],
  };
  const product = extractProductPageDetails({
    html: input.html,
    productUrl: input.productUrl,
    candidate,
    candidateCount: 1,
  });

  const evidence: string[] = [];
  const hasTitle = Boolean(product.productName && product.productName.length >= 3);
  const hasPrice = product.price != null && product.price >= 15;
  const hasPurchaseCta = signals.hasAddToCart || signals.paymentSignals.length > 0;
  const contentSignals = extractContentPresentationSignals(input.html);
  const hasProductImagery =
    contentSignals.imageCount >= 2 || signals.jsonLdProducts.length > 0;
  const urlPlausible = scorePdpUrlPlausibility(input.productUrl, input.domain) >= 48;
  const hasCommerceContext =
    hasPurchaseCta || hasPrice || signals.jsonLdProducts.length > 0;

  if (hasTitle) evidence.push("product_title");
  if (hasPrice) evidence.push("observed_price");
  if (hasPurchaseCta) evidence.push("purchase_cta");
  if (hasProductImagery) evidence.push("product_imagery");
  if (urlPlausible) evidence.push("product_url_shape");

  const valid =
    hasTitle &&
    urlPlausible &&
    hasCommerceContext &&
    (hasProductImagery || hasPrice) &&
  (isUsableHeroUrl(input.productUrl, input.domain) || hasPrice);

  return {
    valid,
    productTitle: product.productName,
    observedPrice: product.price,
    hasPurchaseCta,
    hasProductImagery,
    evidence,
  };
}

export function classifyHarvestSourceType(input: {
  sourceType: PdpHarvestSourceType;
  likelyRetailer: boolean;
  serpItemType?: string;
}): PdpHarvestSourceType {
  if (input.sourceType === "SHOPPING_PRODUCT_RESULT") return "SHOPPING_PRODUCT_RESULT";
  if (input.likelyRetailer) return "SPECIALIST_PRODUCT_RESULT";
  return input.sourceType;
}
