/**
 * Milestone 9 — concept generation safety gate.
 * Preview generation later may only proceed when all gates pass.
 */
import type { ConceptStatus } from "../../config/conceptScoring.js";
export type ConceptGenerationGateInput = {
    concept_status: ConceptStatus | string;
    hero_product_selected: boolean;
    asset_readiness_score: number | null;
    min_asset_readiness?: number;
    is_excluded: boolean;
    is_dnc: boolean;
    brand_eligible: boolean;
    template_id: string | null;
    template_design_available: boolean;
};
export type ConceptGenerationGateResult = {
    allowed: boolean;
    blocked_reasons: string[];
};
export declare function evaluateConceptGenerationGate(input: ConceptGenerationGateInput): ConceptGenerationGateResult;
/** Outreach strategy CONCEPT_FIRST requires preview later. Architecture only. */
export type ConceptFirstOutreachGateInput = {
    outreach_strategy: string;
    concept_status: string;
    preview_url: string | null;
};
export declare function evaluateConceptFirstOutreachGate(input: ConceptFirstOutreachGateInput): ConceptGenerationGateResult;
//# sourceMappingURL=generationGate.d.ts.map