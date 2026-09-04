import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { slugifyTag } from "@/lib/operator";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("operator_tags")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tags: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tags fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string };
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "name is verplicht." }, { status: 400 });
    }

    const slug = slugifyTag(name);
    if (!slug) {
      return NextResponse.json({ error: "Ongeldige tagnaam." }, { status: 400 });
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();

    const { data: tag, error } = await supabase
      .from("operator_tags")
      .upsert({ name, slug, created_at: now }, { onConflict: "slug" })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tag });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tag create failed" },
      { status: 500 }
    );
  }
}
