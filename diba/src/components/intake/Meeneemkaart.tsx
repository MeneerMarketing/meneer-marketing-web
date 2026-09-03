"use client";

import Link from "next/link";
import { useState } from "react";
import Label from "@/components/ui/Label";
import {
  compleetheid,
  intakeTekst,
  meldPunten,
  profielIsLeeg,
  PROFIEL_ONDERDELEN,
} from "@/data/huidprofiel";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";
import { DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De meeneemkaart op /intake.
 *
 * HET GAT DAT DIT DICHT.
 *
 * Je kon een huidprofiel opbouwen dat klopte, en dan klikte je op "plan een huidconsult"
 * en kwam je op /intake, waar een algemene uitleg stond die niets van jou wist. Twee losse
 * dingen dus, terwijl het één keten hoort te zijn. Wie hier binnenloopt met zijn
 * contra-indicaties al op tafel, scheelt de therapeut de helft van het uitvraagwerk.
 *
 * WAAROM EEN KOPIEERKNOP EN GEEN VERZENDKNOP.
 *
 * Het profiel staat in de browser van de bezoeker en gaat nergens heen. Dat staat in het
 * privacybeleid en het is de reden dat er op deze site geen enkel formulier staat. Een
 * knop die het naar ons stuurt zou die belofte omdraaien.
 *
 * Dus kopieert de bezoeker de tekst en plakt hij hem zelf in zijn bericht. Hij bepaalt of
 * het verstuurd wordt en wat erin staat. Dat is omslachtiger dan een verzendknop en het is
 * het enige dat klopt met wat we elders beloven.
 *
 * WAT ER GEBEURT ALS ER GEEN PROFIEL IS.
 *
 * Dan staat er geen lege kaart maar een reden om hem wel te maken, met het getal erbij dat
 * die reden draagt: wat je nu invult scheelt je een afspraak die niet doorgaat.
 */

export default function Meeneemkaart() {
  const { profiel } = useHuidprofiel();
  const [gekopieerd, setGekopieerd] = useState(false);
  const [mislukt, setMislukt] = useState(false);

  const leeg = profielIsLeeg(profiel);
  const stand = compleetheid(profiel);
  const melden = meldPunten(profiel);

  async function kopieer() {
    setMislukt(false);
    try {
      await navigator.clipboard.writeText(intakeTekst(profiel));
      setGekopieerd(true);
      window.setTimeout(() => setGekopieerd(false), 4000);
    } catch {
      /* Clipboard geweigerd of niet beschikbaar. Dan tonen we de tekst zelf, zodat
         hij alsnog te selecteren is en de knop niet stilletjes niets doet. */
      setMislukt(true);
    }
  }

  if (leeg) {
    return (
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <Label>Voordat je komt</Label>
        <p className="diba-card-title mt-3 text-[var(--t-strong)]">
          Neem je huidprofiel mee
        </p>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
          In {PROFIEL_ONDERDELEN} stappen leg je vast wat je wil veranderen en
          wat je huid aankan. Retinol, zwangerschap, een gebruinde huid,
          medicatie: met die antwoorden staat je behandeling al klaar als je
          binnenkomt.
        </p>
        <Link
          href="/huidprofiel"
          className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
        >
          Stel je huidprofiel samen
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--r-lg)] bg-[var(--g-200)] p-7 sm:p-9">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <Label className="text-[var(--g-800)]">Je neemt dit mee</Label>
        <p className="text-[14px] leading-6 text-[var(--g-900)] tabular-nums">
          {stand} van {PROFIEL_ONDERDELEN} ingevuld
        </p>
      </div>

      <p className="diba-card-title mt-3 text-[var(--g-900)]">
        {melden.length > 0
          ? `${melden.length} ${melden.length === 1 ? "ding" : "dingen"} om te bespreken`
          : "Je profiel is klaar"}
      </p>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-[var(--g-900)]">
        {melden.length > 0
          ? "Dit zijn de dingen die anders pas aan de balie boven tafel komen. Stuur ze mee als je boekt, dan is de afspraak meteen de juiste."
          : "Er zit op grond van je antwoorden niets in de weg. Stuur je profiel mee als je boekt, dan hoeft het niet nog een keer uitgevraagd te worden."}
      </p>

      {melden.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {melden.map((m) => (
            <li
              key={m}
              className="rounded-[var(--r-md)] bg-white p-5 text-[15px] leading-7 text-[var(--t-body)]"
            >
              {m}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={kopieer}
          className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          {gekopieerd ? "Gekopieerd" : "Kopieer je profiel"}
        </button>
        <a
          href={DIBA_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="diba-label inline-flex min-h-12 items-center text-[var(--g-800)] underline underline-offset-4 hover:text-[var(--g-900)]"
        >
          Daarna plakken in je bericht
        </a>
        <Link
          href="/huidprofiel"
          className="diba-label inline-flex min-h-12 items-center text-[var(--g-800)] underline underline-offset-4 hover:text-[var(--g-900)]"
        >
          Aanvullen
        </Link>
      </div>

      <p
        aria-live="polite"
        className="mt-5 text-[14px] leading-6 text-[var(--g-900)]"
      >
        {gekopieerd
          ? "De tekst staat op je klembord. Er is niets verstuurd: dat doe jij zelf, als je wil."
          : "Je profiel blijft in deze browser staan en gaat uit zichzelf nergens heen. Kopiëren zet het op je klembord, meer niet."}
      </p>

      {mislukt ? (
        <div className="mt-5 rounded-[var(--r-md)] bg-white p-5">
          <p className="diba-label text-[var(--t-label)]">
            Kopiëren lukte niet in deze browser
          </p>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            Selecteer de tekst hieronder en kopieer hem met de hand.
          </p>
          <pre className="mt-4 max-h-64 overflow-auto rounded-[var(--r-sm)] bg-[var(--g-025)] p-4 text-[13px] leading-6 whitespace-pre-wrap text-[var(--t-body)]">
            {intakeTekst(profiel)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
