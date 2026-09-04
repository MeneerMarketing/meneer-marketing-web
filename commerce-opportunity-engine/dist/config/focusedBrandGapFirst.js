/**
 * Milestone 9.9 — FOCUSED_BRAND_GAP_FIRST_V1 (primary commercial prospect preset).
 *
 * Product price is a commercial signal, never a hard acquisition gate.
 * Business model + company scale + catalog focus dominate economics.
 */
export const FOCUSED_BRAND_GAP_FIRST_TARGET_V1 = "FOCUSED_BRAND_GAP_FIRST_V1";
export const FOCUSED_BRAND_DISCOVERY_VERSION = "FOCUSED_BRAND_GAP_FIRST_V1";
export const FOCUSED_BRAND_DISCOVERY_ROUTE = "focused_brand_pdp_gap_first";
/** Secondary preset — high-ticket economics optional, not default acquisition mode. */
export const HIGH_TICKET_GAP_FIRST_TARGET_V1 = "HIGH_TICKET_GAP_FIRST_TARGET_V1";
export const FOCUSED_BRAND_CATALOG_BANDS = [
    { min: 1, max: 10, score: 72, label: "1_10_possible" },
    { min: 11, max: 30, score: 98, label: "11_30_very_strong" },
    { min: 31, max: 60, score: 88, label: "31_60_strong" },
    { min: 61, max: 100, score: 74, label: "61_100_good" },
    { min: 101, max: 200, score: 52, label: "101_200_penalty" },
    { min: 201, max: 999999, score: 22, label: "200_plus_penalty" },
];
export const FOCUSED_BRAND_THRESHOLDS = {
    /** Below this focused_brand_sales_fit is not a strong sales prospect. */
    strongSalesProspectMin: 58,
    /** Showcase design candidate minimum showcase gap (visual transformation). */
    showcaseDesignShowcaseMin: 65,
    showcaseDesignVisualMin: 50,
    showcaseDesignPurchaseOrMobileMin: 60,
    showcaseDesignMaterialMin: 60,
    strongSalesMaterialMin: 55,
    strongSalesGapMin: 55,
    companyScaleRejectBelow: 22,
    companyScalePreferMin: 38,
    catalogFocusPreferMin: 40,
    amateurMaturityBelow: 24,
    hugeCatalogPenaltyAbove: 200,
};
export const FOCUSED_BRAND_SALES_FIT_WEIGHTS = {
    pdpDesignOpportunity: 0.28,
    businessModelOwnBrand: 0.22,
    companyScaleFit: 0.14,
    materialFeasibility: 0.14,
    catalogFocus: 0.1,
    productStoryQuality: 0.12,
    businessMaturity: 0.05,
    paidCommercialEvidence: 0.04,
    productPriceSignal: 0.03,
};
export const FOCUSED_BRAND_REPORT_PATH = "reports/focused-brand-gap-rescore-report.json";
export const FOCUSED_BRAND_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/focused-brand-gap-rescore-report.json";
export function catalogBandForFocusedBrand(size) {
    if (size == null)
        return { score: 50, label: "unknown", penalty: 0 };
    for (const band of FOCUSED_BRAND_CATALOG_BANDS) {
        if (size >= band.min && size <= band.max) {
            const penalty = size > 200 ? 28 : size > 100 ? 12 : size > 60 ? 4 : 0;
            return { score: band.score, label: band.label, penalty };
        }
    }
    return { score: 22, label: "200_plus_penalty", penalty: 28 };
}
//# sourceMappingURL=focusedBrandGapFirst.js.map