"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DOELWITTEN, type Apparaat } from "@/data/apparatuur";
import { HUIDLAGEN, LAAGAANDEEL } from "@/data/behandelingen";
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

/** Waar de huid begint in de tekening, en waar de diepste lederhuid ophoudt. */
const OPPERVLAK = 88;
const BODEM = 300;

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

/** De diepte uit de data (procenten) omgerekend naar een y in de tekening. */
function diepteY(procent: number): number {
  return OPPERVLAK + ((BODEM - OPPERVLAK) * procent) / 100;
}

/** Golvende scheidingslijn, zodat een huid geen gestapelde balken wordt. */
function golf(y: number, amplitude = 3): string {
  return `M0 ${y} C 45 ${y - amplitude}, 90 ${y + amplitude}, 135 ${y} S 225 ${y - amplitude}, 270 ${y}`;
}

type Props = {
  readonly apparaat: Apparaat;
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
      className="grid gap-8 rounded-[var(--r-lg)] bg-white p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:p-10"
    >
      {/* ── De doorsnede ── */}
      <div>
        <svg
          viewBox="0 0 420 300"
          className="w-full"
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
            <linearGradient id={`straal-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="60%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            {/* De diepte waar de energie wordt opgenomen. Dat is de hele pointe van
                laserlicht: één ding neemt het op, de rest niet. */}
            <linearGradient id={`opneem-${uid}`} x1="0" y1="0" x2="0" y2="1">
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
              const binnenBereik = boven < bodem;
              const tinten = ["--g-100", "--g-200", "--g-300", "--g-500"];
              return (
                <g key={HUIDLAGEN[i].id}>
                  <rect
                    x="0"
                    y={boven}
                    width="270"
                    height={onder - boven}
                    fill={`var(${tinten[i]})`}
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
                      transition: beweegt ? "opacity 500ms ease" : undefined,
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

          {/* De diepte die dit apparaat haalt. */}
          <g
            style={{
              transform: `translateY(${stap === 0 ? -14 : 0}px)`,
              opacity: stap === 0 ? 0 : 1,
              transition: beweegt
                ? "transform 700ms ease, opacity 500ms ease"
                : undefined,
            }}
          >
            <line
              x1="0"
              y1={bodem}
              x2="270"
              y2={bodem}
              stroke="var(--g-900)"
              strokeWidth="2"
              strokeDasharray="7 6"
            />
            <circle cx="264" cy={bodem} r="4" fill="var(--g-900)" />
          </g>

          <Mechaniek
            apparaat={apparaat}
            stap={stap}
            bodem={bodem}
            beweegt={beweegt}
            uid={uid}
          />

          {/* De laagnamen naast de tekening; wat buiten bereik ligt vervaagt. */}
          <g>
            {LAAGGRENZEN.map((onder, i) => {
              const boven = i === 0 ? OPPERVLAK : LAAGGRENZEN[i - 1];
              const binnenBereik = boven < bodem;
              return (
                <g
                  key={HUIDLAGEN[i].id}
                  style={{
                    opacity: binnenBereik ? 1 : 0.4,
                    transition: beweegt ? "opacity 500ms ease" : undefined,
                  }}
                >
                  <line
                    x1="270"
                    y1={(boven + onder) / 2}
                    x2="286"
                    y2={(boven + onder) / 2}
                    stroke="var(--g-300)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="292"
                    y={(boven + onder) / 2 + 4}
                    fontSize="12.5"
                    fill={binnenBereik ? "var(--t-strong)" : "var(--t-muted)"}
                    fontWeight={binnenBereik ? 600 : 400}
                  >
                    {HUIDLAGEN[i].naam}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* [MEDISCHE-CHECK-ROJDA]: de dieptes en de fasen per apparaat. De vlag hoort in
            dit commentaar en niet in de zin eronder, want die zin lezen bezoekers wel. */}
        <p className="mt-4 text-[13px] leading-6 text-[var(--t-muted)]">
          Schematisch. De verhoudingen kloppen niet op de millimeter en de
          diepte hangt af van de instelling.
        </p>
      </div>

      {/* ── De stappen ── */}
      <div className="flex flex-col">
        <p className="diba-label text-[var(--t-label)]">Wat er gebeurt</p>

        <ol className="mt-5 space-y-2">
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
  readonly apparaat: Apparaat;
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
          <Handstuk stap={stap} beweegt={beweegt} />
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
          <Handstuk stap={stap} beweegt={beweegt} />
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
          <Handstuk stap={stap} beweegt={beweegt} />
          <g clipPath={knip}>
            {naalden.map((x, i) => (
              <line
                key={x}
                x1={x}
                y1={OPPERVLAK - 2}
                x2={x}
                y2={bodem}
                stroke="var(--g-900)"
                strokeWidth="2"
                strokeLinecap="round"
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
          <Handstuk stap={stap} beweegt={beweegt} smal />
        </>
      );
    }

    /* Zuiging: een mondstuk dat over de huid gaat en de poriën leegtrekt. */
    case "zuiging": {
      const porien = [52, 104, 158, 212];
      return (
        <>
          <g
            style={{
              transform: `translateX(${stap === 0 ? -70 : stap === 1 ? 0 : 70}px)`,
              transition: soepel(1100),
            }}
          >
            <Handstuk stap={stap === 0 ? 0 : 1} beweegt={beweegt} smal />
          </g>
          <g clipPath={knip}>
            {porien.map((x) => (
              <path
                key={x}
                d={`M${x - 7} ${OPPERVLAK} q7 22 0 34 q-7 -12 0 -34Z`}
                fill="var(--g-900)"
                style={{
                  opacity: stap === 2 ? 0.18 : 0.6,
                  transition: soepel(600),
                }}
              />
            ))}
          </g>
          {/* Wat eruit komt gaat omhoog en verlaat de huid. Dus buiten de knipvorm,
              anders verdwijnt het precies op het moment dat het weggezogen wordt. */}
          {porien.map((x, i) => (
            <circle
              key={`weg-${x}`}
              cx={x}
              cy={OPPERVLAK + 20}
              r="5"
              fill="var(--g-700)"
              style={{
                transform:
                  stap === 0
                    ? "none"
                    : `translateY(-${stap === 1 ? 30 : 52}px)`,
                opacity: stap === 0 ? 0.85 : stap === 1 ? 0.75 : 0,
                transition: soepel(800, i * 100),
              }}
            />
          ))}
        </>
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
         vaatjes trekken samen. Daarna zetten ze uit, en dat uitzetten ís de prikkel.
         Vandaar dat het handstuk hier meteen op zijn plek staat en niet eerst zweeft,
         anders spreken de tekening en de tekst elkaar tegen. */
      const wijdte = stap === 0 ? 2 : stap === 1 ? 8 : 6;
      return (
        <>
          <Handstuk stap={1} beweegt={beweegt} smal />
          {/* De koudestraal zelf, boven de huid. Daar is de achtergrond wit, dus
              donker is hier het enige wat leesbaar is. */}
          <g
            style={{
              opacity: stap === 0 ? 1 : 0,
              transition: soepel(400),
            }}
          >
            {[-2, -1, 0, 1, 2].map((n) => (
              <line
                key={n}
                x1={135 + n * 7}
                y1="70"
                x2={135 + n * 26}
                y2={OPPERVLAK - 4}
                stroke="var(--g-600)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.7"
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

    /* Injectie: één naald op vaste diepte, en een bloem die zich verspreidt. */
    case "injectie": {
      return (
        <>
          <Handstuk stap={stap} beweegt={beweegt} smal />
          <g clipPath={knip}>
            <line
              x1="135"
              y1={OPPERVLAK - 6}
              x2="135"
              y2={bodem}
              stroke="var(--g-900)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transformOrigin: `135px ${OPPERVLAK}px`,
                transform: `scaleY(${stap === 0 ? 0 : stap === 1 ? 1 : 0})`,
                transition: soepel(450),
              }}
            />
            {[0, 1, 2].map((i) => (
              <ellipse
                key={i}
                cx={135 + (i - 1) * 58}
                cy={bodem - 4}
                rx="34"
                ry="17"
                fill="white"
                style={{
                  transform: `scale(${stap === 2 ? 1 : stap === 1 ? 0.35 : 0})`,
                  transformOrigin: `${135 + (i - 1) * 58}px ${bodem - 4}px`,
                  opacity: stap === 0 ? 0 : 0.45,
                  transition: soepel(800, 120 + Math.abs(i - 1) * 160),
                }}
              />
            ))}
          </g>
        </>
      );
    }
  }
}

/**
 * Het handstuk boven de huid.
 *
 * Een liggende kop, geen rechtopstaand voorwerp: dat laatste leest als een schaakstuk en
 * niet als iets wat over een huid gaat. De vorm is abstract met opzet, want een tekening
 * die op een productfoto wil lijken verliest het altijd van de productfoto zelf.
 *
 * In de eerste stap zweeft hij een stukje hoger. Dat verschil is het hele verhaal van
 * stap 1: er gaat iets aan vooraf, er raakt nog niets je huid.
 */
function Handstuk({
  stap,
  beweegt,
  smal = false,
}: {
  readonly stap: number;
  readonly beweegt: boolean;
  readonly smal?: boolean;
}) {
  const breedte = smal ? 52 : 176;
  const links = 135 - breedte / 2;
  return (
    <g
      style={{
        transform: `translateY(${stap === 0 ? -20 : 0}px)`,
        transition: beweegt
          ? "transform 700ms cubic-bezier(.22,.61,.36,1)"
          : undefined,
      }}
    >
      {/* De kabel: één lijn is genoeg om er gereedschap van te maken. */}
      <path
        d={`M135 6 C 135 20, ${links + breedte - 14} 16, ${links + breedte - 14} 30`}
        fill="none"
        stroke="var(--g-200)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect
        x={links}
        y="28"
        width={breedte}
        height="30"
        rx="13"
        fill="var(--g-700)"
      />
      {/* De kop die het werk doet, lichter zodat je ziet waar het uit komt. */}
      <rect
        x={links + 10}
        y="54"
        width={breedte - 20}
        height="14"
        rx="6"
        fill="var(--g-500)"
      />
    </g>
  );
}
