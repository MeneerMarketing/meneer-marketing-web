import type { SupabaseClient } from "@supabase/supabase-js";
import type { PaidSearchAd } from "../../types/discovery.js";
import type { SignalClassification } from "../../types/signals.js";

export interface StoreAdOccurrenceInput {
  runId: string;
  keywordId: string;
  brandId: string;
  ad: PaidSearchAd;
  source: string;
  signal: SignalClassification;
}

export async function storeAdOccurrence(
  client: SupabaseClient,
  input: StoreAdOccurrenceInput
): Promise<boolean> {
  const foundAt = input.ad.timestamp;
  const row = {
    run_id: input.runId,
    keyword_id: input.keywordId,
    brand_id: input.brandId,
    source: input.source,
    headline: input.ad.headline,
    description: input.ad.description,
    landing_url: input.ad.landingUrl,
    displayed_url: input.ad.displayedUrl,
    rank: input.ad.rank,
    found_at: foundAt,
    observed_at: foundAt,
    serp_item_type: input.ad.serpItemType,
    ad_signal_type: input.signal.adSignalType,
    paid_confidence: input.signal.paidConfidence,
    confirmation_source: input.signal.confirmationSource,
    raw_payload: {
      ...input.ad.rawItem,
      parent_serp_type: input.ad.serpItemType,
    },
    updated_at: foundAt,
  };

  const { error } = await client.from("ad_occurrences").insert(row);

  if (error) {
    if (error.code === "23505") {
      return false;
    }
    throw new Error(`Failed to store ad occurrence: ${error.message}`);
  }

  return true;
}
