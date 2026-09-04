import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { getSupabase } from "@/lib/supabase";
import { logActivity } from "@/lib/operator";

/**
 * Marks opportunity for technical retry and kicks off local engine job.
 * Uses existing target/source data — no DataForSEO.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabase();

    const { data: opp, error } = await supabase
      .from("opportunities")
      .select("id, brand_id, audit_retry_count, cro_audit_status")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!opp) {
      return NextResponse.json({ error: "Opportunity niet gevonden" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const retryCount = Number(opp.audit_retry_count ?? 0) + 1;

    await supabase
      .from("opportunities")
      .update({
        cro_audit_status: "NEEDS_RETRY",
        opportunity_score: null,
        opportunity_verdict: "NEEDS_RETRY",
        audit_confidence: 0,
        audit_retry_count: retryCount,
        last_audit_attempt_at: now,
        updated_at: now,
      })
      .eq("id", id);

    await logActivity(supabase, {
      brandId: opp.brand_id,
      opportunityId: id,
      eventType: "AUDIT_RETRY",
      title: "Audit retry gestart",
      detail: `Poging ${retryCount}`,
      metadata: { retryCount },
    });

    const engineRoot = resolve(process.cwd(), "..");
    const child = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["run", "retry:failed-audits"],
      {
        cwd: engineRoot,
        env: {
          ...process.env,
          CRO_AUDIT_OPPORTUNITY_ID: id,
          CRO_AUDIT_FORCE_REAUDIT: "true",
          CRO_AUDIT_MAX_OPPORTUNITIES_PER_RUN: "1",
          CRO_AUDIT_MAX_ANTHROPIC_COST_PER_RUN: "0.35",
        },
        detached: true,
        stdio: "ignore",
        shell: process.platform === "win32",
      }
    );
    child.unref();

    return NextResponse.json({
      ok: true,
      queued: true,
      retryCount,
      message:
        "Technische retry gestart. Als de pagina gezond is volgt maximaal één Claude-audit.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Retry failed" },
      { status: 500 }
    );
  }
}
