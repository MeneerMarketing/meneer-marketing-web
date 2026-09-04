/**
 * Milestone 9.5 — DESIGN_GAP_HIGH_TICKET_PROSPECT.
 *
 * Economic fit alone is not enough. The ideal prospect combines a serious
 * business, hero-product economics, usable source material, and a current PDP
 * that still looks generic or under-designed.
 */
export declare const DESIGN_GAP_PROFILE_VERSION: "DESIGN_GAP_HIGH_TICKET_PROSPECT_V1";
/** Central pre-audit gate before a domain may become CRO-audit-worthy. */
export declare const PREAUDIT_GATE_THRESHOLDS: {
    readonly highTicketFocusedFit: 70;
    readonly assetContentAvailability: 60;
    readonly preauditVisualGap: 60;
    readonly preauditPurchaseGap: 55;
    readonly previewCasePotential: 70;
};
/** Weights for preview_case_potential (sum = 1). */
export declare const PREVIEW_CASE_WEIGHTS: {
    readonly businessStrength: 0.14;
    readonly productEconomics: 0.16;
    readonly assetContent: 0.16;
    readonly contentAvailable: 0.1;
    readonly visualGap: 0.18;
    readonly purchaseGap: 0.14;
    readonly mobileGap: 0.08;
    readonly contrastCeiling: 0.1;
};
/** Minimum economic fit before cheap PDP viewport screening. */
export declare const ECONOMIC_PRESCREEN_THRESHOLDS: {
    readonly minHighTicketFit: 52;
    readonly minOwnBrandSignal: 42;
    readonly minHeroPricePreferred: 60;
    readonly minAssetProxy: 35;
};
//# sourceMappingURL=designGapProspect.d.ts.map