/**
 * Milestone 9 — catalog intelligence from existing DB signals only.
 * No live crawls / DataForSEO. Unknowns stay UNKNOWN.
 */
import type { CatalogSizeTier } from "../../config/conceptScoring.js";
export type CatalogIntelligenceInput = {
    businessType: string | null;
    retailerScaleScore: number | null;
    productMerchantRelationship: string | null;
    domain: string;
    pageCountForBrand: number;
    distinctProductBrandsOnPages: number;
    hasProductPage: boolean;
    crawlMetadata: Record<string, unknown> | null;
    /** When scale is missing/low, high maturity often implies larger catalog. */
    businessMaturityHint?: number | null;
};
export type CatalogIntelligenceResult = {
    estimated_product_count: number | null;
    estimated_category_count: number | null;
    estimated_brand_count: number | null;
    catalog_focus_score: number;
    catalog_size_tier: CatalogSizeTier;
    catalog_confidence: number;
    evidence: string[];
};
export declare function scoreCatalogIntelligence(input: CatalogIntelligenceInput): CatalogIntelligenceResult;
//# sourceMappingURL=catalogIntelligence.d.ts.map