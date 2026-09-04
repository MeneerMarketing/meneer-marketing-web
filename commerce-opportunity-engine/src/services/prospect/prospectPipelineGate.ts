/**
 * Milestone 9.3.1 — one central prospect gate.
 *
 * Every downstream job (ideal prospects, qualification queue, paid verification,
 * hero resolution, CRO audit, concept scoring, contact discovery, outreach) must
 * call passesProspectPipelineGate. Excluded domains may still be stored as raw
 * ad intelligence, but never travel further.
 */

import { isBlacklistedDomain } from "../../config/blacklist.js";
import {
  ALWAYS_EXCLUDED_BUSINESS_TYPES,
  COMPARISON_DOMAIN_PATTERNS,
  MARKETPLACE_DOMAIN_PATTERNS,
  MASS_RETAIL_OPERATOR_TOKENS,
  MASS_RETAIL_SIGNAL_THRESHOLDS,
  NON_PROSPECT_BUSINESS_TYPES,
  PROSPECT_EXCLUSION_VERSION,
  type ProspectExclusionReason,
} from "../../config/prospectExclusion.js";

export interface ProspectGateSignals {
  domain: string;
  businessType?: string | null;
  brandCommerceModel?: string | null;
  isEcommerce?: boolean | null;
  manualExcluded?: boolean | null;
  retailerScaleScore?: number | null;
  estimatedProductCount?: number | null;
  estimatedBrandCount?: number | null;
  businessMaturityScore?: number | null;
  /** Distinct product archetype categories this domain advertises in. */
  categorySpread?: number | null;
  /** Distinct keywords this domain advertises on. */
  keywordSpread?: number | null;
}

export interface ProspectGateVerdict {
  eligible: boolean;
  reason: ProspectExclusionReason | null;
  /** Human readable evidence, used in dashboard and reports. */
  evidence: string[];
  /** Coarse class used for SERP composition scoring. */
  prospectClass: ProspectClass;
  version: string;
}

export type ProspectClass =
  | "NICHE_BRAND"
  | "SPECIALIST"
  | "GENERAL_RETAILER"
  | "MASS_RETAILER"
  | "MARKETPLACE"
  | "COMPARISON_SITE"
  | "NON_COMMERCE"
  | "UNKNOWN";

function domainLabel(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.(nl|com|eu|net|be|de|co\.uk|co\.nl)$/i, "")
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Short tokens ("bol", "plus", "action") only match a full domain label,
 * otherwise they swallow legitimate specialists like bolusso.nl or skinplus.nl.
 */
const SUBSTRING_MATCH_MIN_LENGTH = 7;

function matchesPattern(label: string, patterns: string[]): string | null {
  for (const pattern of patterns) {
    const compact = pattern.replace(/[^a-z0-9]+/g, "");
    if (compact.length < 3) continue;
    if (compact.length >= SUBSTRING_MATCH_MIN_LENGTH) {
      if (label.includes(compact)) return pattern;
    } else if (label === compact) {
      return pattern;
    }
  }
  return null;
}

/**
 * Deterministic mass-retail detection. Domain tokens are one signal; breadth,
 * scale and catalog signals catch operators that are not in the registry.
 */
export function classifyProspectExclusion(signals: ProspectGateSignals): ProspectGateVerdict {
  const evidence: string[] = [];
  const label = domainLabel(signals.domain);
  const type = String(signals.businessType ?? "UNKNOWN").toUpperCase();
  const model = String(signals.brandCommerceModel ?? "").toUpperCase();
  const categorySpread = signals.categorySpread ?? 0;
  const keywordSpread = signals.keywordSpread ?? 0;
  const scale = signals.retailerScaleScore ?? 0;
  const products = signals.estimatedProductCount ?? 0;
  const brands = signals.estimatedBrandCount ?? 0;
  const maturity = signals.businessMaturityScore ?? 0;

  const deny = (
    reason: ProspectExclusionReason,
    prospectClass: ProspectClass
  ): ProspectGateVerdict => ({
    eligible: false,
    reason,
    evidence,
    prospectClass,
    version: PROSPECT_EXCLUSION_VERSION,
  });

  if (signals.manualExcluded) {
    evidence.push("manueel uitgesloten");
    return deny("manual_excluded", "UNKNOWN");
  }

  if (isBlacklistedDomain(signals.domain.toLowerCase())) {
    evidence.push("staat op advertiser blacklist");
    return deny("blacklisted_domain", "MARKETPLACE");
  }

  if ((ALWAYS_EXCLUDED_BUSINESS_TYPES as readonly string[]).includes(type)) {
    evidence.push(`business_type=${type}`);
    const cls: ProspectClass =
      type === "COMPARISON_SITE"
        ? "COMPARISON_SITE"
        : type === "MARKETPLACE"
          ? "MARKETPLACE"
          : type === "MASS_RETAILER"
            ? "MASS_RETAILER"
            : "GENERAL_RETAILER";
    return deny("excluded_business_type", cls);
  }

  const comparisonHit = matchesPattern(label, COMPARISON_DOMAIN_PATTERNS);
  if (comparisonHit) {
    evidence.push(`vergelijker-signaal in domein: "${comparisonHit}"`);
    return deny("comparison_site_signal", "COMPARISON_SITE");
  }

  const marketplaceHit = matchesPattern(label, MARKETPLACE_DOMAIN_PATTERNS);
  if (marketplaceHit) {
    evidence.push(`marketplace-signaal in domein: "${marketplaceHit}"`);
    return deny("marketplace_signal", "MARKETPLACE");
  }

  const operatorHit = matchesPattern(label, MASS_RETAIL_OPERATOR_TOKENS);
  if (operatorHit) {
    evidence.push(`bekende ketenretailer: "${operatorHit}"`);
    return deny("mass_retail_operator", "MASS_RETAILER");
  }

  if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
    evidence.push(`commerce_model=${model}`);
    return deny("excluded_business_type", "GENERAL_RETAILER");
  }

  const breadthHit =
    categorySpread >= MASS_RETAIL_SIGNAL_THRESHOLDS.categorySpread ||
    (categorySpread >= MASS_RETAIL_SIGNAL_THRESHOLDS.crossCategoryMinCategories &&
      keywordSpread >= MASS_RETAIL_SIGNAL_THRESHOLDS.crossCategoryKeywordSpread) ||
    (maturity >= MASS_RETAIL_SIGNAL_THRESHOLDS.matureBreadthMaturity &&
      categorySpread >= MASS_RETAIL_SIGNAL_THRESHOLDS.matureBreadthCategorySpread &&
      keywordSpread >= MASS_RETAIL_SIGNAL_THRESHOLDS.matureBreadthCategorySpread * 2);

  if (breadthHit) {
    evidence.push(
      `adverteert breed: ${categorySpread} archetype-categorieën, ${keywordSpread} keywords`
    );
    return deny("mass_retail_breadth", "MASS_RETAILER");
  }

  if (scale >= MASS_RETAIL_SIGNAL_THRESHOLDS.retailerScaleScore) {
    evidence.push(`retailer_scale_score=${scale}`);
    return deny("mass_retail_scale", "MASS_RETAILER");
  }

  if (products >= MASS_RETAIL_SIGNAL_THRESHOLDS.estimatedProductCount) {
    evidence.push(`catalogus ~${products} producten`);
    return deny("mass_retail_catalog", "GENERAL_RETAILER");
  }

  if (brands >= MASS_RETAIL_SIGNAL_THRESHOLDS.estimatedBrandCount) {
    evidence.push(`~${brands} externe merken in assortiment`);
    return deny("reseller_brand_wall", "GENERAL_RETAILER");
  }

  if (type === "NON_ECOMMERCE") {
    evidence.push("geen webshop gedetecteerd");
    return deny("non_ecommerce", "NON_COMMERCE");
  }

  if (type === "SERVICE_BUSINESS") {
    evidence.push("dienstverlener, geen productverkoop");
    return deny("service_business", "NON_COMMERCE");
  }

  if (signals.isEcommerce === false && (NON_PROSPECT_BUSINESS_TYPES as readonly string[]).includes(type)) {
    evidence.push("geen ecommerce signalen");
    return deny("non_ecommerce", "NON_COMMERCE");
  }

  const prospectClass: ProspectClass =
    type === "BRAND" || model === "DTC_OWN_BRAND" || model === "MOSTLY_OWN_BRAND"
      ? "NICHE_BRAND"
      : type === "SPECIALIST_WEBSHOP"
        ? "SPECIALIST"
        : "UNKNOWN";

  evidence.push(`prospect eligible als ${prospectClass}`);

  return {
    eligible: true,
    reason: null,
    evidence,
    prospectClass,
    version: PROSPECT_EXCLUSION_VERSION,
  };
}

/** The single boolean every downstream job must respect. */
export function passesProspectPipelineGate(signals: ProspectGateSignals): boolean {
  return classifyProspectExclusion(signals).eligible;
}

/**
 * Cheap classification for SERP composition scoring, where only the domain and
 * (optionally) a known business type are available.
 */
export function classifySerpDomain(
  domain: string,
  businessType?: string | null
): ProspectClass {
  return classifyProspectExclusion({ domain, businessType }).prospectClass;
}

export interface StructuralDomainVerdict {
  businessType: "MASS_RETAILER" | "COMPARISON_SITE" | "MARKETPLACE";
  matchedSignal: string;
}

/**
 * Domain-level structural verdict, independent of any crawl.
 * The website classifier consults this first so a chain can never be scored as
 * a specialist webshop on the strength of a clean-looking homepage.
 */
export function structuralDomainClass(domain: string): StructuralDomainVerdict | null {
  const label = domainLabel(domain);

  const comparisonHit = matchesPattern(label, COMPARISON_DOMAIN_PATTERNS);
  if (comparisonHit) {
    return { businessType: "COMPARISON_SITE", matchedSignal: comparisonHit };
  }

  const marketplaceHit = matchesPattern(label, MARKETPLACE_DOMAIN_PATTERNS);
  if (marketplaceHit) {
    return { businessType: "MARKETPLACE", matchedSignal: marketplaceHit };
  }

  if (isBlacklistedDomain(domain.toLowerCase())) {
    return { businessType: "MARKETPLACE", matchedSignal: "advertiser blacklist" };
  }

  const operatorHit = matchesPattern(label, MASS_RETAIL_OPERATOR_TOKENS);
  if (operatorHit) {
    return { businessType: "MASS_RETAILER", matchedSignal: operatorHit };
  }

  return null;
}
