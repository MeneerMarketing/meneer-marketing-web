/**
 * Milestone 9.9 — FOCUSED_BRAND_GAP_FIRST_V1 (primary commercial prospect preset).
 *
 * Product price is a commercial signal, never a hard acquisition gate.
 * Business model + company scale + catalog focus dominate economics.
 */
export declare const FOCUSED_BRAND_GAP_FIRST_TARGET_V1: "FOCUSED_BRAND_GAP_FIRST_V1";
export declare const FOCUSED_BRAND_DISCOVERY_VERSION: "FOCUSED_BRAND_GAP_FIRST_V1";
export declare const FOCUSED_BRAND_DISCOVERY_ROUTE: "focused_brand_pdp_gap_first";
/** Secondary preset — high-ticket economics optional, not default acquisition mode. */
export declare const HIGH_TICKET_GAP_FIRST_TARGET_V1: "HIGH_TICKET_GAP_FIRST_TARGET_V1";
export declare const FOCUSED_BRAND_CATALOG_BANDS: readonly [{
    readonly min: 1;
    readonly max: 10;
    readonly score: 72;
    readonly label: "1_10_possible";
}, {
    readonly min: 11;
    readonly max: 30;
    readonly score: 98;
    readonly label: "11_30_very_strong";
}, {
    readonly min: 31;
    readonly max: 60;
    readonly score: 88;
    readonly label: "31_60_strong";
}, {
    readonly min: 61;
    readonly max: 100;
    readonly score: 74;
    readonly label: "61_100_good";
}, {
    readonly min: 101;
    readonly max: 200;
    readonly score: 52;
    readonly label: "101_200_penalty";
}, {
    readonly min: 201;
    readonly max: 999999;
    readonly score: 22;
    readonly label: "200_plus_penalty";
}];
export declare const FOCUSED_BRAND_THRESHOLDS: {
    /** Below this focused_brand_sales_fit is not a strong sales prospect. */
    readonly strongSalesProspectMin: 58;
    /** Showcase design candidate minimum showcase gap (visual transformation). */
    readonly showcaseDesignShowcaseMin: 65;
    readonly showcaseDesignVisualMin: 50;
    readonly showcaseDesignPurchaseOrMobileMin: 60;
    readonly showcaseDesignMaterialMin: 60;
    readonly strongSalesMaterialMin: 55;
    readonly strongSalesGapMin: 55;
    readonly companyScaleRejectBelow: 22;
    readonly companyScalePreferMin: 38;
    readonly catalogFocusPreferMin: 40;
    readonly amateurMaturityBelow: 24;
    readonly hugeCatalogPenaltyAbove: 200;
};
export declare const FOCUSED_BRAND_SALES_FIT_WEIGHTS: {
    readonly pdpDesignOpportunity: 0.28;
    readonly businessModelOwnBrand: 0.22;
    readonly companyScaleFit: 0.14;
    readonly materialFeasibility: 0.14;
    readonly catalogFocus: 0.1;
    readonly productStoryQuality: 0.12;
    readonly businessMaturity: 0.05;
    readonly paidCommercialEvidence: 0.04;
    readonly productPriceSignal: 0.03;
};
export declare const FOCUSED_BRAND_REPORT_PATH = "reports/focused-brand-gap-rescore-report.json";
export declare const FOCUSED_BRAND_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/focused-brand-gap-rescore-report.json";
export declare function catalogBandForFocusedBrand(size: number | null): {
    score: number;
    label: string;
    penalty: number;
};
//# sourceMappingURL=focusedBrandGapFirst.d.ts.map