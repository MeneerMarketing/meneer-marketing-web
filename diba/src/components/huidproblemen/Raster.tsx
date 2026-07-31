"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import {
  FIGMA_INTENT_ACNE,
  FIGMA_INTENT_LICHAAM,
  FIGMA_INTENT_LITTEKENS,
  FIGMA_INTENT_PIGMENT,
  FIGMA_INTENT_VEROUDERING,
} from "@/data/figma-home-images";
import { BESTEMMINGEN, type Groep } from "@/data/symptoomzoeker";

/**
 * Het raster op het huidproblemenoverzicht.
 *
 * Twee eerdere versies waren fout om dezelfde reden. De eerste zette vier groepen onder
 * elkaar als zestien identieke witte vakjes: een tabel. De tweede filterde wel, maar de
 * koppen gingen over de website ("zeventien pagina's, vijf gaan niet over ons") in plaats
 * van over huid. Interessant voor de bouwer, nutteloos voor iemand met een probleem.
 *
 * Nu volgt hij de vorm van "Waar wil je hulp bij?" op de homepage: mintkaarten met een
 * pijlschijfje, de gekozen kaart in donkergroen, en daaronder een breed focusvlak met
 * beeld. Kiezen en kijken, en pas dan doorklikken.
 *
 * Wat elke kaart draagt is de eerste vraag van die aandoening. Dat is het onderscheidende
 * van de hele reeks: bij acne telt wáár het zit, bij pigment welk seizoen het is, bij
 * littekens hoe oud ze zijn. Wie met de verkeerde vraag begint behandelt maanden het
 * verkeerde, en dat is precies wat hier te zien is voordat je iets aanklikt.
 *
 * De groepen blijven, want ze zijn waar: een deel hoort bij een arts en bij één onderwerp
 * kan niemand iets. Ze staan nu alleen in klinische taal in plaats van als paginatelling.
 */

type Filter = "alles" | Groep;

const FILTERS: readonly { readonly id: Filter; readonly label: string }[] = [
  { id: "alles", label: "Alles" },
  { id: "behandelen", label: "Wij behandelen dit" },
  { id: "doorverwijzen", label: "Dit hoort bij een arts" },
  { id: "niet", label: "Hier bestaat geen behandeling voor" },
  { id: "wegwijzer", label: "Weet je het niet" },
];

const REGEL: Record<Filter, string> = {
  alles:
    "Kies waar je last van hebt. Je ziet meteen met welke vraag we bij dat probleem beginnen, want die verschilt per aandoening.",
  behandelen:
    "Hier meten we eerst en behandelen we daarna, of we raden het af. Elke pagina begint bij de vraag die bij dat probleem het zwaarst weegt.",
  doorverwijzen:
    "Deze horen bij je huisarts of een dermatoloog. We leggen uit waar je op let en waar je heen gaat, en we maken er geen afspraak voor.",
  niet: "Hier kan niemand wat er beloofd wordt. Dat staat er met de uitleg erbij, zodat je het elders ook herkent.",
  wegwijzer:
    "Weet je niet hoe het heet? Deze twee sorteren op wat je ziet in plaats van op een naam.",
};

/** De zoeker hoort in de laatste groep maar is een gereedschap, geen aandoening. */
const ZOEKER = {
  naam: "Symptoomzoeker",
  pad: "/huidproblemen/symptoomzoeker",
  zin: "Kruis aan wat je ziet en voelt, in gewone woorden.",
  eersteVraag: "Wat zie je precies?",
  groep: "wegwijzer" as Groep,
};

/** Beeld per onderwerp. Vijf shoots, verdeeld naar wat er te zien is. */
const BEELD: Record<string, { readonly src: string; readonly alt: string }> = {
  "/huidproblemen/acne": FIGMA_INTENT_ACNE,
  "/huidproblemen/rosacea": FIGMA_INTENT_ACNE,
  "/huidproblemen/porien": FIGMA_INTENT_ACNE,
  "/huidproblemen/gevoelige-huid": FIGMA_INTENT_ACNE,
  "/huidproblemen/pigmentvlekken": FIGMA_INTENT_PIGMENT,
  "/huidproblemen/melasma": FIGMA_INTENT_PIGMENT,
  "/huidproblemen/huidverkleuring": FIGMA_INTENT_PIGMENT,
  "/huidproblemen/donkere-kringen": FIGMA_INTENT_PIGMENT,
  "/huidproblemen/littekens": FIGMA_INTENT_LITTEKENS,
  "/huidproblemen/huidveroudering": FIGMA_INTENT_VEROUDERING,
  "/huidproblemen/droge-huid": FIGMA_INTENT_VEROUDERING,
  "/huidproblemen/moedervlekken": FIGMA_INTENT_VEROUDERING,
  "/huidproblemen/eczeem": FIGMA_INTENT_LICHAAM,
  "/huidproblemen/psoriasis": FIGMA_INTENT_LICHAAM,
  "/huidproblemen/huiduitslag": FIGMA_INTENT_LICHAAM,
  "/huidproblemen/cellulitis": FIGMA_INTENT_LICHAAM,
  "/huidproblemen/symptoomzoeker": FIGMA_INTENT_ACNE,
};

const CTA: Record<Groep, string> = {
  behandelen: "Lees hoe wij dit aanpakken",
  doorverwijzen: "Lees waar je op let",
  niet: "Lees waarom niemand dit kan",
  wegwijzer: "Zoek het uit",
};

export default function Raster() {
  const [filter, setFilter] = useState<Filter>("alles");
  const alles = [...BESTEMMINGEN, ZOEKER];
  const zichtbaar = alles.filter(
    (b) => filter === "alles" || b.groep === filter,
  );
  const [gekozenPad, setGekozenPad] = useState(alles[0].pad);

  /* Valt de keuze buiten het filter, dan schuift hij naar de eerste die er wel in past.
     Afgeleid tijdens de render, want state die state naloopt is een extra ronde. */
  const gekozen = zichtbaar.find((b) => b.pad === gekozenPad) ?? zichtbaar[0];
  const beeld = BEELD[gekozen.pad] ?? FIGMA_INTENT_ACNE;

  return (
    <div>
      {/* ── Kop en filters ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12">
        <div>
          <Label>Voor jou</Label>
          <h2 className="diba-display-m mt-4 max-w-[16ch]">
            Waar wil je hulp bij?
          </h2>
        </div>
        <p
          className="max-w-[58ch] self-end text-[16px] leading-7 text-[var(--t-body)]"
          aria-live="polite"
        >
          {REGEL[filter]}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Filter op wat wij ermee doen"
        className="mt-9 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {FILTERS.map((f) => {
          const aan = f.id === filter;
          return (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={aan}
              onClick={() => setFilter(f.id)}
              className={`diba-label flex min-h-12 shrink-0 items-center rounded-[var(--r-pill)] px-5 whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                aan
                  ? "bg-[var(--g-700)] text-[var(--on-dark-label)]"
                  : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── De kaarten ── */}
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {zichtbaar.map((b) => {
          const aan = b.pad === gekozen.pad;
          return (
            <li key={b.pad}>
              <button
                type="button"
                aria-pressed={aan}
                onClick={() => setGekozenPad(b.pad)}
                className={`h-full w-full rounded-[var(--r-lg)] p-6 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] motion-reduce:transition-none sm:p-7 ${
                  aan
                    ? "bg-[var(--g-700)] shadow-[var(--shadow-float)]"
                    : "bg-[var(--g-050)] hover:bg-[var(--g-100)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 items-center justify-center rounded-[var(--r-pill)] transition-colors ${
                    aan ? "bg-[var(--on-dark-accent)]" : "bg-white"
                  }`}
                >
                  <svg
                    viewBox="0 0 16 16"
                    className={`h-3.5 w-3.5 ${aan ? "text-[var(--g-800)]" : "text-[var(--g-700)]"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                  </svg>
                </span>

                <span
                  className={`diba-card-title mt-8 block ${
                    aan ? "text-[var(--on-dark)]" : "text-[var(--t-strong)]"
                  }`}
                >
                  {b.naam}
                </span>
                <span
                  className={`mt-2 block text-[15px] leading-6 ${
                    aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-body)]"
                  }`}
                >
                  {b.eersteVraag}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── Het focusvlak ── */}
      <div
        className="mt-3 grid overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-075)] lg:grid-cols-[0.85fr_1.15fr]"
        aria-live="polite"
      >
        <div className="relative min-h-[220px] lg:min-h-[320px]">
          <Image
            src={beeld.src}
            alt={beeld.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="p-7 sm:p-10">
          <Label>Jouw focus</Label>
          <h3 className="diba-display-s mt-4">{gekozen.naam}</h3>

          <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
            {gekozen.zin}
          </p>

          <p className="mt-6 border-l-2 border-[var(--g-300)] pl-4">
            <Label>Waar we mee beginnen</Label>
            <span className="diba-card-title mt-2 block text-[var(--t-strong)]">
              {gekozen.eersteVraag}
            </span>
          </p>

          <div className="mt-8">
            <Button href={gekozen.pad}>{CTA[gekozen.groep]}</Button>
          </div>
        </div>
      </div>

      {/* Alle kaarten blijven ook zonder JavaScript bereikbaar. */}
      <noscript>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {alles.map((b) => (
            <li key={b.pad}>
              <Link
                href={b.pad}
                className="diba-label text-[var(--g-700)] underline underline-offset-4"
              >
                {b.naam}
              </Link>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
