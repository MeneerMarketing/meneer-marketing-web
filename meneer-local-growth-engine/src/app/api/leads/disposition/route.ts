import { NextResponse } from "next/server";
import { z } from "zod";
import { applyLeadDisposition } from "@/lib/leads/leadDisposition";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  disposition: z.enum(["reject", "dismiss", "restore"]),
  note: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = createAdminClient();
    const result = await applyLeadDisposition(client, parsed.data);

    return NextResponse.json({ ok: true, leadStatus: result.leadStatus });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Actie mislukt" },
      { status: 500 }
    );
  }
}
