import type { SupabaseClient } from "@supabase/supabase-js";
import type { PaidSearchAd } from "../../types/discovery.js";
import type { SignalClassification } from "../../types/signals.js";
export interface StoreAdOccurrenceInput {
    runId: string;
    keywordId: string;
    brandId: string;
    ad: PaidSearchAd;
    source: string;
    signal: SignalClassification;
}
export declare function storeAdOccurrence(client: SupabaseClient, input: StoreAdOccurrenceInput): Promise<boolean>;
//# sourceMappingURL=adOccurrencesRepository.d.ts.map