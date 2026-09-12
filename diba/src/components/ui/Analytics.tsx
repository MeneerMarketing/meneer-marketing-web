"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";
import { meld } from "@/lib/meten";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Analytics — alleen na cookie-akkoord (AVG).
 * Geen hardcoded IDs; env-vars verplicht.
 */
export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(hasAnalyticsConsent());
    sync();

    const onStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) sync();
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  /**
   * Drie soorten klikken, op één plek geteld.
   *
   * Dit had ook in elke knop en elke link apart gekund, maar dan staat het op tientallen
   * plaatsen en vergeet iemand het bij de volgende knop. Eén luisteraar op het document
   * vangt ze allemaal, ook de knoppen die er morgen bij komen. Hij hangt er altijd, ook
   * zonder toestemming: `meld` doet dan niets, want dan bestaat `gtag` niet.
   */
  useEffect(() => {
    function opKlik(e: MouseEvent) {
      const doel = e.target as HTMLElement | null;
      const link = doel?.closest?.("a");
      const href = link?.getAttribute("href") ?? "";
      if (!href) return;

      if (href.startsWith("tel:")) meld("bellen");
      else if (href.includes("wa.me") || href.includes("whatsapp.com"))
        meld("whatsapp");
      else if (href === "/afspraak" || href.startsWith("/afspraak?"))
        meld("afspraak_geopend");
      else if (href.includes("salonized.com"))
        meld("afspraak_geopend", { soort: "agenda" });
    }

    document.addEventListener("click", opKlik, true);
    return () => document.removeEventListener("click", opKlik, true);
  }, []);

  if (!consented || (!GA_ID && !CLARITY_ID)) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="diba-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      {CLARITY_ID ? (
        <Script id="diba-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      ) : null}
    </>
  );
}
