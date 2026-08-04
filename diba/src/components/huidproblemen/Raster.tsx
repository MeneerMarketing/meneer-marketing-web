"use client";

import Link from "next/link";
import Label from "@/components/ui/Label";
import { BESTEMMINGEN, type Groep } from "@/data/symptoomzoeker";

/**
 * Het raster op het huidproblemenoverzicht.
 *
 * Drie versies verder is dit wat werkt. De eerste zette de groepen onder elkaar met
 * identieke witte vakjes: een tabel. De tweede maakte er één filterbaar raster van, maar
 * dan is het zeventien kaarten achter elkaar en zie je de indeling niet meer. De derde
 * gebruikte de kaartvorm van de homepage, waar een kaart alleen een voorbeeld selecteert;
 * op een overzicht wil je gewoon naar die pagina.
 *
 * Nu: kaarten in de vorm van de homepage, maar gegroepeerd onder hun kop en met een
 * sprongnavigatie erboven. De indeling is meteen zichtbaar, de kaarten zijn links, en je
 * scrolt langs vier duidelijke blokken in plaats van langs één lijst.
 *
 * Wat elke kaart draagt is de eerste vraag van die aandoening. Dat is het onderscheidende
 * van de hele reeks: bij acne telt wáár het zit, bij pigment welk seizoen het is, bij
 * littekens hoe oud ze zijn. Zo weet je vóór het doorklikken waar we beginnen.
 */

/** De zoeker hoort in de laatste groep maar is gereedschap, geen aandoening. */
const ZOEKER = {
  naam: "Symptoomzoeker",
  pad: "/huidproblemen/symptoomzoeker",
  zin: "Kruis aan wat je ziet en voelt, in gewone woorden.",
  eersteVraag: "Wat zie je precies?",
  groep: "wegwijzer" as Groep,
};

const GROEPEN: readonly {
  readonly id: Groep;
  readonly anker: string;
  readonly kort: string;
  readonly label: string;
  readonly kop: string;
  readonly accent: string;
  readonly intro: string;
}[] = [
  {
    id: "behandelen",
    anker: "behandelen",
    kort: "Wij behandelen dit",
    label: "Hier kunnen wij iets",
    kop: "Wat wij",
    accent: "behandelen.",
    intro:
      "Elk met een eigen pagina die begint bij de vraag die bij dat probleem het zwaarst weegt. Eerst meten, dan pas een plan, en soms is het advies om niets te doen.",
  },
  {
    id: "doorverwijzen",
    anker: "arts",
    kort: "Bij een arts",
    label: "Hier sturen wij je door",
    kop: "Wat bij een arts",
    accent: "hoort.",
    intro:
      "Deze pagina's hebben geen afspraakknop. Ze staan er omdat mensen ons dit vragen terwijl ze bij ons op de stoel liggen, en dan is een goed antwoord beter dan een ontwijkend.",
  },
  {
    id: "niet",
    anker: "geen-behandeling",
    kort: "Geen behandeling",
    label: "Hier bestaat geen behandeling voor",
    kop: "Waar niemand",
    accent: "iets aan kan.",
    intro:
      "Dat staat er zo, met de uitleg waarom geen enkele crème of apparaat het weghaalt. Zodat je het elders herkent als het je toch wordt aangeboden.",
  },
  {
    id: "wegwijzer",
    anker: "wegwijzer",
    kort: "Weet je het niet",
    label: "Weet je niet hoe het heet",
    kop: "Begin dan",
    accent: "bij wat je ziet.",
    intro:
      "Twee wegwijzers die sorteren op kleur of op wat je voelt, in plaats van op een naam die je niet kent.",
  },
];

export default function Raster() {
  const alles = [...BESTEMMINGEN, ZOEKER];

  return (
    <div>
      {/* ── Sprongnavigatie ──
          Plakt onder de header, zodat je vanaf elke plek naar een groep kunt springen.
          Dezelfde vorm als de in-paginanavigatie op de huidprobleempagina's zelf. */}
      <nav
        aria-label="Naar een groep"
        className="sticky top-0 z-20 -mx-5 border-y border-[var(--g-100)] bg-[var(--g-010)]/95 backdrop-blur sm:-mx-9 lg:-mx-[7.5vw]"
      >
        <ul className="mx-auto flex max-w-[1800px] gap-2 overflow-x-auto px-5 py-3 sm:px-9 lg:px-[7.5vw]">
          {GROEPEN.map((g) => {
            const aantal = alles.filter((b) => b.groep === g.id).length;
            return (
              <li key={g.id}>
                <a
                  href={`#${g.anker}`}
                  className="diba-label flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-050)] px-4 whitespace-nowrap text-[var(--t-label)] transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {g.kort}
                  <span className="tabular-nums text-[var(--t-muted)]">{aantal}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── De vier groepen ── */}
      {GROEPEN.map((g) => {
        const items = alles.filter((b) => b.groep === g.id);
        return (
          <section key={g.id} id={g.anker} className="scroll-mt-16 pt-16 first:pt-12">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12">
              <div>
                <Label>{g.label}</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  {g.kop}
                  <br />
                  <span className="diba-accent">{g.accent}</span>
                </h2>
              </div>
              <p className="max-w-[58ch] self-end text-[16px] leading-7 text-[var(--t-body)]">
                {g.intro}
              </p>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((b) => (
                <li key={b.pad}>
                  <Link
                    href={b.pad}
                    className="group block h-full rounded-[var(--r-lg)] bg-[var(--g-050)] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--g-100)] hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-[var(--r-pill)] bg-white transition-colors group-hover:bg-[var(--g-700)]"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 text-[var(--g-700)] transition-colors group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                      </svg>
                    </span>

                    <span className="diba-card-title mt-8 block text-[var(--t-strong)]">
                      {b.naam}
                    </span>
                    <span className="mt-2 block text-[15px] leading-6 text-[var(--t-body)]">
                      {b.eersteVraag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
