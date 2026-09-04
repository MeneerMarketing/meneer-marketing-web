/**
 * Milestone 9.4.1 — concept_asset_feasibility.
 *
 * Can we rebuild a premium PDP from what is actually on the site, without
 * inventing claims or imagery? Counts observed material, not promises.
 */
import type { PageRepresentation } from "../../types/audit.js";
import type { ConceptFirstPdpSignals } from "./currentPdpQuality.js";
export interface ConceptAssetFeasibilityInput {
    representation: PageRepresentation | null;
    conceptSignals: ConceptFirstPdpSignals | null;
    reviewCount: number | null;
    rating: number | null;
    assetReadinessScore: number | null;
}
export interface ConceptAssetFeasibilityResult {
    conceptAssetFeasibility: number;
    inventory: {
        packshots: boolean;
        lifestyle: boolean;
        detailImagery: boolean;
        technologyImagery: boolean;
        video: boolean;
        reviewsProof: boolean;
        specifications: boolean;
        benefits: boolean;
        faq: boolean;
        brandIdentity: boolean;
    };
    evidence: string[];
}
export declare function computeConceptAssetFeasibility(input: ConceptAssetFeasibilityInput): ConceptAssetFeasibilityResult;
//# sourceMappingURL=conceptAssetFeasibility.d.ts.map