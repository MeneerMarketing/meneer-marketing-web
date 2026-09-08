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
  actief,
  paneelId,
  onKies,
}: {
  wens: HomeWens;
  actief: boolean;
  paneelId: string;
  onKies: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={actief}
      aria-controls={paneelId}
      onClick={onKies}
      className={`flex items-center gap-4 rounded-[var(--r-lg)] p-5 text-left transition-[background-color,transform,box-shadow] duration-300 [transition-timing-function:var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] lg:flex-col lg:items-start lg:gap-0 lg:p-7 ${
        actief
          ? "bg-[var(--g-700)] text-[var(--on-dark)] shadow-[0_14px_35px_rgba(67,79,58,.18)]"
          : "bg-white text-[var(--t-strong)] hover:bg-[var(--g-075)] lg:hover:-translate-y-1"
      }`}
    >
      {/* Het rondje is het anker van de tegel en wisselt van kleur zodra je kiest. Het
          icoon zegt waar de tegel over gaat voordat je de titel leest. */}
      <span
        aria-hidden="true"
        className={`inline-grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-pill)] transition-colors ${
          actief
            ? "bg-[var(--on-dark-accent)] text-[var(--g-700)]"
            : "bg-[var(--g-050)] text-[var(--g-700)]"
        }`}
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
          className={`mt-1 block text-sm leading-6 lg:mt-2 ${
            actief ? "text-[var(--on-dark-body)]" : "text-[var(--t-body)]"
          }`}
        >
          {wens.kort}
        </span>
      </span>
      <Chevron open={actief} />
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
function Paneel({ wens, id }: { wens: HomeWens; id: string }) {
  const getoond = wens.behandelingen.length;
  return (
    <div
      id={id}
      className="overflow-hidden rounded-[var(--r-lg)] bg-white lg:col-start-3 lg:row-span-4 lg:row-start-1 lg:self-start"
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

export default function FigmaVoorJouSection({
  wensen,
}: {
  wensen: readonly HomeWens[];
}) {
  const [actief, setActief] = useState(wensen[0]?.id ?? "");
  const paneelId = `${useId().replace(/:/g, "")}-paneel`;
  const gekozen = wensen.find((w) => w.id === actief) ?? wensen[0];

  return (
    /* Op een licht kleurvlak met witte tegels (Rojda, 6 september 2026: "meer opgevuld").
       De hero erboven is olijf en zijn cijferkaart hangt over de rand tot in dit vlak;
       daarom is dit vlak niet wit, anders lag die kaart op niets. */
    <section
      id="voorjou"
      className="bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
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
          className="mt-12 grid gap-3 lg:grid-cols-[1fr_1fr_1.15fr] lg:gap-4"
          role="group"
          aria-label="Kies waar je hulp bij zoekt"
        >
          {wensen.map((w) => (
            <Fragment key={w.id}>
              <Tegel
                wens={w}
                actief={gekozen?.id === w.id}
                paneelId={paneelId}
                onKies={() => setActief(w.id)}
              />
              {gekozen && gekozen.id === w.id ? (
                <Paneel wens={gekozen} id={paneelId} />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
