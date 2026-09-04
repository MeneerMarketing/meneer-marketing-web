/** Bruikbaar merklogo voor header/wordmark (niet voor sectiebeelden). */

/** Google Business profielfoto's — geen merklogo. */
export function isGoogleBusinessProfilePhoto(url: string): boolean {
  const value = url.trim().toLowerCase();
  if (!/googleusercontent\.com/i.test(value)) return false;
  return (
    /\/photo\.jpg/i.test(value) ||
    /\/a-\/a\//i.test(value) ||
    /\/a\/ac[a-z]\//i.test(value) ||
    /s\d+-p-k-no/i.test(value)
  );
}

export function wixFillDims(url: string): { w: number; h: number } | null {
  const decoded = decodeURIComponent(url);
  const match =
    decoded.match(/fill\/w_(\d+),h_(\d+)/i) ?? decoded.match(/w_(\d+),h_(\d+)/i);
  if (!match) return null;
  const w = Number(match[1]);
  const h = Number(match[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  return { w, h };
}

function parseWixMediaId(url: string): string | null {
  const match = url.match(/static\.wixstatic\.com\/media\/([^/?#]+~mv2\.\w+)/i);
  return match?.[1] ?? null;
}

/** Wix header-thumbs met w_49,h_25 zijn fotocollages, geen logo. */
export function isLikelyNonLogoImage(url: string): boolean {
  const dims = wixFillDims(url);
  if (!dims) return false;
  const ratio = dims.w / dims.h;
  return ratio > 1.55 || ratio < 0.65;
}

/**
 * Wix-sites: mini-thumbs (blur, <160px) upgraden naar scherpe CDN-variant.
 * Vierkante assets → 320×320 (logo). Brede wordmarks → 400×120.
 */
export function upgradeLogoUrl(url: string): string {
  const raw = url.trim();
  if (!/wixstatic\.com/i.test(raw)) return raw;

  const media = parseWixMediaId(raw);
  if (!media) return raw.replace(/blur_\d+,?/gi, "");

  const dims = wixFillDims(raw);
  const blurred = /blur_/i.test(raw);
  const tiny = dims ? dims.w < 160 && dims.h < 160 : false;

  if (!blurred && !tiny) return raw;

  if (dims) {
    const ratio = dims.w / dims.h;
    if (ratio >= 0.85 && ratio <= 1.15) {
      return `https://static.wixstatic.com/media/${media}/v1/fill/w_320,h_320,al_c,q_90/${media}`;
    }
    if (ratio > 1.2) {
      return `https://static.wixstatic.com/media/${media}/v1/fill/w_400,h_120,al_c,q_90/${media}`;
    }
  }

  return `https://static.wixstatic.com/media/${media}/v1/fill/w_320,h_320,al_c,q_90/${media}`;
}

export function resolveStudioLogoUrl(logo: string | null | undefined): string | null {
  const raw = (logo ?? "").trim();
  if (!raw || raw.startsWith("data:")) return null;

  if (isGoogleBusinessProfilePhoto(raw)) return null;

  if (/pixel|tracker|1x1|spacer|badge|payment|ideal|visa|mastercard/i.test(raw)) {
    return null;
  }

  if (isLikelyNonLogoImage(raw)) return null;

  const normalized = raw.startsWith("/") ? raw : upgradeLogoUrl(raw);

  if (normalized.startsWith("/")) return normalized;

  try {
    const parsed = new URL(normalized.startsWith("//") ? `https:${normalized}` : normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return normalized;
  } catch {
    return null;
  }
}

/** Hoogste-resolutie Wix-logo-URL bouwen vanuit media-id (vierkant, transparant). */
export function buildWixSquareLogoUrl(mediaId: string): string {
  const file = mediaId.includes("~mv2") ? mediaId : `${mediaId}~mv2.png`;
  return `https://static.wixstatic.com/media/${file}/v1/fill/w_320,h_320,al_c,q_90/${file}`;
}

/** Haalt het beste merklogo uit reeds opgehaalde site-HTML (Squarespace, Wix, etc.). */
export function pickWebsiteLogoFromHtml(html: string, pageUrl: string): string | null {
  const candidates = new Map<string, number>();

  const push = (src: string | null | undefined, bonus = 0) => {
    if (!src?.trim()) return;
    try {
      const absolute = new URL(src.trim(), pageUrl).href;
      if (isGoogleBusinessProfilePhoto(absolute)) return;
      if (isLikelyNonLogoImage(absolute)) return;
      if (/shutterstock|stockphoto|hero|banner|carousel|background|tiktok|instagram/i.test(absolute)) {
        return;
      }
      let score = 0;
      const lower = decodeURIComponent(absolute).toLowerCase();
      if (/logo|brand|wordmark|merk/.test(lower)) score += 40;
      if (/squarespace-cdn|wixstatic|onewebmedia|usercontent\.one/.test(lower)) score += 14;
      if (/\.svg(\?|$)/.test(lower)) score += 22;
      if (/\/nou\b|nou\+|%28%29/i.test(lower)) score += 35;
      if (/format=1500w|format=500w/.test(lower)) score += 8;
      const dims = wixFillDims(absolute);
      if (dims) {
        const ratio = dims.w / dims.h;
        if (ratio >= 0.85 && ratio <= 1.15) score += 18;
        else if (ratio > 1.55 || ratio < 0.65) score -= 30;
      }
      candidates.set(absolute, Math.max(candidates.get(absolute) ?? 0, score + bonus));
    } catch {
      /* ignore invalid */
    }
  };

  for (const match of html.matchAll(
    /(?:src|data-src|href|content)=["']([^"']*(?:squarespace-cdn|wixstatic|onewebmedia)[^"']+\.(?:png|svg|webp|jpg)[^"']*)["']/gi
  )) {
    push(match[1]);
  }

  const headerChunk = html.slice(0, Math.min(html.length, 28_000));
  for (const match of headerChunk.matchAll(
    /(?:src|data-src)=["']([^"']+\.(?:png|svg|webp)[^"']*)["']/gi
  )) {
    push(match[1], 6);
  }

  const best = [...candidates.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] <= 0) return null;
  return upgradeLogoUrl(best[0]);
}

/** Probeert het echte sitelogo op te halen wanneer Google alleen een profielfoto heeft. */
export async function fetchWebsiteLogoUrl(websiteUrl: string): Promise<string | null> {
  try {
    const absolute = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
    const response = await fetch(absolute, {
      signal: AbortSignal.timeout(8_000),
      headers: { "User-Agent": "MeneerMarketing-Preview/1.0" },
    });
    if (!response.ok) return null;
    const html = await response.text();
    const picked = pickWebsiteLogoFromHtml(html, absolute);
    return picked ? resolveStudioLogoUrl(picked) : null;
  } catch {
    return null;
  }
}
