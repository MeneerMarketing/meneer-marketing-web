import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { overrideBrandColors } from "@/services/preview/brandColorOverrideService";

const schema = z.object({
  businessId: z.string().uuid(),
  primaryColor: z.string().min(4).max(9),
  accentColor: z.string().min(4).max(9),
  secondaryColor: z.string().min(4).max(9).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    const result = await overrideBrandColors(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Kleuren opslaan mislukt" },
      { status: 500 },
    );
  }
}
