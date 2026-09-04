/**
 * Milestone 9.3.4 — the final ranking for "which prospect do we design for".
 *
 * Two separate questions, deliberately kept apart:
 *   the gate  — is this prospect allowed to be the design target at all
 *   the score — among the ones that are allowed, which one is strongest
 */
export interface DesignTargetGateInput {
    domain: string;
    currentPdpQuality: number | null;
    transformation: number | null;
    conceptContrast: number | null;
    assetReadiness: number | null;
    deepDiveFit: number | null;
    businessMaturity: number | null;
    auditConfidence: number | null;
    businessType: string | null;
    commercialProof: boolean;
    focusedBusiness: boolean;
    /** The audited page actually sells something: price and buy block present. */
    purchasablePage: boolean;
    excluded: boolean;
}
export interface DesignTargetGateResult {
    passed: boolean;
    blockers: string[];
    warnings: string[];
}
export declare function evaluateDesignTargetGate(input: DesignTargetGateInput): DesignTargetGateResult;
export interface TrueSalesDesignInput {
    conceptContrast: number | null;
    salesFit: number | null;
    economicFit: number | null;
    auditConfidence: number | null;
    contrastConfidence: number | null;
    outreachScoreConfidence: number | null;
}
export interface TrueSalesDesignResult {
    score: number;
    measurementConfidence: number;
    components: Record<string, number>;
    formula: string;
}
export declare function computeTrueSalesDesignScore(input: TrueSalesDesignInput): TrueSalesDesignResult;
//# sourceMappingURL=trueSalesDesignScore.d.ts.map