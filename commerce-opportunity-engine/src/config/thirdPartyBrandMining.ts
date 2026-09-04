/**
 * Milestone 9.7 — THIRD_PARTY_BRAND_MINING configuration.
 */

export const M97_DISCOVERY_VERSION = "THIRD_PARTY_BRAND_MINING_V1" as const;

export const M97_DISCOVERY_ROUTE = "third_party_brand_mining" as const;

export type ThirdPartySourceType =
  | "SPECIALIST_RETAILER"
  | "MULTIBRAND_RETAILER"
  | "MARKETPLACE_PRODUCT_RESULT"
  | "EDITORIAL_PRODUCT_PAGE"
  | "REVIEW_ROUNDUP_PAGE"
  | "SHOPPING_PRODUCT_RESULT";

export type FirstPartyStoreClass =
  | "DTC_ECOMMERCE"
  | "BRAND_INFORMATION_ONLY"
  | "B2B_ONLY"
  | "DISTRIBUTOR_ONLY"
  | "UNKNOWN";

export type OfficialDomainStatus = "RESOLVED" | "UNRESOLVED_BRAND_DOMAIN";

export interface M97ProductFamily {
  id: string;
  label: string;
  archetypeId: string;
  queries: string[];
}

export const M97_PRODUCT_FAMILIES: M97ProductFamily[] = [
  {
    id: "HAIR_SCALP_TECH",
    label: "Hair & scalp tech",
    archetypeId: "HAIR_SCALP_TECH",
    queries: [
      "laser haargroei helm kopen specialist",
      "LLLT hoofdhuid device review",
    ],
  },
  {
    id: "RECOVERY_TECH",
    label: "Recovery tech",
    archetypeId: "WELLNESS_DEVICES",
    queries: [
      "compressie boots recovery kopen",
      "massage gun percussie premium review",
    ],
  },
  {
    id: "PERSONAL_CARE_TECH",
    label: "Personal care tech",
    archetypeId: "PERSONAL_CARE_TECH",
    queries: [
      "waterflosser premium review vergelijk",
      "sonic tandenborstel specialist review",
    ],
  },
  {
    id: "BODY_WELLNESS",
    label: "Body wellness panels",
    archetypeId: "WELLNESS_DEVICES",
    queries: [
      "rood licht therapie paneel review",
      "infrarood sauna blanket review",
    ],
  },
  {
    id: "PORTABLE_THERAPY_TECH",
    label: "Portable therapy tech",
    archetypeId: "WELLNESS_DEVICES",
    queries: [
      "EMS spier stimulator device review",
      "portable percussion massager premium",
    ],
  },
];

export const M97_DISCOVERY = {
  milestone: "M9.7",
  maxSourceQueries: 12,
  estimatedSerpCostPerKeyword: 0.004,
  maxExtractedBrands: 40,
  maxOfficialResolutions: 20,
  maxEconomicQualified: 12,
  maxDesignGapScreens: 8,
  maxPaidValidation: 8,
  maxManualReview: 5,
  maxVisionScreens: 8,
  minProductBrandConfidence: 52,
  minOfficialDomainConfidence: 58,
  crawlTimeoutMs: 20_000,
  resolutionTimeoutMs: 10_000,
  screenshotDir: "m9.7-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  screenshotTimeoutMs: 45_000,
  paidValidationKeywordsPerBrand: 2,
} as const;

export function buildM97SourceQueries(): Array<{
  query: string;
  familyId: string;
  familyLabel: string;
  archetypeId: string;
}> {
  const rows: Array<{
    query: string;
    familyId: string;
    familyLabel: string;
    archetypeId: string;
  }> = [];

  for (const family of M97_PRODUCT_FAMILIES) {
    for (const query of family.queries) {
      rows.push({
        query,
        familyId: family.id,
        familyLabel: family.label,
        archetypeId: family.archetypeId,
      });
      if (rows.length >= M97_DISCOVERY.maxSourceQueries) return rows;
    }
  }
  return rows;
}
