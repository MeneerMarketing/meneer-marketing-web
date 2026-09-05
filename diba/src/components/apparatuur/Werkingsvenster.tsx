"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DOELWITTEN, type Apparaat } from "@/data/apparatuur";
import { HUIDLAGEN, HUIDLAGEN_BRON, LAAGAANDEEL } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Het werkingsvenster: een doorsnede van de huid waarin je ziet wat een apparaat doet.
 *
 * WAAROM DIT ER IS.
 *
 * Een apparatuurpagina die alleen vertelt wát je ermee doet, vertelt hetzelfde als de
 * behandelpagina. Dan mag hij niet bestaan. Wat een apparaat eigen is, is het mechaniek:
 * hoe het zijn werk doet, waar het op aangrijpt en tot hoe diep het komt. Dat is precies
 * het stuk dat in folders wordt overgeslagen, want het legt ook de grens bloot. Wie laat
 * zien dat een peeling tot dertig procent komt, heeft daarmee verteld waarom hij geen
 * rimpels wegneemt.
 *
 * DRIE STAPPEN, EN WAAROM PRECIES DRIE.
 *
 * Elk mechaniek in deze kliniek heeft dezelfde vorm: er gaat iets aan vooraf, er gebeurt
 * iets, en daarna volgt het gevolg. Die derde is bij bijna elk apparaat het echte verhaal
 * ("wat je ziet komt weken later"), en juist die verdwijnt in een verkooppraatje. Door de
 * stappen even zwaar te maken kan hij niet meer wegvallen.
 *
 * HOE HET BEWEEGT.
 *
 * De stand is React-state, de beweging is CSS-transitie op transform en opacity. Geen
 * animatiebibliotheek, geen timeline: één getal (`stap`) bepaalt waar alles staat, dus er
 * valt ook niets uit de pas te lopen. Het loopt vanzelf door tot je zelf een stap kiest,
 * daarna zwijgt het. Wie zelf stuurt wil niet dat het ding onder je hand verder tikt.
 *
 * Bij `prefers-reduced-motion` start de cyclus niet en zijn de transities uit. De stappen
 * blijven gewoon klikbaar, dus de inhoud is compleet zonder één pixel beweging.
 */

/**
 * Hoe heet wat er in de huid gebeurt.
 *
 * Elke laag in de tekening draagt een naam en die lezen mensen moeiteloos. Alles wat er
 * beweegt droeg er geen, en dan wordt het raden: vier streepjes in een mintvlak zijn geen
 * naaldjes tot er "naaldjes" bij staat. Dit is de kortst mogelijke naam voor het ding dat
 * je op dat moment ziet, niet voor het apparaat en niet voor het effect.
 */
const WERKWIJZE_NAAM: Record<string, string> = {
  meten: "Meetlicht",
  licht: "Lichtpuls",
  naald: "Naaldjes",
  chemisch: "Zuur",
  zuiging: "Zuiging",
  kou: "Koude CO2",
  injectie: "Injectie",
};

/**
 * Waar de huid begint in de tekening, en waar de diepste lederhuid ophoudt.
 *
 * De huid begon op 88 omdat er boven een handstuk moest passen. Dat handstuk is weg (zie
 * `Mechaniek`), en die vierenveertig pixels gaan naar de huid: dat is een vijfde meer
 * doorsnede, precies de plek waar dit onderdeel zijn werk doet. Wat er nog boven staat is
 * ruimte voor de naam van het mechaniek en voor de schilfers die bij een peeling loslaten.
 */
const OPPERVLAK = 44;
const BODEM = 300;

/**
 * De hoogte van de tekening: twaalf eenheden lucht onder de diepste laag.
 *
 * Een behandeling die tot 2 mm komt heeft zijn lijn op BODEM, en dat was ook de onderrand.
 * De helft van de lijn en de onderste helft van de pil vielen buiten beeld. De goot naast
 * de tekening gebruikt dezelfde hoogte, anders komen de lijnen naar de legenda scheef uit.
 */
const HOOGTE = BODEM + 12;

/**
 * Onderkant van elke laag, afgeleid uit dezelfde verhoudingen als de vergelijkingsas op
 * het overzicht. Afgeleid en niet overgeschreven: twee lijstjes met dezelfde getallen
 * lopen vroeg of laat uit elkaar, en dan klopt de vergelijking tussen apparaten niet meer
 * zonder dat iemand het merkt.
 */
const LAAGGRENZEN = LAAGAANDEEL.reduce<number[]>((rij, deel) => {
  const vorig = rij.length === 0 ? OPPERVLAK : rij[rij.length - 1];
  rij.push(vorig + ((BODEM - OPPERVLAK) * deel) / 100);
  return rij;
}, []);

/**
 * Vier duidelijk verschillende tinten, van licht naar donker: dieper is voller. Ze liepen
 * van 100 via 200 en 300 naar 500, en de eerste drie stappen zijn zo klein dat je een
 * verloop las in plaats van vier lagen. Hier en niet in de tekening, omdat de lijst op
 * de telefoon dezelfde tint als stip voor elke laag zet.
 */
const TINTEN = ["--g-075", "--g-200", "--g-400", "--g-600"] as const;

/** Of laag i geraakt wordt: de bovenkant van de laag ligt boven de gehaalde diepte. */
function wordtGeraakt(i: number, bodem: number): boolean {
  const boven = i === 0 ? OPPERVLAK : LAAGGRENZEN[i - 1];
  return boven < bodem;
}

/**
 * De diepte in millimeters op een y in de tekening, lineair binnen de laag.
 *
 * Gebruikt de `tot`-waarden uit HUIDLAGEN (0,02 / 0,1 / 0,5 / 2 mm), dus dit voegt geen
 * medische bewering toe: het rekent zichtbaar wat er al staat. Daarom een tilde in de
 * weergave: afgeleid uit een schema, niet gemeten.
 */
function diepteInMm(y: number): string {
  const grenzenMm = HUIDLAGEN.map((l) =>
    Number(l.tot.replace(" mm", "").replace(",", ".")),
  );
  let bovenY = OPPERVLAK;
  let bovenMm = 0;
  for (let i = 0; i < LAAGGRENZEN.length; i++) {
    const onderY = LAAGGRENZEN[i];
    const onderMm = grenzenMm[i];
    if (y <= onderY) {
      const deel = (y - bovenY) / (onderY - bovenY);
      const mm = bovenMm + deel * (onderMm - bovenMm);
      const tekst =
        mm < 0.1 ? mm.toFixed(2) : mm < 1 ? mm.toFixed(1) : mm.toFixed(1);
      return tekst.replace(".", ",").replace(/,0$/, "");
    }
    bovenY = onderY;
    bovenMm = onderMm;
  }
  return String(grenzenMm[grenzenMm.length - 1]).replace(".", ",");
}

/** Het midden van laag i in de tekening, als y in de viewBox. */
function laagMidden(i: number): number {
  const boven = i === 0 ? OPPERVLAK : LAAGGRENZEN[i - 1];
  return (boven + LAAGGRENZEN[i]) / 2;
}

/**
 * De vier lagen naast de tekening, vanaf md.
 *
 * Als gewone HTML en niet als SVG-tekst, want SVG-tekst breekt niet af. Goot en kolom
 * staan allebei absoluut in dit vlak, zodat alleen de tekening ernaast hoogte inbrengt:
 * 340px, vier rijen van 85, genoeg voor een naam en drie regels inhoud. De goot rekt mee
 * (preserveAspectRatio none) en trekt per laag een lijn van het laagmidden naar het
 * rijmidden. De lagen zijn ongelijk hoog en de rijen gelijk, dus die lijnen lopen schuin;
 * dat is precies waarvoor ze er zijn.
 */
function LegendaNaast({ bodem, beweegt }: { bodem: number; beweegt: boolean }) {
  const rijen = HUIDLAGEN.length;
  return (
    <div className="relative hidden min-w-0 flex-1 md:block">
      <svg
        viewBox={`0 0 28 ${HOOGTE}`}
        preserveAspectRatio="none"
        className="absolute inset-y-0 left-0 h-full w-7"
        aria-hidden="true"
      >
        {HUIDLAGEN.map((laag, i) => {
          const y1 = laagMidden(i);
          const y2 = ((i + 0.5) / rijen) * HOOGTE;
          return (
            <path
              key={laag.id}
              d={`M0 ${y1} C 14 ${y1}, 14 ${y2}, 28 ${y2}`}
              fill="none"
              stroke={wordtGeraakt(i, bodem) ? "var(--g-400)" : "var(--g-200)"}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              style={{
                transition: beweegt ? "stroke 500ms ease" : undefined,
              }}
            />
          );
        })}
      </svg>

      <ol className="absolute inset-0 grid grid-rows-4 pl-10">
        {HUIDLAGEN.map((laag, i) => {
          const geraakt = wordtGeraakt(i, bodem);
          return (
            <li
              key={laag.id}
              className="flex min-w-0 flex-col justify-center"
              style={{
                opacity: geraakt ? 1 : 0.45,
                transition: beweegt ? "opacity 500ms ease" : undefined,
              }}
            >
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span
                  className={`text-[15px] leading-5 text-[var(--t-strong)] ${
                    geraakt ? "font-semibold" : "font-medium"
                  }`}
                >
                  {laag.naam}
                </span>
                <span className="text-[12px] leading-5 text-[var(--t-muted)] tabular-nums">
                  tot {laag.tot}
                </span>
              </p>
              <p className="mt-1 max-w-[40ch] text-[13px] leading-[18px] text-[var(--t-muted)]">
                {laag.bevat}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Dezelfde vier lagen als lijst onder de tekening, onder md.
 *
 * Naast een tekening van honderdvijftig pixels past geen tekst die je kunt lezen; op
 * 375px overlapten de rijen elkaar. De koppeling met de tekening loopt hier via de
 * kleurstip, in dezelfde tint als de laag, en via de volgorde: van boven naar beneden,
 * net als in de huid. Wat buiten bereik ligt vervaagt, net als in de tekening.
 */
function LegendaOnder({ bodem, beweegt }: { bodem: number; beweegt: boolean }) {
  return (
    <ol className="mt-5 divide-y divide-[var(--g-100)] md:hidden">
      {HUIDLAGEN.map((laag, i) => {
        const geraakt = wordtGeraakt(i, bodem);
        return (
          <li
            key={laag.id}
            className="flex gap-3 py-3 first:pt-0 last:pb-0"
            style={{
              opacity: geraakt ? 1 : 0.45,
              transition: beweegt ? "opacity 500ms ease" : undefined,
            }}
          >
            <span
              aria-hidden="true"
              className="mt-1 h-3 w-3 shrink-0 rounded-full ring-1 ring-[var(--g-200)] ring-inset"
              style={{ background: `var(${TINTEN[i]})` }}
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline justify-between gap-3">
                <span
                  className={`text-[14px] leading-5 text-[var(--t-strong)] ${
                    geraakt ? "font-semibold" : "font-medium"
                  }`}
                >
                  {laag.naam}
                </span>
                <span className="shrink-0 text-[12px] leading-5 text-[var(--t-muted)] tabular-nums">
                  tot {laag.tot}
                </span>
              </p>
              <p className="mt-0.5 text-[13px] leading-5 text-[var(--t-muted)]">
                {laag.bevat}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Alleen wat het venster tekent.
 *
 * Dit was `Apparaat`, het hele record. Dat is een client component, dus dat record ging in
 * zijn geheel de pagina in: techniekteksten, FAQ en de redactievlaggen die daarin staan.
 * Zichtbaar in de broncode van zesenzeventig pagina's.
 */
export type WerkingsvensterApparaat = Pick<
  Apparaat,
  "naam" | "fasen" | "diepte" | "doelwit" | "werkwijze"
>;

/** De diepte uit de data (procenten) omgerekend naar een y in de tekening. */
function diepteY(procent: number): number {
  return OPPERVLAK + ((BODEM - OPPERVLAK) * procent) / 100;
}

/** Golvende scheidingslijn, zodat een huid geen gestapelde balken wordt. */
function golf(y: number, amplitude = 3): string {
  return `M0 ${y} C 45 ${y - amplitude}, 90 ${y + amplitude}, 135 ${y} S 225 ${y - amplitude}, 270 ${y}`;
}

type Props = {
  readonly apparaat: WerkingsvensterApparaat;
  /**
   * De diepte van dít geval, als die afwijkt van wat het apparaat maximaal haalt.
   *
   * Op een behandelpagina is dat het verschil tussen wat de Fotona kán (85) en waar deze
   * ene behandeling op wordt ingesteld. Het apparaat levert het mechaniek, de behandeling
   * bepaalt de diepte. Zonder dit onderscheid zou elke behandeling op een apparaat de
   * maximale diepte claimen, en dat is precies één claim te veel.
   */
  readonly diepte?: number;
};

export default function Werkingsvenster({ apparaat, diepte }: Props) {
  const [stap, setStap] = useState(0);
  const [zelfGestuurd, setZelfGestuurd] = useState(false);
  const [rustig, setRustig] = useState(true);
  const uid = useId().replace(/[:]/g, "");
  const venster = useRef<HTMLDivElement>(null);

  const fasen = apparaat.fasen;
  const bodem = diepteY(diepte ?? apparaat.diepte);
  const doelwit = DOELWITTEN[apparaat.doelwit];

  /* Beweging alleen als het besturingssysteem er niet om vraagt hem te laten. */
  useEffect(() => {
    const vraag = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lees = () => setRustig(vraag.matches);
    lees();
    vraag.addEventListener("change", lees);
    return () => vraag.removeEventListener("change", lees);
  }, []);

  /* De cyclus loopt tot iemand zelf een stap kiest. Daarna is het van hem. */
  useEffect(() => {
    if (rustig || zelfGestuurd) return;
    const tik = window.setInterval(() => {
      setStap((s) => (s + 1) % fasen.length);
    }, 3600);
    return () => window.clearInterval(tik);
  }, [rustig, zelfGestuurd, fasen.length]);

  function kies(i: number) {
    setZelfGestuurd(true);
    setStap(i);
  }

  const beweegt = !rustig;

  return (
    <div
      ref={venster}
      /* items-center, want de twee kolommen zijn ongelijk van aard: links een doorsnede
         die zijn hoogte uit de tekening haalt, rechts drie stappen die zo lang zijn als
         de tekst toevallig uitvalt. Zonder centreren rekt de korte kolom mee tot onderaan
         en blijft de inhoud bovenin hangen, met een gat van een paar honderd pixels
         eronder. Naast elkaar gecentreerd horen ze bij elkaar.

         Twee kolommen pas vanaf xl en niet vanaf lg. De legenda naast de tekening heeft
         zo'n 560px nodig (tekening 306, goot 28, tekst van minstens 220); op lg is de
         linkerkolom 460 tot 500px en dan overlappen de rijen elkaar. Tussen md en xl
         staan de stappen daarom onder de tekening, in drie kolommen. */
      className="grid items-center gap-8 rounded-[var(--r-lg)] bg-white p-6 sm:p-8 lg:p-10 xl:grid-cols-[1.25fr_0.75fr] xl:gap-12"
    >
      {/* ── De doorsnede ── */}
      <div>
        {/* Vanaf md staat de tekening op een vaste hoogte met de legenda ernaast; de
            hoogte is dan van de tekst en niet van de breedte, en de rijen passen altijd.
            De SVG haalt zijn breedte uit zijn verhouding (h-full w-auto). Onder md staat
            hij op volle breedte, met de lagen als lijst eronder: naast een tekening van
            honderdvijftig pixels past geen leesbare tekst, en de pil met de diepte was
            daar zes pixels hoog. */}
        <div className="md:flex md:items-stretch">
          <div className="mx-auto w-full max-w-[22rem] md:mx-0 md:h-[340px] md:w-auto md:max-w-none md:shrink-0">
            <svg
              viewBox={`0 0 270 ${HOOGTE}`}
              className="block h-auto w-full md:h-full md:w-auto"
              role="img"
              aria-label={`Doorsnede van de huid met de werking van ${apparaat.naam}. Stap ${stap + 1} van ${fasen.length}: ${fasen[stap].kop}.`}
            >
              <defs>
                <clipPath id={`huid-${uid}`}>
                  <rect
                    x="0"
                    y={OPPERVLAK}
                    width="270"
                    height={BODEM - OPPERVLAK}
                  />
                </clipPath>
                {/* Licht moet als licht lezen en niet als een balk: het dooft naarmate het
                dieper komt, want onderweg wordt er energie opgenomen. */}
                <linearGradient
                  id={`straal-${uid}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                {/* De diepte waar de energie wordt opgenomen. Dat is de hele pointe van
                laserlicht: één ding neemt het op, de rest niet. */}
                <linearGradient
                  id={`opneem-${uid}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* De vier lagen, van licht naar donker: dieper is voller.

              De huid is met opzet stevig groen en niet bleek. Alles wat een apparaat
              doet is in deze tekening lichtgevend, en licht op een bijna witte huid is
              onzichtbaar. Door de huid donkerder te maken heeft elk mechaniek iets om
              tegen af te steken, en dat scheelt zeven keer een aparte kleurentruc. */}
              <g>
                {LAAGGRENZEN.map((onder, i) => {
                  const boven = i === 0 ? OPPERVLAK : LAAGGRENZEN[i - 1];
                  const binnenBereik = wordtGeraakt(i, bodem);
                  return (
                    <g key={HUIDLAGEN[i].id}>
                      <rect
                        x="0"
                        y={boven}
                        width="270"
                        height={onder - boven}
                        fill={`var(${TINTEN[i]})`}
                      />
                      {/* Buiten bereik wordt weggewassen: dit apparaat komt hier niet. */}
                      <rect
                        x="0"
                        y={boven}
                        width="270"
                        height={onder - boven}
                        fill="white"
                        style={{
                          opacity: binnenBereik ? 0 : 0.62,
                          transition: beweegt
                            ? "opacity 500ms ease"
                            : undefined,
                        }}
                      />
                      <path
                        d={golf(onder)}
                        fill="none"
                        stroke="white"
                        strokeOpacity="0.7"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </g>

              {/* Het oppervlak zelf, iets nadrukkelijker dan de rest. */}
              <path
                d={golf(OPPERVLAK, 4)}
                fill="none"
                stroke="var(--g-800)"
                strokeOpacity="0.5"
                strokeWidth="2"
              />

              <Mechaniek
                apparaat={apparaat}
                stap={stap}
                bodem={bodem}
                beweegt={beweegt}
                uid={uid}
              />

              {/* De diepte die dit apparaat haalt. Na het mechaniek getekend: stralen
                  en naaldjes liepen over de pil heen en maakten hem bleek. Dit is een
                  aantekening bij de tekening, en die ligt bovenop. */}
              <g
                style={{
                  transform: `translateY(${stap === 0 ? -14 : 0}px)`,
                  opacity: stap === 0 ? 0 : 1,
                  transition: beweegt
                    ? "transform 700ms ease, opacity 500ms ease"
                    : undefined,
                }}
              >
                {/* De grens als één stevige lijn met een naam en een maat. Er stond een
                    gestreepte lijn zonder woord erbij, en dan is het een versiering; met
                    "Tot hier" en de millimeters erbij is het de zin van de tekening. */}
                <line
                  x1="0"
                  y1={bodem}
                  x2="270"
                  y2={bodem}
                  stroke="var(--g-900)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <g transform={`translate(8 ${bodem})`}>
                  <rect
                    x="0"
                    y="-11"
                    width="118"
                    height="22"
                    rx="11"
                    fill="var(--g-900)"
                  />
                  <text
                    x="59"
                    y="4"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="600"
                    fill="white"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    {`Tot hier · ~${diepteInMm(bodem)} mm`}
                  </text>
                </g>
              </g>

              {/* Wat er in de huid gebeurt, met een naam erbij.
              De lagen dragen namen en zijn daardoor leesbaar; de bewegende vormen
              droegen er geen. Vier streepjes in een mintvlak zijn geen naaldjes tot er
              "naaldjes" bij staat. Alleen tijdens de stap waarin het werk gebeurt, want
              daarna klopt de naam niet meer. */}
              <text
                x="8"
                y={OPPERVLAK - 8}
                className="fill-[var(--g-900)] text-[10px] tracking-[.12em] uppercase"
                style={{
                  opacity: stap === 1 ? 0.75 : 0,
                  transition: beweegt ? "opacity 400ms ease" : undefined,
                }}
              >
                {WERKWIJZE_NAAM[apparaat.werkwijze]}
              </text>
            </svg>
          </div>

          <LegendaNaast bodem={bodem} beweegt={beweegt} />
        </div>

        <LegendaOnder bodem={bodem} beweegt={beweegt} />

        {/* [MEDISCHE-CHECK-ROJDA]: de dieptes en de fasen per apparaat. De vlag hoort in
            dit commentaar en niet in de zin eronder, want die zin lezen bezoekers wel. */}
        <p className="mt-4 text-[13px] leading-6 text-[var(--t-muted)]">
          De verhoudingen zijn schematisch; de diepten erbij zijn dat niet.{" "}
          {HUIDLAGEN_BRON} Hoe diep er bij jou gewerkt wordt hangt af van de
          instelling die de behandelaar kiest.
        </p>
      </div>

      {/* ── De stappen ── */}
      <div className="flex flex-col">
        <p className="diba-label text-[var(--t-label)]">Wat er gebeurt</p>

        {/* Onder de tekening (md tot xl) in drie kolommen, ernaast (vanaf xl) als één rij. */}
        <ol className="mt-5 grid gap-2 md:grid-cols-3 xl:grid-cols-1">
          {fasen.map((f, i) => {
            const actief = i === stap;
            const gehad = i < stap;
            return (
              <li key={f.kop}>
                <button
                  type="button"
                  onClick={() => kies(i)}
                  aria-current={actief ? "step" : undefined}
                  className={`flex w-full gap-4 rounded-[var(--r-sm)] p-4 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    actief
                      ? "bg-[var(--g-050)]"
                      : "bg-transparent hover:bg-[var(--g-025)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums transition-colors duration-200 ${
                      actief
                        ? "bg-[var(--g-700)] text-white"
                        : gehad
                          ? "bg-[var(--g-200)] text-[var(--g-900)]"
                          : "bg-[var(--g-050)] text-[var(--t-muted)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-[16px] leading-6 font-medium ${
                        actief
                          ? "text-[var(--t-strong)]"
                          : "text-[var(--t-body)]"
                      }`}
                    >
                      {f.kop}
                    </span>
                    <span
                      className="grid text-[15px] leading-7 text-[var(--t-body)]"
                      style={{
                        gridTemplateRows: actief ? "1fr" : "0fr",
                        opacity: actief ? 1 : 0,
                        transition: beweegt
                          ? "grid-template-rows 300ms ease, opacity 250ms ease"
                          : undefined,
                      }}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-1">{publicCopy(f.zin)}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Waar het op aangrijpt. Bij licht is dit natuurkunde, geen marketing. */}
        <div className="mt-6 rounded-[var(--r-md)] bg-[var(--g-050)] p-5">
          <p className="diba-label text-[var(--t-label)]">Grijpt aan op</p>
          <p className="mt-2 text-[16px] leading-6 font-medium text-[var(--t-strong)]">
            {doelwit.naam}
          </p>
          <p className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
            {doelwit.zin}
          </p>
        </div>

        {!rustig ? (
          <p className="mt-4 text-[13px] leading-6 text-[var(--t-muted)]">
            {zelfGestuurd
              ? "Je stuurt zelf. Kies een stap om verder te kijken."
              : "Loopt vanzelf door. Klik een stap om zelf te sturen."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   De zeven mechanieken.

   Elk mechaniek tekent hetzelfde verhaal in drie standen: aanloop boven de huid,
   het werk zelf, en wat er daarna overblijft. Ze delen de coördinaten van de
   doorsnede, dus de diepte is tussen apparaten eerlijk te vergelijken.
   ──────────────────────────────────────────────────────────────────────────── */

type MechaniekProps = {
  readonly apparaat: WerkingsvensterApparaat;
  readonly stap: number;
  readonly bodem: number;
  readonly beweegt: boolean;
  readonly uid: string;
};

function Mechaniek({ apparaat, stap, bodem, beweegt, uid }: MechaniekProps) {
  const soepel = (ms: number, vertraging = 0) =>
    beweegt
      ? `transform ${ms}ms cubic-bezier(.22,.61,.36,1) ${vertraging}ms, opacity ${Math.round(ms * 0.7)}ms ease ${vertraging}ms`
      : undefined;

  const knip = `url(#huid-${uid})`;

  switch (apparaat.werkwijze) {
    /* Meten: er gaat een scanlijn overheen en er verandert niets. Dat is het punt. */
    case "meten": {
      const y = stap === 0 ? OPPERVLAK - 4 : stap === 1 ? bodem : bodem;
      return (
        <>
          <g clipPath={knip}>
            <g style={{ opacity: stap === 0 ? 0 : 1, transition: soepel(600) }}>
              <line
                x1="0"
                y1={y}
                x2="270"
                y2={y}
                stroke="white"
                strokeWidth="3"
                style={{
                  transition: beweegt
                    ? "y1 900ms ease, y2 900ms ease"
                    : undefined,
                }}
              />
              <rect
                x="0"
                y={OPPERVLAK}
                width="270"
                height={y - OPPERVLAK}
                fill="white"
                opacity={stap === 2 ? 0.14 : 0.3}
                style={{ transition: soepel(700) }}
              />
            </g>
            {/* Stap 3: vier meetpunten. Vastgelegd, niet veranderd. */}
            <g
              style={{
                opacity: stap === 2 ? 1 : 0,
                transition: soepel(500, 120),
              }}
            >
              {[44, 100, 165, 226].map((x, i) => (
                <circle
                  key={x}
                  cx={x}
                  cy={132 + (i % 3) * 34}
                  r="5"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                />
              ))}
            </g>
          </g>
        </>
      );
    }

    /* Licht: stralen die tot precies één diepte komen en daar hun energie afgeven. */
    case "licht": {
      const stralen = [40, 88, 136, 184, 232];
      return (
        <>
          <g clipPath={knip}>
            {stralen.map((x, i) => (
              <g
                key={x}
                style={{
                  transformOrigin: `${x}px ${OPPERVLAK}px`,
                  transform: `scaleY(${stap === 0 ? 0 : 1})`,
                  opacity: stap === 2 ? 0.3 : 1,
                  transition: soepel(620, i * 70),
                }}
              >
                {/* De zachte kegel eromheen, taps toelopend: een bundel die
                    gericht is, wordt naar beneden smaller en niet breder. */}
                <path
                  d={`M${x - 17} ${OPPERVLAK} L${x + 17} ${OPPERVLAK} L${x + 7} ${bodem} L${x - 7} ${bodem} Z`}
                  fill={`url(#straal-${uid})`}
                />
                {/* De heldere kern; dooft mee met de kegel. */}
                <rect
                  x={x - 1.5}
                  y={OPPERVLAK}
                  width="3"
                  height={bodem - OPPERVLAK}
                  fill={`url(#straal-${uid})`}
                />
              </g>
            ))}
            {/* Waar de energie wordt opgenomen: één band, precies op diepte. */}
            <rect
              x="0"
              y={bodem - 19}
              width="270"
              height="38"
              fill={`url(#opneem-${uid})`}
              style={{
                transformOrigin: `0px ${bodem}px`,
                transform: `scaleY(${stap === 0 ? 0.2 : stap === 1 ? 1 : 1.5})`,
                opacity: stap === 0 ? 0 : stap === 1 ? 1 : 0.5,
                transition: soepel(700, 260),
              }}
            />
          </g>
        </>
      );
    }

    /* Naald: veel kanaaltjes tegelijk, en daarna het herstel dat het werk doet. */
    case "naald": {
      const naalden = [34, 62, 90, 118, 146, 174, 202, 230];
      return (
        <>
          <g clipPath={knip}>
            {/* Kanaaltjes als vulling met een punt eraan, niet als streep. Acht gelijke
                streepjes lezen als een hek; acht taps toelopende kanaaltjes als prikken. */}
            {naalden.map((x, i) => (
              <path
                key={x}
                d={`M${x - 2} ${OPPERVLAK - 2} L${x + 2} ${OPPERVLAK - 2} L${x + 1.5} ${bodem - 8} L${x} ${bodem} L${x - 1.5} ${bodem - 8} Z`}
                fill="var(--g-900)"
                style={{
                  transformOrigin: `${x}px ${OPPERVLAK}px`,
                  transform: `scaleY(${stap === 1 ? 1 : 0})`,
                  opacity: stap === 1 ? 1 : 0,
                  transition: soepel(300, (i % 4) * 60),
                }}
              />
            ))}
            {/* Stap 3: de kanaaltjes zijn dicht, het herstel loopt. */}
            <g
              style={{
                opacity: stap === 2 ? 1 : 0,
                transition: soepel(600, 150),
              }}
            >
              {naalden.map((x, i) => (
                <circle
                  key={`herstel-${x}`}
                  cx={x}
                  cy={bodem - 12 - (i % 3) * 16}
                  r={stap === 2 ? 6 : 1}
                  fill="white"
                  opacity="0.8"
                  style={{ transition: soepel(700, 200 + i * 45) }}
                />
              ))}
            </g>
          </g>
        </>
      );
    }

    /* Chemisch: een film die inwerkt en een bovenlaag die daarna loslaat. */
    case "chemisch": {
      return (
        <>
          <g clipPath={knip}>
            <rect
              x="0"
              y={OPPERVLAK}
              width="270"
              height={bodem - OPPERVLAK}
              fill="white"
              style={{
                transformOrigin: `0px ${OPPERVLAK}px`,
                transform: `scaleY(${stap === 0 ? 0.08 : 1})`,
                opacity: stap === 0 ? 0.25 : stap === 1 ? 0.5 : 0.15,
                transition: soepel(700),
              }}
            />
          </g>
          {/* Stap 3: de losgemaakte laag komt eraf.

              Bewust búiten de knipvorm, want deze schilfers laten de huid los. Wie ze
              binnen de doorsnede tekent, knipt precies het moment weg dat het verhaal
              is. Donker, want boven de huid is de achtergrond wit. */}
          <g style={{ opacity: stap === 2 ? 1 : 0, transition: soepel(500) }}>
            {[26, 68, 112, 158, 202, 244].map((x, i) => (
              <path
                key={x}
                d={`M${x - 15} ${OPPERVLAK} q15 -7 30 0 q-15 4 -30 0Z`}
                fill="var(--g-500)"
                style={{
                  transform:
                    stap === 2
                      ? `translate(${i % 2 ? 7 : -7}px, -19px) rotate(${i % 2 ? 21 : -21}deg)`
                      : "none",
                  transformOrigin: `${x}px ${OPPERVLAK}px`,
                  transition: soepel(900, i * 90),
                }}
              />
            ))}
          </g>
        </>
      );
    }

    /* Zuiging: poriën die van onderaf leeglopen.
     *
     * Hier stonden vier grijze lensvormen met groene balletjes die er boven de huid uit
     * zweefden. Twee dingen mis. Het grijs zat in geen enkele token, en de balletjes
     * gingen los van de huid hun eigen weg: bolletjes die in de lucht hangen zijn geen
     * talg maar erwten, en dat was precies de klacht.
     *
     * De porie is nu een trechter in de hoornlaag en de propjes zitten erin. Het legen
     * gebeurt binnen de huid: de prop krimpt van onderaf naar de opening toe en is
     * daarna weg. Niets verlaat de tekening en er hoeft niets buiten de knipvorm.
     */
    case "zuiging": {
      const porien = [52, 104, 158, 212];
      /* Hoe vol de porie nog zit. Eén getal, want het is één beweging. */
      const vulling = stap === 0 ? 1 : stap === 1 ? 0.35 : 0;
      const diep = 34;
      return (
        <g clipPath={knip}>
          {porien.map((x, i) => (
            <g key={x}>
              {/* De porie zelf: een trechter, breed aan de oppervlakte. */}
              <path
                d={`M${x - 8} ${OPPERVLAK} L${x - 3} ${OPPERVLAK + diep} L${x + 3} ${OPPERVLAK + diep} L${x + 8} ${OPPERVLAK} Z`}
                fill="var(--g-500)"
                opacity="0.5"
              />
              {/* De prop erin. Krimpt naar de opening toe en verdwijnt daar. */}
              <path
                d={`M${x - 6} ${OPPERVLAK + 3} L${x - 3} ${OPPERVLAK + diep - 2} L${x + 3} ${OPPERVLAK + diep - 2} L${x + 6} ${OPPERVLAK + 3} Z`}
                fill="var(--g-900)"
                style={{
                  transformOrigin: `${x}px ${OPPERVLAK + 3}px`,
                  transform: `scaleY(${vulling})`,
                  opacity: vulling === 0 ? 0 : 0.7,
                  transition: soepel(750, i * 90),
                }}
              />
            </g>
          ))}
          {/* Stap 3: de hoornlaag is schoon. Eén lichte band, geen los voorwerp. */}
          <rect
            x="0"
            y={OPPERVLAK}
            width="270"
            height={LAAGGRENZEN[0] - OPPERVLAK}
            fill="white"
            style={{
              opacity: stap === 2 ? 0.5 : 0,
              transition: soepel(600, 200),
            }}
          />
        </g>
      );
    }

    /* Kou: vaatjes trekken samen en zetten daarna weer uit. Dat is de prikkel. */
    case "kou": {
      /* De vaatjes horen binnen het bereik van dit apparaat te liggen, niet op een
         vaste hoogte die er toevallig onder valt. Drie rijen, netjes verdeeld over
         wat CooLifting daadwerkelijk raakt. */
      const rijen = [0.3, 0.55, 0.8].map(
        (f) => OPPERVLAK + (bodem - OPPERVLAK) * f,
      );
      /* Bij dit apparaat gebeurt het werk al in stap 1: de kou raakt de huid en de
         vaatjes trekken samen. Daarna zetten ze uit, en dat uitzetten ís de prikkel. */
      const wijdte = stap === 0 ? 2 : stap === 1 ? 8 : 6;
      return (
        <>
          {/* De koudestraal boven de huid: een waaier die naar beneden breder wordt.
              Gevulde driehoekjes en geen streepjes, want streepjes lezen als regen. */}
          <g
            style={{
              opacity: stap === 0 ? 1 : 0,
              transition: soepel(400),
            }}
          >
            {[-2, -1, 0, 1, 2].map((n) => (
              <path
                key={n}
                d={`M${135 + n * 5 - 2} 4 L${135 + n * 5 + 2} 4 L${135 + n * 24 + 5} ${OPPERVLAK - 3} L${135 + n * 24 - 5} ${OPPERVLAK - 3} Z`}
                fill="var(--g-300)"
              />
            ))}
          </g>
          <g clipPath={knip}>
            {/* De rijp op het oppervlak. */}
            <rect
              x="0"
              y={OPPERVLAK}
              width="270"
              height={bodem - OPPERVLAK}
              fill="white"
              style={{
                opacity: stap === 0 ? 0.5 : 0,
                transition: soepel(500),
              }}
            />
            {/* Samentrekken en weer uitzetten: de dikte van de lijn ís het verhaal. */}
            {rijen.map((y, r) => (
              <path
                key={y}
                d={`M-10 ${y} q40 -9 76 0 t76 0 t76 0 t76 0`}
                fill="none"
                stroke="var(--g-900)"
                strokeLinecap="round"
                strokeWidth={wijdte}
                opacity={stap === 2 ? 0.8 : 0.55}
                style={{ transition: soepel(650, r * 90) }}
              />
            ))}
          </g>
        </>
      );
    }

    /* Injectie: meerdere naaldjes op vaste diepte, en depots die zich verspreiden.
     *
     * Er stond één naald in het midden met drie depots eronder, en die twee hoorden
     * zichtbaar niet bij elkaar: één prik die op drie plekken tegelijk iets achterlaat.
     * De U225 zet er in werkelijkheid honderden per minuut. Nu staat er boven elk depot
     * een naald, en de naald is een vulling met een punt in plaats van een streep.
     */
    case "injectie": {
      const prikken = [77, 135, 193];
      return (
        <g clipPath={knip}>
          {prikken.map((x, i) => (
            <path
              key={`naald-${x}`}
              d={`M${x - 2.5} ${OPPERVLAK - 8} L${x + 2.5} ${OPPERVLAK - 8} L${x + 2.5} ${bodem - 7} L${x} ${bodem} L${x - 2.5} ${bodem - 7} Z`}
              fill="var(--g-900)"
              style={{
                transformOrigin: `${x}px ${OPPERVLAK}px`,
                transform: `scaleY(${stap === 0 ? 0 : stap === 1 ? 1 : 0})`,
                transition: soepel(450, i * 70),
              }}
            />
          ))}
          {prikken.map((x, i) => (
            <ellipse
              key={`depot-${x}`}
              cx={x}
              cy={bodem - 4}
              rx="34"
              ry="17"
              fill="white"
              style={{
                transform: `scale(${stap === 2 ? 1 : stap === 1 ? 0.35 : 0})`,
                transformOrigin: `${x}px ${bodem - 4}px`,
                opacity: stap === 0 ? 0 : 0.45,
                transition: soepel(800, 120 + i * 120),
              }}
            />
          ))}
        </g>
      );
    }
  }
}
