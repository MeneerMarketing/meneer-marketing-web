import { type CroAuditType, type KeywordIntent, type OpportunityVerdict } from "../../config/scoringWeights.js";
import type { CroAuditAiResponse, CroQualityScores } from "../../types/audit.js";
export interface OpportunityScoreInput {
    auditType: CroAuditType;
    ai: CroAuditAiResponse;
    confirmedPaid: boolean;
    confirmedGoogleAdvertiser?: boolean;
    paidSignalType: string | null;
    businessMaturityScore: number | null;
    retailerScaleScore: number | null;
    platform: string | null;
    platformCandidate: string | null;
    productPrice: number | null;
    reviewCount: number | null;
    hasProductPage: boolean;
    sourceQualityScore?: number | null;
    sourceType?: string | null;
    keywordIntent: KeywordIntent;
    /** Supported findings only should influence gap interpretation; quality scores still primary. */
    supportedLeakCount?: number;
    unsupportedLeakCount?: number;
}
export interface OpportunityScoreResult {
    opportunityScore: number;
    verdict: OpportunityVerdict;
    croGap: number;
    adLandingGap: number | null;
    designTrustGap: number;
    rebuildPotential: number;
    components: Record<string, number>;
    penalty: number;
    keywordIntentPenalty: number;
    formula: string;
    uncappedScore: number;
    sourceQualityCap: number | null;
    formulaLines: Array<{
        label: string;
        value: number;
        weight: number;
        contribution: number;
    }>;
}
export declare function computeOpportunityScore(input: OpportunityScoreInput): OpportunityScoreResult;
export declare function computeAuditConfidence(input: {
    auditType: CroAuditType;
    hasProductPage: boolean;
    screenshotOk: boolean;
    hasAdCopy: boolean;
    productResolutionConfidence: number | null;
    representationSparse: boolean;
    blockedHints: boolean;
    exactPaidEvidence: boolean;
}): number;
/** Expose for tests / reporting */
export declare function summarizeQuality(scores: CroQualityScores): number;
//# sourceMappingURL=opportunityScorer.d.ts.map