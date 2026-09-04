/**
 * Milestone 9.3.2 — versioned business classification recompute.
 *
 * Brands carrying an older classifier version are re-derived through the normal
 * classifier architecture. Domains where the structural verdict is decisive are
 * corrected immediately at zero API cost. The rest are stamped and flagged so
 * the next crawl cycle refreshes them.
 *
 * No per-domain patches. No DataForSEO. No Anthropic.
 */
import { type ClassifierRegressionResult } from "../services/crawler/businessClassifierRegression.js";
export interface RecomputeSummary {
    scanned: number;
    /** Corrections made in this pass. */
    corrected: number;
    /** All domains this classifier generation holds a corrected verdict on. */
    correctedTotal: number;
    flaggedForRecrawl: number;
    unchanged: number;
    corrections: Array<{
        domain: string;
        from: string | null;
        to: string;
        reason: string;
    }>;
    regressionPassed: number;
    regressionTotal: number;
    /** Exclusions withdrawn because the rule behind them was retired. */
    reverted: number;
    revertedDomains: Array<{
        domain: string;
        from: string;
        reason: string;
    }>;
    /** Gate verdicts left behind by a classification that was withdrawn. */
    staleGateStampsCleared: number;
    staleGateStampDomains: Array<{
        domain: string;
        from: string;
    }>;
    /** Website classifier fixtures: guards the breadth vs international split. */
    classifierRegression: ClassifierRegressionResult;
}
export declare function recomputeBusinessClassification(options?: {
    onlyDomains?: string[];
    limit?: number;
}): Promise<RecomputeSummary>;
//# sourceMappingURL=recomputeBusinessClassification.d.ts.map