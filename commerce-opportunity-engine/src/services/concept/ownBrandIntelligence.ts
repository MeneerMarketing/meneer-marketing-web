/**
 * Milestone 9 — brand-level commerce model from existing merchant relationship + brand signals.
 */

import type { BrandCommerceModel } from "../../config/conceptScoring.js";

export type OwnBrandIntelligenceInput = {
  businessType: string | null;
  productMerchantRelationship: string | null;
  productMerchantConfidence: number | null;
  productMerchantEvidence: unknown;
  retailerScaleScore: number | null;
  domain: string;
  productBrand: string | null;
  distinctProductBrands: number;
};

export type OwnBrandIntelligenceResult = {
  brand_commerce_model: BrandCommerceModel;
  own_brand_ratio_estimate: number | null;
  own_brand_confidence: number;
  own_brand_evidence: string[];
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function scoreOwnBrandIntelligence(
  input: OwnBrandIntelligenceInput
): OwnBrandIntelligenceResult {
  const evidence: string[] = [];
  const biz = (input.businessType ?? "").toUpperCase();
  const rel = (input.productMerchantRelationship ?? "").toUpperCase();
  const conf = input.productMerchantConfidence ?? 0;
  const scale = input.retailerScaleScore ?? 40;

  if (Array.isArray(input.productMerchantEvidence)) {
    for (const e of input.productMerchantEvidence.slice(0, 6)) {
      evidence.push(String(e));
    }
  }

  let model: BrandCommerceModel = "UNKNOWN";
  let ratio: number | null = null;
  let confidence = Math.max(25, conf);

  if (biz === "MARKETPLACE") {
    model = "MARKETPLACE";
    ratio = 5;
    confidence = Math.max(confidence, 70);
    evidence.push("business_type_marketplace");
  } else if (biz === "GENERAL_RETAILER") {
    model = "GENERAL_RESELLER";
    ratio = 10;
    confidence = Math.max(confidence, 65);
    evidence.push("business_type_general_retailer");
  } else if (rel === "OWN_BRAND" && (biz === "BRAND" || biz === "DTC" || conf >= 55)) {
    model = "DTC_OWN_BRAND";
    ratio = 90;
    confidence = Math.max(confidence, 70);
    evidence.push("own_brand_relationship_plus_brand_type");
  } else if (rel === "OWN_BRAND") {
    model = "MOSTLY_OWN_BRAND";
    ratio = 75;
    confidence = Math.max(confidence, 60);
    evidence.push("own_brand_relationship");
  } else if (rel === "EXCLUSIVE_BRAND") {
    model = "MOSTLY_OWN_BRAND";
    ratio = 70;
    confidence = Math.max(confidence, 55);
    evidence.push("exclusive_brand_relationship");
  } else if (rel === "RESELLER_PRODUCT" && biz === "SPECIALIST_WEBSHOP" && scale < 60) {
    model = "SPECIALIST_RESELLER";
    ratio = 15;
    confidence = Math.max(confidence, 58);
    evidence.push("specialist_reseller_compact");
  } else if (rel === "RESELLER_PRODUCT") {
    model =
      scale >= 65 || input.distinctProductBrands >= 15
        ? "GENERAL_RESELLER"
        : "SPECIALIST_RESELLER";
    ratio = model === "GENERAL_RESELLER" ? 8 : 20;
    confidence = Math.max(confidence, 55);
    evidence.push("reseller_product_relationship");
  } else if (biz === "BRAND" || biz === "DTC") {
    model = "DTC_OWN_BRAND";
    ratio = 80;
    confidence = Math.min(50, confidence + 10);
    evidence.push("brand_type_without_strong_merchant_evidence");
  } else if (input.distinctProductBrands >= 8) {
    model = "MIXED";
    ratio = 35;
    confidence = 40;
    evidence.push("multiple_product_brands_on_pages");
  } else {
    evidence.push("insufficient_own_brand_evidence");
  }

  // Domain vs product brand soft boost / reseller demotion
  if (input.productBrand && input.domain) {
    const d = input.domain.replace(/\.(nl|com|be|eu|de)$/i, "").toLowerCase();
    const pb = input.productBrand.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (pb && d && (pb.includes(d.slice(0, 5)) || d.includes(pb.slice(0, 5)))) {
      if (model === "UNKNOWN" || model === "MIXED") model = "MOSTLY_OWN_BRAND";
      ratio = Math.max(ratio ?? 0, 65);
      confidence = clamp(confidence + 8);
      evidence.push("domain_product_brand_token_overlap");
    } else if (
      pb.length >= 3 &&
      !d.includes(pb.slice(0, 4)) &&
      !pb.includes(d.slice(0, 4))
    ) {
      if (
        model === "UNKNOWN" ||
        model === "DTC_OWN_BRAND" ||
        model === "MOSTLY_OWN_BRAND"
      ) {
        model =
          (input.retailerScaleScore ?? 40) >= 60 ||
          input.distinctProductBrands >= 10
            ? "GENERAL_RESELLER"
            : "SPECIALIST_RESELLER";
        ratio = model === "GENERAL_RESELLER" ? 8 : 18;
        confidence = Math.max(confidence, 50);
        evidence.push("product_brand_differs_from_domain");
      }
    }
  }

  return {
    brand_commerce_model: model,
    own_brand_ratio_estimate: ratio,
    own_brand_confidence: clamp(confidence),
    own_brand_evidence: evidence.slice(0, 12),
  };
}
