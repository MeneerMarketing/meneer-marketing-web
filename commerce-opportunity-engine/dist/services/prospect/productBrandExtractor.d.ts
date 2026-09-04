/**
 * Milestone 9.6 — retailer → product brand → official domain extraction.
 */
import type { EntityRole } from "../../config/brandFirstHighTicket.js";
export type BrandExtractionResult = {
    entityRole: EntityRole;
    merchantDomain: string | null;
    productBrandName: string | null;
    officialBrandDomain: string | null;
    evidence: string[];
};
export declare function extractProductBrandName(title: string | null): string | null;
/** When SERP title names a product brand that does not match the merchant domain. */
export declare function titleSuggestsThirdPartyProduct(normalizedDomain: string, title: string | null): boolean;
export declare function classifyOrganicEntitySync(input: {
    normalizedDomain: string;
    title: string | null;
    likelyRetailer: boolean;
    resolvedOfficialDomain?: string | null;
}): BrandExtractionResult;
export declare function resolveOfficialBrandDomain(brandName: string, timeoutMs: number): Promise<{
    domain: string | null;
    evidence: string[];
}>;
export declare function classifyOrganicEntity(input: {
    normalizedDomain: string;
    title: string | null;
    likelyRetailer: boolean;
    timeoutMs: number;
}): Promise<BrandExtractionResult>;
//# sourceMappingURL=productBrandExtractor.d.ts.map