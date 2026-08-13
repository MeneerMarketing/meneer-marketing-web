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
