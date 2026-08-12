import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { addSuppression } from "@/services/outreach/outreachQualification";
import { verifyResendWebhookSignature } from "@/lib/email/resendWebhook";

type ResendEvent = {
  type?: string;
  data?: {
    email_id?: string;
    to?: string[] | string;
    from?: string;
    subject?: string;
    created_at?: string;
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

  // Idempotent insert
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
  if (providerMessageId) {
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
      } else if (eventType === "email.received") {
        patch.status = "REPLIED";
        patch.replied_at = now;
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

      if (eventType === "email.received") {
        await client.from("outreach_inbound_replies").insert({
          outreach_message_id: messageId,
          business_id: message.business_id,
          contact_id: message.contact_id,
          from_email: body.data?.from ?? null,
          subject: body.data?.subject ?? null,
          body_text: null,
          provider_message_id: providerMessageId,
          raw: body,
        });
        await writeActivity(client, {
          business_id: message.business_id as string,
          activity_type: "EMAIL_REPLIED",
          title: "Inbound reply ontvangen",
          metadata: { message_id: messageId },
        });
        await client
          .from("businesses")
          .update({ lead_status: "REPLIED", last_activity_at: now })
          .eq("id", message.business_id);
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
