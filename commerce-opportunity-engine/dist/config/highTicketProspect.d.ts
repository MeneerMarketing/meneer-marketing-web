/**
 * Milestone 9.4 — HIGH_TICKET_FOCUSED_BRAND.
 *
 * The prospect profile, deliberately written without a branch. We are not
 * looking for "a beauty company" but for a commercial shape:
 *
 *   a small or mid-sized brand, a compact catalog, a product of real value
 *   that needs explaining, decent assets, paid traffic already running, and a
 *   product page that does not yet do any of that justice.
 *
 * SkinComplete is the reference for the shape only. Nothing here filters on
 * its category, its competitors or its products.
 */
export declare const HIGH_TICKET_PROFILE_VERSION: "HIGH_TICKET_FOCUSED_BRAND_V1";
/**
 * Catalog size bands. A compact assortment is what makes one hero product
 * worth a deep-dive page. Very large catalogs are penalised, never rejected on
 * size alone, because a strong brand with a wide range can still qualify.
 */
export declare const CATALOG_BANDS: readonly [{
    readonly min: 1;
    readonly max: 2;
    readonly score: 55;
    readonly label: "zeer smal, bedrijf moet zichzelf bewijzen";
}, {
    readonly min: 3;
    readonly max: 50;
    readonly score: 100;
    readonly label: "ideaal";
}, {
    readonly min: 51;
    readonly max: 100;
    readonly score: 78;
    readonly label: "bruikbaar";
}, {
    readonly min: 101;
    readonly max: 200;
    readonly score: 46;
    readonly label: "breed";
}, {
    readonly min: 201;
    readonly max: 400;
    readonly score: 24;
    readonly label: "te breed";
}, {
    readonly min: 401;
    readonly max: 999999;
    readonly score: 8;
    readonly label: "catalogusshop";
}];
/**
 * Hero price bands. Price is an economics indicator, never a revenue claim:
 * it says how much room a product page has to argue, and whether a redesign
 * pays for itself.
 */
export declare const PRICE_BANDS: readonly [{
    readonly min: 500;
    readonly band: "PREMIUM";
    readonly score: 100;
    readonly label: "premium ticket";
}, {
    readonly min: 120;
    readonly band: "HIGH";
    readonly score: 96;
    readonly label: "hoge productwaarde";
}, {
    readonly min: 80;
    readonly band: "MID";
    readonly score: 78;
    readonly label: "serieuze productwaarde";
}, {
    readonly min: 40;
    readonly band: "LOW";
    readonly score: 46;
    readonly label: "lage productwaarde";
}, {
    readonly min: 0;
    readonly band: "LOW";
    readonly score: 22;
    readonly label: "commodity prijspunt";
}];
export type HeroPriceBand = "LOW" | "MID" | "HIGH" | "PREMIUM" | "UNKNOWN";
/**
 * Company scale. Both ends are wrong: a hobby shop cannot buy the work, a
 * national chain does not need it and will never let one page be rebuilt.
 */
export declare const COMPANY_SCALE: {
    /** Retailer breadth above this reads as chain behaviour. */
    readonly chainBreadthLimit: 45;
    /** Retail scale above this is a national or international retailer. */
    readonly largeRetailerScale: 55;
    /** Maturity below this is an amateur shop, not a business. */
    readonly amateurMaturity: 30;
    /** Maturity above this plus wide reach is a mature international player. */
    readonly matureBusiness: 78;
    /** Fewer homepage product links than this on a webshop reads as unfinished. */
    readonly minHomepageProductLinks: 3;
};
/** Weights for high_ticket_focused_fit_score. They sum to 1. */
export declare const HIGH_TICKET_FIT_WEIGHTS: {
    readonly productValue: 0.18;
    readonly heroProminence: 0.12;
    readonly catalogCompactness: 0.14;
    readonly ownBrand: 0.14;
    readonly companyScaleFit: 0.12;
    readonly assetReadiness: 0.1;
    readonly deepDiveFit: 0.1;
    readonly currentPdpWeakness: 0.1;
};
/**
 * Penalties. Everything here answers the same question: is this a brand with a
 * product, or a shop with an assortment?
 */
export declare const HIGH_TICKET_PENALTIES: {
    readonly massRetailer: 40;
    readonly largeCatalog: 18;
    readonly resellerHeavy: 20;
    readonly commodityPrice: 16;
    readonly alreadyPolishedPdp: 22;
    readonly weakBusiness: 18;
    readonly unverifiedCatalog: 8;
    readonly noAdsEvidence: 10;
};
export declare const HIGH_TICKET_THRESHOLDS: {
    /** Below this a domain is not worth manual review. */
    readonly seriousCandidate: 58;
    /** Own-brand signal below this reads as reseller. */
    readonly minOwnBrandSignal: 45;
    /** Hero price we prefer, without rejecting below it. */
    readonly preferredMinHeroPrice: 80;
    /** Hard floor: under this the project economics never work. */
    readonly hopelessHeroPrice: 25;
};
/**
 * Estimated contrast ceiling, computed before any Claude call.
 *
 * The M9.3.4 run proved the expensive lesson: a shop with a already-polished
 * product page cannot produce a convincing before/after, and finding that out
 * costs a full audit. These rules approximate the ceiling from signals we
 * already have for free, so we stop paying to learn it.
 */
export declare const CONTRAST_CEILING_RULES: {
    /** Design target needs this much contrast, so the estimate is judged against it. */
    readonly designTargetContrast: 62;
    /** Weak page plus good material: the estimate may reach this. */
    readonly maxCeiling: 92;
    /** Nothing observed: an honest mid estimate, never a promise. */
    readonly unknownCeiling: 55;
    /** Assets below this cap the ceiling: nothing to build a premium page from. */
    readonly thinAssetReadiness: 45;
    readonly thinAssetCeiling: 48;
    /** A page that already looks finished caps the ceiling hard. */
    readonly strongPdpWeaknessFloor: 35;
    readonly strongPdpCeiling: 40;
};
export declare function catalogBandFor(size: number | null): {
    score: number;
    label: string;
};
export declare function priceBandFor(price: number | null): {
    band: HeroPriceBand;
    score: number;
    label: string;
};
//# sourceMappingURL=highTicketProspect.d.ts.map