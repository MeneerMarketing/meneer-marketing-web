"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icon";

/**
 * De mini-scan — het interactieve hart van de huidscan-sectie.
 *
 * Het idee erachter is een merkregel, geen effect: **deze tool doet geen meting.**
 * "Wij gokken niet. Wij meten." zou een leugen worden als een vragenlijstje met
 * cijfers terugkomt alsof er iets gemeten is. Dus tekent hij twee lagen:
 *
 *   1. Wat jij vertelt — een ingevulde vorm, jouw profiel.
 *   2. Wat gemeten is — een lege, gestippelde ring met het label "nog niet gemeten".
 *
 * Dat gat is de hele boodschap. Het maakt de stap naar De Nulmeting vanzelfsprekend
 * in plaats van opdringerig, en het houdt zich aan A7: geen belofte zonder cijfer.
 *
 * Geen dependencies: SVG + CSS-transities. Respecteert prefers-reduced-motion (§9).
 */

const ASSEN = [
  { id: "hydratatie", label: "Hydratatie" },
  { id: "pigment", label: "Pigment" },
  { id: "porien", label: "Poriën" },
  { id: "roodheid", label: "Roodheid" },
  { id: "textuur", label: "Textuur" },
  { id: "uv", label: "UV-belasting" },
] as const;

type AsId = (typeof ASSEN)[number]["id"];
type Gewichten = Partial<Record<AsId, number>>;

type Optie = {
  readonly label: string;
  readonly gewichten: Gewichten;
  /** Alleen bij vraag 1: bepaalt waar de vervolgstap heen wijst. */
  readonly onderwerp?: string;
  readonly pillar?: string;
  /** Korte naam voor in lopende tekst ("Lees over acne"). */
  readonly kort?: string;
  /** Alleen bij de huidtype-vraag: het staal naast de tekst. */
  readonly tint?: string;
};

type Vraag = {
  readonly id: string;
  readonly vraag: string;
  readonly toelichting?: string;
  readonly opties: readonly Optie[];
};

const VRAGEN: readonly Vraag[] = [
  {
    id: "focus",
    vraag: "Wat valt jou het eerst op aan je huid?",
    toelichting: "Kies wat het dichtst in de buurt komt. Er is geen fout antwoord.",
    opties: [
      {
        label: "Puistjes of onzuiverheden",
        gewichten: { porien: 40, textuur: 20, roodheid: 12 },
        onderwerp: "acne",
        pillar: "acne",
        kort: "acne",
      },
      {
        label: "Vlekken of een ongelijke kleur",
        gewichten: { pigment: 45, uv: 22 },
        onderwerp: "pigment",
        pillar: "pigmentvlekken",
        kort: "pigment",
      },
      {
        label: "Roodheid of snel geïrriteerd",
        gewichten: { roodheid: 45, hydratatie: 16 },
        onderwerp: "roodheid",
        pillar: "rosacea",
        kort: "roodheid",
      },
      {
        label: "Littekens of oneffen structuur",
        gewichten: { textuur: 45, porien: 18 },
        onderwerp: "littekens",
        pillar: "littekens",
        kort: "littekens",
      },
      {
        label: "Lijntjes of verslapping",
        gewichten: { textuur: 30, uv: 22, hydratatie: 14 },
        onderwerp: "veroudering",
        pillar: "huidveroudering",
        kort: "huidveroudering",
      },
      {
        label: "Droogheid of een doffe huid",
        gewichten: { hydratatie: 45, textuur: 14 },
        onderwerp: "droogheid",
        pillar: "droge-huid",
        kort: "een droge huid",
      },
    ],
  },
  {
    id: "gevoel",
    vraag: "Hoe voelt je huid meestal?",
    opties: [
      { label: "Droog of trekkerig", gewichten: { hydratatie: 32 } },
      { label: "Vettig, vooral in de T-zone", gewichten: { porien: 28, textuur: 10 } },
      { label: "Wisselend per zone", gewichten: { hydratatie: 15, porien: 15 } },
      { label: "Snel geïrriteerd", gewichten: { roodheid: 30, hydratatie: 14 } },
    ],
  },
  {
    id: "huidtype",
    vraag: "Hoe reageert je huid op de zon?",
    toelichting:
      "Dit bepaalt mee welke instellingen veilig zijn. Alle huidtypes zijn hier gelijk.",
    opties: [
      { label: "Verbrandt altijd, wordt nooit bruin", gewichten: { uv: 36, pigment: 8 }, tint: "#f3ddcf" },
      { label: "Verbrandt snel, wordt licht bruin", gewichten: { uv: 30, pigment: 10 }, tint: "#e8c4a6" },
      { label: "Verbrandt soms, wordt daarna bruin", gewichten: { uv: 23, pigment: 13 }, tint: "#d1a077" },
      { label: "Verbrandt zelden, wordt snel bruin", gewichten: { uv: 16, pigment: 16 }, tint: "#a9714a" },
      { label: "Verbrandt bijna nooit", gewichten: { uv: 11, pigment: 19 }, tint: "#71432a" },
      { label: "Verbrandt niet", gewichten: { uv: 8, pigment: 21 }, tint: "#3d2318" },
    ],
  },
  {
    id: "duur",
    vraag: "Hoe lang speelt dit al?",
    opties: [
      { label: "Korter dan 3 maanden", gewichten: {} },
      { label: "3 maanden tot een jaar", gewichten: { textuur: 6 } },
      { label: "1 tot 3 jaar", gewichten: { textuur: 11, pigment: 6 } },
      { label: "Langer dan 3 jaar", gewichten: { textuur: 15, pigment: 9 } },
    ],
  },
];

const BASIS = 16;
const MAX = 92;
const CX = 170;
const CY = 170;
const R = 116;

/** Hoek per as: eerste as recht omhoog, dan met de klok mee. */
function punt(index: number, straal: number) {
  const hoek = ((-90 + index * (360 / ASSEN.length)) * Math.PI) / 180;
  return [CX + straal * Math.cos(hoek), CY + straal * Math.sin(hoek)] as const;
}

function veelhoek(straal: number) {
  return ASSEN.map((_, i) => punt(i, straal).join(",")).join(" ");
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * matchMedia is een externe bron, geen afgeleide state — vandaar
 * useSyncExternalStore in plaats van een effect met setState. Op de server is het
 * antwoord altijd false, zodat de opbouw client-side alsnog klopt.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    (herteken) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", herteken);
      return () => mq.removeEventListener("change", herteken);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

type Fase = "intro" | "vragen" | "scannen" | "resultaat";

export default function MiniHuidscan() {
  const reduced = useReducedMotion();
  const titelId = useId();
  const [fase, setFase] = useState<Fase>("intro");
  const [stap, setStap] = useState(0);
  const [keuzes, setKeuzes] = useState<(number | null)[]>(() => VRAGEN.map(() => null));
  const [onthuld, setOnthuld] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const profiel = useMemo(() => {
    const waarden = Object.fromEntries(ASSEN.map((a) => [a.id, BASIS])) as Record<AsId, number>;
    keuzes.forEach((keuze, vi) => {
      if (keuze === null) return;
      const optie = VRAGEN[vi].opties[keuze];
      for (const [as, gewicht] of Object.entries(optie.gewichten)) {
        waarden[as as AsId] = Math.min(MAX, waarden[as as AsId] + (gewicht ?? 0));
      }
    });
    return waarden;
  }, [keuzes]);

  const gekozenFocus = keuzes[0] !== null ? VRAGEN[0].opties[keuzes[0]] : null;

  const aandachtspunten = useMemo(
    () =>
      [...ASSEN].sort((a, b) => profiel[b.id] - profiel[a.id]).slice(0, 2),
    [profiel],
  );

  // Scanfase: korte opbouw, daarna het resultaat onthullen.
  useEffect(() => {
    if (fase !== "scannen") return;
    const duur = reduced ? 0 : 1500;
    const t = window.setTimeout(() => {
      setFase("resultaat");
      setOnthuld(true);
    }, duur);
    return () => window.clearTimeout(t);
  }, [fase, reduced]);

  useEffect(() => {
    if (fase === "vragen" || fase === "resultaat") statusRef.current?.focus();
  }, [fase, stap]);

  function kies(index: number) {
    const nieuw = [...keuzes];
    nieuw[stap] = index;
    setKeuzes(nieuw);
    if (stap < VRAGEN.length - 1) {
      window.setTimeout(() => setStap((s) => s + 1), reduced ? 0 : 180);
    } else {
      window.setTimeout(() => setFase("scannen"), reduced ? 0 : 180);
    }
  }

  function opnieuw() {
    setKeuzes(VRAGEN.map(() => null));
    setStap(0);
    setOnthuld(false);
    setFase("vragen");
  }

  const voortgang =
    fase === "resultaat" || fase === "scannen"
      ? 1
      : fase === "intro"
        ? 0
        : stap / VRAGEN.length;

  return (
    <div className="relative overflow-hidden rounded-[var(--r-lg)] bg-white p-5 text-[var(--t-strong)] shadow-[0_20px_60px_rgba(15,45,28,.18)] sm:p-7">
      {/* Kop van de kaart */}
      <div className="flex items-center justify-between gap-4">
        <span className="diba-label rounded-[var(--r-pill)] bg-[var(--g-700)] px-3 py-1.5 text-white">
          Eve-M
        </span>
        <span className="diba-label text-[var(--t-muted)]">
          {fase === "resultaat" ? "Jouw profielschets" : "Mini-scan · 4 vragen"}
        </span>
      </div>

      {/* De Lijn als voortgang (Addendum A4): één lijn, één punt. */}
      <div className="relative mt-4 h-[1.5px] w-full bg-[var(--g-100)]">
        <div
          className="absolute left-0 top-0 h-full bg-[var(--g-700)] transition-[width] duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
          style={{ width: `${Math.max(voortgang, 0.02) * 100}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-pill)] bg-[var(--g-700)] transition-[left] duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
          style={{ left: `${Math.max(voortgang, 0.02) * 100}%` }}
        />
      </div>

      <p ref={statusRef} tabIndex={-1} className="sr-only" aria-live="polite">
        {fase === "vragen"
          ? `Vraag ${stap + 1} van ${VRAGEN.length}: ${VRAGEN[stap].vraag}`
          : fase === "resultaat"
            ? `Profielschets klaar. Meeste aandacht: ${aandachtspunten.map((a) => a.label).join(" en ")}.`
            : ""}
      </p>

      <div className="mt-5">
        {fase === "intro" ? (
          <Intro onStart={() => setFase("vragen")} titelId={titelId} />
        ) : null}

        {fase === "vragen" ? (
          <Vraagstap
            vraag={VRAGEN[stap]}
            index={stap}
            totaal={VRAGEN.length}
            gekozen={keuzes[stap]}
            onKies={kies}
            onTerug={stap > 0 ? () => setStap((s) => s - 1) : undefined}
          />
        ) : null}

        {fase === "scannen" ? <Scannen reduced={reduced} /> : null}

        {fase === "resultaat" ? (
          <Resultaat
            profiel={profiel}
            onthuld={onthuld}
            aandachtspunten={aandachtspunten}
            focus={gekozenFocus}
            onOpnieuw={opnieuw}
          />
        ) : null}
      </div>
    </div>
  );
}

/* ── Fases ─────────────────────────────────────────────────────────────── */

function Intro({ onStart, titelId }: { onStart: () => void; titelId: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <h3 id={titelId} className="diba-card-title">
          Doe de mini-scan.
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-7 text-[var(--t-body)]">
          Vier vragen, dertig seconden. Je krijgt een profielschets van wat jij ons
          vertelt — geen meting, wel een goed begin.
        </p>
        <Button onClick={onStart} className="mt-6">
          Start de mini-scan
        </Button>
      </div>
      <RadarStil />
    </div>
  );
}

function Vraagstap({
  vraag,
  index,
  totaal,
  gekozen,
  onKies,
  onTerug,
}: {
  vraag: Vraag;
  index: number;
  totaal: number;
  gekozen: number | null;
  onKies: (i: number) => void;
  onTerug?: () => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="diba-label text-[var(--t-muted)]">
          Vraag {index + 1} / {totaal}
        </span>
        {onTerug ? (
          <button
            type="button"
            onClick={onTerug}
            className="diba-label text-[var(--g-700)] underline underline-offset-4"
          >
            Vorige
          </button>
        ) : null}
      </div>

      <h3 className="diba-card-title mt-2">{vraag.vraag}</h3>
      {vraag.toelichting ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--t-body)]">
          {vraag.toelichting}
        </p>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={vraag.vraag}>
        {vraag.opties.map((optie, i) => {
          const actief = gekozen === i;
          return (
            <button
              key={optie.label}
              type="button"
              role="radio"
              aria-checked={actief}
              onClick={() => onKies(i)}
              className={`flex min-h-12 items-center gap-3 rounded-[var(--r-sm)] px-4 py-3 text-left text-[15px] leading-snug transition ${
                actief
                  ? "bg-[var(--g-700)] text-white"
                  : "bg-[var(--g-025)] text-[var(--t-strong)] hover:bg-[var(--g-050)]"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
            >
              {optie.tint ? (
                <span
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 rounded-[var(--r-pill)] ring-1 ring-black/10"
                  style={{ background: optie.tint }}
                />
              ) : null}
              <span>{optie.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Scannen({ reduced }: { reduced: boolean }) {
  return (
    <div className="grid place-items-center py-6">
      <div className="relative">
        <RadarStil scannend={!reduced} />
      </div>
      <p className="diba-label mt-4 text-[var(--t-muted)]">Profiel opbouwen…</p>
    </div>
  );
}

function Resultaat({
  profiel,
  onthuld,
  aandachtspunten,
  focus,
  onOpnieuw,
}: {
  profiel: Record<AsId, number>;
  onthuld: boolean;
  aandachtspunten: readonly (typeof ASSEN)[number][];
  focus: Optie | null;
  onOpnieuw: () => void;
}) {
  return (
    <div className="grid gap-6">
      {/* Bewust onder elkaar: in twee kolommen wordt de radar zo smal dat de
          aslabels over elkaar en buiten het vlak vallen. */}
      <RadarResultaat profiel={profiel} onthuld={onthuld} />

      <div>
        <h3 className="diba-card-title">Waar jouw aandacht naartoe gaat.</h3>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {aandachtspunten.map((as) => (
            <li
              key={as.id}
              className="flex items-center justify-between gap-4 rounded-[var(--r-sm)] bg-[var(--g-025)] px-4 py-3"
            >
              <span className="text-[15px] font-medium">{as.label}</span>
              <span className="diba-label text-[var(--g-700)] tabular-nums">
                {profiel[as.id]}
                <span className="text-[var(--t-muted)]">/100</span>
              </span>
            </li>
          ))}
        </ul>

        {/* De kern van het hele ding: eerlijk zijn over wat dit niet is. */}
        <div className="mt-5 rounded-[var(--r-sm)] border border-[var(--g-100)] bg-white p-4">
          <p className="text-sm leading-6 text-[var(--t-body)]">
            <strong className="font-medium text-[var(--t-strong)]">
              Dit is wat jij ons vertelt, niet wat we gemeten hebben.
            </strong>{" "}
            De Nulmeting met Eve-M legt hydratatie, pigment, poriën en structuur
            objectief vast. Dan pas weten we het echt.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button href={`/intake${focus?.onderwerp ? `?topic=${focus.onderwerp}` : ""}`}>
            Plan De Nulmeting
          </Button>
          {focus?.pillar ? (
            <a
              href={`/huidproblemen/${focus.pillar}`}
              className="diba-label inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
            >
              Lees over {focus.kort ?? focus.label.toLowerCase()}
              <ArrowUpRight size={13} />
            </a>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onOpnieuw}
          className="diba-label mt-4 inline-flex items-center gap-1.5 text-[var(--t-muted)] underline underline-offset-4"
        >
          Opnieuw invullen
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Radar ─────────────────────────────────────────────────────────────── */

const RINGEN = [0.3, 0.55, 0.8, 1];

function RadarGrid() {
  return (
    <g>
      {RINGEN.map((f) => (
        <polygon
          key={f}
          points={veelhoek(R * f)}
          fill="none"
          stroke="var(--g-100)"
          strokeWidth={f === 1 ? 1.2 : 0.8}
        />
      ))}
      {ASSEN.map((as, i) => {
        const [x, y] = punt(i, R);
        return (
          <line key={as.id} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--g-100)" strokeWidth="0.8" />
        );
      })}
    </g>
  );
}

/** Rustige staat: alleen het raster, met een zachte sweep tijdens het scannen. */
function RadarStil({ scannend = false }: { scannend?: boolean }) {
  return (
    <svg viewBox="0 0 340 340" className="h-[220px] w-[220px] sm:h-[250px] sm:w-[250px]" aria-hidden="true">
      <RadarGrid />
      {scannend ? (
        <g className="diba-scan-sweep" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <line x1={CX} y1={CY} x2={CX} y2={CY - R} stroke="var(--g-400)" strokeWidth="1.5" />
          <circle cx={CX} cy={CY - R} r="4" fill="var(--g-700)" />
        </g>
      ) : null}
      <circle cx={CX} cy={CY} r="4" fill="var(--g-700)" />
    </svg>
  );
}

function RadarResultaat({
  profiel,
  onthuld,
}: {
  profiel: Record<AsId, number>;
  onthuld: boolean;
}) {
  const vorm = ASSEN.map((as, i) => punt(i, (R * (onthuld ? profiel[as.id] : 0)) / 100).join(","))
    .join(" ");

  return (
    <figure className="m-0">
      {/* De viewBox is breder dan de radar zelf: de aslabels staan buiten de zeshoek
          en hebben links en rechts ruimte nodig, anders kapt de rand ze af. */}
      <svg
        viewBox="-52 -12 444 364"
        className="mx-auto w-full max-w-[420px]"
        role="img"
        aria-label="Radar met jouw profielschets op zes assen"
      >
        <RadarGrid />

        {/* De buitenring is bewust leeg: dat is de meting die nog niet bestaat. */}
        <polygon
          points={veelhoek(R)}
          fill="none"
          stroke="var(--g-300)"
          strokeWidth="1.2"
          strokeDasharray="3 6"
        />

        <polygon
          points={vorm}
          fill="var(--g-400)"
          fillOpacity="0.22"
          stroke="var(--g-700)"
          strokeWidth="2"
          strokeLinejoin="round"
          className="transition-all duration-700 ease-[var(--ease-diba)] motion-reduce:transition-none"
        />

        {ASSEN.map((as, i) => {
          const [x, y] = punt(i, (R * (onthuld ? profiel[as.id] : 0)) / 100);
          return (
            <circle
              key={as.id}
              cx={x}
              cy={y}
              r="3.5"
              fill="var(--g-700)"
              className="transition-all duration-700 ease-[var(--ease-diba)] motion-reduce:transition-none"
            />
          );
        })}

        {ASSEN.map((as, i) => {
          const [x, y] = punt(i, R + 22);
          return (
            <text
              key={as.id}
              x={x}
              y={y}
              textAnchor={x < CX - 5 ? "end" : x > CX + 5 ? "start" : "middle"}
              dominantBaseline="middle"
              className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.08em]"
            >
              {as.label}
            </text>
          );
        })}
      </svg>
      <figcaption className="diba-label mt-1 text-center text-[var(--t-muted)]">
        Gestippeld = nog niet gemeten
      </figcaption>
    </figure>
  );
}
