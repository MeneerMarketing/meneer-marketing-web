import type { SupabaseClient } from "@supabase/supabase-js";
export interface OpportunityGenerationStats {
    brandsProcessed: number;
    opportunitiesUpserted: number;
    linksCreated: number;
    skippedNoBrand: number;
    skippedExcludedBrand: number;
}
/**
 * Group ad occurrences into opportunities:
 * same brand + same normalized landing/product target = one opportunity.
 * Homepage landings for a brand with a resolved PRODUCT page attach that page.
 */
export declare function generateOpportunitiesFromAds(client: SupabaseClient): Promise<OpportunityGenerationStats>;
//# sourceMappingURL=opportunityGenerator.d.ts.map