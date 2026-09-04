/**
 * Milestone 9.6.1 — early discovery exclusion before crawl budget is spent.
 */
export type DiscoveryEntityClass = "OFFICIAL_BRAND_CANDIDATE" | "MERCHANT_DOMAIN" | "MEDIA_PUBLISHER" | "SOCIAL_PLATFORM" | "CONTENT_PLATFORM" | "AGENCY_EXCLUDED" | "MARKETPLACE_BLACKLIST";
export declare function classifyDiscoveryDomain(normalizedDomain: string): {
    entityClass: DiscoveryEntityClass;
    hardExclude: boolean;
    reason: string | null;
};
export declare function isHardDiscoveryExcludedDomain(normalizedDomain: string): boolean;
//# sourceMappingURL=discoveryEntityGate.d.ts.map