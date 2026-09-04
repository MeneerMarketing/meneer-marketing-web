/**
 * Milestone 7.3 — product/merchant relationship + project-type fit.
 * Central config; no magic numbers in scorers.
 */
/** MM Fit adjustments by product/merchant relationship (added to weighted score before clamp). */
export const PRODUCT_MERCHANT_MM_FIT_DELTA = {
    OWN_BRAND: 12,
    EXCLUSIVE_BRAND: 8,
    RESELLER_PRODUCT: -10,
    UNKNOWN: 0,
};
/** Project suitability multipliers for full rebuild fit (0-1). */
export const FULL_REBUILD_FIT_BY_RELATIONSHIP = {
    OWN_BRAND: 1,
    EXCLUSIVE_BRAND: 0.9,
    RESELLER_PRODUCT: 0.55,
    UNKNOWN: 0.7,
};
export const PROJECT_TYPE_THRESHOLDS = {
    customRebuildMinFullRebuild: 70,
    customRebuildMinMmFit: 70,
    customRebuildPreferOwnBrand: true,
    croRedesignMinPdp: 55,
    croRedesignMaxFullRebuild: 75,
    pdpOnlyMinPdp: 50,
    wooMigrationPlatform: "WOOCOMMERCE",
    notAGoodFitMaxMmFit: 35,
};
//# sourceMappingURL=commercialFit.js.map