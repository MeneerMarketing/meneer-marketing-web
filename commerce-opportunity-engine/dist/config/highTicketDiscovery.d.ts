/**
 * Milestone 9.4 — high-ticket focused brand discovery.
 *
 * Product type decides, not branch. Every family here sells something that
 * costs real money, needs explaining, and can carry a single hero product page.
 */
import type { ProductionBranch } from "./productionDiscovery.js";
export declare const M94_DISCOVERY_VERSION: "HIGH_TICKET_FOCUSED_DISCOVERY_V1";
export declare const HIGH_TICKET_BRANCHES: ProductionBranch[];
/** Parked on purpose, with the reason, so nobody switches them back blind. */
export declare const PARKED_ARCHETYPES: readonly [{
    readonly archetypeId: "SLEEP_COMFORT";
    readonly reason: "Een eerste design target hier zou een directe BestRest-concurrent zijn. Data blijft bewaard.";
}, {
    readonly archetypeId: "PET_TECH";
    readonly reason: "M9.3.4: vier audits leverden contrast 33-46. De pagina's zijn te verzorgd voor een before/after.";
}];
export declare const M94_DISCOVERY: {
    readonly milestone: "M9.4";
    /** Hard ceiling on SERP samples, the only per-unit DataForSEO spend. */
    readonly maxKeywords: 26;
    readonly maxKeywordsPerFamily: 4;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly keywordIdeasLimit: 150;
    /**
     * Cheap homepage checks, one fetch each, no DataForSEO cost. The caps sit
     * above the eligible pool on purpose: when they truncate, which domains get
     * measured depends on how many crawls happened to fail, and two passes over
     * the same SERP data produce different candidates.
     */
    readonly maxLightChecks: 110;
    readonly maxCatalogChecks: 100;
    readonly maxHeroResolutions: 45;
    readonly maxHeroesPerDomain: 3;
    readonly sellerProbeTimeoutMs: 12000;
    readonly maxSellerProbesPerKeyword: 12;
    /** Keywords below this SERP quality never contribute prospects. */
    readonly minKeywordQualityScore: 26;
    /** Serious candidates carried into the report. */
    readonly maxCandidates: 20;
    readonly maxRanked: 10;
    readonly maxScreenshots: 5;
};
export declare const SCREENSHOT_CONFIG: {
    readonly outputDir: "m9.4-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly timeoutMs: 45000;
};
export type HighTicketFunnelStage = "raw_advertisers" | "prospect_eligible" | "ecommerce_specialists" | "compact_catalog" | "own_brand" | "high_ticket_hero" | "serious_candidate";
export declare const FUNNEL_LABELS: Record<HighTicketFunnelStage, string>;
//# sourceMappingURL=highTicketDiscovery.d.ts.map