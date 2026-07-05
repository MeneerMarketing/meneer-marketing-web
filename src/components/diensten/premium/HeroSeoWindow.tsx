"use client";

import { GoogleSerpInteractiveHero } from "@/components/diensten/premium/GoogleSerpInteractiveHero";
import { SEO_SERP } from "@/data/serp-hero-configs";

/** SEO dienst: organische SERP waar jij naar #1 klimt. */
export function HeroSeoWindow() {
  return (
    <div className="relative mx-auto flex min-h-[420px] w-full max-w-[440px] items-center justify-center px-2">
      <GoogleSerpInteractiveHero config={SEO_SERP} />
    </div>
  );
}
