/**
 * Milestone 7.3 — product/merchant relationship + project-type fit.
 * Central config; no magic numbers in scorers.
 */
export type ProductMerchantRelationship = "OWN_BRAND" | "EXCLUSIVE_BRAND" | "RESELLER_PRODUCT" | "UNKNOWN";
export type RecommendedProjectType = "CUSTOM_SHOPIFY_REBUILD" | "SHOPIFY_CRO_REDESIGN" | "PDP_OPTIMIZATION" | "WOOCOMMERCE_TO_SHOPIFY" | "DESIGN_UPGRADE" | "NOT_A_GOOD_FIT";
/** MM Fit adjustments by product/merchant relationship (added to weighted score before clamp). */
export declare const PRODUCT_MERCHANT_MM_FIT_DELTA: Record<ProductMerchantRelationship, number>;
/** Project suitability multipliers for full rebuild fit (0-1). */
export declare const FULL_REBUILD_FIT_BY_RELATIONSHIP: Record<ProductMerchantRelationship, number>;
export declare const PROJECT_TYPE_THRESHOLDS: {
    readonly customRebuildMinFullRebuild: 70;
    readonly customRebuildMinMmFit: 70;
    readonly customRebuildPreferOwnBrand: true;
    readonly croRedesignMinPdp: 55;
    readonly croRedesignMaxFullRebuild: 75;
    readonly pdpOnlyMinPdp: 50;
    readonly wooMigrationPlatform: "WOOCOMMERCE";
    readonly notAGoodFitMaxMmFit: 35;
};
//# sourceMappingURL=commercialFit.d.ts.map