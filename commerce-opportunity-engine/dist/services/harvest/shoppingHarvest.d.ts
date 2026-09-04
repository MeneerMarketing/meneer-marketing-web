import type { AxiosInstance } from "axios";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../../config/env.js";
export type HarvestSourceKeyword = {
    id: string;
    keyword: string;
    prospecting: number | null;
    relevance: number | null;
    intent: string | null;
    tier: string | null;
    yieldScore: number | null;
};
export declare function selectShoppingSourceKeywords(keywords: HarvestSourceKeyword[], max?: 2): HarvestSourceKeyword[];
export declare function harvestShoppingTargetsForBrand(input: {
    client: AxiosInstance;
    supabase: SupabaseClient;
    env: Env;
    brandId: string;
    brandDomain: string;
    keywords: HarvestSourceKeyword[];
    budgetRemaining: number;
}): Promise<{
    cost: number;
    exactPaid: number;
    exactListing: number;
    freeListing: number;
    candidate: number;
    mismatches: Array<Record<string, unknown>>;
    examples: Array<Record<string, unknown>>;
    opportunitiesUpserted: number;
}>;
//# sourceMappingURL=shoppingHarvest.d.ts.map