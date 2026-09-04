import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      action: string;
      product_title?: string;
      template_family?: string;
      note?: string;
    };

    const supabase = getAdmin();
    const { data: candidate, error } = await supabase
      .from("coe_concept_candidates")
      .select("id, brand_id, status, hero_candidates")
      .eq("id", id)
      .single();
    if (error || !candidate) {
      return NextResponse.json(
        { ok: false, error: error?.message ?? "Not found" },
        { status: 404 }
      );
    }

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    let eventType = body.action.toUpperCase();

    switch (body.action) {
      case "approve":
        patch.status = "CONCEPT_CANDIDATE";
        eventType = "APPROVED_FOR_CONCEPT";
        break;
      case "reject":
        patch.status = "NOT_SUITABLE";
        eventType = "REJECTED";
        break;
      case "needs_assets":
        patch.needs_assets = true;
        eventType = "NEEDS_ASSETS";
        break;
      case "archive":
        patch.status = "ARCHIVED";
        eventType = "ARCHIVED";
        break;
      case "choose_product": {
        if (!body.product_title?.trim()) {
          return NextResponse.json(
            { ok: false, error: "product_title required" },
            { status: 400 }
          );
        }
        const candidates = Array.isArray(candidate.hero_candidates)
          ? candidate.hero_candidates
          : [];
        const match = candidates.find(
          (c: { product_title?: string }) =>
            c.product_title === body.product_title
        ) as
          | {
              product_title: string;
              product_url?: string;
              price?: number;
              currency?: string;
              hero_product_score?: number;
              hero_product_confidence?: number;
              hero_product_reasoning?: string;
              hero_product_evidence?: unknown;
            }
          | undefined;
        patch.manual_product_override = true;
        patch.primary_concept_product_title = body.product_title.trim();
        if (match) {
          patch.primary_concept_product_url = match.product_url ?? null;
          patch.primary_concept_product_price = match.price ?? null;
          patch.primary_concept_product_currency = match.currency ?? null;
          patch.hero_product_score = match.hero_product_score ?? null;
          patch.hero_product_confidence = match.hero_product_confidence ?? 90;
          patch.hero_product_reasoning =
            match.hero_product_reasoning ?? "Manual product override";
          patch.hero_product_evidence = [
            ...(Array.isArray(match.hero_product_evidence)
              ? match.hero_product_evidence
              : []),
            "manual_override",
          ];
        } else {
          patch.hero_product_confidence = 90;
          patch.hero_product_reasoning = "Manual product override";
          patch.hero_product_evidence = ["manual_override"];
        }
        eventType = "PRODUCT_OVERRIDE";
        break;
      }
      case "choose_template_family":
        if (!body.template_family) {
          return NextResponse.json(
            { ok: false, error: "template_family required" },
            { status: 400 }
          );
        }
        patch.manual_template_family = body.template_family;
        patch.suggested_template_family = body.template_family;
        eventType = "TEMPLATE_FAMILY_SET";
        break;
      case "add_note":
        patch.operator_note = body.note ?? "";
        eventType = "NOTE_ADDED";
        break;
      default:
        return NextResponse.json(
          { ok: false, error: `Unknown action: ${body.action}` },
          { status: 400 }
        );
    }

    const { error: updErr } = await supabase
      .from("coe_concept_candidates")
      .update(patch)
      .eq("id", id);
    if (updErr) {
      return NextResponse.json(
        { ok: false, error: updErr.message },
        { status: 500 }
      );
    }

    await supabase.from("coe_concept_events").insert({
      concept_candidate_id: id,
      brand_id: candidate.brand_id,
      event_type: eventType,
      payload: body,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error" },
      { status: 500 }
    );
  }
}
