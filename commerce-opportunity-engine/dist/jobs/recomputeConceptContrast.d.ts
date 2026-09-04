/**
 * Milestone 9.3.4 — apply concept_contrast_potential to the whole existing pool.
 *
 * Business classification says what a shop is. Contrast says whether a preview
 * of its product page would impress anyone. This job scores every concept
 * candidate on that second question, stores it, and reports which candidates
 * change eligibility because of it.
 *
 * Deterministic. No DataForSEO, no Anthropic, no outreach.
 */
import { type ContrastRegressionResult } from "../services/concept/conceptContrastRegression.js";
type ContrastRow = {
    domain: string;
    conceptId: string;
    band: string;
    contrast: number;
    confidence: number;
    ceiling: string | null;
    roomScore: number;
    capabilityScore: number;
    currentPdpQuality: number | null;
    transformation: number | null;
    salesFit: number;
    croDataSource: string;
    designTargetEligible: boolean;
    outreachEligible: boolean;
    blockedOnContrastOnly: boolean;
    blockedReasons: string[];
    evidence: string[];
};
export type ContrastReport = {
    milestone: "M9.3.4";
    finishedAt: string;
    thresholds: {
        designTarget: number;
        outreach: number;
    };
    regression: ContrastRegressionResult;
    scored: number;
    persisted: number;
    bandCounts: Record<string, number>;
    designTargetEligible: number;
    newlyBlocked: ContrastRow[];
    rows: ContrastRow[];
};
export declare function recomputeConceptContrast(): Promise<ContrastReport>;
export {};
//# sourceMappingURL=recomputeConceptContrast.d.ts.map