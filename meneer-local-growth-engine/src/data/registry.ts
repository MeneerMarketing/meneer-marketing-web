import { studioForma } from "@/data/studios/studio-forma";
import type { PreviewRecord, StudioData, TemplateVariant } from "@/types/studio";

const studios: StudioData[] = [studioForma];

export const TEMPLATES: {
  variant: TemplateVariant;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    variant: "editorial",
    label: "Editorial Pilates",
    shortLabel: "A",
    description:
      "Magazine-editorial. Newsreader + Figtree. Kinetic tagline, hover-lessen met beeldwissel.",
  },
  {
    variant: "reformer-minimal",
    label: "Figma Full Screen",
    shortLabel: "B",
    description:
      "DIBA-achtig full-screen. DM Sans, inset hero, ken burns, accordion-lessen, sage accent.",
  },
  {
    variant: "soft-movement",
    label: "Soft Movement",
    shortLabel: "C",
    description:
      "Warm organisch. Sora. Pulsing CTA, floating blobs, horizontale snap-carousel voor lessen.",
  },
];

export const PREVIEWS: PreviewRecord[] = [
  {
    id: "prev-forma-editorial",
    slug: "studio-forma-arnhem-editorial",
    business_slug: "studio-forma-arnhem",
    template_variant: "editorial",
    status: "ready",
    exclusive_status: "none",
  },
  {
    id: "prev-forma-reformer",
    slug: "studio-forma-arnhem-reformer",
    business_slug: "studio-forma-arnhem",
    template_variant: "reformer-minimal",
    status: "ready",
    exclusive_status: "none",
  },
  {
    id: "prev-forma-soft",
    slug: "studio-forma-arnhem-soft",
    business_slug: "studio-forma-arnhem",
    template_variant: "soft-movement",
    status: "ready",
    exclusive_status: "none",
  },
];

/** Canonical demo slug without variant suffix */
export const DEMO_BASE_SLUG = "studio-forma-arnhem";

export function getAllStudios(): StudioData[] {
  return studios;
}

export function getStudioBySlug(slug: string): StudioData | undefined {
  return studios.find((s) => s.slug === slug);
}

export function getPreviewBySlug(slug: string): PreviewRecord | undefined {
  return PREVIEWS.find((p) => p.slug === slug);
}

export function resolvePreview(
  slug: string,
  templateParam?: string | null
): { studio: StudioData; variant: TemplateVariant; previewSlug: string } | null {
  const direct = getPreviewBySlug(slug);
  if (direct) {
    const studio = getStudioBySlug(direct.business_slug);
    if (!studio) return null;
    return {
      studio,
      variant: direct.template_variant,
      previewSlug: direct.slug,
    };
  }

  const studio = getStudioBySlug(slug);
  if (!studio) return null;

  const variant = parseTemplateParam(templateParam) ?? "editorial";
  const matching = PREVIEWS.find(
    (p) => p.business_slug === studio.slug && p.template_variant === variant
  );

  return {
    studio,
    variant,
    previewSlug: matching?.slug ?? slug,
  };
}

function parseTemplateParam(value?: string | null): TemplateVariant | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === "a" || normalized === "editorial") return "editorial";
  if (normalized === "b" || normalized === "reformer" || normalized === "reformer-minimal") {
    return "reformer-minimal";
  }
  if (normalized === "c" || normalized === "soft" || normalized === "soft-movement") {
    return "soft-movement";
  }
  return null;
}

export function getPreviewsForStudio(businessSlug: string): PreviewRecord[] {
  return PREVIEWS.filter((p) => p.business_slug === businessSlug);
}
