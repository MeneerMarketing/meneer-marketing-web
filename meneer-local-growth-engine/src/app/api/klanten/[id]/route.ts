import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { updateInboundCustomer } from "@/services/inbound/customerDetailService";

const patchSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
  internalNotes: z.string().max(8000).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const { id } = await context.params;
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    const result = await updateInboundCustomer({
      submissionId: id,
      status: parsed.data.status,
      internalNotes: parsed.data.internalNotes,
    });

    if (!result.ok) {
      const status = result.error === "not_found" ? 404 : 400;
      return NextResponse.json({ ok: false, error: result.error }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Update mislukt",
      },
      { status: 500 },
    );
  }
}
