import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  BULK_LEAD_ACTION_MAX,
  runBulkLeadAction,
} from "@/services/leads/bulkLeadActionsService";

const bodySchema = z.object({
  action: z.enum(["generate_previews", "add_wishlist", "dismiss"]),
  businessIds: z.array(z.string().uuid()).min(1).max(BULK_LEAD_ACTION_MAX),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: `Selecteer 1–${BULK_LEAD_ACTION_MAX} leads` },
        { status: 400 },
      );
    }

    const result = await runBulkLeadAction(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Bulk actie mislukt" },
      { status: 500 },
    );
  }
}
