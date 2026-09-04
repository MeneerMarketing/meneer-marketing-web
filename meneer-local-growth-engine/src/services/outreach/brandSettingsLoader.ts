import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_BRAND_SETTINGS,
  mergeBrandSettings,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";

export async function getBrandSettings(): Promise<MeneerMarketingBrandSettings> {
  try {
    const client = createAdminClient();
    const { data } = await client
      .from("brand_settings")
      .select("value")
      .eq("key", "meneer_marketing")
      .maybeSingle();
    return mergeBrandSettings(
      (data?.value as Partial<MeneerMarketingBrandSettings> | null) ?? null
    );
  } catch {
    return DEFAULT_BRAND_SETTINGS;
  }
}
