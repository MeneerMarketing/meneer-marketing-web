/**
 * Milestone 9.9.7 — compact brand + strong visual gap production discovery.
 */
import type { M992ProductQuery } from "./visualUnderdesignedDiscovery.js";
export declare const M997_TARGET_PROFILE: "COMPACT_BRAND_STRONG_VISUAL_GAP_V1";
export declare const M997_DISCOVERY_VERSION: "COMPACT_BRAND_VISUAL_GAP_PRODUCTION_V1";
export declare const M997_DISCOVERY_ROUTE: "compact_brand_visual_gap_production";
export declare const M997_PRODUCT_QUERIES: M992ProductQuery[];
export declare const M997_PARKED_FAMILIES: readonly ["SLEEP_COMFORT", "PET_PRODUCTS"];
export declare function buildM997HarvestQueries(): M992ProductQuery[];
export declare const M997_DISCOVERY: {
    milestone: string;
    targetProfile: "COMPACT_BRAND_STRONG_VISUAL_GAP_V1";
    integrityVersion: string;
    maxSourceQueries: number;
    serpDepth: number;
    serpDepthExtended: number;
    estimatedSerpCostPerKeyword: number;
    estimatedSerpCostExtendedPerKeyword: number;
    maxRawCandidates: number;
    maxValidPdpScreens: number;
    maxVisuallyWeakBusinessQual: number;
    maxVisionScreens: number;
    maxHumanReviewCandidates: number;
    maxValidatedProspectsListed: number;
    currentVisualQualityShowcaseMax: number;
    currentVisualQualityIdealMax: number;
    crawlTimeoutMs: number;
    screenshotDir: string;
    desktop: {
        width: number;
        height: number;
    };
    mobile: {
        width: number;
        height: number;
    };
    screenshotTimeoutMs: number;
    skipReportPaths: string[];
};
export declare const M997_REPORT_PATH = "reports/compact-brand-visual-gap-production-report.json";
export declare const M997_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/compact-brand-visual-gap-production-report.json";
//# sourceMappingURL=compactBrandVisualGap.d.ts.map