import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { runCitySeoAnalysis } from "@/services/seo/seoAnalysisRunner";

const bodySchema = z.object({
  citySlug: z.string().min(1),
  verticalSlug: z.string().default("pilates"),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "DataForSEO credentials ontbreken" },
        { status: 500 }
      );
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Ongeldige input" }, { status: 400 });
    }

    const result = await runCitySeoAnalysis(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "SEO analysis mislukt",
      },
      { status: 500 }
    );
  }
}
