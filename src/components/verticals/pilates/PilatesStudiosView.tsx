"use client";

import { useState } from "react";

import { PilatesBookingApp } from "@/components/verticals/pilates/PilatesBookingApp";
import { PilatesCampaignBar } from "@/components/verticals/pilates/PilatesCampaignBar";
import { PilatesCampaignTracker } from "@/components/verticals/pilates/PilatesCampaignTracker";
import { PilatesCase } from "@/components/verticals/pilates/PilatesCase";
import { PilatesCompleteFlow } from "@/components/verticals/pilates/PilatesCompleteFlow";
import { PilatesExclusivity } from "@/components/verticals/pilates/PilatesExclusivity";
import { PilatesFaq } from "@/components/verticals/pilates/PilatesFaq";
import { PilatesFinalCta } from "@/components/verticals/pilates/PilatesFinalCta";
import { PilatesGoogleStrategy } from "@/components/verticals/pilates/PilatesGoogleStrategy";
import { PilatesHero } from "@/components/verticals/pilates/PilatesHero";
import { PilatesHowItWorks } from "@/components/verticals/pilates/PilatesHowItWorks";
import { PilatesInternalLinks } from "@/components/verticals/pilates/PilatesInternalLinks";
import { PilatesLiveDesign } from "@/components/verticals/pilates/PilatesLiveDesign";
import { PilatesLocalSeo } from "@/components/verticals/pilates/PilatesLocalSeo";
import { PilatesPricing } from "@/components/verticals/pilates/PilatesPricing";
import { PilatesSignatureCustom } from "@/components/verticals/pilates/PilatesSignatureCustom";
import { PilatesStudioExperience } from "@/components/verticals/pilates/PilatesStudioExperience";
import { PilatesWhyPrice } from "@/components/verticals/pilates/PilatesWhyPrice";
import type {
  VerticalCampaignPersonalization,
  VerticalInterestId,
} from "@/data/verticals/types";
import { packageKeyToInterest } from "@/lib/lge/package-map";

interface PilatesStudiosViewProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
}

export function PilatesStudiosView({
  personalization,
  campaignRef,
}: PilatesStudiosViewProps) {
  const [selectedInterest, setSelectedInterest] = useState<VerticalInterestId>(
    () =>
      packageKeyToInterest(personalization?.recommendedPackage ?? null) ??
      "unsure",
  );

  function onPackageSelect(interest: VerticalInterestId) {
    setSelectedInterest(interest);
  }

  return (
    <main id="main">
      <PilatesCampaignTracker campaignRef={campaignRef} />
      {personalization?.businessName ? (
        <PilatesCampaignBar personalization={personalization} />
      ) : null}
      <PilatesHero />
      <PilatesStudioExperience />
      <PilatesCompleteFlow />
      <PilatesLiveDesign />
      <PilatesWhyPrice />
      <PilatesGoogleStrategy />
      <PilatesLocalSeo />
      <PilatesExclusivity personalization={personalization} />
      <PilatesBookingApp campaignRef={campaignRef} />
      <PilatesPricing
        campaignRef={campaignRef}
        personalization={personalization}
        onPackageSelect={onPackageSelect}
      />
      <PilatesSignatureCustom
        campaignRef={campaignRef}
        onSelect={() => onPackageSelect("signature-custom")}
      />
      <PilatesCase />
      <PilatesHowItWorks />
      <PilatesInternalLinks />
      <PilatesFaq />
      <PilatesFinalCta
        personalization={personalization}
        campaignRef={campaignRef}
        selectedInterest={selectedInterest}
        onInterestChange={setSelectedInterest}
      />
    </main>
  );
}
