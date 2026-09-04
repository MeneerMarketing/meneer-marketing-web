import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { addSuppression } from "@/services/outreach/outreachQualification";
import { verifyResendWebhookSignature } from "@/lib/email/resendWebhook";
import {
  fetchInboundEmailBody,
  matchInboundReplyToOutreach,
  snippetFromBody,
  type InboundWebhookData,
} from "@/services/inbox/matchInboundReply";

type ResendEvent = {
  type?: string;
  data?: InboundWebhookData & {
    bounce?: { message?: string };
    click?: { link?: string };
  };
};

function mapEventType(type: string): string {
  const map: Record<string, string> = {
    "email.sent": "email.sent",
    "email.delivered": "email.delivered",
    "email.opened": "email.opened",
    "email.clicked": "email.clicked",
    "email.bounced": "email.bounced",
    "email.complained": "email.complained",
    "email.received": "email.received",
  };
  return map[type] ?? type;
}

async function handleInboundReply(
  client: ReturnType<typeof createAdminClient>,
  body: ResendEvent,
  eventType: string,
  providerEventId: string,
): Promise<string | null> {
  const inboundEmailId = body.data?.email_id ?? null;
  if (!inboundEmailId) return null;

  const { data: existing } = await client
    .from("outreach_inbound_replies")
    .select("id")
    .eq("provider_message_id", inboundEmailId)
    .maybeSingle();
  if (existing?.id) return existing.id as string;

  const fetched = inboundEmailId ? await fetchInboundEmailBody(inboundEmailId) : null;
  const message = await matchInboundReplyToOutreach({
    data: body.data ?? {},
    fetchedHeaders: fetched?.headers,
  });

  if (!message) {
    await client.from("email_events").insert({
      outreach_message_id: null,
      event_type: "email.received.unmatched",
      provider: "resend",
      provider_event_id: `${providerEventId}:unmatched`,
      payload: body,
      occurred_at: body.data?.created_at ?? new Date().toISOString(),
    });
    return null;
  }

  const messageId = message.id;
  const now = new Date().toISOString();
  const bodySnippet = snippetFromBody(fetched?.text ?? null, fetched?.html ?? null);

  await client
    .from("email_events")
    .update({ outreach_message_id: messageId })
    .eq("provider", "resend")
    .eq("provider_event_id", providerEventId);

  await client.from("outreach_messages").update({
    status: "REPLIED",
    replied_at: now,
    updated_at: now,
  }).eq("id", messageId);

  const { error: insertError } = await client.from("outreach_inbound_replies").insert({
    outreach_message_id: messageId,
    business_id: message.business_id,
    contact_id: message.contact_id,
    from_email: body.data?.from ?? null,
    subject: body.data?.subject ?? null,
    body_text: bodySnippet,
    provider_message_id: inboundEmailId,
    raw: body,
  });

  if (insertError && !/duplicate|unique/i.test(insertError.message)) {
    throw insertError;
  }

  await writeActivity(client, {
    business_id: message.business_id,
    activity_type: "EMAIL_REPLIED",
    title: "Reactie ontvangen via inbox",
    description: body.data?.subject ?? undefined,
    metadata: { message_id: messageId, from: body.data?.from },
  });

  await client
    .from("businesses")
    .update({ lead_status: "REPLIED", last_activity_at: now })
    .eq("id", message.business_id);

  return messageId;
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyResendWebhookSignature(raw, request.headers)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let body: ResendEvent;
  try {
    body = JSON.parse(raw) as ResendEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const eventType = mapEventType(String(body.type ?? "unknown"));
  const providerMessageId = body.data?.email_id ?? null;
  const providerEventId = `${eventType}:${providerMessageId ?? "none"}:${body.data?.created_at ?? raw.slice(0, 40)}`;

  const client = createAdminClient();

  const { error: insertError } = await client.from("email_events").insert({
    outreach_message_id: null,
    event_type: eventType,
    provider: "resend",
    provider_event_id: providerEventId,
    payload: body,
    occurred_at: body.data?.created_at ?? new Date().toISOString(),
  });

  if (insertError && /duplicate|unique/i.test(insertError.message)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  let messageId: string | null = null;

  if (eventType === "email.received") {
    messageId = await handleInboundReply(client, body, eventType, providerEventId);
  } else if (providerMessageId) {
    const { data: message } = await client
      .from("outreach_messages")
      .select("*")
      .eq("provider_message_id", providerMessageId)
      .maybeSingle();

    if (message) {
      messageId = message.id as string;
      await client
        .from("email_events")
        .update({ outreach_message_id: messageId })
        .eq("provider", "resend")
        .eq("provider_event_id", providerEventId);

      const now = new Date().toISOString();
      const patch: Record<string, unknown> = { updated_at: now };

      if (eventType === "email.delivered") {
        patch.status = "DELIVERED";
        patch.delivered_at = now;
      } else if (eventType === "email.opened") {
        patch.status = "OPENED";
        patch.opened_at = now;
      } else if (eventType === "email.clicked") {
        patch.status = "CLICKED";
        patch.clicked_at = now;
      } else if (eventType === "email.bounced") {
        patch.status = "BOUNCED";
      } else if (eventType === "email.complained") {
        patch.status = "SUPPRESSED";
      }

      if (Object.keys(patch).length > 1) {
        await client.from("outreach_messages").update(patch).eq("id", messageId);
      }

      const toRaw = body.data?.to;
      const toEmail = Array.isArray(toRaw) ? toRaw[0] : toRaw;

      if (eventType === "email.bounced" && toEmail) {
        await addSuppression({
          email: toEmail,
          reason: "hard_bounce",
          businessId: message.business_id as string,
          source: "resend_webhook",
        });
        await writeActivity(client, {
          business_id: message.business_id as string,
          activity_type: "EMAIL_BOUNCED",
          title: `Bounce · ${toEmail}`,
          metadata: { message_id: messageId },
        });
      }

      if (eventType === "email.complained" && toEmail) {
        await addSuppression({
          email: toEmail,
          reason: "complained",
          businessId: message.business_id as string,
          source: "resend_webhook",
        });
        await writeActivity(client, {
          business_id: message.business_id as string,
          activity_type: "EMAIL_COMPLAINED",
          title: `Complaint · ${toEmail}`,
          metadata: { message_id: messageId },
        });
      }

      if (eventType === "email.delivered") {
        await writeActivity(client, {
          business_id: message.business_id as string,
          activity_type: "EMAIL_DELIVERED",
          title: "E-mail delivered",
          metadata: { message_id: messageId },
        });
      }
      if (eventType === "email.opened") {
        await writeActivity(client, {
          business_id: message.business_id as string,
          activity_type: "EMAIL_OPENED",
          title: "Open event (ondersteunend signaal)",
          metadata: { message_id: messageId },
        });
      }
      if (eventType === "email.clicked") {
        await writeActivity(client, {
          business_id: message.business_id as string,
          activity_type: "EMAIL_CLICKED",
          title: "Click event (ondersteunend signaal)",
          metadata: { message_id: messageId },
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    processed: true,
    eventType,
    messageId,
  });
}
