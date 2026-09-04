import type { SupabaseClient } from "@supabase/supabase-js";
export interface UniqueCategoryMetrics {
    categoryId: string;
    keywordsScanned: number;
    serpCost: number;
    uniqueDomains: number;
    uniqueEcommerceDomains: number;
    uniqueBrandSpecialistDomains: number;
    uniquePrequalifiedDomains: number;
    uniqueShopifyDomains: number;
    uniqueConfirmedDomains: number;
    categoryProspectYieldScore: number;
}
type BrandLite = {
    id: string;
    business_type?: string | null;
    platform?: string | null;
    is_ecommerce?: boolean | null;
    prequalified_prospect?: boolean | null;
    confirmed_google_advertiser?: boolean | null;
    transparency_confirmed?: boolean | null;
};
/**
 * Aggregate category funnel metrics with DISTINCT brand identity.
 * Fixes M7.2 bug where prequalified/specialists were incremented per ad_occurrence row.
 */
export declare function aggregateUniqueCategoryMetrics(input: {
    categoryId: string;
    keywordsScanned: number;
    serpCost: number;
    brandsById: Map<string, BrandLite>;
}): UniqueCategoryMetrics;
export declare function computeCategoryUniqueStats(client: SupabaseClient, options: {
    categoryKeywordIds: Record<string, string[]>;
    serpCostByCategory?: Record<string, number>;
}): Promise<Record<string, UniqueCategoryMetrics>>;
export declare function categoryStatsToJson(metrics: UniqueCategoryMetrics): Record<string, number>;
export {};
//# sourceMappingURL=categoryStats.d.ts.map