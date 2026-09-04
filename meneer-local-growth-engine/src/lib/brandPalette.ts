import type { CSSProperties } from "react";
import {
  darken,
  guardColor,
  isHex,
  isWarmGoldTone,
  lighten,
  mixHex,
  normalizeHex,
  pickBrandGoldAccent,
  pickVividAccent,
  relativeLuminance,
  toWarmBrandBrown,
} from "@/lib/color";
import type { LogoPalette } from "@/lib/logoColorExtractor";
import type { StudioData } from "@/types/studio";

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export type BrandStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

const DEFAULT_BRAND: BrandColors = {
  primary: "#1a1614",
  secondary: "#f4efe6",
  accent: "#c4a484",
};

const CLINIC_FALLBACK: BrandColors = {
  primary: "#2c2824",
  secondary: "#faf8f5",
  accent: "#5a6354",
};

const CINEMATIC_FALLBACK: BrandColors = {
  primary: "#4e1a0f",
  secondary: "#f8f4ed",
  accent: "#7a4028",
};

const EDITORIAL_FALLBACK: BrandColors = {
  primary: "#2a211a",
  secondary: "#f8f4ee",
  accent: "#9c6b45",
};

const GENERIC_ACCENT_HEX = new Set(
  [
    DEFAULT_BRAND.accent,
    EDITORIAL_FALLBACK.accent,
    CLINIC_FALLBACK.accent,
    CINEMATIC_FALLBACK.accent,
    "#c4a484",
    "#9c6b45",
    "#5a6354",
    "#7a4028",
  ].map((hex) => normalizeHex(hex)),
);

function isGenericAccent(hex: string): boolean {
  return GENERIC_ACCENT_HEX.has(normalizeHex(hex));
}

function isDefaultSnapshotColor(
  value: string | null | undefined,
  slot: keyof BrandColors
): boolean {
  if (!isHex(value)) return true;
  return normalizeHex(value) === DEFAULT_BRAND[slot];
}

export interface BrandColorInput {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export function shouldPreferLogoColors(input: BrandColorInput): boolean {
  return (
    isDefaultSnapshotColor(input.primary_color, "primary") &&
    isDefaultSnapshotColor(input.secondary_color, "secondary") &&
    isDefaultSnapshotColor(input.accent_color, "accent")
  );
}

export function mergeBrandWithLogo(
  input: BrandColorInput,
  logoPalette: LogoPalette
): BrandColors {
  const scraped: BrandColors = {
    primary: input.primary_color,
    secondary: input.secondary_color,
    accent: input.accent_color,
  };

  if (shouldPreferLogoColors(input)) {
    return {
      primary: logoPalette.primary,
      secondary: logoPalette.secondary,
      accent: logoPalette.accent,
    };
  }

  return {
    primary: isDefaultSnapshotColor(scraped.primary, "primary")
      ? logoPalette.primary
      : scraped.primary,
    secondary: isDefaultSnapshotColor(scraped.secondary, "secondary")
      ? logoPalette.secondary
      : scraped.secondary,
    accent: pickVividAccent(
      pickBrandGoldAccent(
        scraped.accent,
        logoPalette.accent,
        ...logoPalette.samples,
      ) ??
        (isDefaultSnapshotColor(scraped.accent, "accent") || isGenericAccent(scraped.accent)
          ? logoPalette.accent
          : scraped.accent),
      logoPalette.accent,
    ),
  };
}

export function resolveBrandColors(studio: StudioData): BrandColors {
  return {
    primary: studio.primary_color,
    secondary: studio.secondary_color,
    accent: studio.accent_color,
  };
}

function resolveAccentColor(colors: BrandColors, fallback: string): string {
  const gold = pickBrandGoldAccent(colors.accent);
  if (gold) return gold;

  const paper = guardColor(colors.secondary, {
    fallback: EDITORIAL_FALLBACK.secondary,
    minLuminance: 0.72,
  });

  return guardColor(colors.accent, {
    fallback,
    contrastAgainst: paper,
    minContrast: 3,
  });
}

export function resolveEditorialPalette(studio: StudioData): BrandColors {
  const colors = resolveBrandColors(studio);
  return {
    primary: guardColor(colors.primary, {
      fallback: EDITORIAL_FALLBACK.primary,
      maxLuminance: 0.22,
    }),
    secondary: guardColor(colors.secondary, {
      fallback: EDITORIAL_FALLBACK.secondary,
      minLuminance: 0.72,
    }),
    accent: resolveAccentColor(colors, EDITORIAL_FALLBACK.accent),
  };
}

export function buildEditorialBrandStyle(studio: StudioData): BrandStyle {
  const palette = resolveEditorialPalette(studio);
  return {
    "--ed-ink": palette.primary,
    "--ed-paper": palette.secondary,
    "--ed-accent-base": palette.accent,
  };
}

export function buildClinicBrandStyle(studio: StudioData): BrandStyle {
  const colors = resolveBrandColors(studio);
  const ink = guardColor(colors.primary, {
    fallback: CLINIC_FALLBACK.primary,
    maxLuminance: 0.24,
  });
  const paper = guardColor(colors.secondary, {
    fallback: CLINIC_FALLBACK.secondary,
    minLuminance: 0.72,
  });
  const accentDeep = resolveAccentColor(colors, CLINIC_FALLBACK.accent);
  const accent = mixHex(accentDeep, paper, 0.28);
  const accentSoft = mixHex(paper, accentDeep, 0.14);
  const mist = mixHex(paper, ink, 0.05);
  const wash = mixHex(paper, accentDeep, 0.1);
  const line = mixHex(wash, ink, 0.12);
  const dark = darken(ink, 0.06);
  const darkDeeper = darken(ink, 0.16);

  return {
    "--fc-ink": ink,
    "--fc-ink-soft": mixHex(ink, paper, 0.48),
    "--fc-ink-mute": mixHex(ink, paper, 0.38),
    "--fc-ink-faint": mixHex(ink, paper, 0.28),
    "--fc-label": mixHex(ink, paper, 0.42),
    "--fc-paper": paper,
    "--fc-mist": mist,
    "--fc-wash": wash,
    "--fc-line": line,
    "--fc-accent": accent,
    "--fc-accent-deep": accentDeep,
    "--fc-accent-soft": accentSoft,
    "--fc-dark": dark,
    "--fc-dark-deeper": darkDeeper,
    "--fc-on-dark": paper,
    "--fc-on-dark-body": mixHex(paper, accentDeep, 0.22),
    "--fc-on-dark-label": mixHex(paper, accentDeep, 0.32),
    "--fc-on-dark-btn": lighten(paper, 0.02),
    "--fc-on-dark-btn-text": dark,
  };
}

export function buildCinematicBrandStyle(studio: StudioData): BrandStyle {
  const colors = resolveBrandColors(studio);
  const cream = guardColor(colors.secondary, {
    fallback: CINEMATIC_FALLBACK.secondary,
    minLuminance: 0.72,
  });
  const brown = toWarmBrandBrown(
    guardColor(colors.primary, {
      fallback: CINEMATIC_FALLBACK.primary,
      maxLuminance: 0.38,
    })
  );
  const clay = guardColor(colors.accent, {
    fallback: CINEMATIC_FALLBACK.accent,
    minLuminance: 0.18,
    maxLuminance: 0.62,
  });
  const ink = darken(brown, 0.06);
  const body = mixHex(ink, clay, 0.34);
  const muted = mixHex(ink, clay, 0.48);

  return {
    "--cn-cream": cream,
    "--cn-cream-2": mixHex(cream, clay, 0.08),
    "--cn-ink": ink,
    "--cn-oxblood": brown,
    "--cn-clay": clay,
    "--cn-body": body,
    "--cn-muted": muted,
    "--cn-line": `rgba(${hexToRgbTuple(ink).join(", ")}, 0.14)`,
    "--cn-dark": darken(brown, 0.06),
    "--cn-dark-2": darken(brown, 0.12),
    "--cn-on-dark": cream,
    "--cn-on-dark-soft": `rgba(${hexToRgbTuple(cream).join(", ")}, 0.72)`,
  };
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const full = normalizeHex(hex).slice(1);
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function brandHasLogoTint(colors: BrandColors): boolean {
  return (
    relativeLuminance(colors.primary) !== relativeLuminance(DEFAULT_BRAND.primary) ||
    relativeLuminance(colors.accent) !== relativeLuminance(DEFAULT_BRAND.accent)
  );
}
