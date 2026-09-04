"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BEHANDELINGEN,
  CATEGORIEEN,
  diepte,
  HUIDLAGEN,
  prijsTekst,
  type Behandeling,
  type CategorieId,
} from "@/data/behandelingen";
import {
  maakMatches,
  profielIsLeeg,
  type MatchGrond,
  type MatchOordeel,
} from "@/data/huidprofiel";
import { publicCopy } from "@/lib/copy-flags";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * Alle behandelingen, filterbaar.
 *
 * Dit vervangt de diepteschaal. Die was een grafiek voor vijf behandelingen: alle vijf
 * naast elkaar op één as, en dan zag je in één blik dat dieper langer duurt. Met
 * negentien werden het negentien kolommen van honderd pixels waarin de namen over elkaar
 * vielen. Een goede grafiek voor vijf dingen is nog geen goede grafiek voor twintig.
 *
 * Wat er voor in de plaats komt is saaier en beter: filters en kaarten. Je kunt zoeken op
 * waar het voor is, en op hoeveel hersteltijd je hebt. Dat laatste filter staat nergens
 * anders in de branche en is precies wat mensen nodig hebben.
 *
 * DE VOLGORDE VOLGT JE PROFIEL. Heb je er een, dan staat bovenaan wat past, daarna wat
 * half past, en onderaan wat afvalt, met bij elke kaart de reden. Heb je er geen, dan is
 * de volgorde diepte: van de buitenste laag naar binnen. Beide zijn een volgorde met een
 * reden, en dat is meer dan een alfabetische lijst kan zeggen.
 *
 * Deze lijst staat los van het profiel: zonder profiel werkt hij gewoon. Dat is met opzet.
 * Een overzicht dat pas iets zegt als je eerst een vragenlijst invult is geen overzicht.
 */

const HERSTELFILTERS = [
  { id: "alles", label: "Alle hersteltijden" },
  { id: "geen", label: "Geen hersteltijd" },
  { id: "kort", label: "Hooguit een dag" },
] as const;

type HerstelFilter = (typeof HERSTELFILTERS)[number]["id"];

/** Ruwe inschatting uit de eigen tekst; alleen om op te filteren. */
function heeftHersteltijd(b: Behandeling): boolean {
  return !/^geen\b/i.test(b.herstel.trim());
}

function kortHerstel(b: Behandeling): boolean {
  return !heeftHersteltijd(b) || /uur|één tot drie|een dag/i.test(b.herstel);
}

/**
 * Het label op de kaart, per grond en niet per oordeel.
 *
 * "Past niet" stond hier boven twee heel verschillende dingen: een behandeling die bij
 * jou werkelijk niet kan, en een behandeling die gewoon over een ander probleem gaat.
 * Wie acne opgeeft ziet dan veertien kaarten met "past niet", en concludeert dat deze
 * kliniek weinig voor hem heeft, terwijl er alleen staat dat een laserontharing niets
 * tegen puistjes doet.
 *
 * De reden staat er al onder; het label hoort daar niet mee in tegenspraak te zijn.
 */
const BADGE: Record<
  MatchGrond,
  { readonly tekst: string; readonly stijl: string }
> = {
  raak: {
    tekst: "Past bij je profiel",
    stijl: "bg-[var(--g-700)] text-white",
  },
  zijdelings: {
    tekst: "Deels",
    stijl: "bg-[var(--g-100)] text-[var(--t-strong)]",
  },
  blokkade: {
    tekst: "Kan bij jou nu niet",
    stijl: "bg-[var(--warn-vlak)] text-[var(--warn-text)]",
  },
  herstel: {
    tekst: "Te veel hersteltijd",
    stijl: "bg-[var(--warn-vlak)] text-[var(--warn-text)]",
  },
  "ander-doel": {
    tekst: "Voor iets anders",
    stijl: "bg-[var(--g-050)] text-[var(--t-muted)]",
  },
  "geen-doel": {
    tekst: "Kies eerst een doel",
    stijl: "bg-[var(--g-050)] text-[var(--t-muted)]",
  },
};
/** Welke redenen voor elke behandeling hetzelfde luiden, en dus niets toevoegen. */
const ALGEMEEN: Record<MatchGrond, boolean> = {
  raak: false,
  zijdelings: false,
  blokkade: false,
  herstel: false,
  "ander-doel": true,
  "geen-doel": true,
};

const RANG: Record<MatchOordeel, number> = {
  past: 0,
  deels: 1,
  "past-niet": 2,
};

export default function Behandelingenoverzicht() {
  const { profiel } = useHuidprofiel();
  const [categorie, setCategorie] = useState<CategorieId | "alles">("alles");
  const [herstel, setHerstel] = useState<HerstelFilter>("alles");

  const heeftProfiel = !profielIsLeeg(profiel);
  const matches = useMemo(() => maakMatches(profiel), [profiel]);
  const oordeelVan = useMemo(
    () => new Map(matches.map((m) => [m.behandeling.slug, m])),
    [matches],
  );

  const lijst = useMemo(() => {
    const gefilterd = BEHANDELINGEN.filter((b) => {
      if (categorie !== "alles" && b.categorie !== categorie) return false;
      if (herstel === "geen" && heeftHersteltijd(b)) return false;
      if (herstel === "kort" && !kortHerstel(b)) return false;
      return true;
    });

    return [...gefilterd].sort((a, b) => {
      if (heeftProfiel) {
        const ra = RANG[oordeelVan.get(a.slug)?.oordeel ?? "deels"];
        const rb = RANG[oordeelVan.get(b.slug)?.oordeel ?? "deels"];
        if (ra !== rb) return ra - rb;
      }
      return diepte(a) - diepte(b);
    });
  }, [categorie, herstel, heeftProfiel, oordeelVan]);

  const telling = (id: CategorieId | "alles") =>
    id === "alles"
      ? BEHANDELINGEN.length
      : BEHANDELINGEN.filter((b) => b.categorie === id).length;

  return (
    <div>
      {/* ── Filters ── */}
      <div className="flex flex-col gap-5">
        <div
          role="tablist"
          aria-label="Soort behandeling"
          className="flex flex-wrap gap-2"
        >
          {[{ id: "alles" as const, label: "Alles" }, ...CATEGORIEEN].map(
            (c) => {
              const aan = categorie === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={aan}
                  onClick={() => setCategorie(c.id as CategorieId | "alles")}
                  className={`diba-label inline-flex min-h-11 items-center gap-2 rounded-[var(--r-pill)] px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    aan
                      ? "diba-pill-active"
                      : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
                  }`}
                >
                  {c.label}
                  <span
                    className={`rounded-[var(--r-pill)] px-1.5 py-0.5 text-[10px] tabular-nums ${
                      aan
                        ? "bg-white/20"
                        : "bg-[var(--g-050)] text-[var(--t-muted)]"
                    }`}
                  >
                    {telling(c.id as CategorieId | "alles")}
                  </span>
                </button>
              );
            },
          )}
        </div>

        <div
          role="tablist"
          aria-label="Hersteltijd"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="diba-label mr-1 text-[var(--t-muted)]">
            Hersteltijd
          </span>
          {HERSTELFILTERS.map((h) => {
            const aan = herstel === h.id;
            return (
              <button
                key={h.id}
                role="tab"
                type="button"
                aria-selected={aan}
                onClick={() => setHerstel(h.id)}
                className={`inline-flex min-h-11 items-center rounded-[var(--r-pill)] border px-4 text-[14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "border-[var(--g-700)] bg-[var(--g-050)] text-[var(--t-strong)]"
                    : "border-[var(--g-100)] bg-white text-[var(--t-muted)] hover:border-[var(--g-300)]"
                }`}
              >
                {h.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Wat de volgorde stuurt ── */}
      <p className="mt-7 max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
        {heeftProfiel ? (
          <>
            De volgorde volgt je huidprofiel: bovenaan wat past, onderaan wat
            over iets anders gaat. Waar de reden per behandeling verschilt,
            staat hij op de kaart.{" "}
            <Link
              href="/huidprofiel"
              className="text-[var(--g-700)] underline underline-offset-4"
            >
              Profiel aanvullen
            </Link>
          </>
        ) : (
          <>
            De volgorde is diepte: van de buitenste laag naar binnen.{" "}
            <Link
              href="/huidprofiel"
              className="text-[var(--g-700)] underline underline-offset-4"
            >
              Maak je huidprofiel
            </Link>{" "}
            en de lijst schikt zich naar wat bij jou past.
          </>
        )}
      </p>

      {/* ── De kaarten ── */}
      <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lijst.map((b) => {
          const match = heeftProfiel ? oordeelVan.get(b.slug) : undefined;
          const diepste =
            b.lagen.length === 0
              ? "Raakt niets"
              : `Tot in de ${HUIDLAGEN.find((l) => l.id === b.lagen[b.lagen.length - 1])?.naam.toLowerCase()}`;
          return (
            <li key={b.slug}>
              <Link
                href={`/behandelingen/${b.slug}`}
                className="flex h-full flex-col rounded-[var(--r-md)] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-7"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="diba-label text-[var(--t-muted)]">
                    {diepste}
                  </span>
                  {match ? (
                    <span
                      className={`diba-label rounded-[var(--r-pill)] px-2.5 py-1 ${BADGE[match.grond].stijl}`}
                    >
                      {BADGE[match.grond].tekst}
                    </span>
                  ) : null}
                </span>

                <span className="diba-card-title mt-3 text-[var(--t-strong)]">
                  {b.naam}
                </span>
                {b.apparaat ? (
                  <span className="mt-1 text-[13px] leading-5 text-[var(--t-muted)]">
                    {b.apparaat}
                  </span>
                ) : null}

                <span className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(b.kort)}
                </span>

                {/* De reden, maar alleen als die iets zegt dat de badge nog niet zei.

                    Bij "voor iets anders" is de reden voor elke behandeling exact dezelfde
                    zin. Veertien kaarten naast elkaar met hetzelfde vlak en dezelfde regel
                    erin is geen uitleg maar behang: het duwt de naam, de prijs en de
                    hersteltijd naar beneden en je leest het na de tweede kaart niet meer.
                    De badge zegt het al in twee woorden.

                    Bij een blokkade, te weinig hersteltijd of een treffer staat er wel iets
                    dat per behandeling verschilt, en dan hoort het er juist te staan. */}
                {match &&
                (ALGEMEEN[match.grond] === false || match.letOp.length > 0) ? (
                  <span
                    className={`mt-4 rounded-[var(--r-sm)] p-4 text-[13px] leading-5 ${
                      match.oordeel === "past-niet"
                        ? "bg-[var(--g-050)] text-[var(--t-body)]"
                        : "bg-[var(--g-025)] text-[var(--t-body)]"
                    }`}
                  >
                    {ALGEMEEN[match.grond] ? null : match.reden}
                    {match.letOp.length > 0 ? (
                      <span className="mt-2 block font-medium text-[var(--t-strong)]">
                        Let op: {match.letOp[0]}
                      </span>
                    ) : null}
                  </span>
                ) : null}

                <span className="mt-auto flex items-baseline justify-between gap-4 pt-4">
                  <span className="text-[13px] leading-5 text-[var(--t-muted)]">
                    {publicCopy(b.herstel)}
                  </span>
                  <span className="shrink-0 text-[15px] leading-6 font-medium text-[var(--t-strong)] tabular-nums">
                    {prijsTekst(b.prijs)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {lijst.length === 0 ? (
        <p className="mt-10 text-[16px] leading-7 text-[var(--t-body)]">
          Geen behandelingen met deze combinatie van filters. Zet de hersteltijd
          wat ruimer.
        </p>
      ) : null}
    </div>
  );
}
