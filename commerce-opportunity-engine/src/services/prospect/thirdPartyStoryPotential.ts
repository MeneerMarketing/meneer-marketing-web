/**
 * Milestone 9.7 — deterministic third-party story potential.
 */

import { ARCHETYPE_BY_ID } from "../../config/idealProductArchetypes.js";
import type { ProductArchetypeId } from "../../config/idealProductArchetypes.js";

export function computeThirdPartyStoryPotential(input: {
  archetypeId: ProductArchetypeId;
  productTitle: string | null;
  observedPrice: number | null;
  productBrandConfidence: number;
}): number {
  const archetype = ARCHETYPE_BY_ID.get(input.archetypeId);
  let score = 45;

  if (archetype) {
    const upside =
      archetype.deepDive.featureRich * 0.22 +
      archetype.deepDive.visualStorytelling * 0.18 +
      archetype.deepDive.heroProductPotential * 0.2 +
      archetype.deepDive.highConsideration * 0.2;
    score = Math.round(40 + upside * 0.55);
  }

  const title = (input.productTitle ?? "").toLowerCase();
  if (/therapy|therapie|laser|sonic|compress|percussion|ems|microcurrent|panel|helm|cap/i.test(title)) {
    score += 10;
  }
  if (/pro|premium|clinical|professional|smart/i.test(title)) {
    score += 6;
  }

  const price = input.observedPrice;
  if (price != null) {
    if (price >= 150 && price <= 750) score += 12;
    else if (price >= 100) score += 6;
  }

  score += Math.round((input.productBrandConfidence / 100) * 8);
  return Math.max(0, Math.min(100, score));
}
