import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
export type LabsPaidKeywordItem = {
    keyword: string;
    searchVolume: number | null;
    cpc: number | null;
    title: string | null;
    description: string | null;
    landingUrl: string | null;
    domain: string | null;
    rankGroup: number | null;
    rankAbsolute: number | null;
    estimatedPaidTraffic: number | null;
    estimatedPaidTrafficCost: number | null;
    serpItemType: string | null;
    raw: Record<string, unknown>;
};
export type RankedPaidKeywordsResult = {
    target: string;
    cost: number;
    totalCount: number;
    itemsCount: number;
    items: LabsPaidKeywordItem[];
    rawTask: Record<string, unknown>;
};
/**
 * DataForSEO Labs: ranked keywords for a domain, paid items only.
 * @see https://docs.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live/
 */
export declare function fetchPaidRankedKeywords(input: {
    client: AxiosInstance;
    env: Env;
    target: string;
    limit: number;
}): Promise<RankedPaidKeywordsResult>;
//# sourceMappingURL=rankedPaidKeywords.d.ts.map