/**
 * Dashboard-side mirror of engine outreachStateSync (keeps operator actions local).
 * Keep in sync with src/services/outreach/outreachStateSync.ts
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const TERMINAL_SENT = new Set([
  "SENT",
  "DELIVERED",
  "REPLIED",
  "POSITIVE_REPLY",
  "NEGATIVE_REPLY",
  "BOUNCED",
  "UNSUBSCRIBED",
]);

async function isSuppressed(
  client: SupabaseClient,
  email: string | null,
  domain: string
): Promise<boolean> {
  if (email) {
    const normalized = email.trim().toLowerCase();
    const { data } = await client
      .from("coe_outreach_suppression")
      .select("id")
      .eq("email_normalized", normalized)
      .maybeSingle();
    if (data?.id) return true;
  }
  const brandDomain = domain.toLowerCase().replace(/^www\./, "");
  const { data: domainHit } = await client
    .from("coe_outreach_suppression")
    .select("id")
    .eq("domain", brandDomain)
    .is("email_normalized", null)
    .maybeSingle();
  return Boolean(domainHit?.id);
}

export async function syncOutreachMessagesForBrand(
  client: SupabaseClient,
  brandId: string,
  explicitReason?: string
): Promise<Array<{ messageId: string; nextStatus: string | null }>> {
  const { data: brand, error: brandErr } = await client
    .from("brands")
    .select(
      "id, normalized_domain, manual_excluded, do_not_contact, eligibility_status, lead_eligible"
    )
    .eq("id", brandId)
    .single();
  if (brandErr || !brand) throw new Error(brandErr?.message ?? "Brand not found");

  const { data: messages, error } = await client
    .from("coe_outreach_messages")
    .select(
      `id, status, opportunity_id, approved_at,
       coe_brand_contacts ( email, is_usable_for_outreach ),
       opportunities ( status, outreach_eligible )`
    )
    .eq("brand_id", brandId);
  if (error) throw new Error(error.message);

  const results: Array<{ messageId: string; nextStatus: string | null }> = [];
  const now = new Date().toISOString();
  const domain = String(brand.normalized_domain);

  for (const msg of messages ?? []) {
    if (TERMINAL_SENT.has(String(msg.status))) {
      results.push({ messageId: msg.id, nextStatus: null });
      continue;
    }

    const contact = Array.isArray(msg.coe_brand_contacts)
      ? msg.coe_brand_contacts[0]
      : msg.coe_brand_contacts;
    const opportunity = Array.isArray(msg.opportunities)
      ? msg.opportunities[0]
      : msg.opportunities;

    const reasons: string[] = [];
    if (brand.manual_excluded) reasons.push("brand manually excluded");
    if (brand.do_not_contact) reasons.push("do not contact");
    if (String(brand.eligibility_status ?? "").toUpperCase() === "EXCLUDED") {
      reasons.push("brand eligibility excluded");
    }
    if (brand.lead_eligible === false) reasons.push("brand not lead eligible");
    const oppStatus = String(opportunity?.status ?? "").toUpperCase();
    if (oppStatus === "REJECTED") reasons.push("opportunity rejected");
    if (oppStatus === "EXCLUDED") reasons.push("opportunity excluded");
    if (opportunity?.outreach_eligible === false) {
      reasons.push("outreach_eligible=false");
    }
    const suppressed = await isSuppressed(
      client,
      (contact?.email as string | null) ?? null,
      domain
    );
    if (suppressed) reasons.push("suppression list");

    if (!reasons.length) {
      results.push({ messageId: msg.id, nextStatus: null });
      continue;
    }

    const wasApproved =
      String(msg.status) === "APPROVED" || Boolean(msg.approved_at);
    const alreadyRevoked = String(msg.status) === "APPROVAL_REVOKED";
    const nextStatus =
      wasApproved || alreadyRevoked ? "APPROVAL_REVOKED" : "BLOCKED";
    const reasonText = explicitReason
      ? `${explicitReason}; ${reasons.join("; ")}`
      : reasons.join("; ");

    await client
      .from("coe_outreach_messages")
      .update({
        status: nextStatus,
        blocked_at: now,
        blocked_reason: reasonText,
        approval_revoked_at:
          wasApproved || alreadyRevoked ? now : null,
        approved_at: null,
        approved_by: null,
        approved_content_hash: null,
        updated_at: now,
      })
      .eq("id", msg.id);

    await client.from("coe_outreach_events").insert({
      outreach_message_id: msg.id,
      brand_id: brandId,
      event_type: wasApproved ? "APPROVAL_REVOKED" : "BLOCKED",
      payload: { reasons, previousStatus: msg.status, reasonText },
    });

    if (msg.opportunity_id) {
      await client
        .from("opportunities")
        .update({
          outreach_status: nextStatus,
          outreach_eligible: false,
          outreach_eligible_reason: reasonText,
          updated_at: now,
        })
        .eq("id", msg.opportunity_id);
    }

    results.push({ messageId: msg.id, nextStatus });
  }

  return results;
}
