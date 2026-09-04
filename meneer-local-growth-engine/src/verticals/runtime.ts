import type { BusinessListingItem } from "@/services/discovery/dataforseoBusinessListings";
import type { QualificationResult } from "@/services/discovery/qualifyPilates";
import {
  isRelevantPilatesListing,
  qualifyPilatesListing,
} from "@/services/discovery/qualifyPilates";
import {
  isRelevantSkinClinicListing,
  qualifySkinClinicListing,
} from "@/services/discovery/qualifySkinClinics";
import type { PilatesAcquisitionFitConfig } from "@/verticals/pilates/acquisitionFit";
import { pilatesAcquisitionFitConfig } from "@/verticals/pilates/acquisitionFit";
import {
  pilatesCoverageThresholds,
  pilatesDiscoveryIntents,
} from "@/verticals/pilates/discoveryQueries";
import { citiesForScope as pilatesCitiesForScope, pilatesVertical } from "@/verticals/pilates";
import { pilatesScoringConfig, type PilatesScoringConfig } from "@/verticals/pilates/scoring";
import { pilatesSeoKeywordStrategy, pilatesCityLocations } from "@/verticals/pilates/seo";
import { pilatesOutreachCapacityConfig } from "@/verticals/pilates/outreachCapacity";
import { skinClinicsAcquisitionFitConfig } from "@/verticals/skin-clinics/acquisitionFit";
import {
  skinClinicsCoverageThresholds,
  skinClinicsDiscoveryIntents,
} from "@/verticals/skin-clinics/discoveryQueries";
import {
  citiesForScope as skinClinicsCitiesForScope,
  skinClinicsVertical,
} from "@/verticals/skin-clinics";
import {
  skinClinicsScoringConfig,
  type SkinClinicsScoringConfig,
} from "@/verticals/skin-clinics/scoring";
import {
  skinClinicsSeoKeywordStrategy,
  skinClinicsCityLocations,
} from "@/verticals/skin-clinics/seo";
import { skinClinicsOutreachCapacityConfig } from "@/verticals/skin-clinics/outreachCapacity";
import { getCachedDynamicVerticalRuntime } from "@/services/verticals/dynamicVerticalPack";
import type { CitySeed, DiscoveryScope } from "@/verticals/shared-types";
import type {
  CoverageThresholds,
  DiscoveryQueryIntent,
} from "@/verticals/pilates/discoveryQueries";
import type { KeywordTemplate } from "@/verticals/pilates/seo";
import type { VerticalOutreachCapacityConfig } from "@/verticals/pilates/outreachCapacity";

import {
  normalizeVerticalSlug as resolveVerticalSlug,
  type SupportedVerticalSlug,
} from "@/verticals/normalizeVerticalSlug.shared";

export interface VerticalSeoRuntime {
  languageCode: string;
  countryLocationCode: number;
  templates: KeywordTemplate[];
  cityLocations: Record<string, { location_name: string; location_code?: number }>;
  coreServiceFallback: string;
}

export interface VerticalDiscoveryRuntime {
  slug: SupportedVerticalSlug;
  displayName: string;
  vertical: {
    seoDefaults: {
      primaryTemplate: (city: string) => string;
      secondaryTemplates: ((city: string) => string)[];
    };
  };
  citiesForScope: (scope: DiscoveryScope) => CitySeed[];
  discoveryIntents: DiscoveryQueryIntent[];
  coverageThresholds: CoverageThresholds;
  isRelevantListing: (
    item: BusinessListingItem,
    options?: { minFocus?: string },
  ) => boolean;
  qualifyListing: (item: BusinessListingItem) => QualificationResult;
  acquisitionFitConfig: PilatesAcquisitionFitConfig;
  scoringConfig: PilatesScoringConfig | SkinClinicsScoringConfig;
  seo: VerticalSeoRuntime;
  outreachCapacity: VerticalOutreachCapacityConfig;
  outreachBlockedCitySlugs: readonly string[];
  preferredServiceTypes: string[];
  serviceBoosts: Record<string, number>;
  landingPath: string;
  businessLabel: string;
}

const PILATES_RUNTIME: VerticalDiscoveryRuntime = {
  slug: "pilates",
  displayName: "Pilates",
  vertical: pilatesVertical,
  citiesForScope: pilatesCitiesForScope,
  discoveryIntents: pilatesDiscoveryIntents,
  coverageThresholds: pilatesCoverageThresholds,
  isRelevantListing: (item, options) =>
    isRelevantPilatesListing(item, {
      minFocus: options?.minFocus as "STRONG" | "MEDIUM" | "WEAK" | "NONE" | undefined,
    }),
  qualifyListing: qualifyPilatesListing,
  acquisitionFitConfig: pilatesAcquisitionFitConfig,
  scoringConfig: pilatesScoringConfig,
  seo: {
    languageCode: pilatesSeoKeywordStrategy.languageCode,
    countryLocationCode: pilatesSeoKeywordStrategy.countryLocationCode,
    templates: pilatesSeoKeywordStrategy.templates,
    cityLocations: pilatesCityLocations,
    coreServiceFallback: "pilates",
  },
  outreachCapacity: pilatesOutreachCapacityConfig,
  outreachBlockedCitySlugs: ["apeldoorn"],
  preferredServiceTypes: pilatesScoringConfig.preferredServiceTypes,
  serviceBoosts: pilatesScoringConfig.serviceBoosts,
  landingPath: "/pilates-studios",
  businessLabel: "studio",
};

const SKIN_CLINICS_RUNTIME: VerticalDiscoveryRuntime = {
  slug: "skin-clinics",
  displayName: "Huidklinieken",
  vertical: skinClinicsVertical,
  citiesForScope: skinClinicsCitiesForScope,
  discoveryIntents: skinClinicsDiscoveryIntents,
  coverageThresholds: skinClinicsCoverageThresholds,
  isRelevantListing: (item, options) =>
    isRelevantSkinClinicListing(item, {
      minFocus: options?.minFocus as "STRONG" | "MEDIUM" | "WEAK" | "NONE" | undefined,
    }),
  qualifyListing: qualifySkinClinicListing,
  acquisitionFitConfig: skinClinicsAcquisitionFitConfig,
  scoringConfig: skinClinicsScoringConfig,
  seo: {
    languageCode: skinClinicsSeoKeywordStrategy.languageCode,
    countryLocationCode: skinClinicsSeoKeywordStrategy.countryLocationCode,
    templates: skinClinicsSeoKeywordStrategy.templates,
    cityLocations: skinClinicsCityLocations,
    coreServiceFallback: "huidkliniek",
  },
  outreachCapacity: skinClinicsOutreachCapacityConfig,
  outreachBlockedCitySlugs: [],
  preferredServiceTypes: skinClinicsScoringConfig.preferredServiceTypes,
  serviceBoosts: skinClinicsScoringConfig.serviceBoosts,
  landingPath: "/huidklinieken",
  businessLabel: "kliniek",
};

const RUNTIME_BY_SLUG: Record<SupportedVerticalSlug, VerticalDiscoveryRuntime> = {
  pilates: PILATES_RUNTIME,
  "skin-clinics": SKIN_CLINICS_RUNTIME,
};

export function getVerticalRuntime(
  slug: string | null | undefined,
): VerticalDiscoveryRuntime {
  const normalized = (slug ?? "pilates").toLowerCase();
  const dynamic = getCachedDynamicVerticalRuntime(normalized);
  if (dynamic) return dynamic;
  return RUNTIME_BY_SLUG[resolveVerticalSlug(slug)];
}

export function getOutreachCapacityConfig(
  verticalSlug: string,
): VerticalOutreachCapacityConfig | null {
  const runtime = getVerticalRuntime(verticalSlug);
  return runtime.outreachCapacity;
}

export function isVerticalOutreachBlockedCity(
  verticalSlug: string,
  citySlug: string | null | undefined,
): boolean {
  if (!citySlug) return false;
  const runtime = getVerticalRuntime(verticalSlug);
  return runtime.outreachBlockedCitySlugs.includes(citySlug);
}

export function listSupportedVerticalSlugs(): SupportedVerticalSlug[] {
  return Object.keys(RUNTIME_BY_SLUG) as SupportedVerticalSlug[];
}

export type { SupportedVerticalSlug } from "@/verticals/normalizeVerticalSlug.shared";
export { normalizeVerticalSlug } from "@/verticals/normalizeVerticalSlug.shared";
