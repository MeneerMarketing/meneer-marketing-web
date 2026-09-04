/**
 * Milestone 9.7 — THIRD_PARTY_BRAND_MINING configuration.
 */
export declare const M97_DISCOVERY_VERSION: "THIRD_PARTY_BRAND_MINING_V1";
export declare const M97_DISCOVERY_ROUTE: "third_party_brand_mining";
export type ThirdPartySourceType = "SPECIALIST_RETAILER" | "MULTIBRAND_RETAILER" | "MARKETPLACE_PRODUCT_RESULT" | "EDITORIAL_PRODUCT_PAGE" | "REVIEW_ROUNDUP_PAGE" | "SHOPPING_PRODUCT_RESULT";
export type FirstPartyStoreClass = "DTC_ECOMMERCE" | "BRAND_INFORMATION_ONLY" | "B2B_ONLY" | "DISTRIBUTOR_ONLY" | "UNKNOWN";
export type OfficialDomainStatus = "RESOLVED" | "UNRESOLVED_BRAND_DOMAIN";
export interface M97ProductFamily {
    id: string;
    label: string;
    archetypeId: string;
    queries: string[];
}
export declare const M97_PRODUCT_FAMILIES: M97ProductFamily[];
export declare const M97_DISCOVERY: {
    readonly milestone: "M9.7";
    readonly maxSourceQueries: 12;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly maxExtractedBrands: 40;
    readonly maxOfficialResolutions: 20;
    readonly maxEconomicQualified: 12;
    readonly maxDesignGapScreens: 8;
    readonly maxPaidValidation: 8;
    readonly maxManualReview: 5;
    readonly maxVisionScreens: 8;
    readonly minProductBrandConfidence: 52;
    readonly minOfficialDomainConfidence: 58;
    readonly crawlTimeoutMs: 20000;
    readonly resolutionTimeoutMs: 10000;
    readonly screenshotDir: "m9.7-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 45000;
    readonly paidValidationKeywordsPerBrand: 2;
};
export declare function buildM97SourceQueries(): Array<{
    query: string;
    familyId: string;
    familyLabel: string;
    archetypeId: string;
}>;
//# sourceMappingURL=thirdPartyBrandMining.d.ts.map