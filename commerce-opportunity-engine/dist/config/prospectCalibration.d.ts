/**
 * Milestone 9.3.2 — prospect discovery calibration.
 *
 * A small, cheap, controlled run whose only job is to answer one question:
 * do the new archetype keyword families actually surface niche brands and
 * focused specialists in real SERPs?
 */
import type { ProductArchetypeId } from "./idealProductArchetypes.js";
export declare const M932_CALIBRATION_VERSION: "PROSPECT_CALIBRATION_V1";
/** Branches under test in this calibration run. */
export declare const CALIBRATION_BRANCHES: ProductArchetypeId[];
/** Only tested when budget headroom remains after the primary branches. */
export declare const CALIBRATION_OPTIONAL_BRANCHES: ProductArchetypeId[];
export declare const M932_CALIBRATION: {
    readonly maxKeywordsPerBranch: 3;
    readonly maxKeywordsTotal: 15;
    /** Prefer one keyword per product family before doubling up inside a family. */
    readonly maxKeywordsPerFamily: 1;
    readonly estimatedSerpCostPerKeyword: 0.004;
    /** Cheap homepage checks per run, no catalog crawl and no product resolution. */
    readonly maxLightChecks: 40;
    /** Verifying a shopping seller's domain is one HTTP probe, no DataForSEO spend. */
    readonly sellerProbeTimeoutMs: 12000;
    readonly maxSellerProbesPerKeyword: 12;
};
/**
 * A good keyword surfaces niche own brands and focused specialists,
 * and few chains, marketplaces or comparison sites.
 */
export declare const KEYWORD_QUALITY_THRESHOLDS: {
    /** Share of niche brands + specialists required for APPROVED. */
    readonly minSpecialistRatio: 0.4;
    /** Combined share of retailers, marketplaces and comparison sites allowed. */
    readonly maxUnsuitableRatio: 0.5;
    /** Below this the keyword is not worth further discovery at all. */
    readonly marginalSpecialistRatio: 0.25;
    /** Minimum eligible prospects before a verdict is trusted. */
    readonly minProspectCount: 2;
    /** Under this sample size we downgrade to MARGINAL instead of rejecting. */
    readonly smallSampleSize: 4;
    /**
     * A single unsuitable class must reach this share before the keyword gets
     * named after it. Without the floor a SERP that is a bit of everything gets
     * labelled RETAILER_DOMINATED at 25% retailers, which reads as a lie.
     */
    readonly singleClassDominanceRatio: 0.4;
    /** Aligned with minSpecialistRatio: 40% specialists scores roughly 34. */
    readonly minQualityScore: 34;
    readonly marginalQualityScore: 20;
    readonly sampleSize: 8;
};
export type BranchVerdict = "STRONG" | "PROMISING" | "WEAK" | "REJECT";
/** Verdict bands on prospect yield: eligible domains as share of raw domains. */
export declare const BRANCH_VERDICT_BANDS: {
    readonly strong: 55;
    readonly promising: 40;
    readonly weak: 25;
};
export declare function branchVerdict(prospectYieldPercent: number, specialistCount: number): BranchVerdict;
//# sourceMappingURL=prospectCalibration.d.ts.map