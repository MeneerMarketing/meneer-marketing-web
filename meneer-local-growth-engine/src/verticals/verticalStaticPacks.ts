import { pilatesAcquisitionFitConfig } from "@/verticals/pilates/acquisitionFit";
import {
  pilatesCoverageThresholds,
  pilatesDiscoveryIntents,
} from "@/verticals/pilates/discoveryQueries";
import { citiesForScope as pilatesCitiesForScope } from "@/verticals/pilates";
import {
  skinClinicsAcquisitionFitConfig,
  citiesForScope as skinClinicsCitiesForScope,
} from "@/verticals/skin-clinics";
import {
  skinClinicsCoverageThresholds,
  skinClinicsDiscoveryIntents,
} from "@/verticals/skin-clinics/discoveryQueries";
import type { CountryOption, VerticalPackStatus } from "@/verticals/verticalPack.types";

export interface VerticalStaticPackMeta {
  slug: string;
  name: string;
  status: VerticalPackStatus;
  countries: CountryOption[];
  intentCount: number;
  acquisitionFitConfig: typeof pilatesAcquisitionFitConfig;
  discoveryIntents: typeof pilatesDiscoveryIntents;
  coverageThresholds: typeof pilatesCoverageThresholds;
  knownCitySeeds: () => ReturnType<typeof pilatesCitiesForScope>;
}

export const pilatesStaticPackMeta: VerticalStaticPackMeta = {
  slug: "pilates",
  name: "Pilates",
  status: "ACTIVE",
  countries: [
    {
      code: "NL",
      label: "Nederland",
      scope: "NL",
      regions: [
        { code: "gelderland", label: "Gelderland" },
        { code: "utrecht", label: "Utrecht" },
        { code: "noord-holland", label: "Noord-Holland" },
        { code: "zuid-holland", label: "Zuid-Holland" },
      ],
    },
    {
      code: "BE",
      label: "België",
      scope: "VL",
      regions: [{ code: "vlaanderen", label: "Vlaanderen" }],
    },
  ],
  intentCount: pilatesDiscoveryIntents.length,
  acquisitionFitConfig: pilatesAcquisitionFitConfig,
  discoveryIntents: pilatesDiscoveryIntents,
  coverageThresholds: pilatesCoverageThresholds,
  knownCitySeeds: () => pilatesCitiesForScope("BOTH"),
};

export const skinClinicsStaticPackMeta: VerticalStaticPackMeta = {
  slug: "skin-clinics",
  name: "Huidklinieken",
  status: "ACTIVE",
  countries: [
    {
      code: "NL",
      label: "Nederland",
      scope: "NL",
      regions: [
        { code: "gelderland", label: "Gelderland" },
        { code: "utrecht", label: "Utrecht" },
        { code: "noord-holland", label: "Noord-Holland" },
        { code: "zuid-holland", label: "Zuid-Holland" },
        { code: "noord-brabant", label: "Noord-Brabant" },
      ],
    },
    {
      code: "BE",
      label: "België",
      scope: "VL",
      regions: [{ code: "vlaanderen", label: "Vlaanderen" }],
    },
  ],
  intentCount: skinClinicsDiscoveryIntents.length,
  acquisitionFitConfig: skinClinicsAcquisitionFitConfig,
  discoveryIntents: skinClinicsDiscoveryIntents,
  coverageThresholds: skinClinicsCoverageThresholds,
  knownCitySeeds: () => skinClinicsCitiesForScope("BOTH"),
};

export const verticalStaticPackMetaBySlug: Record<string, VerticalStaticPackMeta> = {
  pilates: pilatesStaticPackMeta,
  "skin-clinics": skinClinicsStaticPackMeta,
};

export function getStaticVerticalCountries(slug: string): CountryOption[] {
  return verticalStaticPackMetaBySlug[slug.toLowerCase()]?.countries ?? [];
}
