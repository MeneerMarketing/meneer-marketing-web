/**
 * Milestone 9.3 — early reject / deprioritize before expensive steps.
 */
export type IdealPrequalInput = {
    domain: string;
    isEcommerce: boolean;
    businessType: string | null;
    platform: string | null;
    retailerScaleScore: number | null;
    estimatedProductCount: number | null;
    estimatedBrandCount: number | null;
    brandCommerceModel: string;
    manualExcluded: boolean;
    businessMaturityScore: number | null;
    /** Breadth signals from the discovery run, used to catch unlisted chains. */
    categorySpread?: number | null;
    keywordSpread?: number | null;
};
export declare function evaluateIdealProspectPrequal(input: IdealPrequalInput): {
    accepted: boolean;
    reason: string;
    deprioritized: boolean;
};
export declare function isExistingBrandDedupeSkip(domain: string, existingDomains: Set<string>): boolean;
export declare const IDEAL_TRANSPARENCY_MAX: 12;
//# sourceMappingURL=idealProspectPrequal.d.ts.map