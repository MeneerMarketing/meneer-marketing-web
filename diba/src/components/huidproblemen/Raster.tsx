"use client";

import Link from "next/link";
import { useState } from "react";
import Label from "@/components/ui/Label";
import { BESTEMMINGEN, type Groep } from "@/data/symptoomzoeker";

/**
 * Het raster op het huidproblemenoverzicht.
 *
 * De eerste versie zette de vier groepen onder elkaar als vier blokken met zestien
 * identieke witte vakjes. Dat klopte inhoudelijk en het las als een tabel: statisch, en
 * het enige interessante aan de indeling — dat een deel van de onderwerpen niet van ons is
 * — moest je zelf uit vier koppen halen.
 *
 * Nu is het één raster dat filtert. De teller in de kop verspringt mee, dus je ziet het
 * verschil in plaats van het te lezen: zeventien pagina's, tien waar wij aan werken.
 * Kies je "hier sturen wij je door", dan blijven er vier over en zegt de regel eronder
 * waarom die er zijn.
 *
 * De kaarten zelf verschillen per groep. Wat wij behandelen krijgt een groene rand aan de
 * kop en de tekst "lees verder"; wat naar een arts gaat krijgt een okeren rand en een
 * pijl naar buiten. Zo zie je aan een kaart al waar hij je heen brengt.
 */

type Filter = "alles" | Groep;

const FILTERS: readonly { readonly id: Filter; readonly label: string }[] = [
  { id: "alles", label: "Alles" },
  { id: "behandelen", label: "Hier kunnen wij iets" },
  { id: "doorverwijzen", label: "Hier sturen wij je door" },
  { id: "niet", label: "Hier doen wij niets" },
  { id: "wegwijzer", label: "Weet je het niet" },
];

const REGEL: Record<Filter, string> = {
  alles:
    "Zeventien pagina's, ingedeeld naar wat wij ermee doen. Tik een groep aan en kijk wat er overblijft.",
  behandelen:
    "Tien onderwerpen met een eigen pagina, elk beginnend bij de vraag die er bij dat probleem het meest toe doet. Niet bij wat het kost, en niet bij wat wij toevallig aanbieden.",
  doorverwijzen:
    "Vier onderwerpen waar wij niet over gaan. Deze pagina's hebben geen afspraakknop; ze staan er omdat mensen ons dit vragen terwijl ze bij ons op de stoel liggen.",
  niet: "Eén onderwerp waar niemand iets aan kan. Die pagina bestaat om te voorkomen dat je ergens anders betaalt voor een belofte.",
  wegwijzer:
    "Twee wegwijzers die sorteren op wat je ziet, in plaats van op een naam die je niet kent.",
};

/** De zoeker hoort in de laatste groep maar staat niet in de bestemmingenlijst. */
const ZOEKER = {
  naam: "Symptoomzoeker",
  pad: "/huidproblemen/symptoomzoeker",
  zin: "Kruis aan wat je ziet en voelt, in gewone woorden, en de pagina's rangschikken zich.",
  groep: "wegwijzer" as Groep,
};

const RAND: Record<Groep, string> = {
  behandelen: "border-t-[var(--g-400)]",
  doorverwijzen: "border-t-[var(--warn)]",
  niet: "border-t-[var(--t-muted)]",
  wegwijzer: "border-t-[var(--g-200)]",
};

const SLOT: Record<Groep, string> = {
  behandelen: "Lees verder",
  doorverwijzen: "Naar de huisarts",
  niet: "Waarom niet",
  wegwijzer: "Zoek het uit",
};

const SLOTKLEUR: Record<Groep, string> = {
  behandelen: "text-[var(--g-700)]",
  doorverwijzen: "text-[var(--warn-text)]",
  niet: "text-[var(--t-muted)]",
  wegwijzer: "text-[var(--g-700)]",
};

export default function Raster() {
  const [filter, setFilter] = useState<Filter>("alles");

  const alles = [...BESTEMMINGEN, ZOEKER];
  const zichtbaar = alles.filter((b) => filter === "alles" || b.groep === filter);
  const behandelen = alles.filter((b) => b.groep === "behandelen").length;

  return (
    <div>
      {/* ── De teller. Verspringt mee, zodat je het verschil ziet in plaats van leest. ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12">
        <div>
          <Label>Alle huidproblemen</Label>
          {/* De regels worden als string opgebouwd en niet als los stuk JSX-tekst naast
              een expressie: daar viel de spatie tussen het getal en het woord weg
              ("17pagina's"). Een template-string laat niets aan de opmaak over. */}
          <h2 className="diba-display-m mt-4">
            {`${zichtbaar.length} ${zichtbaar.length === 1 ? "pagina" : "pagina's"}.`}
            <br />
            <span className="diba-accent">
              {filter === "alles"
                ? `${behandelen} zijn er van ons.`
                : `${FILTERS.find((f) => f.id === filter)?.label}.`}
            </span>
          </h2>
        </div>
        <p
          className="max-w-[58ch] self-end text-[16px] leading-7 text-[var(--t-body)]"
          aria-live="polite"
        >
          {REGEL[filter]}
        </p>
      </div>

      {/* ── De filters ── */}
      <div
        role="tablist"
        aria-label="Filter op wat wij ermee doen"
        className="mt-9 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {FILTERS.map((f) => {
          const aan = f.id === filter;
          const aantal =
            f.id === "alles" ? alles.length : alles.filter((b) => b.groep === f.id).length;
          return (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={aan}
              onClick={() => setFilter(f.id)}
              className={`flex min-h-12 shrink-0 items-center gap-2 rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                aan
                  ? "bg-[var(--g-700)] text-[var(--on-dark-label)]"
                  : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
              }`}
            >
              <span className="diba-label whitespace-nowrap">{f.label}</span>
              <span
                className={`diba-label tabular-nums ${
                  aan ? "text-[var(--on-dark-accent)]" : "text-[var(--t-muted)]"
                }`}
              >
                {aantal}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Het raster ──
          Alle kaarten blijven staan; wat niet past valt weg met een korte overgang in
          plaats van te verspringen. Zo blijft zichtbaar dát er iets wegvalt. */}
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {zichtbaar.map((b) => (
          <li key={b.pad}>
            <Link
              href={b.pad}
              className={`group flex h-full flex-col rounded-[var(--r-md)] border-t-2 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 ${
                RAND[b.groep]
              }`}
            >
              <span className="diba-card-title block">{b.naam}</span>
              <span className="mt-3 block grow text-[15px] leading-7 text-[var(--t-body)]">
                {b.zin}
              </span>
              <span
                className={`diba-label mt-6 flex items-center gap-2 ${SLOTKLEUR[b.groep]}`}
              >
                {SLOT[b.groep]}
                <svg
                  viewBox="0 0 16 16"
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
