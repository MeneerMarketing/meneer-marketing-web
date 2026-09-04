import type { PaidSourceType } from "../../config/sourceIntegrityWeights.js";
import {
  CRO_READY_MIN_SOURCE_QUALITY,
  SOURCE_QUALITY_V2,
  SOURCE_TYPE_SCORE_CAPS,
} from "../../config/sourceIntegrityWeights.js";
import { classifyShoppingTarget } from "./shoppingClassification.js";

export function scoreLabsPaidTarget(input: {
  landingUrl: string | null;
  title: string | null;
  keyword: string | null;
}): { sourceType: PaidSourceType; sourceQualityScore: number; croReady: boolean } {
  const hasLanding = Boolean(input.landingUrl);
  if (!hasLanding) {
    return {
      sourceType: "LABS_PAID_KEYWORD",
      sourceQualityScore: SOURCE_QUALITY_V2.transparencyConfirmedOnly.base,
      croReady: false,
    };
  }

  const cfg = SOURCE_QUALITY_V2.labsPaidKeywordWithUrl;
  let score: number = cfg.base;

  const kw = (input.keyword ?? "").toLowerCase().split(/\s+/).filter((t) => t.length >= 3);
  const title = (input.title ?? "").toLowerCase();
  const hits = kw.filter((t) => title.includes(t)).length;
  if (kw.length > 0 && hits / kw.length >= 0.4) {
    score += cfg.withStrongMatchBonus;
  }

  score = Math.min(cfg.maxScore, Math.max(0, Math.round(score)));
  return {
    sourceType: "LABS_PAID_KEYWORD",
    sourceQualityScore: score,
    croReady: score >= CRO_READY_MIN_SOURCE_QUALITY && hasLanding,
  };
}

/** @deprecated Prefer classifyShoppingTarget — kept for resolveShoppingTargets bridge */
export function scoreShoppingPaidTarget(input: {
  landingUrl: string | null;
  title: string | null;
  keyword: string | null;
  resolvedAdUrl: boolean;
  domainMatched: boolean;
  itemType: string | null;
  shopAdAclk?: string | null;
  adUrl?: string | null;
  seller?: string | null;
  productId?: string | null;
  brandConfirmedAdvertiser?: boolean;
}): {
  sourceType: PaidSourceType;
  sourceQualityScore: number;
  croReady: boolean;
  listingTargetConfidence: number;
  paidEvidenceConfidence: number;
  croReadinessLevel: string;
} {
  const classified = classifyShoppingTarget({
    merchantItemType: input.itemType,
    shopAdAclk: input.shopAdAclk ?? (input.resolvedAdUrl ? "resolved" : null),
    landingUrl: input.landingUrl,
    adUrl: input.adUrl ?? input.landingUrl,
    adUrlRedirects: [],
    seller: input.seller ?? null,
    productId: input.productId ?? null,
    title: input.title,
    keyword: input.keyword,
    domainMatchStatus: input.domainMatched ? "MATCH" : "MISMATCH",
    brandConfirmedAdvertiser: Boolean(input.brandConfirmedAdvertiser),
  });

  // Don't invent shop_ad_aclk — only pass through real aclk
  if (!input.shopAdAclk && input.resolvedAdUrl) {
    const again = classifyShoppingTarget({
      merchantItemType: input.itemType,
      shopAdAclk: null,
      landingUrl: input.landingUrl,
      adUrl: input.adUrl ?? input.landingUrl,
      adUrlRedirects: [],
      seller: input.seller ?? null,
      productId: input.productId ?? null,
      title: input.title,
      keyword: input.keyword,
      domainMatchStatus: input.domainMatched ? "MATCH" : "MISMATCH",
      brandConfirmedAdvertiser: Boolean(input.brandConfirmedAdvertiser),
    });
    return {
      sourceType: again.sourceType,
      sourceQualityScore: again.sourceQualityScore,
      croReady: again.croReady,
      listingTargetConfidence: again.listingTargetConfidence,
      paidEvidenceConfidence: again.paidEvidenceConfidence,
      croReadinessLevel: again.croReadinessLevel,
    };
  }

  return {
    sourceType: classified.sourceType,
    sourceQualityScore: classified.sourceQualityScore,
    croReady: classified.croReady,
    listingTargetConfidence: classified.listingTargetConfidence,
    paidEvidenceConfidence: classified.paidEvidenceConfidence,
    croReadinessLevel: classified.croReadinessLevel,
  };
}

export function scoreBrandLevelOnly(source: PaidSourceType): number {
  if (source === "TRANSPARENCY_CONFIRMED") {
    return SOURCE_QUALITY_V2.transparencyConfirmedOnly.base;
  }
  if (source === "POPULAR_PRODUCTS_CANDIDATE") {
    return SOURCE_QUALITY_V2.popularProductsNoLanding.base;
  }
  if (source === "GOOGLE_SHOPPING_FREE_LISTING") {
    return SOURCE_QUALITY_V2.googleShoppingFreeListing.base;
  }
  return SOURCE_QUALITY_V2.unknown.base;
}

export function maxScoreForSourceType(sourceType: string | null | undefined): number {
  if (!sourceType) return SOURCE_TYPE_SCORE_CAPS.POPULAR_PRODUCTS_CANDIDATE;
  return SOURCE_TYPE_SCORE_CAPS[sourceType] ?? SOURCE_TYPE_SCORE_CAPS.POPULAR_PRODUCTS_CANDIDATE;
}

export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000)));
}

export function freshnessLabel(iso: string | null | undefined): string {
  const days = daysSince(iso);
  if (days == null) return "onbekend";
  if (days === 0) return "vandaag";
  if (days === 1) return "1 dag oud";
  return `${days} dagen oud`;
}
