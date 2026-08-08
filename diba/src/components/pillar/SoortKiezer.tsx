"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Keuzelijst met detailpaneel — het herkenningsonderdeel van elke huidprobleempagina.
 *
 * Bijna elke aandoening bestaat uit meerdere beelden die om een andere aanpak vragen.
 * Acne is niet één ding, pigment is niet één ding, rosacea is niet één ding. Deze
 * component laat de bezoeker zijn eigen beeld kiezen en geeft daar een eerlijk antwoord
 * bij, inclusief de gevallen waarin we doorverwijzen.
 *
 * Elke pagina levert eigen inhoud; de vorm is gedeeld zodat de site consistent blijft en
 * een nieuwe pagina niet opnieuw hoeft te worden uitgevonden.
 *
 * Toegankelijkheid: radiogroup, elke optie minstens 48px hoog, en het paneel meldt zich
 * via aria-live zodat een wisseling ook zonder zicht doorkomt.
 */

export type SoortOptie = {
  readonly id: string;
  readonly naam: string;
  /** Wat een 15-jarige én een 60-jarige direct snapt (§10). */
  readonly klanttaal: string;
  /** De vakterm, ernaast en niet in plaats daarvan. */
  readonly vakterm: string;
  /** Kop-tekstparen, in de volgorde waarin ze getoond worden. */
  readonly velden: readonly (readonly [string, string])[];
  /** Het uitgelichte blok onderaan: meestal het misverstand of de eerlijke uitkomst. */
  readonly uitgelicht?: { readonly label: string; readonly tekst: string };
};

export default function SoortKiezer({
  opties,
  ctaHrefPatroon,
  ctaLabel = "Laat dit beeld bekijken",
  hint,
}: {
  opties: readonly SoortOptie[];
  /**
   * Link met `{id}` als plaatshouder voor het gekozen beeld, zodat de intake weet waar
   * het over gaat. Een patroon en geen functie: functies zijn niet te serialiseren van
   * een servercomponent naar een clientcomponent.
   */
  ctaHrefPatroon: string;
  ctaLabel?: string;
  hint?: string;
}) {
  const [actief, setActief] = useState(0);
  const optie = opties[actief];

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
      <ul
        role="radiogroup"
        aria-label="Kies het beeld dat het dichtst bij jouw huid komt"
        className="space-y-2"
      >
        {opties.map((o, i) => {
          const gekozen = i === actief;
          return (
            <li key={o.id}>
              <button
                type="button"
                role="radio"
                aria-checked={gekozen}
                onClick={() => setActief(i)}
                className={`flex min-h-12 w-full flex-col items-start gap-0.5 rounded-[var(--r-sm)] px-4 py-3.5 text-left transition ${
                  gekozen
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-[var(--g-050)] hover:bg-[var(--g-075)]"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
              >
                <span className="text-[15px] font-medium leading-6">
                  {o.naam}
                </span>
                <span
                  className={`text-sm leading-5 ${
                    gekozen
                      ? "text-[var(--on-dark-body)]"
                      : "text-[var(--t-body)]"
                  }`}
                >
                  {o.klanttaal}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className="rounded-[var(--r-md)] bg-white p-6 sm:p-8"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="diba-card-title-lg">{optie.naam}</h3>
          <span className="diba-label text-[var(--t-muted)]">
            {optie.vakterm}
          </span>
        </div>

        <dl className="mt-6 space-y-5">
          {optie.velden.map(([kop, tekst]) => (
            <div key={kop} className="border-l-2 border-[var(--g-200)] pl-4">
              <dt className="diba-label">{kop}</dt>
              <dd className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(tekst)}
              </dd>
            </div>
          ))}
        </dl>

        {optie.uitgelicht ? (
          <div className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-075)] p-5">
            <Label>{optie.uitgelicht.label}</Label>
            <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
              {publicCopy(optie.uitgelicht.tekst)}
            </p>
          </div>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href={ctaHrefPatroon.replace("{id}", optie.id)}>
            {ctaLabel}
          </Button>
          {hint ? <Label className="max-w-[26ch]">{hint}</Label> : null}
        </div>
      </div>
    </div>
  );
}
