/**
 * Milestone 9.9.7 — catalog compactness, coherence, and business breadth scoring.
 */
export type CatalogConfidence = "MEASURED" | "INFERRED" | "UNKNOWN";
export type CatalogBreadthMetrics = {
    catalogEstimate: number | null;
    catalogConfidence: CatalogConfidence;
    catalogCompactnessScore: number;
    catalogCoherenceScore: number;
    businessBreadthScore: number;
    categoryBreadth: number;
    externalBrandBreadth: number;
    navigationBreadth: number;
    productFamilySpread: number;
    evidence: string[];
};
/** HIGH = compact/focused boutique. LOW = broad webshop. */
export declare function computeBusinessBreadthScore(metrics: {
    catalogCompactnessScore: number;
    catalogCoherenceScore: number;
    companyScaleFit: number | null;
    categoryLinks: number;
    catalogEstimate: number | null;
}): number;
export declare function computeCatalogBreadthMetrics(input: {
    catalogEstimate: number | null;
    catalogVerified: boolean;
    catalogFocusScore: number | null;
    categoryLinks: number;
    productLinks: number;
    externalBrandBreadth: number | null;
    companyScaleFit: number | null;
    homepageHtml?: string | null;
}): CatalogBreadthMetrics;
//# sourceMappingURL=catalogBreadthScoring.d.ts.map