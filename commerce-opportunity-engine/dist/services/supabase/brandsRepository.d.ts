import type { SupabaseClient } from "@supabase/supabase-js";
import type { BrandRecord } from "../../types/discovery.js";
export interface UpsertBrandInput {
    name: string;
    domain: string;
    normalizedDomain: string;
    seenAt: string;
    confirmedGoogleAdvertiser?: boolean;
    confirmationSource?: string | null;
}
export interface UpsertBrandResult {
    brand: BrandRecord;
    isNew: boolean;
}
export declare function findBrandByNormalizedDomain(client: SupabaseClient, normalizedDomain: string): Promise<BrandRecord | null>;
export declare function upsertBrandFromAd(client: SupabaseClient, input: UpsertBrandInput): Promise<UpsertBrandResult>;
//# sourceMappingURL=brandsRepository.d.ts.map