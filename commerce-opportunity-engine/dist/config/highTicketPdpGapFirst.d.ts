/**
 * Milestone 9.8.2 — HIGH-TICKET PDP-GAP-FIRST (secondary preset since M9.9).
 *
 * Primary commercial acquisition preset: FOCUSED_BRAND_GAP_FIRST_V1.
 * This config keeps high-ticket price gates for optional high-ticket-only runs.
 */
export declare const M982_DISCOVERY_VERSION: "HIGH_TICKET_PDP_GAP_FIRST_V1";
export declare const M982_DISCOVERY_ROUTE: "high_ticket_pdp_gap_first";
export declare const HIGH_TICKET_GAP_FIRST_TARGET_V1: "HIGH_TICKET_GAP_FIRST_TARGET_V1";
export type M982PriceBand = "150_750" | "100_149" | "750_2500" | "unknown";
export interface M982ProductQuery {
    query: string;
    familyId: string;
    familyLabel: string;
    archetypeId: string;
    productArchetype: string;
    expectedPriceBand: M982PriceBand;
    deepDiveRationale: string;
    lineage: string;
}
/** Parked for M9.8.2 — not removed from architecture. */
export declare const M982_PARKED_FAMILIES: readonly ["LOW_TICKET_ORAL_CARE", "SLEEP_COMFORT", "PET_PRODUCTS", "GENERIC_LED_FACE_MASK"];
export declare const M982_PRODUCT_QUERIES: M982ProductQuery[];
export declare const M982_DISCOVERY: {
    readonly milestone: "M9.8.2";
    readonly targetProfile: "HIGH_TICKET_GAP_FIRST_TARGET_V1";
    readonly maxSourceQueries: 16;
    readonly serpDepth: 50;
    readonly estimatedSerpCostPerKeyword: 0.006;
    readonly maxRawCandidates: 70;
    readonly maxValidPdpScreens: 50;
    readonly maxHighGapBusinessQual: 14;
    readonly maxPaidValidation: 8;
    readonly maxPreAuditFinalists: 5;
    readonly maxVisionScreens: 12;
    readonly priceHardRejectBelow: 60;
    readonly priceSoftMin: 100;
    readonly priceSweetSpotMin: 150;
    readonly priceSweetSpotMax: 750;
    readonly pricePremiumMax: 2500;
    readonly highGapVisualOrPurchase: 60;
    readonly highGapPurchaseMobile: 65;
    readonly showcaseVisualMin: 50;
    readonly showcaseSecondaryMin: 60;
    readonly showcaseGapFinalistMin: 70;
    readonly materialFinalistMin: 65;
    readonly earlySuccessCount: 3;
    readonly maxCroOnlyOpportunities: 5;
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
export declare function buildM982HarvestQueries(): M982ProductQuery[];
export declare const M983_DISCOVERY_VERSION: "HIGH_TICKET_GAP_COMPLETION_V1";
export declare const HAIR_SCALP_M983_STATUS: "CALIBRATED_PURCHASE_HEAVY_LOW_VISUAL";
export declare const M983_DISCOVERY: {
    readonly milestone: "M9.8.3";
    readonly maxRawCandidates: 50;
    readonly maxValidPdpScreens: 50;
    readonly maxCroOnlyOpportunities: 5;
    readonly targetProfile: "HIGH_TICKET_GAP_FIRST_TARGET_V1";
    readonly maxSourceQueries: 16;
    readonly serpDepth: 50;
    readonly estimatedSerpCostPerKeyword: 0.006;
    readonly maxHighGapBusinessQual: 14;
    readonly maxPaidValidation: 8;
    readonly maxPreAuditFinalists: 5;
    readonly maxVisionScreens: 12;
    readonly priceHardRejectBelow: 60;
    readonly priceSoftMin: 100;
    readonly priceSweetSpotMin: 150;
    readonly priceSweetSpotMax: 750;
    readonly pricePremiumMax: 2500;
    readonly highGapVisualOrPurchase: 60;
    readonly highGapPurchaseMobile: 65;
    readonly showcaseVisualMin: 50;
    readonly showcaseSecondaryMin: 60;
    readonly showcaseGapFinalistMin: 70;
    readonly materialFinalistMin: 65;
    readonly earlySuccessCount: 3;
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
export declare function inferExecutedQueriesFromCount(count: number): string[];
export declare function buildM983CompletionQueries(executedQueries: Set<string>): M982ProductQuery[];
//# sourceMappingURL=highTicketPdpGapFirst.d.ts.map