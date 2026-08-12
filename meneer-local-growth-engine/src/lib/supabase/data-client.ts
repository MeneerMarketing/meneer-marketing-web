import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createClient as createServerUserClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Prefer authenticated user session (RLS). Fall back to admin when:
 * - LGE_DEV_AUTH_BYPASS=true, or
 * - no session but admin key is available (server jobs / local UI)
 */
export async function getDataClient(): Promise<SupabaseClient> {
  const bypass = process.env.LGE_DEV_AUTH_BYPASS === "true";
  const userClient = await createServerUserClient();

  if (userClient) {
    const { data } = await userClient.auth.getUser();
    if (data.user) return userClient;
  }

  if (bypass || isAdminConfigured()) {
    return createAdminClient();
  }

  throw new Error("Geen Supabase sessie en geen admin key beschikbaar");
}
