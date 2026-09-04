import { getVerticalRuntime } from "@/verticals/runtime";
import type { KeywordIntent } from "@/verticals/pilates/seo";

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
  verticalSlug?: string;
}): string[] {
  const verticalSlug = input.verticalSlug ?? "pilates";
  const runtime = getVerticalRuntime(verticalSlug);

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

  if (verticalSlug === "skin-clinics") {
    if (/botox/.test(blob)) types.push("botox");
    if (/filler|fillers/.test(blob)) types.push("fillers");
    if (/laser|ipl|bbl/.test(blob)) types.push("laser");
    if (/hydrafacial/.test(blob)) types.push("hydrafacial");
    if (/microneedling/.test(blob)) types.push("microneedling");
    if (/peeling|peel\b/.test(blob)) types.push("peeling");
    if (/huidanalyse|skin analysis/.test(blob)) types.push("huidanalyse");
    if (/acne/.test(blob)) types.push("acne");
    if (/pigment|melasma/.test(blob)) types.push("pigment");
    if (/intake|consult/.test(blob)) types.push("intake");
    if (/huidkliniek|skin clinic|cosmetisch/.test(blob) && types.length === 0) {
      types.push("huidkliniek");
    }
    return Array.from(new Set(types));
  }

  if (/reformer/.test(blob)) types.push("reformer");
  if (/mat\s*pilates|matwork/.test(blob)) types.push("mat");
  if (/private|1[\s-]?op[\s-]?1|een[\s-]?op[\s-]?een|personal pilates|privé/.test(blob)) {
    types.push("private");
  }
  if (/duo/.test(blob)) types.push("duo");
  if (/pre[\s-]?natal|zwanger/.test(blob)) types.push("prenatal");
  if (/post[\s-]?natal/.test(blob)) types.push("postnatal");
  if (/yoga/.test(blob)) types.push("yoga");
  if (/pilates/.test(blob) && types.length === 0) types.push(runtime.seo.coreServiceFallback);
  return Array.from(new Set(types));
}

export function generateKeywordsForCity(
  cityName: string,
  serviceTypes: string[],
  verticalSlug = "pilates",
): GeneratedKeyword[] {
  const runtime = getVerticalRuntime(verticalSlug);
  const out: GeneratedKeyword[] = [];
  for (const tpl of runtime.seo.templates) {
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
  const seen = new Set<string>();
  return out.filter((k) => {
    const key = k.keyword.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateCityKeywordUniverse(
  cityName: string,
  allServiceTypeSets: string[][],
  verticalSlug = "pilates",
): GeneratedKeyword[] {
  const runtime = getVerticalRuntime(verticalSlug);
  const union = new Set<string>();
  for (const set of allServiceTypeSets) {
    for (const t of set) union.add(t);
  }
  union.add(runtime.seo.coreServiceFallback);
  return generateKeywordsForCity(cityName, Array.from(union), verticalSlug);
}
