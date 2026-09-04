/**
 * Milestone 9.8.1 — page_entity_type for PDP integrity.
 */

import { isUsableHeroUrl } from "../idealProspect/newProspectPreselection.js";
import { extractContentPresentationSignals } from "./contentPresentationGap.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";

export type PageEntityType =
  | "PRODUCT_DETAIL"
  | "CATEGORY"
  | "COLLECTION"
  | "OTHER_COMMERCE"
  | "INVALID";

export type PageEntityRejectReason =
  | "CATEGORY"
  | "COLLECTION"
  | "SEARCH_RESULT"
  | "BRAND_OVERVIEW"
  | "PRODUCT_LISTING"
  | "CONFIGURATOR_OVERVIEW"
  | "SERVICE"
  | "FORM"
  | "CHECKOUT_LINK"
  | "INVALID"
  | null;

const CATEGORY_PATH =
  /\/product-categorie\/|\/product-categor|\/categor(?:y|ie)\/|\/shop\/[a-z0-9-]+$/i;
const COLLECTION_PATH = /\/collections?\/|\/collectie\//i;
const BRAND_OVERVIEW_PATH = /\/merken\/|\/brands\/|\/brand\//i;
const LISTING_PATH =
  /\/koopgids\/|\/gids\/|\/overzicht\/|\/producten\/[^/]+\/[^/]+\/?$/i;
const SEARCH_PATH = /\/search\?|\/zoeken|\/zoekresultaat/i;
const SERVICE_PATH = /\/contact|\/showroom|\/dealer|\/service/i;
const FORM_PATH = /\/offerte|\/informatie-aanvragen|\/appointment/i;
const CHECKOUT_PATH = /betaalverzoek|betaallink|\/checkout|\/cart$/i;

const PLURAL_CATEGORY_TITLES =
  /^(waterflossers|tandenborstels|mondverzorging|elektrische tandenborstels|sonicare|compressie|recovery|massage guns?|waterflosser kopen)/i;

function countDistinctPrices(html: string): number {
  const matches = html.match(/€\s?\d{1,3}(?:[.,]\d{2})?|\d{1,3}(?:[.,]\d{2})\s?€/gi) ?? [];
  const normalized = new Set(matches.map((m) => m.replace(/\s/g, "")));
  return normalized.size;
}

function countProductCardSignals(html: string): number {
  const productLinks = (html.match(/\/products?\/|\/producten\/[^"'\s]+/gi) ?? []).length;
  const jsonLdProducts = (html.match(/"@type"\s*:\s*"Product"/gi) ?? []).length;
  return Math.max(productLinks, jsonLdProducts);
}

export function classifyPageEntityFromUrl(productUrl: string, domain: string): {
  pageEntityType: PageEntityType;
  rejectReason: PageEntityRejectReason;
  evidence: string[];
} {
  const evidence: string[] = [];
  try {
    const path = new URL(productUrl).pathname.toLowerCase();

    if (CHECKOUT_PATH.test(path)) {
      return { pageEntityType: "INVALID", rejectReason: "CHECKOUT_LINK", evidence: ["checkout_path"] };
    }
    if (SEARCH_PATH.test(path)) {
      return { pageEntityType: "INVALID", rejectReason: "SEARCH_RESULT", evidence: ["search_path"] };
    }
    if (COLLECTION_PATH.test(path)) {
      return { pageEntityType: "COLLECTION", rejectReason: "COLLECTION", evidence: ["collection_path"] };
    }
    if (BRAND_OVERVIEW_PATH.test(path)) {
      return { pageEntityType: "CATEGORY", rejectReason: "BRAND_OVERVIEW", evidence: ["brand_overview_path"] };
    }
    if (CATEGORY_PATH.test(path) || /\/product-categorie\//i.test(path)) {
      return { pageEntityType: "CATEGORY", rejectReason: "CATEGORY", evidence: ["category_path"] };
    }
    if (LISTING_PATH.test(path)) {
      return {
        pageEntityType: "CATEGORY",
        rejectReason: "PRODUCT_LISTING",
        evidence: ["listing_or_guide_path"],
      };
    }
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] ?? "";
    if (
      segments.length <= 2 &&
      /waterflossers?$/i.test(lastSegment)
    ) {
      return {
        pageEntityType: "CATEGORY",
        rejectReason: "CATEGORY",
        evidence: ["plural_category_slug"],
      };
    }
    if (SERVICE_PATH.test(path)) {
      return { pageEntityType: "INVALID", rejectReason: "SERVICE", evidence: ["service_path"] };
    }
    if (FORM_PATH.test(path)) {
      return { pageEntityType: "INVALID", rejectReason: "FORM", evidence: ["form_path"] };
    }

    if (isUsableHeroUrl(productUrl, domain)) {
      evidence.push("product_url_shape");
      return { pageEntityType: "PRODUCT_DETAIL", rejectReason: null, evidence };
    }

    if (path.split("/").filter(Boolean).length >= 2) {
      return { pageEntityType: "OTHER_COMMERCE", rejectReason: null, evidence: ["commerce_path_unclear"] };
    }

    return { pageEntityType: "INVALID", rejectReason: "INVALID", evidence: ["thin_path"] };
  } catch {
    return { pageEntityType: "INVALID", rejectReason: "INVALID", evidence: ["bad_url"] };
  }
}

export function classifyPageEntity(input: {
  productUrl: string;
  domain: string;
  html?: string | null;
  productTitle?: string | null;
  observedPrice?: number | null;
}): {
  pageEntityType: PageEntityType;
  rejectReason: PageEntityRejectReason;
  isValidProductDetail: boolean;
  evidence: string[];
} {
  const urlResult = classifyPageEntityFromUrl(input.productUrl, input.domain);
  const evidence = [...urlResult.evidence];

  if (urlResult.rejectReason) {
    return {
      pageEntityType: urlResult.pageEntityType,
      rejectReason: urlResult.rejectReason,
      isValidProductDetail: false,
      evidence,
    };
  }

  if (!input.html || input.html.length < 200) {
    const isDetail = urlResult.pageEntityType === "PRODUCT_DETAIL";
    return {
      pageEntityType: urlResult.pageEntityType,
      rejectReason: isDetail ? null : "INVALID",
      isValidProductDetail: isDetail,
      evidence: [...evidence, "url_only_classification"],
    };
  }

  const html = input.html;
  const signals = extractPageSignals(html, input.productUrl);
  const content = extractContentPresentationSignals(html);
  const priceCount = countDistinctPrices(html);
  const productCards = countProductCardSignals(html);
  const jsonLdCount = signals.jsonLdProducts.length;
  const title = (input.productTitle ?? signals.title ?? "").trim();

  let categoryProfile = 0;
  if (productCards >= 4) {
    categoryProfile += 2;
    evidence.push("multiple_product_card_signals");
  }
  if (priceCount >= 3) {
    categoryProfile += 2;
    evidence.push("multiple_distinct_prices");
  }
  if (jsonLdCount > 1) {
    categoryProfile += 2;
    evidence.push("multiple_json_ld_products");
  }
  if (PLURAL_CATEGORY_TITLES.test(title) && !isUsableHeroUrl(input.productUrl, input.domain)) {
    categoryProfile += 2;
    evidence.push("plural_category_title");
  }
  if (content.imageCount >= 6 && productCards >= 3 && priceCount >= 2) {
    categoryProfile += 1;
    evidence.push("listing_visual_density");
  }

  // Waterpik-style regression: multi-product grid without single-product identity
  if (categoryProfile >= 4) {
    return {
      pageEntityType: "CATEGORY",
      rejectReason: "CATEGORY",
      isValidProductDetail: false,
      evidence: [...evidence, "category_listing_profile"],
    };
  }

  if (productCards >= 6 && priceCount >= 3) {
    return {
      pageEntityType: "CATEGORY",
      rejectReason: "PRODUCT_LISTING",
      isValidProductDetail: false,
      evidence: [...evidence, "product_listing_profile"],
    };
  }

  const hasSingleProductEvidence =
    isUsableHeroUrl(input.productUrl, input.domain) ||
    (jsonLdCount === 1 && signals.jsonLdProducts[0]?.name) ||
    (input.observedPrice != null && input.observedPrice >= 15 && productCards <= 3);

  if (!hasSingleProductEvidence) {
    return {
      pageEntityType: "OTHER_COMMERCE",
      rejectReason: "INVALID",
      isValidProductDetail: false,
      evidence: [...evidence, "no_single_product_evidence"],
    };
  }

  evidence.push("single_product_evidence");
  return {
    pageEntityType: "PRODUCT_DETAIL",
    rejectReason: null,
    isValidProductDetail: true,
    evidence,
  };
}
