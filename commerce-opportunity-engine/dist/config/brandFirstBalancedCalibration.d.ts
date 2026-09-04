/**
 * Milestone 9.6.1 — balanced brand-first calibration across product families.
 */
import type { BrandFirstProductFamilyId } from "./brandFirstHighTicket.js";
export declare const M961_DISCOVERY_VERSION: "BRAND_FIRST_BALANCED_CALIBRATION_V1";
export declare const M961_PROFILE_VERSION: "BRAND_FIRST_HIGH_TICKET_PROSPECT_V1";
/** Parked for acquisition discovery — architecture retained. */
export declare const M961_PARKED_QUERY_PATTERNS: readonly ["led masker", "led mask", "lichttherapie masker", "led gezichtsmasker", "led neck", "neck mask", "led therapie gezicht", "led lichttherapie mask"];
export declare const M961_PARKED_FAMILY_TAGS: readonly ["LED_FACE_MASK", "LED_NECK_MASK", "PARKED_LOW_DESIGN_GAP_YIELD"];
export type M961ActiveFamilyId = Exclude<BrandFirstProductFamilyId, never>;
export interface M961ProductFamily {
    id: M961ActiveFamilyId;
    label: string;
    archetypeId: string;
    organicQueries: string[];
    maxShortlisted: number;
}
/** Concrete product-mechanism queries — no broad category fluff. */
export declare const M961_PRODUCT_FAMILIES: M961ProductFamily[];
export declare const M961_DISCOVERY: {
    readonly milestone: "M9.6.1";
    readonly maxQueriesPerFamily: 2;
    readonly maxTotalOrganicQueries: 16;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly maxBrandsPerFamily: 4;
    readonly maxFirstPartyCandidates: 24;
    readonly maxDesignGapScreens: 12;
    readonly maxManualReview: 5;
    readonly maxVisionScreens: 12;
    readonly paidValidationMaxCandidates: 8;
    readonly paidValidationKeywordsPerBrand: 2;
    readonly firstPartyMinConfidence: 58;
    readonly crawlTimeoutMs: 20000;
    readonly screenshotDir: "m9.6.1-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 45000;
    readonly highGapVisualMin: 45;
    readonly highGapPurchaseMin: 45;
};
export declare function isParkedLedQuery(query: string): boolean;
export declare function buildM961RoundRobinQueries(): Array<{
    query: string;
    familyId: M961ActiveFamilyId;
    familyLabel: string;
    archetypeId: string;
}>;
export type FamilyVerdict = "STRONG" | "PROMISING" | "WEAK" | "PARK";
export type ManualReviewVerdict = "TRUE_MANUAL_REVIEW_CANDIDATE" | "NO_TARGET";
export type PurchaseMode = "DIRECT_ECOMMERCE" | "CONFIGURABLE_ECOMMERCE" | "LEAD_GENERATION" | "SHOWROOM_ASSISTED" | "UNKNOWN";
//# sourceMappingURL=brandFirstBalancedCalibration.d.ts.map