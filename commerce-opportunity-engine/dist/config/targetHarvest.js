/**
 * Milestone 7.2.2 — Confirmed prospect target harvest.
 */
export const TARGET_HARVEST_DEFAULTS = {
    maxConfirmedProspects: 10,
    maxCroShortlist: 5,
    maxShoppingKeywordsPerBrand: 2,
    maxShoppingResultsPerKeyword: 8,
    maxShoppingResolutionsPerBrand: 3,
    maxDataForSeoCost: 0.25,
    maxRetailerScale: 55,
    minMaturity: 40,
    minSourceQualityForCro: 85,
    minSourceQualityForHighConfidence: 80,
    minTargetPriorityForCro: 55,
};
export const CRO_SHORTLIST_WEIGHTS = {
    targetPriority: 0.45,
    preFit: 0.25,
    shopifyBonus: 14,
    maturity: 0.15,
    retailerScalePenalty: 0.35,
    exactPaidBonus: 10,
    highConfidenceBonus: 5,
};
//# sourceMappingURL=targetHarvest.js.map