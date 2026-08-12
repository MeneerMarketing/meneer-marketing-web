import {
  pilatesSeoKeywordStrategy,
  type KeywordIntent,
} from "@/verticals/pilates/seo";

export interface GeneratedKeyword {
  keyword: string;
  intent: KeywordIntent;
  cluster: string;
}

export function detectServiceTypesFromBusiness(input: {
  primary_service?: string | null;
  services?: unknown;
  google_category?: string | null;
  additional_categories?: string[] | null;
  description?: string | null;
  tagline?: string | null;
  studio_name?: string | null;
}): string[] {
  const fromServices = Array.isArray(input.services)
    ? input.services.map((s) => {
        if (s && typeof s === "object" && "name" in s) {
          return String((s as { name?: string }).name ?? "");
        }
        return String(s ?? "");
      })
    : [];

  const blob = [
    input.primary_service,
    input.google_category,
    ...(input.additional_categories ?? []),
    ...fromServices,
    input.description,
    input.tagline,
    input.studio_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const types: string[] = [];
  if (/reformer/.test(blob)) types.push("reformer");
  if (/mat\s*pilates|matwork/.test(blob)) types.push("mat");
  if (/private|1[\s-]?op[\s-]?1|een[\s-]?op[\s-]?een|personal pilates|privé/.test(blob)) {
    types.push("private");
  }
  if (/duo/.test(blob)) types.push("duo");
  if (/pre[\s-]?natal|zwanger/.test(blob)) types.push("prenatal");
  if (/post[\s-]?natal/.test(blob)) types.push("postnatal");
  if (/yoga/.test(blob)) types.push("yoga");
  if (/pilates/.test(blob) && types.length === 0) types.push("pilates");
  return Array.from(new Set(types));
}

export function generateKeywordsForCity(
  cityName: string,
  serviceTypes: string[]
): GeneratedKeyword[] {
  const out: GeneratedKeyword[] = [];
  for (const tpl of pilatesSeoKeywordStrategy.templates) {
    if (tpl.requires?.length) {
      const ok = tpl.requires.some((r) => serviceTypes.includes(r));
      if (!ok) continue;
    }
    out.push({
      keyword: tpl.pattern(cityName),
      intent: tpl.intent,
      cluster: tpl.cluster,
    });
  }
  // Dedupe by keyword text
  const seen = new Set<string>();
  return out.filter((k) => {
    const key = k.keyword.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** City-level union of all service-driven keywords (for shared metrics fetch) */
export function generateCityKeywordUniverse(
  cityName: string,
  allServiceTypeSets: string[][]
): GeneratedKeyword[] {
  const union = new Set<string>();
  for (const set of allServiceTypeSets) {
    for (const t of set) union.add(t);
  }
  // Always include core pilates types for city market view
  union.add("pilates");
  return generateKeywordsForCity(cityName, Array.from(union));
}
