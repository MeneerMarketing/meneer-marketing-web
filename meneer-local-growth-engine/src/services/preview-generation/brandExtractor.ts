import { mergeBrandWithLogo } from "@/lib/brandPalette";
import { isWarmGoldTone, pickBrandGoldAccent } from "@/lib/color";
import { extractLogoPalette } from "@/lib/logoColorExtractor";
import {
  buildWixSquareLogoUrl,
  isGoogleBusinessProfilePhoto,
  isLikelyNonLogoImage,
  pickWebsiteLogoFromHtml,
  upgradeLogoUrl,
  wixFillDims,
} from "@/lib/studioLogo";
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

function registerColorHit(
  colorHits: Map<string, number>,
  raw: string | null | undefined,
  baseWeight = 1,
): void {
  if (!raw) return;
  const color = parseColor(raw);
  if (!color || isNearWhiteOrBlack(color)) return;
  const weight = isWarmGoldTone(color) ? baseWeight * 7 : baseWeight;
  colorHits.set(color, (colorHits.get(color) ?? 0) + weight);
}

/** Strato/cm4all-sites hebben vaak geen <header>; favicons kunnen truncatie-data-URLs zijn. */
function isUsableLogoSrc(src: string | undefined): src is string {
  if (!src?.trim()) return false;
  const value = src.trim();
  if (/pixel\.img|tracking|1x1|spacer|blank\.gif/i.test(value)) return false;

  if (value.startsWith("data:")) {
    const payload = value.split(",")[1] ?? "";
    if (payload.length < 48) return false;
    try {
      const bytes = Buffer.from(payload, "base64");
      return bytes.length >= 32;
    } catch {
      return false;
    }
  }

  return true;
}

function collectWixUrlsFromHtml(html: string): string[] {
  const decoded = html.replace(/%2C/gi, ",").replace(/%7E/gi, "~");
  const found = new Set<string>();
  for (const match of decoded.matchAll(
    /https?:\/\/static\.wixstatic\.com\/media\/[^"'\\s<>\\)]+/gi
  )) {
    const value = match[0].replace(/\\+$/, "");
    if (isUsableLogoSrc(value)) found.add(value);
  }
  return [...found];
}

function collectLogoCandidates($: cheerio.CheerioAPI, html: string, pageUrl: string): string[] {
  const raw: string[] = [];
  const push = (value?: string | null) => {
    if (value) raw.push(value);
  };

  push($('link[rel="apple-touch-icon"]').attr("href"));
  $('link[rel="icon"]').each((_, el) => {
    push($(el).attr("href"));
  });

  push($("header img[src$='.svg'], img[class*='logo'][src$='.svg']").first().attr("src"));
  push($("header img, .logo img, a[class*='logo'] img, img[class*='logo']").first().attr("src"));
  push($("nav img, #navigation img, .navigation img").first().attr("src"));
  push($("#SITE_HEADER img, [id*='header' i] img").first().attr("src"));
  $("img[src*='logo' i], img[alt*='logo' i], img[title*='logo' i]").each((_, el) => {
    push($(el).attr("src"));
    push($(el).attr("data-src"));
  });
  $("img[src*='wixstatic' i], img[src*='onewebmedia' i], img[src*='usercontent.one' i]").each(
    (_, el) => {
      push($(el).attr("src"));
      push($(el).attr("data-src"));
    }
  );
  for (const url of collectWixUrlsFromHtml(html)) {
    push(url);
  }
  const squarespaceLogo = pickWebsiteLogoFromHtml(html, pageUrl);
  if (squarespaceLogo) push(squarespaceLogo);
  $("[style*='background']").each((_, el) => {
    const matches = ($(el).attr("style") ?? "").matchAll(/url\(['"]?([^'")]+)['"]?\)/gi);
    for (const match of matches) {
      if (/logo|wixstatic|brand|wordmark|onewebmedia/i.test(match[1] ?? "")) {
        push(match[1]);
      }
    }
  });
  push($('meta[property="og:image"]').attr("content"));
  push($("header img, .logo img").first().attr("data-src"));

  return raw.filter(isUsableLogoSrc);
}

function scoreLogoUrl(src: string): number {
  const lower = src.toLowerCase();
  const decoded = decodeURIComponent(lower);
  let score = 0;
  if (isGoogleBusinessProfilePhoto(src)) score -= 120;
  if (/logo|brand|wordmark|merk/.test(lower)) score += 40;
  if (/wixstatic\.com|onewebmedia|usercontent\.one|squarespace-cdn/.test(lower)) score += 12;
  if (/\.svg(\?|$)/.test(lower)) score += 20;
  if (/shutterstock|stockphoto|stock-photo|hero|banner|slide|carousel|background/.test(lower)) {
    score -= 40;
  }
  if (/pixel|tracker|spacer/.test(lower)) score -= 30;
  if (/blur_/i.test(lower)) score -= 50;

  const dims = wixFillDims(src);
  if (dims) {
    const ratio = dims.w / dims.h;
    if (ratio >= 0.85 && ratio <= 1.15) score += 50;
    else if (ratio > 1.55 || ratio < 0.65) score -= 70;
    if (dims.w >= 180 && dims.h >= 180 && ratio >= 0.85 && ratio <= 1.15) score += 30;
    if (dims.w < 80 && dims.h < 80) score -= 5;
  }

  if (/w_180,h_180|w_192,h_192|w_321,h_321|w_320,h_320/.test(decoded)) score += 28;

  return score;
}

function pickBestLogo(candidates: string[], pageUrl: string): string | null {
  const ranked = new Map<string, number>();
  for (const src of candidates) {
    try {
      const absolute = new URL(src, pageUrl).toString();
      if (isLikelyNonLogoImage(absolute)) continue;
      const score = scoreLogoUrl(absolute);
      ranked.set(absolute, Math.max(ranked.get(absolute) ?? Number.NEGATIVE_INFINITY, score));
    } catch {
      /* ignore invalid */
    }
  }
  const best = [...ranked.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] <= 0) return null;

  const mediaId = best[0].match(/media\/([^/?#]+~mv2\.\w+)/i)?.[1];
  if (mediaId && /wixstatic\.com/i.test(best[0])) {
    const dims = wixFillDims(best[0]);
    const ratio = dims ? dims.w / dims.h : 1;
    if (ratio >= 0.85 && ratio <= 1.15) {
      return buildWixSquareLogoUrl(mediaId);
    }
  }

  return upgradeLogoUrl(best[0]);
}

export function extractBrand(
  intelligence: WebsiteIntelligence,
  discoveryLogo?: string | null
): BrandProfile {
  const sources: string[] = [];
  const colorHits = new Map<string, number>();
  let logoUrl: string | null = null;
  let logoSource: string | null = null;
  const logoCandidateScores = new Map<string, number>();
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
        registerColorHit(colorHits, m[1], 3);
        sources.push("inline-css-var");
      }
      const bg = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      if (bg) registerColorHit(colorHits, bg[1], 2);
      const col = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
      if (col) registerColorHit(colorHits, col[1], 1);
    });

    $("style").each((_, el) => {
      const css = $(el).text();
      const varMatches = css.matchAll(
        /--[a-z0-9-]*(?:brand|primary|accent|secondary)[a-z0-9-]*\s*:\s*([^;}\n]+)/gi
      );
      for (const m of varMatches) {
        registerColorHit(colorHits, m[1], 4);
        sources.push("stylesheet-var");
      }
      for (const match of css.matchAll(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi)) {
        registerColorHit(colorHits, match[0], 2);
      }
      const fontMatch = css.match(/font-family\s*:\s*([^;}\n]+)/i);
      if (fontMatch && !fontHeading) {
        fontHeading = fontMatch[1].split(",")[0]?.replace(/['"]/g, "").trim() ?? null;
        fontBody = fontHeading;
      }
    });

    for (const src of collectLogoCandidates($, page.html, page.url)) {
      const best = pickBestLogo([src], page.url);
      if (!best) continue;
      const score = scoreLogoUrl(best);
      logoCandidateScores.set(best, Math.max(logoCandidateScores.get(best) ?? score, score));
    }
  }

  if (logoCandidateScores.size > 0) {
    const [bestUrl] = [...logoCandidateScores.entries()].sort((a, b) => b[1] - a[1])[0]!;
    logoUrl = upgradeLogoUrl(bestUrl);
    logoSource = /wixstatic|onewebmedia|usercontent\.one/i.test(bestUrl)
      ? "hosted-logo"
      : bestUrl.includes("icon")
        ? "favicon"
        : bestUrl.endsWith(".svg")
          ? "header-logo-svg"
          : "header-logo";
    sources.push(logoSource);
  }

  if (!logoUrl && discoveryLogo && isUsableLogoSrc(discoveryLogo)) {
    if (!isGoogleBusinessProfilePhoto(discoveryLogo)) {
      logoUrl = upgradeLogoUrl(discoveryLogo);
      logoSource = "google-business-logo";
      sources.push(logoSource);
    }
  }

  if (themeColor) {
    registerColorHit(colorHits, themeColor, 6);
  }

  const ranked = [...colorHits.entries()].sort((a, b) => b[1] - a[1]);
  const primary = ranked[0]?.[0] ?? "#1A1614";
  const secondary = ranked.find(([c]) => luminance(c) > 0.75)?.[0] ?? "#F4EFE6";
  const accent =
    pickBrandGoldAccent(...ranked.map(([color]) => color)) ??
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

/** Verrijkt CSS-scrape met dominante kleuren uit het logo zelf. */
export async function enrichBrandFromLogo(
  brand: BrandProfile
): Promise<BrandProfile> {
  if (!brand.logo_url) return brand;

  try {
    const logoPalette = await extractLogoPalette(brand.logo_url);
    if (!logoPalette) return brand;

    const merged = mergeBrandWithLogo(
      {
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        accent_color: brand.accent_color,
      },
      logoPalette
    );

    const accent =
      pickBrandGoldAccent(
        brand.accent_color,
        merged.accent,
        logoPalette.accent,
        ...logoPalette.samples,
      ) ?? merged.accent;

    const changed =
      merged.primary !== brand.primary_color ||
      merged.secondary !== brand.secondary_color ||
      accent !== brand.accent_color;

    if (!changed) return brand;

    return {
      ...brand,
      primary_color: merged.primary,
      secondary_color: merged.secondary,
      accent_color: accent,
      confidence: Math.min(0.98, brand.confidence + 0.12),
      sources: [...brand.sources, "logo-palette"],
    };
  } catch {
    return brand;
  }
}
