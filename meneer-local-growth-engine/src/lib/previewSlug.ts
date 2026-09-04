import { slugify } from "@/lib/utils/normalize";
import type { TemplateVariant } from "@/types/domain";

/** Langste eerst, zodat suffix-matching geen deelstrings raakt. */
export const PREVIEW_TEMPLATE_SLUG_SUFFIXES = [
  "clinical-atelier",
  "reformer-minimal",
  "soft-movement",
  "editorial",
] as const satisfies readonly TemplateVariant[];

/** Publieke preview-URL: studio + stad, zonder template-variant. */
export function buildPreviewSlug(studioName: string, citySlug: string): string {
  return `${slugify(studioName)}-${slugify(citySlug)}`.slice(0, 80);
}

/** Verwijdert `-soft-movement` e.d. uit bestaande slugs voor korte links. */
export function toCanonicalPreviewSlug(slug: string): string {
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, "");
  for (const variant of PREVIEW_TEMPLATE_SLUG_SUFFIXES) {
    const suffix = `-${variant}`;
    if (trimmed.endsWith(suffix)) {
      return trimmed.slice(0, -suffix.length);
    }
  }
  return trimmed;
}

export function previewSlugMatches(storedSlug: string, requestedSlug: string): boolean {
  return (
    toCanonicalPreviewSlug(storedSlug) === toCanonicalPreviewSlug(requestedSlug)
  );
}
