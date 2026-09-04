import type { MeneerMarketingBrandSettings } from "@/config/brandSettings";
import { toCanonicalPreviewSlug } from "@/lib/previewSlug";

export function extractPreviewSlug(previewUrl: string | null | undefined): string | null {
  if (!previewUrl) return null;
  let raw: string | null = null;
  if (previewUrl.startsWith("/preview/")) {
    raw = previewUrl.replace(/^\/preview\//, "").split(/[?#]/)[0] ?? null;
  } else {
    try {
      const u = new URL(previewUrl);
      const match = u.pathname.match(/\/preview\/([^/]+)/);
      if (match?.[1]) raw = match[1];
      else if (isPreviewHost(u.hostname)) {
        const direct = u.pathname.replace(/^\/+/, "").split("/")[0];
        raw = direct || null;
      }
    } catch {
      return null;
    }
  }
  return raw ? toCanonicalPreviewSlug(raw) : null;
}

/** De losse preview-host serveert slugs vanaf de root, zonder /preview/ ervoor. */
function isPreviewHost(hostname: string): boolean {
  return hostname.toLowerCase().startsWith("preview.");
}

/**
 * Zet een preview-basis en slug om in één publieke URL. Op de preview-host komt
 * de slug direct achter het domein, want die host doet niets anders dan
 * previews serveren. Elders blijft /preview/ nodig om de route te raken.
 */
export function formatPublicPreviewUrl(base: string, slug: string): string {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedSlug = toCanonicalPreviewSlug(String(slug).replace(/^\/+/, ""));
  let host = "";
  try {
    host = new URL(trimmedBase).hostname;
  } catch {
    host = "";
  }
  const prefix = host && isPreviewHost(host) ? "" : "/preview";
  return `${trimmedBase}${prefix}/${trimmedSlug}`;
}

/** Verwijdert tracking-queryparams zodat alleen een korte, vertrouwde URL overblijft. */
export function stripTrackingRefFromPreviewUrl(url: string): string {
  if (!url?.trim()) return url;
  if (url.startsWith("/preview/")) {
    return url.split("?")[0] ?? url;
  }
  try {
    const u = new URL(url);
    u.searchParams.delete("ref");
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    const qs = u.searchParams.toString();
    return `${u.origin}${u.pathname}${qs ? `?${qs}` : ""}`;
  } catch {
    return url.split("?")[0] ?? url;
  }
}

export function buildAbsolutePreviewUrl(input: {
  previewUrl: string | null | undefined;
  previewSlug?: string | null;
  brand: MeneerMarketingBrandSettings;
}): string {
  const base = (input.brand.preview_base_url || process.env.OUTREACH_PREVIEW_BASE_URL || "").replace(
    /\/$/,
    ""
  );
  const slug =
    input.previewSlug ||
    extractPreviewSlug(input.previewUrl) ||
    null;
  if (!slug) {
    throw new Error("Preview slug ontbreekt");
  }
  if (!base) {
    throw new Error(
      "OUTREACH_PREVIEW_BASE_URL ontbreekt. Zet een absolute HTTPS preview host, bv. https://preview.meneermarketing.nl"
    );
  }
  let absolute: string;
  try {
    absolute = formatPublicPreviewUrl(base, slug);
    const parsed = new URL(absolute);
    if (parsed.protocol !== "https:") {
      throw new Error("Preview base URL moet HTTPS zijn");
    }
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      throw new Error("Localhost preview URL is niet toegestaan in e-mail");
    }
    const allowed = input.brand.preview_allowed_hosts.filter((h) => h !== "localhost");
    const ok = allowed.some((h) => host === h || host.endsWith(`.${h}`));
    if (!ok) {
      throw new Error(`Preview host niet goedgekeurd: ${host}`);
    }
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Ongeldige absolute preview URL");
  }
  return absolute;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}
