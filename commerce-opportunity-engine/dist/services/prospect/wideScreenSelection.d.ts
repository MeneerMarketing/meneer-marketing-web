/**
 * Milestone 9.5.1 — hard exclusion vs soft economic ranking for wide screen.
 */
export type WideScreenPoolEntry = {
    domain: string;
    businessType: string | null;
    isEcommerce: boolean | null;
    prospectClass: string;
    retailerScaleScore: number | null;
    businessMaturityScore: number | null;
    ownBrandSignal: number | null;
    catalogVerified: boolean;
    estimatedCatalogSize: number | null;
    catalogFocusScore: number | null;
    highTicketFitScore: number | null;
    heroPrice: number | null;
    heroProductUrl: string | null;
    adKeywordCount: number;
    platform: string | null;
};
export type HardExclusionResult = {
    excluded: boolean;
    reason: string | null;
};
export declare function evaluateHardExclusion(entry: WideScreenPoolEntry): HardExclusionResult;
/** M9.5 strict economic pre-screen (for false-negative comparison). */
export declare function passesOldEconomicPrescreen(entry: WideScreenPoolEntry): boolean;
export declare function softWideScreenRank(entry: WideScreenPoolEntry): number;
//# sourceMappingURL=wideScreenSelection.d.ts.map