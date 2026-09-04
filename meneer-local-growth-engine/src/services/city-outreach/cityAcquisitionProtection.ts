import { createAdminClient } from "@/lib/supabase/admin";
import { pilatesOutreachBlockedCitySlugs } from "@/verticals/pilates";

export type CityAcquisitionStatus = "ACQUISITION_ALLOWED" | "MANUALLY_PROTECTED";

export interface CityAcquisitionSettingsRow {
  vertical_id: string;
  city_id: string;
  acquisition_status: CityAcquisitionStatus;
  protection_reason: string | null;
  notes: string | null;
}

export async function getCityAcquisitionSettings(input: {
  verticalId: string;
  cityId: string;
}): Promise<CityAcquisitionSettingsRow | null> {
  const client = createAdminClient();
  const { data } = await client
    .from("city_acquisition_settings")
    .select("vertical_id, city_id, acquisition_status, protection_reason, notes")
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .maybeSingle();

  return (data as CityAcquisitionSettingsRow | null) ?? null;
}

export async function isCityManuallyProtected(input: {
  verticalId: string;
  cityId: string;
  citySlug?: string | null;
}): Promise<{ protected: boolean; reason: string | null }> {
  const settings = await getCityAcquisitionSettings({
    verticalId: input.verticalId,
    cityId: input.cityId,
  });

  if (settings?.acquisition_status === "MANUALLY_PROTECTED") {
    return {
      protected: true,
      reason: settings.protection_reason ?? "manual",
    };
  }

  if (
    input.citySlug &&
    (pilatesOutreachBlockedCitySlugs as readonly string[]).includes(input.citySlug)
  ) {
    return { protected: true, reason: "existing_client" };
  }

  return { protected: false, reason: null };
}
