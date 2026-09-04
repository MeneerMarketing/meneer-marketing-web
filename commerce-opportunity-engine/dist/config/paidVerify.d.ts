/**
 * Milestone 7.2.1 — Selective paid verification + cleanup.
 * Central caps/weights. No magic numbers in jobs.
 */
export declare const PAID_VERIFY_DEFAULTS: {
    readonly maxTransparencyDomains: 15;
    readonly maxTransparencyCost: 0.05;
    readonly transparencyConcurrency: 2;
    readonly maxPaidTargetBrands: 5;
    readonly maxPaidTargetCost: 0.1;
    readonly totalDataForSeoBudget: 0.15;
    /** Successful confirmation cooldown (days). */
    readonly confirmationCooldownDays: 30;
    /** Valid unresolved (non-payment) cooldown before retry (days). */
    readonly unresolvedCooldownDays: 7;
    /** Min category_relevance for PRIMARY discovery candidacy. */
    readonly minRelevanceForPrimary: 45;
    /** Soft floor: below this, discovery_priority is capped. */
    readonly relevancePriorityCapBelow: 40;
    readonly discoveryPriorityCapWhenLowRelevance: 48;
};
/** Verification ranking weights for prequalified → Transparency. */
export declare const VERIFICATION_RANK_WEIGHTS: {
    readonly preFit: 0.28;
    readonly maturity: 0.18;
    readonly shopifyBonus: 18;
    readonly brandTypeBonus: 12;
    readonly specialistTypeBonus: 8;
    readonly retailerScalePenalty: 0.35;
    readonly sourceKeywordCount: 4;
    readonly avgProspecting: 0.12;
    readonly avgCategoryRelevance: 0.1;
    readonly intelligenceCompleteness: 0.08;
};
/** Confirmed → paid target ranking. */
export declare const CONFIRMED_TARGET_RANK_WEIGHTS: {
    readonly preFit: 0.3;
    readonly maturity: 0.2;
    readonly shopifyBonus: 22;
    readonly retailerScalePenalty: 0.4;
    readonly sourceKeywordCount: 5;
    readonly nonBrandedBonus: 10;
    readonly avgProspecting: 0.15;
};
/** target_priority_score for future CRO ranking (no CRO inputs). */
export declare const TARGET_PRIORITY_WEIGHTS: {
    readonly sourceQuality: 0.28;
    readonly brandPreFit: 0.2;
    readonly maturity: 0.14;
    readonly shopifyBonus: 12;
    readonly keywordProspecting: 0.14;
    readonly nonBrandedBonus: 8;
    readonly productSignals: 0.1;
    readonly targetConfidence: 0.14;
};
//# sourceMappingURL=paidVerify.d.ts.map