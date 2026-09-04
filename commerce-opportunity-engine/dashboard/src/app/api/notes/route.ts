import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { logActivity } from "@/lib/operator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const opportunityId = searchParams.get("opportunityId");

    if (!brandId && !opportunityId) {
      return NextResponse.json(
        { error: "Geef brandId of opportunityId op als query parameter." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    let query = supabase
      .from("operator_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (brandId) {
      query = query.eq("brand_id", brandId);
    }
    if (opportunityId) {
      query = query.eq("opportunity_id", opportunityId);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, notes: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Notes fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      brandId?: string;
      opportunityId?: string;
      body?: string;
    };

    const noteBody = body.body?.trim();
    if (!noteBody) {
      return NextResponse.json({ error: "body is verplicht." }, { status: 400 });
    }
    if (!body.brandId && !body.opportunityId) {
      return NextResponse.json(
        { error: "Geef brandId en/of opportunityId op." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();

    const { data: note, error } = await supabase
      .from("operator_notes")
      .insert({
        brand_id: body.brandId ?? null,
        opportunity_id: body.opportunityId ?? null,
        body: noteBody,
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logActivity(supabase, {
      brandId: body.brandId ?? null,
      opportunityId: body.opportunityId ?? null,
      eventType: "NOTE_ADDED",
      title: "Notitie toegevoegd",
      detail: noteBody.slice(0, 200),
    });

    return NextResponse.json({ ok: true, note });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Note create failed" },
      { status: 500 }
    );
  }
}
