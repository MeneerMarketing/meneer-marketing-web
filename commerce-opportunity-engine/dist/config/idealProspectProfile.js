/**
 * Milestone 9.3 — IDEAL_COMMERCE_PROSPECT_V1 profile.
 * Concept-first premium PDP redesign prospect discovery.
 */
export const IDEAL_COMMERCE_PROSPECT_V1 = "IDEAL_COMMERCE_PROSPECT_V1";
export const IDEAL_PROSPECT_DISCOVERY_MODE = "IDEAL_PROSPECT_DISCOVERY";
/** Categories aligned with deep-dive PDP commercial logic. */
export const IDEAL_PROSPECT_CATEGORIES = [
    "BEAUTY_SKINCARE",
    "WELLNESS",
    "SLEEP",
    "PETS",
    "FITNESS",
    "HOME_LIVING",
];
export const M93_DEFAULTS = {
    maxDataForSeoCost: 0.4,
    maxAnthropicCost: 0.3,
    maxKeywords: 40,
    maxStrongProspects: 20,
    maxAudits: 8,
    estimatedSerpCostPerKeyword: 0.004,
    estimatedKeywordIdeasCostPerCategory: 0.03,
    minKeywordsPerCategoryBeforeGenerate: 15,
    maxProductBrandedShare: 0.12,
    maxClusterPerCategory: 4,
    rescanCooldownDays: 7,
    transparencyMaxDomains: 12,
    transparencyMaxCost: 0.05,
};
/** Strong contrast gate for TRUE_SALES_CANDIDATE design pilot. */
export const STRONG_CONTRAST_GATE = {
    /**
     * M9.3.4 — the design target has to produce a visible before/after. This is
     * a sales question, not a classification one: excellent shops with excellent
     * pages fail here while keeping their specialist/brand classification.
     */
    minConceptContrast: 62,
    maxCurrentPdpQuality: 65,
    minTransformation: 70,
    minAssetReadiness: 65,
    minDeepDiveFit: 70,
    minSalesFit: 75,
    minAuditConfidence: 55,
    minSalesConfidence: 62,
};
export const IDEAL_CATALOG_SWEET_SPOT = [
    { min: 6, max: 30, score: 96, label: "very_strong" },
    { min: 31, max: 75, score: 90, label: "strong" },
    { min: 1, max: 5, score: 62, label: "micro_check_maturity" },
    { min: 76, max: 150, score: 72, label: "usable" },
    { min: 151, max: 500, score: 42, label: "penalty" },
    { min: 501, max: 999999, score: 12, label: "huge_penalty" },
];
export const IDEAL_OWN_BRAND_SCORES = {
    DTC_OWN_BRAND: 98,
    MOSTLY_OWN_BRAND: 90,
    FOCUSED_SPECIALIST: 78,
    MIXED: 48,
    SPECIALIST_RESELLER: 55,
    GENERAL_RESELLER: 12,
    MARKETPLACE: 6,
    UNKNOWN: 35,
};
export const IDEAL_PLATFORM_SCORES = {
    SHOPIFY: 95,
    WOOCOMMERCE: 72,
    MAGENTO: 58,
    CUSTOM: 50,
    UNKNOWN: 38,
};
export const IDEAL_PRE_SCORE_WEIGHTS = {
    googleAdsSignal: 0.14,
    platform: 0.1,
    ownBrandModel: 0.14,
    catalogFocus: 0.1,
    catalogSweetSpot: 0.1,
    heroProduct: 0.12,
    deepDiveFitProxy: 0.14,
    assetReadinessProxy: 0.1,
    pdpWeaknessProxy: 0.12,
    businessMaturity: 0.06,
    retailerScalePenalty: 0.04,
};
/** Allowed keyword intent types for ideal discovery selection. */
export const IDEAL_KEYWORD_INTENTS = [
    "NON_BRANDED_PRODUCT",
    "PRODUCT_BRANDED",
];
export const IDEAL_KEYWORD_INTENT_BLOCK = [
    "RETAILER_BRANDED",
    "BRAND_NAVIGATIONAL",
    "REVIEW_RESEARCH",
    "INFORMATIONAL",
    "SERVICE",
];
//# sourceMappingURL=idealProspectProfile.js.map