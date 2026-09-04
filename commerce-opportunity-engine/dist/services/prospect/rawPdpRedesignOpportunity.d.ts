/**
 * Milestone 9.8 — raw_pdp_redesign_opportunity (gap-only, no business weighting).
 */
export declare function computeAssetQualityProxy(input: {
    imageCount: number;
    videoPresent: boolean;
    featuresPresent: boolean;
    faqPresent: boolean;
}): number;
export declare function computeBrandDistinctivenessProxy(input: {
    styledBlocks: number;
    listOnlyBlocks: number;
    contentPresentationQuality: number | null;
}): number;
export declare function computeRawPdpRedesignOpportunity(input: {
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    contentAvailableScore: number | null;
    contentPresentationQuality: number | null;
    assetQualityProxy: number | null;
    brandDistinctivenessProxy: number | null;
}): {
    score: number;
    evidence: string[];
    materialSweetSpot: boolean;
};
//# sourceMappingURL=rawPdpRedesignOpportunity.d.ts.map