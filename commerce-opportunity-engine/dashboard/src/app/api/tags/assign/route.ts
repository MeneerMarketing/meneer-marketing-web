import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { logActivity } from "@/lib/operator";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      tagId?: string;
      brandId?: string;
      opportunityId?: string;
      action?: "add" | "remove";
    };

    if (!body.tagId) {
      return NextResponse.json({ error: "tagId is verplicht." }, { status: 400 });
    }
    if (!body.brandId && !body.opportunityId) {
      return NextResponse.json(
        { error: "Geef brandId en/of opportunityId op." },
        { status: 400 }
      );
    }
    if (body.action !== "add" && body.action !== "remove") {
      return NextResponse.json({ error: "action moet add of remove zijn." }, { status: 400 });
    }

    const supabase = getSupabase();

    if (body.brandId) {
      if (body.action === "add") {
        const { error } = await supabase.from("operator_brand_tags").upsert({
          brand_id: body.brandId,
          tag_id: body.tagId,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        const { error } = await supabase
          .from("operator_brand_tags")
          .delete()
          .eq("brand_id", body.brandId)
          .eq("tag_id", body.tagId);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (body.opportunityId) {
      if (body.action === "add") {
        const { error } = await supabase.from("operator_opportunity_tags").upsert({
          opportunity_id: body.opportunityId,
          tag_id: body.tagId,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        const { error } = await supabase
          .from("operator_opportunity_tags")
          .delete()
          .eq("opportunity_id", body.opportunityId)
          .eq("tag_id", body.tagId);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    await logActivity(supabase, {
      brandId: body.brandId ?? null,
      opportunityId: body.opportunityId ?? null,
      eventType: body.action === "add" ? "TAG_ADDED" : "TAG_REMOVED",
      title: body.action === "add" ? "Tag toegevoegd" : "Tag verwijderd",
      metadata: { tagId: body.tagId },
    });

    return NextResponse.json({ ok: true, action: body.action });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tag assign failed" },
      { status: 500 }
    );
  }
}
