/**
 * Milestone 9.4.1 — verify paid keyword → hero product alignment.
 *
 * Confirms the audited PDP is the same commercial opportunity as the ad, not a
 * random product page from the catalog.
 */
export interface PaidProductTargetInput {
    domain: string;
    expectedKeyword: string | null;
    adKeywords: string[];
    heroTitle: string | null;
    heroUrl: string | null;
    familyLabel: string | null;
    heroUrlFromAd: boolean;
}
export interface PaidProductTargetResult {
    targetConfidence: number;
    aligned: boolean;
    evidence: string[];
    keywordUsed: string | null;
}
export declare function verifyPaidProductTarget(input: PaidProductTargetInput): PaidProductTargetResult;
//# sourceMappingURL=paidProductTargetVerification.d.ts.map