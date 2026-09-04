import type { SupabaseClient } from "@supabase/supabase-js";
import type { BrandActivityMetrics } from "../../types/discovery.js";
export declare function getBrandActivityMetrics(client: SupabaseClient, brandIds?: string[], signalFilter?: "CONFIRMED_PAID" | "PAID_CANDIDATE"): Promise<BrandActivityMetrics[]>;
export declare function getTopAdvertisersForRun(client: SupabaseClient, runId: string, signalFilter: "CONFIRMED_PAID" | "PAID_CANDIDATE", limit?: number): Promise<BrandActivityMetrics[]>;
export declare function countBrandsByBusinessCategory(client: SupabaseClient): Promise<{
    leadEligible: number;
    majorRetailersExcluded: number;
    comparisonSitesExcluded: number;
    uniqueDomains: number;
    transparencyConfirmed: number;
}>;
export declare function countOccurrencesBySignal(client: SupabaseClient, runId?: string): Promise<{
    confirmedSearchAds: number;
    confirmedSponsoredShopping: number;
    genericShoppingCandidates: number;
    popularProductsCandidates: number;
}>;
//# sourceMappingURL=brandMetricsService.d.ts.map