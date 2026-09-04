/**
 * Milestone 9.4 — estimated_contrast_ceiling.
 *
 * M9.3.4 paid for the lesson: an audit on a shop whose product page is already
 * polished can only end in a low concept contrast, and by then the money is
 * gone. This estimates the ceiling from the free signals we collect during
 * discovery, so the expensive audits go to pages that can actually be beaten.
 *
 * It is an upper bound on plausible contrast, not a prediction of it. A real
 * audit may land far below the ceiling; it should rarely land above.
 */
export interface ContrastCeilingInput {
    /** 0-100, high means the current page leaves a lot on the table. */
    pdpWeaknessProxy: number | null;
    /** 0-100, how much material there is to build a premium page from. */
    assetReadinessProxy: number | null;
    /** 0-100 product-type suitability for a deep-dive page. */
    deepDivePdpFitProxy: number | null;
    ownBrandSignal: number | null;
    heroPrice: number | null;
}
export interface ContrastCeilingResult {
    estimatedContrastCeiling: number;
    clearsDesignTarget: boolean;
    evidence: string[];
}
export declare function estimateContrastCeiling(input: ContrastCeilingInput): ContrastCeilingResult;
//# sourceMappingURL=estimatedContrastCeiling.d.ts.map