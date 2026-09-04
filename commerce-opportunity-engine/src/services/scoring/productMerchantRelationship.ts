import type { ProductMerchantRelationship } from "../../config/commercialFit.js";
import { normalizeDomainFromUrl } from "../../utils/domainNormalizer.js";

export interface ProductMerchantInput {
  productBrand: string | null;
  productName: string | null;
  shopName: string | null;
  domain: string;
  businessType: string | null;
  pageTitle: string | null;
  adHeadline: string | null;
}

export interface ProductMerchantResult {
  relationship: ProductMerchantRelationship;
  confidence: number;
  evidence: string[];
}

function tokenize(value: string | null | undefined): string[] {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .split(/[\s_-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOP.has(t));
}

const STOP = new Set([
  "the",
  "and",
  "voor",
  "van",
  "met",
  "shop",
  "store",
  "webshop",
  "official",
  "nl",
  "com",
  "www",
  "premium",
  "classic",
  "zwart",
  "wit",
  "set",
  "ml",
  "cm",
]);

function domainBrandToken(domain: string): string {
  const normalized =
    normalizeDomainFromUrl(domain)?.normalizedDomain ??
    domain.toLowerCase().replace(/^www\./, "");
  return (normalized.split(".")[0] ?? "").replace(/[^a-z0-9]/g, "");
}

function overlapScore(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  let hits = 0;
  for (const t of a) {
    if (setB.has(t)) hits += 1;
    else {
      for (const other of setB) {
        if (t.includes(other) || other.includes(t)) {
          hits += 0.7;
          break;
        }
      }
    }
  }
  return hits / Math.max(a.length, 1);
}

/**
 * Deterministic OWN_BRAND vs RESELLER_PRODUCT classifier.
 * Uses product brand vs shop/domain tokens — never hardcodes specific brands.
 */
export function classifyProductMerchantRelationship(
  input: ProductMerchantInput
): ProductMerchantResult {
  const evidence: string[] = [];
  const domainTok = domainBrandToken(input.domain);
  const productBrandTokens = tokenize(input.productBrand);
  const shopTokens = tokenize(input.shopName);
  const productNameTokens = tokenize(input.productName);
  const titleTokens = tokenize(input.pageTitle);
  const type = (input.businessType ?? "").toUpperCase();

  if (!input.productBrand && !input.productName) {
    return {
      relationship: "UNKNOWN",
      confidence: 25,
      evidence: ["no_product_brand_or_name"],
    };
  }

  const brandVsDomain =
    productBrandTokens.length > 0
      ? overlapScore(productBrandTokens, [domainTok, ...shopTokens])
      : overlapScore(productNameTokens.slice(0, 3), [domainTok, ...shopTokens]);

  const brandVsTitle =
    productBrandTokens.length > 0
      ? overlapScore(productBrandTokens, titleTokens)
      : 0;

  evidence.push(`domain_token=${domainTok || "n/a"}`);
  if (input.productBrand) evidence.push(`product_brand=${input.productBrand}`);
  evidence.push(`brand_vs_domain_overlap=${brandVsDomain.toFixed(2)}`);

  // Strong own-brand: product brand aligns with domain/shop
  if (brandVsDomain >= 0.55 || (domainTok && productBrandTokens.some((t) => domainTok.includes(t) || t.includes(domainTok)))) {
    evidence.push("product_brand_matches_shop_domain");
    return {
      relationship: "OWN_BRAND",
      confidence: Math.round(clamp(70 + brandVsDomain * 25)),
      evidence,
    };
  }

  // Explicit external brand that does not match shop
  if (productBrandTokens.length > 0 && brandVsDomain < 0.25) {
    evidence.push("external_product_brand_vs_shop");
    // Brand business type selling others → still reseller on this PDP
    if (type === "BRAND" && brandVsTitle < 0.2) {
      evidence.push("brand_biz_selling_external_sku");
    }
    return {
      relationship: "RESELLER_PRODUCT",
      confidence: Math.round(clamp(72 + (1 - brandVsDomain) * 15)),
      evidence,
    };
  }

  // Product name starts with a clear third-party brand-like token different from domain
  if (productNameTokens.length >= 1) {
    const first = productNameTokens[0]!;
    if (
      first.length >= 4 &&
      domainTok &&
      !domainTok.includes(first) &&
      !first.includes(domainTok) &&
      brandVsDomain < 0.3
    ) {
      evidence.push(`product_name_lead_token_external=${first}`);
      return {
        relationship: "RESELLER_PRODUCT",
        confidence: 68,
        evidence,
      };
    }
  }

  if (type === "BRAND" && brandVsDomain >= 0.35) {
    evidence.push("business_type_brand_partial_match");
    return {
      relationship: "OWN_BRAND",
      confidence: 58,
      evidence,
    };
  }

  if (type === "SPECIALIST_WEBSHOP" && productBrandTokens.length > 0 && brandVsDomain < 0.4) {
    evidence.push("specialist_with_named_external_brand");
    return {
      relationship: "RESELLER_PRODUCT",
      confidence: 62,
      evidence,
    };
  }

  return {
    relationship: "UNKNOWN",
    confidence: 40,
    evidence: [...evidence, "insufficient_signal"],
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}
