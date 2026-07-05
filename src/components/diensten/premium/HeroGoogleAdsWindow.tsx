"use client";

import { GoogleSerpInteractiveHero } from "@/components/diensten/premium/GoogleSerpInteractiveHero";
import { GOOGLE_ADS_SERP } from "@/data/serp-hero-configs";

/** Google Ads dienst: gesponsorde SERP waar jouw ad naar top klimt. */
export function HeroGoogleAdsWindow() {
  return (
    <div className="relative mx-auto flex min-h-[420px] w-full max-w-[440px] items-center justify-center px-2">
      <GoogleSerpInteractiveHero config={GOOGLE_ADS_SERP} />
    </div>
  );
}
