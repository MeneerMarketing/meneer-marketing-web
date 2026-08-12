import * as cheerio from "cheerio";
import type { BrandProfile, WebsiteIntelligence } from "./types";

function hexFromRgb(r: number, g: number, b: number): string {
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

function parseColor(raw: string): string | null {
  const v = raw.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) {
    if (v.length === 4) {
      return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`.toUpperCase();
    }
    return v.toUpperCase();
  }
  const rgb = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) return hexFromRgb(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]));
  return null;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isNearWhiteOrBlack(hex: string): boolean {
  const l = luminance(hex);
  return l > 0.92 || l < 0.08;
}

export function extractBrand(
  intelligence: WebsiteIntelligence,
  discoveryLogo?: string | null
): BrandProfile {
  const sources: string[] = [];
  const colorHits = new Map<string, number>();
  let logoUrl: string | null = null;
  let logoSource: string | null = null;
  let themeColor: string | null = null;
  let fontHeading: string | null = null;
  let fontBody: string | null = null;

  for (const page of intelligence.pages) {
    const $ = cheerio.load(page.html);

    if (!themeColor) {
      const meta = $('meta[name="theme-color"]').attr("content");
      if (meta) {
        themeColor = parseColor(meta);
        if (themeColor) sources.push("meta:theme-color");
      }
    }

    // CSS variables on :root / html / body inline styles
    $("[style]").each((_, el) => {
      const style = $(el).attr("style") ?? "";
      const vars = style.matchAll(/--[a-z0-9-]*(?:color|brand|primary|accent)[a-z0-9-]*\s*:\s*([^;]+)/gi);
      for (const m of vars) {
        const c = parseColor(m[1]);
        if (c && !isNearWhiteOrBlack(c)) {
          colorHits.set(c, (colorHits.get(c) ?? 0) + 3);
          sources.push("inline-css-var");
        }
      }
      const bg = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      if (bg) {
        const c = parseColor(bg[1]);
        if (c && !isNearWhiteOrBlack(c)) colorHits.set(c, (colorHits.get(c) ?? 0) + 1);
      }
      const col = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
      if (col) {
        const c = parseColor(col[1]);
        if (c && !isNearWhiteOrBlack(c)) colorHits.set(c, (colorHits.get(c) ?? 0) + 1);
      }
    });

    $("style").each((_, el) => {
      const css = $(el).text();
      const varMatches = css.matchAll(
        /--[a-z0-9-]*(?:brand|primary|accent|secondary)[a-z0-9-]*\s*:\s*([^;}\n]+)/gi
      );
      for (const m of varMatches) {
        const c = parseColor(m[1]);
        if (c && !isNearWhiteOrBlack(c)) {
          colorHits.set(c, (colorHits.get(c) ?? 0) + 4);
          sources.push("stylesheet-var");
        }
      }
      const fontMatch = css.match(/font-family\s*:\s*([^;}\n]+)/i);
      if (fontMatch && !fontHeading) {
        fontHeading = fontMatch[1].split(",")[0]?.replace(/['"]/g, "").trim() ?? null;
        fontBody = fontHeading;
      }
    });

    if (!logoUrl) {
      const candidates = [
        $("header img[src$='.svg'], img[class*='logo'][src$='.svg']").first().attr("src"),
        $("header img, .logo img, a[class*='logo'] img, img[class*='logo']").first().attr("src"),
        $("header img, .logo img").first().attr("data-src"),
        $('link[rel="apple-touch-icon"]').attr("href"),
        $('link[rel="icon"]').attr("href"),
      ].filter(Boolean) as string[];

      for (const src of candidates) {
        try {
          logoUrl = new URL(src, page.url).toString();
          logoSource = src.includes("icon")
            ? "favicon"
            : src.endsWith(".svg")
              ? "header-logo-svg"
              : "header-logo";
          sources.push(logoSource);
          break;
        } catch {
          /* ignore */
        }
      }
    }
  }

  if (!logoUrl && discoveryLogo) {
    logoUrl = discoveryLogo;
    logoSource = "google-business-logo";
    sources.push(logoSource);
  }

  if (themeColor) {
    colorHits.set(themeColor, (colorHits.get(themeColor) ?? 0) + 6);
  }

  const ranked = [...colorHits.entries()].sort((a, b) => b[1] - a[1]);
  const primary = ranked[0]?.[0] ?? "#1A1614";
  const secondary = ranked.find(([c]) => luminance(c) > 0.75)?.[0] ?? "#F4EFE6";
  const accent =
    ranked.find(([c]) => c !== primary && !isNearWhiteOrBlack(c) && luminance(c) < 0.75)?.[0] ??
    "#C4A484";

  const confidence = Math.min(
    0.95,
    0.25 +
      (logoUrl ? 0.25 : 0) +
      (themeColor ? 0.2 : 0) +
      Math.min(0.25, ranked.length * 0.05)
  );

  const visual_keywords: string[] = [];
  if (luminance(primary) < 0.35) visual_keywords.push("dark");
  if (luminance(secondary) > 0.8) visual_keywords.push("light-bg");
  if (/a|b|c|d|e|f/i.test(accent) && luminance(accent) > 0.4) visual_keywords.push("warm-accent");

  return {
    logo_url: logoUrl,
    logo_source: logoSource,
    primary_color: primary,
    secondary_color: secondary,
    accent_color: accent,
    font_heading: fontHeading,
    font_body: fontBody,
    visual_keywords,
    confidence,
    sources: Array.from(new Set(sources)),
  };
}
