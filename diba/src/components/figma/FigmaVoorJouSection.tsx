"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useId, useState } from "react";
import Button from "@/components/ui/Button";
import HuidIcon from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import type { HomeWens } from "@/data/home-intents";

/**
 * "Waar wil je hulp bij?": kies een huidwens en zie wat erbij hoort.
 *
 * WAT ER MIS WAS. Zeven kaarten die knoppen waren en geen links; klikken wisselde alleen
 * een fotoblok dat op desktop onder drie rijen kaarten stond en op mobiel onder zeven.
 * Op een telefoon zag je dus niets gebeuren. En het blok herhaalde de titel en de zin van
 * de kaart: geen nieuwe informatie, alleen hoogte.
 *
 * WAT HET NU IS (Yasin, 7 september 2026, na een voorstel met twee varianten). Kies-en-zie,
 * maar dan echt: het paneel toont de behandelingen die bij de wens horen, met prijs, elk
 * als link naar zijn eigen pagina, plus een knop naar de pagina over de klacht. De foto's
 * blijven, want die wilden ze houden.
 *
 *   - Desktop: de zeven tegels in twee kolommen links, het paneel in de derde kolom, naast
 *     de tegels. Een klik verandert iets dat je ziet.
 *   - Mobiel: het paneel klapt open onder de tegel die je aantikt, en niet ergens onderaan.
 *
 * MOBIEL BEGINT DICHT, EN GAAT WEER DICHT (Yasin, 8 september 2026). Eerst stond de eerste
 * wens altijd open, ook op een telefoon, en een open tegel kon je niet meer sluiten: nog
 * een keer tikken deed niets. Nu is er op mobiel niets open tot je zelf kiest, en sluit
 * dezelfde tegel weer bij een tweede tik. Op desktop moet de derde kolom wel iets tonen,
 * anders staat daar een gat: zolang niemand koos, staat daar de eerste wens. Die
 * terugval bestaat alleen vanaf lg; op mobiel is hij er niet.
 *
 * WAAROM HET PANEEL IN DE DOM DIRECT NA DE GEKOZEN TEGEL STAAT. Op mobiel is dat de plek
 * waar het moet verschijnen. Op desktop zet het raster hem met een vaste kolom en rij op
 * zijn plek (kolom 3, rij 1 tot 4) en vullen de tegels de cellen die overblijven. Zo is er
 * één paneel in plaats van twee (één verborgen voor mobiel, één voor desktop), en leest
 * een schermlezer de behandelingen één keer.
 *
 * DE DATA KOMT VAN DE SERVER. Dit is een client component (hij onthoudt je keuze), maar
 * de behandelingen erachter zijn drieduizend regels met redactievlaggen. lib/home-wensen
 * houdt per wens over wat hier getoond wordt, met de vlaggen eruit en de prijs als tekst.
 */

/**
 * Hoe een tegel erbij staat.
 *
 * "actief": gekozen, op elk scherm donker. "terugval": niemand koos nog; op desktop staat
 * deze wens in het paneel en is de tegel donker, op mobiel is hij gewoon wit en dicht.
 */
type Stand = "actief" | "terugval" | "rust";

const TEGEL: Record<Stand, string> = {
  actief:
    "bg-[var(--g-700)] text-[var(--on-dark)] shadow-[0_14px_35px_rgba(67,79,58,.18)]",
  terugval:
    "bg-white text-[var(--t-strong)] hover:bg-[var(--g-075)] lg:bg-[var(--g-700)] lg:text-[var(--on-dark)] lg:shadow-[0_14px_35px_rgba(67,79,58,.18)] lg:hover:bg-[var(--g-700)]",
  rust: "bg-white text-[var(--t-strong)] hover:bg-[var(--g-075)] lg:hover:-translate-y-1",
};

const RONDJE: Record<Stand, string> = {
  actief: "bg-[var(--on-dark-accent)] text-[var(--g-700)]",
  terugval:
    "bg-[var(--g-050)] text-[var(--g-700)] lg:bg-[var(--on-dark-accent)]",
  rust: "bg-[var(--g-050)] text-[var(--g-700)]",
};

const ONDERTITEL: Record<Stand, string> = {
  actief: "text-[var(--on-dark-body)]",
  terugval: "text-[var(--t-body)] lg:text-[var(--on-dark-body)]",
  rust: "text-[var(--t-body)]",
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 lg:hidden ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Tegel({
  wens,
  stand,
  paneelId,
  onKies,
}: {
  wens: HomeWens;
  stand: Stand;
  paneelId: string;
  onKies: () => void;
}) {
  const open = stand === "actief";
  return (
    /* De hele tegel is de knop, het pijltje dus ook. Open en dicht met dezelfde tik. */
    <button
      type="button"
      aria-expanded={open}
      aria-controls={open ? paneelId : undefined}
      onClick={onKies}
      className={`flex items-center gap-4 rounded-[var(--r-lg)] p-5 text-left transition-[background-color,transform,box-shadow] duration-300 [transition-timing-function:var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] lg:flex-col lg:items-start lg:gap-0 lg:p-7 ${TEGEL[stand]}`}
    >
      {/* Het rondje is het anker van de tegel en wisselt van kleur zodra je kiest. Het
          icoon zegt waar de tegel over gaat voordat je de titel leest. */}
      <span
        aria-hidden="true"
        className={`inline-grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-pill)] transition-colors ${RONDJE[stand]}`}
      >
        <HuidIcon naam={wens.icoon} size={28} />
      </span>
      <span className="min-w-0 flex-1 lg:mt-6">
        {/* Op mobiel staat de titel naast het icoon in een kolom van zo'n 215px; op 24px
            brak bijna elke naam in tweeën. Iets kleiner, en hij past meestal op één regel. */}
        <span className="diba-card-title block max-lg:text-[20px] max-lg:leading-6">
          {wens.label}
        </span>
        <span
          className={`mt-1 block text-sm leading-6 lg:mt-2 ${ONDERTITEL[stand]}`}
        >
          {wens.kort}
        </span>
      </span>
      <Chevron open={open} />
    </button>
  );
}

/**
 * Het paneel: de foto, de behandelingen met prijs en de twee uitgangen.
 *
 * De knop gaat naar de pagina over de klacht en niet naar de intake: wie hier kiest is
 * aan het kijken, niet aan het boeken. De intake staat er als tekstlink onder, voor wie
 * al genoeg weet.
 */
function Paneel({
  wens,
  id,
  alleenDesktop = false,
}: {
  wens: HomeWens;
  id: string;
  /** De terugval als niemand koos: alleen zichtbaar vanaf lg. */
  alleenDesktop?: boolean;
}) {
  const getoond = wens.behandelingen.length;
  return (
    <div
      id={id}
      className={`overflow-hidden rounded-[var(--r-lg)] bg-white lg:col-start-3 lg:row-span-4 lg:row-start-1 lg:self-start ${
        alleenDesktop ? "max-lg:hidden" : ""
      }`}
    >
      <div className="relative aspect-[16/9] bg-[var(--g-200)] lg:aspect-[4/3]">
        <Image
          key={wens.id}
          src={wens.image}
          alt={wens.imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 34vw, 100vw"
        />
      </div>

      <div className="p-6 sm:p-7">
        <Label>Bij deze klacht</Label>
        <h3 className="diba-card-title-lg mt-3 text-[var(--t-strong)]">
          {wens.label}
        </h3>
        <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
          {wens.kort}
        </p>

        <ul className="mt-5 border-t border-[var(--g-100)]">
          {wens.behandelingen.map((b) => (
            <li key={b.slug} className="border-b border-[var(--g-100)]">
              <Link
                href={`/behandelingen/${b.slug}`}
                className="-mx-2 flex items-baseline justify-between gap-4 rounded-[var(--r-sm)] px-2 py-3 transition-colors hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                <span className="min-w-0">
                  <span className="block text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                    {b.naam}
                  </span>
                  {b.apparaat ? (
                    <span className="diba-label mt-0.5 block truncate text-[var(--t-muted)]">
                      {b.apparaat}
                    </span>
                  ) : null}
                </span>
                <span className="diba-label shrink-0 text-[var(--g-700)]">
                  {b.prijsLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {wens.totaal > getoond ? (
          <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
            Dit zijn {getoond} van de {wens.totaal}.{" "}
            <Link
              href={`/behandelingen#wens-${wens.id}`}
              className="text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
            >
              Bekijk ze allemaal
            </Link>
            .
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* "Alles over deze klacht" en niet "Alles over littekens en poriën": die lange
              namen braken op een telefoon in tweeën binnen een knop met vaste hoogte, ook
              over de volle breedte. De kop van het paneel zegt drie regels hoger al om
              welke klacht het gaat. */}
          <Button href={wens.pad} className="w-full sm:w-auto">
            Alles over deze klacht
          </Button>
          <Link
            href={`/intake?topic=${wens.id}`}
            className="diba-label text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
          >
            Bespreek dit met ons
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Vanaf hier staat het paneel naast de tegels; daaronder klapt het open en dicht. */
const DESKTOP = "(min-width: 1024px)";

export default function FigmaVoorJouSection({
  wensen,
}: {
  wensen: readonly HomeWens[];
}) {
  /* Niets gekozen tot je kiest. Op desktop vult de eerste wens het paneel zolang dat zo
     is; op mobiel staat dan alles dicht. */
  const [actief, setActief] = useState<string | null>(null);
  const paneelId = `${useId().replace(/:/g, "")}-paneel`;
  const gekozen = wensen.find((w) => w.id === actief) ?? null;
  const terugval = wensen[0];

  function kies(id: string) {
    setActief((huidig) => {
      /* Op mobiel sluit een tweede tik de open tegel. Op desktop niet: daar moet het
         paneel iets blijven tonen, en terugvallen op de eerste wens zou de klik
         onverklaarbaar naar een andere wens laten springen. */
      if (huidig === id && !window.matchMedia(DESKTOP).matches) return null;
      return id;
    });
  }

  return (
    /* Op een licht kleurvlak met witte tegels (Rojda, 6 september 2026: "meer opgevuld").
       De hero erboven is olijf en zijn cijferkaart hangt over de rand tot in dit vlak;
       daarom is dit vlak niet wit, anders lag die kaart op niets. */
    <section
      id="voorjou"
      className="bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      <div className="mx-auto">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Label>Voor jou</Label>
            <h2 className="diba-display-s mt-4">Waar wil je hulp bij?</h2>
          </div>
          <p className="max-w-xl self-end text-[15px] leading-7 text-[var(--t-body)]">
            Kies waar je voor komt. Je ziet meteen welke behandelingen erbij
            horen en wat ze kosten; klik door voor het hele verhaal.
          </p>
        </div>

        {/* Drie kolommen op desktop: tegels in de eerste twee, het paneel vast in de
            derde. De tegels vullen de cellen die het paneel overlaat. Onder lg is het één
            kolom en staat het paneel onder de gekozen tegel. */}
        <div
          className="mt-8 sm:mt-12 grid gap-3 lg:grid-cols-[1fr_1fr_1.15fr] lg:gap-4"
          role="group"
          aria-label="Kies waar je hulp bij zoekt"
        >
          {wensen.map((w) => {
            const isGekozen = gekozen?.id === w.id;
            const isTerugval = !gekozen && terugval?.id === w.id;
            const stand: Stand = isGekozen
              ? "actief"
              : isTerugval
                ? "terugval"
                : "rust";
            return (
              <Fragment key={w.id}>
                <Tegel
                  wens={w}
                  stand={stand}
                  paneelId={paneelId}
                  onKies={() => kies(w.id)}
                />
                {isGekozen ? (
                  <Paneel wens={w} id={paneelId} />
                ) : isTerugval ? (
                  <Paneel wens={w} id={paneelId} alleenDesktop />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
