/**
 * Milestone 9.9.5 — pre-vision marketplace + capture integrity.
 */
export declare const M995_INTEGRITY_VERSION: "PRE_VISION_MARKETPLACE_CAPTURE_INTEGRITY_V1";
export declare const M995_REPORT_PATH = "reports/pre-vision-integrity-report.json";
export declare const M995_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/pre-vision-integrity-report.json";
export declare const M994_INPUT_REPORT_PATH = "reports/visual-focused-brand-production-report.json";
export declare const M995_MAX_VALIDATED_PROSPECTS = 3;
export declare const M995_MAX_ANTHROPIC_COST = 0.003;
/** Deterministic safety net — classifier must not rely on this alone. */
export declare const KNOWN_MARKETPLACE_DOMAIN_TOKENS: readonly ["joom.com", "joom.", "amazon.", "bol.com", "aliexpress", "ebay.", "temu.", "wish.", "etsy.", "marktplaats", "fruugo", "ubuy.", "shein.", "onbuy.", "rakuten.", "cdiscount."];
export declare const M995_JOOM_REGRESSION: {
    domain: string;
    productUrl: string;
    expectedBusinessType: "MARKETPLACE";
    expectedHardRejectBeforeVision: boolean;
    expectedVisionScoreAllowed: boolean;
    expectedShowcaseCandidate: boolean;
};
export declare const M995_TRVLMORE_REVIEW: {
    domain: string;
    productUrl: string;
    homepage: string;
};
export declare const M995_CLEANMASTER_FIXTURE: {
    domain: string;
    role: "POSITIVE_VISUAL_FIXTURE";
};
export declare const M995_SCREENSHOT_DIR = "m9.9.5-screenshots";
//# sourceMappingURL=preVisionIntegrity.d.ts.map