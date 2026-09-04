/**
 * Milestone 9.6 — BRAND_FIRST_HIGH_TICKET_PROSPECT profile and run caps.
 */

export const BRAND_FIRST_HIGH_TICKET_PROFILE_VERSION =
  "BRAND_FIRST_HIGH_TICKET_PROSPECT_V1" as const;

export const M96_DISCOVERY_VERSION = "BRAND_FIRST_HIGH_TICKET_DISCOVERY_V1" as const;

export const BRAND_FIRST_CATALOG_BANDS = [
  { min: 3, max: 30, score: 100, label: "zeer sterk" },
  { min: 31, max: 60, score: 88, label: "sterk" },
  { min: 61, max: 100, score: 68, label: "bruikbaar" },
  { min: 101, max: 200, score: 38, label: "penalty" },
  { min: 201, max: 999999, score: 12, label: "sterke penalty" },
] as const;

export function catalogBandForBrandFirst(size: number | null): { score: number; label: string } {
  if (size == null) return { score: 52, label: "onbekend" };
  for (const band of BRAND_FIRST_CATALOG_BANDS) {
    if (size >= band.min && size <= band.max) return { score: band.score, label: band.label };
  }
  return { score: 12, label: "sterke penalty" };
}

export const BRAND_FIRST_HERO_ECONOMICS = {
  sweetMin: 150,
  sweetMax: 750,
  positiveMin: 100,
  allowedPremiumMin: 750,
} as const;

/** Organic query reject tokens — no retailer/review/comparison intent. */
export const ORGANIC_QUERY_REJECT = [
  "beste",
  "review",
  "vergelijk",
  "kopen bij",
  "goedkoop",
  "kruidvat",
  "bol.com",
  "amazon",
  "marktplaats",
] as const;

export type BrandFirstProductFamilyId =
  | "BEAUTY_TECH"
  | "HAIR_SCALP_TECH"
  | "RECOVERY_TECH"
  | "BODY_WELLNESS"
  | "PERSONAL_CARE_TECH"
  | "HOME_WELLNESS"
  | "NICHE_HOME_TECH"
  | "ERGONOMIC_LIFESTYLE_TECH";

export interface BrandFirstProductFamily {
  id: BrandFirstProductFamilyId;
  label: string;
  archetypeId: string;
  familyIds: string[];
  /** Non-branded product-intent queries for organic SERP. */
  organicQueries: string[];
  maxShortlisted: number;
}

export const BRAND_FIRST_PRODUCT_FAMILIES: BrandFirstProductFamily[] = [
  {
    id: "BEAUTY_TECH",
    label: "Beauty tech",
    archetypeId: "BEAUTY_DEVICES",
    familyIds: ["led_masks", "microneedling_devices"],
    organicQueries: [
      "microcurrent gezicht apparaat",
      "led masker lichttherapie",
      "rf huidverjonging apparaat thuis",
    ],
    maxShortlisted: 3,
  },
  {
    id: "HAIR_SCALP_TECH",
    label: "Hair & scalp tech",
    archetypeId: "HAIR_SCALP_TECH",
    familyIds: ["laser_hair_growth", "scalp_treatment_devices"],
    organicQueries: [
      "laser haargroei helm thuis",
      "led haargroei cap",
      "hoofdhuid lichttherapie apparaat",
    ],
    maxShortlisted: 3,
  },
  {
    id: "RECOVERY_TECH",
    label: "Recovery tech",
    archetypeId: "WELLNESS_DEVICES",
    familyIds: ["compression_therapy", "red_light_therapy"],
    organicQueries: [
      "compressie laarzen herstel",
      "rood licht therapie paneel",
      "infrarood sauna thuis apparaat",
    ],
    maxShortlisted: 3,
  },
  {
    id: "BODY_WELLNESS",
    label: "Body wellness",
    archetypeId: "WELLNESS_DEVICES",
    familyIds: ["sauna_ice_bath"],
    organicQueries: [
      "hottub eigen bouw houtgestookt",
      "ijsbad thuis recovery",
      "outdoor sauna specialist",
    ],
    maxShortlisted: 3,
  },
  {
    id: "PERSONAL_CARE_TECH",
    label: "Personal care tech",
    archetypeId: "PERSONAL_CARE_TECH",
    familyIds: ["oral_care_devices"],
    organicQueries: [
      "waterflosser monddouche premium",
      "elektrische tandenborstel sonic premium",
      "ultrasoon scaler tandheelkundig",
    ],
    maxShortlisted: 3,
  },
  {
    id: "HOME_WELLNESS",
    label: "Home wellness",
    archetypeId: "HOME_WELLNESS_TECH",
    familyIds: ["home_spa_systems", "water_air_treatment"],
    organicQueries: [
      "osmose waterfilter systeem huis",
      "thuis spa jacuzzi compact",
      "waterontharder osmose premium",
    ],
    maxShortlisted: 3,
  },
  {
    id: "NICHE_HOME_TECH",
    label: "Niche home tech",
    archetypeId: "NICHE_CONSUMER_TECH",
    familyIds: ["single_purpose_devices"],
    organicQueries: [
      "single purpose wellness device",
      "premium huishoud apparaat specialist",
      "compact wellness apparaat merk",
    ],
    maxShortlisted: 3,
  },
  {
    id: "ERGONOMIC_LIFESTYLE_TECH",
    label: "Ergonomic lifestyle",
    archetypeId: "NICHE_HOME_COMFORT",
    familyIds: ["ergonomic_workspace"],
    organicQueries: [
      "ergonomische bureaustoel specialist merk",
      "standing desk elektrisch merk",
      "ergonomische werkplek premium",
    ],
    maxShortlisted: 3,
  },
];

export const M96_PARKED_ARCHETYPES = [
  "SLEEP_COMFORT",
  "PET_TECH",
  "PREMIUM_PET",
  "FITNESS_SPECIALIST",
] as const;

export const M96_DISCOVERY = {
  milestone: "M9.6",
  maxOrganicQueries: 18,
  maxBrandsPerFamily: 6,
  estimatedSerpCostPerKeyword: 0.004,
  maxBrandCandidates: 30,
  maxEconomicQualified: 15,
  maxDesignGapScreens: 10,
  maxManualReview: 5,
  maxVisionScreens: 10,
  firstPartyMinConfidence: 58,
  crawlTimeoutMs: 20_000,
  screenshotDir: "m9.6-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  screenshotTimeoutMs: 45_000,
  paidValidationMaxCandidates: 12,
  paidValidationKeywordsPerBrand: 2,
} as const;

/** Known mass retailers — never brand-first candidates. */
export const M96_RETAILER_DOMAIN_HINTS = [
  "bol.com",
  "amazon.",
  "coolblue",
  "mediamarkt",
  "zalando",
  "marktplaats",
  "ebay.",
  "temu.",
  "aliexpress",
  "beslist",
  "kieskeurig",
  "maxict",
  "xxlhoreca",
  "quirumed",
  "fysiosupplies",
  "bigshopper",
  "lionshome",
  "praxis.",
  "hornbach",
  "ikea.",
] as const;

export type PaidAcquisitionLevel = "CONFIRMED" | "LIKELY" | "NOT_FOUND" | "UNKNOWN";

export type EntityRole = "MERCHANT_DOMAIN" | "PRODUCT_BRAND" | "OFFICIAL_BRAND_DOMAIN";
