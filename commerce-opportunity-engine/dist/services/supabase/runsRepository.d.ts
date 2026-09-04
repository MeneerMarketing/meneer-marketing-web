import type { SupabaseClient } from "@supabase/supabase-js";
export interface RunRecord {
    id: string;
    run_type: string;
    status: string;
    metadata: Record<string, unknown>;
}
export declare function createRun(client: SupabaseClient, runType: string, metadata?: Record<string, unknown>): Promise<RunRecord>;
export declare function completeRun(client: SupabaseClient, runId: string, status: "completed" | "failed", metadata: Record<string, unknown>): Promise<void>;
//# sourceMappingURL=runsRepository.d.ts.map