import type { KeywordIntentType } from "./keywordIntentType.js";
export type ProspectingTier = "PRIMARY" | "SECONDARY" | "LOW_VALUE" | "REJECT";
export interface ProspectingValueInput {
    intentType: KeywordIntentType;
    commercialIntent: number | null;
    productIntent: number | null;
    keywordQuality: number | null;
    searchVolume: number | null;
    competition: number | null;
    cpc: number | null;
    /** Optional observed yield signals (0 if unscanned). */
    uniqueDomains?: number | null;
    leadEligibleFound?: number | null;
    shopifyFound?: number | null;
    generalRetailersFound?: number | null;
    comparisonSitesFound?: number | null;
    confirmedAdvertisersFound?: number | null;
}
export declare function scoreProspectingValue(input: ProspectingValueInput & {
    keyword?: string;
}): {
    score: number;
    reasons: string[];
};
export declare function assignProspectingTier(input: {
    intentType: KeywordIntentType;
    prospectingValue: number;
    commercialIntent: number | null;
    productIntent: number | null;
    historicalHighYield?: boolean;
}): {
    tier: ProspectingTier;
    eligibleForAutoApproval: boolean;
    reason: string;
};
//# sourceMappingURL=prospectingValue.d.ts.map