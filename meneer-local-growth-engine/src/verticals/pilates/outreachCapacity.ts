/**
 * Milestone 8.4 — Pilates city outreach capacity (geen city exclusivity).
 */

export interface VerticalOutreachCapacityConfig {
  maxActiveOutreachPerCity: number;
  requireUniqueTemplatePerCity: boolean;
  activeTemplateVariants: readonly string[];
}

function num(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** 0 of lager in config, of Infinity na resolve = geen limiet per stad. */
export function isUnlimitedCityOutreach(max: number): boolean {
  return max <= 0 || !Number.isFinite(max);
}

export function resolveCityOutreachMax(configured: number | null | undefined): number {
  const max = configured ?? 0;
  return isUnlimitedCityOutreach(max) ? Number.POSITIVE_INFINITY : max;
}

export const pilatesOutreachCapacityConfig: VerticalOutreachCapacityConfig = {
  maxActiveOutreachPerCity: num("PILATES_MAX_ACTIVE_OUTREACH_PER_CITY", 0),
  requireUniqueTemplatePerCity: process.env.PILATES_REQUIRE_UNIQUE_TEMPLATE !== "0",
  activeTemplateVariants: ["editorial", "reformer-minimal", "soft-movement"] as const,
};
