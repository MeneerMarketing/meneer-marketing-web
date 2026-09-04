import { formatDisplayLabel, plainText } from "@/lib/text";
import type { StudioData } from "@/types/studio";

const FITNESS_JARGON =
  /\b(pilates|reformer|matwork|proefles|groepsles|les\b|lessen|studio\b|yoga|barre)\b/i;

const FITNESS_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bpilates\b/gi, "huidbehandelingen"],
  [/\breformer\b/gi, "behandeling"],
  [/\bmatwork\b/gi, "huidverbetering"],
  [/\bproefles\b/gi, "gratis intake"],
  [/\bgroepsles(sen)?\b/gi, "behandelingen"],
  [/\bstudio\b/gi, "kliniek"],
  [/\byoga\b/gi, "wellness"],
];

export function isFitnessJargon(text: string | null | undefined): boolean {
  return FITNESS_JARGON.test(plainText(text));
}

export function sanitizeClinicCopy(text: string | null | undefined): string {
  let value = plainText(text);
  if (!value) return "";

  for (const [pattern, replacement] of FITNESS_REPLACEMENTS) {
    value = value.replace(pattern, replacement);
  }

  return value.replace(/\s{2,}/g, " ").trim();
}

/** Korte merknaam voor header/nav: "Dr. Shakiba Clinic, Sky clinic" → "Dr. Shakiba". */
export function resolveNavBrandName(studioName: string | null | undefined): string {
  const raw = plainText(studioName);
  if (!raw) return "";

  let label = raw.split(",")[0]?.trim() ?? raw;
  label = label.replace(/\s+(?:sky\s+)?(?:clinic|kliniek)\s*$/gi, "").trim();

  if (/^dr\.?\s/i.test(label)) {
    const words = label.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return `${words[0]} ${words[1]}`;
  }

  const words = label.split(/\s+/).filter(Boolean);
  if (words.length > 3) return words.slice(0, 3).join(" ");
  return label;
}

export function resolveClinicPrimaryService(
  value: string | null | undefined,
  fallback = "Medisch esthetische zorg",
): string {
  const cleaned = sanitizeClinicCopy(value);
  if (!cleaned || isFitnessJargon(cleaned)) return fallback;
  return formatDisplayLabel(cleaned);
}

export function normalizeClinicStudioCopy(studio: StudioData): StudioData {
  if (studio.vertical_slug !== "skin-clinics" && studio.vertical_slug !== "huidklinieken") {
    return studio;
  }

  const primary = resolveClinicPrimaryService(studio.primary_service);
  const tagline = sanitizeClinicCopy(studio.tagline);
  const description = sanitizeClinicCopy(studio.description);

  const services = (studio.services ?? []).map((service) => ({
    ...service,
    name: sanitizeClinicCopy(service.name) || service.name,
    description: sanitizeClinicCopy(service.description) || service.description,
  }));

  const benefits = (studio.benefits ?? []).map((benefit) => ({
    ...benefit,
    title: sanitizeClinicCopy(benefit.title) || benefit.title,
    description: sanitizeClinicCopy(benefit.description) || benefit.description,
  }));

  return {
    ...studio,
    primary_service: primary,
    tagline: tagline || `Huidkliniek in ${plainText(studio.city)}`,
    description:
      description ||
      `${plainText(studio.studio_name)} in ${plainText(studio.city)}. Intake, analyse en behandelingen op maat.`,
    services,
    benefits,
  };
}
