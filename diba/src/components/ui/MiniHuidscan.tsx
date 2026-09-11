"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import {
  FITZPATRICK_TYPES,
  SCAN_ASSEN,
  type AsId,
  type DoelId,
} from "@/data/huidprofiel";
import { bewaarScan } from "@/lib/huidprofiel-opslag";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icon";
import { useReducedMotion } from "@/lib/use-reduced-motion";

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
 * Dat gat is de hele boodschap. Het maakt de stap naar de huidanalyse vanzelfsprekend
 * in plaats van opdringerig, en het houdt zich aan A7: geen belofte zonder cijfer.
 *
 * Geen dependencies: SVG + CSS-transities. Respecteert prefers-reduced-motion (§9).
 */

/**
 * De assen staan sinds deze ronde in `data/huidprofiel.ts` en niet meer hier. Reden: de
 * uitkomst van deze scan ís voortaan het huidprofiel van de bezoeker, en dat profiel wordt
 * ook getoond in het uitklapje rechtsonder en op de behandelingenpagina. Eén bron dus,
 * anders lopen die drie plekken binnen een maand uit elkaar.
 */
const ASSEN = SCAN_ASSEN;

type Gewichten = Partial<Record<AsId, number>>;

type Optie = {
  readonly label: string;
  readonly gewichten: Gewichten;
  /** Alleen bij vraag 1: bepaalt waar de vervolgstap heen wijst. */
  readonly onderwerp?: string;
  readonly pillar?: string;
  /** Alleen bij vraag 1: het doel in het huidprofiel waar dit antwoord op uitkomt. */
  readonly doel?: DoelId;
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
    toelichting:
      "Kies wat het dichtst in de buurt komt. Er is geen fout antwoord.",
    opties: [
      {
        label: "Puistjes of onzuiverheden",
        gewichten: { porien: 40, textuur: 20, roodheid: 12 },
        onderwerp: "acne",
        doel: "textuur",
        pillar: "acne",
        kort: "acne",
      },
      {
        label: "Vlekken of een ongelijke kleur",
        gewichten: { pigment: 45, uv: 22 },
        onderwerp: "pigment",
        doel: "kleur",
        pillar: "pigmentvlekken",
        kort: "pigment",
      },
      {
        label: "Roodheid of snel geïrriteerd",
        gewichten: { roodheid: 45, hydratatie: 16 },
        onderwerp: "roodheid",
        doel: "roodheid",
        pillar: "rosacea",
        kort: "roodheid",
      },
      {
        label: "Littekens of oneffen structuur",
        gewichten: { textuur: 45, porien: 18 },
        onderwerp: "littekens",
        doel: "textuur",
        pillar: "littekens",
        kort: "littekens",
      },
      {
        label: "Lijntjes of verslapping",
        gewichten: { textuur: 30, uv: 22, hydratatie: 14 },
        onderwerp: "veroudering",
        doel: "lijntjes",
        pillar: "huidveroudering",
        kort: "huidveroudering",
      },
      {
        label: "Droogheid of een doffe huid",
        gewichten: { hydratatie: 45, textuur: 14 },
        onderwerp: "droogheid",
        doel: "onbekend",
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
      {
        label: "Vettig, vooral in de T-zone",
        gewichten: { porien: 28, textuur: 10 },
      },
      {
        label: "Wisselend per zone",
        gewichten: { hydratatie: 15, porien: 15 },
      },
      {
        label: "Snel geïrriteerd",
        gewichten: { roodheid: 30, hydratatie: 14 },
      },
    ],
  },
  {
    id: "huidtype",
    vraag: "Hoe reageert je huid op de zon?",
    toelichting:
      "Dit bepaalt mee welke instellingen veilig zijn. Alle huidtypes zijn hier gelijk.",
    opties: [
      {
        label: "Verbrandt altijd, wordt nooit bruin",
        gewichten: { uv: 36, pigment: 8 },
        tint: "#f3ddcf",
      },
      {
        label: "Verbrandt snel, wordt licht bruin",
        gewichten: { uv: 30, pigment: 10 },
        tint: "#e8c4a6",
      },
      {
        label: "Verbrandt soms, wordt daarna bruin",
        gewichten: { uv: 23, pigment: 13 },
        tint: "#d1a077",
      },
      {
        label: "Verbrandt zelden, wordt snel bruin",
        gewichten: { uv: 16, pigment: 16 },
        tint: "#a9714a",
      },
      {
        label: "Verbrandt bijna nooit",
        gewichten: { uv: 11, pigment: 19 },
        tint: "#71432a",
      },
      {
        label: "Verbrandt niet",
        gewichten: { uv: 8, pigment: 21 },
        tint: "#3d2318",
      },
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
type Fase = "intro" | "vragen" | "scannen" | "resultaat";

export default function MiniHuidscan() {
  const reduced = useReducedMotion();
  const titelId = useId();
  const [fase, setFase] = useState<Fase>("intro");
  const [stap, setStap] = useState(0);
  const [keuzes, setKeuzes] = useState<(number | null)[]>(() =>
    VRAGEN.map(() => null),
  );
  const statusRef = useRef<HTMLParagraphElement>(null);

  const profiel = useMemo(() => {
    const waarden = Object.fromEntries(
      ASSEN.map((a) => [a.id, BASIS]),
    ) as Record<AsId, number>;
    keuzes.forEach((keuze, vi) => {
      if (keuze === null) return;
      const optie = VRAGEN[vi].opties[keuze];
      for (const [as, gewicht] of Object.entries(optie.gewichten)) {
        waarden[as as AsId] = Math.min(
          MAX,
          waarden[as as AsId] + (gewicht ?? 0),
        );
      }
    });
    return waarden;
  }, [keuzes]);

  const gekozenFocus = keuzes[0] !== null ? VRAGEN[0].opties[keuzes[0]] : null;

  const aandachtspunten = useMemo(
    () => [...ASSEN].sort((a, b) => profiel[b.id] - profiel[a.id]).slice(0, 2),
    [profiel],
  );

  /**
   * Het resultaat is het huidprofiel. Vanaf hier onthoudt de site het, ook als je van deze
   * pagina wegklikt: het uitklapje rechtsonder toont het terug en de behandelingenpagina
   * rekent ermee. Bewaren gebeurt één keer, bij het bereiken van de resultaatfase, en niet
   * bij elke muisbeweging erna.
   */
  useEffect(() => {
    if (fase !== "resultaat") return;
    const zon = keuzes[2];
    bewaarScan(
      {
        assen: profiel,
        focusLabel: gekozenFocus?.label ?? "",
        pillar: gekozenFocus?.pillar ?? null,
        kort: gekozenFocus?.kort ?? null,
        op: new Date().toISOString(),
      },
      {
        doel: gekozenFocus?.doel,
        huidtype: zon !== null ? (FITZPATRICK_TYPES[zon]?.id ?? null) : null,
      },
    );
    // Alleen op het moment dat de fase omslaat; de rest verandert daarna niet meer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  // Scanfase: korte opbouw, daarna het resultaat onthullen.
  useEffect(() => {
    if (fase !== "scannen") return;
    const duur = reduced ? 0 : 1500;
    const t = window.setTimeout(() => setFase("resultaat"), duur);
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
    setFase("vragen");
  }

  const voortgang =
    fase === "resultaat" || fase === "scannen"
      ? 1
      : fase === "intro"
        ? 0
        : stap / VRAGEN.length;

  return (
    <div className="relative overflow-hidden rounded-[var(--r-lg)] bg-white p-5 text-[var(--t-strong)] shadow-[0_20px_60px_rgba(67,79,58,.18)] sm:p-7">
      {/* Kop van de kaart */}
      <div className="flex items-center justify-between gap-4">
        <span className="diba-label diba-pill-active rounded-[var(--r-pill)] px-3 py-1.5">
          EVE-M
        </span>
        <span className="diba-label text-[var(--t-muted)]">
          {fase === "resultaat" ? "Jouw profielschets" : "Mini-scan, 4 vragen"}
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

        {fase === "scannen" ? <Scannen /> : null}

        {fase === "resultaat" ? (
          <Resultaat
            profiel={profiel}
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
    <div>
      <h3 id={titelId} className="diba-card-title">
        Doe de mini-scan
      </h3>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-7 text-[var(--t-body)]">
        Weet je nog niet waar te beginnen? Vier vragen, dertig seconden. Je
        krijgt een profielschets op basis van wat je zelf aangeeft. Een meting
        doen we in de kliniek; dit is een eerste indruk.
      </p>
      {/* Op /huidprofiel staat deze kaart in een smalle kolom; daar is 191 pixels voor de
          knop en "START DE MINI-SCAN" heeft er 208 nodig. */}
      <Button onClick={onStart} className="mt-6" kort="Start de scan">
        Start de mini-scan
      </Button>
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

      <div
        className="mt-5 grid gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-label={vraag.vraag}
      >
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
                  : "bg-[var(--g-025)] text-[var(--t-strong)] hover:bg-[var(--g-100)]"
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

function Scannen() {
  return (
    <div className="grid place-items-center py-10">
      <p className="diba-label text-[var(--t-muted)]">Profiel opbouwen…</p>
    </div>
  );
}

function Resultaat({
  profiel,
  aandachtspunten,
  focus,
  onOpnieuw,
}: {
  profiel: Record<AsId, number>;
  aandachtspunten: readonly (typeof ASSEN)[number][];
  focus: Optie | null;
  onOpnieuw: () => void;
}) {
  return (
    <div className="grid gap-6">
      {/* Hier stond de radar. Weg (Yasin, 11 september 2026): tweehonderdvijftig pixels
          hoog, en wat je eraan afleest staat hieronder als getal. */}
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
            De huidanalyse met EVE-M legt hydratatie, pigment, poriën en
            structuur objectief vast. Dan pas weten we het echt.
          </p>
        </div>

        {/* De weg naar het volledige profiel.

            Deze schets is vier vragen. Op /huidprofiel staan er meer, en dat profiel is
            wat de behandelpagina's gebruiken om te ordenen. Zonder deze regel eindigt de
            mini-scan doodlopend: hij bewaart wel, maar nodigt nergens toe uit. Als link
            en niet als knop, want er staat al een primaire knop in dit blok. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button
            href={`/intake${focus?.onderwerp ? `?topic=${focus.onderwerp}` : ""}`}
          >
            Plan een huidconsult
          </Button>
          <a
            href="/huidprofiel"
            className="diba-label inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
          >
            Vul je profiel verder aan
            <ArrowUpRight size={13} />
          </a>
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

        <p className="mt-3 text-[13px] leading-6 text-[var(--t-muted)]">
          Je schets is bewaard op dit apparaat. Ga je naar de behandelingen, dan
          staat wat bij je profiel past bovenaan.
        </p>

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
