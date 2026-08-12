"use client";

import { PilatesBookingApp } from "@/components/verticals/pilates/PilatesBookingApp";
import { PilatesCase } from "@/components/verticals/pilates/PilatesCase";
import { PilatesCompleteFlow } from "@/components/verticals/pilates/PilatesCompleteFlow";
import { PilatesExclusivity } from "@/components/verticals/pilates/PilatesExclusivity";
import { PilatesFaq } from "@/components/verticals/pilates/PilatesFaq";
import { PilatesFinalCta } from "@/components/verticals/pilates/PilatesFinalCta";
import { PilatesHero } from "@/components/verticals/pilates/PilatesHero";
import { PilatesHowItWorks } from "@/components/verticals/pilates/PilatesHowItWorks";
import { PilatesInternalLinks } from "@/components/verticals/pilates/PilatesInternalLinks";
import { PilatesLiveDesign } from "@/components/verticals/pilates/PilatesLiveDesign";
import { PilatesLocalSeo } from "@/components/verticals/pilates/PilatesLocalSeo";
import { PilatesPricing } from "@/components/verticals/pilates/PilatesPricing";
import { PilatesSignatureCustom } from "@/components/verticals/pilates/PilatesSignatureCustom";
import { PilatesStudioExperience } from "@/components/verticals/pilates/PilatesStudioExperience";
import { PilatesWhyPrice } from "@/components/verticals/pilates/PilatesWhyPrice";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";

interface PilatesStudiosViewProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
}

export function PilatesStudiosView({
  personalization,
  campaignRef,
}: PilatesStudiosViewProps) {
  return (
    <main id="main">
      <PilatesHero personalization={personalization} />
      <PilatesStudioExperience />
      <PilatesCompleteFlow />
      <PilatesLiveDesign />
      <PilatesWhyPrice />
      <PilatesLocalSeo />
      <PilatesExclusivity personalization={personalization} />
      <PilatesBookingApp />
      <PilatesPricing />
      <PilatesSignatureCustom />
      <PilatesCase />
      <PilatesHowItWorks />
      <PilatesInternalLinks />
      <PilatesFaq />
      <PilatesFinalCta
        personalization={personalization}
        campaignRef={campaignRef}
      />
    </main>
  );
}
