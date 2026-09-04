import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { evaluateAcquisitionFit } from "@/services/acquisition-fit/evaluateAcquisitionFit";
import { rankCityTransformation } from "@/services/acquisition-fit/rankTransformation";
import {
  estimateVisualAnalysisCost,
  recommendVisualCandidates,
} from "@/services/acquisition-fit/recommendVisualCandidates";
import { pilatesAcquisitionFitConfig } from "@/verticals/pilates";

const getSchema = z.object({
  cityId: z.string().uuid(),
  verticalSlug: z.string().default("pilates"),
});

const postSchema = z.object({
  cityId: z.string().uuid(),
  verticalSlug: z.string().default("pilates"),
  businessIds: z.array(z.string().uuid()).optional(),
  preset: z.enum(["top3", "top5", "manual"]).optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = getSchema.safeParse({
      cityId: url.searchParams.get("cityId"),
      verticalSlug: url.searchParams.get("verticalSlug") ?? "pilates",
    });
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "cityId verplicht" }, { status: 400 });
    }

    const client = createAdminClient();
    const { data: vertical } = await client
      .from("verticals")
      .select("id")
      .eq("slug", parsed.data.verticalSlug)
      .maybeSingle();
    if (!vertical?.id) {
      return NextResponse.json({ ok: false, error: "Vertical niet gevonden" }, { status: 404 });
    }

    const candidates = await recommendVisualCandidates({
      cityId: parsed.data.cityId,
      verticalId: String(vertical.id),
      limit: pilatesAcquisitionFitConfig.visualJudge.maxCandidatesPerCity,
    });

    return NextResponse.json({
      ok: true,
      candidates,
      estimatedCostTop3: estimateVisualAnalysisCost(3),
      estimatedCostTop5: estimateVisualAnalysisCost(5),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Kandidaten ophalen mislukt",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SECRET_KEY ontbreekt" },
        { status: 500 }
      );
    }

    const json = await request.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = createAdminClient();
    const { data: vertical } = await client
      .from("verticals")
      .select("id")
      .eq("slug", parsed.data.verticalSlug)
      .maybeSingle();
    if (!vertical?.id) {
      return NextResponse.json({ ok: false, error: "Vertical niet gevonden" }, { status: 404 });
    }

    const { data: city } = await client
      .from("cities")
      .select("id, slug")
      .eq("id", parsed.data.cityId)
      .maybeSingle();
    if (!city?.id) {
      return NextResponse.json({ ok: false, error: "Stad niet gevonden" }, { status: 404 });
    }

    let businessIds = parsed.data.businessIds ?? [];
    if (!businessIds.length) {
      const recommended = await recommendVisualCandidates({
        cityId: parsed.data.cityId,
        verticalId: String(vertical.id),
        limit: pilatesAcquisitionFitConfig.visualJudge.maxCandidatesPerCity,
      });
      const count =
        parsed.data.preset === "top3" ? 3 : parsed.data.preset === "top5" ? 5 : 5;
      businessIds = recommended
        .filter((row) => row.recommended && !row.already_judged)
        .slice(0, count)
        .map((row) => row.business_id);
    }

    if (!businessIds.length) {
      return NextResponse.json(
        { ok: false, error: "Geen kandidaten geselecteerd voor visual analysis" },
        { status: 400 }
      );
    }

    const budget = pilatesAcquisitionFitConfig.visualJudge.maxCostPerRun;
    let spent = 0;
    const results = [];

    for (const businessId of businessIds) {
      if (spent >= budget) break;
      const result = await evaluateAcquisitionFit(businessId, {
        deterministicOnly: false,
        useCache: true,
        costBudgetRemaining: budget - spent,
      });
      spent += result.anthropic_cost ?? 0;
      results.push(result);
    }

    const ranking = await rankCityTransformation({
      cityId: String(city.id),
      verticalSlug: parsed.data.verticalSlug,
      selectPrimary: true,
    });

    return NextResponse.json({
      ok: true,
      analyzed: results.length,
      anthropicCost: spent,
      ranking,
      winner: ranking.primary_candidate_id
        ? {
            businessId: ranking.primary_candidate_id,
            name: ranking.primary_candidate_name,
            confidence: ranking.winner_confidence,
            reason: ranking.selection_reason,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Visual analysis mislukt",
      },
      { status: 500 }
    );
  }
}
