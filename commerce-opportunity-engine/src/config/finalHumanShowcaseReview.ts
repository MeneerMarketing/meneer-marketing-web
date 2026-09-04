/**
 * Milestone 9.9.6 — final human showcase review.
 */

export const M996_REVIEW_VERSION = "FINAL_HUMAN_SHOWCASE_REVIEW_V1" as const;
export const M996_REPORT_PATH = "reports/final-human-showcase-review.json";
export const M996_DASHBOARD_REPORT_PATH =
  "dashboard/src/preview/concepts/data/final-human-showcase-review.json";
export const M996_INPUT_M994 = "reports/visual-focused-brand-production-report.json";
export const M996_INPUT_M995 = "reports/pre-vision-integrity-report.json";

export const M996_SHOWCASE_DOMAINS = [
  "cleanmastershop.nl",
  "nordinahome.nl",
  "oceancross.nl",
] as const;

export type M996ShowcaseDomain = (typeof M996_SHOWCASE_DOMAINS)[number];

export const M996_SCREENSHOT_KEYS = [
  "homepage-desktop-1440x1000",
  "pdp-desktop-1440x1000",
  "pdp-mobile-390x844",
] as const;

export const M996_FULL_PAGE_KEY = "pdp-full-page";
