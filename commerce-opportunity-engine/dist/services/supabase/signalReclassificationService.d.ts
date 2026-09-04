import type { SupabaseClient } from "@supabase/supabase-js";
export interface ReclassifyResult {
    occurrencesUpdated: number;
    brandsUpdated: number;
    confirmedPaid: number;
    paidCandidates: number;
    nonPaid: number;
}
export declare function reclassifyAllSignals(client: SupabaseClient): Promise<ReclassifyResult>;
//# sourceMappingURL=signalReclassificationService.d.ts.map