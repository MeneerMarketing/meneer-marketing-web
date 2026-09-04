/**
 * Milestone 7.2.2 — Confirmed prospect target harvest.
 */
export declare const TARGET_HARVEST_DEFAULTS: {
    readonly maxConfirmedProspects: 10;
    readonly maxCroShortlist: 5;
    readonly maxShoppingKeywordsPerBrand: 2;
    readonly maxShoppingResultsPerKeyword: 8;
    readonly maxShoppingResolutionsPerBrand: 3;
    readonly maxDataForSeoCost: 0.25;
    readonly maxRetailerScale: 55;
    readonly minMaturity: 40;
    readonly minSourceQualityForCro: 85;
    readonly minSourceQualityForHighConfidence: 80;
    readonly minTargetPriorityForCro: 55;
};
export declare const CRO_SHORTLIST_WEIGHTS: {
    readonly targetPriority: 0.45;
    readonly preFit: 0.25;
    readonly shopifyBonus: 14;
    readonly maturity: 0.15;
    readonly retailerScalePenalty: 0.35;
    readonly exactPaidBonus: 10;
    readonly highConfidenceBonus: 5;
};
//# sourceMappingURL=targetHarvest.d.ts.map