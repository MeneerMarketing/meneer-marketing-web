/**
 * Milestone 9.5 — design-gap-first high-ticket discovery.
 *
 * Discovery order changes: weak or generic PDPs must surface before any full
 * CRO audit. Economic fit stays important but no longer alone decides ranking.
 */

import type { ProductionBranch } from "./productionDiscovery.js";
import { HIGH_TICKET_BRANCHES, PARKED_ARCHETYPES } from "./highTicketDiscovery.js";

export const M95_DISCOVERY_VERSION = "DESIGN_GAP_HIGH_TICKET_DISCOVERY_V1" as const;

/** Reuse the same controlled product families from M9.4. */
export const DESIGN_GAP_BRANCHES: ProductionBranch[] = HIGH_TICKET_BRANCHES;

export const M95_DISCOVERY = {
  milestone: "M9.5",
  profile: "DESIGN_GAP_HIGH_TICKET_PROSPECT",
  maxKeywords: 24,
  maxKeywordsPerFamily: 3,
  estimatedSerpCostPerKeyword: 0.004,
  keywordIdeasLimit: 140,
  maxLightChecks: 110,
  maxCatalogChecks: 100,
  maxHeroResolutions: 45,
  maxHeroesPerDomain: 3,
  sellerProbeTimeoutMs: 12_000,
  maxSellerProbesPerKeyword: 14,
  minKeywordQualityScore: 26,
  /** Domains that pass economic pre-screen may enter cheap PDP capture. */
  maxEconomicPrequalified: 32,
  /** Hard cap on viewport captures (desktop + mobile per domain). */
  maxDesignGapScreens: 14,
  /** Optional Haiku vision calls, only after economic pre-screen. */
  maxVisionScreens: 10,
  maxCandidates: 15,
  maxRanked: 10,
  maxScreenshots: 5,
  /** Share of keywords tagged shopping_first (product + kopen intent). */
  shoppingFirstShare: 0.38,
} as const;

export const M95_SCREENSHOT_CONFIG = {
  outputDir: "m9.5-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  timeoutMs: 45_000,
} as const;

export type DesignGapFunnelStage =
  | "raw_advertisers"
  | "prospect_eligible"
  | "economic_prequalified"
  | "design_gap_screened"
  | "preaudit_gate_passed"
  | "design_gap_candidate";

export const DESIGN_GAP_FUNNEL_LABELS: Record<DesignGapFunnelStage, string> = {
  raw_advertisers: "raw_advertisers",
  prospect_eligible: "prospect_eligible",
  economic_prequalified: "economic_prequalified",
  design_gap_screened: "design_gap_screened",
  preaudit_gate_passed: "preaudit_gate_passed",
  design_gap_candidate: "design_gap_candidate",
};

export const PARKED_FOR_M95 = PARKED_ARCHETYPES;
