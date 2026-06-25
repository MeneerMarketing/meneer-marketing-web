"use client";

import { CookieBanner } from "@/components/consent/CookieBanner";
import { OptionalAnalytics } from "@/components/consent/OptionalAnalytics";

export function SiteConsent() {
  return (
    <>
      <OptionalAnalytics />
      <CookieBanner />
    </>
  );
}
