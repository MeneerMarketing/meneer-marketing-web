import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  generateFollowupBatch,
  generateFollowupDraft,
  toggleBusinessFollowupList,
} from "@/services/followup/followupGenerator";
import {
  approveOutreachMessage,
  cancelScheduledOutreach,
  scheduleOutreachEmail,
  sendOutreachEmail,
  sendTestOutreachEmail,
  updateOutreachMessageContent,
} from "@/services/outreach/sendService";

const bodySchema = z.object({
  action: z.enum([
    "toggle_list",
    "generate",
    "generate_batch",
    "regenerate",
    "approve",
    "edit",
    "send_test",
    "send",
    "schedule",
    "cancel_schedule",
  ]),
  businessId: z.string().uuid().optional(),
  businessIds: z.array(z.string().uuid()).optional(),
  messageId: z.string().uuid().optional(),
  selected: z.boolean().optional(),
  template: z.enum(["check_in", "last_ping", "custom"]).optional(),
  subject: z.string().optional(),
  bodyText: z.string().optional(),
  bodyHtml: z.string().optional(),
  scheduledAt: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    const data = parsed.data;

    if (data.action === "toggle_list") {
      if (!data.businessId || data.selected === undefined) {
        return NextResponse.json(
          { ok: false, error: "businessId en selected verplicht" },
          { status: 400 },
        );
      }
      const result = await toggleBusinessFollowupList({
        businessId: data.businessId,
        selected: data.selected,
      });
      if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    if (data.action === "generate" || data.action === "regenerate") {
      if (!data.businessId) {
        return NextResponse.json({ ok: false, error: "businessId verplicht" }, { status: 400 });
      }
      const result = await generateFollowupDraft({
        businessId: data.businessId,
        template: data.template ?? "check_in",
        regenerate: data.action === "regenerate",
      });
      return NextResponse.json({
        ok: true,
        message: result.message,
        warnings: result.warnings,
      });
    }

    if (data.action === "generate_batch") {
      if (!data.businessIds?.length) {
        return NextResponse.json(
          { ok: false, error: "businessIds verplicht" },
          { status: 400 },
        );
      }
      const result = await generateFollowupBatch({
        businessIds: data.businessIds,
        template: data.template ?? "check_in",
      });
      return NextResponse.json({
        ok: true,
        generated: result.generated,
        failed: result.failed,
        messages: result.messages,
      });
    }

    if (data.action === "approve") {
      if (!data.messageId) {
        return NextResponse.json({ ok: false, error: "messageId verplicht" }, { status: 400 });
      }
      const message = await approveOutreachMessage(data.messageId);
      return NextResponse.json({ ok: true, message });
    }

    if (data.action === "edit") {
      if (!data.messageId || !data.subject || !data.bodyText) {
        return NextResponse.json(
          { ok: false, error: "messageId, subject en bodyText verplicht" },
          { status: 400 },
        );
      }
      const message = await updateOutreachMessageContent({
        messageId: data.messageId,
        subject: data.subject,
        bodyText: data.bodyText,
        bodyHtml: data.bodyHtml,
      });
      return NextResponse.json({ ok: true, message });
    }

    if (data.action === "send_test") {
      if (!data.messageId) {
        return NextResponse.json({ ok: false, error: "messageId verplicht" }, { status: 400 });
      }
      const result = await sendTestOutreachEmail(data.messageId);
      const { ok, ...rest } = result;
      return NextResponse.json({ ok, ...rest });
    }

    if (data.action === "send") {
      if (!data.messageId) {
        return NextResponse.json({ ok: false, error: "messageId verplicht" }, { status: 400 });
      }
      const sendResult = await sendOutreachEmail(data.messageId);
      const { ok: sendOk, ...sendRest } = sendResult;
      return NextResponse.json({ ok: sendOk, ...sendRest });
    }

    if (data.action === "schedule") {
      if (!data.messageId || !data.scheduledAt) {
        return NextResponse.json(
          { ok: false, error: "messageId en scheduledAt verplicht" },
          { status: 400 },
        );
      }
      const message = await scheduleOutreachEmail(data.messageId, data.scheduledAt);
      return NextResponse.json({ ok: true, message });
    }

    if (data.action === "cancel_schedule") {
      if (!data.messageId) {
        return NextResponse.json({ ok: false, error: "messageId verplicht" }, { status: 400 });
      }
      const message = await cancelScheduledOutreach(data.messageId);
      return NextResponse.json({ ok: true, message });
    }

    return NextResponse.json({ ok: false, error: "Onbekende actie" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Follow-up actie mislukt" },
      { status: 500 },
    );
  }
}
