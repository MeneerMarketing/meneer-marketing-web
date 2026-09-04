export type SupportedVerticalSlug = "pilates" | "skin-clinics";

export function normalizeVerticalSlug(
  slug: string | null | undefined,
): SupportedVerticalSlug {
  const normalized = (slug ?? "pilates").toLowerCase();
  if (normalized === "skin-clinics" || normalized === "huidklinieken") {
    return "skin-clinics";
  }
  return "pilates";
}
