import type { SupabaseClient } from "@supabase/supabase-js";
import type { GoogleAdsTransparencyResult } from "../../types/signals.js";
import { loadSignalWeights } from "../../config/signalWeights.js";

export async function applyTransparencyResult(
  client: SupabaseClient,
  result: GoogleAdsTransparencyResult
): Promise<void> {
  const weights = loadSignalWeights();
  const checkedAt = new Date().toISOString();

  const { data: brand, error: findError } = await client
    .from("brands")
    .select("id")
    .eq("normalized_domain", result.domain)
    .maybeSingle();

  if (findError) {
    throw new Error(`Failed to find brand for transparency: ${findError.message}`);
  }

  if (!brand) {
    return;
  }

  const metadata = {
    adsFound: result.adsFound,
    formats: result.formats,
    firstSeen: result.firstSeen,
    lastSeen: result.lastSeen,
    advertiserIds: result.advertiserIds,
    evidenceStrength: result.evidenceStrength,
    checkedAt,
  };

  const updates: Record<string, unknown> = {
    transparency_confirmed: result.confirmedAdvertiser,
    transparency_checked_at: checkedAt,
    transparency_metadata: metadata,
    transparency_api_status: "SUCCESS",
    updated_at: checkedAt,
  };

  if (result.confirmedAdvertiser) {
    updates.confirmed_google_advertiser = true;
    updates.confirmation_source = "google_ads_transparency";
    updates.transparency_status = "CONFIRMED";
  } else if (result.evidenceStrength === "EXPLICIT_NEGATIVE") {
    // Only with unambiguous negative proof.
    updates.transparency_status = "NOT_CONFIRMED";
  } else {
    // Empty / inconclusive — do NOT claim the brand never advertises.
    updates.transparency_status = "NOT_RESOLVED";
  }

  const { error } = await client.from("brands").update(updates).eq("id", brand.id);

  if (error) {
    throw new Error(`Failed to apply transparency result: ${error.message}`);
  }

  if (result.confirmedAdvertiser) {
    const { data: occurrences } = await client
      .from("ad_occurrences")
      .select("id")
      .eq("brand_id", brand.id)
      .eq("ad_signal_type", "PAID_CANDIDATE");

    for (const occurrence of occurrences ?? []) {
      await client
        .from("ad_occurrences")
        .update({
          ad_signal_type: "CONFIRMED_PAID",
          paid_confidence: weights.transparencyConfirmation,
          confirmation_source: "google_ads_transparency",
          updated_at: checkedAt,
        })
        .eq("id", occurrence.id);
    }
  }
}

export async function selectDomainsForTransparencyCheck(
  client: SupabaseClient,
  limit: number,
  preferredDomains: string[] = []
): Promise<string[]> {
  const selected: string[] = [];

  for (const domain of preferredDomains) {
    if (selected.length >= limit) {
      break;
    }

    const { data } = await client
      .from("brands")
      .select("normalized_domain, transparency_checked_at")
      .eq("normalized_domain", domain)
      .maybeSingle();

    if (data && !data.transparency_checked_at) {
      selected.push(domain);
    }
  }

  if (selected.length >= limit) {
    return selected;
  }

  const { data: candidates, error } = await client
    .from("brands")
    .select("normalized_domain")
    .eq("lead_eligible", true)
    .is("transparency_checked_at", null)
    .order("last_seen_at", { ascending: false })
    .limit(limit * 2);

  if (error) {
    throw new Error(`Failed to load transparency candidates: ${error.message}`);
  }

  for (const row of candidates ?? []) {
    const domain = row.normalized_domain as string;
    if (!domain || selected.includes(domain)) {
      continue;
    }
    selected.push(domain);
    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}
