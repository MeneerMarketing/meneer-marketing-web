/**
 * Milestone 9.5.1 — BRAND_FIRST_DISCOVERY architecture (config only, no paid run).
 *
 * Brand-first means: find focused niche brands first, qualify catalog/product,
 * screen PDP design gap, then validate commercial fit via Ads/Shopping evidence.
 */
export const BRAND_FIRST_DISCOVERY_VERSION = "BRAND_FIRST_DISCOVERY_V1";
/** Ordered pipeline for brand-first (validation last). */
export const BRAND_FIRST_PIPELINE_STAGES = [
    "niche_brand_discovery",
    "cheap_catalog_qualification",
    "hero_product_resolution",
    "pdp_design_gap_screen",
    "ads_shopping_validation",
    "economic_ranking",
];
export const BRAND_FIRST_SOURCE_ADAPTERS = [
    {
        id: "ORGANIC_PRODUCT_SERP",
        label: "Organic product SERP",
        enabled: true,
        notes: "Product-intent queries without paid-ad-first bias.",
    },
    {
        id: "SHOPPING_MERCHANT",
        label: "Shopping merchant recovery",
        enabled: true,
        notes: "Merchant names from Shopping blocks, seller domain verification.",
    },
    {
        id: "KNOWN_SPECIALIST_DISCOVERY",
        label: "Known specialist lists",
        enabled: true,
        notes: "Curated seeds, awards, category directories (future).",
    },
    {
        id: "OTHER_FUTURE_SOURCE",
        label: "Future source",
        enabled: false,
        notes: "Placeholder for extendable adapters.",
    },
];
/** Parked product families — data preserved, not promoted in brand-first v1. */
export const BRAND_FIRST_PARKED = [
    { archetypeId: "SLEEP_COMFORT", reason: "BestRest-adjacent sleep comfort category." },
    { archetypeId: "PET_TECH", reason: "Pet tech pages often too polished for contrast pilot." },
];
/**
 * Leading profile (branch-agnostic):
 * focused brand + high-consideration hero + limited catalog + good material + underdesigned PDP.
 */
export const BRAND_FIRST_LEAD_PROFILE = {
    id: "FOCUSED_HIGH_VALUE_UNDERDESIGNED",
    label: "Focused brand, high-value hero, underdesigned PDP",
};
//# sourceMappingURL=brandFirstDiscovery.js.map