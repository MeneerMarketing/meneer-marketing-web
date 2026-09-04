import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  isNearWhiteOrBlack,
  isWarmGoldTone,
  normalizeHex,
  relativeLuminance,
  rgbToHex,
  saturation,
} from "@/lib/color";

export interface LogoPalette {
  primary: string;
  secondary: string;
  accent: string;
  samples: string[];
}

const SKIP_COLOR = new Set([
  "none",
  "transparent",
  "currentcolor",
  "inherit",
  "initial",
  "unset",
]);

function parseCssColor(raw: string): string | null {
  const value = raw.trim();
  const lowered = value.toLowerCase();
  if (SKIP_COLOR.has(lowered) || lowered.startsWith("url(")) return null;

  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    return normalizeHex(value);
  }

  const rgb = raw.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgb) {
    return rgbToHex(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]));
  }

  return null;
}

function scoreColor(hex: string, weight: number): number {
  const sat = saturation(hex);
  const lum = relativeLuminance(hex);
  const vivid = sat * (lum > 0.12 && lum < 0.88 ? 1 : 0.35);
  return weight * (1 + vivid * 2);
}

function rankColors(colors: string[]): string[] {
  const counts = new Map<string, number>();
  for (const raw of colors) {
    const hex = parseCssColor(raw);
    if (!hex || isNearWhiteOrBlack(hex)) continue;
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => scoreColor(b[0], b[1]) - scoreColor(a[0], a[1]))
    .map(([hex]) => hex);
}

function mapSamplesToBrand(samples: string[]): LogoPalette | null {
  if (samples.length === 0) return null;

  const byLuminance = [...samples].sort(
    (a, b) => relativeLuminance(a) - relativeLuminance(b)
  );
  const primary =
    byLuminance.find((hex) => relativeLuminance(hex) < 0.42) ?? byLuminance[0]!;
  const secondary =
    [...byLuminance]
      .reverse()
      .find((hex) => relativeLuminance(hex) > 0.7 && hex !== primary) ??
    lightenBrandPaper(primary);
  const accent =
    samples
      .filter((hex) => hex !== primary && hex !== secondary)
      .sort((a, b) => {
        const goldA = isWarmGoldTone(a) ? 1 : 0;
        const goldB = isWarmGoldTone(b) ? 1 : 0;
        if (goldB !== goldA) return goldB - goldA;
        return saturation(b) - saturation(a);
      })[0] ??
    samples.find((hex) => hex !== primary) ??
    primary;

  return {
    primary,
    secondary,
    accent,
    samples,
  };
}

function lightenBrandPaper(ink: string): string {
  return rgbToHex(
    Math.round(248 - relativeLuminance(ink) * 18),
    Math.round(244 - relativeLuminance(ink) * 20),
    Math.round(238 - relativeLuminance(ink) * 22)
  );
}

function extractColorsFromSvg(text: string): string[] {
  const hits: string[] = [];

  const attrMatches = text.matchAll(
    /(?:fill|stroke|stop-color)\s*=\s*["']([^"']+)["']/gi
  );
  for (const match of attrMatches) {
    hits.push(match[1]!);
  }

  const styleMatches = text.matchAll(
    /(?:fill|stroke|stop-color|color)\s*:\s*([^;}"'\n]+)/gi
  );
  for (const match of styleMatches) {
    hits.push(match[1]!);
  }

  return rankColors(hits);
}

function isLikelyHtml(bytes: Buffer): boolean {
  const head = bytes.subarray(0, 256).toString("utf8").trimStart().toLowerCase();
  return head.startsWith("<!doctype") || head.startsWith("<html");
}

function isLikelySvg(bytes: Buffer, url: string, contentType: string): boolean {
  if (/\.svg($|\?)/i.test(url) || contentType.includes("image/svg")) return true;
  const head = bytes.subarray(0, 512).toString("utf8").toLowerCase();
  return head.includes("<svg");
}

function isLikelyRaster(bytes: Buffer): boolean {
  if (bytes.length < 24) return false;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return true;
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return true;
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") {
    return true;
  }
  return false;
}

async function loadLogoBytes(logoUrl: string): Promise<{
  bytes: Buffer;
  isSvg: boolean;
} | null> {
  try {
    if (logoUrl.startsWith("data:")) {
      const payload = logoUrl.split(",")[1] ?? "";
      if (payload.length < 48) return null;
      const bytes = Buffer.from(payload, "base64");
      if (bytes.length < 32 || isLikelyHtml(bytes)) return null;
      return {
        bytes,
        isSvg: isLikelySvg(bytes, logoUrl, ""),
      };
    }

    if (logoUrl.startsWith("/")) {
      const filePath = join(process.cwd(), "public", logoUrl.replace(/^\//, ""));
      const bytes = await readFile(filePath);
      if (isLikelyHtml(bytes)) return null;
      return { bytes, isSvg: isLikelySvg(bytes, logoUrl, "") };
    }

    const absolute = logoUrl.startsWith("//") ? `https:${logoUrl}` : logoUrl;
    const response = await fetch(absolute, {
      signal: AbortSignal.timeout(8_000),
      headers: { "User-Agent": "MeneerMarketing-Preview/1.0" },
    });
    if (!response.ok) return null;

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 32 || isLikelyHtml(bytes)) return null;

    const contentType = response.headers.get("content-type") ?? "";
    const isSvg = isLikelySvg(bytes, absolute, contentType);

    return { bytes, isSvg };
  } catch {
    return null;
  }
}

async function extractColorsFromRaster(bytes: Buffer): Promise<string[]> {
  if (!isLikelyRaster(bytes)) return [];

  try {
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(bytes)
      .resize(72, 72, { fit: "inside", withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const counts = new Map<string, number>();
    for (let i = 0; i < data.length; i += info.channels) {
      const alpha = info.channels === 4 ? data[i + 3]! : 255;
      if (alpha < 96) continue;

      const r = Math.round(data[i]! / 24) * 24;
      const g = Math.round(data[i + 1]! / 24) * 24;
      const b = Math.round(data[i + 2]! / 24) * 24;
      const hex = rgbToHex(r, g, b);
      if (isNearWhiteOrBlack(hex)) continue;
      counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => scoreColor(b[0], b[1]) - scoreColor(a[0], a[1]))
      .map(([hex]) => hex);
  } catch {
    return [];
  }
}

/** Haalt dominante merk-kleuren uit een logo (SVG of raster). Server-only. */
export async function extractLogoPalette(
  logoUrl: string
): Promise<LogoPalette | null> {
  const loaded = await loadLogoBytes(logoUrl);
  if (!loaded) return null;

  const samples = loaded.isSvg
    ? extractColorsFromSvg(loaded.bytes.toString("utf8"))
    : await extractColorsFromRaster(loaded.bytes);

  return mapSamplesToBrand(samples);
}

export interface LogoAppearance {
  /** Logo is overwegend licht (wit/goud) — geen invert-filter. */
  isLight: boolean;
  /** Logo heeft een ondoorzichtige witte/lichte achtergrond (typisch JPG-export). */
  hasOpaqueLightBackground: boolean;
}

function analyzeSvgAppearance(svgText: string): LogoAppearance | null {
  const samples = extractColorsFromSvg(svgText);
  const lowered = svgText.toLowerCase();
  const hasWhiteRect =
    /<rect[^>]+fill\s*=\s*["']?(?:#fff(?:fff)?|white)["']?/i.test(lowered) ||
    /background(?:-color)?\s*:\s*(?:#fff(?:fff)?|white|rgb\(\s*255)/i.test(lowered);

  if (samples.length === 0) {
    return {
      isLight: true,
      hasOpaqueLightBackground: hasWhiteRect,
    };
  }

  const avg = samples.reduce((sum, hex) => sum + relativeLuminance(hex), 0) / samples.length;
  return {
    isLight: avg > 0.55,
    hasOpaqueLightBackground: hasWhiteRect || avg > 0.82,
  };
}

async function analyzeRasterAppearance(bytes: Buffer): Promise<LogoAppearance | null> {
  try {
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(bytes)
      .resize(96, 96, { fit: "inside", withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let total = 0;
    let weight = 0;
    let opaque = 0;
    let lightOpaque = 0;

    for (let i = 0; i < data.length; i += info.channels) {
      const alpha = info.channels === 4 ? data[i + 3]! : 255;
      if (alpha < 96) continue;

      opaque += 1;
      const hex = rgbToHex(data[i]!, data[i + 1]!, data[i + 2]!);
      const lum = relativeLuminance(hex);
      if (lum > 0.88) lightOpaque += 1;

      if (isNearWhiteOrBlack(hex)) continue;
      total += lum * (alpha / 255);
      weight += alpha / 255;
    }

    const hasOpaqueLightBackground = opaque > 0 && lightOpaque / opaque > 0.42;

    if (weight < 0.05) {
      return { isLight: true, hasOpaqueLightBackground };
    }

    return {
      isLight: total / weight > 0.58,
      hasOpaqueLightBackground,
    };
  } catch {
    return null;
  }
}

/** Bepaalt hoe een logo op donkere heroes getoond wordt. */
export async function analyzeLogoAppearance(logoUrl: string): Promise<LogoAppearance | null> {
  const loaded = await loadLogoBytes(logoUrl);
  if (!loaded) return null;

  if (loaded.isSvg) {
    return analyzeSvgAppearance(loaded.bytes.toString("utf8"));
  }

  return analyzeRasterAppearance(loaded.bytes);
}

const LIGHT_BG_THRESHOLD = 238;
const LIGHT_BG_FEATHER = 14;

/**
 * Maakt bijna-witte pixels transparant (JPG-logo's met wit vlak).
 * Retourneert een PNG data-URL voor preview-weergave.
 */
export async function stripLogoLightBackground(logoUrl: string): Promise<string | null> {
  const loaded = await loadLogoBytes(logoUrl);
  if (!loaded || loaded.isSvg) return null;

  try {
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(loaded.bytes)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const edge = LIGHT_BG_THRESHOLD - LIGHT_BG_FEATHER;

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const spread = max - min;

      if (spread > 22 || min < edge) continue;

      const fade = Math.max(0, Math.min(1, (min - edge) / LIGHT_BG_FEATHER));
      const alpha = data[i + 3] ?? 255;
      data[i + 3] = Math.round(alpha * (1 - fade));
    }

    const png = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer();

    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}
