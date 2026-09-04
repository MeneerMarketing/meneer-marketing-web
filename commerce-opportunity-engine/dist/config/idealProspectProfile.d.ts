/**
 * Milestone 9.3 — IDEAL_COMMERCE_PROSPECT_V1 profile.
 * Concept-first premium PDP redesign prospect discovery.
 */
export declare const IDEAL_COMMERCE_PROSPECT_V1: "IDEAL_COMMERCE_PROSPECT_V1";
export declare const IDEAL_PROSPECT_DISCOVERY_MODE: "IDEAL_PROSPECT_DISCOVERY";
/** Categories aligned with deep-dive PDP commercial logic. */
export declare const IDEAL_PROSPECT_CATEGORIES: readonly ["BEAUTY_SKINCARE", "WELLNESS", "SLEEP", "PETS", "FITNESS", "HOME_LIVING"];
export type IdealProspectCategory = (typeof IDEAL_PROSPECT_CATEGORIES)[number];
export declare const M93_DEFAULTS: {
    readonly maxDataForSeoCost: 0.4;
    readonly maxAnthropicCost: 0.3;
    readonly maxKeywords: 40;
    readonly maxStrongProspects: 20;
    readonly maxAudits: 8;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly estimatedKeywordIdeasCostPerCategory: 0.03;
    readonly minKeywordsPerCategoryBeforeGenerate: 15;
    readonly maxProductBrandedShare: 0.12;
    readonly maxClusterPerCategory: 4;
    readonly rescanCooldownDays: 7;
    readonly transparencyMaxDomains: 12;
    readonly transparencyMaxCost: 0.05;
};
/** Strong contrast gate for TRUE_SALES_CANDIDATE design pilot. */
export declare const STRONG_CONTRAST_GATE: {
    /**
     * M9.3.4 — the design target has to produce a visible before/after. This is
     * a sales question, not a classification one: excellent shops with excellent
     * pages fail here while keeping their specialist/brand classification.
     */
    readonly minConceptContrast: 62;
    readonly maxCurrentPdpQuality: 65;
    readonly minTransformation: 70;
    readonly minAssetReadiness: 65;
    readonly minDeepDiveFit: 70;
    readonly minSalesFit: 75;
    readonly minAuditConfidence: 55;
    readonly minSalesConfidence: 62;
};
export declare const IDEAL_CATALOG_SWEET_SPOT: readonly [{
    readonly min: 6;
    readonly max: 30;
    readonly score: 96;
    readonly label: "very_strong";
}, {
    readonly min: 31;
    readonly max: 75;
    readonly score: 90;
    readonly label: "strong";
}, {
    readonly min: 1;
    readonly max: 5;
    readonly score: 62;
    readonly label: "micro_check_maturity";
}, {
    readonly min: 76;
    readonly max: 150;
    readonly score: 72;
    readonly label: "usable";
}, {
    readonly min: 151;
    readonly max: 500;
    readonly score: 42;
    readonly label: "penalty";
}, {
    readonly min: 501;
    readonly max: 999999;
    readonly score: 12;
    readonly label: "huge_penalty";
}];
export declare const IDEAL_OWN_BRAND_SCORES: Record<string, number>;
export declare const IDEAL_PLATFORM_SCORES: Record<string, number>;
export declare const IDEAL_PRE_SCORE_WEIGHTS: {
    readonly googleAdsSignal: 0.14;
    readonly platform: 0.1;
    readonly ownBrandModel: 0.14;
    readonly catalogFocus: 0.1;
    readonly catalogSweetSpot: 0.1;
    readonly heroProduct: 0.12;
    readonly deepDiveFitProxy: 0.14;
    readonly assetReadinessProxy: 0.1;
    readonly pdpWeaknessProxy: 0.12;
    readonly businessMaturity: 0.06;
    readonly retailerScalePenalty: 0.04;
};
/** Allowed keyword intent types for ideal discovery selection. */
export declare const IDEAL_KEYWORD_INTENTS: readonly ["NON_BRANDED_PRODUCT", "PRODUCT_BRANDED"];
export declare const IDEAL_KEYWORD_INTENT_BLOCK: readonly ["RETAILER_BRANDED", "BRAND_NAVIGATIONAL", "REVIEW_RESEARCH", "INFORMATIONAL", "SERVICE"];
//# sourceMappingURL=idealProspectProfile.d.ts.map