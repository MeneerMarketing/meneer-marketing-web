/**
 * Milestone 9.4.1 — design_intervention_opportunity.
 *
 * How much concrete redesign work can we point at? High when subscores are weak
 * but the business and assets give us real material to rebuild with.
 */
import type { ConversionLeak } from "../../types/audit.js";
export interface DesignInterventionInput {
    subScores: {
        buyblock: number | null;
        visual: number | null;
        storytelling: number | null;
        media: number | null;
        deepDive: number | null;
        mobile: number | null;
    };
    currentPdpQuality: number | null;
    transformation: number | null;
    assetFeasibility: number | null;
    leaks: ConversionLeak[];
    pdpImprovementPotential: number | null;
}
export interface DesignInterventionResult {
    designInterventionOpportunity: number;
    evidence: string[];
}
export declare function computeDesignInterventionOpportunity(input: DesignInterventionInput): DesignInterventionResult;
//# sourceMappingURL=designInterventionOpportunity.d.ts.map