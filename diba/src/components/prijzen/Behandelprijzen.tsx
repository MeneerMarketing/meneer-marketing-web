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
import { useOordelen } from "@/lib/huidprofiel-oordeel";
import type { Match, MatchGrond } from "@/data/huidprofiel";

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

/** Per grond: wat er onder de regel komt, en of het een grens is of een verschil. */
const MERKTEKEN: Record<MatchGrond, { tekst: string; hard: boolean } | null> = {
  blokkade: { tekst: "Kan bij jou nu niet", hard: true },
  herstel: { tekst: "Vraagt meer hersteltijd dan je aangaf", hard: true },
  "ander-doel": { tekst: "Voor iets anders dan jij zoekt", hard: false },
  zijdelings: {
    tekst: "Doet er iets aan, maar is er niet voor gemaakt",
    hard: false,
  },
  raak: null,
  "geen-doel": null,
};

function Regel({
  behandeling,
  open,
  onWissel,
  oordeel,
}: {
  behandeling: Behandeling;
  open: boolean;
  onWissel: () => void;
  oordeel?: Match;
}) {
  const b = behandeling;
  const heeftDetail =
    Boolean(b.herstel) ||
    Boolean(b.sessies) ||
    Boolean(b.duurMinuten) ||
    (b.varianten?.length ?? 0) > 0 ||
    (b.wel?.length ?? 0) > 0;

  return (
    <li className="overflow-hidden rounded-[var(--r-md)] bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={onWissel}
        /* De hover alleen als de rij dicht is. Open is de handeling al gedaan, en dan
           is dat vlak een vlek boven het witte paneel in plaats van een uitnodiging. */
        className={`group flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-[var(--r-md)] px-5 py-4 text-left transition-colors duration-200 [transition-timing-function:var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
          open ? "" : "hover:bg-[var(--g-075)]"
        }`}
      >
        <span className="min-w-0">
          <span className="block text-[17px] leading-7 font-medium text-[var(--t-strong)]">
            {b.naam}
          </span>
          <span className="mt-0.5 block max-w-[54ch] text-[14px] leading-6 text-[var(--t-muted)]">
            {publicCopy(b.kort)}
          </span>
          {/* Wat het huidprofiel over deze regel te zeggen heeft.

              WAAROM HIER NIET GEWOON "PAST NIET" STAAT.

              Omdat dat bij veertien van de eenentwintig regels zou staan zodra iemand een
              doel kiest, en het bij de meeste daarvan niet waar is. Wie acne opgeeft, ziet
              elke rimpelbehandeling afvallen: niet omdat die bij hem niet kan, maar omdat
              die over iets anders gaat. Dat naast een bedrag "viel bij jou af" noemen leest
              als afwijzing, en dan gelooft iemand op den duur geen van beide merktekens meer.

              Dus twee soorten. Een grens die bij jou hoort staat in de waarschuwingskleur;
              een behandeling die simpelweg over iets anders gaat staat er grijs bij. En wat
              wel past krijgt niets, want dat staat al bovenaan deze pagina met tarief en
              reden erbij. Geen merkteken betekent dus: dit past bij je profiel. */}
          {MERKTEKEN[oordeel?.grond ?? "raak"] ? (
            <span
              className={`mt-1 block text-[13px] leading-6 ${
                MERKTEKEN[oordeel!.grond]!.hard
                  ? "text-[var(--warn-text)]"
                  : "text-[var(--t-muted)]"
              }`}
            >
              {MERKTEKEN[oordeel!.grond]!.tekst}
            </span>
          ) : null}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {/* Het bedrag blijft staan, ook dicht. Dat is de belofte van deze pagina.

              `min-w` en rechts uitgelijnd: daardoor staan alle bedragen op dezelfde x,
              ook als er een chevron naast staat en bij de ene wel en bij de andere niet.
              Dat is het hele punt van een prijslijst: je scant de rechterrand omlaag en
              niet elke regel apart. */}
          <span className="min-w-[6.5ch] text-right text-[18px] leading-7 font-medium text-[var(--t-strong)] tabular-nums">
            {b.prijs > 0 ? prijsTekst(b.prijs) : "Na de meting"}
          </span>
          {/* Alleen het pijltje, zonder cirkel eromheen.

              Er zat een rand plus een vulling plus een draaiing omheen: drie signalen voor
              één ding, en op hover sprong dat vlak van lichtgroen naar donkergroen naar
              wit. Wat overblijft is het teken zelf, groot genoeg om te zien dat er iets
              open kan, dat meedraait bij openen. Het aanraakdoel blijft acht bij acht. */}
          {heeftDetail ? (
            <span
              aria-hidden="true"
              className={`flex h-8 w-8 shrink-0 items-center justify-center text-[var(--g-700)] transition-transform duration-200 [transition-timing-function:var(--ease-diba)] ${
                open ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          ) : null}
        </span>
      </button>

      {open && heeftDetail ? (
        /* Een blok in plaats van drie losse kaders.

           Hier stonden drie kaders onder elkaar, elk met een eigen mintvlak, een eigen
           binnenmarge en een eigen kop, en de kolommen van het bovenste raster liepen niet
           door in de rest. Drie kaders in een kader.

           Nu een vlak met een lijn erboven en drie kolommen die wel doorlopen: de feiten
           links, de varianten in het midden, de grens rechts. Een prijslijst lees je door
           de rechterrand af te scannen, en dan moet wat eronder komt diezelfde kolommen
           aanhouden.

           WIT EN NIET --g-025. Dat was precies de kleur van de sectie eromheen, en daardoor
           leek het uitgeklapte deel geen achtergrond te hebben: er wás geen verschil. Nu is
           het hetzelfde blad als de rij erboven, met een haarlijn als vouw. */
        <div className="border-t border-[var(--g-100)] bg-white px-5 py-6 sm:px-7">
          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="diba-label text-[var(--t-label)]">
                Goed om te weten
              </p>
              <dl className="mt-3 space-y-2.5">
                {(
                  [
                    b.duurMinuten
                      ? (["Duur", `${b.duurMinuten} minuten`] as const)
                      : null,
                    b.sessies
                      ? (["Hoe vaak", publicCopy(b.sessies)] as const)
                      : null,
                    b.herstel
                      ? (["Hersteltijd", publicCopy(b.herstel)] as const)
                      : null,
                  ].filter(Boolean) as readonly (readonly [string, string])[]
                ).map(([kop, waarde]) => (
                  <div key={kop} className="flex gap-3">
                    <dt className="w-[9.5rem] shrink-0 text-[14px] leading-6 text-[var(--t-muted)]">
                      {kop}
                    </dt>
                    <dd className="text-[15px] leading-6 text-[var(--t-body)]">
                      {waarde}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {b.varianten?.length ? (
              <div>
                <p className="diba-label text-[var(--t-label)]">
                  Varianten en tarieven
                </p>
                <ul className="mt-3 space-y-2.5">
                  {b.varianten.map((v) => (
                    <li
                      key={v.naam}
                      className="flex items-baseline justify-between gap-x-4 border-b border-[var(--g-100)] pb-2.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-[15px] leading-6 text-[var(--t-body)]">
                        {v.naam}
                        {v.bij ? (
                          <span className="text-[var(--t-muted)]">
                            {" "}
                            · {v.bij}
                          </span>
                        ) : null}
                      </span>
                      {/* Dezelfde breedte als het bedrag in de rij erboven, zodat de
                          bedragen onder elkaar uitkomen in plaats van te zwerven. */}
                      <span className="min-w-[6.5ch] shrink-0 text-right text-[15px] leading-6 font-medium text-[var(--t-strong)] tabular-nums">
                        {prijsTekst(v.prijs)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {b.niet?.length ? (
              <div>
                <p className="diba-label text-[var(--t-label)]">
                  Hiervoor kies je iets anders
                </p>
                <ul className="mt-3 space-y-2.5">
                  {b.niet.slice(0, 2).map((n) => (
                    <li
                      key={publicCopy(n)}
                      className="text-[15px] leading-6 text-[var(--t-body)]"
                    >
                      {publicCopy(n)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <Link
            href={`/behandelingen/${b.slug}`}
            className="diba-label mt-6 inline-flex min-h-11 items-center gap-1.5 border-t border-[var(--g-100)] pt-5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
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
  const oordelen = useOordelen();

  return (
    /* Eén kolom, en dat is een correctie op de vorige opzet.

       Daar stonden de categorieën in twee CSS-kolommen, met het argument dat de pagina
       anders te lang werd. Dat klopte als rekensom en niet als bladzijde: de negen
       categorieën lopen van één tot zes behandelingen, dus de blokken sprongen links en
       rechts op verschillende hoogtes uit elkaar. Wat je zag was geen prijslijst maar
       losse vlakken.

       Een prijslijst lees je langs de rechterrand omlaag. Dat kan alleen als alle rijen
       even breed zijn en alle bedragen op dezelfde x staan, en dus in één kolom. De lengte
       is opgelost door de rijen compact te maken en de kaart-in-kaart-in-kaart eruit te
       halen: elke behandeling is nu één witte balk op de getinte ondergrond in plaats van
       een kaartje in een kaartje.

       Het aantal per categorie stond er ook nog bij ("4 behandelingen"). Dat is te tellen
       en het stond in de weg. */
    <div className="space-y-10">
      {groepen.map((g) => (
        <section
          key={g.id}
          id={`prijs-${g.id}`}
          className="scroll-mt-[var(--anker-offset)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 pb-4">
            <Label>{g.label}</Label>
            <p className="text-[15px] leading-7 text-[var(--t-muted)]">
              {g.zin}
            </p>
          </div>

          <ul className="space-y-1.5">
            {g.items.map((b) => (
              <Regel
                key={b.slug}
                behandeling={b}
                open={open === b.slug}
                onWissel={() => setOpen(open === b.slug ? null : b.slug)}
                oordeel={oordelen?.get(b.slug)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
