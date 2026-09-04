import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { setBrandFavorite } from "@/lib/operatorActions";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { enabled?: boolean };

    if (typeof body.enabled !== "boolean") {
      return NextResponse.json({ error: "enabled (boolean) is verplicht." }, { status: 400 });
    }

    const supabase = getSupabase();
    await setBrandFavorite(supabase, id, body.enabled);

    return NextResponse.json({ ok: true, enabled: body.enabled });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Favorite update failed" },
      { status: 500 }
    );
  }
}
