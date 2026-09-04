import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { buildOutreachMailPreview } from "@/services/outreach/outreachPreviewService";

const bodySchema = z.object({
  messageId: z.string().uuid(),
  subject: z.string().optional(),
  bodyText: z.string().optional(),
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

    const preview = await buildOutreachMailPreview(parsed.data);
    return NextResponse.json({ ok: true, preview });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Preview mislukt" },
      { status: 500 },
    );
  }
}
