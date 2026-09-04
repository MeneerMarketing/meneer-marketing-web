/**
 * Milestone 9.6.1 — balanced brand-first calibration across product families.
 */

import type { BrandFirstProductFamilyId } from "./brandFirstHighTicket.js";

export const M961_DISCOVERY_VERSION = "BRAND_FIRST_BALANCED_CALIBRATION_V1" as const;

export const M961_PROFILE_VERSION = "BRAND_FIRST_HIGH_TICKET_PROSPECT_V1" as const;

/** Parked for acquisition discovery — architecture retained. */
export const M961_PARKED_QUERY_PATTERNS = [
  "led masker",
  "led mask",
  "lichttherapie masker",
  "led gezichtsmasker",
  "led neck",
  "neck mask",
  "led therapie gezicht",
  "led lichttherapie mask",
] as const;

export const M961_PARKED_FAMILY_TAGS = [
  "LED_FACE_MASK",
  "LED_NECK_MASK",
  "PARKED_LOW_DESIGN_GAP_YIELD",
] as const;

export type M961ActiveFamilyId = Exclude<
  BrandFirstProductFamilyId,
  never
>;

export interface M961ProductFamily {
  id: M961ActiveFamilyId;
  label: string;
  archetypeId: string;
  organicQueries: string[];
  maxShortlisted: number;
}

/** Concrete product-mechanism queries — no broad category fluff. */
export const M961_PRODUCT_FAMILIES: M961ProductFamily[] = [
  {
    id: "HAIR_SCALP_TECH",
    label: "Hair & scalp tech",
    archetypeId: "HAIR_SCALP_TECH",
    organicQueries: [
      "low level laser therapy haarhelm merk",
      "laser haargroei device thuis merk",
      "hoofdhuid lichttherapie scalp device",
    ],
    maxShortlisted: 3,
  },
  {
    id: "RECOVERY_TECH",
    label: "Recovery tech",
    archetypeId: "WELLNESS_DEVICES",
    organicQueries: [
      "compression boots recovery systeem merk",
      "massage gun percussie recovery premium",
      "cold plunge recovery pod compact",
    ],
    maxShortlisted: 3,
  },
  {
    id: "BODY_WELLNESS",
    label: "Body wellness",
    archetypeId: "WELLNESS_DEVICES",
    organicQueries: [
      "rood licht therapie paneel thuis merk",
      "infrarood sauna blanket merk",
      "red light body panel therapy device",
    ],
    maxShortlisted: 3,
  },
  {
    id: "PERSONAL_CARE_TECH",
    label: "Personal care tech",
    archetypeId: "PERSONAL_CARE_TECH",
    organicQueries: [
      "sonic tandenborstel merk premium",
      "waterflosser os irrigator merk",
      "elektrische tandenborstel merk sonic",
    ],
    maxShortlisted: 3,
  },
  {
    id: "HOME_WELLNESS",
    label: "Home wellness",
    archetypeId: "HOME_WELLNESS_TECH",
    organicQueries: [
      "reverse osmosis waterfilter onder kast merk",
      "elektrische sauna cabin compact merk",
      "osmose waterfilter systeem premium merk",
    ],
    maxShortlisted: 3,
  },
  {
    id: "NICHE_HOME_TECH",
    label: "Niche home tech",
    archetypeId: "NICHE_CONSUMER_TECH",
    organicQueries: [
      "premium luchtbevochtiger merk",
      "specialist luchtzuiveraar merk",
      "compact luchtzuivering device merk",
    ],
    maxShortlisted: 3,
  },
  {
    id: "ERGONOMIC_LIFESTYLE_TECH",
    label: "Ergonomic lifestyle",
    archetypeId: "NICHE_HOME_COMFORT",
    organicQueries: [
      "ergonomische bureaustoel merk mesh",
      "elektrisch zit-sta bureau merk",
      "ergonomische werkstoel specialist merk",
    ],
    maxShortlisted: 3,
  },
  {
    id: "BEAUTY_TECH",
    label: "Beauty tech (non-LED)",
    archetypeId: "BEAUTY_DEVICES",
    organicQueries: [
      "microcurrent gezicht device merk",
      "rf microneedling device thuis merk",
      "radiofrequency huidverjonging apparaat merk",
    ],
    maxShortlisted: 2,
  },
];

export const M961_DISCOVERY = {
  milestone: "M9.6.1",
  maxQueriesPerFamily: 2,
  maxTotalOrganicQueries: 16,
  estimatedSerpCostPerKeyword: 0.004,
  maxBrandsPerFamily: 4,
  maxFirstPartyCandidates: 24,
  maxDesignGapScreens: 12,
  maxManualReview: 5,
  maxVisionScreens: 12,
  paidValidationMaxCandidates: 8,
  paidValidationKeywordsPerBrand: 2,
  firstPartyMinConfidence: 58,
  crawlTimeoutMs: 20_000,
  screenshotDir: "m9.6.1-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  screenshotTimeoutMs: 45_000,
  highGapVisualMin: 45,
  highGapPurchaseMin: 45,
} as const;

export function isParkedLedQuery(query: string): boolean {
  const lower = query.toLowerCase();
  return M961_PARKED_QUERY_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function buildM961RoundRobinQueries(): Array<{
  query: string;
  familyId: M961ActiveFamilyId;
  familyLabel: string;
  archetypeId: string;
}> {
  const rows: Array<{
    query: string;
    familyId: M961ActiveFamilyId;
    familyLabel: string;
    archetypeId: string;
  }> = [];

  const familyRows = M961_PRODUCT_FAMILIES.map((family) => ({
    familyId: family.id,
    familyLabel: family.label,
    archetypeId: family.archetypeId,
    queries: family.organicQueries.filter((q) => !isParkedLedQuery(q)),
  }));

  for (let round = 0; round < M961_DISCOVERY.maxQueriesPerFamily; round += 1) {
    for (const row of familyRows) {
      const query = row.queries[round];
      if (!query) continue;
      rows.push({
        query,
        familyId: row.familyId,
        familyLabel: row.familyLabel,
        archetypeId: row.archetypeId,
      });
      if (rows.length >= M961_DISCOVERY.maxTotalOrganicQueries) return rows;
    }
  }

  return rows;
}

export type FamilyVerdict = "STRONG" | "PROMISING" | "WEAK" | "PARK";

export type ManualReviewVerdict = "TRUE_MANUAL_REVIEW_CANDIDATE" | "NO_TARGET";

export type PurchaseMode =
  | "DIRECT_ECOMMERCE"
  | "CONFIGURABLE_ECOMMERCE"
  | "LEAD_GENERATION"
  | "SHOWROOM_ASSISTED"
  | "UNKNOWN";
