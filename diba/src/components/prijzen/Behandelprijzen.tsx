"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Label from "@/components/ui/Label";
import {
  BEHANDELINGEN,
  CATEGORIEEN,
  prijsTekst,
  type Behandeling,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De behandelprijzen, met wat je voor dat bedrag krijgt.
 *
 * WAT HIER STOND EN WAAROM DAT TE MAGER WAS.
 *
 * Een tabel: naam links, bedrag rechts. Meer niet. Terwijl de vraag achter "wat kost een
 * peeling" nooit alleen over het bedrag gaat, maar over of het bij je past, hoe vaak je
 * moet komen en hoe lang je erna rood bent. Dat stond allemaal al in `behandelingen.ts`
 * en werd op deze pagina niet gebruikt, dus keek je naar een prijs zonder te weten wat je
 * ervoor kreeg.
 *
 * Erger nog: de huid- en metingregels in `prices.ts` waren een tweede kopie van dezelfde
 * behandelingen. Twee bronnen voor één prijs lopen binnen een maand uit elkaar. Deze
 * weergave leest rechtstreeks uit de behandelingentabel, dus dat kan niet meer.
 *
 * WAAROM UITKLAPPEN EN NIET ALLES OPEN.
 *
 * Alles open is eenentwintig behandelingen maal zes gegevens, en dan ben je terug bij de
 * muur die deze pagina juist niet moet zijn. Dicht zie je per behandeling de naam, waar
 * het voor is en het bedrag: genoeg om te kiezen. Open zie je waar je ja tegen zegt.
 *
 * Het bedrag staat altijd in beeld, ook dicht. Dat is de hele belofte van deze pagina en
 * die mag niet achter een klik verdwijnen.
 *
 * HOE LANG HET DUURT.
 *
 * Dat stond hier eerst niet, want het stond nergens in de data. Inmiddels wel: zie
 * `duurMinuten` in de behandelingentabel. Het staat naast de hersteltijd, want dat zijn
 * de twee vragen die samen bepalen of je er een ochtend voor vrij moet nemen.
 * [GEGEVEN-NODIG: bevestiging van de behandelduur, Okan]
 */

/** Alleen categorieën waar ook echt iets in zit. */
function metInhoud() {
  return CATEGORIEEN.map((c) => ({
    ...c,
    items: BEHANDELINGEN.filter((b) => b.categorie === c.id),
  })).filter((c) => c.items.length > 0);
}

function Regel({
  behandeling,
  open,
  onWissel,
}: {
  behandeling: Behandeling;
  open: boolean;
  onWissel: () => void;
}) {
  const b = behandeling;
  const heeftDetail =
    Boolean(b.herstel) ||
    Boolean(b.sessies) ||
    Boolean(b.duurMinuten) ||
    (b.varianten?.length ?? 0) > 0 ||
    (b.wel?.length ?? 0) > 0;

  return (
    <li className="rounded-[var(--r-md)] bg-[var(--g-025)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={onWissel}
        className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-[var(--r-md)] px-5 py-4 text-left transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
      >
        <span className="min-w-0">
          <span className="block text-[17px] leading-7 font-medium text-[var(--t-strong)]">
            {b.naam}
          </span>
          <span className="mt-0.5 block max-w-[54ch] text-[14px] leading-6 text-[var(--t-muted)]">
            {publicCopy(b.kort)}
          </span>
        </span>
        <span className="flex shrink-0 items-baseline gap-3">
          {/* Het bedrag blijft staan, ook dicht. Dat is de belofte van deze pagina. */}
          <span className="text-[18px] leading-7 font-medium text-[var(--t-strong)] tabular-nums">
            {b.prijs > 0 ? prijsTekst(b.prijs) : "Na de meting"}
          </span>
          {heeftDetail ? (
            <span
              aria-hidden="true"
              className={`text-[13px] leading-7 text-[var(--g-700)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          ) : null}
        </span>
      </button>

      {open && heeftDetail ? (
        <div className="px-5 pb-5">
          <dl className="grid gap-x-8 gap-y-4 rounded-[var(--r-sm)] bg-white p-5 sm:grid-cols-3">
            {b.duurMinuten ? (
              <div>
                <dt className="diba-label text-[var(--t-label)]">
                  Hoe lang je hier bent
                </dt>
                <dd className="mt-1 text-[15px] leading-7 text-[var(--t-body)] tabular-nums">
                  {b.duurMinuten} minuten
                </dd>
              </div>
            ) : null}
            {b.sessies ? (
              <div>
                <dt className="diba-label text-[var(--t-label)]">Hoe vaak</dt>
                <dd className="mt-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(b.sessies)}
                </dd>
              </div>
            ) : null}
            {b.herstel ? (
              <div>
                <dt className="diba-label text-[var(--t-label)]">
                  Hersteltijd
                </dt>
                <dd className="mt-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(b.herstel)}
                </dd>
              </div>
            ) : null}
          </dl>

          {b.varianten?.length ? (
            <div className="mt-3 rounded-[var(--r-sm)] bg-white p-5">
              <p className="diba-label text-[var(--t-label)]">
                Varianten en tarieven
              </p>
              <ul className="mt-3 space-y-1.5">
                {b.varianten.map((v) => (
                  <li
                    key={v.naam}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 text-[15px] leading-7"
                  >
                    <span className="text-[var(--t-body)]">
                      {v.naam}
                      {v.bij ? (
                        <span className="text-[var(--t-muted)]"> · {v.bij}</span>
                      ) : null}
                    </span>
                    <span className="text-[var(--t-strong)] tabular-nums">
                      {prijsTekst(v.prijs)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {b.niet?.length ? (
            <div className="mt-3 rounded-[var(--r-sm)] bg-white p-5">
              <p className="diba-label text-[var(--t-label)]">
                Wat dit niet doet
              </p>
              <ul className="mt-2 space-y-1.5">
                {b.niet.slice(0, 2).map((n) => (
                  <li
                    key={n}
                    className="text-[15px] leading-7 text-[var(--t-body)]"
                  >
                    {publicCopy(n)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Link
            href={`/behandelingen/${b.slug}`}
            className="diba-label mt-4 inline-flex min-h-11 items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            Alles over {b.naam.toLowerCase()}
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      ) : null}
    </li>
  );
}

export default function Behandelprijzen() {
  const [open, setOpen] = useState<string | null>(null);
  const groepen = useMemo(() => metInhoud(), []);

  return (
    /* Kolommen, geen stapel.
       Alle zeven categorieën onder elkaar maakte de pagina negenduizend pixels lang,
       terwijl er in de rechterhelft niets stond. Categorieën verschillen sterk in lengte,
       dus een raster zou weer uitrekken; kolommen laten ze gewoon aansluiten. Een sectie
       blijft heel, ook als hij openklapt. */
    <div className="gap-4 xl:columns-2 [&>section]:mb-4 [&>section]:break-inside-avoid">
      {groepen.map((g) => (
        <section
          key={g.id}
          id={`prijs-${g.id}`}
          className="scroll-mt-[var(--anker-offset)] rounded-[var(--r-lg)] bg-white p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
            <div>
              <Label>{g.label}</Label>
              <p className="mt-2 max-w-[52ch] text-[15px] leading-7 text-[var(--t-body)]">
                {g.zin}
              </p>
            </div>
            <p className="text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
              {g.items.length}{" "}
              {g.items.length === 1 ? "behandeling" : "behandelingen"}
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            {g.items.map((b) => (
              <Regel
                key={b.slug}
                behandeling={b}
                open={open === b.slug}
                onWissel={() => setOpen(open === b.slug ? null : b.slug)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
