"use client";

import Link from "next/link";
import { useState } from "react";
import Label from "@/components/ui/Label";
import {
  BEHANDELINGEN,
  HUIDLAGEN,
  VOORLOPIGE_PRIJZEN,
  type Behandeling,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De dieptemeter — de uitblinker van het behandelingenoverzicht.
 *
 * Elke pagina in deze site is om één vraag heen gebouwd. Bij de huidproblemen was dat
 * "waar begint dit probleem"; hier is het "hoe diep komt het, en wat kost dat".
 *
 * Waarom juist die vraag. Een lijst met behandelingen leest als een menukaart, en op een
 * menukaart kies je wat het lekkerst klinkt. Maar het verschil tussen een peeling en
 * microneedling is geen smaakverschil: het is een verschil in welke laag je raakt, en
 * dáár volgt de rest uit. Waarom de een meer kost. Waarom je van de een een dag rood
 * bent. Waarom "dieper" niet hetzelfde is als "beter".
 *
 * Wie dat één keer ziet, hoeft ons daarna niet op ons woord te geloven. Dat is het punt.
 *
 * Vier lagen en geen micrometers. Ik zou er getallen bij kunnen zetten, maar hoe diep iets
 * komt hangt af van de instelling, de zone en de huid van die persoon. Vier lagen is wat
 * je eerlijk kunt zeggen en precies genoeg om de vraag te beantwoorden.
 *
 * De huidanalyse hoort er bewust bij terwijl hij geen enkele laag raakt. Dat lege
 * doorsnedebeeld is geen gat in de reeks maar het antwoord: er gebeurt niets met je huid,
 * en dat is de bedoeling.
 *
 * De namen staan ín de doorsnede en niet ernaast. Ernaast lukt niet: de hoornlaag is een
 * strookje van acht procent en daar past geen tweeregelige uitleg naast zonder over de
 * buurlaag heen te lopen. De uitleg staat daarom in een vaste strook eronder, dezelfde
 * oplossing als bij de lichaamskaart van de laserconfigurator.
 */

/** Waar elke laag begint en eindigt in de doorsnede van 400 hoog. */
const LAAGVLAKKEN: Record<string, { readonly y: number; readonly h: number }> = {
  hoornlaag: { y: 34, h: 36 },
  opperhuid: { y: 70, h: 70 },
  "lederhuid-boven": { y: 140, h: 112 },
  "lederhuid-diep": { y: 252, h: 148 },
};

export default function Dieptemeter() {
  const [actief, setActief] = useState<Behandeling>(BEHANDELINGEN[1]);
  const [zweef, setZweef] = useState<string | null>(null);

  const bereikt = (laagId: string) => actief.lagen.includes(laagId as never);
  const uitleg = HUIDLAGEN.find((l) => l.id === zweef);

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
      {/* ── De doorsnede ── */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-6 sm:p-8">
        <Label>Doorsnede van je huid</Label>

        <svg
          viewBox="0 0 420 400"
          /* Gebonden aan een maximum: op volle kolombreedte werd de doorsnede
             zevenhonderd pixels hoog en dan is het geen illustratie meer maar een poster. */
          className="mx-auto mt-5 block h-auto w-full max-w-[380px]"
          aria-hidden="true"
          focusable="false"
          onPointerLeave={() => setZweef(null)}
        >
          <defs>
            {/* Een golvend oppervlak in plaats van een rechte lijn: huid is geen plank,
                en die ene golf is genoeg om het als huid te lezen. */}
            <clipPath id="dm-huid">
              <path d="M0 46c46-18 84-18 130 0s84 18 130 0 84-18 130 0 30 8 30 8v346H0Z" />
            </clipPath>
          </defs>

          <g clipPath="url(#dm-huid)">
            {HUIDLAGEN.map((laag) => {
              const vlak = LAAGVLAKKEN[laag.id];
              const aan = bereikt(laag.id);
              const licht = zweef === laag.id;
              return (
                <rect
                  key={laag.id}
                  x="0"
                  y={vlak.y}
                  width="420"
                  height={vlak.h}
                  fill={
                    aan ? "var(--g-500)" : licht ? "var(--g-200)" : "var(--g-100)"
                  }
                  onPointerEnter={() => setZweef(laag.id)}
                  style={{ transition: "fill .3s var(--ease-diba)" }}
                />
              );
            })}
          </g>

          {/* De namen liggen in de banden. Wit op groen, donker op licht: allebei ver
              boven de contrastdrempel, en ze wisselen mee met de staat. */}
          {HUIDLAGEN.map((laag) => {
            const vlak = LAAGVLAKKEN[laag.id];
            const aan = bereikt(laag.id);
            return (
              <text
                key={laag.id}
                x="24"
                y={vlak.y + vlak.h / 2 + 6}
                fill={aan ? "#ffffff" : "var(--t-strong)"}
                fontSize="17"
                fontWeight="500"
                pointerEvents="none"
                style={{ transition: "fill .3s var(--ease-diba)" }}
              >
                {laag.naam}
              </text>
            );
          })}
        </svg>

        {/* Vaste strook: leeg als je nergens op staat, zodat er niets verspringt. */}
        <div className="mt-5 min-h-[4.5rem] border-t border-[var(--g-100)] pt-4">
          {uitleg ? (
            <p className="text-[15px] leading-6 text-[var(--t-body)]">
              <span className="font-medium text-[var(--t-strong)]">
                {uitleg.naam}.
              </span>{" "}
              {uitleg.zin}
            </p>
          ) : (
            <p className="text-[14px] leading-6 text-[var(--t-muted)]">
              Beweeg over een laag om te lezen wat er zit. Vier lagen en geen millimeters:
              hoe diep iets werkelijk komt hangt af van de instelling, de zone en jouw
              huid.
            </p>
          )}
        </div>
      </div>

      {/* ── De behandelingen ── */}
      <div>
        <div role="tablist" aria-label="Behandeling" className="flex flex-wrap gap-2">
          {BEHANDELINGEN.map((b) => (
            <button
              key={b.slug}
              role="tab"
              type="button"
              aria-selected={b.slug === actief.slug}
              onClick={() => setActief(b)}
              className={`diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                b.slug === actief.slug
                  ? "diba-pill-active"
                  : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
              }`}
            >
              {b.naam}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="diba-display-s max-w-[18ch]">{actief.naam}</h3>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(actief.werking)}
          </p>

          <dl className="mt-8 grid gap-px overflow-hidden rounded-[var(--r-sm)] bg-[var(--g-100)] sm:grid-cols-3">
            <div className="bg-white p-5">
              <dt className="diba-label text-[var(--t-muted)]">Hoe diep</dt>
              <dd className="mt-2 text-[15px] leading-6 text-[var(--t-strong)]">
                {actief.lagen.length === 0
                  ? "Raakt niets"
                  : HUIDLAGEN.find(
                      (l) => l.id === actief.lagen[actief.lagen.length - 1],
                    )?.naam}
              </dd>
            </div>
            <div className="bg-white p-5">
              <dt className="diba-label text-[var(--t-muted)]">Herstel</dt>
              <dd className="mt-2 text-[15px] leading-6 text-[var(--t-strong)]">
                {publicCopy(actief.herstel)}
              </dd>
            </div>
            <div className="bg-white p-5">
              <dt className="diba-label text-[var(--t-muted)]">Per sessie</dt>
              <dd className="mt-2 text-[15px] leading-6 text-[var(--t-strong)] tabular-nums">
                € {actief.prijs}
              </dd>
            </div>
          </dl>

          {VOORLOPIGE_PRIJZEN ? (
            <p className="mt-3 text-[13px] leading-5 text-[var(--t-muted)]">
              Het bedrag is voorlopig en nog niet door de kliniek vastgesteld.
            </p>
          ) : null}

          <Link
            href={`/behandelingen/${actief.slug}`}
            className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            Alles over {actief.naam.toLowerCase()}
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
