import type { DiscoveryRunInput, DiscoveryRunResult } from "@/services/discovery/runPilatesDiscovery";
import type { runCityAcquisitionFit } from "@/services/acquisition-fit/runCityAcquisitionFit";
import type {
  CoverageThresholds,
  DiscoveryQueryIntent,
} from "@/verticals/pilates/discoveryQueries";
import type { PilatesAcquisitionFitConfig } from "@/verticals/pilates/acquisitionFit";
import type { CitySeed, DiscoveryScope } from "@/verticals/shared-types";

export type VerticalPackStatus = "ACTIVE" | "COMING_SOON";

export interface CountryOption {
  code: "NL" | "BE";
  label: string;
  scope: DiscoveryScope;
  regions?: Array<{ code: string; label: string }>;
}

export interface VerticalPackRegistration {
  slug: string;
  name: string;
  status: VerticalPackStatus;
  countries: CountryOption[];
  intentCount: number;
  runDiscovery: (input: DiscoveryRunInput) => Promise<DiscoveryRunResult>;
  runCityAcquisitionFit: typeof runCityAcquisitionFit;
  discoveryIntents: DiscoveryQueryIntent[];
  coverageThresholds: CoverageThresholds;
  acquisitionFitConfig: PilatesAcquisitionFitConfig;
  knownCitySeeds: () => CitySeed[];
}

export type { DiscoveryRunInput, DiscoveryRunResult };
