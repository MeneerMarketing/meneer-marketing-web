/**
 * Milestone 9.6 — brand_scale_fit_score (0-100).
 */
export interface BrandScaleFitInput {
    businessType: string | null;
    isEcommerce: boolean | null;
    retailerScaleScore: number | null;
    retailerBreadthScore: number | null;
    businessMaturityScore: number | null;
    estimatedCatalogSize: number | null;
    homepageProductLinks: number;
    ownBrandSignal: number | null;
    firstPartyBrandConfidence: number | null;
}
export interface BrandScaleFitResult {
    brandScaleFitScore: number;
    band: "AMATEUR" | "SMALL_BRAND" | "MID_BRAND" | "LARGE_PLAYER" | "UNKNOWN";
    evidence: string[];
}
export declare function computeBrandScaleFit(input: BrandScaleFitInput): BrandScaleFitResult;
//# sourceMappingURL=brandScaleFit.d.ts.map