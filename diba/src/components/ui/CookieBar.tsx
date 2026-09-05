"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  acceptCookieConsent,
  isGevraagd,
  refuseCookieConsent,
} from "@/lib/cookie-consent";

/**
 * De cookiebalk.
 *
 * WAT HIER NIET KLOPTE.
 *
 * Er stond één knop: Akkoord. Daarnaast een link met het woord "Instellingen" die naar
 * /cookiebeleid ging, en dat was een tekstpagina zonder enige instelling. Weigeren kon dus
 * niet, en wie niet klikte kreeg de balk elk bezoek opnieuw. De enige manier om ervan af te
 * komen was ja zeggen.
 *
 * Dat is niet alleen onnet, het klopt niet met wat op /cookiebeleid stond. Analytische
 * cookies mogen pas laden na toestemming, en die toestemming is alleen iets waard als nee
 * zeggen net zo makkelijk is als ja zeggen.
 *
 * Nu staan er twee knoppen naast elkaar, even groot en even bereikbaar. De weigerknop
 * schrijft een echte "nee" weg, dus hij verdwijnt ook voor wie weigert. Intrekken kan
 * daarna op /cookiebeleid, waar nu wel een schakelaar staat.
 *
 * Ook opgeruimd: de hardgecodeerde hex (var(--g-100), var(--g-010), var(--t-muted), var(--g-700)) en de bovenrand.
 * Vlakken in deze huisstijl dragen zichzelf; de balk staat los van de pagina door zijn
 * schaduw en niet door een lijn.
 *
 * De hoogte blijft de reden dat de tekst kort is: op een iPhone was deze balk 144px en dat
 * is een vijfde van het scherm dat permanent bedekt is. Eén regel naast de knoppen komt
 * neer op ongeveer 70px.
 */

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isGevraagd()) return;
    requestAnimationFrame(() => setVisible(true));
  }, []);

  if (!visible) return null;

  const knop =
    "inline-flex h-12 shrink-0 items-center justify-center rounded-[var(--r-pill)] px-5 " +
    "text-[13px] leading-none font-medium whitespace-nowrap transition-colors " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-[var(--g-700)]";

  return (
    <div
      role="dialog"
      aria-label="Cookievoorkeuren"
      className="fixed inset-x-0 bottom-0 z-50 bg-[var(--g-010)]/95 px-4 py-3 shadow-[0_-8px_28px_rgba(67,79,58,.10)] backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-9 md:py-4 md:pb-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 md:gap-4">
        {/*
          De link naar het beleid staat in de zin en niet naast de knoppen. Gemeten op
          375px viel hij daar 12px buiten beeld, en hem op een eigen regel zetten maakte
          de balk 168px: twintig procent van het scherm, precies waar de vorige versie
          voor gewaarschuwd werd. De twee keuzes zijn de bedieningselementen en houden
          hun 48px; de link is een verwijzing binnen een zin.
        */}
        <p className="max-w-xl text-[13px] leading-snug text-[var(--t-body)] md:text-[14px] md:leading-relaxed">
          Cookies voor een werkende site en anonieme statistieken.
          <span className="hidden sm:inline">
            {" "}
            Geen advertentie-tracking.
          </span>{" "}
          <Link
            href="/cookiebeleid"
            className="text-[var(--g-700)] underline underline-offset-2 hover:text-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            Lees het beleid
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => {
              refuseCookieConsent();
              setVisible(false);
            }}
            className={`${knop} bg-[var(--g-050)] text-[var(--g-900)] hover:bg-[var(--g-100)]`}
          >
            Alleen noodzakelijk
          </button>
          <button
            type="button"
            onClick={() => {
              acceptCookieConsent();
              setVisible(false);
            }}
            className={`${knop} bg-[var(--g-700)] text-white hover:bg-[var(--g-800)]`}
          >
            Akkoord
          </button>
        </div>
      </div>
    </div>
  );
}
