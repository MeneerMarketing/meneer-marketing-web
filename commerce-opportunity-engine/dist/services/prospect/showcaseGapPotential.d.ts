/**
 * Milestone 9.8.2 — showcase_gap_potential for visible before/after preview potential.
 */
export declare function computeShowcaseGapPotential(input: {
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    contentAvailable: number | null;
    contentPresentation: number | null;
    assetQualityProxy: number | null;
}): {
    score: number;
    evidence: string[];
    showcaseReady: boolean;
};
export declare function isHighGapCandidate(input: {
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    rawPdpRedesignOpportunity: number | null;
}): boolean;
//# sourceMappingURL=showcaseGapPotential.d.ts.map