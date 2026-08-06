"use client";

import Link from "next/link";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Spinnenweb from "@/components/ui/Spinnenweb";
import { prijsTekst } from "@/data/behandelingen";
import {
  aandachtspunten,
  compleetheid,
  DOELEN,
  FITZPATRICK_TYPES,
  GEBRUIK,
  GEVOELIGHEID,
  HERSTELRUIMTE,
  hoeLangGeleden,
  HUIDCONDITIES,
  huidtypeKanttekening,
  maakMatches,
  meldPunten,
  PROFIEL_ONDERDELEN,
  SITUATIE,
  VOORGESCHIEDENIS,
} from "@/data/huidprofiel";
import { publicCopy } from "@/lib/copy-flags";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * De profielpagina: je huid in acht stappen.
 *
 * Waarom dit een eigen pagina is en geen blok op de behandelingenpagina: wat hier gevraagd
 * wordt zijn geen voorkeuren maar feiten die bepalen wat er kán. Retinol, zwangerschap,
 * een gebruinde huid, isotretinoïne, neiging tot keloïd. Dat zijn precies de dingen die in
 * de praktijk pas aan de balie boven tafel komen, en dan een afspraak kosten.
 *
 * Het onderscheid dat de hele pagina draagt:
 *
 *   PAST NIET  — dat is een feit, geen gesprek. Er staat bij waarom.
 *   LET OP     — dat kan wel, maar moet besproken worden. Blokkeert niets.
 *
 * Wie te snel blokkeert verstopt behandelingen die misschien juist wel kunnen, en wie
 * alles onder "let op" schuift stuurt mensen naar een afspraak die niet doorgaat. Het
 * verschil tussen die twee is het systeem.
 *
 * Niets hiervan is een diagnose of een advies. De pagina legt naast elkaar wat jij hebt
 * ingevuld en wat een behandeling doet, en zegt waar dat wringt.
 *
 * Alles blijft in je eigen browser. Geen account, geen mailadres, geen server.
 */

/* ── Bouwstenen ───────────────────────────────────────────────────────────── */

type Optie = { readonly id: string; readonly label: string; readonly zin?: string };

function Vraag({
  nummer,
  kop,
  accent,
  uitleg,
  klaar,
  children,
}: {
  nummer: number;
  kop: string;
  accent?: string;
  uitleg?: string;
  klaar: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--g-100)] py-10 first:border-t-0 first:pt-0 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
          <p className="diba-label flex items-center gap-2.5 text-[var(--t-label)]">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-[var(--r-pill)] text-[11px] tabular-nums transition-colors ${
                klaar
                  ? "bg-[var(--g-700)] text-white"
                  : "bg-[var(--g-100)] text-[var(--t-muted)]"
              }`}
            >
              {nummer}
            </span>
            {klaar ? "Ingevuld" : "Nog open"}
          </p>
          <h2 className="diba-display-s mt-4 max-w-[18ch]">
            {kop}
            {accent ? (
              <>
                <br />
                <span className="diba-accent">{accent}</span>
              </>
            ) : null}
          </h2>
          {uitleg ? (
            <p className="mt-4 max-w-[42ch] text-[15px] leading-7 text-[var(--t-body)]">
              {uitleg}
            </p>
          ) : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function Keuzes({
  opties,
  actief,
  onKies,
  kolommen = 2,
}: {
  opties: readonly Optie[];
  actief: readonly string[];
  onKies: (id: string) => void;
  kolommen?: 1 | 2 | 3;
}) {
  const raster =
    kolommen === 1 ? "" : kolommen === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid gap-2.5 ${raster}`}>
      {opties.map((o) => {
        const aan = actief.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={aan}
            onClick={() => onKies(o.id)}
            className={`flex min-h-14 flex-col justify-center rounded-[var(--r-md)] border px-5 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
              aan
                ? "border-[var(--g-700)] bg-[var(--g-700)]"
                : "border-[var(--g-100)] bg-white hover:-translate-y-0.5 hover:border-[var(--g-300)] hover:shadow-[var(--shadow-float)]"
            }`}
          >
            <span
              className={`text-[15px] leading-5 font-medium ${aan ? "text-white" : "text-[var(--t-strong)]"}`}
            >
              {o.label}
            </span>
            {o.zin ? (
              <span
                className={`mt-0.5 text-[12px] leading-4 ${aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
              >
                {o.zin}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ── De pagina ────────────────────────────────────────────────────────────── */

export default function ProfielBouwer() {
  const {
    profiel,
    wisselDoel,
    zetHuidtype,
    zetHerstel,
    zetConditie,
    zetGevoeligheid,
    wisselGebruik,
    wisselSituatie,
    wisselVoorgeschiedenis,
    wis,
  } = useHuidprofiel();

  const stand = compleetheid(profiel);
  const matches = maakMatches(profiel);
  const past = matches.filter((m) => m.oordeel === "past");
  const kanNiet = matches.filter((m) => m.oordeel === "past-niet");
  const melden = meldPunten(profiel);
  const kanttekening = huidtypeKanttekening(profiel.huidtype);

  return (
    <div>
      {/* ── Voortgang ── */}
      <div className="sticky top-[var(--nav-h)] z-20 -mx-5 mb-10 border-b border-[var(--g-100)] bg-[var(--g-010)]/95 px-5 py-4 backdrop-blur sm:-mx-9 sm:px-9 lg:-mx-[7.5vw] lg:px-[7.5vw]">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: PROFIEL_ONDERDELEN }, (_, i) => (
                <DibaLeafMark
                  key={i}
                  className={`h-4 w-4 transition-opacity duration-500 ${
                    i < stand
                      ? "text-[var(--g-700)] opacity-100"
                      : "text-[var(--g-300)] opacity-40"
                  }`}
                />
              ))}
            </span>
            <p className="diba-label text-[var(--t-label)]">
              {stand} van {PROFIEL_ONDERDELEN} ingevuld
            </p>
          </div>
          <div className="flex items-center gap-6">
            {stand > 0 ? (
              <button
                type="button"
                onClick={wis}
                className="diba-label min-h-11 text-[var(--t-muted)] transition-colors hover:text-[var(--t-strong)]"
              >
                Alles wissen
              </button>
            ) : null}
            <a
              href="#uitkomst"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar je uitkomst
            </a>
          </div>
        </div>
      </div>

      {/* ── 1. De scan ── */}
      <Vraag
        nummer={1}
        kop="Je scan"
        accent="als startpunt."
        uitleg="Vier vragen over wat je ziet en voelt, en je krijgt je profielschets terug als spinnenweb. De open buitenrand blijft staan: dat is wat Eve-M er in de kliniek pas echt bij meet."
        klaar={profiel.scan !== null}
      >
        {profiel.scan ? (
          <div className="grid items-center gap-8 rounded-[var(--r-lg)] bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <Spinnenweb
              waarden={profiel.scan.assen}
              metLabels
              className="mx-auto h-[250px] w-[250px] shrink-0"
            />
            <div>
              <p className="diba-label text-[var(--t-label)]">
                Ingevuld {hoeLangGeleden(profiel.scan.op)}
              </p>
              {profiel.scan.focusLabel ? (
                <p className="diba-card-title mt-3 text-[var(--t-strong)]">
                  {profiel.scan.focusLabel}
                </p>
              ) : null}
              <ul className="mt-5 flex flex-wrap gap-2">
                {aandachtspunten(profiel.scan).map((as) => (
                  <li
                    key={as.id}
                    className="flex items-baseline gap-2 rounded-[var(--r-pill)] bg-[var(--g-050)] px-4 py-2"
                  >
                    <span className="text-[14px] leading-5 font-medium text-[var(--t-strong)]">
                      {as.label}
                    </span>
                    <span className="text-[13px] leading-5 text-[var(--t-muted)] tabular-nums">
                      {profiel.scan!.assen[as.id]}/100
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#huidscan"
                className="diba-label mt-6 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4"
              >
                Scan opnieuw doen
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[var(--r-lg)] bg-white p-8">
            <p className="text-[16px] leading-7 text-[var(--t-body)]">
              Je hebt de mini-scan nog niet gedaan. Begin daar: het duurt een minuut en het
              zet meteen twee van de vragen hieronder goed.
            </p>
            <Link
              href="/#huidscan"
              className="diba-label mt-6 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
            >
              Naar de mini-scan
            </Link>
          </div>
        )}
      </Vraag>

      {/* ── 2. Doelen ── */}
      <Vraag
        nummer={2}
        kop="Wat wil je"
        accent="veranderen?"
        uitleg="Meerdere mag. Je hoeft de vakterm niet te kennen."
        klaar={profiel.doelen.length > 0}
      >
        <Keuzes opties={DOELEN} actief={profiel.doelen} onKies={(id) => wisselDoel(id as never)} />
      </Vraag>

      {/* ── 3. Huidtype ── */}
      <Vraag
        nummer={3}
        kop="Welk"
        accent="huidtype?"
        uitleg="Fitzpatrick I tot en met VI. Je type bepaalt niet óf iets kan, maar met welke instellingen."
        klaar={profiel.huidtype !== null}
      >
        <div className="flex flex-wrap gap-2">
          {FITZPATRICK_TYPES.map((t) => {
            const aan = profiel.huidtype === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={aan}
                title={t.description}
                onClick={() => zetHuidtype(t.id)}
                className={`flex min-h-14 min-w-[7rem] flex-col justify-center rounded-[var(--r-md)] border px-4 py-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "border-[var(--g-700)] bg-[var(--g-700)]"
                    : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                }`}
              >
                <span
                  className={`text-[15px] leading-5 font-medium ${aan ? "text-white" : "text-[var(--t-strong)]"}`}
                >
                  Type {t.id}
                </span>
                <span
                  className={`mt-0.5 text-[11px] leading-4 ${aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
                >
                  {t.description}
                </span>
              </button>
            );
          })}
        </div>
        {kanttekening ? (
          <p className="mt-5 max-w-[56ch] rounded-[var(--r-sm)] bg-white p-5 text-[14px] leading-6 text-[var(--t-body)]">
            {publicCopy(kanttekening)}
          </p>
        ) : null}
      </Vraag>

      {/* ── 4. Hersteltijd ── */}
      <Vraag
        nummer={4}
        kop="Hoeveel"
        accent="hersteltijd?"
        uitleg="De vraag die niemand stelt en die vaak het meest bepaalt. Wie maandag moet werken heeft niets aan een behandeling waar je drie dagen rood van bent."
        klaar={profiel.herstel !== null}
      >
        <Keuzes
          opties={HERSTELRUIMTE}
          actief={profiel.herstel ? [profiel.herstel] : []}
          onKies={(id) => zetHerstel(id as never)}
          kolommen={1}
        />
      </Vraag>

      {/* ── 5. Huidconditie ── */}
      <Vraag
        nummer={5}
        kop="Hoe voelt je huid"
        accent="meestal?"
        uitleg="Dit stuurt vooral de voorbereiding thuis, en dat is bij een droge huid belangrijker dan de behandeling zelf."
        klaar={profiel.conditie !== null}
      >
        <Keuzes
          opties={HUIDCONDITIES}
          actief={profiel.conditie ? [profiel.conditie] : []}
          onKies={(id) => zetConditie(id as never)}
        />
      </Vraag>

      {/* ── 6. Gevoeligheid ── */}
      <Vraag
        nummer={6}
        kop="Hoe snel"
        accent="reageert hij?"
        uitleg="Bij een huid die snel geïrriteerd raakt wordt met een lagere sterkte begonnen. Dat is geen beperking maar een startpunt."
        klaar={profiel.gevoeligheid !== null}
      >
        <Keuzes
          opties={GEVOELIGHEID}
          actief={profiel.gevoeligheid ? [profiel.gevoeligheid] : []}
          onKies={(id) => zetGevoeligheid(id as never)}
          kolommen={1}
        />
      </Vraag>

      {/* ── 7. Wat je gebruikt ── */}
      <Vraag
        nummer={7}
        kop="Wat gebruik je"
        accent="nu op je huid?"
        uitleg="Retinol en zuren moeten voor sommige behandelingen tijdig gepauzeerd worden. Beter nu weten dan aan de balie."
        klaar={profiel.gebruikt.length > 0}
      >
        <Keuzes
          opties={GEBRUIK}
          actief={profiel.gebruikt}
          onKies={(id) => wisselGebruik(id as never)}
        />
      </Vraag>

      {/* ── 8. Situatie en voorgeschiedenis ── */}
      <Vraag
        nummer={8}
        kop="Speelt er nog"
        accent="iets anders?"
        uitleg="Zwangerschap, een gebruinde huid of een vakantie op komst bepalen wat er nu kan. De voorgeschiedenis vul je één keer in en blijft staan."
        klaar={profiel.situatie.length > 0 || profiel.voorgeschiedenis.length > 0}
      >
        <div>
          <p className="diba-label text-[var(--t-muted)]">Nu aan de hand</p>
          <div className="mt-4">
            <Keuzes
              opties={SITUATIE}
              actief={profiel.situatie}
              onKies={(id) => wisselSituatie(id as never)}
            />
          </div>
        </div>
        <div className="mt-8">
          <p className="diba-label text-[var(--t-muted)]">Voorgeschiedenis</p>
          <div className="mt-4">
            <Keuzes
              opties={VOORGESCHIEDENIS}
              actief={profiel.voorgeschiedenis}
              onKies={(id) => wisselVoorgeschiedenis(id as never)}
            />
          </div>
        </div>
      </Vraag>

      {/* ── Uitkomst ── */}
      <section
        id="uitkomst"
        className="scroll-mt-[var(--anker-offset)] border-t border-[var(--g-100)] pt-12 lg:pt-16"
      >
        <p className="diba-label text-[var(--t-label)]">Je uitkomst</p>
        <h2 className="diba-display-m mt-4 max-w-[20ch]">
          Wat dit betekent
          <br />
          <span className="diba-accent">voor jouw huid.</span>
        </h2>

        {stand === 0 ? (
          <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Vul hierboven iets in, dan staat hier meteen wat er past, wat niet past en wat
            je in de intake moet melden.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Wat je moet melden. Dit is de lijst die deze pagina zijn waarde geeft. */}
            <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
              <p className="diba-label diba-label-on-dark">
                {melden.length === 0
                  ? "Niets bijzonders te melden"
                  : `Meld dit in de intake · ${melden.length}`}
              </p>
              {melden.length === 0 ? (
                <p className="mt-5 text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Op basis van wat je hebt ingevuld is er niets dat vooraf besproken hoeft
                  te worden. Dat kan veranderen zodra je iets aanvult.
                </p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {melden.map((m) => (
                    <li
                      key={m}
                      className="flex gap-3 text-[15px] leading-7 text-[var(--on-dark-body)]"
                    >
                      <DibaLeafMark
                        className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[var(--on-dark-accent)]"
                      />
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Wat past, en wat niet. */}
            <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
              <p className="diba-label text-[var(--t-label)]">
                {past.length === 0
                  ? "Nog niets dat volledig past"
                  : `Past bij je profiel · ${past.length}`}
              </p>
              {past.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {past.slice(0, 6).map((m) => (
                    <li key={m.behandeling.slug}>
                      <Link
                        href={`/behandelingen/${m.behandeling.slug}`}
                        className="flex items-baseline justify-between gap-4 rounded-[var(--r-sm)] px-4 py-3 -mx-4 transition-colors hover:bg-[var(--g-050)]"
                      >
                        <span className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                          {m.behandeling.naam}
                        </span>
                        <span className="shrink-0 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                          {prijsTekst(m.behandeling.prijs)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : profiel.doelen.length === 0 ? (
                <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
                  Vul aan wat je wil veranderen, dan komt hier de lijst.
                </p>
              ) : (
                <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
                  Alles wat op jouw doel gemaakt is, valt af op iets anders dat je hebt
                  ingevuld. Meestal is dat tijdelijk: hersteltijd, zon of een middel dat je
                  nu gebruikt. Hiernaast staat wat je in de intake moet melden.
                </p>
              )}

              {kanNiet.length > 0 ? (
                <p className="mt-6 border-t border-[var(--g-100)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
                  {kanNiet.length} behandelingen vallen af op wat je hebt ingevuld. Op de
                  behandelingenpagina staat per stuk waarom.
                </p>
              ) : null}

              <Link
                href="/behandelingen"
                className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Bekijk alle behandelingen
              </Link>
            </div>
          </div>
        )}

        <p className="mt-10 max-w-[64ch] text-[15px] leading-7 text-[var(--t-body)]">
          Dit is geen diagnose en geen advies. Het legt naast elkaar wat jij hebt ingevuld
          en wat een behandeling doet, en zegt waar dat wringt. Wat er bij jou past bepaalt
          een mens, na de meting. Je profiel blijft in deze browser staan: geen account,
          geen mailadres, niets dat naar ons toe gaat.
        </p>
      </section>
    </div>
  );
}
