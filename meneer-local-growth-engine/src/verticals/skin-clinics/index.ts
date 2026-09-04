import type { CitySeed, DiscoveryScope } from "@/verticals/shared-types";

export type { CitySeed, DiscoveryScope };
export type DiscoveryMode = "TEST" | "FULL";

export interface SkinClinicsVerticalPack {
  slug: "skin-clinics";
  name: string;
  discoveryTerms: string[];
  categoryHints: string[];
  negativeNamePatterns: RegExp[];
  chainDomainHints: string[];
  seoDefaults: {
    primaryTemplate: (city: string) => string;
    secondaryTemplates: ((city: string) => string)[];
  };
  templateVariants: Array<"editorial" | "reformer-minimal" | "soft-movement" | "clinical-atelier">;
  cities: {
    NL: CitySeed[];
    VL: CitySeed[];
  };
}

export const skinClinicsVertical: SkinClinicsVerticalPack = {
  slug: "skin-clinics",
  name: "Huidklinieken",
  discoveryTerms: [
    "Huidkliniek",
    "Cosmetische kliniek",
    "Skin clinic",
    "Aesthetic clinic",
    "Laserkliniek",
    "Medisch esthetisch",
    "Huidtherapie kliniek",
  ],
  categoryHints: ["skin_care_clinic", "medical_spa", "beauty_salon"],
  negativeNamePatterns: [
    /ziekenhuis/i,
    /huisarts/i,
    /tandarts/i,
    /fysio|fysiotherapie/i,
    /kapper|hair\s*salon/i,
    /nagelstudio|nail\s*bar/i,
    /tattoo/i,
    /apotheek/i,
    /opticien/i,
    /directory/i,
    /gids/i,
    /basic.?fit/i,
    /sportschool/i,
  ],
  chainDomainHints: [
    "sknclinics.nl",
    "skinsandlips.com",
    "treatwell.nl",
  ],
  seoDefaults: {
    primaryTemplate: (city) => `Huidkliniek ${city}`,
    secondaryTemplates: [
      (city) => `Cosmetische kliniek ${city}`,
      (city) => `Huidbehandeling ${city}`,
      (city) => `Botox ${city}`,
    ],
  },
  templateVariants: ["editorial", "soft-movement", "reformer-minimal", "clinical-atelier"],
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
      {
        slug: "eindhoven",
        name: "Eindhoven",
        country_code: "NL",
        region: "Noord-Brabant",
        region_group: "NL",
        latitude: 51.4416,
        longitude: 5.4697,
        radius_km: 12,
      },
      {
        slug: "breda",
        name: "Breda",
        country_code: "NL",
        region: "Noord-Brabant",
        region_group: "NL",
        latitude: 51.5719,
        longitude: 4.7683,
        radius_km: 12,
      },
      {
        slug: "haarlem",
        name: "Haarlem",
        country_code: "NL",
        region: "Noord-Holland",
        region_group: "NL",
        latitude: 52.3874,
        longitude: 4.6462,
        radius_km: 11,
      },
      {
        slug: "apeldoorn",
        name: "Apeldoorn",
        country_code: "NL",
        region: "Gelderland",
        region_group: "NL",
        latitude: 52.2112,
        longitude: 5.9699,
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

export { skinClinicsScoringConfig } from "./scoring";
export type { SkinClinicsScoringConfig } from "./scoring";
export { skinClinicsSeoKeywordStrategy, skinClinicsCityLocations } from "./seo";
export {
  skinClinicsAcquisitionFitConfig,
  VISUAL_COMPONENT_KEYS,
  PROSPECT_TYPE_LABELS,
  assertTransformationWeights,
} from "./acquisitionFit";
export type {
  ProspectType,
  VisualTransformationFit,
  TransformationWeights,
  TransformationGates,
  VisualJudgeConfig,
  ScreenshotConfig,
} from "./acquisitionFit";
export type { SkinClinicsAcquisitionFitConfig } from "./acquisitionFit.types";

export function citiesForScope(scope: DiscoveryScope): CitySeed[] {
  if (scope === "NL") return skinClinicsVertical.cities.NL;
  if (scope === "VL") return skinClinicsVertical.cities.VL;
  return [...skinClinicsVertical.cities.NL, ...skinClinicsVertical.cities.VL];
}

/** Steden voor eerste NL pilot (Randstad + Gelderland kern). */
export const skinClinicsNlPilotCitySlugs = [
  "arnhem",
  "nijmegen",
  "utrecht",
  "amsterdam",
  "rotterdam",
  "den-haag",
  "haarlem",
  "eindhoven",
  "breda",
] as const;

export const skinClinicsOutreachBlockedCitySlugs = [] as const;

export function isSkinClinicsOutreachBlockedCity(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return (skinClinicsOutreachBlockedCitySlugs as readonly string[]).includes(slug);
}

export function skinClinicsPilotCities(): CitySeed[] {
  const bySlug = new Map(citiesForScope("NL").map((city) => [city.slug, city]));
  return skinClinicsNlPilotCitySlugs
    .map((slug) => bySlug.get(slug))
    .filter((city): city is CitySeed => Boolean(city));
}
