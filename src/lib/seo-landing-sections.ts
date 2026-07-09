import type {
  SeoLandingLayoutProfile,
  SeoLandingSceneBreak,
  SeoLandingScenePlacement,
  SeoLandingSectionId,
} from "@/data/seo-landings/types";
import type { EnrichedSeoLandingPage } from "@/data/seo-landings/enriched-types";

const PROFILE_SKIP: Record<SeoLandingLayoutProfile, readonly SeoLandingSectionId[]> = {
  full: [],
  editorial: ["confession"],
  city: ["confession", "nightmare", "innerVoice"],
};

export function shouldShowSeoSection(
  page: EnrichedSeoLandingPage,
  sectionId: SeoLandingSectionId,
): boolean {
  const profile = page.layoutProfile ?? "full";
  const skipped = new Set<SeoLandingSectionId>([
    ...PROFILE_SKIP[profile],
    ...(page.skipSections ?? []),
  ]);
  return !skipped.has(sectionId);
}

export function scenesAtPlacement(
  page: EnrichedSeoLandingPage,
  placement: SeoLandingScenePlacement,
): readonly SeoLandingSceneBreak[] {
  return page.sceneBreaks?.filter((s) => s.placement === placement) ?? [];
}

export function isEditorialLayout(page: EnrichedSeoLandingPage): boolean {
  const profile = page.layoutProfile ?? "full";
  return profile === "editorial" || profile === "city";
}
