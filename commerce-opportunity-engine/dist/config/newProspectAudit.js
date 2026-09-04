/**
 * Milestone 9.3.4 — from the new M9.3.3 prospect pool to one design target.
 *
 * The pool is cheap-scored only. This config decides which six of them are
 * worth a real CRO audit, what a design target has to prove afterwards, and how
 * the final ranking is composed without counting the same evidence twice.
 */
export const M934 = {
    milestone: "M9.3.4",
    /** Hard ceiling on audits, independent of the budget cap. */
    maxAudits: 6,
    /**
     * A page that turns out to be blocked costs no Claude call, so the next
     * ranked candidate may take its slot. The ceiling keeps that from turning
     * into an unbounded crawl.
     */
    maxAuditAttempts: 8,
    /** Below this hero score the product is not a convincing sales target. */
    minHeroScore: 40,
    /**
     * Conservative pre-call estimate per audit, used by the budget gate.
     * Measured over the first run: average $0.0448, worst call $0.051. The gate
     * has to reserve the worst case, otherwise the last call overshoots the cap.
     */
    conservativeAuditCost: 0.055,
    maxDesignCases: 3,
    /** The engineering fixture never competes for the design target. */
    excludedFromDesignTarget: ["tensfact.com"],
};
/**
 * Preselection weights. This runs before any Claude call, so everything here
 * comes from the cheap M9.3.3 signals.
 */
export const PRESELECTION_WEIGHTS = {
    idealPreScore: 0.22,
    ownBrandSignal: 0.14,
    catalogFocus: 0.1,
    catalogSweetSpot: 0.12,
    heroProductValue: 0.1,
    assetReadinessProxy: 0.12,
    deepDiveFitProxy: 0.12,
    googleAdsEvidence: 0.05,
    platformFit: 0.03,
};
/**
 * Penalties. The target is a strong business with a weak page, so anything that
 * says "this is not a real brand with a real product" costs points.
 */
export const PRESELECTION_PENALTIES = {
    /** Wide assortment carried for other brands. */
    resellerHeavy: 18,
    /** Catalog too large for a single hero product story. */
    largeCatalog: 16,
    /** Nothing to build a premium page from. */
    weakAssets: 22,
    /** Cheap commodity: the project economics never work. */
    lowProductValue: 14,
    /** Chain behaviour picked up by the breadth signals. */
    retailerBreadth: 12,
    /** Catalog size never verified, so focus is a guess. */
    unverifiedCatalog: 8,
};
export const PRESELECTION_THRESHOLDS = {
    /** Below this hero price the project economics stop working. */
    lowProductValuePrice: 25,
    /** Above this catalog size a single hero product stops carrying the story. */
    largeCatalogSize: 120,
    /** Asset readiness below this cannot support a premium concept. */
    weakAssetReadiness: 55,
    /** Retailer breadth above this is chain behaviour. */
    retailerBreadthLimit: 45,
    /** Own-brand signal below this reads as reseller. */
    resellerOwnBrandLimit: 45,
};
/** Catalog sweet spot for a deep-dive PDP proposition. */
export const PRESELECTION_CATALOG_BANDS = [
    { min: 1, max: 5, score: 55, label: "erg klein, volwassenheid checken" },
    { min: 6, max: 30, score: 96, label: "ideaal" },
    { min: 31, max: 75, score: 90, label: "sterk" },
    { min: 76, max: 150, score: 62, label: "bruikbaar" },
    { min: 151, max: 500, score: 30, label: "te breed" },
    { min: 501, max: 999999, score: 10, label: "veel te breed" },
];
/**
 * The cheap own-brand signal is a number, but every downstream scorer speaks in
 * commerce models. These bands translate one into the other so the new pool can
 * use the same scoring as the existing pool.
 */
export const OWN_BRAND_MODEL_BANDS = [
    { min: 72, model: "DTC_OWN_BRAND" },
    { min: 58, model: "MOSTLY_OWN_BRAND" },
    { min: 45, model: "MIXED" },
    { min: 0, model: "SPECIALIST_RESELLER" },
];
/**
 * What a candidate has to prove after a real audit to be the design target.
 * Nothing is forced: if nobody clears this, the run reports no target.
 */
export const DESIGN_TARGET_GATE = {
    /** Preferred, not absolute: a slightly better page can still win on contrast. */
    preferredMaxCurrentPdpQuality: 60,
    hardMaxCurrentPdpQuality: 70,
    minTransformation: 70,
    minConceptContrast: 62,
    minAssetReadiness: 65,
    minDeepDiveFit: 70,
    minBusinessMaturity: 40,
    minAuditConfidence: 55,
    requireCommercialProof: true,
    requireFocusedBusiness: true,
    blockedBusinessTypes: [
        "MASS_RETAILER",
        "GENERAL_RETAILER",
        "MARKETPLACE",
        "COMPARISON_SITE",
    ],
};
/**
 * true_sales_design_score.
 *
 * Deliberately not a sum of everything we have. Sales fit, contrast, deep-dive
 * fit and transformation all read the same CRO scores, so stacking them would
 * count one weak product page four times. Each input here contributes one
 * distinct thing:
 *
 *   contrast   — how impressive the before/after will be (room x material)
 *   salesFit   — the commercial case, with CRO influence already inside it
 *   economics  — whether the project is worth building
 *   confidence — how much we trust the measurement
 *
 * Transformation and deep-dive fit are deliberately absent: they are already
 * inside contrast and sales fit respectively.
 */
export const TRUE_SALES_DESIGN_WEIGHTS = {
    conceptContrast: 0.4,
    salesFit: 0.32,
    economicFit: 0.18,
    measurementConfidence: 0.1,
};
export const TRUE_SALES_DESIGN_FORMULA = "true_sales_design = 0.40*concept_contrast + 0.32*outreach_concept_fit + 0.18*project_economic_fit + 0.10*measurement_confidence. " +
    "Transformation en deep-dive fit zitten al in contrast en sales fit, dus die tellen niet nog een keer mee.";
/**
 * The page extractor reads the DOM, so copy inside tabs, accordions and lazy
 * blocks disappears from the representation. The audit itself looks at
 * screenshots and does see that copy. When the two disagree, the audit wins:
 * an empty extraction next to a rich storytelling score is a parsing gap, not
 * a page without content.
 */
export const EXTRACTION_FALLBACK = {
    /** Audit subscore above which we accept that the page does have a story. */
    minSignalForContent: 60,
    /** Length we assume in that case, enough to clear the thin-content penalty. */
    assumedDescriptionLength: 220,
};
export const SCREENSHOT_CONFIG = {
    outputDir: "m9.3.4-screenshots",
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
    fullPage: true,
    timeoutMs: 45000,
};
/**
 * A hero URL has to be an actual product page. The homepage is what the
 * resolver falls back to when it finds nothing, and auditing a homepage would
 * produce scores for the wrong page.
 */
export const HERO_URL_RULES = {
    productPathPatterns: [/\/products?\//i, /\/p\//i, /-p-\d+/i, /\/artikel\//i],
    /** Minimum path segments before a URL can be a product page at all. */
    minPathSegments: 1,
    /**
     * Webshops park back-office artifacts on the same product route: payment
     * links, order corrections, delivery surcharges, showroom order forms. They
     * look like product URLs, they are not pages a customer ever buys from, and
     * auditing one produces a near-zero score for a shop that may be fine.
     */
    internalArtifactSlugTokens: [
        "betaalverzoek",
        "betaallink",
        "betaal-link",
        "payment-request",
        "paymentlink",
        "bestelling",
        "order-",
        "wijziging",
        "aanbetaling",
        "restbetaling",
        "meerprijs",
        "toeslag",
        "montagekosten",
        "omruilkosten",
        "verzendkosten",
        "bezorgkosten",
        "annulering",
        "retourkosten",
        "showroom",
        "leverancier",
        "test-product",
        "testproduct",
        "cadeaubon",
        "gift-card",
        "giftcard",
    ],
};
/**
 * A product page a customer cannot buy from is not a product page, and its
 * near-zero CRO scores say more about the page type than about the shop.
 *
 * Price alone cannot carry this check: the extractor regularly misses prices
 * that are rendered by a variant widget. So a page counts as purchasable when
 * it shows a price, or offers payment methods, or has a real buy block behind
 * its cart button. Only when all three are absent do we call it a form.
 */
export const HERO_PAGE_VALIDITY = {
    enabled: true,
    /** Below this the buy block is not weak, it is missing. */
    minBuyblockForPurchasePage: 25,
};
export function catalogSweetSpotScore(size) {
    if (size == null)
        return { score: 45, label: "onbekend" };
    for (const band of PRESELECTION_CATALOG_BANDS) {
        if (size >= band.min && size <= band.max) {
            return { score: band.score, label: band.label };
        }
    }
    return { score: 10, label: "veel te breed" };
}
export function commerceModelFromOwnBrandSignal(signal) {
    if (signal == null)
        return "UNKNOWN";
    for (const band of OWN_BRAND_MODEL_BANDS) {
        if (signal >= band.min)
            return band.model;
    }
    return "SPECIALIST_RESELLER";
}
//# sourceMappingURL=newProspectAudit.js.map