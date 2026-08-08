"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { figmaBtnMint } from "@/lib/figma-home-layout";
import { acceptCookieConsent, COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = (() => {
      try {
        return localStorage.getItem(COOKIE_CONSENT_KEY) !== "1";
      } catch {
        return true;
      }
    })();
    if (!show) return;
    requestAnimationFrame(() => setVisible(true));
  }, []);

  if (!visible) return null;

  function accept() {
    acceptCookieConsent();
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookievoorkeuren"
      /* Deze balk stond op mobiel 144px hoog: op een iPhone-scherm van 664px is dat een
         vijfde dat permanent bedekt is, met z-50 er bovenop. Alles wat je onderin het
         scherm wilde aantikken ving hij weg, en dat is precies het "ik kan nergens op
         klikken" dat gemeld werd. Nu één regel tekst naast de knoppen, wat neerkomt op
         ongeveer 70px. */
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dce8d9] bg-[#fcfdfb]/95 px-4 py-3 backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-9 md:py-4 md:pb-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex items-center justify-between gap-3 md:gap-4">
        <p className="max-w-xl text-[13px] leading-snug text-[#5f7765] md:text-[14px] md:leading-relaxed">
          Cookies voor een werkende site en anonieme statistieken.
          <span className="hidden sm:inline"> Geen advertentie-tracking.</span>
        </p>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button type="button" onClick={accept} className={figmaBtnMint}>
            Akkoord ↗
          </button>
          <Link
            href="/cookiebeleid"
            className="inline-flex h-12 shrink-0 items-center px-1 text-[13px] font-medium whitespace-nowrap text-[#286943] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943]"
          >
            Instellingen
          </Link>
        </div>
      </div>
    </div>
  );
}
