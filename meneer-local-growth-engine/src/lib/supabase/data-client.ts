import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { shouldPreferAdminDataClient } from "@/lib/supabase/devClientPreference";
import { isDevAdminClientEnvEnabled } from "@/lib/supabase/devClientPreference.shared";
import { createClient as createServerUserClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function sessionHasJwtClockSkew(client: SupabaseClient): Promise<boolean> {
  const { error } = await client.from("verticals").select("id").limit(1);
  return error?.code === "PGRST303";
}

function envForcesAdminDataClient(): boolean {
  return (
    process.env.LGE_DEV_AUTH_BYPASS === "true" || isDevAdminClientEnvEnabled()
  );
}

function missingAdminKeyMessage(): string {
  return (
    "SUPABASE_SECRET_KEY ontbreekt in .env.local terwijl LGE_DEV_AUTH_BYPASS of " +
    "LGE_DEV_USE_ADMIN_CLIENT actief is. Voeg de service key toe en herstart npm run dev."
  );
}

/**
 * Prefer authenticated user session (RLS). Fall back to admin when:
 * - LGE_DEV_USE_ADMIN_CLIENT=true (dev), or
 * - lge_dev_admin_client cookie (dev settings), or
 * - LGE_DEV_AUTH_BYPASS=true, or
 * - no session but admin key is available (server jobs / local UI)
 * - JWT clock skew (PGRST303)
 */
export async function getDataClient(): Promise<SupabaseClient> {
  const adminConfigured = isAdminConfigured();

  // Env flags win always — never use a stale login JWT when bypass/admin is requested.
  if (envForcesAdminDataClient()) {
    if (!adminConfigured) {
      throw new Error(missingAdminKeyMessage());
    }
    return createAdminClient();
  }

  if (adminConfigured && (await shouldPreferAdminDataClient(adminConfigured))) {
    return createAdminClient();
  }

  const userClient = await createServerUserClient();

  if (userClient) {
    const { data } = await userClient.auth.getUser();
    if (data.user) {
      await userClient.auth.refreshSession().catch(() => null);
      if (adminConfigured && (await sessionHasJwtClockSkew(userClient))) {
        console.warn(
          "[LGE] Supabase JWT clock skew (PGRST303) — fallback naar admin client.",
        );
        return createAdminClient();
      }
      return userClient;
    }
  }

  if (adminConfigured) {
    return createAdminClient();
  }

  throw new Error("Geen Supabase sessie en geen admin key beschikbaar");
}

export {
  getDevAdminClientMode,
  devAdminClientModeLabel,
  type DevAdminClientMode,
} from "@/lib/supabase/devClientPreference";
