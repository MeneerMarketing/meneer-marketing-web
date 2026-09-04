import { createAdminClient } from "@/lib/supabase/admin";
import { dataForSeoPost } from "@/services/seo/dataforseoClient";
import { getVerticalRuntime } from "@/verticals/runtime";
import type { GeneratedKeyword } from "@/services/seo/keywordGenerator";

export interface KeywordMetricRow {
  keyword: string;
  cluster: string;
  intent?: string;
  search_volume: number | null;
  competition: string | null;
  competition_index: number | null;
  cpc: number | null;
  low_top_of_page_bid: number | null;
  high_top_of_page_bid: number | null;
  monthly_searches: unknown[];
  cache_hit: boolean;
}

interface SearchVolumeResponse {
  tasks?: Array<{
    cost?: number;
    result?: Array<{
      keyword?: string;
      search_volume?: number | null;
      competition?: string | null;
      competition_index?: number | null;
      cpc?: number | null;
      low_top_of_page_bid?: number | null;
      high_top_of_page_bid?: number | null;
      monthly_searches?: unknown[] | null;
    }>;
  }>;
}

export async function fetchKeywordMetricsCached(input: {
  verticalSlug: string;
  citySlug: string;
  keywords: GeneratedKeyword[];
  locationCode?: number;
  maxCostRemaining: number;
}): Promise<{ metrics: KeywordMetricRow[]; cost: number; apiCalls: number; cacheHits: number }> {
  const client = createAdminClient();
  const seo = getVerticalRuntime(input.verticalSlug).seo;
  const metrics: KeywordMetricRow[] = [];
  let cost = 0;
  let apiCalls = 0;
  let cacheHits = 0;

  const missing: GeneratedKeyword[] = [];

  for (const kw of input.keywords) {
    const { data: cached } = await client
      .from("seo_keyword_metrics")
      .select("*")
      .eq("vertical_slug", input.verticalSlug)
      .eq("city_slug", input.citySlug)
      .eq("keyword", kw.keyword.toLowerCase())
      .maybeSingle();

    if (cached) {
      cacheHits += 1;
      metrics.push({
        keyword: kw.keyword,
        cluster: kw.cluster,
        intent: kw.intent,
        search_volume: cached.search_volume as number | null,
        competition: cached.competition as string | null,
        competition_index: cached.competition_index as number | null,
        cpc: cached.cpc as number | null,
        low_top_of_page_bid: cached.low_top_of_page_bid as number | null,
        high_top_of_page_bid: cached.high_top_of_page_bid as number | null,
        monthly_searches: (cached.monthly_searches as unknown[]) ?? [],
        cache_hit: true,
      });
    } else {
      missing.push(kw);
    }
  }

  if (missing.length && cost < input.maxCostRemaining) {
    const locationCode = input.locationCode ?? seo.countryLocationCode;
    const { data, cost: callCost } = await dataForSeoPost<SearchVolumeResponse>(
      "/keywords_data/google_ads/search_volume/live",
      [
        {
          location_code: locationCode,
          language_code: seo.languageCode,
          keywords: missing.map((k) => k.keyword),
        },
      ]
    );
    apiCalls += 1;
    cost += callCost;

    const byKeyword = new Map(
      (data.tasks?.[0]?.result ?? []).map((r) => [String(r.keyword ?? "").toLowerCase(), r])
    );

    for (const kw of missing) {
      const row = byKeyword.get(kw.keyword.toLowerCase());
      const payload = {
        vertical_slug: input.verticalSlug,
        city_slug: input.citySlug,
        keyword: kw.keyword.toLowerCase(),
        language_code: seo.languageCode,
        location_code: locationCode,
        search_volume: row?.search_volume ?? null,
        competition: row?.competition ?? null,
        competition_index: row?.competition_index ?? null,
        cpc: row?.cpc ?? null,
        low_top_of_page_bid: row?.low_top_of_page_bid ?? null,
        high_top_of_page_bid: row?.high_top_of_page_bid ?? null,
        monthly_searches: row?.monthly_searches ?? [],
        keyword_cluster: kw.cluster,
        raw: row ?? {},
        fetched_at: new Date().toISOString(),
      };
      await client.from("seo_keyword_metrics").upsert(payload, {
        onConflict: "vertical_slug,city_slug,keyword",
      });
      metrics.push({
        keyword: kw.keyword,
        cluster: kw.cluster,
        intent: kw.intent,
        search_volume: payload.search_volume,
        competition: payload.competition,
        competition_index: payload.competition_index,
        cpc: payload.cpc,
        low_top_of_page_bid: payload.low_top_of_page_bid,
        high_top_of_page_bid: payload.high_top_of_page_bid,
        monthly_searches: payload.monthly_searches as unknown[],
        cache_hit: false,
      });
    }
  }

  return { metrics, cost, apiCalls, cacheHits };
}

/** Clustered demand: max volume per cluster (avoid double counting overlap) */
export function clusteredDemand(metrics: KeywordMetricRow[]): {
  total: number;
  byCluster: Record<string, number>;
} {
  const byCluster: Record<string, number> = {};
  for (const m of metrics) {
    const vol = Number(m.search_volume ?? 0);
    byCluster[m.cluster] = Math.max(byCluster[m.cluster] ?? 0, vol);
  }
  const total = Object.values(byCluster).reduce((a, b) => a + b, 0);
  return { total, byCluster };
}
