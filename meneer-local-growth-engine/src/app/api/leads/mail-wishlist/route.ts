import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { toggleBusinessMailWishlist } from "@/services/city-outreach/cityOutreachService";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  selected: z.boolean(),
  verticalId: z.string().uuid().optional(),
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

    const result = await toggleBusinessMailWishlist(parsed.data);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error, capacity: result.capacity },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, capacity: result.capacity });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Mail-lijst mislukt" },
      { status: 500 }
    );
  }
}
