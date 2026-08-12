import type { MeneerMarketingBrandSettings } from "@/config/brandSettings";

/**
 * Option A public URL shape on dedicated preview host:
 *   https://preview.meneermarketing.nl/{slug}
 * Internal app route remains /preview/{slug} (rewritten by proxy).
 */

export function extractPreviewSlug(previewUrl: string | null | undefined): string | null {
  if (!previewUrl) return null;

  if (previewUrl.startsWith("/preview/")) {
    return previewUrl.replace(/^\/preview\//, "").split(/[?#]/)[0] || null;
  }

  // Relative clean path used only on preview host rewrites: /{slug}
  if (/^\/[a-z0-9][a-z0-9-]*$/i.test(previewUrl)) {
    return previewUrl.slice(1);
  }

  if (/^[a-z0-9][a-z0-9-]*$/i.test(previewUrl)) {
    return previewUrl;
  }

  try {
    const u = new URL(previewUrl);
    const previewMatch = u.pathname.match(/\/preview\/([^/]+)/);
    if (previewMatch?.[1]) return previewMatch[1];

    const bare = u.pathname.replace(/^\//, "").split(/[?#]/)[0] ?? "";
    if (bare && !bare.includes("/")) return bare;
    return null;
  } catch {
    return null;
  }
}

/** True when base host is the dedicated public preview surface (no /preview path). */
export function isDedicatedPreviewHost(baseOrHost: string): boolean {
  try {
    const host = baseOrHost.includes("://")
      ? new URL(baseOrHost).hostname.toLowerCase()
      : baseOrHost.toLowerCase().split(":")[0];
    return host === "preview.meneermarketing.nl" || host.startsWith("preview.");
  } catch {
    return false;
  }
}

export function formatPublicPreviewUrl(base: string, slug: string): string {
  const cleanBase = base.replace(/\/$/, "");
  if (isDedicatedPreviewHost(cleanBase)) {
    return `${cleanBase}/${slug}`;
  }
  // Fallback for non-dedicated hosts (e.g. shared app domain)
  return `${cleanBase}/preview/${slug}`;
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

  try {
    const absolute = formatPublicPreviewUrl(base, slug);
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
    return absolute;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Ongeldige absolute preview URL");
  }
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}
