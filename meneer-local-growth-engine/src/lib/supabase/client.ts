import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export { isSupabaseConfigured };

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase env ontbreekt (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)");
  }

  return createBrowserClient(url, key);
}
