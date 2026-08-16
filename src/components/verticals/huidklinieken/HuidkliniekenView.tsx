"use client";

import { useEffect, useState } from "react";

import { LgeCheckoutThankYou } from "@/components/verticals/LgeCheckoutThankYou";
import { LgeFloatingContact } from "@/components/verticals/LgeFloatingContact";
import { HuidkliniekCampaignBar } from "@/components/verticals/huidklinieken/HuidkliniekCampaignBar";
import { HuidkliniekCampaignTracker } from "@/components/verticals/huidklinieken/HuidkliniekCampaignTracker";
import { HuidkliniekExclusivity } from "@/components/verticals/huidklinieken/HuidkliniekExclusivity";
import { HuidkliniekFaq } from "@/components/verticals/huidklinieken/HuidkliniekFaq";
import { HuidkliniekFinalCta } from "@/components/verticals/huidklinieken/HuidkliniekFinalCta";
import { HuidkliniekFriction } from "@/components/verticals/huidklinieken/HuidkliniekFriction";
import { HuidkliniekHero } from "@/components/verticals/huidklinieken/HuidkliniekHero";
import { HuidkliniekHowItWorks } from "@/components/verticals/huidklinieken/HuidkliniekHowItWorks";
import { HuidkliniekIntent } from "@/components/verticals/huidklinieken/HuidkliniekIntent";
import { HuidkliniekInternalLinks } from "@/components/verticals/huidklinieken/HuidkliniekInternalLinks";
import { HuidkliniekLiveDesign } from "@/components/verticals/huidklinieken/HuidkliniekLiveDesign";
import { HuidkliniekPricing } from "@/components/verticals/huidklinieken/HuidkliniekPricing";
import { HuidkliniekSignatureCustom } from "@/components/verticals/huidklinieken/HuidkliniekSignatureCustom";
import type {
  VerticalCampaignPersonalization,
  VerticalInterestId,
} from "@/data/verticals/types";
import { packageKeyToInterest } from "@/lib/lge/package-map";

interface HuidkliniekenViewProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  checkoutPaymentId?: string | null;
}

/**
 * Unique clinic page architecture (not a Pilates section clone):
 * Hero → Friction → Intent → Live design → Pricing → Exclusivity →
 * How it works → Signature → Links → FAQ → Final CTA
 */
export function HuidkliniekenView({
  personalization,
  campaignRef,
  checkoutPaymentId = null,
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
      {checkoutPaymentId ? (
        <LgeCheckoutThankYou paymentId={checkoutPaymentId} />
      ) : null}
      <HuidkliniekCampaignTracker campaignRef={campaignRef} />
      {personalization?.businessName ? (
        <HuidkliniekCampaignBar personalization={personalization} />
      ) : null}
      <HuidkliniekHero />
      <HuidkliniekFriction />
      <HuidkliniekIntent />
      <HuidkliniekLiveDesign />
      <HuidkliniekPricing
        campaignRef={campaignRef}
        personalization={personalization}
        onPackageSelect={onPackageSelect}
      />
      <HuidkliniekExclusivity personalization={personalization} />
      <HuidkliniekHowItWorks />
      <HuidkliniekSignatureCustom
        campaignRef={campaignRef}
        onSelect={() => onPackageSelect("signature-custom")}
      />
      <HuidkliniekInternalLinks />
      <HuidkliniekFaq />
      <HuidkliniekFinalCta
        personalization={personalization}
        campaignRef={campaignRef}
        selectedInterest={selectedInterest}
        onInterestChange={setSelectedInterest}
      />
      <LgeFloatingContact vertical="huidklinieken" />
    </main>
  );
}
