/**
 * Milestone 9.4.1 — final design target validation.
 *
 * Two audits max. No new discovery. Vitalwave is the primary candidate, not a
 * hardcoded winner: the same gates apply to everyone.
 */

export const M941 = {
  milestone: "M9.4.1",
  version: "HIGH_TICKET_DESIGN_VALIDATION_V1",
  maxAudits: 2,
  maxAuditAttempts: 2,
  minHeroScore: 40,
  /** Worst-case reserve per Claude call (M9.3.4 measured ~0.051). */
  conservativeAuditCost: 0.055,
  primaryDomain: "vitalwave.nl",
  challengerFirst: "revigurize.nl",
  challengerFallback: "hottublifestyle.nl",
  expectedPrimaryKeyword: "led haargroei helm thuis",
} as const;

/** Hard gate stays at 62. First showcase prefers 65+. */
export const SHOWCASE_CONTRAST = {
  hardMin: 62,
  preferredMin: 65,
} as const;

/** Revigurize must clear these before it beats hottublifestyle as challenger. */
export const CHALLENGER_QUALIFICATION = {
  minCatalogFocus: 55,
  maxCatalogSize: 100,
  minBusinessMaturity: 40,
  minAssetReadiness: 65,
  minHighTicketFit: 58,
  minHeroPrice: 80,
} as const;

export const SCREENSHOT_CONFIG = {
  outputDir: "m9.4.1-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  fullPage: true,
  timeoutMs: 45000,
} as const;
