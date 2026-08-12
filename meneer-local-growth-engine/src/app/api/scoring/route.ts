import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  clearPrimaryCandidate,
  rankCityVertical,
  setPrimaryCandidateManual,
} from "@/services/scoring/rankCity";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { generateBusinessPreview } from "@/services/preview-generation/generateBusinessPreview";

const bodySchema = z.object({
  action: z.enum([
    "rank_city",
    "rank_all_cities",
    "set_primary",
    "clear_primary",
    "exclude_lead",
    "set_status",
    "set_exclusivity",
    "generate_winner_previews",
  ]),
  cityId: z.string().uuid().optional(),
  verticalSlug: z.string().default("pilates"),
  businessId: z.string().uuid().optional(),
  status: z.string().optional(),
  exclusivityStatus: z
    .enum(["AVAILABLE", "PRIMARY_CANDIDATE", "RESERVED", "EXCLUSIVE", "RELEASED"])
    .optional(),
  note: z.string().optional(),
  selectWinner: z.boolean().optional(),
  confirm: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Ongeldige input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = createAdminClient();
    const data = parsed.data;

    if (data.action === "rank_city") {
      if (!data.cityId) {
        return NextResponse.json({ ok: false, error: "cityId verplicht" }, { status: 400 });
      }
      const result = await rankCityVertical({
        cityId: data.cityId,
        verticalSlug: data.verticalSlug,
        selectWinner: data.selectWinner,
      });
      return NextResponse.json({ ok: true, result });
    }

    if (data.action === "rank_all_cities") {
      const { data: vertical } = await client
        .from("verticals")
        .select("id")
        .eq("slug", data.verticalSlug)
        .single();
      if (!vertical) {
        return NextResponse.json({ ok: false, error: "Vertical ontbreekt" }, { status: 404 });
      }
      const { data: businesses } = await client
        .from("businesses")
        .select("city_id")
        .eq("vertical_id", vertical.id)
        .eq("is_demo", false);
      const cityIds = Array.from(new Set((businesses ?? []).map((b) => b.city_id as string)));
      const results = [];
      for (const cityId of cityIds) {
        results.push(
          await rankCityVertical({
            cityId,
            verticalId: vertical.id as string,
            selectWinner: true,
          })
        );
      }
      return NextResponse.json({ ok: true, results });
    }

    if (data.action === "set_primary") {
      if (!data.businessId) {
        return NextResponse.json({ ok: false, error: "businessId verplicht" }, { status: 400 });
      }
      await setPrimaryCandidateManual({ businessId: data.businessId, note: data.note });
      return NextResponse.json({ ok: true });
    }

    if (data.action === "clear_primary") {
      if (!data.cityId) {
        return NextResponse.json({ ok: false, error: "cityId verplicht" }, { status: 400 });
      }
      const { data: vertical } = await client
        .from("verticals")
        .select("id")
        .eq("slug", data.verticalSlug)
        .single();
      if (!vertical) {
        return NextResponse.json({ ok: false, error: "Vertical ontbreekt" }, { status: 404 });
      }
      await clearPrimaryCandidate({
        cityId: data.cityId,
        verticalId: vertical.id as string,
      });
      return NextResponse.json({ ok: true });
    }

    if (data.action === "exclude_lead" || data.action === "set_status") {
      if (!data.businessId) {
        return NextResponse.json({ ok: false, error: "businessId verplicht" }, { status: 400 });
      }
      const status = data.action === "exclude_lead" ? "DO_NOT_CONTACT" : data.status;
      if (!status) {
        return NextResponse.json({ ok: false, error: "status verplicht" }, { status: 400 });
      }
      const patch: Record<string, unknown> = {
        lead_status: status,
        last_activity_at: new Date().toISOString(),
      };
      if (status === "DO_NOT_CONTACT") {
        patch.primary_candidate = false;
        patch.lead_eligible = false;
      }
      await client.from("businesses").update(patch).eq("id", data.businessId);
      await writeActivity(client, {
        business_id: data.businessId,
        activity_type: "STATUS_CHANGED",
        title: `Status → ${status}`,
        description: data.note ?? "Handmatige override",
      });
      return NextResponse.json({ ok: true });
    }

    if (data.action === "set_exclusivity") {
      if (!data.cityId || !data.exclusivityStatus) {
        return NextResponse.json(
          { ok: false, error: "cityId + exclusivityStatus verplicht" },
          { status: 400 }
        );
      }
      const { data: vertical } = await client
        .from("verticals")
        .select("id")
        .eq("slug", data.verticalSlug)
        .single();
      if (!vertical) {
        return NextResponse.json({ ok: false, error: "Vertical ontbreekt" }, { status: 404 });
      }
      await client.from("city_exclusivity").upsert(
        {
          vertical_id: vertical.id,
          city_id: data.cityId,
          status: data.exclusivityStatus,
          business_id: data.businessId ?? null,
          notes: data.note ?? "Handmatige exclusivity",
          updated_at: new Date().toISOString(),
          reserved_at:
            data.exclusivityStatus === "RESERVED" ? new Date().toISOString() : undefined,
          exclusive_at:
            data.exclusivityStatus === "EXCLUSIVE" ? new Date().toISOString() : undefined,
        },
        { onConflict: "vertical_id,city_id" }
      );
      await writeActivity(client, {
        business_id: data.businessId ?? null,
        activity_type: "CITY_RESERVED",
        title: `Exclusivity → ${data.exclusivityStatus}`,
        description: data.note ?? "",
        metadata: { city_id: data.cityId },
      });
      return NextResponse.json({ ok: true });
    }

    if (data.action === "generate_winner_previews") {
      if (!data.confirm) {
        const { data: winners } = await client
          .from("businesses")
          .select("id, studio_name, preview_status, city_id")
          .eq("primary_candidate", true)
          .eq("is_demo", false)
          .or("preview_status.eq.NOT_GENERATED,preview_status.is.null");
        return NextResponse.json({
          ok: true,
          requires_confirm: true,
          count: winners?.length ?? 0,
          winners: winners ?? [],
          message: `Bevestig generatie voor ${winners?.length ?? 0} city winner(s)`,
        });
      }
      const { data: winners } = await client
        .from("businesses")
        .select("id")
        .eq("primary_candidate", true)
        .eq("is_demo", false)
        .or("preview_status.eq.NOT_GENERATED,preview_status.is.null");
      const results = [];
      for (const w of winners ?? []) {
        results.push(await generateBusinessPreview(w.id as string));
      }
      return NextResponse.json({ ok: true, results });
    }

    return NextResponse.json({ ok: false, error: "Onbekende actie" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Scoring mislukt" },
      { status: 500 }
    );
  }
}
