/**
 * Milestone 9.6 — BRAND_FIRST_HIGH_TICKET_PROSPECT profile and run caps.
 */
export declare const BRAND_FIRST_HIGH_TICKET_PROFILE_VERSION: "BRAND_FIRST_HIGH_TICKET_PROSPECT_V1";
export declare const M96_DISCOVERY_VERSION: "BRAND_FIRST_HIGH_TICKET_DISCOVERY_V1";
export declare const BRAND_FIRST_CATALOG_BANDS: readonly [{
    readonly min: 3;
    readonly max: 30;
    readonly score: 100;
    readonly label: "zeer sterk";
}, {
    readonly min: 31;
    readonly max: 60;
    readonly score: 88;
    readonly label: "sterk";
}, {
    readonly min: 61;
    readonly max: 100;
    readonly score: 68;
    readonly label: "bruikbaar";
}, {
    readonly min: 101;
    readonly max: 200;
    readonly score: 38;
    readonly label: "penalty";
}, {
    readonly min: 201;
    readonly max: 999999;
    readonly score: 12;
    readonly label: "sterke penalty";
}];
export declare function catalogBandForBrandFirst(size: number | null): {
    score: number;
    label: string;
};
export declare const BRAND_FIRST_HERO_ECONOMICS: {
    readonly sweetMin: 150;
    readonly sweetMax: 750;
    readonly positiveMin: 100;
    readonly allowedPremiumMin: 750;
};
/** Organic query reject tokens — no retailer/review/comparison intent. */
export declare const ORGANIC_QUERY_REJECT: readonly ["beste", "review", "vergelijk", "kopen bij", "goedkoop", "kruidvat", "bol.com", "amazon", "marktplaats"];
export type BrandFirstProductFamilyId = "BEAUTY_TECH" | "HAIR_SCALP_TECH" | "RECOVERY_TECH" | "BODY_WELLNESS" | "PERSONAL_CARE_TECH" | "HOME_WELLNESS" | "NICHE_HOME_TECH" | "ERGONOMIC_LIFESTYLE_TECH";
export interface BrandFirstProductFamily {
    id: BrandFirstProductFamilyId;
    label: string;
    archetypeId: string;
    familyIds: string[];
    /** Non-branded product-intent queries for organic SERP. */
    organicQueries: string[];
    maxShortlisted: number;
}
export declare const BRAND_FIRST_PRODUCT_FAMILIES: BrandFirstProductFamily[];
export declare const M96_PARKED_ARCHETYPES: readonly ["SLEEP_COMFORT", "PET_TECH", "PREMIUM_PET", "FITNESS_SPECIALIST"];
export declare const M96_DISCOVERY: {
    readonly milestone: "M9.6";
    readonly maxOrganicQueries: 18;
    readonly maxBrandsPerFamily: 6;
    readonly estimatedSerpCostPerKeyword: 0.004;
    readonly maxBrandCandidates: 30;
    readonly maxEconomicQualified: 15;
    readonly maxDesignGapScreens: 10;
    readonly maxManualReview: 5;
    readonly maxVisionScreens: 10;
    readonly firstPartyMinConfidence: 58;
    readonly crawlTimeoutMs: 20000;
    readonly screenshotDir: "m9.6-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 45000;
    readonly paidValidationMaxCandidates: 12;
    readonly paidValidationKeywordsPerBrand: 2;
};
/** Known mass retailers — never brand-first candidates. */
export declare const M96_RETAILER_DOMAIN_HINTS: readonly ["bol.com", "amazon.", "coolblue", "mediamarkt", "zalando", "marktplaats", "ebay.", "temu.", "aliexpress", "beslist", "kieskeurig", "maxict", "xxlhoreca", "quirumed", "fysiosupplies", "bigshopper", "lionshome", "praxis.", "hornbach", "ikea."];
export type PaidAcquisitionLevel = "CONFIRMED" | "LIKELY" | "NOT_FOUND" | "UNKNOWN";
export type EntityRole = "MERCHANT_DOMAIN" | "PRODUCT_BRAND" | "OFFICIAL_BRAND_DOMAIN";
//# sourceMappingURL=brandFirstHighTicket.d.ts.map