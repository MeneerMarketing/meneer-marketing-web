import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { excludeBrand } from "@/lib/operatorActions";
import { logActivity } from "@/lib/operator";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      forceLeadEligible?: boolean;
      forceExcluded?: boolean;
      reason?: string;
    };

    const reason = body.reason?.trim();
    if (!reason) {
      return NextResponse.json({ error: "reason is verplicht." }, { status: 400 });
    }

    if (body.forceLeadEligible === undefined && body.forceExcluded === undefined) {
      return NextResponse.json(
        { error: "Geef forceLeadEligible en/of forceExcluded op." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();

    const brandUpdate: Record<string, unknown> = {
      manual_override: true,
      manual_override_reason: reason,
      manual_override_at: now,
      updated_at: now,
    };

    if (body.forceLeadEligible !== undefined) {
      brandUpdate.force_lead_eligible = body.forceLeadEligible;
      if (body.forceLeadEligible) {
        brandUpdate.lead_eligible = true;
        brandUpdate.eligibility_status = "LEAD_ELIGIBLE";
        brandUpdate.operator_status = "QUALIFIED";
        brandUpdate.excluded_reason = null;
      }
    }

    const { error } = await supabase.from("brands").update(brandUpdate).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.forceExcluded) {
      await excludeBrand(supabase, id, "OTHER", reason);
    }

    await logActivity(supabase, {
      brandId: id,
      eventType: "MANUAL_OVERRIDE",
      title: "Handmatige override",
      detail: reason,
      metadata: {
        forceLeadEligible: body.forceLeadEligible ?? null,
        forceExcluded: body.forceExcluded ?? false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Override failed" },
      { status: 500 }
    );
  }
}
