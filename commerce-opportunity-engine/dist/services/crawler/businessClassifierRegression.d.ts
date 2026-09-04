/**
 * Milestone 9.3.3 — runs the website classifier against its regression
 * fixtures. Used by the recompute job so a classifier change cannot silently
 * reintroduce the international-equals-mass-retailer bug.
 */
export interface ClassifierRegressionCase {
    label: string;
    domain: string;
    verdict: string;
    passed: boolean;
    detail: string;
    internationalPresenceScore: number;
    categoryBreadthScore: number;
    retailerBreadthScore: number;
}
export interface ClassifierRegressionResult {
    passed: number;
    total: number;
    cases: ClassifierRegressionCase[];
}
export declare function runBusinessClassifierRegression(): ClassifierRegressionResult;
//# sourceMappingURL=businessClassifierRegression.d.ts.map