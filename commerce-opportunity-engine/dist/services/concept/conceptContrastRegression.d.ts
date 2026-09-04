/**
 * Milestone 9.3.4 — guards the contrast logic against its fixtures.
 *
 * Two failure modes matter. Losing the ceiling would let polished premium
 * brands back into the design pilot. Over-tightening would push good businesses
 * with plain pages out of it. The fixtures check both directions.
 */
export interface ContrastRegressionCase {
    label: string;
    score: number;
    band: string;
    confidence: number;
    designTarget: boolean;
    passed: boolean;
    detail: string;
    ceilingApplied: string | null;
}
export interface ContrastRegressionResult {
    passed: number;
    total: number;
    cases: ContrastRegressionCase[];
}
export declare function runConceptContrastRegression(): ContrastRegressionResult;
//# sourceMappingURL=conceptContrastRegression.d.ts.map