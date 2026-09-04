import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import {
  excludeBrand,
  setDoNotContact,
  setShortlist,
} from "@/lib/operatorActions";
import { EXCLUSION_REASONS, logActivity, type ExclusionReason } from "@/lib/operator";

type BulkEntity = "brands" | "opportunities";
type BulkAction = "exclude" | "reject" | "shortlist" | "dnc" | "reviewed" | "tag";

const EXCLUSION_SET = new Set<string>(EXCLUSION_REASONS);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      entity?: BulkEntity;
      ids?: string[];
      action?: BulkAction;
      reason?: string;
      note?: string;
      tagId?: string;
    };

    if (body.entity !== "brands" && body.entity !== "opportunities") {
      return NextResponse.json({ error: "entity moet brands of opportunities zijn." }, { status: 400 });
    }

    const ids = body.ids?.filter(Boolean) ?? [];
    if (ids.length === 0) {
      return NextResponse.json({ error: "ids mag niet leeg zijn." }, { status: 400 });
    }

    const action = body.action;
    const validActions: BulkAction[] = [
      "exclude",
      "reject",
      "shortlist",
      "dnc",
      "reviewed",
      "tag",
    ];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json({ error: "Ongeldige bulk actie." }, { status: 400 });
    }

    if (action === "tag" && !body.tagId) {
      return NextResponse.json({ error: "tagId is verplicht voor tag actie." }, { status: 400 });
    }

    if (action === "exclude") {
      const reason = body.reason ?? "OTHER";
      if (!EXCLUSION_SET.has(reason)) {
        return NextResponse.json({ error: "Ongeldige uitsluitingsreden." }, { status: 400 });
      }
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();
    const results: Array<{ id: string; ok: boolean; error?: string }> = [];

    for (const id of ids) {
      try {
        if (body.entity === "brands") {
          await applyBrandBulkAction(supabase, id, action, {
            reason: body.reason as ExclusionReason | undefined,
            note: body.note,
            tagId: body.tagId,
            now,
          });
        } else {
          await applyOpportunityBulkAction(supabase, id, action, {
            reason: body.reason as ExclusionReason | undefined,
            note: body.note,
            tagId: body.tagId,
            now,
          });
        }
        results.push({ id, ok: true });
      } catch (err) {
        results.push({
          id,
          ok: false,
          error: err instanceof Error ? err.message : "Bulk item failed",
        });
      }
    }

    const succeeded = results.filter((r) => r.ok).length;
    const failed = results.length - succeeded;

    await logActivity(supabase, {
      eventType: "BULK_ACTION",
      title: `Bulk ${action} op ${body.entity}`,
      detail: `${succeeded} gelukt, ${failed} mislukt`,
      metadata: { entity: body.entity, action, ids, results },
    });

    return NextResponse.json({
      ok: failed === 0,
      processed: results.length,
      succeeded,
      failed,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bulk action failed" },
      { status: 500 }
    );
  }
}

async function applyBrandBulkAction(
  supabase: ReturnType<typeof getSupabase>,
  brandId: string,
  action: BulkAction,
  opts: { reason?: ExclusionReason; note?: string; tagId?: string; now: string }
): Promise<void> {
  switch (action) {
    case "exclude":
      await excludeBrand(supabase, brandId, opts.reason ?? "OTHER", opts.note?.trim() || null);
      return;
    case "dnc":
      await setDoNotContact(supabase, brandId, true, opts.note?.trim() || null);
      return;
    case "reviewed": {
      const { error } = await supabase
        .from("brands")
        .update({
          operator_status: "REVIEWED",
          updated_at: opts.now,
        })
        .eq("id", brandId);
      if (error) throw new Error(error.message);
      return;
    }
    case "tag": {
      const { error } = await supabase.from("operator_brand_tags").upsert({
        tag_id: opts.tagId!,
        brand_id: brandId,
      });
      if (error) throw new Error(error.message);
      return;
    }
    case "reject":
    case "shortlist":
      throw new Error(`${action} is alleen beschikbaar voor opportunities.`);
    default:
      throw new Error("Onbekende actie.");
  }
}

async function applyOpportunityBulkAction(
  supabase: ReturnType<typeof getSupabase>,
  opportunityId: string,
  action: BulkAction,
  opts: { reason?: ExclusionReason; note?: string; tagId?: string; now: string }
): Promise<void> {
  const { data: opp, error: loadError } = await supabase
    .from("opportunities")
    .select("brand_id")
    .eq("id", opportunityId)
    .maybeSingle();

  if (loadError) throw new Error(loadError.message);
  if (!opp) throw new Error("Opportunity niet gevonden");

  switch (action) {
    case "reject": {
      const { error } = await supabase
        .from("opportunities")
        .update({
          status: "REJECTED",
          operator_status: "REJECTED",
          status_updated_at: opts.now,
          updated_at: opts.now,
        })
        .eq("id", opportunityId);
      if (error) throw new Error(error.message);
      return;
    }
    case "shortlist":
      await setShortlist(supabase, opportunityId, opp.brand_id, true);
      return;
    case "exclude": {
      const { error } = await supabase
        .from("opportunities")
        .update({
          status: "EXCLUDED",
          operator_status: "EXCLUDED",
          status_updated_at: opts.now,
          updated_at: opts.now,
        })
        .eq("id", opportunityId);
      if (error) throw new Error(error.message);
      return;
    }
    case "reviewed": {
      const { error } = await supabase
        .from("opportunities")
        .update({
          status: "REVIEWED",
          operator_status: "REVIEWED",
          status_updated_at: opts.now,
          updated_at: opts.now,
        })
        .eq("id", opportunityId);
      if (error) throw new Error(error.message);
      return;
    }
    case "tag": {
      const { error } = await supabase.from("operator_opportunity_tags").upsert({
        tag_id: opts.tagId!,
        opportunity_id: opportunityId,
      });
      if (error) throw new Error(error.message);
      return;
    }
    case "dnc":
      await setDoNotContact(supabase, opp.brand_id, true, opts.note?.trim() || null);
      return;
    default:
      throw new Error("Onbekende actie.");
  }
}
