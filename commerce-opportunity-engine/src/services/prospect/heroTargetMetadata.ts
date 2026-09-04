/**
 * Milestone 9.5.1 — normalized hero target fields for reports and scoring audit.
 */

import type { ResolvedHero } from "./heroProductResolver.js";

export type HeroPriceConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export interface HeroTargetRecord {
  heroProductId: string | null;
  heroProductUrl: string | null;
  heroTitle: string | null;
  heroPrice: number | null;
  heroCurrency: string | null;
  heroScore: number | null;
  heroConfidence: number | null;
  heroPriceConfidence: HeroPriceConfidence;
  heroResolutionSource: ResolvedHero["source"] | "catalog_flagship" | "unknown";
  heroResolutionEvidence: string[];
  matchedKeywords: string[];
  heroSelectionEvidence: string[];
}

export function heroProductIdFromUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/\/products\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

export function heroPriceConfidenceFromSource(
  source: HeroTargetRecord["heroResolutionSource"],
  price: number | null
): HeroPriceConfidence {
  if (price == null || !Number.isFinite(price)) return "UNKNOWN";
  if (source === "paid_landing") return "HIGH";
  if (source === "shopping_ad") return "MEDIUM";
  if (source === "landing_linked_product" || source === "catalog_flagship") return "MEDIUM";
  if (source === "homepage_prominent") return "LOW";
  return "UNKNOWN";
}

export function buildHeroTargetRecord(input: {
  hero: ResolvedHero | null;
  keywords: string[];
  resolutionSource?: HeroTargetRecord["heroResolutionSource"];
  heroSelectionEvidence?: string[];
}): HeroTargetRecord {
  const hero = input.hero;
  const source = input.resolutionSource ?? hero?.source ?? "unknown";
  const url = hero?.url ?? null;

  return {
    heroProductId: heroProductIdFromUrl(url),
    heroProductUrl: url,
    heroTitle: hero?.title ?? null,
    heroPrice: hero?.price ?? null,
    heroCurrency: hero?.currency ?? null,
    heroScore: hero?.heroScore ?? null,
    heroConfidence: hero?.heroConfidence ?? null,
    heroPriceConfidence: heroPriceConfidenceFromSource(source, hero?.price ?? null),
    heroResolutionSource: source,
    heroResolutionEvidence: hero?.evidence ?? [],
    matchedKeywords: input.keywords,
    heroSelectionEvidence: input.heroSelectionEvidence ?? hero?.evidence ?? [],
  };
}
