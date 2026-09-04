import type { ExtractedService, WebsiteIntelligence } from "./types";

const CLINIC_SERVICE_PATTERNS: Array<{
  type: string;
  pattern: RegExp;
  label: string;
  core?: boolean;
}> = [
  { type: "laser", pattern: /laser\s*ontharing|laserbehandeling|\blaser\b/i, label: "Laserbehandelingen", core: true },
  { type: "peel", pattern: /chemical\s*peel|gezichtspeeling|\bpeel\b/i, label: "Peelings", core: true },
  { type: "botox", pattern: /\bbotox\b|botuline/i, label: "Botox", core: true },
  { type: "filler", pattern: /\bfiller(s)?\b|hyaluron/i, label: "Fillers", core: true },
  { type: "microneedling", pattern: /microneedling|microneedle|dermapen/i, label: "Microneedling" },
  { type: "hifu", pattern: /\bhifu\b|ulthera|lifting zonder operatie/i, label: "HIFU lifting" },
  { type: "acne", pattern: /\bacne\b|puistjes|ontstoken huid/i, label: "Acnebehandeling" },
  { type: "pigment", pattern: /pigmentvlek|melasma|hyperpigment/i, label: "Pigmentbehandeling" },
  { type: "rosacea", pattern: /rosacea|couperose/i, label: "Rosacea" },
  { type: "scar", pattern: /litteken|acnelittekens/i, label: "Littekenbehandeling" },
  { type: "skinbooster", pattern: /skin\s*booster|profhilo/i, label: "Skinboosters" },
  { type: "facial", pattern: /gezichtsbehandeling|facial|huidverbetering/i, label: "Gezichtsbehandelingen" },
  { type: "intake", pattern: /gratis\s*intake|huidanalyse|consult/i, label: "Huidanalyse & intake" },
];

export function extractSkinClinicServices(intelligence: WebsiteIntelligence): {
  services: ExtractedService[];
  primary_service: string;
  secondary_services: string[];
} {
  const blob = [
    ...intelligence.raw_headings,
    ...intelligence.pages.map((p) => `${p.title} ${p.text.slice(0, 5000)}`),
  ].join("\n");

  const found: ExtractedService[] = [];

  for (const def of CLINIC_SERVICE_PATTERNS) {
    if (!def.pattern.test(blob)) continue;
    const sourcePage =
      intelligence.pages.find((p) => def.pattern.test(`${p.title} ${p.text}`))?.url ?? null;
    found.push({
      service_name: def.label,
      service_type: def.type,
      source_url: sourcePage,
      confidence: sourcePage ? 0.88 : 0.62,
      short_factual_description: `${def.label} genoemd op de website.`,
      is_core: Boolean(def.core),
    });
  }

  if (found.length === 0 && /huidkliniek|skin\s*clinic|cosmetisch|esthetisch|derma/i.test(blob)) {
    found.push({
      service_name: "Huidbehandelingen",
      service_type: "clinic",
      source_url: intelligence.pages[0]?.url ?? null,
      confidence: 0.58,
      short_factual_description: "Huidkliniek met medisch-esthetische behandelingen.",
      is_core: true,
    });
  }

  const core = found.filter((s) => s.is_core);
  const primary =
    core.find((s) => s.service_type === "laser")?.service_name ??
    core.find((s) => s.service_type === "intake")?.service_name ??
    core[0]?.service_name ??
    found[0]?.service_name ??
    "Medisch esthetische zorg";

  const secondary = found
    .filter((s) => s.service_name !== primary)
    .map((s) => s.service_name);

  return { services: found, primary_service: primary, secondary_services: secondary };
}
