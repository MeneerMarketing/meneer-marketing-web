import { createClient } from "@supabase/supabase-js";
export function createSupabaseServerClient(env) {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
/**
 * Verifies connectivity and that the lead-engine schema (brands table) exists.
 */
export async function testSupabaseConnection(client) {
    try {
        const { error } = await client.from("brands").select("id", { head: true, count: "exact" });
        if (error) {
            if (error.code === "42P01" || error.message.includes("does not exist")) {
                return {
                    ok: false,
                    message: "Table 'brands' not found. Run supabase/schema.sql in your Supabase project first.",
                };
            }
            if (error.message.includes("Invalid API key") || error.code === "PGRST301") {
                return {
                    ok: false,
                    message: "Authentication failed. Check SUPABASE_URL and SUPABASE_SECRET_KEY.",
                };
            }
            return { ok: false, message: error.message };
        }
        return { ok: true, message: "CONNECTED" };
    }
    catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : "Unknown Supabase error",
        };
    }
}
//# sourceMappingURL=client.js.map