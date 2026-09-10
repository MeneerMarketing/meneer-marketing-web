"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";
import { DIBA_ADDRESS } from "@/lib/site";

/**
 * De kaart bij de route.
 *
 * Yasin, 10 september 2026: "ik verwacht ook een Google Maps-kaart op die pagina met onze
 * locatie, in de linkerkolom bij de route."
 *
 * WAAROM HIJ NIET METEEN LAADT.
 *
 * Een ingesloten kaart is verkeer naar Google en zet cookies, en deze site laadt niets van
 * buiten voordat iemand ja heeft gezegd; dat is de hele reden dat er een cookiebalk staat
 * en dat Analytics erachter hangt. Een kaart die zich daar niets van aantrekt maakt die
 * balk een formaliteit.
 *
 * Dus twee wegen naar hetzelfde beeld. Wie de cookies al heeft geaccepteerd krijgt de
 * kaart direct te zien. Wie dat niet deed ziet het adres met een knop erbij, en één tik
 * laadt hem alsnog: dat geldt dan voor dit bezoek en verandert de keuze in de balk niet.
 * Het adres, de reistijden en de link naar Maps staan er in beide gevallen, dus zonder
 * kaart mist er geen informatie.
 */

const ADRES = `${DIBA_ADDRESS.street}, ${DIBA_ADDRESS.postalCode} ${DIBA_ADDRESS.city}`;

/** De insluitvorm van Maps heeft geen sleutel nodig en werkt op een gewone zoekopdracht. */
const KAART_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  ADRES,
)}&z=15&output=embed`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADRES,
)}`;

export default function Kaart({ className = "" }: { className?: string }) {
  const [mag, setMag] = useState(false);
  /* Pas na het inladen kijken: op de server bestaat localStorage niet, en dan zou de
     eerste opmaak van de pagina iets anders zijn dan wat de browser erna toont. */
  useEffect(() => {
    const lees = () => setMag(hasAnalyticsConsent());
    lees();
    window.addEventListener(COOKIE_CONSENT_EVENT, lees);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, lees);
  }, []);

  return (
    <div
      className={`overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-100)] ${className}`.trim()}
    >
      {mag ? (
        <iframe
          src={KAART_URL}
          title={`Kaart met de locatie van Diba Clinics aan de ${DIBA_ADDRESS.street}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-[280px] w-full border-0 lg:min-h-[420px]"
        />
      ) : (
        <div className="flex h-full min-h-[280px] flex-col justify-between gap-6 p-6 sm:p-8 lg:min-h-[420px]">
          <div>
            <p className="diba-label text-[var(--t-label)]">Op de kaart</p>
            <address className="mt-3 text-[20px] leading-8 not-italic text-[var(--t-strong)]">
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>
            <p className="mt-4 max-w-[38ch] text-[15px] leading-7 text-[var(--t-body)]">
              De kaart komt van Google en zet cookies. Daarom laden we hem pas
              als je erom vraagt.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => setMag(true)}
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Toon de kaart
            </button>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Of open Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
