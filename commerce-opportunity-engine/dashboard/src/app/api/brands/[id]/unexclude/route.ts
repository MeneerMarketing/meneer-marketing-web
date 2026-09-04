import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { unexcludeBrand } from "@/lib/operatorActions";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabase();
    await unexcludeBrand(supabase, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexclude failed" },
      { status: 500 }
    );
  }
}
