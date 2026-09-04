/**
 * Milestone 9.3.3 — focused production discovery.
 *
 * Calibration proved which product families actually surface the shops we want.
 * Only those families run here. Everything else stays switched off until real
 * SERP yield earns it a slot.
 */
import type { ProductArchetypeId } from "./idealProductArchetypes.js";
export declare const M933_DISCOVERY_VERSION: "FOCUSED_PRODUCTION_DISCOVERY_V1";
export interface ProductionBranch {
    archetypeId: ProductArchetypeId;
    /** Family ids from IDEAL_PRODUCT_ARCHETYPES_V1. Nothing else may run. */
    familyIds: string[];
    /** Share of the keyword budget. Normalized at runtime. */
    keywordShare: number;
    evidence: string;
}
export declare const PRODUCTION_BRANCHES: ProductionBranch[];
/** Families explicitly parked, with the reason, so nobody re-adds them blind. */
export declare const PARKED_FAMILIES: Array<{
    familyId: string;
    reason: string;
}>;
export declare const M933_DISCOVERY: {
    /** Hard ceiling on SERP samples, the only per-unit DataForSEO spend here. */
    readonly maxKeywords: 24;
    readonly maxKeywordsPerFamily: 9;
    readonly estimatedSerpCostPerKeyword: 0.004;
    /** One Labs call covering every seed, far cheaper than one call per family. */
    readonly keywordIdeasLimit: 150;
    /** Cheap homepage checks. No DataForSEO cost, one fetch each. */
    readonly maxLightChecks: 60;
    /** Catalog focus checks: one collection page fetch per promising domain. */
    readonly maxCatalogChecks: 30;
    /** Hero resolution crawls, only for domains that already look strong. */
    readonly maxHeroResolutions: 18;
    readonly maxHeroesPerDomain: 3;
    readonly sellerProbeTimeoutMs: 12000;
    readonly maxSellerProbesPerKeyword: 12;
    /** Keywords below this quality score never get production discovery. */
    readonly minKeywordQualityScore: 26;
    /**
     * The report has to carry the whole strong pool, otherwise the follow-up
     * audit run silently starts from a truncated list.
     */
    readonly topProspects: 25;
};
/**
 * The shop we are actually looking for. Not "small webshop": a focused
 * advertiser with its own story to tell and enough business behind it.
 */
export declare const TARGET_PROFILE: {
    readonly catalogSweetSpotMin: 5;
    readonly catalogSweetSpotMax: 75;
    /** Beyond this the catalog is too wide for a hero-product deep dive. */
    readonly catalogHardMax: 250;
    readonly minOwnBrandSignal: 45;
    readonly preferredPlatforms: readonly ["SHOPIFY", "WOOCOMMERCE", "LIGHTSPEED", "MAGENTO"];
    readonly minBusinessMaturity: 35;
};
/** Weights for ideal_prospect_pre_score. Deterministic, no Claude involved. */
export declare const PRE_SCORE_WEIGHTS: {
    readonly catalogFocus: 0.22;
    readonly ownBrand: 0.2;
    readonly deepDiveFit: 0.2;
    readonly pdpWeakness: 0.16;
    readonly heroStrength: 0.12;
    readonly platformFit: 0.1;
};
export declare const STRONG_PROSPECT_THRESHOLD = 62;
export type ProspectFunnelStage = "raw_advertisers" | "prospect_eligible" | "ecommerce_specialists" | "focused_catalog" | "own_brand" | "strong_hero" | "strong_prospect";
export declare const FUNNEL_STAGE_LABELS: Record<ProspectFunnelStage, string>;
//# sourceMappingURL=productionDiscovery.d.ts.map