/**
 * Milestone 9.5 — preview_case_potential (0-100).
 *
 * Primary pre-audit ranking score. Business strength matters, but visual and
 * purchase gaps weigh heavily so polished pages do not float to the top.
 */
export type PreviewCaseInput = {
    highTicketFocusedFit: number | null;
    heroPrice: number | null;
    assetReadinessProxy: number | null;
    contentAvailableScore: number | null;
    contentPresentationQuality: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGapProxy: number | null;
    estimatedContrastCeiling: number | null;
    businessMaturity: number | null;
    ownBrandSignal: number | null;
    alreadyPolishedPenalty: number;
};
export declare function computePreviewCasePotential(input: PreviewCaseInput): {
    score: number;
    evidence: string[];
    passesPreauditGate: boolean;
    gateFailures: string[];
};
//# sourceMappingURL=previewCasePotential.d.ts.map