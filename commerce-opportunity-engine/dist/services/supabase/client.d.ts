import { type SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../../config/env.js";
export interface SupabaseConnectionResult {
    ok: boolean;
    message: string;
}
export declare function createSupabaseServerClient(env: Env): SupabaseClient;
/**
 * Verifies connectivity and that the lead-engine schema (brands table) exists.
 */
export declare function testSupabaseConnection(client: SupabaseClient): Promise<SupabaseConnectionResult>;
//# sourceMappingURL=client.d.ts.map