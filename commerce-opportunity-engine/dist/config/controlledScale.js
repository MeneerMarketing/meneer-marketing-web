/**
 * Central configuration for Milestone 7.2 Controlled Multi-Category Scale.
 * No magic numbers scattered through jobs.
 */
export const CONTROLLED_SCALE_CATEGORIES = [
    "BEAUTY_SKINCARE",
    "SLEEP",
    "HOME_LIVING",
    "PETS",
];
/** Preferred keyword counts per category (soft targets). */
export const CONTROLLED_SCALE_CATEGORY_QUOTAS = {
    BEAUTY_SKINCARE: 15,
    SLEEP: 12,
    HOME_LIVING: 12,
    PETS: 11,
};
export const CONTROLLED_SCALE_DEFAULTS = {
    maxKeywords: 50,
    maxSerpCost: 0.25,
    totalDataForSeoBudget: 0.35,
    maxAnthropicCost: 0.03,
    estimatedSerpCostPerKeyword: 0.004,
    estimatedKeywordIdeasCostPerCategory: 0.03,
    maxClusterPerCategory: 5,
    maxProductBrandedShare: 0.15,
    rescanCooldownDays: 7,
    transparencyMaxDomains: 15,
    transparencyMaxCost: 0.05,
    paidTargetMaxBrands: 5,
    paidTargetMaxCost: 0.08,
    minMaturityForPrequalified: 35,
    maxRetailerScaleForPrequalified: 65,
};
/**
 * Weights for discovery_priority_score v2 (sum ≈ 1.0).
 * Category relevance prevents high-commercial off-category keywords from ranking PRIMARY.
 */
export const DISCOVERY_PRIORITY_WEIGHTS = {
    prospectingValue: 0.22,
    keywordQuality: 0.12,
    commercialIntent: 0.12,
    productIntent: 0.12,
    historicalYield: 0.18,
    advertiserDiversity: 0.06,
    categoryRelevance: 0.18,
};
/** Neutral fill when historical yield / diversity is unknown (not treated as 0). */
export const DISCOVERY_PRIORITY_NEUTRAL = {
    historicalYield: 55,
    advertiserDiversity: 50,
};
export const RETAILER_RATIO_PENALTY = {
    /** Subtract up to this many points when retailer_ratio is high. */
    maxPenalty: 25,
    /** Ratio at which max penalty applies. */
    fullPenaltyAt: 0.7,
};
/** Platform pre-fit bonuses. */
export const PRE_FIT_PLATFORM_BONUS = {
    SHOPIFY: 18,
    WOOCOMMERCE: 12,
    MAGENTO: 6,
    SHOPWARE: 6,
    UNKNOWN: 0,
};
export const PRE_FIT_WEIGHTS = {
    base: 30,
    businessTypeBrand: 20,
    businessTypeSpecialist: 16,
    maturityFactor: 0.25,
    retailerScalePenaltyFactor: 0.35,
    paidConfirmationBonus: 12,
    ecommerceBonus: 8,
};
//# sourceMappingURL=controlledScale.js.map