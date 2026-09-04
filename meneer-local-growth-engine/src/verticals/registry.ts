import { runCityAcquisitionFit } from "@/services/acquisition-fit/runCityAcquisitionFit";
import {
  runPilatesDiscovery,
  runSkinClinicsDiscovery,
} from "@/services/discovery/runPilatesDiscovery";
import type { DiscoveryLauncherMode } from "@/config/discoveryLauncherModes";
import type { VerticalPackRegistration } from "@/verticals/verticalPack.types";
import {
  pilatesStaticPackMeta,
  skinClinicsStaticPackMeta,
} from "@/verticals/verticalStaticPacks";

export type { CountryOption, VerticalPackRegistration, VerticalPackStatus } from "@/verticals/verticalPack.types";
export { verticalLauncherCatalog } from "@/verticals/launcher-catalog";

const PILATES_PACK: VerticalPackRegistration = {
  ...pilatesStaticPackMeta,
  runDiscovery: runPilatesDiscovery,
  runCityAcquisitionFit: runCityAcquisitionFit,
};

const SKIN_CLINICS_PACK: VerticalPackRegistration = {
  ...skinClinicsStaticPackMeta,
  runDiscovery: runSkinClinicsDiscovery,
  runCityAcquisitionFit: runCityAcquisitionFit,
};

export const verticalRegistry: Record<string, VerticalPackRegistration> = {
  pilates: PILATES_PACK,
  "skin-clinics": SKIN_CLINICS_PACK,
};

function loadDynamicVerticalPack(slug: string): VerticalPackRegistration | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dynamic = require("@/services/verticals/dynamicVerticalPack") as typeof import("@/services/verticals/dynamicVerticalPack");
  return dynamic.getCachedDynamicVerticalPack(slug);
}

function listDynamicVerticalSlugs(): string[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dynamic = require("@/services/verticals/dynamicVerticalPack") as typeof import("@/services/verticals/dynamicVerticalPack");
  return dynamic.listCachedDynamicVerticalSlugs();
}

export function getVerticalPack(slug: string): VerticalPackRegistration | null {
  const normalized = slug.toLowerCase();
  const pack = verticalRegistry[normalized];
  if (pack?.status === "ACTIVE") return pack;
  return loadDynamicVerticalPack(normalized);
}

export function listActiveVerticals(): VerticalPackRegistration[] {
  const staticActive = Object.values(verticalRegistry).filter((pack) => pack.status === "ACTIVE");
  const seen = new Set(staticActive.map((pack) => pack.slug));
  const merged = [...staticActive];

  for (const slug of listDynamicVerticalSlugs()) {
    if (seen.has(slug)) continue;
    const pack = loadDynamicVerticalPack(slug);
    if (pack) merged.push(pack);
  }

  return merged;
}

export type { DiscoveryLauncherMode };
