import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export type KeywordIdeaItem = {
  keyword: string;
  searchVolume: number | null;
  cpc: number | null;
  competition: number | null;
  competitionLevel: string | null;
  competitionIndex: number | null;
  monthlySearches: Array<{ year: number; month: number; search_volume: number }>;
  categories: unknown;
  searchIntentMain: string | null;
  coreKeyword: string | null;
  raw: Record<string, unknown>;
};

export type KeywordIdeasResult = {
  cost: number;
  seedKeywords: string[];
  totalCount: number;
  itemsCount: number;
  items: KeywordIdeaItem[];
  rawTask: Record<string, unknown>;
};

type LabsResponse = {
  status_code?: number;
  status_message?: string;
  cost?: number;
  tasks?: Array<{
    status_code?: number;
    status_message?: string;
    cost?: number;
    result?: Array<{
      seed_keywords?: string[];
      total_count?: number;
      items_count?: number;
      items?: Array<Record<string, unknown>>;
    }>;
  }>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Conservative pre-flight estimate for Labs Keyword Ideas (post July 2026 ~+20%).
 * Base request + per returned keyword. Real cost comes from response.cost.
 * @see https://dataforseo.com/help-center/dataforseo-labs-api-vs-google-ads-api
 */
export function estimateKeywordIdeasCost(limit: number): number {
  const base = 0.0144;
  const perKeyword = 0.000144;
  return Number((base + perKeyword * Math.max(0, limit)).toFixed(6));
}

/**
 * DataForSEO Labs: Google Keyword Ideas (live).
 * Prefer over Keywords For Keywords for low-volume budgets (limit + cheaper).
 * @see https://docs.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live/
 */
export async function fetchKeywordIdeas(input: {
  client: AxiosInstance;
  env: Env;
  seeds: string[];
  limit: number;
}): Promise<KeywordIdeasResult> {
  const seeds = input.seeds.map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (seeds.length === 0) {
    throw new Error("fetchKeywordIdeas requires at least one seed keyword");
  }

  const body = [
    {
      keywords: seeds,
      location_code: input.env.GOOGLE_SERP_LOCATION_CODE,
      language_code: input.env.GOOGLE_SERP_LANGUAGE_CODE,
      closely_variants: false,
      ignore_synonyms: false,
      include_serp_info: false,
      include_clickstream_data: false,
      limit: input.limit,
      order_by: ["relevance,desc", "keyword_info.search_volume,desc"],
    },
  ];

  logger.info("DataForSEO Labs keyword_ideas request", {
    seeds: seeds.length,
    limit: input.limit,
    location: input.env.GOOGLE_SERP_LOCATION_CODE,
    language: input.env.GOOGLE_SERP_LANGUAGE_CODE,
    estimatedCost: estimateKeywordIdeasCost(input.limit),
  });

  const response = await input.client.post<LabsResponse>(
    "/dataforseo_labs/google/keyword_ideas/live",
    body,
    { timeout: 90000 }
  );

  const data = response.data;
  const task = data.tasks?.[0];
  const cost = task?.cost ?? data.cost ?? 0;

  if (data.status_code && data.status_code !== 20000) {
    throw new Error(
      `DataForSEO Labs keyword_ideas error: ${data.status_message ?? data.status_code} (cost $${cost})`
    );
  }
  if (task?.status_code && task.status_code !== 20000) {
    throw new Error(
      `DataForSEO Labs keyword_ideas task error: ${task.status_message ?? task.status_code} (cost $${cost})`
    );
  }

  const result = task?.result?.[0];
  const items: KeywordIdeaItem[] = [];

  for (const row of result?.items ?? []) {
    const keyword = asString(row.keyword);
    if (!keyword) continue;
    const info = asRecord(row.keyword_info);
    const props = asRecord(row.keyword_properties);
    const intent = asRecord(row.search_intent_info);

    const monthlyRaw = info?.monthly_searches;
    const monthlySearches: KeywordIdeaItem["monthlySearches"] = [];
    if (Array.isArray(monthlyRaw)) {
      for (const m of monthlyRaw) {
        const rec = asRecord(m);
        if (!rec) continue;
        const year = asNumber(rec.year);
        const month = asNumber(rec.month);
        const sv = asNumber(rec.search_volume);
        if (year !== null && month !== null && sv !== null) {
          monthlySearches.push({ year, month, search_volume: sv });
        }
      }
    }

    const competition = asNumber(info?.competition);
    items.push({
      keyword,
      searchVolume: asNumber(info?.search_volume),
      cpc: asNumber(info?.cpc),
      competition,
      competitionLevel: asString(info?.competition_level),
      competitionIndex:
        competition === null ? null : Math.round(Math.max(0, Math.min(100, competition * 100))),
      monthlySearches,
      categories: info?.categories ?? null,
      searchIntentMain: asString(intent?.main_intent),
      coreKeyword: asString(props?.core_keyword),
      raw: row,
    });
  }

  logger.info("DataForSEO Labs keyword_ideas response", {
    cost,
    totalCount: result?.total_count ?? 0,
    itemsCount: items.length,
  });

  return {
    cost,
    seedKeywords: result?.seed_keywords ?? seeds,
    totalCount: result?.total_count ?? 0,
    itemsCount: items.length,
    items,
    rawTask: (task as Record<string, unknown>) ?? {},
  };
}
