/**
 * Milestone 9.9.4 — visual focused brand production discovery.
 */
import type { M992ProductQuery } from "./visualUnderdesignedDiscovery.js";
import { M992_PARKED_FAMILIES } from "./visualUnderdesignedDiscovery.js";
export declare const M994_DISCOVERY_VERSION: "VISUAL_FOCUSED_BRAND_PRODUCTION_V1";
export declare const M994_DISCOVERY_ROUTE: "visual_focused_brand_production";
export declare const M994_PRODUCT_QUERIES: M992ProductQuery[];
export declare const M994_DISCOVERY: {
    readonly milestone: "M9.9.4";
    readonly targetProfile: "FOCUSED_BRAND_GAP_FIRST_V1";
    readonly integrityVersion: "SHOWCASE_CANDIDATE_INTEGRITY_V2";
    readonly maxSourceQueries: 22;
    readonly serpDepth: 50;
    readonly serpDepthExtended: 100;
    readonly estimatedSerpCostPerKeyword: 0.006;
    readonly estimatedSerpCostExtendedPerKeyword: 0.01;
    readonly maxRawCandidates: 100;
    readonly maxValidPdpScreens: 28;
    readonly maxVisuallyWeakBusinessQual: 18;
    readonly maxVisionScreens: 28;
    readonly maxValidatedProspectsListed: 5;
    readonly maxStrongSalesListed: 5;
    readonly maxCroOnlyListed: 5;
    readonly currentVisualQualityShowcaseMax: 55;
    readonly currentVisualQualityIdealMax: 45;
    readonly crawlTimeoutMs: 18000;
    readonly screenshotDir: "m9.9.4-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 18000;
    readonly cleanmasterRegression: {
        readonly domain: "cleanmastershop.nl";
        readonly cvqRange: readonly [30, 50];
        readonly note: "Positive visual fixture; not hardcoded in scoring";
    };
};
export declare function buildM994HarvestQueries(): M992ProductQuery[];
export declare const M994_REPORT_PATH = "reports/visual-focused-brand-production-report.json";
export declare const M994_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/visual-focused-brand-production-report.json";
export { M992_PARKED_FAMILIES as M994_PARKED_FAMILIES };
//# sourceMappingURL=visualFocusedBrandProduction.d.ts.map