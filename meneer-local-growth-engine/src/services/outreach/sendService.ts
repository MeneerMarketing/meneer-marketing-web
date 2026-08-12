import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import {
  getEmailProvider,
  isEmailProviderReady,
  isRealSendEnabled,
} from "@/lib/email/provider";
import { getBrandSettings } from "@/services/outreach/brandSettingsLoader";
import {
  addSuppression,
  isEmailSuppressed,
  qualifyForOutreachDraft,
} from "@/services/outreach/outreachQualification";
import { renderOutreachHtml } from "@/services/outreach/emailRenderer";
import {
  buildAbsolutePreviewUrl,
  maskEmail,
} from "@/services/outreach/previewUrl";
import type { Business, OutreachMessage } from "@/types/domain";

const TEST_SEND_LOCK_MS = 20_000;

function rewriteBodyWithAbsolutePreview(
  bodyText: string,
  previousUrl: string | null | undefined,
  absoluteUrl: string
): string {
  let text = bodyText;
  if (previousUrl && text.includes(previousUrl)) {
    text = text.split(previousUrl).join(absoluteUrl);
  }
  text = text.replace(/https?:\/\/[^\s<>"]+\/preview\/[a-z0-9-]+/gi, absoluteUrl);
  text = text.replace(/https?:\/\/preview\.[^\s<>"]+\/[a-z0-9-]+/gi, absoluteUrl);
  text = text.replace(/(^|\n)\/preview\/[a-z0-9-]+/gi, `$1${absoluteUrl}`);
  if (!text.includes(absoluteUrl)) {
    text = text.replace(
      /→ Bekijk hier jullie conceptwebsite/i,
      `→ Bekijk hier jullie conceptwebsite\n${absoluteUrl}`
    );
  }
  return text;
}

async function loadMessage(messageId: string): Promise<{
  message: OutreachMessage;
  business: Business;
  toEmail: string;
}> {
  const client = createAdminClient();
  const { data: message } = await client
    .from("outreach_messages")
    .select("*")
    .eq("id", messageId)
    .single();
  if (!message) throw new Error("Outreach message niet gevonden");

  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", message.business_id)
    .single();
  if (!business) throw new Error("Business niet gevonden");

  let toEmail: string | null = null;
  if (message.contact_id) {
    const { data: contact } = await client
      .from("contacts")
      .select("email")
      .eq("id", message.contact_id)
      .maybeSingle();
    toEmail = contact?.email ?? null;
  }
  if (!toEmail) toEmail = business.email;
  if (!toEmail) throw new Error("Geen ontvanger e-mail");

  return {
    message: message as OutreachMessage,
    business: business as Business,
    toEmail: toEmail.trim().toLowerCase(),
  };
}

export async function approveOutreachMessage(messageId: string): Promise<OutreachMessage> {
  const client = createAdminClient();
  const { message, business } = await loadMessage(messageId);
  if (!["DRAFT", "REVIEW_REQUIRED"].includes(message.status)) {
    throw new Error(`Kan status ${message.status} niet goedkeuren`);
  }

  const brand = await getBrandSettings();
  const { data: city } = await client
    .from("cities")
    .select("name")
    .eq("id", business.city_id)
    .single();
  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("status, business_id")
    .eq("city_id", business.city_id)
    .eq("vertical_id", business.vertical_id)
    .maybeSingle();

  const cityExclusivityAvailable =
    !exclusivity ||
    exclusivity.status === "AVAILABLE" ||
    (exclusivity.status === "PRIMARY_CANDIDATE" &&
      exclusivity.business_id === business.id);

  const meta = (message.personalization_metadata ?? {}) as {
    slots?: { primary_keyword?: string };
  };

  const { validateOutreachCopy } = await import("@/services/outreach/copyValidation");
  const validation = validateOutreachCopy({
    stage: "approve",
    subject: message.subject,
    body_text: message.body_text ?? message.body,
    business_name: business.studio_name,
    city: (city?.name as string) ?? "",
    preview_url: message.preview_url ?? "",
    primary_keyword: meta.slots?.primary_keyword ?? business.primary_seo_keyword,
    city_exclusivity_available: cityExclusivityAvailable,
    brand,
  });

  if (!validation.ok) {
    await client
      .from("outreach_messages")
      .update({
        status: "REVIEW_REQUIRED",
        updated_at: new Date().toISOString(),
        metadata: {
          ...((message.metadata as Record<string, unknown>) ?? {}),
          validation_errors: validation.errors,
          validation_warnings: validation.warnings,
        },
      })
      .eq("id", messageId);
    throw new Error(`Approve geblokkeerd: ${validation.errors.join(", ")}`);
  }

  const now = new Date().toISOString();
  const { data, error } = await client
    .from("outreach_messages")
    .update({
      status: "APPROVED",
      approved_at: now,
      updated_at: now,
      metadata: {
        ...((message.metadata as Record<string, unknown>) ?? {}),
        validation_warnings: validation.warnings,
      },
    })
    .eq("id", messageId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Approve mislukt");

  await writeActivity(client, {
    business_id: message.business_id,
    activity_type: "OUTREACH_APPROVED",
    title: "Outreach goedgekeurd",
    description: message.subject,
    metadata: { message_id: messageId, warnings: validation.warnings },
  });

  return data as OutreachMessage;
}

export async function updateOutreachMessageContent(input: {
  messageId: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
}): Promise<OutreachMessage> {
  const client = createAdminClient();
  const { message } = await loadMessage(input.messageId);
  if (["SENT", "SENDING", "DELIVERED", "OPENED", "CLICKED", "REPLIED"].includes(message.status)) {
    throw new Error("Verzonden mail kan niet meer worden bewerkt");
  }

  const brand = await getBrandSettings();
  const bodyHtml =
    input.bodyHtml ??
    renderOutreachHtml({
      bodyText: input.bodyText,
      previewUrl: message.preview_url ?? "",
      brand,
    });

  const { data, error } = await client
    .from("outreach_messages")
    .update({
      subject: input.subject,
      body: input.bodyText,
      body_text: input.bodyText,
      body_html: bodyHtml,
      status: "REVIEW_REQUIRED",
      generation_method: "MANUAL_EDIT",
      updated_at: new Date().toISOString(),
      metadata: {
        ...((message.metadata as Record<string, unknown>) ?? {}),
        manually_edited: true,
      },
      personalization_metadata: {
        ...((message.personalization_metadata as Record<string, unknown>) ?? {}),
        method: "MANUAL_EDIT",
      },
    })
    .eq("id", input.messageId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Update mislukt");

  await writeActivity(client, {
    business_id: message.business_id,
    activity_type: "OUTREACH_EDITED",
    title: "Outreach bewerkt",
    metadata: { message_id: input.messageId },
  });

  return data as OutreachMessage;
}

/**
 * Safe test send: only to OUTREACH_TEST_EMAIL.
 * Does NOT mark outreach SENT, does NOT contact prospect, does NOT change business status.
 */
export async function sendTestOutreachEmail(messageId: string): Promise<{
  ok: boolean;
  providerMessageId?: string;
  absolutePreviewUrl?: string;
  recipientMasked?: string;
}> {
  if (!isEmailProviderReady()) {
    throw new Error("Resend niet geconfigureerd (RESEND_API_KEY / RESEND_FROM_EMAIL)");
  }
  const testTo = process.env.OUTREACH_TEST_EMAIL?.trim().toLowerCase();
  if (!testTo) throw new Error("OUTREACH_TEST_EMAIL ontbreekt");

  const client = createAdminClient();
  const { message, business } = await loadMessage(messageId);
  const brand = await getBrandSettings();
  const recipientMasked = maskEmail(testTo);
  const meta = ((message.metadata as Record<string, unknown>) ?? {}) as Record<
    string,
    unknown
  >;

  // Idempotency / double-click lock (does not change outreach status)
  const lockedAt = meta.test_send_locked_at
    ? new Date(String(meta.test_send_locked_at)).getTime()
    : 0;
  if (lockedAt && Date.now() - lockedAt < TEST_SEND_LOCK_MS) {
    throw new Error("Test send al bezig. Wacht even en probeer opnieuw.");
  }

  const lock = randomUUID();
  const lockNow = new Date().toISOString();
  await client
    .from("outreach_messages")
    .update({
      metadata: {
        ...meta,
        test_send_lock: lock,
        test_send_locked_at: lockNow,
      },
      updated_at: lockNow,
    })
    .eq("id", messageId);

  await writeActivity(client, {
    business_id: business.id,
    activity_type: "TEST_EMAIL_SEND_STARTED",
    title: "Testmail verzending gestart",
    metadata: {
      outreach_message_id: messageId,
      recipient_masked: recipientMasked,
      timestamp: lockNow,
    },
  });

  try {
    const absolutePreviewUrl = buildAbsolutePreviewUrl({
      previewUrl: message.preview_url,
      brand,
    });

    const bodyText = rewriteBodyWithAbsolutePreview(
      message.body_text ?? message.body,
      message.preview_url,
      absolutePreviewUrl
    );

    const { data: city } = await client
      .from("cities")
      .select("name")
      .eq("id", business.city_id)
      .single();
    const { data: exclusivity } = await client
      .from("city_exclusivity")
      .select("status, business_id")
      .eq("city_id", business.city_id)
      .eq("vertical_id", business.vertical_id)
      .maybeSingle();
    const cityExclusivityAvailable =
      !exclusivity ||
      exclusivity.status === "AVAILABLE" ||
      (exclusivity.status === "PRIMARY_CANDIDATE" &&
        exclusivity.business_id === business.id);
    const pmeta = (message.personalization_metadata ?? {}) as {
      slots?: { primary_keyword?: string };
    };

    const { validateOutreachCopy } = await import("@/services/outreach/copyValidation");
    const validation = validateOutreachCopy({
      stage: "test",
      subject: message.subject,
      body_text: bodyText,
      business_name: business.studio_name,
      city: (city?.name as string) ?? "",
      preview_url: absolutePreviewUrl,
      primary_keyword: pmeta.slots?.primary_keyword ?? business.primary_seo_keyword,
      city_exclusivity_available: cityExclusivityAvailable,
      brand,
    });
    if (!validation.ok) {
      throw new Error(`Test send geblokkeerd: ${validation.errors.join(", ")}`);
    }

    const bodyHtml = renderOutreachHtml({
      bodyText,
      previewUrl: absolutePreviewUrl,
      brand,
    });

    const provider = getEmailProvider();
    const result = await provider.send({
      to: testTo,
      subject: `[TEST] ${message.subject}`,
      html: bodyHtml,
      text: bodyText,
      fromName: brand.sender_brand_name || "Meneer Marketing",
      tags: {
        type: "test",
        outreach_message_id: messageId,
        business_id: business.id,
      },
      metadata: { is_test: "true" },
    });

    const sentAt = new Date().toISOString();
    // Persist test metadata only — never flip outreach/business status
    await client
      .from("outreach_messages")
      .update({
        metadata: {
          ...meta,
          test_send_lock: lock,
          test_send_locked_at: lockNow,
          last_test_sent_at: sentAt,
          last_test_provider_message_id: result.providerMessageId,
          last_test_recipient_masked: recipientMasked,
          last_test_preview_url: absolutePreviewUrl,
          last_test_subject: `[TEST] ${message.subject}`,
        },
        updated_at: sentAt,
      })
      .eq("id", messageId);

    await client.from("email_events").insert({
      outreach_message_id: messageId,
      event_type: "test.sent",
      provider: provider.name,
      provider_event_id: `test_${result.providerMessageId}`,
      payload: {
        to_masked: recipientMasked,
        accepted: result.accepted,
        is_test: true,
        subject: `[TEST] ${message.subject}`,
        preview_url: absolutePreviewUrl,
      },
      occurred_at: sentAt,
    });

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "TEST_EMAIL_SENT",
      title: `Testmail verzonden · ${recipientMasked}`,
      description: `[TEST] ${message.subject}`,
      metadata: {
        outreach_message_id: messageId,
        provider_message_id: result.providerMessageId,
        recipient_masked: recipientMasked,
        preview_url: absolutePreviewUrl,
        timestamp: sentAt,
        is_test: true,
      },
    });

    return {
      ok: result.accepted,
      providerMessageId: result.providerMessageId,
      absolutePreviewUrl,
      recipientMasked,
    };
  } catch (err) {
    const failedAt = new Date().toISOString();
    const errorMessage = err instanceof Error ? err.message : String(err);
    await client
      .from("outreach_messages")
      .update({
        metadata: {
          ...meta,
          test_send_lock: null,
          test_send_locked_at: null,
          last_test_error: errorMessage,
          last_test_failed_at: failedAt,
        },
        updated_at: failedAt,
      })
      .eq("id", messageId);

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "TEST_EMAIL_FAILED",
      title: `Testmail mislukt · ${recipientMasked}`,
      description: errorMessage,
      metadata: {
        outreach_message_id: messageId,
        recipient_masked: recipientMasked,
        timestamp: failedAt,
        error: errorMessage,
      },
    });
    throw err;
  }
}

export async function sendOutreachEmail(messageId: string): Promise<{
  ok: boolean;
  providerMessageId?: string;
}> {
  if (!isRealSendEnabled()) {
    throw new Error(
      "Echte outreach send geblokkeerd: OUTREACH_REAL_SEND_ENABLED is niet true. Alleen testmail is toegestaan."
    );
  }

  if (!isEmailProviderReady()) {
    throw new Error("E-mailprovider niet geconfigureerd. Verzenden disabled.");
  }

  const client = createAdminClient();
  const { message, business, toEmail } = await loadMessage(messageId);

  if (message.status !== "APPROVED") {
    throw new Error("Alleen APPROVED mails mogen verzonden worden");
  }
  if (message.is_test) throw new Error("Testberichten mogen niet als echte send");

  // Hard safety: never send real mail to the configured test inbox as "real"
  const testTo = process.env.OUTREACH_TEST_EMAIL?.trim().toLowerCase();
  if (testTo && toEmail === testTo) {
    throw new Error("Real send geweigerd: ontvanger is OUTREACH_TEST_EMAIL");
  }

  const qualification = await qualifyForOutreachDraft(business);
  if (!qualification.ok) {
    throw new Error(`Send geblokkeerd: ${qualification.reasons.join(", ")}`);
  }

  if (await isEmailSuppressed(toEmail)) {
    await client
      .from("outreach_messages")
      .update({ status: "SUPPRESSED", updated_at: new Date().toISOString() })
      .eq("id", messageId);
    await writeActivity(client, {
      business_id: business.id,
      activity_type: "EMAIL_SUPPRESSED",
      title: `Suppressed · ${toEmail}`,
      metadata: { message_id: messageId },
    });
    throw new Error("E-mailadres staat op suppression lijst");
  }

  const brand = await getBrandSettings();
  if (!message.preview_url) {
    throw new Error("Preview URL ontbreekt");
  }

  const absolutePreviewUrl = buildAbsolutePreviewUrl({
    previewUrl: message.preview_url,
    brand,
  });
  const bodyText = rewriteBodyWithAbsolutePreview(
    message.body_text ?? message.body,
    message.preview_url,
    absolutePreviewUrl
  );

  const { validateOutreachCopy } = await import("@/services/outreach/copyValidation");
  const { data: city } = await client
    .from("cities")
    .select("name")
    .eq("id", business.city_id)
    .single();
  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("status, business_id")
    .eq("city_id", business.city_id)
    .eq("vertical_id", business.vertical_id)
    .maybeSingle();
  const cityExclusivityAvailable =
    !exclusivity ||
    exclusivity.status === "AVAILABLE" ||
    (exclusivity.status === "PRIMARY_CANDIDATE" &&
      exclusivity.business_id === business.id);
  const pmeta = (message.personalization_metadata ?? {}) as {
    slots?: { primary_keyword?: string };
  };

  const sendValidation = validateOutreachCopy({
    stage: "send",
    subject: message.subject,
    body_text: bodyText,
    business_name: business.studio_name,
    city: (city?.name as string) ?? "",
    preview_url: absolutePreviewUrl,
    primary_keyword: pmeta.slots?.primary_keyword ?? business.primary_seo_keyword,
    city_exclusivity_available: cityExclusivityAvailable,
    brand,
  });
  if (!sendValidation.ok) {
    throw new Error(`Send geblokkeerd: ${sendValidation.errors.join(", ")}`);
  }

  const bodyHtml = renderOutreachHtml({
    bodyText,
    previewUrl: absolutePreviewUrl,
    brand,
  });

  // Idempotency lock
  const lock = randomUUID();
  const { data: locked, error: lockError } = await client
    .from("outreach_messages")
    .update({
      status: "SENDING",
      send_lock_token: lock,
      send_locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preview_url: absolutePreviewUrl,
      body_text: bodyText,
      body: bodyText,
      body_html: bodyHtml,
    })
    .eq("id", messageId)
    .eq("status", "APPROVED")
    .select("*")
    .maybeSingle();

  if (lockError || !locked) {
    throw new Error("Send lock mislukt (mogelijk al verzonden of in progress)");
  }

  await writeActivity(client, {
    business_id: business.id,
    activity_type: "EMAIL_SEND_STARTED",
    title: "E-mail verzending gestart",
    metadata: { message_id: messageId, to: toEmail },
  });

  try {
    const provider = getEmailProvider();
    const result = await provider.send({
      to: toEmail,
      subject: message.subject,
      html: bodyHtml,
      text: bodyText,
      fromName: brand.sender_brand_name || "Meneer Marketing",
      tags: {
        outreach_message_id: messageId,
        business_id: business.id,
      },
    });

    const now = new Date().toISOString();
    await client
      .from("outreach_messages")
      .update({
        status: "SENT",
        provider: provider.name,
        provider_message_id: result.providerMessageId,
        sent_at: now,
        updated_at: now,
        send_lock_token: lock,
      })
      .eq("id", messageId)
      .eq("send_lock_token", lock);

    await client.from("email_events").insert({
      outreach_message_id: messageId,
      event_type: "email.sent",
      provider: provider.name,
      provider_event_id: result.providerMessageId,
      payload: { to: toEmail },
      occurred_at: now,
    });

    await client
      .from("businesses")
      .update({ lead_status: "CONTACTED", last_activity_at: now })
      .eq("id", business.id);

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "EMAIL_SENT",
      title: `E-mail verzonden · ${toEmail}`,
      description: message.subject,
      metadata: { message_id: messageId, provider_message_id: result.providerMessageId },
    });

    return { ok: true, providerMessageId: result.providerMessageId };
  } catch (err) {
    await client
      .from("outreach_messages")
      .update({
        status: "FAILED",
        updated_at: new Date().toISOString(),
        metadata: {
          ...((message.metadata as Record<string, unknown>) ?? {}),
          send_error: err instanceof Error ? err.message : String(err),
        },
      })
      .eq("id", messageId)
      .eq("send_lock_token", lock);
    throw err;
  }
}

export { addSuppression };
