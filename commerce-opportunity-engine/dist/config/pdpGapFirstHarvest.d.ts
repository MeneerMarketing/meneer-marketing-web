/**
 * Milestone 9.8 — PDP-GAP-FIRST ECOMMERCE HARVEST configuration.
 */
export declare const M98_DISCOVERY_VERSION: "PDP_GAP_FIRST_V1";
export declare const M98_DISCOVERY_ROUTE: "pdp_gap_first";
export type PdpHarvestSourceType = "ORGANIC_PRODUCT_RESULT" | "SHOPPING_PRODUCT_RESULT" | "SPECIALIST_PRODUCT_RESULT";
export interface M98ProductFamily {
    id: string;
    label: string;
    archetypeId: string;
    queries: string[];
}
/** High-consideration product queries across device + adjacent niches. */
export declare const M98_PRODUCT_FAMILIES: M98ProductFamily[];
export declare const M98_DISCOVERY: {
    readonly milestone: "M9.8";
    readonly maxSourceQueries: 14;
    readonly serpDepth: 50;
    readonly estimatedSerpCostPerKeyword: 0.006;
    readonly maxRawCandidates: 60;
    readonly maxValidPdpScreens: 40;
    readonly maxHighGapBusinessQual: 12;
    readonly maxPaidValidation: 8;
    readonly maxManualReview: 5;
    readonly maxVisionScreens: 40;
    readonly minPriceSoftFilter: 100;
    readonly priceSweetSpotMin: 150;
    readonly priceSweetSpotMax: 750;
    readonly highGapRawThreshold: 58;
    readonly minSufficientMaterials: 55;
    readonly crawlTimeoutMs: 18000;
    readonly screenshotDir: "m9.8-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 30000;
    readonly paidValidationKeywordsPerDomain: 2;
};
export declare function buildM98HarvestQueries(): Array<{
    query: string;
    familyId: string;
    familyLabel: string;
    archetypeId: string;
}>;
//# sourceMappingURL=pdpGapFirstHarvest.d.ts.map