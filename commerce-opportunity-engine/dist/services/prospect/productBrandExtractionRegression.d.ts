/**
 * Milestone 9.6.1 — retailer → brand extraction regression (no API).
 */
export type ExtractionRegressionCase = {
    id: string;
    label: string;
    passed: boolean;
    detail: string;
};
export type ExtractionRegressionResult = {
    passed: number;
    total: number;
    cases: ExtractionRegressionCase[];
};
export declare function runProductBrandExtractionRegression(): ExtractionRegressionResult;
//# sourceMappingURL=productBrandExtractionRegression.d.ts.map