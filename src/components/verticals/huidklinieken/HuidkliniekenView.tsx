"use client";

import { useEffect, useState } from "react";

import { LgeFloatingContact } from "@/components/verticals/LgeFloatingContact";
import { HuidkliniekBookingApp } from "@/components/verticals/huidklinieken/HuidkliniekBookingApp";
import { HuidkliniekCampaignBar } from "@/components/verticals/huidklinieken/HuidkliniekCampaignBar";
import { HuidkliniekCampaignTracker } from "@/components/verticals/huidklinieken/HuidkliniekCampaignTracker";
import { HuidkliniekCase } from "@/components/verticals/huidklinieken/HuidkliniekCase";
import { HuidkliniekExperience } from "@/components/verticals/huidklinieken/HuidkliniekExperience";
import { HuidkliniekFaq } from "@/components/verticals/huidklinieken/HuidkliniekFaq";
import { HuidkliniekFinalCta } from "@/components/verticals/huidklinieken/HuidkliniekFinalCta";
import { HuidkliniekGoogleStrategy } from "@/components/verticals/huidklinieken/HuidkliniekGoogleStrategy";
import { HuidkliniekHero } from "@/components/verticals/huidklinieken/HuidkliniekHero";
import { HuidkliniekHowItWorks } from "@/components/verticals/huidklinieken/HuidkliniekHowItWorks";
import { HuidkliniekInternalLinks } from "@/components/verticals/huidklinieken/HuidkliniekInternalLinks";
import { HuidkliniekLocalSeo } from "@/components/verticals/huidklinieken/HuidkliniekLocalSeo";
import { HuidkliniekPricing } from "@/components/verticals/huidklinieken/HuidkliniekPricing";
import { HuidkliniekSignatureCustom } from "@/components/verticals/huidklinieken/HuidkliniekSignatureCustom";
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

  useEffect(() => {
    const preset = sessionStorage.getItem("lge-interest");
    if (!preset) {
      return;
    }

    sessionStorage.removeItem("lge-interest");
    setSelectedInterest(preset as VerticalInterestId);
  }, []);

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
      <HuidkliniekWhyPrice />
      <HuidkliniekGoogleStrategy />
      <HuidkliniekLocalSeo />
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
      <HuidkliniekFaq />
      <HuidkliniekFinalCta
        personalization={personalization}
        campaignRef={campaignRef}
        selectedInterest={selectedInterest}
        onInterestChange={setSelectedInterest}
      />
      <HuidkliniekInternalLinks />
      <LgeFloatingContact vertical="huidklinieken" />
    </main>
  );
}
