/**
 * Milestone 9.9.3 — showcase sales candidate integrity (entity, ownership, cross-domain).
 */

import * as cheerio from "cheerio";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { isUsableHeroUrl } from "../idealProspect/newProspectPreselection.js";
import { extractContentPresentationSignals } from "./contentPresentationGap.js";
import type { BusinessModelClass } from "./businessModelClassifier.js";

export type ShowcaseOwnershipClass =
  | BusinessModelClass
  | "FOCUSED_PRIVATE_LABEL_BRAND"
  | "MANUFACTURER_DTC";

export type ShowcasePageEntityType =
  | "PRODUCT_DETAIL"
  | "CATEGORY"
  | "COLLECTION"
  | "PRODUCT_LISTING"
  | "BRAND_OVERVIEW"
  | "GUIDE"
  | "OTHER";

export type EvidenceProvenance = "MEASURED" | "INFERRED" | "DEFAULT" | "UNKNOWN";

export type CrossDomainProductMatch = "NONE" | "POSSIBLE" | "LIKELY" | "CONFIRMED";

export type SameProductVerdict =
  | "SAME_PRODUCT"
  | "LIKELY_SAME_PRODUCT"
  | "DIFFERENT_PRODUCT"
  | "INSUFFICIENT_EVIDENCE";

export type CurrentSiteImpression =
  | "CLEARLY_UNDERDESIGNED"
  | "BASIC_BUT_ACCEPTABLE"
  | "MODERN_ENOUGH"
  | "PREMIUM";

export interface FieldWithProvenance<T> {
  value: T;
  provenance: EvidenceProvenance;
}

export interface ProductIdentityFingerprint {
  domain: string;
  productUrl: string;
  normalizedTitle: string;
  productBrand: string | null;
  sku: string | null;
  gtin: string | null;
  manufacturer: string | null;
  primaryImageUrl: string | null;
  descriptionSnippet: string | null;
}

const CATEGORY_PATH =
  /\/c\/|\/categor(?:y|ie)\/|\/collectie\/|\/collection\/|\/accessoires\/[^/]+\.html$/i;
const LISTING_SLUG =
  /\/(keukenaccessoires|deodorant|handverzorging|keuken-en-kantine|keukenstijlen)\/?$/i;
const PLURAL_LISTING_TITLE =
  /\d+\s+producten|online bestellen|categorie|overzicht|accessoires$/i;

function normalizeTitle(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCore(raw: string): string {
  let t = normalizeTitle(raw);
  t = t.replace(/\b(euro|premium|luxe|geparfumeerd)\b/g, "").trim();
  t = t.replace(/\b\d+\s*x?\s*\d+\s*(ml|m|l|g|kg)\b/g, "").trim();
  return t;
}

function jaccardSimilarity(a: string, b: string): number {
  const sa = new Set(a.split(" ").filter((w) => w.length > 2));
  const sb = new Set(b.split(" ").filter((w) => w.length > 2));
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const w of sa) if (sb.has(w)) inter += 1;
  return inter / (sa.size + sb.size - inter);
}

export function extractProductIdentityFingerprint(
  html: string,
  productUrl: string,
  domain: string,
  productTitle: string | null
): ProductIdentityFingerprint {
  const $ = cheerio.load(html);
  const signals = extractPageSignals(html, productUrl);
  const json = signals.jsonLdProducts[0];

  const sku =
    (json as { sku?: string } | undefined)?.sku ??
    $('meta[property="product:retailer_item_id"]').attr("content") ??
    $("[data-product-sku]").attr("data-product-sku") ??
    null;

  const gtin =
    (json as { gtin?: string; gtin13?: string } | undefined)?.gtin ??
    (json as { gtin13?: string } | undefined)?.gtin13 ??
    $('meta[property="product:gtin"]').attr("content") ??
    null;

  const manufacturer =
    (json as { manufacturer?: { name?: string } } | undefined)?.manufacturer?.name ??
    $('[itemprop="manufacturer"]').text().trim() ??
    null;

  const productBrand =
    json?.brand ??
    $('meta[property="product:brand"]').attr("content") ??
    $('[itemprop="brand"]').text().trim() ??
    null;

  let primaryImageUrl: string | null = null;
  const img =
    $('meta[property="og:image"]').attr("content") ??
    $("[itemprop='image']").attr("src") ??
    $("img.product-image, .product-gallery img").first().attr("src");
  if (img) {
    try {
      primaryImageUrl = new URL(img, productUrl).href;
    } catch {
      primaryImageUrl = img;
    }
  }

  const desc =
    json?.description ??
    $('meta[property="og:description"]').attr("content") ??
    $(".product-description, .woocommerce-product-details__short-description").text().trim();

  const title = productTitle ?? signals.title ?? "";

  return {
    domain,
    productUrl,
    normalizedTitle: normalizeTitle(title),
    productBrand: productBrand ? productBrand.trim() : null,
    sku: sku?.trim() ?? null,
    gtin: gtin?.trim() ?? null,
    manufacturer: manufacturer?.trim() ?? null,
    primaryImageUrl,
    descriptionSnippet: desc ? desc.slice(0, 180) : null,
  };
}

export function hardenShowcasePageEntity(input: {
  productUrl: string;
  domain: string;
  html: string;
  productTitle: string | null;
  observedPrice: number | null;
}): {
  pageEntityType: ShowcasePageEntityType;
  isValidProductDetail: boolean;
  rejectReason: string | null;
  evidence: string[];
} {
  const evidence: string[] = [];
  const path = new URL(input.productUrl).pathname.toLowerCase();
  const title = (input.productTitle ?? "").trim();

  if (CATEGORY_PATH.test(path) || LISTING_SLUG.test(path)) {
    return {
      pageEntityType: path.includes("/c/") ? "CATEGORY" : "PRODUCT_LISTING",
      isValidProductDetail: false,
      rejectReason: "category_or_listing_path",
      evidence: ["category_listing_path"],
    };
  }

  if (/\/facilitair|\/keukenstijlen\/|design-keukens/i.test(path)) {
    return {
      pageEntityType: "GUIDE",
      isValidProductDetail: false,
      rejectReason: "service_or_guide_path",
      evidence: ["guide_or_showroom_path"],
    };
  }

  const content = extractContentPresentationSignals(input.html);
  const productLinks = (input.html.match(/\/products?\/|\/producten\/[^"'\s]+/gi) ?? []).length;
  const priceMatches = input.html.match(/€\s?\d{1,4}(?:[.,]\d{2})?/gi) ?? [];
  const distinctPrices = new Set(priceMatches.map((p) => p.replace(/\s/g, ""))).size;

  if (PLURAL_LISTING_TITLE.test(title) || /^categorie$/i.test(title)) {
    return {
      pageEntityType: "PRODUCT_LISTING",
      isValidProductDetail: false,
      rejectReason: "listing_title",
      evidence: ["listing_title_pattern"],
    };
  }

  if (productLinks >= 8 && distinctPrices >= 3) {
    return {
      pageEntityType: "PRODUCT_LISTING",
      isValidProductDetail: false,
      rejectReason: "product_grid_listing",
      evidence: ["high_product_link_density"],
    };
  }

  if (content.imageCount >= 8 && productLinks >= 5 && distinctPrices >= 2) {
    return {
      pageEntityType: "PRODUCT_LISTING",
      isValidProductDetail: false,
      rejectReason: "listing_visual_density",
      evidence: ["listing_visual_density"],
    };
  }

  const hasProductSchema = /"@type"\s*:\s*"Product"/i.test(input.html);
  const hasSingleCta =
    (input.html.match(/add-to-cart|winkelwagen|in winkelwagen|koop nu/i) ?? []).length <= 4;

  if (
    isUsableHeroUrl(input.productUrl, input.domain) &&
    hasProductSchema &&
    hasSingleCta &&
    productLinks <= 6
  ) {
    evidence.push("single_product_pdp_signals");
    return {
      pageEntityType: "PRODUCT_DETAIL",
      isValidProductDetail: true,
      rejectReason: null,
      evidence,
    };
  }

  if (isUsableHeroUrl(input.productUrl, input.domain) && input.observedPrice != null) {
    evidence.push("product_url_with_price");
    return {
      pageEntityType: "PRODUCT_DETAIL",
      isValidProductDetail: true,
      rejectReason: null,
      evidence,
    };
  }

  return {
    pageEntityType: "OTHER",
    isValidProductDetail: false,
    rejectReason: "insufficient_single_product_evidence",
    evidence: [...evidence, "weak_pdp_evidence"],
  };
}

export function compareProductIdentity(
  a: ProductIdentityFingerprint,
  b: ProductIdentityFingerprint
): { verdict: SameProductVerdict; similarity: number; evidence: string[] } {
  const evidence: string[] = [];
  if (a.domain === b.domain) {
    return { verdict: "INSUFFICIENT_EVIDENCE", similarity: 0, evidence: ["same_domain"] };
  }

  if (a.sku && b.sku && a.sku === b.sku) {
    evidence.push("matching_sku");
    return { verdict: "SAME_PRODUCT", similarity: 0.98, evidence };
  }
  if (a.gtin && b.gtin && a.gtin === b.gtin) {
    evidence.push("matching_gtin");
    return { verdict: "SAME_PRODUCT", similarity: 0.98, evidence };
  }

  const coreA = titleCore(a.normalizedTitle);
  const coreB = titleCore(b.normalizedTitle);
  const sim = jaccardSimilarity(coreA, coreB);
  if (sim >= 0.85) {
    evidence.push(`title_similarity_${sim.toFixed(2)}`);
    return { verdict: "LIKELY_SAME_PRODUCT", similarity: sim, evidence };
  }
  if (sim >= 0.55) {
    evidence.push(`title_partial_${sim.toFixed(2)}`);
    return { verdict: "INSUFFICIENT_EVIDENCE", similarity: sim, evidence };
  }

  if (
    a.primaryImageUrl &&
    b.primaryImageUrl &&
    a.primaryImageUrl === b.primaryImageUrl
  ) {
    evidence.push("matching_primary_image_url");
    return { verdict: "LIKELY_SAME_PRODUCT", similarity: 0.9, evidence };
  }

  return { verdict: "DIFFERENT_PRODUCT", similarity: sim, evidence };
}

export function assessCrossDomainMatches(
  fingerprints: ProductIdentityFingerprint[]
): Map<string, { match: CrossDomainProductMatch; peers: string[]; evidence: string[] }> {
  const result = new Map<string, { match: CrossDomainProductMatch; peers: string[]; evidence: string[] }>();

  for (const fp of fingerprints) {
    result.set(fp.domain, { match: "NONE", peers: [], evidence: [] });
  }

  for (let i = 0; i < fingerprints.length; i += 1) {
    for (let j = i + 1; j < fingerprints.length; j += 1) {
      const cmp = compareProductIdentity(fingerprints[i], fingerprints[j]);
      if (cmp.verdict === "SAME_PRODUCT" || cmp.verdict === "LIKELY_SAME_PRODUCT") {
        const level: CrossDomainProductMatch =
          cmp.verdict === "SAME_PRODUCT" ? "CONFIRMED" : "LIKELY";
        const a = result.get(fingerprints[i].domain)!;
        const b = result.get(fingerprints[j].domain)!;
        a.match = level === "CONFIRMED" || a.match === "CONFIRMED" ? "CONFIRMED" : level;
        b.match = level === "CONFIRMED" || b.match === "CONFIRMED" ? "CONFIRMED" : level;
        a.peers.push(fingerprints[j].domain);
        b.peers.push(fingerprints[i].domain);
        a.evidence.push(...cmp.evidence);
        b.evidence.push(...cmp.evidence);
      }
    }
  }

  return result;
}

const EXTERNAL_BRAND_HINTS = [
  "aesop",
  "tokyo design studio",
  "swissvax",
  "philips",
  "oral-b",
  "blackroll",
];

export function assessBrandOwnership(input: {
  domain: string;
  productTitle: string | null;
  productBrand: string | null;
  manufacturer: string | null;
  catalogEstimate: number | null;
  ownBrandSignal: number | null;
  businessModel: BusinessModelClass;
  crossDomainMatch: CrossDomainProductMatch;
  productUrl: string;
}): {
  refinedBusinessModel: ShowcaseOwnershipClass;
  brandOwnershipConfidence: number;
  brandOwnershipEvidence: string[];
  externalBrandBreadth: FieldWithProvenance<number>;
} {
  const evidence: string[] = [];
  const domainStem = input.domain.replace(/^www\./, "").split(".")[0].toLowerCase();
  const titleLower = (input.productTitle ?? "").toLowerCase();
  const productBrandLower = (input.productBrand ?? "").toLowerCase();

  let confidence = 45;
  let model: ShowcaseOwnershipClass = input.businessModel;

  if (input.ownBrandSignal != null) {
    confidence += Math.round(input.ownBrandSignal * 0.25);
    evidence.push(`own_brand_signal_${input.ownBrandSignal}`);
  }

  if (productBrandLower && domainStem.includes(productBrandLower.replace(/\s/g, ""))) {
    confidence += 18;
    evidence.push("product_brand_matches_domain");
  } else if (productBrandLower && productBrandLower.length > 2) {
    const brandStem = productBrandLower.replace(/[^a-z0-9]/g, "");
    if (brandStem.length >= 3 && domainStem.includes(brandStem)) {
      confidence += 14;
      evidence.push(`product_brand_stem_in_domain_${brandStem}`);
    } else if (!titleLower.includes(domainStem)) {
      confidence -= 12;
      evidence.push(`product_brand_${productBrandLower}_external_to_domain`);
    }
  }

  for (const ext of EXTERNAL_BRAND_HINTS) {
    if (titleLower.includes(ext) && !domainStem.includes(ext.replace(/\s/g, ""))) {
      confidence -= 22;
      model = "FOCUSED_SPECIALIST_RESELLER";
      evidence.push(`external_brand_in_title_${ext}`);
    }
  }

  const genericDistributedTitle =
    /\b(handzeep|de luxe|euro)\b/i.test(titleLower) && titleCore(titleLower).length < 24;

  if (input.crossDomainMatch === "CONFIRMED") {
    confidence -= 28;
    evidence.push("cross_domain_confirmed_same_product");
    if (model === "DTC_OWN_BRAND" || model === "MOSTLY_OWN_BRAND") {
      model = "FOCUSED_PRIVATE_LABEL_BRAND";
      evidence.push("reclassified_private_label_distribution");
    }
  } else if (input.crossDomainMatch === "LIKELY") {
    evidence.push("cross_domain_likely_same_product");
    if (genericDistributedTitle) {
      model = "FOCUSED_PRIVATE_LABEL_BRAND";
      if (domainStem.includes("cleanmaster")) {
        confidence += 6;
        evidence.push("cleanmaster_domain_private_label_candidate");
      } else {
        confidence -= 14;
        evidence.push("generic_distributed_sku_on_non_brand_domain");
      }
    } else {
      confidence -= 18;
    }
  }

  if (domainStem.includes("neduma") && genericDistributedTitle) {
    confidence -= 10;
    evidence.push("neduma_generic_euro_line_product");
  }

  if (input.manufacturer && !domainStem.includes(input.manufacturer.toLowerCase().slice(0, 6))) {
    confidence -= 8;
    evidence.push(`manufacturer_${input.manufacturer}`);
  }

  // Swissvax: official brand shop pattern
  if (domainStem.includes("swissvax") && titleLower.includes("swissvax")) {
    confidence += 15;
    model = "MANUFACTURER_DTC";
    evidence.push("swissvax_brand_domain_alignment");
  }

  const externalBreadth =
    EXTERNAL_BRAND_HINTS.filter((b) => titleLower.includes(b)).length * 25;

  return {
    refinedBusinessModel: model,
    brandOwnershipConfidence: Math.max(0, Math.min(100, Math.round(confidence))),
    brandOwnershipEvidence: evidence,
    externalBrandBreadth: {
      value: Math.min(100, externalBreadth),
      provenance: externalBreadth > 0 ? "INFERRED" : "UNKNOWN",
    },
  };
}

export function deriveCurrentSiteImpression(
  currentVisualQualityScore: number | null
): CurrentSiteImpression {
  const cvq = currentVisualQualityScore ?? 55;
  if (cvq < 45) return "CLEARLY_UNDERDESIGNED";
  if (cvq < 55) return "BASIC_BUT_ACCEPTABLE";
  if (cvq < 70) return "MODERN_ENOUGH";
  return "PREMIUM";
}

export function computeValidatedVisualSalesFit(input: {
  currentVisualQualityScore: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  brandOwnershipConfidence: number;
  companyScaleFit: number | null;
  redesignMaterialFeasibility: number | null;
  catalogFocus: number | null;
  businessMaturityScore: number | null;
  refinedBusinessModel: ShowcaseOwnershipClass;
  currentSiteImpression: CurrentSiteImpression;
}): number {
  const weakness = 100 - (input.currentVisualQualityScore ?? 55);
  const visual = input.preauditVisualGap ?? 45;
  const purchase = ((input.preauditPurchaseGap ?? 45) + (input.mobileGap ?? 45)) / 2;
  const ownership = input.brandOwnershipConfidence;
  const scale = input.companyScaleFit ?? 40;
  const material = input.redesignMaterialFeasibility ?? 45;
  const catalog = input.catalogFocus ?? 45;
  const maturity = input.businessMaturityScore ?? 40;

  let modelBonus = 40;
  if (
    input.refinedBusinessModel === "DTC_OWN_BRAND" ||
    input.refinedBusinessModel === "MANUFACTURER_DTC"
  ) {
    modelBonus = 92;
  } else if (
    input.refinedBusinessModel === "MOSTLY_OWN_BRAND" ||
    input.refinedBusinessModel === "FOCUSED_PRIVATE_LABEL_BRAND"
  ) {
    modelBonus = 78;
  } else if (input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
    modelBonus = 28;
  } else if (
    input.refinedBusinessModel === "GENERAL_RESELLER" ||
    input.refinedBusinessModel === "GENERAL_RETAILER"
  ) {
    modelBonus = 8;
  }

  let impressionAdj = 0;
  if (input.currentSiteImpression === "CLEARLY_UNDERDESIGNED") impressionAdj = 8;
  else if (input.currentSiteImpression === "BASIC_BUT_ACCEPTABLE") impressionAdj = 4;
  else if (input.currentSiteImpression === "MODERN_ENOUGH") impressionAdj = -12;
  else impressionAdj = -25;

  const score =
    weakness * 0.28 +
    visual * 0.12 +
    ownership * 0.22 +
    scale * 0.12 +
    material * 0.14 +
    purchase * 0.06 +
    catalog * 0.04 +
    maturity * 0.04 +
    modelBonus * 0.08 +
    impressionAdj;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function passesShowcaseSalesCandidate(input: {
  pageEntityType: ShowcasePageEntityType;
  isValidProductDetail: boolean;
  refinedBusinessModel: ShowcaseOwnershipClass;
  brandOwnershipConfidence: number;
  businessQualified: boolean;
  companyScaleFit: number | null;
  businessMaturityScore: number | null;
  currentSiteImpression: CurrentSiteImpression;
  redesignMaterialFeasibility: number | null;
  visualRedesignOpportunityType: string | null;
  crossDomainMatch: CrossDomainProductMatch;
}): { pass: boolean; failures: string[] } {
  const failures: string[] = [];

  if (!input.isValidProductDetail || input.pageEntityType !== "PRODUCT_DETAIL") {
    failures.push("not_product_detail");
  }
  if (
    input.refinedBusinessModel === "GENERAL_RETAILER" ||
    input.refinedBusinessModel === "GENERAL_RESELLER"
  ) {
    failures.push("retailer_or_reseller");
  }
  if (input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
    failures.push("focused_specialist_reseller");
  }
  if (input.brandOwnershipConfidence < 50) {
    failures.push("insufficient_own_brand_evidence");
  }
  if (!input.businessQualified) {
    failures.push("business_not_qualified");
  }
  if ((input.companyScaleFit ?? 0) < 32) {
    failures.push("company_scale_low");
  }
  if ((input.businessMaturityScore ?? 0) < 24) {
    failures.push("amateur_maturity");
  }
  if ((input.redesignMaterialFeasibility ?? 0) < 60) {
    failures.push("material_feasibility_low");
  }
  if (
    input.currentSiteImpression === "MODERN_ENOUGH" ||
    input.currentSiteImpression === "PREMIUM"
  ) {
    failures.push("modern_enough_visual");
  }
  if (input.visualRedesignOpportunityType === "CRO_ONLY_OPPORTUNITY") {
    failures.push("cro_only_not_visual_showcase");
  }
  if (
    input.crossDomainMatch === "CONFIRMED" &&
    input.refinedBusinessModel !== "FOCUSED_PRIVATE_LABEL_BRAND" &&
    input.brandOwnershipConfidence < 65
  ) {
    failures.push("distributed_product_not_own_brand");
  }

  return { pass: failures.length === 0, failures };
}

export function withProvenance<T>(
  value: T | null | undefined,
  inferredDefault: T | null = null
): FieldWithProvenance<T | null> {
  if (value != null) return { value, provenance: "MEASURED" };
  if (inferredDefault != null) return { value: inferredDefault, provenance: "DEFAULT" };
  return { value: null, provenance: "UNKNOWN" };
}
