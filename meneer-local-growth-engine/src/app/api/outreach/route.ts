import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { generateOutreachDraft } from "@/services/outreach/outreachGenerator";
import {
  approveOutreachMessage,
  sendOutreachEmail,
  sendTestOutreachEmail,
  updateOutreachMessageContent,
} from "@/services/outreach/sendService";

const bodySchema = z.object({
  action: z.enum(["generate", "regenerate", "approve", "edit", "send_test", "send"]),
  businessId: z.string().uuid().optional(),
  messageId: z.string().uuid().optional(),
  subject: z.string().optional(),
  bodyText: z.string().optional(),
  bodyHtml: z.string().optional(),
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

    if (data.action === "generate" || data.action === "regenerate") {
      if (!data.businessId) {
        return NextResponse.json({ ok: false, error: "businessId verplicht" }, { status: 400 });
      }
      const result = await generateOutreachDraft({
        businessId: data.businessId,
        regenerate: data.action === "regenerate",
      });
      return NextResponse.json({
        ok: true,
        message: result.message,
        contact_source: result.contact_source,
        cost: result.generated.anthropic_cost_usd,
        used_claude: result.generated.used_claude,
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
          { status: 400 }
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
      return NextResponse.json({
        ok: true,
        providerMessageId: result.providerMessageId,
        accepted: result.ok,
      });
    }

    if (data.action === "send") {
      if (!data.messageId) {
        return NextResponse.json({ ok: false, error: "messageId verplicht" }, { status: 400 });
      }
      const result = await sendOutreachEmail(data.messageId);
      return NextResponse.json({
        ok: true,
        providerMessageId: result.providerMessageId,
        accepted: result.ok,
      });
    }

    return NextResponse.json({ ok: false, error: "Onbekende actie" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Outreach actie mislukt" },
      { status: 500 }
    );
  }
}
