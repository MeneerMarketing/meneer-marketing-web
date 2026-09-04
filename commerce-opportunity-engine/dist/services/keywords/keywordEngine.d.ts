import type { AxiosInstance } from "axios";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../../config/env.js";
import type { KeywordCategoryId } from "../../config/keywordCategories.js";
export interface KeywordEngineRunResult {
    categoryId: string;
    categoryLabel: string;
    seeds: string[];
    estimatedCost: number;
    actualCost: number;
    rawCandidates: number;
    afterDedupe: number;
    upserted: number;
    skippedManual: number;
    qualified: number;
    rejected: number;
    discovered: number;
    top30: Array<{
        keyword: string;
        quality: number | null;
        commercial: number | null;
        product: number | null;
        volume: number | null;
        cpc: number | null;
        cluster: string | null;
        status: string;
    }>;
    rejectedSamples: Array<{
        keyword: string;
        reason: string;
    }>;
    stoppedReason: string | null;
}
export declare function runKeywordGeneration(input: {
    client: AxiosInstance;
    supabase: SupabaseClient;
    env: Env;
    categoryId?: KeywordCategoryId;
    dryEstimateOnly?: boolean;
}): Promise<KeywordEngineRunResult>;
export declare function detectKeywordQualityProblems(result: KeywordEngineRunResult): string[];
//# sourceMappingURL=keywordEngine.d.ts.map