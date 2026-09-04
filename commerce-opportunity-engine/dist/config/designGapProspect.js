/**
 * Milestone 9.5 — DESIGN_GAP_HIGH_TICKET_PROSPECT.
 *
 * Economic fit alone is not enough. The ideal prospect combines a serious
 * business, hero-product economics, usable source material, and a current PDP
 * that still looks generic or under-designed.
 */
export const DESIGN_GAP_PROFILE_VERSION = "DESIGN_GAP_HIGH_TICKET_PROSPECT_V1";
/** Central pre-audit gate before a domain may become CRO-audit-worthy. */
export const PREAUDIT_GATE_THRESHOLDS = {
    highTicketFocusedFit: 70,
    assetContentAvailability: 60,
    preauditVisualGap: 60,
    preauditPurchaseGap: 55,
    previewCasePotential: 70,
};
/** Weights for preview_case_potential (sum = 1). */
export const PREVIEW_CASE_WEIGHTS = {
    businessStrength: 0.14,
    productEconomics: 0.16,
    assetContent: 0.16,
    contentAvailable: 0.1,
    visualGap: 0.18,
    purchaseGap: 0.14,
    mobileGap: 0.08,
    contrastCeiling: 0.1,
};
/** Minimum economic fit before cheap PDP viewport screening. */
export const ECONOMIC_PRESCREEN_THRESHOLDS = {
    minHighTicketFit: 52,
    minOwnBrandSignal: 42,
    minHeroPricePreferred: 60,
    minAssetProxy: 35,
};
//# sourceMappingURL=designGapProspect.js.map