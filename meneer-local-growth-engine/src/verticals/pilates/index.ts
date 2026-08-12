export type DiscoveryScope = "NL" | "VL" | "BOTH";
export type DiscoveryMode = "TEST" | "FULL";

export interface CitySeed {
  slug: string;
  name: string;
  country_code: "NL" | "BE";
  region: string;
  region_group: "NL" | "VL";
  latitude: number;
  longitude: number;
  /** Search radius in km for Business Listings */
  radius_km: number;
}

export interface PilatesVerticalPack {
  slug: "pilates";
  name: string;
  discoveryTerms: string[];
  /** Optional Google category ids if known; empty = rely on title/description filters */
  categoryHints: string[];
  negativeNamePatterns: RegExp[];
  chainDomainHints: string[];
  seoDefaults: {
    primaryTemplate: (city: string) => string;
    secondaryTemplates: ((city: string) => string)[];
  };
  templateVariants: Array<"editorial" | "reformer-minimal" | "soft-movement">;
  cities: {
    NL: CitySeed[];
    VL: CitySeed[];
  };
}

export const pilatesVertical: PilatesVerticalPack = {
  slug: "pilates",
  name: "Pilates",
  discoveryTerms: [
    "Pilates",
    "Pilates studio",
    "Reformer Pilates",
    "Pilates center",
    "Pilates school",
    "Pilates centrum",
  ],
  categoryHints: ["pilates_studio", "pilates"],
  negativeNamePatterns: [
    /fysio/i,
    /fysiotherapie/i,
    /physiotherapy/i,
    /sportschool/i,
    /fitness\s*park/i,
    /basic.?fit/i,
    /trainmore/i,
    /anytime\s*fitness/i,
    /directory/i,
    /gids/i,
  ],
  chainDomainHints: [
    "basic-fit.com",
    "basicfit.com",
    "trainmore.nl",
    "anytimefitness.nl",
    "fitforfree.nl",
  ],
  seoDefaults: {
    primaryTemplate: (city) => `Pilates ${city}`,
    secondaryTemplates: [
      (city) => `Reformer Pilates ${city}`,
      (city) => `Pilates studio ${city}`,
      (city) => `Pilates lessen ${city}`,
    ],
  },
  templateVariants: ["editorial", "reformer-minimal", "soft-movement"],
  cities: {
    NL: [
      {
        slug: "arnhem",
        name: "Arnhem",
        country_code: "NL",
        region: "Gelderland",
        region_group: "NL",
        latitude: 51.9851,
        longitude: 5.8987,
        radius_km: 12,
      },
      {
        slug: "nijmegen",
        name: "Nijmegen",
        country_code: "NL",
        region: "Gelderland",
        region_group: "NL",
        latitude: 51.8126,
        longitude: 5.8372,
        radius_km: 12,
      },
      {
        slug: "utrecht",
        name: "Utrecht",
        country_code: "NL",
        region: "Utrecht",
        region_group: "NL",
        latitude: 52.0907,
        longitude: 5.1214,
        radius_km: 14,
      },
      {
        slug: "amsterdam",
        name: "Amsterdam",
        country_code: "NL",
        region: "Noord-Holland",
        region_group: "NL",
        latitude: 52.3676,
        longitude: 4.9041,
        radius_km: 16,
      },
      {
        slug: "rotterdam",
        name: "Rotterdam",
        country_code: "NL",
        region: "Zuid-Holland",
        region_group: "NL",
        latitude: 51.9244,
        longitude: 4.4777,
        radius_km: 14,
      },
      {
        slug: "den-haag",
        name: "Den Haag",
        country_code: "NL",
        region: "Zuid-Holland",
        region_group: "NL",
        latitude: 52.0705,
        longitude: 4.3007,
        radius_km: 12,
      },
    ],
    VL: [
      {
        slug: "antwerpen",
        name: "Antwerpen",
        country_code: "BE",
        region: "Antwerpen",
        region_group: "VL",
        latitude: 51.2194,
        longitude: 4.4025,
        radius_km: 12,
      },
      {
        slug: "gent",
        name: "Gent",
        country_code: "BE",
        region: "Oost-Vlaanderen",
        region_group: "VL",
        latitude: 51.0543,
        longitude: 3.7174,
        radius_km: 12,
      },
      {
        slug: "brugge",
        name: "Brugge",
        country_code: "BE",
        region: "West-Vlaanderen",
        region_group: "VL",
        latitude: 51.2093,
        longitude: 3.2247,
        radius_km: 10,
      },
      {
        slug: "leuven",
        name: "Leuven",
        country_code: "BE",
        region: "Vlaams-Brabant",
        region_group: "VL",
        latitude: 50.8798,
        longitude: 4.7005,
        radius_km: 10,
      },
    ],
  },
};

export { pilatesScoringConfig } from "./scoring";
export type { PilatesScoringConfig, ScoringWeights, WinnerRuleThresholds } from "./scoring";
export {
  pilatesSeoKeywordStrategy,
  pilatesCityLocations,
} from "./seo";
export type { KeywordIntent, KeywordTemplate } from "./seo";

export function citiesForScope(scope: DiscoveryScope): CitySeed[] {
  if (scope === "NL") return pilatesVertical.cities.NL;
  if (scope === "VL") return pilatesVertical.cities.VL;
  return [...pilatesVertical.cities.NL, ...pilatesVertical.cities.VL];
}
