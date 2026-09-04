/**
 * Milestone 9.3.1 — SERP prospect quality test + keyword stop rule.
 *
 * One cheap sample of the advertiser landscape decides whether a keyword is
 * worth a full discovery run. Composition beats volume.
 */
import { type ProspectClass } from "../prospect/prospectPipelineGate.js";
export declare const SERP_QUALITY_THRESHOLDS: {
    readonly minSpecialistRatio: 0.4;
    readonly maxUnsuitableRatio: 0.5;
    readonly marginalSpecialistRatio: 0.25;
    readonly minProspectCount: 2;
    readonly smallSampleSize: 4;
    readonly singleClassDominanceRatio: 0.4;
    readonly minQualityScore: 34;
    readonly marginalQualityScore: 20;
    readonly sampleSize: 8;
};
export type KeywordProspectStatus = "APPROVED" | "MARGINAL" | "LOW_SPECIALIST_YIELD" | "RETAILER_DOMINATED" | "COMPARISON_DOMINATED" | "MARKETPLACE_DOMINATED" | "TOO_BROAD" | "NO_SAMPLE";
export interface SerpAdvertiserSample {
    domain: string;
    businessType?: string | null;
}
export interface SerpCompositionRatios {
    nicheBrandRatio: number;
    specialistRatio: number;
    generalRetailerRatio: number;
    massRetailerRatio: number;
    comparisonRatio: number;
    marketplaceRatio: number;
    nonCommerceRatio: number;
    unknownRatio: number;
    /** Cold start only: unknown domains that carry no retailer signal at all. */
    provisionalRatio: number;
    alreadyExcludedRatio: number;
}
export interface SerpProspectQualityResult {
    sampled: number;
    counts: Record<ProspectClass, number>;
    ratios: SerpCompositionRatios;
    prospectDomains: string[];
    /** Cold start only: candidates still awaiting the free homepage check. */
    provisionalDomains: string[];
    excludedDomains: string[];
    prospectSerpQualityScore: number;
    status: KeywordProspectStatus;
    stopReason: string | null;
    /** May this keyword continue to full discovery? */
    approved: boolean;
}
export declare function computeSerpProspectQuality(advertisers: SerpAdvertiserSample[], options?: {
    archetypeTooBroad?: boolean;
    /**
     * A brand new product family has no classified advertisers yet, so demanding
     * positive proof of specialists rejects every keyword by construction. In
     * cold start an unknown domain without any retailer, marketplace or
     * comparison signal counts as a candidate. It still has to survive the
     * central gate and the free homepage check afterwards; this only decides
     * whether the keyword itself is worth keeping.
     */
    coldStart?: boolean;
}): SerpProspectQualityResult;
export declare function isKeywordProspectingRejected(status: KeywordProspectStatus): boolean;
//# sourceMappingURL=serpProspectQuality.d.ts.map