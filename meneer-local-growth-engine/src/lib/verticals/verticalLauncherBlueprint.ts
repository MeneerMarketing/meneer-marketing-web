import { skinClinicsVertical } from "@/verticals/skin-clinics";
import { verticalLauncherCatalog } from "@/verticals/launcher-catalog";
import type { VerticalWizardDraft } from "@/lib/verticals/verticalLauncherWizard.shared";
import {
  inboundSourceFromSlug,
  landingPathFromName,
  slugifyVerticalInput,
} from "@/lib/verticals/verticalLauncherWizard.shared";

const SKIN_CLINIC_NEGATIVE_PATTERNS = skinClinicsVertical.negativeNamePatterns.map((re) =>
  re.source
);

const SKIN_CLINIC_TEMPLATE_VARIANTS = [
  {
    variant: "editorial" as const,
    name: "Editorial Clinic",
    description: "Premium editorial wellness",
  },
  {
    variant: "soft-movement" as const,
    name: "Soft Clinic",
    description: "Warm minimalistisch design",
  },
  {
    variant: "reformer-minimal" as const,
    name: "Minimal Clinic",
    description: "Strak modern clinic-first design",
  },
  {
    variant: "clinical-atelier" as const,
    name: "Atelier Clinical",
    description: "Premium petrol editorial (Figma Setup)",
  },
];

export const SKIN_CLINICS_BLUEPRINT: VerticalWizardDraft = {
  slug: "skin-clinics",
  name: "Huidklinieken",
  description: "Cosmetische en medisch-esthetische huidklinieken",
  blueprintSlug: "skin-clinics",
  discoveryTerms: [...skinClinicsVertical.discoveryTerms],
  categoryHints: [...skinClinicsVertical.categoryHints],
  negativeNamePatterns: SKIN_CLINIC_NEGATIVE_PATTERNS,
  landingPath: "/huidklinieken",
  inboundSource: "huidklinieken",
  landingLive: true,
  templateVariants: SKIN_CLINIC_TEMPLATE_VARIANTS,
  pilotCity: {
    name: "Arnhem",
    countryCode: "NL",
    region: "Gelderland",
    radiusKm: 12,
  },
  businessLabel: "kliniek",
  businessNoun: "huidkliniek",
  editionLabel: "Clinic Edition",
};

const CATALOG_PRESETS: Record<string, Partial<VerticalWizardDraft>> = {
  dentists: {
    name: "Tandartsen",
    slug: "dentists",
    description: "Tandartspraktijken en mondhygiëne",
    discoveryTerms: [
      "Tandarts",
      "Tandartspraktijk",
      "Mondhygiëne",
      "Dental clinic",
      "Tandheelkunde",
      "Implantologie",
    ],
    categoryHints: ["dentist", "dental_clinic"],
    negativeNamePatterns: [
      "ziekenhuis",
      "huisarts",
      "fysio",
      "kapper",
      "directory",
      "gids",
    ],
    landingPath: "/tandartsen",
    inboundSource: "tandartsen",
    businessLabel: "praktijk",
    businessNoun: "tandartspraktijk",
    editionLabel: "Practice Edition",
  },
  physio: {
    name: "Fysiotherapie",
    slug: "physio",
    description: "Fysiotherapiepraktijken en revalidatie",
    discoveryTerms: [
      "Fysiotherapie",
      "Fysiotherapeut",
      "Fysio praktijk",
      "Manuele therapie",
      "Sportfysio",
      "Revalidatie",
    ],
    categoryHints: ["physiotherapist", "physical_therapy"],
    negativeNamePatterns: ["ziekenhuis", "huisarts", "kapper", "directory", "gids"],
    landingPath: "/fysiotherapie",
    inboundSource: "fysiotherapie",
    businessLabel: "praktijk",
    businessNoun: "fysiopraktijk",
    editionLabel: "Practice Edition",
  },
  yoga: {
    name: "Yoga studio's",
    slug: "yoga",
    description: "Yogastudio's en wellness",
    discoveryTerms: [
      "Yoga studio",
      "Yogastudio",
      "Hot yoga",
      "Vinyasa yoga",
      "Yin yoga",
      "Yoga les",
    ],
    categoryHints: ["yoga_studio", "fitness_center"],
    negativeNamePatterns: ["basic fit", "sportschool", "directory", "gids"],
    landingPath: "/yoga",
    inboundSource: "yoga",
    businessLabel: "studio",
    businessNoun: "yogastudio",
    editionLabel: "Studio Edition",
  },
  "personal-training": {
    name: "Personal training",
    slug: "personal-training",
    description: "Personal trainers en boutique fitness",
    discoveryTerms: [
      "Personal trainer",
      "Personal training",
      "PT studio",
      "Boutique gym",
      "Krachttraining",
      "Fitness coach",
    ],
    categoryHints: ["personal_trainer", "gym"],
    negativeNamePatterns: ["basic fit", "sportschool", "directory", "gids"],
    landingPath: "/personal-training",
    inboundSource: "personal-training",
    businessLabel: "studio",
    businessNoun: "PT-studio",
    editionLabel: "Studio Edition",
  },
};

export function getBlueprintDraft(catalogSlug?: string | null): VerticalWizardDraft {
  if (!catalogSlug || catalogSlug === "skin-clinics") {
    return { ...SKIN_CLINICS_BLUEPRINT };
  }

  const preset = CATALOG_PRESETS[catalogSlug];
  const catalogEntry = verticalLauncherCatalog.find((v) => v.slug === catalogSlug);
  const name = preset?.name ?? catalogEntry?.name ?? catalogSlug;
  const slug = preset?.slug ?? slugifyVerticalInput(catalogSlug);

  return {
    ...SKIN_CLINICS_BLUEPRINT,
    catalogSlug,
    slug,
    name,
    description: preset?.description ?? `Nieuwe vertical: ${name}`,
    discoveryTerms: preset?.discoveryTerms ?? SKIN_CLINICS_BLUEPRINT.discoveryTerms,
    categoryHints: preset?.categoryHints ?? SKIN_CLINICS_BLUEPRINT.categoryHints,
    negativeNamePatterns:
      preset?.negativeNamePatterns ?? SKIN_CLINICS_BLUEPRINT.negativeNamePatterns,
    landingPath: preset?.landingPath ?? landingPathFromName(name),
    inboundSource: preset?.inboundSource ?? inboundSourceFromSlug(slug),
    landingLive: false,
    businessLabel: preset?.businessLabel ?? "studio",
    businessNoun: preset?.businessNoun ?? slug.replace(/-/g, " "),
    editionLabel: preset?.editionLabel ?? "Studio Edition",
    templateVariants: SKIN_CLINIC_TEMPLATE_VARIANTS.map((row) => ({
      ...row,
      name: row.name.replace("Clinic", name.split(" ")[0] ?? "Studio"),
    })),
    pilotCity: { ...SKIN_CLINICS_BLUEPRINT.pilotCity },
  };
}

export function listWizardCatalogOptions() {
  return verticalLauncherCatalog.map((entry) => ({
    ...entry,
    isBlueprint: entry.slug === "skin-clinics",
    presetAvailable: Boolean(CATALOG_PRESETS[entry.slug]) || entry.slug === "skin-clinics",
  }));
}
