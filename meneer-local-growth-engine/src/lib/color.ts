/**
 * Kleurhulpen voor brand-driven templates.
 * Brandprofielen komen uit scraping, dus waarden zijn niet te vertrouwen:
 * bijna-witte "primary" of een pastel "accent" mogen de leesbaarheid niet slopen.
 */

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHex(value: string | null | undefined): value is string {
  return typeof value === "string" && HEX.test(value.trim());
}

export function normalizeHex(value: string): string {
  const raw = value.trim().toLowerCase();
  if (raw.length === 4) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
  }
  return raw;
}

function channels(hex: string): [number, number, number] {
  const full = normalizeHex(hex).slice(1);
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

function toLinear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map(toLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function saturation(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => c * 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

export function mixHex(a: string, b: string, weight: number): string {
  const w = Math.max(0, Math.min(1, weight));
  const [ar, ag, ab] = channels(a).map((c) => c * 255) as [number, number, number];
  const [br, bg, bb] = channels(b).map((c) => c * 255) as [number, number, number];
  return rgbToHex(ar + (br - ar) * w, ag + (bg - ag) * w, ab + (bb - ab) * w);
}

export function lighten(hex: string, amount: number): string {
  return mixHex(hex, "#ffffff", amount);
}

export function darken(hex: string, amount: number): string {
  return mixHex(hex, "#000000", amount);
}

export function isNearWhiteOrBlack(hex: string): boolean {
  const l = relativeLuminance(hex);
  return l > 0.92 || l < 0.08;
}

/** Goud/geel merkaccent (typisch huidklinieken, luxe branding). */
export function isWarmGoldTone(hex: string): boolean {
  if (!isHex(hex)) return false;
  const full = normalizeHex(hex).slice(1);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const sat = saturation(hex);
  const lum = relativeLuminance(hex);
  return r > 150 && g > 110 && b < r * 0.92 && sat > 0.22 && lum > 0.22 && lum < 0.88;
}

/** Kies het meest opvallende accent uit twee kandidaten (voor logo vs. scrape). */
export function pickVividAccent(current: string, candidate: string): string {
  if (!isHex(candidate)) return current;
  if (!isHex(current)) return candidate;
  const goldCandidate = isWarmGoldTone(candidate);
  const goldCurrent = isWarmGoldTone(current);
  if (goldCandidate && !goldCurrent) return candidate;
  if (goldCandidate && goldCurrent) {
    return relativeLuminance(candidate) >= relativeLuminance(current) ? candidate : current;
  }
  if (saturation(candidate) > saturation(current) + 0.14) return candidate;
  return current;
}

/** Kiest het lichtste warme goud uit logo-, site- en snapshot-kleuren (typisch #DBC88F). */
export function pickBrandGoldAccent(
  ...candidates: Array<string | null | undefined>
): string | null {
  const golds = candidates
    .filter((value): value is string => isHex(value) && isWarmGoldTone(value))
    .map((value) => normalizeHex(value));

  if (golds.length === 0) return null;

  return [...golds].sort((a, b) => relativeLuminance(b) - relativeLuminance(a))[0]!;
}

/** Olijf/khaki uit scrapes lezen groen op donkere vlakken; cinematic wil warm bruin. */
export function isOliveKhaki(hex: string): boolean {
  if (!isHex(hex)) return false;
  const full = normalizeHex(hex).slice(1);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return g >= r - 14 && g > b + 6 && r > 48 && b < r;
}

/** Zet olijfgroene brand-primaries om naar chocoladebruin (NOU-achtig). */
export function toWarmBrandBrown(hex: string): string {
  if (!isHex(hex)) return hex;
  const normalized = normalizeHex(hex);
  if (!isOliveKhaki(normalized)) return normalized;

  const full = normalized.slice(1);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  const shifted = rgbToHex(
    Math.min(255, Math.round(r * 1.06 + 20)),
    Math.max(0, Math.round(g * 0.74)),
    Math.max(0, Math.round(b * 0.7))
  );

  return mixHex(shifted, "#3a2c24", 0.22);
}

export interface ColorGuardOptions {
  fallback: string;
  maxLuminance?: number;
  minLuminance?: number;
  contrastAgainst?: string;
  minContrast?: number;
}

/** Neemt de brandkleur over zolang die binnen de gestelde grenzen valt. */
export function guardColor(
  value: string | null | undefined,
  options: ColorGuardOptions
): string {
  if (!isHex(value)) return options.fallback;
  const hex = normalizeHex(value);

  if (options.maxLuminance !== undefined && relativeLuminance(hex) > options.maxLuminance) {
    return options.fallback;
  }
  if (options.minLuminance !== undefined && relativeLuminance(hex) < options.minLuminance) {
    return options.fallback;
  }
  if (
    options.contrastAgainst &&
    options.minContrast !== undefined &&
    contrastRatio(hex, options.contrastAgainst) < options.minContrast
  ) {
    return options.fallback;
  }
  return hex;
}
