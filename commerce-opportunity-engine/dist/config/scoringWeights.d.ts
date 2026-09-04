/**
 * Dual-mode Opportunity Score weights — Milestone 5.4.
 *
 * EXACT_PAID_FUNNEL may use ad→landing gap.
 * HIGH_CONFIDENCE_PRODUCT_TARGET must NOT invent ad→landing proof; score capped at 84.
 */
export type CroAuditType = "EXACT_PAID_FUNNEL" | "HIGH_CONFIDENCE_PRODUCT_TARGET";
export type KeywordIntent = "NON_BRANDED_COMMERCIAL" | "BRANDED" | "PRODUCT_BRANDED" | "NAVIGATIONAL" | "UNKNOWN";
/** A. Exact paid Search funnel (proven keyword → ad → landing). */
export declare const EXACT_PAID_FUNNEL_WEIGHTS: {
    readonly paidAcquisitionStrength: 0.15;
    readonly businessMaturity: 0.15;
    readonly croGap: 0.2;
    readonly adLandingGap: 0.15;
    readonly platformFit: 0.1;
    readonly rebuildPotential: 0.1;
    readonly productCommercialSignal: 0.05;
    readonly designTrustGap: 0.05;
    readonly sourceQuality: 0.05;
};
/**
 * B. High-confidence product target (confirmed advertiser + exact product URL,
 * specific paid landing relation NOT proven). No adLandingGap factor.
 */
export declare const HIGH_CONFIDENCE_PRODUCT_TARGET_WEIGHTS: {
    readonly confirmedPaidBrandStrength: 0.15;
    readonly businessMaturity: 0.2;
    readonly productPageCroGap: 0.25;
    readonly platformFit: 0.15;
    readonly rebuildPotential: 0.1;
    readonly productCommercialSignal: 0.05;
    readonly designTrustGap: 0.05;
    readonly targetSourceConfidence: 0.05;
};
/** Absolute ceiling for high-confidence (non-exact-paid) audits. */
export declare const HIGH_CONFIDENCE_SCORE_CAP = 84;
/**
 * Keyword-intent penalties applied AFTER weighted base (exact paid only).
 *
 * Formula:
 *   score = clamp(0, 100, base - retailerScalePenalty - keywordIntentPenalty)
 *
 * NON_BRANDED_COMMERCIAL → 0
 * PRODUCT_BRANDED        → 6
 * BRANDED                → 14
 * NAVIGATIONAL           → 18
 * UNKNOWN                → 4
 */
export declare const KEYWORD_INTENT_PENALTY: Record<KeywordIntent, number>;
/** Retailer scale above this starts subtracting from the final score. */
export declare const RETAILER_SCALE_PENALTY: {
    readonly softThreshold: 55;
    readonly hardThreshold: 75;
    readonly maxPenalty: 25;
};
/**
 * Meneer Marketing Fit (separate from Opportunity Score).
 * How well the brand fits our ideal client profile — NOT commercial CRO gap size.
 *
 * fit =
 *   shopifyFit * 0.20 +
 *   businessTypeFit * 0.20 +
 *   retailerScaleFit * 0.15 +
 *   commercialMaturity * 0.15 +
 *   confirmedPaidActivity * 0.10 +
 *   productSeriousness * 0.10 +
 *   projectSuitability * 0.10
 *
 * Hard floor via exclusions (marketplace / general retailer / manual exclude).
 */
export declare const MENEER_MARKETING_FIT_WEIGHTS: {
    readonly shopifyFit: 0.2;
    readonly businessTypeFit: 0.2;
    readonly retailerScaleFit: 0.15;
    readonly commercialMaturity: 0.15;
    readonly confirmedPaidActivity: 0.1;
    readonly productSeriousness: 0.1;
    readonly projectSuitability: 0.1;
};
export declare const OPPORTUNITY_VERDICT_BANDS: ({
    min: number;
    verdict: "CONTACT_IMMEDIATELY";
} | {
    min: number;
    verdict: "HIGH_PRIORITY";
} | {
    min: number;
    verdict: "INTERESTING";
} | {
    min: number;
    verdict: "LOW_PRIORITY";
} | {
    min: number;
    verdict: "SKIP";
})[];
export type OpportunityVerdict = (typeof OPPORTUNITY_VERDICT_BANDS)[number]["verdict"];
/** Dual-mode CRO audit version. */
export declare const CRO_AUDIT_VERSION = "2.0";
export declare const CRO_PROMPT_VERSION = "2.0";
/**
 * Legacy export kept for older callers; prefer EXACT_PAID_FUNNEL_WEIGHTS.
 */
export declare const OPPORTUNITY_SCORE_WEIGHTS: {
    readonly paidAcquisitionStrength: 0.15;
    readonly businessMaturity: 0.15;
    readonly croGap: 0.2;
    readonly adLandingGap: 0.15;
    readonly rebuildPotential: 0.1;
    readonly platformFit: 0.1;
    readonly productCommercialSignal: 0.05;
    readonly designTrustGap: 0.05;
};
//# sourceMappingURL=scoringWeights.d.ts.map