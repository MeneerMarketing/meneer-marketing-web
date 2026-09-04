import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { logActivity } from "@/lib/operator";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      brandId?: string;
      opportunityId?: string;
      auditId?: string;
      targetType?: string;
      targetKey?: string;
      feedback?: "UP" | "DOWN";
      note?: string;
      originalPayload?: Record<string, unknown>;
    };

    if (!body.targetType?.trim()) {
      return NextResponse.json({ error: "targetType is verplicht." }, { status: 400 });
    }
    if (!body.targetKey?.trim()) {
      return NextResponse.json({ error: "targetKey is verplicht." }, { status: 400 });
    }
    if (body.feedback !== "UP" && body.feedback !== "DOWN") {
      return NextResponse.json({ error: "feedback moet UP of DOWN zijn." }, { status: 400 });
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();

    const { data: row, error } = await supabase
      .from("operator_ai_feedback")
      .insert({
        brand_id: body.brandId ?? null,
        opportunity_id: body.opportunityId ?? null,
        audit_id: body.auditId ?? null,
        target_type: body.targetType.trim(),
        target_key: body.targetKey.trim(),
        feedback: body.feedback,
        note: body.note?.trim() || null,
        original_payload: body.originalPayload ?? {},
        created_at: now,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logActivity(supabase, {
      brandId: body.brandId ?? null,
      opportunityId: body.opportunityId ?? null,
      eventType: "AI_FEEDBACK",
      title: body.feedback === "UP" ? "AI feedback: klopt" : "AI feedback: klopt niet",
      detail: body.note?.trim() || body.targetKey,
      metadata: {
        targetType: body.targetType,
        targetKey: body.targetKey,
        feedback: body.feedback,
        auditId: body.auditId ?? null,
      },
    });

    return NextResponse.json({ ok: true, feedback: row });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Feedback save failed" },
      { status: 500 }
    );
  }
}
