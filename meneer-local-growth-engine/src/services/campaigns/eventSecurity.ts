import { timingSafeEqual } from "node:crypto";
import type { CampaignRow } from "@/services/campaigns/types";

/**
 * Security model for is_test:
 * - Browser clients NEVER decide is_test.
 * - DEVELOPMENT campaigns force is_test=true for all events.
 * - Trusted MM/server proxy may request test mode only with shared secret.
 * - Without secret + PRODUCTION campaign → is_test=false.
 */
export function resolveEventIsTest(input: {
  campaign: Pick<CampaignRow, "environment">;
  trustedTestMode?: boolean;
}): boolean {
  if (input.campaign.environment === "DEVELOPMENT") return true;
  if (input.trustedTestMode) return true;
  return false;
}

export function verifyIngestSecret(provided: string | null): boolean {
  const expected = process.env.LGE_EVENT_INGEST_SECRET?.trim();
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function parseTrustedTestMode(request: Request): boolean {
  const secret = request.headers.get("x-lge-ingest-secret");
  if (!verifyIngestSecret(secret)) return false;
  const mode = (request.headers.get("x-lge-event-mode") || "").toLowerCase();
  return mode === "test" || mode === "development";
}

export function isProductionHttpsUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isApprovedPreviewHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const allowed = (
      process.env.OUTREACH_PREVIEW_ALLOWED_HOSTS ||
      "preview.meneermarketing.nl,meneermarketing.nl"
    )
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return allowed.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function isApprovedMarketingHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "meneermarketing.nl" ||
      host === "www.meneermarketing.nl"
    );
  } catch {
    return false;
  }
}
