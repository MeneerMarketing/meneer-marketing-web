/**
 * Skin clinics — city outreach capacity (M8.4 patroon).
 */

export type { VerticalOutreachCapacityConfig } from "@/verticals/pilates/outreachCapacity";

function num(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export const skinClinicsOutreachCapacityConfig = {
  maxActiveOutreachPerCity: num("SKIN_CLINICS_MAX_ACTIVE_OUTREACH_PER_CITY", 0),
  requireUniqueTemplatePerCity: process.env.SKIN_CLINICS_REQUIRE_UNIQUE_TEMPLATE !== "0",
  activeTemplateVariants: ["editorial", "soft-movement", "reformer-minimal", "clinical-atelier"] as const,
};
