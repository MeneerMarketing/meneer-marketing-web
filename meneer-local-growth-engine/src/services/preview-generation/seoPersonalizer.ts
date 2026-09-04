import type { ExtractedService } from "./types";
import type { SeoPersonalization } from "./types";

export function personalizeSeo(input: {
  studioName: string;
  city: string;
  primaryService: string;
  services: ExtractedService[];
}): SeoPersonalization {
  const hasReformer = input.services.some((s) => s.service_type === "reformer");
  const hasMat = input.services.some((s) => s.service_type === "mat");

  const primary = `Pilates ${input.city}`;
  const secondary: string[] = [`Pilates studio ${input.city}`, `Pilates lessen ${input.city}`];

  if (hasReformer) secondary.unshift(`Reformer Pilates ${input.city}`);
  if (hasMat) secondary.push(`Mat Pilates ${input.city}`);
  if (input.primaryService && !secondary.some((k) => k.toLowerCase().includes(input.primaryService.toLowerCase()))) {
    secondary.unshift(`${input.primaryService} ${input.city}`);
  }

  const uniqueSecondary = Array.from(new Set(secondary)).slice(0, 5);

  return {
    primary_keyword: primary,
    secondary_keywords: uniqueSecondary,
    seo_title: `${input.studioName} · ${primary}`,
    meta_description: `${input.studioName} in ${input.city}. ${input.primaryService}. Bekijk het conceptvoorstel voor een sterkere lokale online aanwezigheid.`,
    h1_recommendation: `${input.primaryService} in ${input.city}`,
  };
}
