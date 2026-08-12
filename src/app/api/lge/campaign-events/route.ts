import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { postCampaignEvent } from "@/lib/lge/campaign";
import {
  LGE_BOOKING_OPTION_KEYS,
  LGE_CAMPAIGN_EVENT_TYPES,
  LGE_PACKAGE_KEYS,
} from "@/lib/lge/types";

const bodySchema = z.object({
  campaign_ref: z.string().min(8).max(80),
  event_type: z.enum(LGE_CAMPAIGN_EVENT_TYPES),
  idempotency_key: z.string().max(120).optional(),
  metadata: z
    .object({
      package: z.enum(LGE_PACKAGE_KEYS).optional(),
      booking_option: z.enum(LGE_BOOKING_OPTION_KEYS).optional(),
      path: z.string().max(200).optional(),
      section: z.string().max(80).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const raw: unknown = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const result = await postCampaignEvent({
      campaignRef: parsed.data.campaign_ref,
      eventType: parsed.data.event_type,
      metadata: parsed.data.metadata,
      idempotencyKey: parsed.data.idempotency_key,
    });

    if (!result.ok) {
      console.warn("[lge proxy] event failed", result.error, parsed.data.event_type);
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[lge proxy] unexpected", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
