import { NextResponse } from "next/server";
import { verticalWizardProvisionSchema } from "@/lib/verticals/verticalLauncherWizard.shared";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { provisionVerticalFromWizard } from "@/services/verticals/verticalLauncherProvisionService";

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SECRET_KEY ontbreekt" },
        { status: 500 }
      );
    }

    const json = await request.json();
    const parsed = verticalWizardProvisionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await provisionVerticalFromWizard(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provision mislukt";
    const status = message.includes("USE_EXISTING") ? 409 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
