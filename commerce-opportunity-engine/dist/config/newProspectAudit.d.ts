/**
 * Milestone 9.3.4 — from the new M9.3.3 prospect pool to one design target.
 *
 * The pool is cheap-scored only. This config decides which six of them are
 * worth a real CRO audit, what a design target has to prove afterwards, and how
 * the final ranking is composed without counting the same evidence twice.
 */
export declare const M934: {
    readonly milestone: "M9.3.4";
    /** Hard ceiling on audits, independent of the budget cap. */
    readonly maxAudits: 6;
    /**
     * A page that turns out to be blocked costs no Claude call, so the next
     * ranked candidate may take its slot. The ceiling keeps that from turning
     * into an unbounded crawl.
     */
    readonly maxAuditAttempts: 8;
    /** Below this hero score the product is not a convincing sales target. */
    readonly minHeroScore: 40;
    /**
     * Conservative pre-call estimate per audit, used by the budget gate.
     * Measured over the first run: average $0.0448, worst call $0.051. The gate
     * has to reserve the worst case, otherwise the last call overshoots the cap.
     */
    readonly conservativeAuditCost: 0.055;
    readonly maxDesignCases: 3;
    /** The engineering fixture never competes for the design target. */
    readonly excludedFromDesignTarget: readonly ["tensfact.com"];
};
/**
 * Preselection weights. This runs before any Claude call, so everything here
 * comes from the cheap M9.3.3 signals.
 */
export declare const PRESELECTION_WEIGHTS: {
    readonly idealPreScore: 0.22;
    readonly ownBrandSignal: 0.14;
    readonly catalogFocus: 0.1;
    readonly catalogSweetSpot: 0.12;
    readonly heroProductValue: 0.1;
    readonly assetReadinessProxy: 0.12;
    readonly deepDiveFitProxy: 0.12;
    readonly googleAdsEvidence: 0.05;
    readonly platformFit: 0.03;
};
/**
 * Penalties. The target is a strong business with a weak page, so anything that
 * says "this is not a real brand with a real product" costs points.
 */
export declare const PRESELECTION_PENALTIES: {
    /** Wide assortment carried for other brands. */
    readonly resellerHeavy: 18;
    /** Catalog too large for a single hero product story. */
    readonly largeCatalog: 16;
    /** Nothing to build a premium page from. */
    readonly weakAssets: 22;
    /** Cheap commodity: the project economics never work. */
    readonly lowProductValue: 14;
    /** Chain behaviour picked up by the breadth signals. */
    readonly retailerBreadth: 12;
    /** Catalog size never verified, so focus is a guess. */
    readonly unverifiedCatalog: 8;
};
export declare const PRESELECTION_THRESHOLDS: {
    /** Below this hero price the project economics stop working. */
    readonly lowProductValuePrice: 25;
    /** Above this catalog size a single hero product stops carrying the story. */
    readonly largeCatalogSize: 120;
    /** Asset readiness below this cannot support a premium concept. */
    readonly weakAssetReadiness: 55;
    /** Retailer breadth above this is chain behaviour. */
    readonly retailerBreadthLimit: 45;
    /** Own-brand signal below this reads as reseller. */
    readonly resellerOwnBrandLimit: 45;
};
/** Catalog sweet spot for a deep-dive PDP proposition. */
export declare const PRESELECTION_CATALOG_BANDS: readonly [{
    readonly min: 1;
    readonly max: 5;
    readonly score: 55;
    readonly label: "erg klein, volwassenheid checken";
}, {
    readonly min: 6;
    readonly max: 30;
    readonly score: 96;
    readonly label: "ideaal";
}, {
    readonly min: 31;
    readonly max: 75;
    readonly score: 90;
    readonly label: "sterk";
}, {
    readonly min: 76;
    readonly max: 150;
    readonly score: 62;
    readonly label: "bruikbaar";
}, {
    readonly min: 151;
    readonly max: 500;
    readonly score: 30;
    readonly label: "te breed";
}, {
    readonly min: 501;
    readonly max: 999999;
    readonly score: 10;
    readonly label: "veel te breed";
}];
/**
 * The cheap own-brand signal is a number, but every downstream scorer speaks in
 * commerce models. These bands translate one into the other so the new pool can
 * use the same scoring as the existing pool.
 */
export declare const OWN_BRAND_MODEL_BANDS: readonly [{
    readonly min: 72;
    readonly model: "DTC_OWN_BRAND";
}, {
    readonly min: 58;
    readonly model: "MOSTLY_OWN_BRAND";
}, {
    readonly min: 45;
    readonly model: "MIXED";
}, {
    readonly min: 0;
    readonly model: "SPECIALIST_RESELLER";
}];
/**
 * What a candidate has to prove after a real audit to be the design target.
 * Nothing is forced: if nobody clears this, the run reports no target.
 */
export declare const DESIGN_TARGET_GATE: {
    /** Preferred, not absolute: a slightly better page can still win on contrast. */
    readonly preferredMaxCurrentPdpQuality: 60;
    readonly hardMaxCurrentPdpQuality: 70;
    readonly minTransformation: 70;
    readonly minConceptContrast: 62;
    readonly minAssetReadiness: 65;
    readonly minDeepDiveFit: 70;
    readonly minBusinessMaturity: 40;
    readonly minAuditConfidence: 55;
    readonly requireCommercialProof: true;
    readonly requireFocusedBusiness: true;
    readonly blockedBusinessTypes: readonly ["MASS_RETAILER", "GENERAL_RETAILER", "MARKETPLACE", "COMPARISON_SITE"];
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
export declare const TRUE_SALES_DESIGN_WEIGHTS: {
    readonly conceptContrast: 0.4;
    readonly salesFit: 0.32;
    readonly economicFit: 0.18;
    readonly measurementConfidence: 0.1;
};
export declare const TRUE_SALES_DESIGN_FORMULA: string;
/**
 * The page extractor reads the DOM, so copy inside tabs, accordions and lazy
 * blocks disappears from the representation. The audit itself looks at
 * screenshots and does see that copy. When the two disagree, the audit wins:
 * an empty extraction next to a rich storytelling score is a parsing gap, not
 * a page without content.
 */
export declare const EXTRACTION_FALLBACK: {
    /** Audit subscore above which we accept that the page does have a story. */
    readonly minSignalForContent: 60;
    /** Length we assume in that case, enough to clear the thin-content penalty. */
    readonly assumedDescriptionLength: 220;
};
export declare const SCREENSHOT_CONFIG: {
    readonly outputDir: "m9.3.4-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly fullPage: true;
    readonly timeoutMs: 45000;
};
/**
 * A hero URL has to be an actual product page. The homepage is what the
 * resolver falls back to when it finds nothing, and auditing a homepage would
 * produce scores for the wrong page.
 */
export declare const HERO_URL_RULES: {
    readonly productPathPatterns: readonly [RegExp, RegExp, RegExp, RegExp];
    /** Minimum path segments before a URL can be a product page at all. */
    readonly minPathSegments: 1;
    /**
     * Webshops park back-office artifacts on the same product route: payment
     * links, order corrections, delivery surcharges, showroom order forms. They
     * look like product URLs, they are not pages a customer ever buys from, and
     * auditing one produces a near-zero score for a shop that may be fine.
     */
    readonly internalArtifactSlugTokens: readonly ["betaalverzoek", "betaallink", "betaal-link", "payment-request", "paymentlink", "bestelling", "order-", "wijziging", "aanbetaling", "restbetaling", "meerprijs", "toeslag", "montagekosten", "omruilkosten", "verzendkosten", "bezorgkosten", "annulering", "retourkosten", "showroom", "leverancier", "test-product", "testproduct", "cadeaubon", "gift-card", "giftcard"];
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
export declare const HERO_PAGE_VALIDITY: {
    readonly enabled: true;
    /** Below this the buy block is not weak, it is missing. */
    readonly minBuyblockForPurchasePage: 25;
};
export declare function catalogSweetSpotScore(size: number | null): {
    score: number;
    label: string;
};
export declare function commerceModelFromOwnBrandSignal(signal: number | null): string;
//# sourceMappingURL=newProspectAudit.d.ts.map