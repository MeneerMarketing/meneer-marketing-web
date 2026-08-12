"use client";

import { useEffect, useState } from "react";
import {
  acceptCookieConsent,
  COOKIE_CONSENT_EVENT,
  refuseCookieConsent,
  toestemmingStand,
  type Toestemming,
} from "@/lib/cookie-consent";

/**
 * De schakelaar op /cookiebeleid.
 *
 * WAAROM DEZE ER MOEST KOMEN.
 *
 * In het beleid stond: wilt u uw keuze wijzigen, wis dan de sitegegevens van dibaclinics.nl
 * in uw browser. Dat is geen intrekmogelijkheid maar een omweg die niemand loopt, en het
 * betekende in de praktijk dat een gegeven toestemming definitief was.
 *
 * Toestemming intrekken hoort net zo makkelijk te zijn als toestemming geven. Dus staat hier
 * je huidige stand, in gewone taal, met één knop om hem om te zetten.
 *
 * WAT ER GEBEURT ALS JE HEM OMZET.
 *
 * De stand gaat naar localStorage en er gaat een event de pagina op waar Analytics naar
 * luistert. Zet je hem op weigeren, dan stoppen de scripts met laden. Wat er in de sessie
 * ervoor al geladen was verdwijnt niet uit hun logboek, en dat staat er ook bij: een
 * schakelaar die dat verzwijgt belooft meer dan hij waarmaakt.
 *
 * SERVER-RENDERING.
 *
 * De stand komt uit localStorage en die bestaat op de server niet. Tot de eerste render in
 * de browser staat er daarom een neutrale regel in plaats van een verkeerde stand.
 */

const TEKST: Record<
  "toegestaan" | "geweigerd" | "onbekend",
  { kop: string; zin: string; knop: string }
> = {
  toegestaan: {
    kop: "Je hebt anonieme statistieken toegestaan",
    zin: "Google Analytics en Microsoft Clarity laden op deze site. Je kunt dat hieronder meteen terugdraaien.",
    knop: "Toestemming intrekken",
  },
  geweigerd: {
    kop: "Je hebt anonieme statistieken geweigerd",
    zin: "Er laadt niets buiten wat de site nodig heeft om te werken. Dat blijft zo tot je het zelf verandert.",
    knop: "Alsnog toestaan",
  },
  onbekend: {
    kop: "Je hebt nog geen keuze gemaakt",
    zin: "Zolang er geen keuze is, laadt er niets. Onbekend telt hier als nee.",
    knop: "Anonieme statistieken toestaan",
  },
};

export default function Toestemmingschakelaar() {
  const [stand, setStand] = useState<Toestemming | "laden">("laden");

  useEffect(() => {
    const sync = () => setStand(toestemmingStand());
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  if (stand === "laden") {
    return (
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <p className="diba-label text-[var(--t-label)]">Jouw keuze</p>
        <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
          Je huidige keuze wordt opgehaald uit deze browser.
        </p>
      </div>
    );
  }

  const sleutel = stand === null ? "onbekend" : stand;
  const t = TEKST[sleutel];
  const toegestaan = stand === "toegestaan";

  return (
    <div
      className={`rounded-[var(--r-lg)] p-7 transition-colors duration-300 sm:p-9 ${
        toegestaan ? "bg-[var(--g-200)]" : "bg-white"
      }`}
    >
      <p
        className={`diba-label ${toegestaan ? "text-[var(--g-900)]" : "text-[var(--t-label)]"}`}
      >
        Jouw keuze
      </p>
      <p
        aria-live="polite"
        className={`diba-card-title mt-3 ${toegestaan ? "text-[var(--g-900)]" : "text-[var(--t-strong)]"}`}
      >
        {t.kop}
      </p>
      <p
        className={`mt-3 max-w-[58ch] text-[16px] leading-7 ${toegestaan ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
      >
        {t.zin}
      </p>

      <button
        type="button"
        onClick={() =>
          toegestaan ? refuseCookieConsent() : acceptCookieConsent()
        }
        className="mt-7 inline-flex min-h-12 items-center rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[13px] leading-none font-medium text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
      >
        {t.knop}
      </button>

      <p
        className={`mt-6 max-w-[58ch] text-[14px] leading-6 ${toegestaan ? "text-[var(--g-900)]" : "text-[var(--t-muted)]"}`}
      >
        Intrekken werkt vanaf nu en niet met terugwerkende kracht: wat er eerder
        gemeten is, blijft bij die diensten staan. Wil je dat ook verwijderd
        hebben, neem dan contact met ons op.
      </p>
    </div>
  );
}
