"use client";

import { useState } from "react";
import Uitkomst from "@/components/huidprofiel/Uitkomst";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import MiniHuidscan from "@/components/ui/MiniHuidscan";
import Spinnenweb from "@/components/ui/Spinnenweb";
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
  LEEFTIJD,
  PROFIEL_ONDERDELEN,
  SITUATIE,
  VOORGESCHIEDENIS,
} from "@/data/huidprofiel";
import { publicCopy } from "@/lib/copy-flags";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * De profielpagina: je huid in negen stappen.
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
              /* Geen label maar uitleg: hierop baseer je je antwoord, dus leesmaat. */
              <span
                className={`mt-0.5 text-[13px] leading-5 ${aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
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
    zetLeeftijd,
    wis,
  } = useHuidprofiel();

  const [scanOpen, setScanOpen] = useState(false);
  const stand = compleetheid(profiel);
  /* Alles wat met de uitkomst te maken heeft, staat sinds deze ronde in Uitkomst.tsx.
     Dit component stelt de vragen; dat component leest ze terug. */
  const kanttekening = huidtypeKanttekening(profiel.huidtype);

  return (
    <div>
      {/* ── Voortgang ── */}
      <div className="sticky top-[var(--nav-h)] z-20 -mx-5 mb-10 bg-[var(--g-010)]/95 px-5 py-4 shadow-[0_6px_16px_-12px_rgba(15,45,28,.5)] backdrop-blur sm:-mx-9 sm:px-9 lg:-mx-[7.5vw] lg:px-[7.5vw]">
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
                {/* Was een link naar /#huidscan, dus naar de homepage. Je werd van je
                    eigen profielpagina weggestuurd om stap 1 te kunnen doen, en kwam
                    daarna op een andere pagina uit. De scan draait nu hier. */}
                <button
                  type="button"
                  onClick={() => setScanOpen((v) => !v)}
                  aria-expanded={scanOpen}
                  className="diba-label mt-6 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  {scanOpen ? "Sluit de scan" : "Scan opnieuw doen"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
              <p className="max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
                Begin hier: vier vragen, ongeveer een minuut. Je krijgt je
                profielschets terug en twee van de vragen hieronder staan daarna
                meteen goed.
              </p>
              <div className="mt-7">
                <MiniHuidscan />
              </div>
            </div>
          )}

          {/* Opnieuw scannen, op dezelfde plek en zonder de pagina te verlaten. */}
          {profiel.scan && scanOpen ? (
            <div className="mt-4 rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
              <MiniHuidscan />
            </div>
          ) : null}
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

        {/* ── 3. Leeftijd ──
            Twee vakjes, en dat is geen luiheid: er zijn twee acnetrajecten en het enige
            verschil is de leeftijd. Zonder deze vraag kreeg een veertigjarige het
            jongerentraject aangeraden en een zestienjarige het volwassentraject, allebei
            zonder dat er iets zichtbaar misging. Meer banden vragen zou betekenen dat we
            gegevens opslaan die we nergens voor gebruiken. */}
        <Vraag
          nummer={3}
          kop="Hoe oud"
          accent="ben je?"
          uitleg="Alleen omdat er een acnetraject bestaat dat speciaal voor 18 jaar en jonger gemaakt is. Verder doen we niets met dit antwoord."
          klaar={profiel.leeftijd !== null}
        >
          <Keuzes
            opties={LEEFTIJD}
            actief={profiel.leeftijd ? [profiel.leeftijd] : []}
            onKies={(id) => zetLeeftijd(id as never)}
          />
        </Vraag>

        {/* ── 4. Huidtype ── */}
        <Vraag
          nummer={4}
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
                  {/* Zelfde reden als hierboven: "Zeer licht, verbrandt snel" is de zin
                      waarmee je je eigen huidtype herkent. */}
                  <span
                    className={`mt-0.5 text-[13px] leading-5 ${aan ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
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
          nummer={5}
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
          nummer={6}
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
          nummer={7}
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
          nummer={8}
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
          nummer={9}
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
        className="scroll-mt-[var(--anker-offset)] pt-12 lg:pt-16"
      >
        <p className="diba-label text-[var(--t-label)]">Je uitkomst</p>
        <h2 className="diba-display-m mt-4 max-w-[20ch]">
          Wat dit betekent
          <br />
          <span className="diba-accent">voor jouw huid.</span>
        </h2>

        <Uitkomst profiel={profiel} />

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
