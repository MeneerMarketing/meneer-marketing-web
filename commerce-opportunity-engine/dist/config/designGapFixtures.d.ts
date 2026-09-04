/**
 * Milestone 9.5 — signal profiles for design-gap regression (no domain hardcoding).
 */
export type DesignGapFixtureProfile = {
    label: string;
    reasoning: string;
    highTicketFocusedFit: number;
    heroPrice: number;
    assetReadinessProxy: number;
    contentAvailableScore: number;
    contentPresentationQuality: number;
    preauditVisualGap: number;
    preauditPurchaseGap: number;
    mobileGapProxy: number;
    estimatedContrastCeiling: number;
    businessMaturity: number;
    ownBrandSignal: number;
    alreadyPolishedPenalty: number;
    /** Relative rank expectation vs other fixtures. */
    expectRankTier: "top" | "mid" | "bottom";
    expectPreauditGate: boolean;
};
export declare const DESIGN_GAP_FIXTURES: DesignGapFixtureProfile[];
//# sourceMappingURL=designGapFixtures.d.ts.map