import { createAdminClient } from "@/lib/supabase/admin";
import { dataForSeoPost } from "@/services/seo/dataforseoClient";
import { getVerticalRuntime } from "@/verticals/runtime";
import { normalizeDomain } from "@/lib/utils/normalize";

export interface SerpOrganicItem {
  type: string;
  rank_group: number | null;
  rank_absolute: number | null;
  title: string | null;
  url: string | null;
  domain: string | null;
}

export interface SerpCacheResult {
  keyword: string;
  items: SerpOrganicItem[];
  local_pack: SerpOrganicItem[];
  cost: number;
  cache_hit: boolean;
}

interface SerpResponse {
  tasks?: Array<{
    cost?: number;
    result?: Array<{
      items?: Array<{
        type?: string;
        rank_group?: number;
        rank_absolute?: number;
        title?: string;
        url?: string;
        domain?: string;
        items?: Array<{
          type?: string;
          title?: string;
          url?: string;
          domain?: string;
          rank_group?: number;
          rank_absolute?: number;
        }>;
      }>;
    }>;
  }>;
}

function mapItem(item: {
  type?: string;
  rank_group?: number;
  rank_absolute?: number;
  title?: string;
  url?: string;
  domain?: string;
}): SerpOrganicItem {
  return {
    type: item.type ?? "unknown",
    rank_group: item.rank_group ?? null,
    rank_absolute: item.rank_absolute ?? null,
    title: item.title ?? null,
    url: item.url ?? null,
    domain: item.domain ?? null,
  };
}

export async function fetchSerpCached(input: {
  verticalSlug: string;
  citySlug: string;
  keyword: string;
  maxCostRemaining: number;
}): Promise<SerpCacheResult> {
  const client = createAdminClient();
  const { data: cached } = await client
    .from("seo_serp_cache")
    .select("*")
    .eq("vertical_slug", input.verticalSlug)
    .eq("city_slug", input.citySlug)
    .eq("keyword", input.keyword.toLowerCase())
    .maybeSingle();

  if (cached) {
    return {
      keyword: input.keyword,
      items: (cached.items as SerpOrganicItem[]) ?? [],
      local_pack: (cached.local_pack as SerpOrganicItem[]) ?? [],
      cost: 0,
      cache_hit: true,
    };
  }

  if (input.maxCostRemaining <= 0) {
    return { keyword: input.keyword, items: [], local_pack: [], cost: 0, cache_hit: false };
  }

  const seo = getVerticalRuntime(input.verticalSlug).seo;
  const loc =
    seo.cityLocations[input.citySlug] ?? {
      location_name: `${input.citySlug},Netherlands`,
    };

  const { data, cost } = await dataForSeoPost<SerpResponse>(
    "/serp/google/organic/live/advanced",
    [
      {
        keyword: input.keyword,
        location_name: loc.location_name,
        language_code: seo.languageCode,
        device: "desktop",
        os: "windows",
        depth: 20,
      },
    ]
  );

  const rawItems = data.tasks?.[0]?.result?.[0]?.items ?? [];
  const items: SerpOrganicItem[] = [];
  const local_pack: SerpOrganicItem[] = [];

  for (const item of rawItems) {
    if (item.type === "organic") {
      items.push(mapItem(item));
    }
    if (item.type === "local_pack" || item.type === "maps") {
      local_pack.push(mapItem(item));
      for (const child of item.items ?? []) {
        local_pack.push(mapItem(child));
      }
    }
  }

  await client.from("seo_serp_cache").upsert(
    {
      vertical_slug: input.verticalSlug,
      city_slug: input.citySlug,
      keyword: input.keyword.toLowerCase(),
      language_code: seo.languageCode,
      items,
      local_pack,
      cost,
      raw: data,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "vertical_slug,city_slug,keyword" }
  );

  return { keyword: input.keyword, items, local_pack, cost, cache_hit: false };
}

export function findDomainRank(
  items: SerpOrganicItem[],
  domain: string | null
): { rank: number | null; url: string | null; title: string | null } {
  const normalized = normalizeDomain(domain);
  if (!normalized) return { rank: null, url: null, title: null };

  for (const item of items) {
    const d = normalizeDomain(item.domain ?? item.url);
    if (d && (d === normalized || d.endsWith(`.${normalized}`) || normalized.endsWith(`.${d}`))) {
      return {
        rank: item.rank_absolute ?? item.rank_group,
        url: item.url,
        title: item.title,
      };
    }
  }
  return { rank: null, url: null, title: null };
}

export function isDirectoryDomain(domain: string | null): boolean {
  if (!domain) return false;
  return /tripadvisor|yelp|facebook|instagram|therapieland|zorgkaart|gids|directory|booking\.com|google\./i.test(
    domain
  );
}
