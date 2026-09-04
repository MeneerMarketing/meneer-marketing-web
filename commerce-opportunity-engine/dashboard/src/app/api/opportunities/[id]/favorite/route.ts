import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { setOpportunityFavorite } from "@/lib/operatorActions";

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
    const { data: opp, error: loadError } = await supabase
      .from("opportunities")
      .select("brand_id")
      .eq("id", id)
      .maybeSingle();

    if (loadError) throw new Error(loadError.message);
    if (!opp) {
      return NextResponse.json({ error: "Opportunity niet gevonden" }, { status: 404 });
    }

    await setOpportunityFavorite(supabase, id, opp.brand_id, body.enabled);

    return NextResponse.json({ ok: true, enabled: body.enabled });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Favorite update failed" },
      { status: 500 }
    );
  }
}
