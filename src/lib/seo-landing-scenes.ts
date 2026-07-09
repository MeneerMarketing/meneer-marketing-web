import type {
  SeoLandingPage,
  SeoLandingSceneBreak,
  SeoLandingVisual,
} from "@/data/seo-landings/types";

const ALL_VISUALS: readonly SeoLandingVisual[] = [
  "google-ads",
  "meta-ads",
  "seo-serp",
  "website-build",
  "webshop",
  "b2b-portal",
  "content-hub",
  "ai-search",
  "email-flow",
  "strategy-stack",
  "metrics-dashboard",
  "local-maps",
  "tracking-lab",
  "compare-split",
];

/** Scene-visuals die níet de hero mogen herhalen. */
const SCENE_ALTERNATES: Record<SeoLandingVisual, readonly SeoLandingVisual[]> = {
  "google-ads": ["metrics-dashboard", "website-build", "tracking-lab", "compare-split", "strategy-stack"],
  "meta-ads": ["metrics-dashboard", "google-ads", "email-flow", "content-hub", "compare-split"],
  "seo-serp": ["ai-search", "local-maps", "content-hub", "metrics-dashboard", "website-build"],
  "website-build": ["seo-serp", "metrics-dashboard", "tracking-lab", "google-ads", "strategy-stack"],
  webshop: ["email-flow", "metrics-dashboard", "b2b-portal", "tracking-lab", "google-ads"],
  "b2b-portal": ["email-flow", "strategy-stack", "tracking-lab", "metrics-dashboard", "webshop"],
  "content-hub": ["ai-search", "seo-serp", "local-maps", "metrics-dashboard"],
  "ai-search": ["seo-serp", "content-hub", "strategy-stack", "local-maps"],
  "email-flow": ["metrics-dashboard", "webshop", "strategy-stack", "tracking-lab"],
  "strategy-stack": ["ai-search", "metrics-dashboard", "google-ads", "tracking-lab"],
  "metrics-dashboard": ["tracking-lab", "strategy-stack", "seo-serp", "google-ads"],
  "local-maps": ["seo-serp", "content-hub", "ai-search", "metrics-dashboard"],
  "tracking-lab": ["metrics-dashboard", "google-ads", "website-build", "strategy-stack"],
  "compare-split": ["metrics-dashboard", "strategy-stack", "seo-serp", "google-ads"],
};

function hashPick(key: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % 997;
  }
  return hash % modulo;
}

function pickAlternateVisual(
  page: SeoLandingPage,
  index: number,
  used: ReadonlySet<SeoLandingVisual>,
): SeoLandingVisual {
  const pool = SCENE_ALTERNATES[page.visual] ?? ALL_VISUALS;
  const candidates = pool.filter((v) => v !== page.visual && !used.has(v));
  if (candidates.length > 0) {
    return candidates[hashPick(`${page.slug}-${index}`, candidates.length)]!;
  }
  const fallback = ALL_VISUALS.find((v) => v !== page.visual && !used.has(v));
  return fallback ?? "metrics-dashboard";
}

/**
 * Hero-visual blijft uniek bovenaan. Scenes krijgen altijd een andere illustratie.
 */
export function resolveUniqueScenes(
  page: SeoLandingPage,
  scenes: readonly SeoLandingSceneBreak[],
): readonly SeoLandingSceneBreak[] {
  const used = new Set<SeoLandingVisual>([page.visual]);

  return scenes.map((scene, index) => {
    let visual = scene.visual;

    if (visual === page.visual || used.has(visual)) {
      visual = pickAlternateVisual(page, index, used);
    }

    used.add(visual);
    return { ...scene, visual };
  });
}
