import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { excludeBrand } from "@/lib/operatorActions";
import { EXCLUSION_REASONS, type ExclusionReason } from "@/lib/operator";

const REASONS = new Set<string>(EXCLUSION_REASONS);

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { reason?: string; note?: string | null };
    const reason = body.reason;

    if (!reason || !REASONS.has(reason)) {
      return NextResponse.json({ error: "Ongeldige uitsluitingsreden." }, { status: 400 });
    }

    const supabase = getSupabase();
    await excludeBrand(
      supabase,
      id,
      reason as ExclusionReason,
      body.note?.trim() || null
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Exclude failed" },
      { status: 500 }
    );
  }
}
