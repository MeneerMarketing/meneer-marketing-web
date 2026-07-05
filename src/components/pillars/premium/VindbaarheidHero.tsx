"use client";

import { GoogleSerpInteractiveHero } from "@/components/diensten/premium/GoogleSerpInteractiveHero";
import { VINDABAARHEID_SERP } from "@/data/serp-hero-configs";

/** Hero voor Vindbaarheid: interactieve Google-zoekbalk met typewriter en SERP. */
export function VindbaarheidHero() {
  return <GoogleSerpInteractiveHero config={VINDABAARHEID_SERP} />;
}
