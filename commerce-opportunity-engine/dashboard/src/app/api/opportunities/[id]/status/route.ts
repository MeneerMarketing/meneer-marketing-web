import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { logActivity } from "@/lib/operator";
import { OPERATOR_WORKFLOW_STATUSES, type OpportunityStatus } from "@/lib/types";

const ALLOWED = new Set<string>(OPERATOR_WORKFLOW_STATUSES);

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: string };
    const status = body.status as OpportunityStatus | undefined;

    if (!status || !ALLOWED.has(status)) {
      return NextResponse.json(
        {
          error:
            "Ongeldige status. Gebruik een geldige workflow status (DISCOVERED, QUALIFIED, AUDITED, SHORTLISTED, …).",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data: opp, error: loadError } = await supabase
      .from("opportunities")
      .select("brand_id, is_shortlisted")
      .eq("id", id)
      .maybeSingle();

    if (loadError) throw new Error(loadError.message);
    if (!opp) {
      return NextResponse.json({ error: "Opportunity niet gevonden" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const update: Record<string, unknown> = {
      status,
      operator_status: status,
      status_updated_at: now,
      updated_at: now,
    };

    if (status === "SHORTLISTED") {
      update.is_shortlisted = true;
      update.shortlisted_at = now;
    } else if (opp.is_shortlisted) {
      update.is_shortlisted = false;
      update.shortlisted_at = null;
    }

    const { error } = await supabase.from("opportunities").update(update).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logActivity(supabase, {
      brandId: opp.brand_id,
      opportunityId: id,
      eventType: "STATUS_CHANGE",
      title: `Status → ${status}`,
      detail: status,
    });

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
