import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { getLeadCompetitionIntel } from "@/services/seo/competitionIntelService";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  refreshMetrics: z.boolean().optional().default(false),
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

    const intel = await getLeadCompetitionIntel({
      businessId: parsed.data.businessId,
      fetchMissingMetrics: parsed.data.refreshMetrics,
    });

    return NextResponse.json({ ok: true, intel });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Concurrentie-intel mislukt",
      },
      { status: 500 },
    );
  }
}
