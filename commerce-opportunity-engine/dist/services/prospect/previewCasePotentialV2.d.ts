/**
 * Milestone 9.5.1 — preview_case_potential_v2.
 *
 * Visual gap stays visible even when catalog/own-brand/maturity are unknown.
 * Confidence is reported separately from the score.
 */
export type FieldConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export type PreviewCaseV2Input = {
    rawDesignGapOpportunity: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    highTicketFocusedFit: number | null;
    companyScaleFit: number | null;
    businessMaturity: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    estimatedCatalogSize: number | null;
    ownBrandSignal: number | null;
    heroPrice: number | null;
    heroPriceConfidence: FieldConfidence;
    assetReadinessProxy: number | null;
    contentAvailableScore: number | null;
    adKeywordCount: number;
    businessType: string | null;
};
export type PreviewCaseV2Result = {
    economicFitScore: number;
    previewCasePotentialV2: number;
    overallConfidence: FieldConfidence;
    confidenceFactors: Record<string, FieldConfidence>;
};
export declare function computePreviewCasePotentialV2(input: PreviewCaseV2Input): PreviewCaseV2Result;
//# sourceMappingURL=previewCasePotentialV2.d.ts.map