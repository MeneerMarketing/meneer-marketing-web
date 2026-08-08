"use client";

import Link from "next/link";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Spinnenweb from "@/components/ui/Spinnenweb";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
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
  nogNietGemeten,
  profielSamenvatting,
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

type Optie = {
  readonly id: string;
  readonly label: string;
  readonly zin?: string;
};

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
    /* Vlakken, geen lijnen, en alle kaarten dezelfde.
     *
     * Er stonden hier randen, een schaduw en een gekleurde rail. Alle drie van mij, geen
     * van drieën uit het ontwerp: de Figma-homepage bouwt met gevulde vlakken en geen
     * enkele streep. Een rand is de makkelijke manier om iets af te bakenen en precies
     * wat deze huisstijl niet doet.
     *
     * Daarna liet ik de vulling de staat dragen (wit als het nog open stond, mint als
     * het af was). Ook mis: de sectie eronder is zelf mint, dus de ingevulde kaarten
     * losten erin op. Wit op mint is het contrast dat de homepage gebruikt, en dat werkt
     * alleen als álle kaarten wit zijn.
     *
     * De staat zit dus in de badge en het label, zoals de homepage het ook doet: met
     * pillen en niet met vlakken. */
    <section className="overflow-hidden rounded-[var(--r-lg)] bg-white">
      <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-11">
        {/* Niet meer sticky.

            Toen elke vraag nog een strook op één doorlopende achtergrond was, hielp het
            dat de kop meeliep terwijl je door een lange optielijst scrolde. Nu het kaarten
            zijn werkt het tegen je: de kop zakt binnen zijn eigen kaart naar beneden en
            komt halverwege de antwoorden te hangen. Kaarten zijn kort genoeg. */}
        <div className="self-start">
          <p
            className={`diba-label flex items-center gap-2.5 ${
              klaar ? "text-[var(--g-700)]" : "text-[var(--t-muted)]"
            }`}
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-[var(--r-pill)] text-[12px] tabular-nums transition-colors duration-300 ${
                klaar
                  ? "bg-[var(--g-700)] text-white"
                  : "bg-[var(--g-050)] text-[var(--g-700)]"
              }`}
            >
              {nummer}
            </span>
            {klaar ? "Ingevuld" : "Nog open"}
          </p>

          {/* Eén regel, en het accentwoord loopt door in plaats van eronder.
              Op display-s (tot 44px) brak "Hoe voelt je huid meestal?" in deze kolom
              altijd af, en een harde regelovergang tussen kop en accent maakte er dan
              drie regels van. Kleiner en doorlopend leest rustiger en past wel. */}
          <h2 className="mt-4 text-[30px] leading-[1.05] font-normal tracking-[-.05em] text-balance sm:text-[34px]">
            {kop}
            {accent ? <span className="diba-accent"> {accent}</span> : null}
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

/**
 * De twee helften van de vragenlijst.
 *
 * Acht vragen achter elkaar zijn acht keer hetzelfde, en dan wordt het invullen een
 * formulier. Ze vallen alleen niet in acht gelijke delen uiteen maar in twee: eerst wat
 * je wil, daarna wat je huid aankan. Dat onderscheid draagt de hele pagina (zie het
 * docblock hierboven), dus het mag ook zichtbaar zijn.
 */
function Blokkop({
  nummer,
  kop,
  zin,
}: {
  nummer: string;
  kop: string;
  zin: string;
}) {
  return (
    <div className="flex items-start gap-5 pt-4">
      <span
        aria-hidden="true"
        className="diba-label mt-1.5 shrink-0 rounded-[var(--r-pill)] bg-white px-4 py-2 text-[var(--g-700)]"
      >
        {nummer}
      </span>
      <div>
        <h2 className="diba-display-s">{kop}</h2>
        <p className="mt-3 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
          {zin}
        </p>
      </div>
    </div>
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
            /* g-050 op wit is precies wat de homepage doet met haar lijstitems.
               Geen rand, alleen een vlak dat een tint donkerder is dan de kaart. */
            className={`flex min-h-14 flex-col justify-center rounded-[var(--r-md)] px-5 py-3.5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
              aan
                ? "bg-[var(--g-700)]"
                : "bg-[var(--g-050)] hover:bg-[var(--g-100)]"
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
  const samenvatting = profielSamenvatting(profiel);
  const onbekend = nogNietGemeten(profiel);
  /* De nulmeting uit de behandelingentabel: prijs en hersteltijd komen daar vandaan
     en niet uit een tweede plek die kan verlopen. */
  const nulmeting = behandelingVoorSlug("huidanalyse");

  return (
    <div>
      {/* ── Voortgang ── */}
      <div className="sticky top-[var(--nav-h)] z-20 -mx-5 mb-10 border-b border-[var(--g-100)] bg-[var(--g-010)]/95 px-5 py-4 backdrop-blur sm:-mx-9 sm:px-9 lg:-mx-[7.5vw] lg:px-[7.5vw]">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
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

      {/* ── Blok 1: wat je wil ── */}
      <Blokkop
        nummer="Deel 1"
        kop="Wat je wil bereiken"
        zin="Vier vragen over je doel, je huid en hoeveel hersteltijd je hebt. Hiermee kunnen we al ordenen wat er bij je past."
      />

      <div className="mt-8 space-y-4">
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
                Je hebt de mini-scan nog niet gedaan. Begin daar: het duurt een
                minuut en het zet meteen twee van de vragen hieronder goed.
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
          <Keuzes
            opties={DOELEN}
            actief={profiel.doelen}
            onKies={(id) => wisselDoel(id as never)}
          />
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
      </div>

      {/* ── Blok 2: wat je huid aankan ── */}
      <div className="mt-16">
        <Blokkop
          nummer="Deel 2"
          kop="Wat je huid aankan"
          zin="Deze vier gaan over grenzen. Retinol, zwangerschap, een gebruinde huid, neiging tot littekens: dingen die in de praktijk pas aan de balie boven tafel komen, en dan een afspraak kosten."
        />
      </div>

      <div className="mt-8 space-y-4">
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
          klaar={
            profiel.situatie.length > 0 || profiel.voorgeschiedenis.length > 0
          }
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
      </div>

      {/* ── Uitkomst ──────────────────────────────────────────────────────────

          Vier blokken in plaats van twee lijstjes, in de volgorde waarin iemand ze
          nodig heeft:

            1. Je huid, teruggelezen in gewone zinnen. Eerst herkenning.
            2. Wat er bij je past, mét de reden. De reden stond er eerder niet in,
               terwijl die al berekend werd.
            3. Wat deze acht antwoorden níet kunnen beslissen. Dat is het enige
               eerlijke argument voor een afspraak, en het is een sterker argument
               dan welke korting ook.
            4. Wat er dan gebeurt, wat het kost en hoe lang het duurt. De
               onbekendheid wegnemen is wat mensen over de streep trekt op een
               medische site; drukmiddelen doen het tegenovergestelde.

          Eén donkergroen vlak in dit geheel: blok 3 (§5). Dat is met opzet het blok
          waar staat wat we nog niet weten en niet het blok met de knop erin. */}
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
            Vul hierboven iets in, dan staat hier meteen je profiel, wat erbij
            past en wat je in de intake moet melden.
          </p>
        ) : (
          <div className="mt-10 space-y-4">
            {/* ── 1. Je huid, teruggelezen ── */}
            <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
              <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
                <div className="mx-auto lg:mx-0">
                  {profiel.scan ? (
                    <Spinnenweb
                      waarden={profiel.scan.assen}
                      metLabels
                      className="h-[260px] w-[260px]"
                    />
                  ) : (
                    <div className="flex h-[260px] w-[260px] flex-col items-center justify-center rounded-[var(--r-lg)] bg-[var(--g-025)] p-8 text-center">
                      <DibaLeafMark className="h-9 w-9 text-[var(--g-300)]" />
                      <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)]">
                        Doe de mini-scan, dan staat je spinnenweb hier.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="diba-label text-[var(--t-label)]">
                    Je huid, zoals jij hem beschrijft
                  </p>
                  <div className="mt-5 space-y-3">
                    {samenvatting.map((z) => (
                      <p
                        key={z}
                        className="max-w-[58ch] text-[17px] leading-8 text-[var(--t-body)]"
                      >
                        {z}
                      </p>
                    ))}
                  </div>

                  {/* Wat je moet melden hoort bij je profiel en niet bij het aanbod. */}
                  {melden.length > 0 ? (
                    <div className="mt-7 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                      <p className="diba-label text-[var(--t-label)]">
                        Meld dit in de intake · {melden.length}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {melden.map((m) => (
                          <li
                            key={m}
                            className="flex gap-3 text-[15px] leading-7 text-[var(--t-body)]"
                          >
                            <DibaLeafMark className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[var(--g-600)]" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {stand < PROFIEL_ONDERDELEN ? (
                    <p className="mt-6 text-[14px] leading-6 text-[var(--t-muted)]">
                      Je hebt {stand} van de {PROFIEL_ONDERDELEN} vragen
                      ingevuld. Elke vraag die je nog beantwoordt maakt deze
                      uitkomst preciezer.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* ── 2. Wat erbij past, met de reden erbij ── */}
            <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
              <p className="diba-label text-[var(--t-label)]">
                {past.length === 0
                  ? "Nog niets dat volledig past"
                  : `Past bij je profiel · ${past.length}`}
              </p>

              {past.length > 0 ? (
                <>
                  <ul className="mt-6 space-y-3">
                    {past.slice(0, 4).map((m, i) => (
                      <li key={m.behandeling.slug}>
                        <Link
                          href={`/behandelingen/${m.behandeling.slug}`}
                          className="block rounded-[var(--r-md)] bg-[var(--g-050)] p-5 transition-colors duration-200 hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-6"
                        >
                          <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                            <span className="flex items-baseline gap-3">
                              {i === 0 ? (
                                <span className="diba-label rounded-[var(--r-pill)] bg-[var(--g-700)] px-2.5 py-1 text-white">
                                  Beste match
                                </span>
                              ) : null}
                              <span className="text-[18px] leading-7 font-medium text-[var(--t-strong)]">
                                {m.behandeling.naam}
                              </span>
                            </span>
                            <span className="shrink-0 text-[15px] leading-7 text-[var(--t-muted)] tabular-nums">
                              {prijsTekst(m.behandeling.prijs)}
                            </span>
                          </span>

                          {/* De reden werd al berekend en werd nergens getoond. Juist
                              die maakt het verschil tussen een lijst en een advies. */}
                          <span className="mt-2 block max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
                            {publicCopy(m.reden)}
                          </span>

                          <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] leading-6 text-[var(--t-muted)]">
                            <span>
                              Herstel: {publicCopy(m.behandeling.herstel)}
                            </span>
                            <span>
                              {publicCopy(
                                m.behandeling.sessies,
                                "Aantal sessies volgt in de intake",
                              )}
                            </span>
                          </span>

                          {m.letOp.length > 0 ? (
                            <span className="mt-3 block text-[13px] leading-6 text-[var(--t-label)]">
                              Let op: {m.letOp.join(". ")}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      href="/behandelingen"
                      className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                    >
                      Alle behandelingen, geordend op je profiel
                    </Link>
                    {kanNiet.length > 0 ? (
                      <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                        {kanNiet.length} vallen af op wat je hebt ingevuld. Daar
                        staat per stuk bij waarom.
                      </span>
                    ) : null}
                  </div>
                </>
              ) : profiel.doelen.length === 0 ? (
                <p className="mt-5 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
                  Vul aan wat je wil veranderen, dan komt hier de lijst.
                </p>
              ) : (
                <p className="mt-5 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
                  Alles wat op jouw doel gemaakt is, valt af op iets anders dat
                  je hebt ingevuld. Meestal is dat tijdelijk: hersteltijd, zon
                  of een middel dat je nu gebruikt. Hierboven staat wat je in de
                  intake moet melden.
                </p>
              )}
            </div>

            {/* ── 3. Wat hier niet uit te halen valt ── */}
            <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9 lg:p-11">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                <div>
                  <p className="diba-label diba-label-on-dark">
                    Eerlijk gezegd
                  </p>
                  <p className="diba-display-s mt-4 max-w-[16ch]">
                    Dit weten we
                    <span className="diba-accent-on-dark"> nog niet.</span>
                  </p>
                  <p className="mt-6 max-w-[46ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                    Alles hierboven komt uit jouw antwoorden. Dat is genoeg om
                    te ordenen en niet genoeg om te beslissen. Wat er hieronder
                    staat is met het blote oog niet vast te stellen, ook niet
                    door ons.
                  </p>
                </div>
                <ul className="space-y-4">
                  {onbekend.map((z) => (
                    <li
                      key={z}
                      className="flex gap-3.5 border-b border-white/15 pb-4 text-[15px] leading-7 text-[var(--on-dark-body)] last:border-b-0 last:pb-0"
                    >
                      <DibaLeafMark className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[var(--on-dark-accent)]" />
                      {publicCopy(z)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── 4. Wat er dan gebeurt ── */}
            {/* Het zwaarste mintvlak van de pagina, zoals de featuretegels op de
                homepage. Labels staan hier in g-800 en niet in t-label: dat laatste haalt
                op deze tint geen AA (4,21) en g-800 wel (7,14). */}
            <div className="rounded-[var(--r-lg)] bg-[var(--g-200)] p-7 sm:p-9 lg:p-11">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                <div>
                  <p className="diba-label text-[var(--g-800)]">
                    De volgende stap
                  </p>
                  <h3 className="diba-display-s mt-4 max-w-[16ch]">
                    Behandeling Nul.
                    <span className="diba-accent">
                      {" "}
                      Meten, niet behandelen.
                    </span>
                  </h3>
                  <p className="mt-6 max-w-[52ch] text-[16px] leading-8 text-[var(--g-900)]">
                    Er gebeurt niets met je huid. Er wordt gekeken, gemeten en
                    uitgelegd, en je gaat naar huis met wat er uit de meting
                    kwam en wat dat betekent voor je doel. Ook als dat betekent
                    dat we je iets afraden.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      href="/intake"
                      className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-7 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                    >
                      Plan Behandeling Nul
                    </Link>
                    <Link
                      href="/behandelingen/huidanalyse"
                      className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                    >
                      Wat er precies gebeurt
                    </Link>
                  </div>
                </div>

                {/* De feiten komen uit behandelingen.ts, zodat de prijs hier nooit
                    los kan gaan lopen van de prijslijst. */}
                <dl className="space-y-3 self-center rounded-[var(--r-md)] bg-white p-6 sm:p-7">
                  {[
                    [
                      "Wat het kost",
                      nulmeting ? prijsTekst(nulmeting.prijs) : "Op aanvraag",
                    ],
                    [
                      "Hersteltijd",
                      nulmeting ? publicCopy(nulmeting.herstel) : "Geen",
                    ],
                    ["Wat er gebeurt", "Meten en uitleggen, niet behandelen"],
                    ["Daarna", "Je zit nergens aan vast"],
                  ].map(([kop, waarde]) => (
                    <div
                      key={kop}
                      className="flex items-baseline justify-between gap-6 border-b border-[var(--g-050)] pb-3 last:border-b-0 last:pb-0"
                    >
                      <dt className="diba-label shrink-0 text-[var(--t-label)]">
                        {kop}
                      </dt>
                      <dd className="text-right text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                        {waarde}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}

        <p className="mt-10 max-w-[64ch] text-[15px] leading-7 text-[var(--t-body)]">
          Dit is geen diagnose en geen advies. Het legt naast elkaar wat jij
          hebt ingevuld en wat een behandeling doet, en zegt waar dat wringt.
          Wat er bij jou past bepaalt een mens, na de meting. Je profiel blijft
          in deze browser staan: geen account, geen mailadres, niets dat naar
          ons toe gaat.
        </p>
      </section>
    </div>
  );
}
