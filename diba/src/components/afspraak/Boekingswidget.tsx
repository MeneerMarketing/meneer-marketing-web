"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  DIBA_SALONIZED_BOOKING_URL,
  DIBA_SALONIZED_WIDGET_COMPANY,
} from "@/lib/site";

/**
 * De agenda van Salonized, op onze eigen pagina.
 *
 * Yasin, 10 september 2026: "kunnen we die widget niet inladen op onze site, zodat mensen
 * niet weggaan?" Dat kan: Salonized levert een laadscript dat een `div` met het
 * bedrijfsnummer opzoekt en de agenda erin zet.
 *
 * De code hieronder is die van Okan, uit het Salonized-paneel van de kliniek zelf. Ik had
 * hem eerst afgekeken van de openbare boekpagina, en dat scheelde net genoeg om niet te
 * werken: die gebruikt `widget.salonized.com` en deze `static-widget.salonized.com`, en de
 * klasse `salonized-booking` waar het script op zoekt stond er niet bij.
 *
 * Eén ding wijkt bewust af van wat Okan stuurde: hij gaf `#44503a` als kleur mee en het
 * groen van deze site is `#434f3a` (`--g-700`). Eén cijfer verschil, met het blote oog niet
 * te zien, maar de knoppen in de agenda staan straks naast onze eigen knoppen. Daarom komt
 * de kleur uit dezelfde bron als de rest van de site.
 *
 * OP LOCALHOST VERSCHIJNT DE AGENDA NOOIT, EN DAT IS GEEN FOUT.
 *
 * In het laadscript van Salonized staat letterlijk: bevat het adres van de pagina het woord
 * "localhost", dan is dit een ontwikkelmachine, en dan wijst de agenda naar
 * `http://localhost:8090`. Dat draait alleen bij hen. Wie deze pagina dus op :3011 of :3021
 * opent, ziet een leeg vak, hoe goed de code ook is.
 *
 * Via `127.0.0.1` gebeurt het wél goed: dan bouwt het script het echte adres,
 * `https://widget.salonized.com/widget?company=399Dy…`, en dat is ook wat er op
 * dibaclinics.nl gaat gebeuren. Op de bouwmachine blijft het daar bij een 403 van het
 * netwerk; op een gewone verbinding verschijnt de agenda.
 *
 * Repareer dit dus niet als je het lokaal niet ziet werken. Test op 127.0.0.1 of op het
 * echte domein.
 *
 * WAAROM DIT SCRIPT WEL METEEN LAADT EN DE KAART OP /contact NIET.
 *
 * Omdat dit de pagina zelf is. Wie hier komt wil boeken; de agenda achter een tik zetten
 * zou betekenen dat je twee keer moet klikken voordat je kunt doen waarvoor je kwam. Het
 * staat er wel bij, onder de agenda, want een bezoeker hoort te weten dat hij op dat moment
 * met Salonized te maken heeft.
 *
 * WAT ER GEBEURT ALS HET NIET LAADT.
 *
 * Een script van buiten kan geblokkeerd worden door een adblocker of door een netwerk dat
 * meekijkt. Dan staat er hier een leeg vlak en denkt iemand dat de kliniek vol zit. Na acht
 * seconden zonder agenda verschijnt daarom de link naar dezelfde agenda op de site van
 * Salonized. Beter een omweg dan een dood vlak. Komt de agenda daarna alsnog, dan verdwijnt
 * die melding weer: een trage verbinding is geen storing.
 *
 */

const LOADER = "https://static-widget.salonized.com/loader.js";

/** Het groen van de site, zodat de knoppen in de agenda die van ons zijn. */
const KLEUR = "#434f3a";

/** Hoe hoog het vak wordt. Uit de code van Salonized zelf. */
const HOOGTE = 1500;

export default function Boekingswidget() {
  const vak = useRef<HTMLDivElement>(null);
  const [mislukt, setMislukt] = useState(false);
  /* Het adres van de pagina verandert nooit tijdens een bezoek, dus een abonnement dat
     niets doet volstaat. Op de server luidt het antwoord "nee", zodat de eerste opmaak
     hetzelfde is als wat de browser erna toont. */
  const opLocalhost = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname.includes("localhost"),
    () => false,
  );

  useEffect(() => {
    if (!document.querySelector(`script[src="${LOADER}"]`)) {
      const el = document.createElement("script");
      el.src = LOADER;
      el.async = true;
      el.onerror = () => setMislukt(true);
      document.body.appendChild(el);
    }

    const doel = vak.current;
    if (!doel) return;

    /* Zodra het script iets in het vak zet, is de agenda er en mag de melding weg. */
    const kijker = new MutationObserver(() => {
      if (doel.firstElementChild) setMislukt(false);
    });
    kijker.observe(doel, { childList: true });

    /* Blijft het vak acht seconden leeg, dan is er iets misgegaan. */
    const t = window.setTimeout(() => {
      if (!doel.firstElementChild) setMislukt(true);
    }, 8000);

    return () => {
      kijker.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div>
      <div
        ref={vak}
        className="salonized-booking"
        data-company={DIBA_SALONIZED_WIDGET_COMPANY}
        data-color={KLEUR}
        data-language="nl"
        data-height={HOOGTE}
        data-inline="true"
        /* De ruimte staat gereserveerd zolang we wachten, zodat de pagina niet
           verspringt zodra de agenda binnenkomt. Lukt het niet, dan valt die ruimte weg:
           een halve meter wit boven een foutmelding leest als een storing in onze site. */
        style={mislukt || opLocalhost ? undefined : { minHeight: HOOGTE }}
      />
      {opLocalhost ? (
        /* Alleen zichtbaar voor wie de site lokaal bekijkt; op het echte domein bestaat
           deze melding niet. Zonder hem lijkt het alsof de agenda stuk is. */
        <div className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6">
          <p className="text-[16px] leading-7 text-[var(--t-strong)]">
            Je bekijkt deze pagina op localhost. Het script van Salonized wijst
            dan naar hun eigen ontwikkelmachine, dus de agenda blijft hier leeg.
            Open dezelfde pagina via 127.0.0.1 of op het echte domein om hem te
            zien.
          </p>
        </div>
      ) : null}

      {mislukt ? (
        <div className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6">
          <p className="text-[16px] leading-7 text-[var(--t-strong)]">
            De agenda laadt hier niet. Dat ligt meestal aan een adblocker of aan
            het netwerk waar je op zit.
          </p>
          <a
            href={DIBA_SALONIZED_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="diba-label mt-4 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            Open de agenda in een nieuw venster
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
