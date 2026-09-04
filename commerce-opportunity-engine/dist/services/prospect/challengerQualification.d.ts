/**
 * Milestone 9.4.1 — deterministic challenger qualification (no Claude).
 */
import type { ProductArchetypeId } from "../../config/idealProductArchetypes.js";
export interface ChallengerCandidateInput {
    domain: string;
    heroProductUrl: string | null;
    heroProduct: string | null;
    heroPrice: number | null;
    heroScore: number | null;
    branch: ProductArchetypeId;
    familyId: string;
    familyLabel: string;
    platform: string | null;
    businessType: string | null;
    commerceModel: string;
    googleAdsEvidence: {
        keywords: string[];
    };
    assetReadinessProxy: number | null;
    deepDivePdpFitProxy: number | null;
    currentPdpWeaknessProxy: number | null;
    adKeywordCount: number;
}
export interface ChallengerQualificationResult {
    domain: string;
    qualified: boolean;
    blockers: string[];
    evidence: string[];
    businessMaturity: number | null;
    estimatedCatalogSize: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    ownBrandSignal: number | null;
    platform: string | null;
    businessType: string | null;
    commerceModel: string;
    assetReadinessProxy: number | null;
    deepDivePdpFitProxy: number | null;
    currentPdpWeaknessProxy: number | null;
    highTicketFocusedFitScore: number | null;
    estimatedContrastCeiling: number | null;
    companyScaleFit: number | null;
    heroProductUrl: string | null;
}
export declare function qualifyChallenger(input: ChallengerCandidateInput, crawlTimeoutMs: number): Promise<ChallengerQualificationResult>;
//# sourceMappingURL=challengerQualification.d.ts.map