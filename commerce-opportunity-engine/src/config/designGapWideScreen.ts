/**
 * Milestone 9.5.1 — wide cheap design-gap screen on existing M9.5 pool.
 */

export const M951_DISCOVERY_VERSION = "DESIGN_GAP_WIDE_SCREEN_V1" as const;

export const M951_WIDE_SCREEN = {
  milestone: "M9.5.1",
  /** Max domains with viewport capture + optional vision. */
  maxViewportScreens: 25,
  maxVisionScreens: 25,
  crawlTimeoutMs: 20_000,
  screenshotDir: "m9.5.1-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  screenshotTimeoutMs: 45_000,
  combinedTopN: 10,
  designGapTopN: 10,
} as const;

/** Calibration bands — not hard gates. */
export const GAP_SCORE_BANDS = {
  veryHighMin: 75,
  highMin: 60,
  mediumMin: 40,
} as const;

export type GapScoreBand = "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW";

export function gapScoreBand(score: number | null): GapScoreBand {
  const value = score ?? 0;
  if (value >= GAP_SCORE_BANDS.veryHighMin) return "VERY_HIGH";
  if (value >= GAP_SCORE_BANDS.highMin) return "HIGH";
  if (value >= GAP_SCORE_BANDS.mediumMin) return "MEDIUM";
  return "LOW";
}
