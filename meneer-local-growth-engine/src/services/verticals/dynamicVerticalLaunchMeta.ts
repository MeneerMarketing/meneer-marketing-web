import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DiscoveryQueryIntent } from "@/verticals/pilates/discoveryQueries";
import type { CitySeed } from "@/verticals/shared-types";
import type { CountryOption } from "@/verticals/verticalPack.types";

export interface VerticalLauncherConfigRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  blueprint_slug: string;
  status: string;
  discovery_terms: string[];
  discovery_intents: DiscoveryQueryIntent[] | null;
  category_hints: string[];
  negative_name_patterns: string[];
  landing_path: string;
  inbound_source: string;
  landing_live: boolean;
  template_variants: Array<{
    variant: string;
    name: string;
    description?: string;
  }>;
  pilot_city: CitySeed;
  business_label: string;
  business_noun: string;
  edition_label: string;
  created_at: string;
  updated_at: string;
}

export interface DynamicVerticalLaunchMeta {
  slug: string;
  name: string;
  countries: CountryOption[];
  landingLive: boolean;
}

const rowCache = new Map<string, VerticalLauncherConfigRow>();
const launchMetaCache = new Map<string, DynamicVerticalLaunchMeta>();

function slugifyRegion(region: string): string {
  return region
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCountriesFromPilot(pilot: CitySeed): CountryOption[] {
  if (pilot.country_code === "BE") {
    return [
      {
        code: "BE",
        label: "België",
        scope: "VL",
        regions: [{ code: "vlaanderen", label: "Vlaanderen" }],
      },
    ];
  }
  return [
    {
      code: "NL",
      label: "Nederland",
      scope: "NL",
      regions: pilot.region
        ? [{ code: slugifyRegion(pilot.region), label: pilot.region }]
        : [],
    },
  ];
}

function buildLaunchMeta(row: VerticalLauncherConfigRow): DynamicVerticalLaunchMeta {
  return {
    slug: row.slug,
    name: row.name,
    countries: buildCountriesFromPilot(row.pilot_city),
    landingLive: row.landing_live,
  };
}

export async function refreshDynamicVerticalLaunchMeta(
  client?: SupabaseClient
): Promise<number> {
  const supabase = client ?? createAdminClient();
  const { data, error } = await supabase
    .from("vertical_launcher_configs")
    .select("*")
    .eq("status", "ACTIVE");

  if (error) {
    const missingTable =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /relation .*vertical_launcher_configs.* does not exist/i.test(error.message) ||
      /Could not find the table.*vertical_launcher_configs/i.test(error.message);

    if (missingTable) {
      rowCache.clear();
      launchMetaCache.clear();
      return 0;
    }
    throw new Error(error.message);
  }

  rowCache.clear();
  launchMetaCache.clear();

  for (const raw of data ?? []) {
    const row = raw as VerticalLauncherConfigRow;
    rowCache.set(row.slug, row);
    launchMetaCache.set(row.slug, buildLaunchMeta(row));
  }

  return launchMetaCache.size;
}

export function getCachedDynamicVerticalLaunchMeta(slug: string): DynamicVerticalLaunchMeta | null {
  return launchMetaCache.get(slug.toLowerCase()) ?? null;
}

export function listCachedDynamicVerticalLaunchSlugs(): string[] {
  return [...launchMetaCache.keys()];
}

export function getCachedVerticalLauncherConfigRow(slug: string): VerticalLauncherConfigRow | null {
  return rowCache.get(slug.toLowerCase()) ?? null;
}

export function listCachedVerticalLauncherConfigRows(): VerticalLauncherConfigRow[] {
  return [...rowCache.values()];
}
