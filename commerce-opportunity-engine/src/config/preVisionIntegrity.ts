/**
 * Milestone 9.9.5 — pre-vision marketplace + capture integrity.
 */

export const M995_INTEGRITY_VERSION = "PRE_VISION_MARKETPLACE_CAPTURE_INTEGRITY_V1" as const;
export const M995_REPORT_PATH = "reports/pre-vision-integrity-report.json";
export const M995_DASHBOARD_REPORT_PATH =
  "dashboard/src/preview/concepts/data/pre-vision-integrity-report.json";
export const M994_INPUT_REPORT_PATH = "reports/visual-focused-brand-production-report.json";

export const M995_MAX_VALIDATED_PROSPECTS = 3;
export const M995_MAX_ANTHROPIC_COST = 0.003;

/** Deterministic safety net — classifier must not rely on this alone. */
export const KNOWN_MARKETPLACE_DOMAIN_TOKENS = [
  "joom.com",
  "joom.",
  "amazon.",
  "bol.com",
  "aliexpress",
  "ebay.",
  "temu.",
  "wish.",
  "etsy.",
  "marktplaats",
  "fruugo",
  "ubuy.",
  "shein.",
  "onbuy.",
  "rakuten.",
  "cdiscount.",
] as const;

export const M995_JOOM_REGRESSION = {
  domain: "joom.com",
  productUrl:
    "https://www.joom.com/nl/products/6913943c96733f0173b55bcc",
  expectedBusinessType: "MARKETPLACE" as const,
  expectedHardRejectBeforeVision: true,
  expectedVisionScoreAllowed: false,
  expectedShowcaseCandidate: false,
};

export const M995_TRVLMORE_REVIEW = {
  domain: "trvlmore.nl",
  productUrl:
    "https://trvlmore.nl/p/campingstoel-met-draagtas-zwart/tm1000332",
  homepage: "https://trvlmore.nl",
};

export const M995_CLEANMASTER_FIXTURE = {
  domain: "cleanmastershop.nl",
  role: "POSITIVE_VISUAL_FIXTURE" as const,
};

export const M995_SCREENSHOT_DIR = "m9.9.5-screenshots";
