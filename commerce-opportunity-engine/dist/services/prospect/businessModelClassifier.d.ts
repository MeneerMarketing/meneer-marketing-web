/**
 * Milestone 9.8.1 — business model classification for sales-fit.
 */
export type BusinessModelClass = "DTC_OWN_BRAND" | "MOSTLY_OWN_BRAND" | "FOCUSED_SPECIALIST_RESELLER" | "GENERAL_RESELLER" | "GENERAL_RETAILER" | "UNKNOWN";
export declare function classifyBusinessModel(input: {
    domain: string;
    ownBrandSignal: number | null;
    catalogEstimate: number | null;
    catalogFocus: number | null;
    retailerScaleScore: number | null;
    retailerBreadthScore: number | null;
    businessType: string | null;
    estimatedCatalogSize: number | null;
    productUrl?: string | null;
    productTitle?: string | null;
}): {
    businessModel: BusinessModelClass;
    salesCandidate: boolean;
    rejectReason: string | null;
    evidence: string[];
};
export declare function catalogBandPenalty(catalogEstimate: number | null): {
    band: string;
    score: number;
    penalty: number;
};
//# sourceMappingURL=businessModelClassifier.d.ts.map