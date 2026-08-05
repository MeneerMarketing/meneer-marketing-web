"use client";

import Link from "next/link";
import DibaLeaf from "@/components/ui/DibaLeaf";
import {
  DOELEN,
  FITZPATRICK_TYPES,
  HERSTELRUIMTE,
  huidtypeKanttekening,
  ingevuld,
  maakMatches,
  profielIsLeeg,
  type MatchOordeel,
} from "@/data/huidprofiel";
import { publicCopy } from "@/lib/copy-flags";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * Het huidprofiel: drie vragen, en de hele pagina reageert erop.
 *
 * Dit is wat deze pagina van een brochure een gesprek maakt. Elke andere kliniek zet vijf
 * behandelkaarten neer en laat jou uitzoeken welke erbij hoort. Hier vult de bezoeker drie
 * dingen in en krijgt hij te horen wat er past, wat er half past en wat er niet past.
 *
 * DE DERDE VRAAG IS DE BELANGRIJKSTE. Hoeveel hersteltijd kun je hebben. Niemand vraagt
 * dat, terwijl hij vaak beslissender is dan de andere twee: wie maandag moet werken heeft
 * niets aan een behandeling waar je drie dagen rood van bent, hoe goed die verder ook
 * past. Door hem hier te stellen valt de helft van de teleurstelling weg voordat er
 * geboekt is.
 *
 * En daarom staat "past niet" hier net zo groot als "past". Een matchlijst met alleen
 * groene vinkjes is geen hulp maar een verkoopmachine, en er staat altijd bij wáárom iets
 * niet past. Meestal is dat geen oordeel over de behandeling maar over de combinatie.
 *
 * Het profiel blijft in de browser van de bezoeker. Geen account, geen mailadres, geen
 * server. Dat is precies de plek waar de verleiding het grootst is om alvast iets te
 * vragen, en precies daarom doen we het niet. Zie `huidprofiel-opslag.ts`.
 */

const OORDEELSTIJL: Record<
  MatchOordeel,
  { readonly kop: string; readonly kaart: string; readonly stip: string }
> = {
  past: {
    kop: "Past bij je profiel",
    kaart: "bg-[var(--g-700)] text-[var(--on-dark)]",
    stip: "bg-[var(--g-700)]",
  },
  deels: {
    kop: "Deels",
    kaart: "bg-white",
    stip: "bg-[var(--g-400)]",
  },
  "past-niet": {
    kop: "Past niet bij je profiel",
    kaart: "bg-[var(--g-050)]",
    stip: "bg-[var(--g-200)]",
  },
};

const VOLGORDE: MatchOordeel[] = ["past", "deels", "past-niet"];

export default function Huidprofiel() {
  const { profiel, wisselDoel, zetHuidtype, zetHerstel, wis } = useHuidprofiel();

  const stand = ingevuld(profiel);
  const leeg = profielIsLeeg(profiel);
  const matches = maakMatches(profiel);
  const kanttekening = huidtypeKanttekening(profiel.huidtype);

  return (
    <div className="overflow-hidden rounded-[var(--r-xl)] bg-white">
      {/* ── De drie vragen ── */}
      <div className="p-7 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Drie blaadjes die aangaan. Geen percentage en geen balk: dit is geen
                formulier dat je moet afmaken, het is er een dat je mag afmaken. */}
            <span className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <DibaLeaf
                  key={i}
                  className={`h-5 w-5 transition-opacity duration-500 ${
                    i < stand ? "opacity-100" : "opacity-25"
                  }`}
                />
              ))}
            </span>
            <p className="diba-label text-[var(--t-label)]">
              {stand === 0
                ? "Je huidprofiel"
                : stand === 3
                  ? "Je huidprofiel is compleet"
                  : `Je huidprofiel, ${stand} van 3`}
            </p>
          </div>

          {!leeg ? (
            <button
              type="button"
              onClick={wis}
              className="diba-label min-h-11 text-[var(--t-muted)] transition-colors hover:text-[var(--t-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Opnieuw beginnen
            </button>
          ) : null}
        </div>

        {/* Vraag 1 */}
        <fieldset className="mt-8 border-0 p-0">
          <legend className="diba-display-s max-w-[22ch]">
            Wat wil je <span className="diba-accent">veranderen?</span>
          </legend>
          <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
            Meerdere mag. Je hoeft de vakterm niet te kennen.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {DOELEN.map((d) => {
              const aan = profiel.doelen.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={aan}
                  onClick={() => wisselDoel(d.id)}
                  className={`group flex min-h-14 flex-col justify-center rounded-[var(--r-md)] border px-5 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    aan
                      ? "border-[var(--g-700)] bg-[var(--g-700)] text-white"
                      : "border-[var(--g-100)] bg-white hover:-translate-y-0.5 hover:border-[var(--g-300)] hover:shadow-[var(--shadow-float)]"
                  }`}
                >
                  <span
                    className={`text-[15px] leading-5 font-medium ${aan ? "text-white" : "text-[var(--t-strong)]"}`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`mt-0.5 text-[12px] leading-4 ${aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
                  >
                    {d.zin}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Vraag 2 en 3 staan naast elkaar: samen zijn ze korter dan de eerste. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <fieldset className="border-0 p-0">
            <legend className="diba-display-s max-w-[20ch]">
              Welk <span className="diba-accent">huidtype?</span>
            </legend>
            <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
              Fitzpatrick I tot en met VI. Weet je het niet, sla hem over; we bepalen het
              in de intake.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {FITZPATRICK_TYPES.map((t) => {
                const aan = profiel.huidtype === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={aan}
                    title={t.description}
                    onClick={() => zetHuidtype(t.id)}
                    className={`flex min-h-12 min-w-14 items-center justify-center rounded-[var(--r-pill)] border px-4 text-[15px] font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                      aan
                        ? "border-[var(--g-700)] bg-[var(--g-700)] text-white"
                        : "border-[var(--g-100)] bg-white text-[var(--t-strong)] hover:border-[var(--g-300)]"
                    }`}
                  >
                    {t.id}
                  </button>
                );
              })}
            </div>
            {profiel.huidtype ? (
              <p className="mt-5 max-w-[46ch] rounded-[var(--r-sm)] bg-[var(--g-050)] p-4 text-[14px] leading-6 text-[var(--t-body)]">
                {publicCopy(kanttekening ?? "")}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="border-0 p-0">
            <legend className="diba-display-s max-w-[20ch]">
              Hoeveel <span className="diba-accent">hersteltijd?</span>
            </legend>
            <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
              De vraag die niemand stelt en die vaak het meest bepaalt.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {HERSTELRUIMTE.map((h) => {
                const aan = profiel.herstel === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-pressed={aan}
                    onClick={() => zetHerstel(h.id)}
                    className={`flex min-h-14 flex-wrap items-baseline gap-x-4 gap-y-1 rounded-[var(--r-md)] border px-5 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                      aan
                        ? "border-[var(--g-700)] bg-[var(--g-700)]"
                        : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                    }`}
                  >
                    <span
                      className={`text-[15px] leading-5 font-medium ${aan ? "text-white" : "text-[var(--t-strong)]"}`}
                    >
                      {h.label}
                    </span>
                    <span
                      className={`text-[13px] leading-5 ${aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
                    >
                      {h.zin}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── De uitkomst ── */}
      <div className="border-t border-[var(--g-100)] bg-[var(--g-025)] p-7 sm:p-10 lg:p-12">
        {leeg ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Kies hierboven wat je wil veranderen. Dan staat hier meteen welke van onze
              vijf behandelingen daarbij past, en welke niet.
            </p>
          </div>
        ) : (
          <div>
            <p className="diba-label text-[var(--t-label)]">Op basis van je profiel</p>
            <h3 className="diba-display-s mt-3 max-w-[24ch]">
              {matches.some((m) => m.oordeel === "past") ? (
                <>
                  Dit past,
                  <br />
                  <span className="diba-accent">en dit niet.</span>
                </>
              ) : (
                <>
                  Hier past
                  <br />
                  <span className="diba-accent">nog niets bij.</span>
                </>
              )}
            </h3>

            <div className="mt-8 space-y-8">
              {VOLGORDE.map((oordeel) => {
                const groep = matches.filter((m) => m.oordeel === oordeel);
                if (groep.length === 0) return null;
                const stijl = OORDEELSTIJL[oordeel];
                return (
                  <div key={oordeel}>
                    <p className="diba-label flex items-center gap-2 text-[var(--t-muted)]">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-[var(--r-pill)] ${stijl.stip}`}
                      />
                      {stijl.kop}
                    </p>
                    <ul className="mt-4 grid gap-3 lg:grid-cols-2">
                      {groep.map((m) => (
                        <li key={m.behandeling.slug}>
                          <Link
                            href={`/behandelingen/${m.behandeling.slug}`}
                            className={`flex h-full flex-col rounded-[var(--r-md)] p-6 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${stijl.kaart}`}
                          >
                            <span className="flex items-baseline justify-between gap-4">
                              <span
                                className={`text-[17px] leading-7 font-medium ${
                                  oordeel === "past"
                                    ? "text-white"
                                    : "text-[var(--t-strong)]"
                                }`}
                              >
                                {m.behandeling.naam}
                              </span>
                              <span
                                className={`shrink-0 text-[15px] leading-7 tabular-nums ${
                                  oordeel === "past"
                                    ? "text-[var(--on-dark-body)]"
                                    : "text-[var(--t-muted)]"
                                }`}
                              >
                                € {m.behandeling.prijs}
                              </span>
                            </span>
                            <span
                              className={`mt-2 text-[14px] leading-6 ${
                                oordeel === "past"
                                  ? "text-[var(--on-dark-body)]"
                                  : "text-[var(--t-body)]"
                              }`}
                            >
                              {m.reden}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--g-100)] pt-7">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Neem dit mee naar Behandeling Nul
              </Link>
              <p className="max-w-[42ch] text-[13px] leading-5 text-[var(--t-muted)]">
                Je profiel blijft in deze browser staan. Geen account, geen mailadres,
                niets dat naar ons toe gaat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
