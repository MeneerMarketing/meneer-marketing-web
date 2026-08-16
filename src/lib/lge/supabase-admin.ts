import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function isLgeSupabaseConfigured(): boolean {
  const url =
    process.env.LGE_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LGE_SUPABASE_URL?.trim();
  const key =
    process.env.LGE_SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  return Boolean(url && key);
}

/** Server-only LGE Supabase client (service role). */
export function getLgeSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url =
    process.env.LGE_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LGE_SUPABASE_URL?.trim();
  const key =
    process.env.LGE_SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "LGE Supabase niet geconfigureerd (LGE_SUPABASE_URL + LGE_SUPABASE_SECRET_KEY)",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
