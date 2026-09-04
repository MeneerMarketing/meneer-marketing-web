/**
 * Milestone 9.7 — product entity extraction from third-party SERP rows.
 */
export declare const GENERIC_BRAND_BLOCKLIST: Set<string>;
export type ThirdPartyProductExtraction = {
    productBrand: string | null;
    productTitle: string | null;
    productModel: string | null;
    observedPrice: number | null;
    currency: string | null;
    productBrandConfidence: number;
    evidence: string[];
};
export declare function isPlausibleMinedBrand(name: string | null): boolean;
export declare function extractThirdPartyProductEntity(input: {
    title: string | null;
    description: string | null;
    rawItem?: Record<string, unknown>;
}): ThirdPartyProductExtraction;
//# sourceMappingURL=thirdPartyProductExtractor.d.ts.map