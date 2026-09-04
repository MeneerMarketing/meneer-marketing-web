import { NextResponse } from "next/server";
import { logActivity } from "@/lib/operator";
import { getSupabase } from "@/lib/supabase";

type StatusAction = "approve" | "reject" | "pause";

function buildStatusPatch(
  action: StatusAction,
  reason: string | undefined,
  now: string
): Record<string, unknown> {
  const patch: Record<string, unknown> = {
    manual_review_override: true,
    manual_review_at: now,
    updated_at: now,
  };

  if (action === "approve") {
    Object.assign(patch, {
      approved: true,
      rejected: false,
      paused: false,
      active: true,
      discovery_status: "APPROVED",
      rejection_reason: null,
    });
  } else if (action === "reject") {
    Object.assign(patch, {
      approved: false,
      rejected: true,
      paused: false,
      active: false,
      discovery_status: "REJECTED",
      rejection_reason: reason ?? "manual_reject",
    });
  } else {
    Object.assign(patch, {
      paused: true,
      approved: false,
      discovery_status: "PAUSED",
      active: false,
    });
  }

  return patch;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      ids?: string[];
      action?: StatusAction;
      reason?: string;
    };

    const ids = body.ids?.filter(Boolean) ?? [];
    if (ids.length === 0) {
      return NextResponse.json({ error: "ids mag niet leeg zijn." }, { status: 400 });
    }

    const action = body.action;
    if (action !== "approve" && action !== "reject" && action !== "pause") {
      return NextResponse.json({ error: "Ongeldige actie." }, { status: 400 });
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();
    const patch = buildStatusPatch(action, body.reason, now);

    const { error } = await supabase.from("keywords").update(patch).in("id", ids);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await logActivity(supabase, {
        brandId: null,
        opportunityId: null,
        eventType: `KEYWORD_${action.toUpperCase()}`,
        title: `Keywords ${action}: ${ids.length}`,
        detail: body.reason ?? null,
        metadata: { keywordIds: ids, action, reason: body.reason ?? null },
      });
    } catch {
      // Activity log may require brand_id; skip silently for keyword-only events.
    }

    return NextResponse.json({ ok: true, updated: ids.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
