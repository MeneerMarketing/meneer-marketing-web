/**
 * Milestone 9.6 — early economic hard reject vs soft unknowns.
 */
export type BrandFirstGateInput = {
    businessType: string | null;
    isEcommerce: boolean | null;
    retailerScaleScore: number | null;
    firstPartyConfidence: number;
    estimatedCatalogSize: number | null;
    catalogVerified: boolean;
    heroPrice: number | null;
    heroProductUrl: string | null;
    heroConfidence: number | null;
};
export declare function evaluateBrandFirstEarlyGate(input: BrandFirstGateInput): {
    hardReject: boolean;
    reason: string | null;
};
export declare function passesBrandFirstEconomicQualified(input: {
    hardReject: boolean;
    firstPartyConfidence: number;
    brandScaleFit: number;
    heroPrice: number | null;
    ownBrandSignal: number | null;
    catalogFocusScore: number | null;
}): boolean;
export declare function passesBrandFirstEconomicQualifiedM961(input: {
    hardReject: boolean;
    firstPartyConfidence: number;
    brandScaleFit: number;
    heroPrice: number | null;
    ownBrandSignal: number | null;
    catalogFocusScore: number | null;
    purchaseMode: string;
}): boolean;
//# sourceMappingURL=brandFirstEarlyGate.d.ts.map