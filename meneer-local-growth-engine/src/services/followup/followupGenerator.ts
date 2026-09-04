import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { getBrandSettings } from "@/services/outreach/brandSettingsLoader";
import { renderOutreachHtml } from "@/services/outreach/emailRenderer";
import {
  ensureCampaignForBusiness,
  getCampaignLandingUrl,
  getCampaignPreviewUrl,
} from "@/services/campaigns/campaignService";
import { validateFollowupCopy } from "@/services/followup/followupValidation";
import { renderFollowupTemplate } from "@/services/followup/followupTemplates";
import type { Business, FollowupTemplateId, OutreachMessage } from "@/types/domain";

const SENT_STATUSES = ["SENT", "DELIVERED", "OPENED", "CLICKED"] as const;

function firstNameFromContact(name: string | null | undefined): string | null {
  if (!name?.trim()) return null;
  const part = name.trim().split(/\s+/)[0];
  if (!part || part.length < 2) return null;
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

async function loadParentMessage(businessId: string): Promise<OutreachMessage> {
  const client = createAdminClient();
  const { data, error } = await client
    .from("outreach_messages")
    .select("*")
    .eq("business_id", businessId)
    .eq("message_kind", "initial")
    .eq("is_test", false)
    .in("status", [...SENT_STATUSES])
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error("Geen verzonden eerste mail gevonden voor deze lead");
  }
  return data as OutreachMessage;
}

async function loadActiveFollowupDraft(
  businessId: string,
  template: FollowupTemplateId,
): Promise<OutreachMessage | null> {
  const client = createAdminClient();
  const { data } = await client
    .from("outreach_messages")
    .select("*")
    .eq("business_id", businessId)
    .eq("message_kind", "followup")
    .eq("followup_template", template)
    .eq("is_test", false)
    .in("status", ["DRAFT", "REVIEW_REQUIRED", "APPROVED", "SCHEDULED"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as OutreachMessage | null) ?? null;
}

export async function generateFollowupDraft(input: {
  businessId: string;
  template: FollowupTemplateId;
  regenerate?: boolean;
}): Promise<{ message: OutreachMessage; warnings: string[] }> {
  const client = createAdminClient();
  const brand = await getBrandSettings();

  const { data: business, error: bizError } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();
  if (bizError || !business) throw new Error("Business niet gevonden");

  const parent = await loadParentMessage(input.businessId);

  if (parent.status === "REPLIED") {
    throw new Error("Lead heeft al gereageerd op de eerste mail");
  }

  if (business.lead_status === "INBOUND") {
    throw new Error("Lead heeft het formulier ingevuld (INBOUND)");
  }

  if (["CLIENT", "MEETING", "DO_NOT_CONTACT"].includes(business.lead_status)) {
    throw new Error(`Follow-up geblokkeerd voor status ${business.lead_status}`);
  }

  const [{ data: city }, { data: contact }] = await Promise.all([
    client.from("cities").select("name").eq("id", business.city_id).single(),
    parent.contact_id
      ? client
          .from("contacts")
          .select("name, email")
          .eq("id", parent.contact_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!city?.name) throw new Error("Stad ontbreekt");

  const parentMeta = (parent.personalization_metadata ?? {}) as {
    context?: { vertical_slug?: string; landing_page_url?: string };
  };
  const { data: verticalRow } = await client
    .from("verticals")
    .select("slug")
    .eq("id", business.vertical_id)
    .maybeSingle();
  const verticalSlug =
    parentMeta.context?.vertical_slug ?? (verticalRow?.slug as string) ?? "pilates";

  const campaign = await ensureCampaignForBusiness({ businessId: input.businessId });
  const previewUrl =
    parent.preview_url || (await getCampaignPreviewUrl(campaign)) || "";
  if (!previewUrl) throw new Error("Preview URL ontbreekt");

  const landingPageUrl =
    parentMeta.context?.landing_page_url ||
    (await getCampaignLandingUrl(campaign));

  const rendered = renderFollowupTemplate(input.template, {
    business_name: business.studio_name as string,
    city: city.name as string,
    contact_first_name: firstNameFromContact(contact?.name as string | null),
    verticalSlug,
    brand,
  });

  const validation = validateFollowupCopy({
    subject: rendered.subject,
    body_text: rendered.body_text,
    business_name: business.studio_name as string,
  });

  const bodyHtml = renderOutreachHtml({
    bodyText: rendered.body_text,
    previewUrl,
    landingPageUrl: landingPageUrl ?? undefined,
    brand,
  });

  const now = new Date().toISOString();
  const status = validation.warnings.length ? "REVIEW_REQUIRED" : "DRAFT";

  const payload = {
    business_id: input.businessId,
    contact_id: parent.contact_id,
    subject: rendered.subject,
    body: rendered.body_text,
    body_text: rendered.body_text,
    body_html: bodyHtml,
    preview_url: previewUrl,
    status,
    message_kind: "followup",
    parent_message_id: parent.id,
    followup_template: input.template,
    generated_at: now,
    approved_at: null,
    personalization_metadata: {
      method: "FOLLOWUP_TEMPLATE",
      template: input.template,
      parent_message_id: parent.id,
      context: {
        vertical_slug: verticalSlug,
        landing_page_url: landingPageUrl,
        parent_sent_at: parent.sent_at,
      },
    },
    generation_method: "FOLLOWUP_TEMPLATE",
    outreach_basis: "followup_after_initial",
    metadata: { regenerate: Boolean(input.regenerate) },
    updated_at: now,
  };

  const existing = await loadActiveFollowupDraft(input.businessId, input.template);

  let message: OutreachMessage;

  if (input.regenerate && existing) {
    await client
      .from("outreach_messages")
      .update({
        metadata: {
          ...((existing.metadata as Record<string, unknown>) ?? {}),
          superseded: true,
          superseded_at: now,
        },
        updated_at: now,
      })
      .eq("id", existing.id);

    const { data: inserted, error } = await client
      .from("outreach_messages")
      .insert({
        ...payload,
        version: Number(existing.version ?? 1) + 1,
        previous_version_id: existing.id,
      })
      .select("*")
      .single();
    if (error || !inserted) throw new Error(error?.message ?? "Follow-up insert mislukt");
    message = inserted as OutreachMessage;

    await writeActivity(client, {
      business_id: input.businessId,
      activity_type: "FOLLOWUP_REGENERATED",
      title: `Follow-up ${input.template} · ${business.studio_name}`,
      metadata: { message_id: message.id, template: input.template },
    });
  } else if (existing) {
    const { data: updated, error } = await client
      .from("outreach_messages")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error(error?.message ?? "Follow-up update mislukt");
    message = updated as OutreachMessage;
  } else {
    const { data: inserted, error } = await client
      .from("outreach_messages")
      .insert({ ...payload, version: 1 })
      .select("*")
      .single();
    if (error || !inserted) throw new Error(error?.message ?? "Follow-up insert mislukt");
    message = inserted as OutreachMessage;

    await writeActivity(client, {
      business_id: input.businessId,
      activity_type: "FOLLOWUP_DRAFT_GENERATED",
      title: `Follow-up draft · ${business.studio_name}`,
      description: rendered.subject,
      metadata: { message_id: message.id, template: input.template },
    });
  }

  return { message, warnings: [...validation.errors, ...validation.warnings] };
}

export async function toggleBusinessFollowupList(input: {
  businessId: string;
  selected: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = createAdminClient();
  const now = new Date().toISOString();

  const { data: business } = await client
    .from("businesses")
    .select("id, studio_name, selected_for_followup")
    .eq("id", input.businessId)
    .maybeSingle();

  if (!business) return { ok: false, error: "business_not_found" };

  const { error } = await client
    .from("businesses")
    .update({
      selected_for_followup: input.selected,
      selected_for_followup_at: input.selected ? now : null,
      updated_at: now,
    })
    .eq("id", input.businessId);

  if (error) return { ok: false, error: error.message };

  await writeActivity(client, {
    business_id: input.businessId,
    activity_type: input.selected ? "FOLLOWUP_SELECTED" : "FOLLOWUP_DESELECTED",
    title: input.selected
      ? `${business.studio_name} op follow-up lijst`
      : `${business.studio_name} van follow-up lijst`,
  });

  return { ok: true };
}

export async function generateFollowupBatch(input: {
  businessIds: string[];
  template: FollowupTemplateId;
}): Promise<{
  generated: number;
  failed: { businessId: string; error: string }[];
  messages: OutreachMessage[];
}> {
  const messages: OutreachMessage[] = [];
  const failed: { businessId: string; error: string }[] = [];

  for (const businessId of input.businessIds) {
    try {
      const result = await generateFollowupDraft({
        businessId,
        template: input.template,
      });
      messages.push(result.message);
    } catch (err) {
      failed.push({
        businessId,
        error: err instanceof Error ? err.message : "Onbekende fout",
      });
    }
  }

  return { generated: messages.length, failed, messages };
}
