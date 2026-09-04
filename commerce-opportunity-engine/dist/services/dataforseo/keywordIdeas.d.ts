import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
export type KeywordIdeaItem = {
    keyword: string;
    searchVolume: number | null;
    cpc: number | null;
    competition: number | null;
    competitionLevel: string | null;
    competitionIndex: number | null;
    monthlySearches: Array<{
        year: number;
        month: number;
        search_volume: number;
    }>;
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
/**
 * Conservative pre-flight estimate for Labs Keyword Ideas (post July 2026 ~+20%).
 * Base request + per returned keyword. Real cost comes from response.cost.
 * @see https://dataforseo.com/help-center/dataforseo-labs-api-vs-google-ads-api
 */
export declare function estimateKeywordIdeasCost(limit: number): number;
/**
 * DataForSEO Labs: Google Keyword Ideas (live).
 * Prefer over Keywords For Keywords for low-volume budgets (limit + cheaper).
 * @see https://docs.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live/
 */
export declare function fetchKeywordIdeas(input: {
    client: AxiosInstance;
    env: Env;
    seeds: string[];
    limit: number;
}): Promise<KeywordIdeasResult>;
//# sourceMappingURL=keywordIdeas.d.ts.map