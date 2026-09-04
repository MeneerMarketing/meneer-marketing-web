/**
 * Milestone 9.5 — design-gap-first high-ticket discovery.
 *
 * Discovery order changes: weak or generic PDPs must surface before any full
 * CRO audit. Economic fit stays important but no longer alone decides ranking.
 */
import type { ProductionBranch } from "./productionDiscovery.js";
export declare const M95_DISCOVERY_VERSION: "DESIGN_GAP_HIGH_TICKET_DISCOVERY_V1";
/** Reuse the same controlled product families from M9.4. */
export declare const DESIGN_GAP_BRANCHES: ProductionBranch[];
export declare const M95_DISCOVERY: {
    readonly milestone: "M9.5";
    readonly profile: "DESIGN_GAP_HIGH_TICKET_PROSPECT";
    readonly maxKeywords: 24;
    readonly maxKeywordsPerFamily: 3;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly keywordIdeasLimit: 140;
    readonly maxLightChecks: 110;
    readonly maxCatalogChecks: 100;
    readonly maxHeroResolutions: 45;
    readonly maxHeroesPerDomain: 3;
    readonly sellerProbeTimeoutMs: 12000;
    readonly maxSellerProbesPerKeyword: 14;
    readonly minKeywordQualityScore: 26;
    /** Domains that pass economic pre-screen may enter cheap PDP capture. */
    readonly maxEconomicPrequalified: 32;
    /** Hard cap on viewport captures (desktop + mobile per domain). */
    readonly maxDesignGapScreens: 14;
    /** Optional Haiku vision calls, only after economic pre-screen. */
    readonly maxVisionScreens: 10;
    readonly maxCandidates: 15;
    readonly maxRanked: 10;
    readonly maxScreenshots: 5;
    /** Share of keywords tagged shopping_first (product + kopen intent). */
    readonly shoppingFirstShare: 0.38;
};
export declare const M95_SCREENSHOT_CONFIG: {
    readonly outputDir: "m9.5-screenshots";
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
export type DesignGapFunnelStage = "raw_advertisers" | "prospect_eligible" | "economic_prequalified" | "design_gap_screened" | "preaudit_gate_passed" | "design_gap_candidate";
export declare const DESIGN_GAP_FUNNEL_LABELS: Record<DesignGapFunnelStage, string>;
export declare const PARKED_FOR_M95: readonly [{
    readonly archetypeId: "SLEEP_COMFORT";
    readonly reason: "Een eerste design target hier zou een directe BestRest-concurrent zijn. Data blijft bewaard.";
}, {
    readonly archetypeId: "PET_TECH";
    readonly reason: "M9.3.4: vier audits leverden contrast 33-46. De pagina's zijn te verzorgd voor een before/after.";
}];
//# sourceMappingURL=designGapDiscovery.d.ts.map