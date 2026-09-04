/**
 * Milestone 9.6 — brand_first_opportunity_score with separate components.
 */
export type BrandFirstOpportunityInput = {
    brandScaleFit: number | null;
    firstPartyConfidence: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    estimatedCatalogSize: number | null;
    ownBrandSignal: number | null;
    heroPrice: number | null;
    heroConfidence: number | null;
    productStoryPotential: number | null;
    assetContentAvailability: number | null;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    mobileGap: number | null;
    contentPresentationQuality: number | null;
    paidAcquisitionBonus: number;
};
export type BrandFirstOpportunityResult = {
    brandFirstOpportunityScore: number;
    components: {
        brandQuality: number;
        companyScaleFit: number;
        catalogFocus: number;
        ownBrand: number;
        heroEconomics: number;
        productStoryPotential: number;
        assetContentAvailability: number;
        presentationGap: number;
        purchaseGap: number;
        mobileGap: number;
    };
    sweetSpotProfile: "IDEAL" | "STRONG_BUSINESS_WEAK_GAP" | "STRONG_GAP_WEAK_BUSINESS" | "MIXED";
    evidence: string[];
};
export declare function computeBrandFirstOpportunityScore(input: BrandFirstOpportunityInput): BrandFirstOpportunityResult;
//# sourceMappingURL=brandFirstOpportunityScore.d.ts.map