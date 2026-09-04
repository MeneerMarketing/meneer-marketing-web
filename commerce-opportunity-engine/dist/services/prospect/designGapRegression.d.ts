/**
 * Milestone 9.5 — regression for preview_case_potential ranking.
 */
export interface DesignGapRegressionCase {
    label: string;
    previewCasePotential: number;
    passesPreauditGate: boolean;
    passed: boolean;
    detail: string;
}
export interface DesignGapRegressionResult {
    passed: number;
    total: number;
    cases: DesignGapRegressionCase[];
    rankingOk: boolean;
}
export declare function runDesignGapRegression(): DesignGapRegressionResult;
//# sourceMappingURL=designGapRegression.d.ts.map