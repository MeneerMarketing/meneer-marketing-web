import { NextResponse } from "next/server";
import { z } from "zod";
import { runPilatesDiscovery } from "@/services/discovery/runPilatesDiscovery";
import { isAdminConfigured } from "@/lib/supabase/admin";

const bodySchema = z.object({
  scope: z.enum(["NL", "VL", "BOTH"]),
  mode: z.enum(["TEST", "FULL"]).default("TEST"),
  citySlugs: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SECRET_KEY ontbreekt" },
        { status: 500 }
      );
    }
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "DataForSEO credentials ontbreken" },
        { status: 500 }
      );
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await runPilatesDiscovery({
      scope: parsed.data.scope,
      mode: parsed.data.mode,
      citySlugs: parsed.data.citySlugs,
      maxCost: Number(process.env.DISCOVERY_MAX_COST_PER_RUN ?? 0.15),
      maxResults: Number(process.env.DISCOVERY_MAX_RESULTS ?? 15),
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Discovery mislukt",
      },
      { status: 500 }
    );
  }
}
