import {
  getCachedDynamicVerticalLaunchMeta,
  listCachedDynamicVerticalLaunchSlugs,
  refreshDynamicVerticalLaunchMeta,
} from "@/services/verticals/dynamicVerticalLaunchMeta";
import { verticalLauncherCatalog } from "@/verticals/launcher-catalog";
import { getStaticVerticalCountries } from "@/verticals/verticalStaticPacks";
import type { VerticalPackStatus } from "@/verticals/verticalPack.types";

export interface DiscoveryLauncherVerticalOption {
  slug: string;
  name: string;
  status: VerticalPackStatus;
  landingLive?: boolean;
}

export interface DiscoveryLauncherCountryOption {
  code: "NL" | "BE";
  label: string;
  regions?: Array<{ code: string; label: string }>;
}

export async function getDiscoveryLauncherContext(): Promise<{
  verticals: DiscoveryLauncherVerticalOption[];
  countriesByVertical: Record<string, DiscoveryLauncherCountryOption[]>;
}> {
  await refreshDynamicVerticalLaunchMeta();

  const verticals: DiscoveryLauncherVerticalOption[] = [...verticalLauncherCatalog];

  for (const slug of listCachedDynamicVerticalLaunchSlugs()) {
    if (verticals.some((entry) => entry.slug === slug)) continue;
    const meta = getCachedDynamicVerticalLaunchMeta(slug);
    verticals.push({
      slug,
      name: meta?.name ?? slug.replace(/-/g, " "),
      status: "ACTIVE",
      landingLive: meta?.landingLive ?? false,
    });
  }

  const countriesByVertical: Record<string, DiscoveryLauncherCountryOption[]> = {};
  for (const vertical of verticals) {
    const staticCountries = getStaticVerticalCountries(vertical.slug);
    if (staticCountries.length > 0) {
      countriesByVertical[vertical.slug] = staticCountries;
      continue;
    }
    const meta = getCachedDynamicVerticalLaunchMeta(vertical.slug);
    countriesByVertical[vertical.slug] = meta?.countries ?? [];
  }

  return { verticals, countriesByVertical };
}
