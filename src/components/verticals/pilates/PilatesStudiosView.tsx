"use client";

import { useEffect, useState } from "react";

import { LgeCheckoutThankYou } from "@/components/verticals/LgeCheckoutThankYou";
import { LgeFloatingContact } from "@/components/verticals/LgeFloatingContact";
import { PilatesBookingApp } from "@/components/verticals/pilates/PilatesBookingApp";
import { PilatesCampaignBar } from "@/components/verticals/pilates/PilatesCampaignBar";
import { PilatesCampaignTracker } from "@/components/verticals/pilates/PilatesCampaignTracker";
import { PilatesCase } from "@/components/verticals/pilates/PilatesCase";
import { PilatesFaq } from "@/components/verticals/pilates/PilatesFaq";
import { PilatesFinalCta } from "@/components/verticals/pilates/PilatesFinalCta";
import { PilatesGoogleStrategy } from "@/components/verticals/pilates/PilatesGoogleStrategy";
import { PilatesHero } from "@/components/verticals/pilates/PilatesHero";
import { PilatesHowItWorks } from "@/components/verticals/pilates/PilatesHowItWorks";
import { PilatesInternalLinks } from "@/components/verticals/pilates/PilatesInternalLinks";
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
  checkoutPaymentId?: string | null;
}

export function PilatesStudiosView({
  personalization,
  campaignRef,
  checkoutPaymentId = null,
}: PilatesStudiosViewProps) {
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
      {checkoutPaymentId ? (
        <LgeCheckoutThankYou paymentId={checkoutPaymentId} />
      ) : null}
      <PilatesCampaignTracker campaignRef={campaignRef} />
      {personalization?.businessName ? (
        <PilatesCampaignBar personalization={personalization} />
      ) : null}
      <PilatesHero />
      <PilatesStudioExperience />
      <PilatesWhyPrice />
      <PilatesGoogleStrategy />
      <PilatesLocalSeo />
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
      <PilatesFaq />
      <PilatesFinalCta
        personalization={personalization}
        campaignRef={campaignRef}
        selectedInterest={selectedInterest}
        onInterestChange={setSelectedInterest}
      />
      <PilatesInternalLinks />
      <LgeFloatingContact vertical="pilates-studios" />
    </main>
  );
}
