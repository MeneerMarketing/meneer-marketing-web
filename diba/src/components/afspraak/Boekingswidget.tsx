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

/**
 * De maten van het vak, en waarom ze zo staan.
 *
 * Yasin, 10 september 2026: "die widget gaat niet lekker qua breedte op desktop, en op een
 * iPhone heb je dubbele scroll: een in de widget en een van de pagina zelf."
 *
 * Het eerste is opgelost door de breedte mee te geven. Zonder `width` staat de agenda op
 * de 500 punten van Salonized, en dat is een smalle strook in het midden van een breed
 * scherm. Nu is hij zo breed als de kolom waar hij in staat.
 *
 * Het tweede is niet weg te nemen: de agenda is een paneel met een eigen kop en een
 * schuivende dienstenlijst eronder, en het laadscript kent geen manier om zich aan zijn
 * inhoud aan te passen (`auto-height` zet alleen de hoogte niet, en er luistert niets naar
 * een bericht van binnenuit). Wat wel kan is de hoogte zo kiezen dat het paneel als paneel
 * leest in plaats van als afgekapte pagina. Op een breed scherm 760 punten, ruim genoeg om
 * een stap in een keer te zien; op een telefoon 620, net iets minder dan het beeld, zodat
 * de pagina eronder zichtbaar doorloopt en je merkt waar het paneel ophoudt. Salonized zelf
 * houdt op hun eigen boekpagina 744 punten aan als bovengrens, dus dit ligt in dezelfde orde.
 */
/* Yasin, 12 september 2026: "waarom is dat blok van afspraak zo klein terwijl het juist
   daarom draait, die wil ik lekker groot hebben." Terecht: dit is de enige plek op de site
   waar iemand daadwerkelijk boekt. De agenda stond in een kolom van 760 punten naast de
   uitleg; nu krijgt hij de volle breedte en gaat de uitleg eronder staan. Breedte en
   hoogte gaan mee omhoog, zodat er meer diensten tegelijk in beeld staan en je minder in
   het paneel hoeft te schuiven. Op een telefoon blijft de hoogte 620: net iets minder dan
   het beeld, zodat je ziet dat de pagina eronder doorloopt. */
const HOOGTE = 880;
const HOOGTE_MOBIEL = 620;
const BREEDTE = 1080;

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

    /* Zodra het script een venster naar Salonized in het vak zet, is de agenda er en mag
       de melding weg. Wijst dat venster ergens anders heen, dan is het geen agenda: het
       laadscript zet op een ontwikkelmachine `http://localhost:8090` neer, en dat draait
       alleen bij hen. Zo'n venster vult het vak wel maar toont niets. */
    const deugt = () => {
      const venster = doel.querySelector("iframe");
      if (!venster) return false;
      try {
        return new URL(venster.src, window.location.href).hostname.endsWith(
          "salonized.com",
        );
      } catch {
        return false;
      }
    };

    const kijker = new MutationObserver(() => {
      if (deugt()) setMislukt(false);
    });
    kijker.observe(doel, { childList: true, subtree: true, attributes: true });

    /* Staat er na acht seconden geen agenda, dan is er iets misgegaan. */
    const t = window.setTimeout(() => {
      if (!deugt()) setMislukt(true);
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
        data-height-mobile={HOOGTE_MOBIEL}
        data-width={BREEDTE}
        data-outline="none"
        data-inline="true"
        /* De ruimte staat gereserveerd zolang we wachten, zodat de pagina niet
           verspringt zodra de agenda binnenkomt. Lukt het niet, dan valt die ruimte weg:
           een halve meter wit boven een foutmelding leest als een storing in onze site. */
        /* Geen `min-height` meer: het laadscript zet de hoogte zelf op het vak, en een
           eigen ondergrens erbovenop gaf op een telefoon een stuk wit onder de agenda. */
        style={undefined}
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

      {/* Niet op localhost: daar staat de melding hierboven al, en die legt uit waarom
          het vak leeg blijft. Twee meldingen onder elkaar leest als twee storingen. */}
      {mislukt && !opLocalhost ? (
        <div className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6">
          <p className="text-[16px] leading-7 text-[var(--t-strong)]">
            De agenda laadt hier niet. Dat ligt meestal aan een adblocker of aan
            het netwerk waar je op zit. Bellen kan ook: 010-2038423.
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
