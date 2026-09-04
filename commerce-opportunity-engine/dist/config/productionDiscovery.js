/**
 * Milestone 9.3.3 — focused production discovery.
 *
 * Calibration proved which product families actually surface the shops we want.
 * Only those families run here. Everything else stays switched off until real
 * SERP yield earns it a slot.
 */
export const M933_DISCOVERY_VERSION = "FOCUSED_PRODUCTION_DISCOVERY_V1";
export const PRODUCTION_BRANCHES = [
    {
        archetypeId: "SLEEP_COMFORT",
        familyIds: ["ergonomic_pillows", "premium_mattress_systems"],
        keywordShare: 1,
        evidence: "M9.3.2: 51,5% prospect yield, beide families leverden APPROVED keywords met quality 59 en 64.",
    },
];
/** Families explicitly parked, with the reason, so nobody re-adds them blind. */
export const PARKED_FAMILIES = [
    { familyId: "sleep_tech", reason: "wake-up lights zijn elektronicaretail: 58% retailers" },
    { familyId: "pet_trackers", reason: "GPS trackers: 63% retailers en vergelijkers" },
    { familyId: "automatic_feeders", reason: "voerbakken: 59% retailers" },
    {
        familyId: "smart_litter_doors",
        reason: "M9.3.4: vier audits in deze familie leverden contrast 33-46 tegen een drempel van 62. De pagina's zijn te goed voor een overtuigende before/after. Categorie geparkeerd op verzoek.",
    },
];
export const M933_DISCOVERY = {
    /** Hard ceiling on SERP samples, the only per-unit DataForSEO spend here. */
    maxKeywords: 24,
    maxKeywordsPerFamily: 9,
    estimatedSerpCostPerKeyword: 0.004,
    /** One Labs call covering every seed, far cheaper than one call per family. */
    keywordIdeasLimit: 150,
    /** Cheap homepage checks. No DataForSEO cost, one fetch each. */
    maxLightChecks: 60,
    /** Catalog focus checks: one collection page fetch per promising domain. */
    maxCatalogChecks: 30,
    /** Hero resolution crawls, only for domains that already look strong. */
    maxHeroResolutions: 18,
    maxHeroesPerDomain: 3,
    sellerProbeTimeoutMs: 12_000,
    maxSellerProbesPerKeyword: 12,
    /** Keywords below this quality score never get production discovery. */
    minKeywordQualityScore: 26,
    /**
     * The report has to carry the whole strong pool, otherwise the follow-up
     * audit run silently starts from a truncated list.
     */
    topProspects: 25,
};
/**
 * The shop we are actually looking for. Not "small webshop": a focused
 * advertiser with its own story to tell and enough business behind it.
 */
export const TARGET_PROFILE = {
    catalogSweetSpotMin: 5,
    catalogSweetSpotMax: 75,
    /** Beyond this the catalog is too wide for a hero-product deep dive. */
    catalogHardMax: 250,
    minOwnBrandSignal: 45,
    preferredPlatforms: ["SHOPIFY", "WOOCOMMERCE", "LIGHTSPEED", "MAGENTO"],
    minBusinessMaturity: 35,
};
/** Weights for ideal_prospect_pre_score. Deterministic, no Claude involved. */
export const PRE_SCORE_WEIGHTS = {
    catalogFocus: 0.22,
    ownBrand: 0.2,
    deepDiveFit: 0.2,
    pdpWeakness: 0.16,
    heroStrength: 0.12,
    platformFit: 0.1,
};
export const STRONG_PROSPECT_THRESHOLD = 62;
export const FUNNEL_STAGE_LABELS = {
    raw_advertisers: "Ruwe advertisers",
    prospect_eligible: "Door de prospect gate",
    ecommerce_specialists: "Ecommerce specialisten",
    focused_catalog: "Gefocuste catalogus",
    own_brand: "Eigen merk of grotendeels eigen merk",
    strong_hero: "Sterk heroproduct",
    strong_prospect: "Sterke prospect",
};
//# sourceMappingURL=productionDiscovery.js.map