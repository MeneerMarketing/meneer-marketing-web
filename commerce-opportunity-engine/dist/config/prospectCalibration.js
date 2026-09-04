/**
 * Milestone 9.3.2 — prospect discovery calibration.
 *
 * A small, cheap, controlled run whose only job is to answer one question:
 * do the new archetype keyword families actually surface niche brands and
 * focused specialists in real SERPs?
 */
export const M932_CALIBRATION_VERSION = "PROSPECT_CALIBRATION_V1";
/** Branches under test in this calibration run. */
export const CALIBRATION_BRANCHES = [
    "BEAUTY_DEVICES",
    "SKINCARE_DEVICES",
    "PET_TECH",
    "SLEEP_COMFORT",
    "WELLNESS_DEVICES",
];
/** Only tested when budget headroom remains after the primary branches. */
export const CALIBRATION_OPTIONAL_BRANCHES = [
    "RECOVERY_PRODUCTS",
    "PREMIUM_PET",
    "NICHE_HOME_COMFORT",
];
export const M932_CALIBRATION = {
    maxKeywordsPerBranch: 3,
    maxKeywordsTotal: 15,
    /** Prefer one keyword per product family before doubling up inside a family. */
    maxKeywordsPerFamily: 1,
    estimatedSerpCostPerKeyword: 0.004,
    /** Cheap homepage checks per run, no catalog crawl and no product resolution. */
    maxLightChecks: 40,
    /** Verifying a shopping seller's domain is one HTTP probe, no DataForSEO spend. */
    sellerProbeTimeoutMs: 12_000,
    maxSellerProbesPerKeyword: 12,
};
/**
 * A good keyword surfaces niche own brands and focused specialists,
 * and few chains, marketplaces or comparison sites.
 */
export const KEYWORD_QUALITY_THRESHOLDS = {
    /** Share of niche brands + specialists required for APPROVED. */
    minSpecialistRatio: 0.4,
    /** Combined share of retailers, marketplaces and comparison sites allowed. */
    maxUnsuitableRatio: 0.5,
    /** Below this the keyword is not worth further discovery at all. */
    marginalSpecialistRatio: 0.25,
    /** Minimum eligible prospects before a verdict is trusted. */
    minProspectCount: 2,
    /** Under this sample size we downgrade to MARGINAL instead of rejecting. */
    smallSampleSize: 4,
    /**
     * A single unsuitable class must reach this share before the keyword gets
     * named after it. Without the floor a SERP that is a bit of everything gets
     * labelled RETAILER_DOMINATED at 25% retailers, which reads as a lie.
     */
    singleClassDominanceRatio: 0.4,
    /** Aligned with minSpecialistRatio: 40% specialists scores roughly 34. */
    minQualityScore: 34,
    marginalQualityScore: 20,
    sampleSize: 8,
};
/** Verdict bands on prospect yield: eligible domains as share of raw domains. */
export const BRANCH_VERDICT_BANDS = {
    strong: 55,
    promising: 40,
    weak: 25,
};
export function branchVerdict(prospectYieldPercent, specialistCount) {
    if (specialistCount === 0)
        return "REJECT";
    if (prospectYieldPercent >= BRANCH_VERDICT_BANDS.strong)
        return "STRONG";
    if (prospectYieldPercent >= BRANCH_VERDICT_BANDS.promising)
        return "PROMISING";
    if (prospectYieldPercent >= BRANCH_VERDICT_BANDS.weak)
        return "WEAK";
    return "REJECT";
}
//# sourceMappingURL=prospectCalibration.js.map