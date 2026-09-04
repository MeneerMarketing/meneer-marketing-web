/**
 * Milestone 9.4.1 — CURRENT → PROBLEM → PREMIUM_DTC OPPORTUNITY.
 *
 * Every row must trace to observed audit data. No invented features.
 */
import type { ConversionLeak } from "../../types/audit.js";
export interface InterventionRow {
    current: string;
    problem: string;
    premiumDtcOpportunity: string;
    source: string;
}
export interface InterventionMapInput {
    subScores: {
        buyblock: number | null;
        visual: number | null;
        storytelling: number | null;
        media: number | null;
        deepDive: number | null;
        mobile: number | null;
    };
    leaks: ConversionLeak[];
    strengths: Array<{
        title: string;
    }>;
    assetInventory: Record<string, boolean>;
}
export declare function buildInterventionMap(input: InterventionMapInput): InterventionRow[];
//# sourceMappingURL=interventionMap.d.ts.map