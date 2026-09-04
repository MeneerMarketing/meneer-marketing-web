/**
 * Milestone 9.2.1 — current_pdp_quality_score from audited CRO signals.
 */
import type { CroQualityScores } from "../../types/audit.js";
export type ConceptFirstPdpSignals = {
    buyblock_quality?: number;
    product_storytelling_depth?: number;
    media_usage_quality?: number;
    deep_dive_quality?: number;
    mobile_purchase_quality?: number;
    premium_design_perception?: number;
};
export type CurrentPdpQualityResult = {
    score: number;
    band: string;
    components: Record<string, number>;
};
export declare function computeCurrentPdpQualityScore(cro: CroQualityScores, conceptSignals?: ConceptFirstPdpSignals | null): CurrentPdpQualityResult;
export declare function croAlreadyStrongPenaltyFromQuality(qualityScore: number): number;
//# sourceMappingURL=currentPdpQuality.d.ts.map