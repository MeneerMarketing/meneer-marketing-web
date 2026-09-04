import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/supabase/server";
import { prepareCampaignForPilot } from "@/services/campaigns/recomputeJourney";
import { validateCampaignLaunchReadiness } from "@/services/campaigns/launchReadiness";
import { recomputeCampaignJourney } from "@/services/campaigns/recomputeJourney";

const bodySchema = z.object({
  campaignId: z.string().uuid(),
  action: z.enum(["prepare_for_pilot", "recompute", "validate"]),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const bypass = process.env.LGE_DEV_AUTH_BYPASS === "true";
  const user = await getSessionUser();
  if (!user && !bypass) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  try {
    if (parsed.data.action === "recompute") {
      const recomputed = await recomputeCampaignJourney(parsed.data.campaignId);
      return NextResponse.json({ ok: true, recomputed });
    }
    if (parsed.data.action === "validate") {
      const readiness = await validateCampaignLaunchReadiness(parsed.data.campaignId);
      return NextResponse.json({ ok: true, readiness });
    }
    const result = await prepareCampaignForPilot(parsed.data.campaignId);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
