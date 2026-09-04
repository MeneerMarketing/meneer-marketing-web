/**
 * Milestone 9.9.6 — human-readable showcase review synthesis (no new vision).
 */
export type BeforeAfterObvious = "YES_STRONG" | "YES" | "MAYBE" | "NO";
export type MaterialQualityClass = "EXCELLENT_MATERIAL" | "GOOD_MATERIAL" | "ENOUGH_MATERIAL" | "WEAK_MATERIAL";
export type HumanFinalClassification = "AUDIT_NEXT" | "KEEP_AS_BACKUP" | "REJECT_TOO_GOOD_VISUALLY" | "REJECT_BUSINESS_FIT" | "REJECT_MATERIAL" | "REJECT_PDP_INVALID";
type ReviewInput = {
    domain: string;
    productTitle: string | null;
    heroPrice: number | null;
    showcasePageEntityType: string;
    captureHealth: string;
    visionScoreAllowed: boolean;
    businessModel: string;
    refinedBusinessModel: string;
    brandOwnershipConfidence: number | null;
    brandOwnershipEvidence: string[];
    companyScaleFit: number | null;
    catalogEstimate: number | null;
    catalogFocus: number | null;
    externalBrandBreadth: number | null;
    businessMaturityScore: number | null;
    currentVisualQualityScore: number | null;
    visualGap: number | null;
    purchaseGap: number | null;
    mobileGap: number | null;
    materialFeasibility: number | null;
    assetQuality: number | null;
    contentAvailable: number | null;
    currentSiteImpression: string | null;
    manualRationale: {
        currentLook?: string;
        whyVisuallyWeak?: string;
        whyBusinessGood?: string;
        whatWeCouldTransform?: string;
    } | null;
    crossDomainProductMatch?: string | null;
    whyGoodProspect?: string | null;
};
export declare function classifyMaterialQuality(input: ReviewInput): MaterialQualityClass;
export declare function assessBeforeAfterObvious(input: ReviewInput): BeforeAfterObvious;
export declare function synthesizeHomepageReview(input: ReviewInput): string;
export declare function synthesizePdpReview(input: ReviewInput): {
    templateVsCustom: string;
    hierarchy: string;
    gallery: string;
    buyblock: string;
    typography: string;
    spacing: string;
    trust: string;
    storytelling: string;
    sections: string;
    mobile: string;
    summary: string;
};
export declare function listRedesignChanges(input: ReviewInput): string[];
export declare function assessBusinessRisk(input: ReviewInput): string;
export declare function wouldApproachBusiness(input: ReviewInput): {
    answer: "YES" | "MAYBE" | "NO";
    note: string;
};
export declare function classifyMaterialBreakdown(input: ReviewInput): Record<string, string>;
export declare function assignFinalClassification(candidates: Array<{
    domain: string;
    pdpValid: boolean;
    beforeAfter: BeforeAfterObvious;
    material: MaterialQualityClass;
    approach: "YES" | "MAYBE" | "NO";
    visualFitScore: number;
}>): Array<{
    domain: string;
    classification: HumanFinalClassification;
    reason: string;
}>;
export declare function visualFitScoreForRanking(input: ReviewInput): number;
export {};
//# sourceMappingURL=humanShowcaseReview.d.ts.map