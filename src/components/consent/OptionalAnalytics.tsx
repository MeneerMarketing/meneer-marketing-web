"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  readConsent,
} from "@/components/consent/consent-storage";

/**
 * Laadt optioneel een analytics-tag als NEXT_PUBLIC_GA_MEASUREMENT_ID is gezet
 * én de gebruiker statistiek heeft geaccepteerd.
 */
export function OptionalAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const sync = () => {
      const c = readConsent();
      setAllow(Boolean(c?.analytics));
    };
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!gaId || !allow) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="mm-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
