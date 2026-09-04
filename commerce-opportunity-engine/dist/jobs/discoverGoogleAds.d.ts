import type { DiscoveryRunStats } from "../types/discovery.js";
export type GoogleAdsDiscoveryOptions = {
    /** Exact keyword set for controlled scale (bypasses approved/active loaders). */
    keywordIds?: string[];
    /** Skip Google Ads Transparency phase (selective transparency handled elsewhere). */
    skipTransparency?: boolean;
    /** Override SERP keyword cap. */
    maxKeywords?: number;
    /** Override SERP cost cap for this run. */
    maxSerpCost?: number;
    /** Skip auto-seed of development keywords. */
    skipSeedKeywords?: boolean;
};
export declare function runGoogleAdsDiscovery(options?: GoogleAdsDiscoveryOptions): Promise<DiscoveryRunStats>;
//# sourceMappingURL=discoverGoogleAds.d.ts.map