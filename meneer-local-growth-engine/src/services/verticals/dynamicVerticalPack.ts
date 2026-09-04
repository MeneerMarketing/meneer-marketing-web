import {
  getCachedDynamicVerticalLaunchMeta,
  getCachedVerticalLauncherConfigRow,
  listCachedDynamicVerticalLaunchSlugs,
  refreshDynamicVerticalLaunchMeta,
  type VerticalLauncherConfigRow,
} from "@/services/verticals/dynamicVerticalLaunchMeta";
import type {
  BookingOption,
  OfferPackage,
  VerticalOfferConfig,
} from "@/config/verticalOffers";
import type { VerticalPackRegistration } from "@/verticals/verticalPack.types";
import type { VerticalDiscoveryRuntime } from "@/verticals/runtime";
import {
  isRelevantPilatesListing,
  qualifyPilatesListing,
} from "@/services/discovery/qualifyPilates";
import {
  isRelevantSkinClinicListing,
  qualifySkinClinicListing,
} from "@/services/discovery/qualifySkinClinics";
import { pilatesAcquisitionFitConfig } from "@/verticals/pilates/acquisitionFit";
import {
  intentsFromTerms,
  pilatesCoverageThresholds,
  type DiscoveryQueryIntent,
} from "@/verticals/pilates/discoveryQueries";
import { pilatesOutreachCapacityConfig } from "@/verticals/pilates/outreachCapacity";
import { pilatesScoringConfig } from "@/verticals/pilates/scoring";
import { pilatesCityLocations, pilatesSeoKeywordStrategy } from "@/verticals/pilates/seo";
import { skinClinicsAcquisitionFitConfig } from "@/verticals/skin-clinics/acquisitionFit";
import { skinClinicsCoverageThresholds } from "@/verticals/skin-clinics/discoveryQueries";
import { skinClinicsOutreachCapacityConfig } from "@/verticals/skin-clinics/outreachCapacity";
import { skinClinicsScoringConfig } from "@/verticals/skin-clinics/scoring";
import {
  skinClinicsCityLocations,
  skinClinicsSeoKeywordStrategy,
} from "@/verticals/skin-clinics/seo";

export type { VerticalLauncherConfigRow } from "@/services/verticals/dynamicVerticalLaunchMeta";

const dynamicPackCache = new Map<string, VerticalPackRegistration>();
const dynamicRuntimeCache = new Map<string, VerticalDiscoveryRuntime>();
const dynamicOfferCache = new Map<string, VerticalOfferConfig>();

function loadRunVerticalDiscovery() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/services/discovery/runPilatesDiscovery").runVerticalDiscovery as (
    input: Parameters<VerticalPackRegistration["runDiscovery"]>[0],
  ) => ReturnType<VerticalPackRegistration["runDiscovery"]>;
}

function loadRunCityAcquisitionFit() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/services/acquisition-fit/runCityAcquisitionFit")
    .runCityAcquisitionFit as VerticalPackRegistration["runCityAcquisitionFit"];
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildDiscoveryIntents(row: VerticalLauncherConfigRow): DiscoveryQueryIntent[] {
  if (row.discovery_intents?.length) return row.discovery_intents;
  return intentsFromTerms(row.discovery_terms ?? []);
}

function buildSeoDefaults(row: VerticalLauncherConfigRow) {
  const noun = row.business_noun;
  return {
    primaryTemplate: (city: string) => `${capitalize(noun)} ${city}`,
    secondaryTemplates: row.discovery_terms
      .slice(0, 3)
      .map((term) => (city: string) => `${term} ${city}`),
  };
}

function buildPack(row: VerticalLauncherConfigRow): VerticalPackRegistration {
  const intents = buildDiscoveryIntents(row);
  const blueprint = row.blueprint_slug === "pilates" ? "pilates" : "skin-clinics";

  return {
    slug: row.slug,
    name: row.name,
    status: "ACTIVE",
    countries: getCachedDynamicVerticalLaunchMeta(row.slug)?.countries ?? [],
    intentCount: intents.length,
    runDiscovery: loadRunVerticalDiscovery(),
    runCityAcquisitionFit: loadRunCityAcquisitionFit(),
    discoveryIntents: intents,
    coverageThresholds:
      blueprint === "pilates" ? pilatesCoverageThresholds : skinClinicsCoverageThresholds,
    acquisitionFitConfig:
      blueprint === "pilates" ? pilatesAcquisitionFitConfig : skinClinicsAcquisitionFitConfig,
    knownCitySeeds: () => [row.pilot_city],
  };
}

function buildRuntime(row: VerticalLauncherConfigRow): VerticalDiscoveryRuntime {
  const blueprint = row.blueprint_slug === "pilates" ? "pilates" : "skin-clinics";
  const pilot = row.pilot_city;
  const seoDefaults = buildSeoDefaults(row);
  const templateVariants = row.template_variants.map(
    (t) =>
      t.variant as
        | "editorial"
        | "soft-movement"
        | "reformer-minimal"
        | "clinical-atelier"
  );

  if (blueprint === "pilates") {
    return {
      slug: row.slug as "pilates",
      displayName: row.name,
      vertical: { seoDefaults },
      citiesForScope: () => [pilot],
      discoveryIntents: buildDiscoveryIntents(row),
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
        coreServiceFallback: row.business_noun,
      },
      outreachCapacity: {
        ...pilatesOutreachCapacityConfig,
        activeTemplateVariants: templateVariants,
      },
      outreachBlockedCitySlugs: [],
      preferredServiceTypes: pilatesScoringConfig.preferredServiceTypes,
      serviceBoosts: pilatesScoringConfig.serviceBoosts,
      landingPath: row.landing_path,
      businessLabel: row.business_label,
    };
  }

  return {
    slug: row.slug as "skin-clinics",
    displayName: row.name,
    vertical: { seoDefaults },
    citiesForScope: () => [pilot],
    discoveryIntents: buildDiscoveryIntents(row),
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
      coreServiceFallback: row.business_noun,
    },
    outreachCapacity: {
      ...skinClinicsOutreachCapacityConfig,
      activeTemplateVariants: templateVariants,
    },
    outreachBlockedCitySlugs: [],
    preferredServiceTypes: skinClinicsScoringConfig.preferredServiceTypes,
    serviceBoosts: skinClinicsScoringConfig.serviceBoosts,
    landingPath: row.landing_path,
    businessLabel: row.business_label,
  };
}

function buildOffer(row: VerticalLauncherConfigRow): VerticalOfferConfig {
  const packages: OfferPackage[] = [
    "STUDIO_EDITION",
    "LOCAL_GROWTH",
    "GROWTH_PARTNER",
    "SIGNATURE_CUSTOM",
  ];
  const bookingOptions: BookingOption[] = [
    "EXISTING_BOOKING",
    "BRANDED_APP",
    "CUSTOM_FUNNEL",
    "CUSTOM_APP",
  ];

  return {
    slug: row.slug as "pilates",
    landingPagePath: row.landing_path,
    landingPageLive: row.landing_live,
    inboundSource: row.inbound_source as "pilates-studios",
    packages,
    defaultRecommendedPackage: "LOCAL_GROWTH",
    bookingOptions,
    previewCtaLabel: "Bekijk je preview",
    previewCtaSubline: `Zie hoe jouw ${row.business_noun} online kan groeien`,
    entryMonthlyExclEur: 149,
    businessNoun: row.business_noun,
    editionLabel: row.edition_label,
    packageLabels: {
      STUDIO_EDITION: row.edition_label,
      LOCAL_GROWTH: "Local Growth",
      GROWTH_PARTNER: "Growth Partner",
      SIGNATURE_CUSTOM: "Signature",
    },
    outreach: {
      introLead: `Ik heb een preview klaargezet voor jouw ${row.business_noun}.`,
      growthFocus: `Meer aanvragen voor jouw ${row.business_noun} in de regio.`,
      partnershipTail: "Eén plan, één aanspreekpunt voor online groei.",
      offerParagraphLabel: "Pakketten en prijzen",
      offerPageTeaser: `Bekijk wat ik voor ${row.business_noun} kan betekenen.`,
      defaultPrimaryKeyword: (city) => `${capitalize(row.business_noun)} ${city}`,
    },
  };
}

function ensureBuilt(slug: string): VerticalLauncherConfigRow | null {
  const row = getCachedVerticalLauncherConfigRow(slug);
  if (!row) return null;
  const normalized = slug.toLowerCase();
  if (!dynamicPackCache.has(normalized)) {
    dynamicPackCache.set(normalized, buildPack(row));
    dynamicRuntimeCache.set(normalized, buildRuntime(row));
    dynamicOfferCache.set(normalized, buildOffer(row));
  }
  return row;
}

export async function refreshDynamicVerticalPackCache(
  client?: Parameters<typeof refreshDynamicVerticalLaunchMeta>[0]
): Promise<number> {
  dynamicPackCache.clear();
  dynamicRuntimeCache.clear();
  dynamicOfferCache.clear();
  return refreshDynamicVerticalLaunchMeta(client);
}

export function getCachedDynamicVerticalPack(slug: string): VerticalPackRegistration | null {
  ensureBuilt(slug);
  return dynamicPackCache.get(slug.toLowerCase()) ?? null;
}

export function getCachedDynamicVerticalRuntime(slug: string): VerticalDiscoveryRuntime | null {
  ensureBuilt(slug);
  return dynamicRuntimeCache.get(slug.toLowerCase()) ?? null;
}

export function getCachedDynamicVerticalOffer(slug: string): VerticalOfferConfig | null {
  ensureBuilt(slug);
  return dynamicOfferCache.get(slug.toLowerCase()) ?? null;
}

export function listCachedDynamicVerticalSlugs(): string[] {
  return listCachedDynamicVerticalLaunchSlugs();
}
