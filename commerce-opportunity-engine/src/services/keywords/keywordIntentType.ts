import { normalizeKeyword } from "./normalizeKeyword.js";
import { findMatchingToken } from "./retailerNameDetector.js";

export type KeywordIntentType =
  | "NON_BRANDED_PRODUCT"
  | "PRODUCT_BRANDED"
  | "RETAILER_BRANDED"
  | "BRAND_NAVIGATIONAL"
  | "REVIEW_RESEARCH"
  | "INFORMATIONAL"
  | "SERVICE"
  | "OTHER";

export interface KeywordIntentTypeResult {
  type: KeywordIntentType;
  confidence: number;
  reason: string;
}

const REVIEW_TOKENS = ["review", "reviews", "ervaring", "ervaringen", "test", "vergelijking"];
const INFO_TOKENS = ["wat is", "hoe werkt", "betekenis", "waarom", "symptomen", "wiki"];
const SERVICE_TOKENS = ["afspraak", "behandeling", "kliniek", "salon", "therapie sessie"];
const PRODUCT_HINTS = [
  "serum",
  "masker",
  "creme",
  "crème",
  "olie",
  "shampoo",
  "reiniger",
  "apparaat",
  "patch",
  "patches",
  "lamp",
  "matras",
  "kussen",
  "deken",
];

export function classifyKeywordIntentType(input: {
  keyword: string;
  retailerTokens: Set<string>;
  productBrandTokens: Set<string>;
}): KeywordIntentTypeResult {
  const normalized = normalizeKeyword(input.keyword);
  const tokens = normalized.split(" ").filter(Boolean);

  const retailerHit = findMatchingToken(normalized, input.retailerTokens);
  if (retailerHit) {
    return {
      type: "RETAILER_BRANDED",
      confidence: 92,
      reason: `retailer_token:${retailerHit}`,
    };
  }

  if (INFO_TOKENS.some((p) => normalized.includes(p)) || tokens[0] === "wat" || tokens[0] === "waarom") {
    return {
      type: "INFORMATIONAL",
      confidence: 88,
      reason: "informational_pattern",
    };
  }

  if (SERVICE_TOKENS.some((p) => normalized.includes(p))) {
    return {
      type: "SERVICE",
      confidence: 80,
      reason: "service_pattern",
    };
  }

  if (REVIEW_TOKENS.some((t) => tokens.includes(t) || normalized.includes(` ${t}`))) {
    return {
      type: "REVIEW_RESEARCH",
      confidence: 86,
      reason: "review_research_modifier",
    };
  }

  const brandHit = findMatchingToken(normalized, input.productBrandTokens);
  const hasProductHint = PRODUCT_HINTS.some((h) => tokens.includes(h) || normalized.includes(h));

  if (brandHit && hasProductHint) {
    return {
      type: "PRODUCT_BRANDED",
      confidence: 90,
      reason: `product_brand:${brandHit}`,
    };
  }

  if (brandHit && tokens.length <= 2) {
    return {
      type: "BRAND_NAVIGATIONAL",
      confidence: 78,
      reason: `brand_navigational:${brandHit}`,
    };
  }

  if (brandHit) {
    return {
      type: "PRODUCT_BRANDED",
      confidence: 75,
      reason: `brand_token:${brandHit}`,
    };
  }

  if (hasProductHint || tokens.length >= 2) {
    return {
      type: "NON_BRANDED_PRODUCT",
      confidence: hasProductHint ? 88 : 70,
      reason: hasProductHint ? "non_branded_product_tokens" : "generic_multi_token_productish",
    };
  }

  return {
    type: "OTHER",
    confidence: 50,
    reason: "unclassified",
  };
}
