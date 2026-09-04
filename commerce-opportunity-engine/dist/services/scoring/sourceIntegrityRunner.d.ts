import type { SupabaseClient } from "@supabase/supabase-js";
export declare function validateOpportunitySourceIntegrity(client: SupabaseClient, opportunityId?: string): Promise<{
    processed: number;
    updated: number;
    results: Array<Record<string, unknown>>;
}>;
//# sourceMappingURL=sourceIntegrityRunner.d.ts.map