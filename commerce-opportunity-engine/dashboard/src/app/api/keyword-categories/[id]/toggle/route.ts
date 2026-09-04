import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Category id ontbreekt." }, { status: 400 });
    }

    const body = (await request.json()) as {
      field?: "active" | "paused";
      value?: boolean;
    };

    if (body.field !== "active" && body.field !== "paused") {
      return NextResponse.json(
        { error: "field moet active of paused zijn." },
        { status: 400 }
      );
    }

    if (typeof body.value !== "boolean") {
      return NextResponse.json({ error: "value moet boolean zijn." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("keyword_categories")
      .update({
        [body.field]: body.value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id, field: body.field, value: body.value });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
