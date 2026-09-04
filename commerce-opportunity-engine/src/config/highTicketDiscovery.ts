/**
 * Milestone 9.4 — high-ticket focused brand discovery.
 *
 * Product type decides, not branch. Every family here sells something that
 * costs real money, needs explaining, and can carry a single hero product page.
 */

import type { ProductionBranch } from "./productionDiscovery.js";

export const M94_DISCOVERY_VERSION = "HIGH_TICKET_FOCUSED_DISCOVERY_V1" as const;

export const HIGH_TICKET_BRANCHES: ProductionBranch[] = [
  {
    archetypeId: "BEAUTY_DEVICES",
    familyIds: ["led_masks", "microneedling_devices", "ipl_hair_removal"],
    keywordShare: 0.2,
    evidence:
      "Devices met hoge prijs, veel techniek en zichtbaar resultaat. Bewezen archetype uit M9.3.1.",
  },
  {
    archetypeId: "SKINCARE_DEVICES",
    familyIds: ["microcurrent", "cleansing_devices"],
    keywordShare: 0.14,
    evidence: "Microcurrent en RF: apparaten die uitleg vragen, geen losse verzorging.",
  },
  {
    archetypeId: "HAIR_SCALP_TECH",
    familyIds: ["laser_hair_growth", "scalp_treatment_devices"],
    keywordShare: 0.16,
    evidence: "Haargroeitechniek is high-ticket met sterke voor/na logica en weinig ketenaanbod.",
  },
  {
    archetypeId: "WELLNESS_DEVICES",
    familyIds: ["compression_therapy", "red_light_therapy", "sauna_ice_bath"],
    keywordShare: 0.2,
    evidence:
      "Herstel- en lichttherapie: specialistische merken, prijzen ver boven het commodity-punt.",
  },
  {
    archetypeId: "HOME_WELLNESS_TECH",
    familyIds: ["home_spa_systems", "water_air_treatment"],
    keywordShare: 0.16,
    evidence: "Installaties met echte consideration, verkocht door specialisten in plaats van ketens.",
  },
  {
    archetypeId: "PERSONAL_CARE_TECH",
    familyIds: ["oral_care_devices"],
    keywordShare: 0.08,
    evidence: "Smalle testfamilie: alleen devices, om te zien of er merken achter zitten.",
  },
  {
    archetypeId: "NICHE_CONSUMER_TECH",
    familyIds: ["single_purpose_devices"],
    keywordShare: 0.06,
    evidence: "Kleine verkenning van single-purpose devices buiten de elektronicaretail.",
  },
];

/** Parked on purpose, with the reason, so nobody switches them back blind. */
export const PARKED_ARCHETYPES = [
  {
    archetypeId: "SLEEP_COMFORT",
    reason:
      "Een eerste design target hier zou een directe BestRest-concurrent zijn. Data blijft bewaard.",
  },
  {
    archetypeId: "PET_TECH",
    reason:
      "M9.3.4: vier audits leverden contrast 33-46. De pagina's zijn te verzorgd voor een before/after.",
  },
] as const;

export const M94_DISCOVERY = {
  milestone: "M9.4",
  /** Hard ceiling on SERP samples, the only per-unit DataForSEO spend. */
  maxKeywords: 26,
  maxKeywordsPerFamily: 4,
  estimatedSerpCostPerKeyword: 0.004,
  keywordIdeasLimit: 150,
  /**
   * Cheap homepage checks, one fetch each, no DataForSEO cost. The caps sit
   * above the eligible pool on purpose: when they truncate, which domains get
   * measured depends on how many crawls happened to fail, and two passes over
   * the same SERP data produce different candidates.
   */
  maxLightChecks: 110,
  maxCatalogChecks: 100,
  maxHeroResolutions: 45,
  maxHeroesPerDomain: 3,
  sellerProbeTimeoutMs: 12_000,
  maxSellerProbesPerKeyword: 12,
  /** Keywords below this SERP quality never contribute prospects. */
  minKeywordQualityScore: 26,
  /** Serious candidates carried into the report. */
  maxCandidates: 20,
  maxRanked: 10,
  maxScreenshots: 5,
} as const;

export const SCREENSHOT_CONFIG = {
  outputDir: "m9.4-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  timeoutMs: 45000,
} as const;

export type HighTicketFunnelStage =
  | "raw_advertisers"
  | "prospect_eligible"
  | "ecommerce_specialists"
  | "compact_catalog"
  | "own_brand"
  | "high_ticket_hero"
  | "serious_candidate";

export const FUNNEL_LABELS: Record<HighTicketFunnelStage, string> = {
  raw_advertisers: "Ruwe advertisers",
  prospect_eligible: "Door de prospect gate",
  ecommerce_specialists: "Ecommerce specialisten",
  compact_catalog: "Compacte catalogus",
  own_brand: "Eigen merk of grotendeels eigen merk",
  high_ticket_hero: "Heroproduct met serieuze waarde",
  serious_candidate: "Serieuze kandidaat",
};
