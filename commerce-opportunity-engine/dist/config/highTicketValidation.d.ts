/**
 * Milestone 9.4.1 — final design target validation.
 *
 * Two audits max. No new discovery. Vitalwave is the primary candidate, not a
 * hardcoded winner: the same gates apply to everyone.
 */
export declare const M941: {
    readonly milestone: "M9.4.1";
    readonly version: "HIGH_TICKET_DESIGN_VALIDATION_V1";
    readonly maxAudits: 2;
    readonly maxAuditAttempts: 2;
    readonly minHeroScore: 40;
    /** Worst-case reserve per Claude call (M9.3.4 measured ~0.051). */
    readonly conservativeAuditCost: 0.055;
    readonly primaryDomain: "vitalwave.nl";
    readonly challengerFirst: "revigurize.nl";
    readonly challengerFallback: "hottublifestyle.nl";
    readonly expectedPrimaryKeyword: "led haargroei helm thuis";
};
/** Hard gate stays at 62. First showcase prefers 65+. */
export declare const SHOWCASE_CONTRAST: {
    readonly hardMin: 62;
    readonly preferredMin: 65;
};
/** Revigurize must clear these before it beats hottublifestyle as challenger. */
export declare const CHALLENGER_QUALIFICATION: {
    readonly minCatalogFocus: 55;
    readonly maxCatalogSize: 100;
    readonly minBusinessMaturity: 40;
    readonly minAssetReadiness: 65;
    readonly minHighTicketFit: 58;
    readonly minHeroPrice: 80;
};
export declare const SCREENSHOT_CONFIG: {
    readonly outputDir: "m9.4.1-screenshots";
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
//# sourceMappingURL=highTicketValidation.d.ts.map