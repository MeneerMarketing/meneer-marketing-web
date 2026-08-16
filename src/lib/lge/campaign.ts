import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import {
  isLgePackageKey,
  isValidCampaignContext,
  type LgeCampaignContext,
  type LgeCampaignContextValid,
  type LgeCampaignEventMetadata,
  type LgeCampaignEventType,
} from "@/lib/lge/types";
import { buildPreviewReturnUrl } from "@/lib/lge/package-map";

const SAFE_REF_PATTERN = /^mmlg_[A-Za-z0-9_-]{8,72}$/;
const DEFAULT_TIMEOUT_MS = 2500;

export function getLgePublicBaseUrl(): string {
  const raw =
    process.env.LGE_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LGE_PUBLIC_BASE_URL?.trim() ||
    "";
  return raw.replace(/\/$/, "");
}

export function isSafeLgeCampaignRef(ref: string | null | undefined): boolean {
  if (!ref) return false;
  return SAFE_REF_PATTERN.test(ref);
}

export function mapContextToPersonalization(
  context: LgeCampaignContextValid,
  campaignRef: string,
): VerticalCampaignPersonalization {
  const recommended = isLgePackageKey(context.recommended_package)
    ? context.recommended_package
    : null;

  return {
    businessName: context.business_name,
    city: context.city,
    cityStatus:
      typeof context.city_status === "string" ? context.city_status : undefined,
    previewReady: Boolean(context.preview_url),
    previewHref: buildPreviewReturnUrl(context.preview_url, campaignRef),
    recommendedPackage: recommended ?? undefined,
    primaryService: context.primary_service ?? undefined,
    selectedTemplate: context.selected_template ?? undefined,
    vertical: context.vertical,
  };
}

/** Server-side resolve. Never throws. Timeout / offline → null. */
export async function resolveCampaignContext(
  ref: string,
  options?: { timeoutMs?: number },
): Promise<LgeCampaignContext | null> {
  const base = getLgePublicBaseUrl();
  if (!base) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[lge] LGE_PUBLIC_BASE_URL ontbreekt");
    }
    return null;
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      process.env.MENEER_MARKETING_BASE_URL?.replace(/\/$/, "") ||
      "https://meneermarketing.nl";

    const res = await fetch(
      `${base}/api/public/campaign-context/${encodeURIComponent(ref)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: origin,
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );

    const json = (await res.json().catch(() => null)) as LgeCampaignContext | null;
    if (!json || typeof json !== "object") return null;
    return json;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[lge] campaign-context resolve failed", err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Server-side event ingest. Failures never throw. */
export async function postCampaignEvent(input: {
  campaignRef: string;
  eventType: LgeCampaignEventType;
  metadata?: LgeCampaignEventMetadata;
  idempotencyKey?: string;
}): Promise<{ ok: boolean; duplicate?: boolean; error?: string }> {
  const base = getLgePublicBaseUrl();
  if (!base || !isSafeLgeCampaignRef(input.campaignRef)) {
    return { ok: false, error: "unavailable" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      process.env.MENEER_MARKETING_BASE_URL?.replace(/\/$/, "") ||
      "https://meneermarketing.nl";

    const res = await fetch(`${base}/api/public/campaign-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        ...(input.idempotencyKey
          ? { "Idempotency-Key": input.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        campaign_ref: input.campaignRef,
        event_type: input.eventType,
        metadata: input.metadata,
        idempotency_key: input.idempotencyKey,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const json = (await res.json().catch(() => null)) as {
      ok?: boolean;
      duplicate?: boolean;
      error?: string;
    } | null;

    if (!res.ok || !json?.ok) {
      return {
        ok: false,
        error: json?.error ?? `http_${res.status}`,
      };
    }

    return { ok: true, duplicate: Boolean(json.duplicate) };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[lge] campaign-event post failed", err);
    }
    return { ok: false, error: "network" };
  } finally {
    clearTimeout(timer);
  }
}

export { isValidCampaignContext };
export {
  packageIdToKey,
  packageKeyLabel,
  packageKeyToInterest,
  buildPreviewReturnUrl,
} from "@/lib/lge/package-map";
