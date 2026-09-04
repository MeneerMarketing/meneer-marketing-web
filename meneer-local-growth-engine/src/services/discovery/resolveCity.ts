import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/normalize";
import type { CitySeed } from "@/verticals/shared-types";
import { getVerticalPack } from "@/verticals/registry";

export interface ResolveCityInput {
  verticalSlug: string;
  countryCode: "NL" | "BE";
  cityName: string;
  region?: string | null;
}

/** Voorkomt Apeldoorn / apeldoorn / Apeldoorn NL als aparte records. */
export function normalizeCitySlug(cityName: string, countryCode: string): string {
  const base = slugify(cityName.trim()) || "stad";
  if (countryCode === "BE") return `${base}-be`;
  return base;
}

function displayCityName(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Onbekend";
  return trimmed
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function regionGroup(countryCode: "NL" | "BE"): "NL" | "VL" {
  return countryCode === "BE" ? "VL" : "NL";
}

async function geocodeCity(input: {
  cityName: string;
  countryCode: "NL" | "BE";
}): Promise<{ latitude: number; longitude: number; displayName: string } | null> {
  const country = input.countryCode === "BE" ? "Belgium" : "Netherlands";
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("city", input.cityName.trim());
  url.searchParams.set("country", country);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "MeneerMarketing-LocalGrowthEngine/1.0 (discovery-launcher)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{
      lat: string;
      lon: string;
      display_name?: string;
    }>;
    const hit = rows[0];
    if (!hit) return null;
    const latitude = Number(hit.lat);
    const longitude = Number(hit.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return {
      latitude,
      longitude,
      displayName: hit.display_name?.split(",")[0] ?? input.cityName,
    };
  } catch {
    return null;
  }
}

function seedFromKnownPack(
  slug: string,
  verticalSlug: string
): CitySeed | null {
  const pack = getVerticalPack(verticalSlug);
  if (!pack) return null;
  return pack.knownCitySeeds().find((city) => city.slug === slug) ?? null;
}

/**
 * Zorgt dat een stad bestaat in `cities` en geeft een CitySeed terug voor discovery.
 * Bestaande records worden hergebruikt; nieuwe steden worden gegeocodeerd.
 */
export async function resolveCityForDiscovery(
  input: ResolveCityInput
): Promise<{ cityId: string; seed: CitySeed; created: boolean }> {
  const client = createAdminClient();
  const slug = normalizeCitySlug(input.cityName, input.countryCode);
  const name = displayCityName(input.cityName);
  const region = input.region?.trim() || null;

  const { data: existing } = await client
    .from("cities")
    .select("id, slug, name, country_code, region, region_group, latitude, longitude")
    .eq("slug", slug)
    .maybeSingle();

  if (existing?.id) {
    const seed: CitySeed = {
      slug: String(existing.slug),
      name: String(existing.name),
      country_code: (existing.country_code as "NL" | "BE") ?? input.countryCode,
      region: String(existing.region ?? region ?? ""),
      region_group: (existing.region_group as "NL" | "VL") ?? regionGroup(input.countryCode),
      latitude: Number(existing.latitude ?? 0),
      longitude: Number(existing.longitude ?? 0),
      radius_km: 12,
    };
    return { cityId: String(existing.id), seed, created: false };
  }

  const known = seedFromKnownPack(slug, input.verticalSlug);
  let latitude = known?.latitude ?? 0;
  let longitude = known?.longitude ?? 0;
  let resolvedName = known?.name ?? name;

  if (!known) {
    const geo = await geocodeCity({
      cityName: input.cityName,
      countryCode: input.countryCode,
    });
    if (!geo) {
      throw new Error(
        `Kon ${name} niet geolokaliseren. Controleer de spelling of kies een grotere plaats.`
      );
    }
    latitude = geo.latitude;
    longitude = geo.longitude;
    resolvedName = displayCityName(geo.displayName);
  }

  const seed: CitySeed = {
    slug,
    name: resolvedName,
    country_code: input.countryCode,
    region: region ?? known?.region ?? "",
    region_group: regionGroup(input.countryCode),
    latitude,
    longitude,
    radius_km: known?.radius_km ?? 12,
  };

  const { data: inserted, error } = await client
    .from("cities")
    .insert({
      slug: seed.slug,
      name: seed.name,
      country_code: seed.country_code,
      region: seed.region,
      region_group: seed.region_group,
      latitude: seed.latitude,
      longitude: seed.longitude,
      is_active: true,
    })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    throw error ?? new Error(`Kon stad ${seed.name} niet aanmaken`);
  }

  return { cityId: String(inserted.id), seed, created: true };
}
