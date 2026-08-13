"use client";

import { useState } from "react";

import { HuidkliniekBookingApp } from "@/components/verticals/huidklinieken/HuidkliniekBookingApp";
import { HuidkliniekCampaignBar } from "@/components/verticals/huidklinieken/HuidkliniekCampaignBar";
import { HuidkliniekCampaignTracker } from "@/components/verticals/huidklinieken/HuidkliniekCampaignTracker";
import { HuidkliniekCase } from "@/components/verticals/huidklinieken/HuidkliniekCase";
import { HuidkliniekCompleteFlow } from "@/components/verticals/huidklinieken/HuidkliniekCompleteFlow";
import { HuidkliniekExclusivity } from "@/components/verticals/huidklinieken/HuidkliniekExclusivity";
import { HuidkliniekFaq } from "@/components/verticals/huidklinieken/HuidkliniekFaq";
import { HuidkliniekFinalCta } from "@/components/verticals/huidklinieken/HuidkliniekFinalCta";
import { HuidkliniekGoogleStrategy } from "@/components/verticals/huidklinieken/HuidkliniekGoogleStrategy";
import { HuidkliniekHero } from "@/components/verticals/huidklinieken/HuidkliniekHero";
import { HuidkliniekHowItWorks } from "@/components/verticals/huidklinieken/HuidkliniekHowItWorks";
import { HuidkliniekInternalLinks } from "@/components/verticals/huidklinieken/HuidkliniekInternalLinks";
import { HuidkliniekLiveDesign } from "@/components/verticals/huidklinieken/HuidkliniekLiveDesign";
import { HuidkliniekLocalSeo } from "@/components/verticals/huidklinieken/HuidkliniekLocalSeo";
import { HuidkliniekPricing } from "@/components/verticals/huidklinieken/HuidkliniekPricing";
import { HuidkliniekSignatureCustom } from "@/components/verticals/huidklinieken/HuidkliniekSignatureCustom";
import { HuidkliniekExperience } from "@/components/verticals/huidklinieken/HuidkliniekExperience";
import { HuidkliniekWhyPrice } from "@/components/verticals/huidklinieken/HuidkliniekWhyPrice";
import type {
  VerticalCampaignPersonalization,
  VerticalInterestId,
} from "@/data/verticals/types";
import { packageKeyToInterest } from "@/lib/lge/package-map";

interface HuidkliniekenViewProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
}

export function HuidkliniekenView({
  personalization,
  campaignRef,
}: HuidkliniekenViewProps) {
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
      <HuidkliniekCampaignTracker campaignRef={campaignRef} />
      {personalization?.businessName ? (
        <HuidkliniekCampaignBar personalization={personalization} />
      ) : null}
      <HuidkliniekHero />
      <HuidkliniekExperience />
      <HuidkliniekCompleteFlow />
      <HuidkliniekLiveDesign />
      <HuidkliniekWhyPrice />
      <HuidkliniekGoogleStrategy />
      <HuidkliniekLocalSeo />
      <HuidkliniekExclusivity personalization={personalization} />
      <HuidkliniekBookingApp campaignRef={campaignRef} />
      <HuidkliniekPricing
        campaignRef={campaignRef}
        personalization={personalization}
        onPackageSelect={onPackageSelect}
      />
      <HuidkliniekSignatureCustom
        campaignRef={campaignRef}
        onSelect={() => onPackageSelect("signature-custom")}
      />
      <HuidkliniekCase />
      <HuidkliniekHowItWorks />
      <HuidkliniekInternalLinks />
      <HuidkliniekFaq />
      <HuidkliniekFinalCta
        personalization={personalization}
        campaignRef={campaignRef}
        selectedInterest={selectedInterest}
        onInterestChange={setSelectedInterest}
      />
    </main>
  );
}
