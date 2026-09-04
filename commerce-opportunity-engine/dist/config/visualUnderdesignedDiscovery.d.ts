/**
 * Milestone 9.9.2 — visually underdesigned focused brand search.
 */
export declare const M992_DISCOVERY_VERSION: "VISUALLY_UNDERDESIGNED_FOCUSED_BRAND_V1";
export declare const M992_DISCOVERY_ROUTE: "visual_underdesigned_pdp_gap_first";
export interface M992ProductQuery {
    query: string;
    familyId: string;
    familyLabel: string;
    productArchetype: string;
    lineage: string;
}
/** Parked — not first-case targets. */
export declare const M992_PARKED_FAMILIES: readonly ["SLEEP_COMFORT", "PET_PRODUCTS"];
/** Broad ecommerce niches — avoid device-heavy M9.8.2 pools. */
export declare const M992_PRODUCT_QUERIES: M992ProductQuery[];
export declare const M992_DISCOVERY: {
    readonly milestone: "M9.9.2";
    readonly targetProfile: "FOCUSED_BRAND_GAP_FIRST_V1";
    readonly maxSourceQueries: 18;
    readonly serpDepth: 50;
    readonly estimatedSerpCostPerKeyword: 0.006;
    readonly maxRawCandidates: 90;
    readonly maxValidPdpScreens: 60;
    readonly maxVisuallyWeakBusinessQual: 22;
    readonly maxVisionScreens: 55;
    readonly maxShowcaseCandidates: 10;
    readonly maxShowcaseScreenshots: 5;
    readonly maxCroOnlyListed: 8;
    readonly currentVisualQualityShowcaseMax: 55;
    readonly currentVisualQualityIdealMax: 45;
    readonly crawlTimeoutMs: 18000;
    readonly screenshotDir: "m9.9.2-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 18000;
};
export declare function buildM992HarvestQueries(): M992ProductQuery[];
export declare const M992_REPORT_PATH = "reports/visual-underdesigned-focused-brand-report.json";
export declare const M992_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/visual-underdesigned-focused-brand-report.json";
//# sourceMappingURL=visualUnderdesignedDiscovery.d.ts.map