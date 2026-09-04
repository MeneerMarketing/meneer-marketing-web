/**
 * Milestone 9.9.7 — human showcase likelihood synthesis.
 */
import type { CurrentSiteImpression } from "./showcaseCandidateIntegrity.js";
import type { ShowcaseOwnershipClass } from "./showcaseCandidateIntegrity.js";
export type HumanShowcaseLikelihood = "STRONG" | "POSSIBLE" | "WEAK" | "NO";
export declare function assessHumanShowcaseLikelihood(input: {
    currentSiteImpression: CurrentSiteImpression | null;
    currentVisualQualityScore: number | null;
    templateDriven: boolean;
    businessBreadthScore: number;
    catalogConfidence: string;
    catalogCompactnessScore: number;
    materialFeasibility: number | null;
    heroCandidateScore: number | null;
    refinedBusinessModel: ShowcaseOwnershipClass;
    visionScoreAllowed: boolean;
}): {
    likelihood: HumanShowcaseLikelihood;
    rationale: string;
};
//# sourceMappingURL=humanShowcaseLikelihood.d.ts.map