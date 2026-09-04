/**
 * Advertiser blacklist for Google Ads discovery.
 * Domains and patterns listed here are excluded from lead storage.
 */
export interface AdvertiserBlacklistConfig {
    /** Exact normalized domains to exclude (lowercase, no www). */
    excludedDomains: string[];
    /**
     * Substring patterns matched against normalized domains.
     * Use sparingly; prefer exact domains when possible.
     */
    excludedDomainPatterns: string[];
}
export declare const advertiserBlacklist: AdvertiserBlacklistConfig;
export declare function isBlacklistedDomain(normalizedDomain: string, config?: AdvertiserBlacklistConfig): boolean;
//# sourceMappingURL=blacklist.d.ts.map