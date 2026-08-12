import type { ExtractedService, WebsiteIntelligence } from "./types";

const SERVICE_PATTERNS: Array<{
  type: string;
  pattern: RegExp;
  label: string;
}> = [
  { type: "reformer", pattern: /reformer\s*pilates|pilates\s*reformer|\breformer\b/i, label: "Reformer Pilates" },
  { type: "mat", pattern: /mat\s*pilates|pilates\s*mat|\bmatwork\b/i, label: "Mat Pilates" },
  { type: "private", pattern: /private\s*pilates|priv[ée]\s*pilates|1[\s-]?op[\s-]?1|een[\s-]?op[\s-]?een/i, label: "Private Pilates" },
  { type: "duo", pattern: /duo\s*pilates|pilates\s*duo/i, label: "Duo Pilates" },
  { type: "prenatal", pattern: /pre[\s-]?natal|zwanger/i, label: "Prenatal Pilates" },
  { type: "postnatal", pattern: /post[\s-]?natal|na\s*de\s*bevalling/i, label: "Postnatal Pilates" },
  { type: "barre", pattern: /\bbarre\b/i, label: "Barre" },
  { type: "yoga", pattern: /\byoga\b/i, label: "Yoga" },
  { type: "group", pattern: /groepslessen|group\s*class|klassikale/i, label: "Groepslessen" },
];

export function extractServices(intelligence: WebsiteIntelligence): {
  services: ExtractedService[];
  primary_service: string;
  secondary_services: string[];
} {
  const blob = [
    ...intelligence.raw_headings,
    ...intelligence.pages.map((p) => `${p.title} ${p.text.slice(0, 4000)}`),
  ].join("\n");

  const found: ExtractedService[] = [];

  for (const def of SERVICE_PATTERNS) {
    if (!def.pattern.test(blob)) continue;
    const sourcePage =
      intelligence.pages.find((p) => def.pattern.test(`${p.title} ${p.text}`))?.url ?? null;
    found.push({
      service_name: def.label,
      service_type: def.type,
      source_url: sourcePage,
      confidence: sourcePage ? 0.85 : 0.6,
      short_factual_description: `${def.label} genoemd op de website.`,
      is_core: ["reformer", "mat", "private", "duo"].includes(def.type),
    });
  }

  if (found.length === 0 && /pilates/i.test(blob)) {
    found.push({
      service_name: "Pilates",
      service_type: "pilates",
      source_url: intelligence.pages[0]?.url ?? null,
      confidence: 0.55,
      short_factual_description: "Pilates genoemd op de website zonder specifieke lesvormen.",
      is_core: true,
    });
  }

  const core = found.filter((s) => s.is_core);
  const primary =
    core.find((s) => s.service_type === "reformer")?.service_name ??
    core[0]?.service_name ??
    found[0]?.service_name ??
    "Pilates";

  const secondary = found
    .filter((s) => s.service_name !== primary)
    .map((s) => s.service_name);

  return { services: found, primary_service: primary, secondary_services: secondary };
}
