import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/http/rateLimit";
import { jsonWithCors, optionsResponse } from "@/lib/http/campaignCors";
import { ingestCampaignEvent } from "@/services/campaigns/campaignService";
import { CAMPAIGN_EVENT_TYPES } from "@/services/campaigns/types";
import { parseTrustedTestMode } from "@/services/campaigns/eventSecurity";

const bodySchema = z.object({
  campaign_ref: z.string().min(8).max(80),
  event_type: z.enum(CAMPAIGN_EVENT_TYPES),
  metadata: z.record(z.string(), z.unknown()).optional(),
  idempotency_key: z.string().max(120).optional(),
  // Ignored if present — clients cannot set is_test
  is_test: z.boolean().optional(),
});

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return jsonWithCors(request, { ok: false, error: "unavailable" }, { status: 503 });
    }

    const ip = clientIp(request);
    const limited = rateLimit({
      key: `campaign-events:${ip}`,
      limit: 40,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return jsonWithCors(request, { ok: false, error: "rate_limited" }, { status: 429 });
    }

    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonWithCors(request, { ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const headerIdem = request.headers.get("idempotency-key");
    const trustedTest = parseTrustedTestMode(request);

    const result = await ingestCampaignEvent({
      campaignRef: parsed.data.campaign_ref,
      eventType: parsed.data.event_type,
      metadata: parsed.data.metadata,
      idempotencyKey: parsed.data.idempotency_key || headerIdem,
      source: trustedTest ? "mm_proxy_test" : "public_api",
      isTest: trustedTest,
    });

    if (!result.ok) {
      return jsonWithCors(request, result, { status: 400 });
    }
    return jsonWithCors(request, result);
  } catch {
    return jsonWithCors(request, { ok: false, error: "server_error" }, { status: 500 });
  }
}
