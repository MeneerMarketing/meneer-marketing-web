import type { SupabaseClient } from "@supabase/supabase-js";
import { logActivity, type ExclusionReason } from "./operator";
import { syncOutreachMessagesForBrand } from "./outreachStateSync";

export async function excludeBrand(
  client: SupabaseClient,
  brandId: string,
  reason: ExclusionReason,
  note: string | null
) {
  const now = new Date().toISOString();
  const { error } = await client
    .from("brands")
    .update({
      manual_excluded: true,
      manual_excluded_at: now,
      manual_exclusion_reason: reason,
      manual_exclusion_note: note,
      lead_eligible: false,
      eligibility_status: "EXCLUDED",
      excluded_reason: reason,
      operator_status: "EXCLUDED",
      do_not_contact: reason === "DO_NOT_CONTACT" ? true : undefined,
      do_not_contact_at: reason === "DO_NOT_CONTACT" ? now : undefined,
      updated_at: now,
    })
    .eq("id", brandId);
  if (error) throw new Error(error.message);

  await client
    .from("opportunities")
    .update({
      status: "EXCLUDED",
      operator_status: "EXCLUDED",
      outreach_eligible: false,
      outreach_eligible_reason: `brand_manually_excluded:${reason}`,
      updated_at: now,
    })
    .eq("brand_id", brandId)
    .not("status", "in", '("WON","LOST")')
    .eq("is_merged", false);

  await syncOutreachMessagesForBrand(
    client,
    brandId,
    reason === "DO_NOT_CONTACT" ? "do not contact" : "brand manually excluded"
  );

  await logActivity(client, {
    brandId,
    eventType: "MANUAL_EXCLUDE",
    title: "Brand uitgesloten",
    detail: reason,
    metadata: { note },
  });
}

export async function unexcludeBrand(client: SupabaseClient, brandId: string) {
  const now = new Date().toISOString();
  const { data: brand } = await client
    .from("brands")
    .select("force_lead_eligible, business_type, confirmed_google_advertiser, transparency_confirmed")
    .eq("id", brandId)
    .single();

  const force = Boolean(brand?.force_lead_eligible);
  const eligible =
    force ||
    ((brand?.confirmed_google_advertiser || brand?.transparency_confirmed) &&
      !["MARKETPLACE", "GENERAL_RETAILER"].includes(String(brand?.business_type ?? "")));

  const { error } = await client
    .from("brands")
    .update({
      manual_excluded: false,
      manual_excluded_at: null,
      manual_exclusion_reason: null,
      manual_exclusion_note: null,
      excluded_reason: null,
      lead_eligible: eligible,
      eligibility_status: eligible ? "LEAD_ELIGIBLE" : "PENDING_QUALIFICATION",
      operator_status: eligible ? "QUALIFIED" : "PENDING_QUALIFICATION",
      updated_at: now,
    })
    .eq("id", brandId);
  if (error) throw new Error(error.message);

  await logActivity(client, {
    brandId,
    eventType: "MANUAL_UNEXCLUDE",
    title: "Uitsluiting opgeheven",
  });
}

export async function setDoNotContact(
  client: SupabaseClient,
  brandId: string,
  enabled: boolean,
  note?: string | null
) {
  const now = new Date().toISOString();
  const { error } = await client
    .from("brands")
    .update({
      do_not_contact: enabled,
      do_not_contact_at: enabled ? now : null,
      do_not_contact_note: enabled ? note ?? null : null,
      updated_at: now,
    })
    .eq("id", brandId);
  if (error) throw new Error(error.message);

  if (enabled) {
    await client
      .from("opportunities")
      .update({
        outreach_eligible: false,
        outreach_eligible_reason: "do_not_contact",
        outreach_status: "DO_NOT_CONTACT",
        updated_at: now,
      })
      .eq("brand_id", brandId)
      .eq("is_merged", false);
    await syncOutreachMessagesForBrand(client, brandId, "do not contact");
  }

  await logActivity(client, {
    brandId,
    eventType: enabled ? "DNC_ON" : "DNC_OFF",
    title: enabled ? "Do Not Contact aan" : "Do Not Contact uit",
    detail: note ?? null,
  });
}

export async function setBrandFavorite(
  client: SupabaseClient,
  brandId: string,
  enabled: boolean
) {
  const now = new Date().toISOString();
  const { error } = await client
    .from("brands")
    .update({
      is_favorite: enabled,
      favorite_at: enabled ? now : null,
      updated_at: now,
    })
    .eq("id", brandId);
  if (error) throw new Error(error.message);
  await logActivity(client, {
    brandId,
    eventType: enabled ? "FAVORITE_ON" : "FAVORITE_OFF",
    title: enabled ? "Favoriet toegevoegd" : "Favoriet verwijderd",
  });
}

export async function setOpportunityFavorite(
  client: SupabaseClient,
  opportunityId: string,
  brandId: string,
  enabled: boolean
) {
  const now = new Date().toISOString();
  const { error } = await client
    .from("opportunities")
    .update({
      is_favorite: enabled,
      favorite_at: enabled ? now : null,
      updated_at: now,
    })
    .eq("id", opportunityId);
  if (error) throw new Error(error.message);
  await logActivity(client, {
    brandId,
    opportunityId,
    eventType: enabled ? "FAVORITE_ON" : "FAVORITE_OFF",
    title: enabled ? "Opportunity favoriet" : "Favoriet verwijderd",
  });
}

export async function setShortlist(
  client: SupabaseClient,
  opportunityId: string,
  brandId: string,
  enabled: boolean
) {
  const now = new Date().toISOString();
  const { error } = await client
    .from("opportunities")
    .update({
      is_shortlisted: enabled,
      shortlisted_at: enabled ? now : null,
      status: enabled ? "SHORTLISTED" : "REVIEWED",
      operator_status: enabled ? "SHORTLISTED" : "AUDITED",
      updated_at: now,
    })
    .eq("id", opportunityId);
  if (error) throw new Error(error.message);
  await logActivity(client, {
    brandId,
    opportunityId,
    eventType: enabled ? "SHORTLIST_ON" : "SHORTLIST_OFF",
    title: enabled ? "Op shortlist gezet" : "Van shortlist gehaald",
  });
}
