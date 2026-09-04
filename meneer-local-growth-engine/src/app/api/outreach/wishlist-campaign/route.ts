import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  cancelWishlistScheduled,
  generateWishlistDrafts,
  getWishlistCampaignSummary,
  scheduleWishlistBatch,
} from "@/services/outreach/wishlistCampaign";
import { processDueScheduledOutreach } from "@/services/outreach/sendService";

const scheduleSchema = z.object({
  action: z.literal("schedule_batch"),
  scheduledAt: z.string().min(1).optional(),
  staggerMinutes: z.number().min(0).max(30).optional(),
  verticalId: z.string().uuid().optional(),
  mode: z.enum(["manual", "optimized"]).optional(),
});

const generateSchema = z.object({
  action: z.literal("generate_drafts"),
  limit: z.number().min(1).max(25).optional(),
  verticalId: z.string().uuid().optional(),
});

const cancelSchema = z.object({
  action: z.literal("cancel_batch"),
  verticalId: z.string().uuid().optional(),
});

const processDueSchema = z.object({
  action: z.literal("process_due"),
});

export async function GET(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const verticalId = searchParams.get("verticalId") ?? undefined;
    const summary = await getWishlistCampaignSummary(verticalId);
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Status mislukt" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin key ontbreekt" }, { status: 500 });
    }

    const json = await request.json();

    const schedule = scheduleSchema.safeParse(json);
    if (schedule.success) {
      const result = await scheduleWishlistBatch({
        scheduledAt: schedule.data.scheduledAt,
        staggerMinutes: schedule.data.staggerMinutes,
        verticalId: schedule.data.verticalId,
        mode: schedule.data.mode,
      });
      return NextResponse.json({ ok: true, result });
    }

    const generate = generateSchema.safeParse(json);
    if (generate.success) {
      const result = await generateWishlistDrafts({
        limit: generate.data.limit,
        verticalId: generate.data.verticalId,
      });
      return NextResponse.json({ ok: true, result });
    }

    const cancel = cancelSchema.safeParse(json);
    if (cancel.success) {
      const result = await cancelWishlistScheduled(cancel.data.verticalId);
      return NextResponse.json({ ok: true, result });
    }

    const processDue = processDueSchema.safeParse(json);
    if (processDue.success) {
      const result = await processDueScheduledOutreach();
      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json({ ok: false, error: "Ongeldige actie" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Actie mislukt" },
      { status: 500 }
    );
  }
}
