import { z } from "zod";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/http/rateLimit";
import { jsonWithCors, optionsResponse } from "@/lib/http/campaignCors";
import { resolvePublicCampaignContext } from "@/services/campaigns/campaignService";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    if (!isAdminConfigured()) {
      return jsonWithCors(request, { valid: false, error: "unavailable" }, { status: 503 });
    }

    const ip = clientIp(request);
    const limited = rateLimit({
      key: `campaign-context:${ip}`,
      limit: 60,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return jsonWithCors(
        request,
        { valid: false, error: "rate_limited" },
        { status: 429 }
      );
    }

    const { ref } = await context.params;
    const parsed = z.string().min(8).max(80).safeParse(ref);
    if (!parsed.success) {
      return jsonWithCors(request, { valid: false, error: "invalid" }, { status: 400 });
    }

    const result = await resolvePublicCampaignContext(parsed.data);
    const status = result.valid
      ? 200
      : result.error === "not_found"
        ? 404
        : result.error === "invalid"
          ? 400
          : 410;
    return jsonWithCors(request, result, { status });
  } catch {
    return jsonWithCors(request, { valid: false, error: "invalid" }, { status: 500 });
  }
}
