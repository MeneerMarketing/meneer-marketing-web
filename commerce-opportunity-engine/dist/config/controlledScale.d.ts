/**
 * Central configuration for Milestone 7.2 Controlled Multi-Category Scale.
 * No magic numbers scattered through jobs.
 */
export declare const CONTROLLED_SCALE_CATEGORIES: readonly ["BEAUTY_SKINCARE", "SLEEP", "HOME_LIVING", "PETS"];
export type ControlledScaleCategory = (typeof CONTROLLED_SCALE_CATEGORIES)[number];
/** Preferred keyword counts per category (soft targets). */
export declare const CONTROLLED_SCALE_CATEGORY_QUOTAS: Record<ControlledScaleCategory, number>;
export declare const CONTROLLED_SCALE_DEFAULTS: {
    readonly maxKeywords: 50;
    readonly maxSerpCost: 0.25;
    readonly totalDataForSeoBudget: 0.35;
    readonly maxAnthropicCost: 0.03;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly estimatedKeywordIdeasCostPerCategory: 0.03;
    readonly maxClusterPerCategory: 5;
    readonly maxProductBrandedShare: 0.15;
    readonly rescanCooldownDays: 7;
    readonly transparencyMaxDomains: 15;
    readonly transparencyMaxCost: 0.05;
    readonly paidTargetMaxBrands: 5;
    readonly paidTargetMaxCost: 0.08;
    readonly minMaturityForPrequalified: 35;
    readonly maxRetailerScaleForPrequalified: 65;
};
/**
 * Weights for discovery_priority_score v2 (sum ≈ 1.0).
 * Category relevance prevents high-commercial off-category keywords from ranking PRIMARY.
 */
export declare const DISCOVERY_PRIORITY_WEIGHTS: {
    readonly prospectingValue: 0.22;
    readonly keywordQuality: 0.12;
    readonly commercialIntent: 0.12;
    readonly productIntent: 0.12;
    readonly historicalYield: 0.18;
    readonly advertiserDiversity: 0.06;
    readonly categoryRelevance: 0.18;
};
/** Neutral fill when historical yield / diversity is unknown (not treated as 0). */
export declare const DISCOVERY_PRIORITY_NEUTRAL: {
    historicalYield: number;
    advertiserDiversity: number;
};
export declare const RETAILER_RATIO_PENALTY: {
    /** Subtract up to this many points when retailer_ratio is high. */
    readonly maxPenalty: 25;
    /** Ratio at which max penalty applies. */
    readonly fullPenaltyAt: 0.7;
};
/** Platform pre-fit bonuses. */
export declare const PRE_FIT_PLATFORM_BONUS: Record<string, number>;
export declare const PRE_FIT_WEIGHTS: {
    base: number;
    businessTypeBrand: number;
    businessTypeSpecialist: number;
    maturityFactor: number;
    retailerScalePenaltyFactor: number;
    paidConfirmationBonus: number;
    ecommerceBonus: number;
};
//# sourceMappingURL=controlledScale.d.ts.map