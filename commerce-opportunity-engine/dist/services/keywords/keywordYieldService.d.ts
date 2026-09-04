import type { SupabaseClient } from "@supabase/supabase-js";
export interface KeywordYieldMetrics {
    serpCost: number | null;
    placementsFound: number;
    uniqueDomains: number;
    newDomains: number;
    generalRetailersFound: number;
    comparisonSitesFound: number;
    marketplacesFound: number;
    leadEligibleFound: number;
    shopifyFound: number;
    confirmedAdvertisersFound: number;
    highConfidenceTargetsFound: number;
    exactPaidTargetsFound: number;
    retailerRatio: number | null;
    prospectYieldScore: number | null;
    costPerNewBrand: number | null;
    costPerLeadEligible: number | null;
    costPerShopifyProspect: number | null;
    keywordEfficiencyScore: number | null;
    domains: string[];
}
/**
 * Compute yield metrics for a keyword from existing ad_occurrences + brands.
 * DataForSEO cost comes from keyword.serp_cost / estimated / scan stats when present.
 */
export declare function computeKeywordYield(client: SupabaseClient, keywordId: string, serpCostHint: number | null): Promise<KeywordYieldMetrics>;
//# sourceMappingURL=keywordYieldService.d.ts.map