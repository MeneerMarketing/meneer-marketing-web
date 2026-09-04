/**
 * Milestone 9.5.1 — BRAND_FIRST_DISCOVERY architecture (config only, no paid run).
 *
 * Brand-first means: find focused niche brands first, qualify catalog/product,
 * screen PDP design gap, then validate commercial fit via Ads/Shopping evidence.
 */
export declare const BRAND_FIRST_DISCOVERY_VERSION: "BRAND_FIRST_DISCOVERY_V1";
export type BrandFirstDiscoveryRoute = "ads_first" | "shopping_first" | "brand_first";
export type BrandFirstDiscoverySource = "ORGANIC_PRODUCT_SERP" | "SHOPPING_MERCHANT" | "KNOWN_SPECIALIST_DISCOVERY" | "OTHER_FUTURE_SOURCE";
export interface BrandFirstCandidateLineage {
    discoveryRoute: BrandFirstDiscoveryRoute;
    discoverySource: BrandFirstDiscoverySource;
    sourceQuery: string | null;
    sourceEvidence: string[];
}
/** Ordered pipeline for brand-first (validation last). */
export declare const BRAND_FIRST_PIPELINE_STAGES: readonly ["niche_brand_discovery", "cheap_catalog_qualification", "hero_product_resolution", "pdp_design_gap_screen", "ads_shopping_validation", "economic_ranking"];
export declare const BRAND_FIRST_SOURCE_ADAPTERS: Array<{
    id: BrandFirstDiscoverySource;
    label: string;
    enabled: boolean;
    notes: string;
}>;
/** Parked product families — data preserved, not promoted in brand-first v1. */
export declare const BRAND_FIRST_PARKED: readonly [{
    readonly archetypeId: "SLEEP_COMFORT";
    readonly reason: "BestRest-adjacent sleep comfort category.";
}, {
    readonly archetypeId: "PET_TECH";
    readonly reason: "Pet tech pages often too polished for contrast pilot.";
}];
/**
 * Leading profile (branch-agnostic):
 * focused brand + high-consideration hero + limited catalog + good material + underdesigned PDP.
 */
export declare const BRAND_FIRST_LEAD_PROFILE: {
    readonly id: "FOCUSED_HIGH_VALUE_UNDERDESIGNED";
    readonly label: "Focused brand, high-value hero, underdesigned PDP";
};
//# sourceMappingURL=brandFirstDiscovery.d.ts.map