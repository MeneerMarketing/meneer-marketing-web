"use client";

import { useId, useState } from "react";
import Label from "@/components/ui/Label";
import { KNOPPEN, UITKOMST, VIERDE_KNOP, type Knop } from "@/data/porien";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * Drie knoppen — de uitblinker van de poriënpagina.
 *
 * Aan een porie valt precies één ding niet te veranderen: zijn doorsnede. Die hangt samen
 * met de talgklier eronder en ligt grotendeels vast. Alles wat een kliniek je over
 * "poriën verkleinen" vertelt gaat daaraan voorbij.
 *
 * Dus staat dat argument hier niet in een zin maar in de bediening. Drie schakelaars doen
 * het en veranderen de tekening zichtbaar. De vierde, "porie kleiner maken", doet het
 * niet: je kunt hem indrukken, en dan legt hij uit waarom hij niet bestaat. Wie hem
 * probeert heeft de boodschap zelf ontdekt in plaats van hem voorgelezen gekregen.
 *
 * De clou van de tekening: aan het eind ziet de huid er rustig uit terwijl elke opening
 * nog precies even groot is als aan het begin. Dat is exact wat wij verkopen en wat een
 * ander "kleinere poriën" noemt.
 *
 * Toegankelijkheid: echte knoppen met aria-pressed voor de drie die werken, en
 * aria-disabled (niet disabled) voor de vierde, zodat hij focusbaar blijft en zijn uitleg
 * ook met een toetsenbord te bereiken is.
 *
 * BEELD: schematisch, geen huidtint en geen echte huid (§14).
 */

/** Vaste posities, geen willekeur: anders wijkt de server-render af van de browser. */
const PORIEN = [
  { x: 96, y: 78, r: 14 },
  { x: 176, y: 132, r: 18 },
  { x: 262, y: 66, r: 11 },
  { x: 330, y: 148, r: 20 },
  { x: 118, y: 206, r: 17 },
  { x: 218, y: 244, r: 12 },
  { x: 300, y: 214, r: 15 },
  { x: 392, y: 92, r: 14 },
  { x: 60, y: 148, r: 12 },
  { x: 396, y: 256, r: 18 },
  { x: 154, y: 44, r: 9 },
  { x: 348, y: 34, r: 11 },
  { x: 254, y: 154, r: 21 },
  { x: 78, y: 268, r: 11 },
  { x: 462, y: 168, r: 15 },
  { x: 448, y: 40, r: 9 },
  { x: 470, y: 268, r: 12 },
  { x: 30, y: 216, r: 9 },
  { x: 200, y: 96, r: 8 },
  { x: 372, y: 196, r: 9 },
  { x: 142, y: 168, r: 8 },
  { x: 288, y: 116, r: 8 },
  { x: 430, y: 216, r: 8 },
  { x: 244, y: 200, r: 7 },
  { x: 108, y: 118, r: 7 },
  { x: 496, y: 116, r: 10 },
] as const;

type Aan = Record<Knop["id"], boolean>;

export default function DrieKnoppen() {
  const [aan, setAan] = useState<Aan>({
    inhoud: false,
    spanning: false,
    talg: false,
  });
  const [uitlegOpen, setUitlegOpen] = useState(false);
  const uid = useId().replace(/:/g, "");
  const uitlegId = `${uid}-vierde`;

  const telAan = Object.values(aan).filter(Boolean).length;
  const uitkomst = UITKOMST[telAan];

  /* De drie knoppen sturen elk één eigenschap van de tekening aan:
     inhoud   = de donkere prop in de opening
     spanning = rond of uitgerekt tot een druppel
     talg     = de glans op het oppervlak, en dus de schaduw langs de rand */
  const propZichtbaar = !aan.inhoud;
  const uitgerekt = !aan.spanning;
  const glans = !aan.talg;

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── De tekening ──
          Blijft op groot scherm staan terwijl je verderop schakelt, want anders schuift
          hij uit beeld op het moment dat je een knop omzet.

          Op mobiel juist niet: daar nam hij plakkend 311px van een scherm van 664px in
          beslag, en samen met de cookiebalk bleef er nog geen derde over om in te werken.
          Daar scrol je liever even terug. */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-5 sm:p-7 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[var(--r-sm)]">
          <svg
            viewBox="0 0 520 300"
            className="block w-full"
            role="img"
            aria-label={`Schematisch stuk huid met poriën. ${uitkomst.kop}.`}
          >
            <defs>
              {/* De glans is een lichtbaan die schuin over de huid valt, geen witte
                  waas: anders verandert het hele vlak van kleur in plaats van dat er
                  licht op valt. */}
              <linearGradient id={`${uid}-glans`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="38%" stopColor="white" stopOpacity="0.75" />
                <stop offset="62%" stopColor="white" stopOpacity="0.75" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              {/* Het fijne ruitpatroon van de huid zelf, ver op de achtergrond. */}
              <pattern
                id={`${uid}-korrel`}
                width="14"
                height="14"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 0 L14 14 M14 0 L0 14"
                  stroke="var(--g-100)"
                  strokeWidth="0.8"
                  fill="none"
                />
              </pattern>
            </defs>

            <rect width="520" height="300" fill="var(--g-050)" />
            <rect
              width="520"
              height="300"
              fill={`url(#${uid}-korrel)`}
              opacity="0.7"
            />

            <rect
              width="520"
              height="300"
              fill={`url(#${uid}-glans)`}
              className="transition-opacity duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
              opacity={glans ? 1 : 0}
            />

            {PORIEN.map((p) => {
              // Uitgerekt: dezelfde opening zakt uit tot een druppel. De oppervlakte
              // blijft gelijk, alleen de vorm verandert. Dat is het hele punt.
              const rx = uitgerekt ? p.r * 0.82 : p.r;
              const ry = uitgerekt ? p.r * 1.34 : p.r;
              return (
                <g key={`${p.x}-${p.y}`}>
                  {/* Schaduw langs de onderrand: alleen zichtbaar met glans erop. */}
                  <ellipse
                    cx={p.x}
                    cy={p.y + 1.5}
                    rx={rx}
                    ry={ry}
                    fill="var(--t-muted)"
                    className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
                    opacity={glans ? 0.22 : 0}
                  />
                  {/* De opening zelf. Deze verandert nooit van oppervlak. */}
                  <ellipse
                    cx={p.x}
                    cy={p.y}
                    rx={rx}
                    ry={ry}
                    fill="var(--g-100)"
                    stroke="var(--g-200)"
                    strokeWidth="1"
                    className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
                  />
                  {/* De prop erin: de donkere kern die de porie groter laat lijken. */}
                  <ellipse
                    cx={p.x}
                    cy={uitgerekt ? p.y + ry * 0.22 : p.y}
                    rx={rx * 0.55}
                    ry={ry * 0.55}
                    fill="var(--t-strong)"
                    className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
                    opacity={propZichtbaar ? 0.55 : 0}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <p className="mt-5 text-sm leading-6 text-[var(--t-muted)]">
          Let op wat er níet gebeurt: geen enkele opening wordt kleiner. Ze zijn
          in elke stand precies even groot.
        </p>
      </div>

      {/* ── De bediening ── */}
      <div>
        <Label>Wat je wel kunt veranderen</Label>

        <ul className="mt-5 space-y-3">
          {KNOPPEN.map((k) => {
            const isAan = aan[k.id];
            return (
              <li key={k.id}>
                <button
                  type="button"
                  aria-pressed={isAan}
                  onClick={() => setAan((v) => ({ ...v, [k.id]: !v[k.id] }))}
                  className={`w-full rounded-[var(--r-sm)] border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    isAan
                      ? "border-[var(--g-300)] bg-[var(--g-050)]"
                      : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="diba-card-title">{k.label}</span>
                    {/* Een echte schakelaar, want dat maakt de vierde pas grappig. */}
                    <span
                      aria-hidden="true"
                      className={`relative h-7 w-12 shrink-0 rounded-[var(--r-pill)] transition-colors duration-300 motion-reduce:transition-none ${
                        isAan ? "bg-[var(--g-700)]" : "bg-[var(--g-100)]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-[var(--r-pill)] bg-white transition-all duration-300 motion-reduce:transition-none ${
                          isAan ? "left-6" : "left-1"
                        }`}
                      />
                    </span>
                  </span>
                  <span className="mt-2 block text-[15px] leading-7 text-[var(--t-body)]">
                    {isAan ? k.aanTekst : k.uitTekst}
                  </span>
                  {isAan ? (
                    <span className="mt-2 block text-sm leading-6 text-[var(--t-muted)]">
                      {publicCopy(k.hoe)}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── De vierde ──
            Bewust géén aria-disabled: de knop doet wél iets, hij legt alleen niet uit
            wat zijn opschrift belooft. Uitgeschakeld melden zou schermlezers vertellen
            dat er niets te halen valt, terwijl juist híer de pointe zit. Hij ziet er
            inert uit, hij is het niet. */}
        <div className="mt-3">
          <button
            type="button"
            aria-expanded={uitlegOpen}
            aria-controls={uitlegId}
            aria-label={`${VIERDE_KNOP.label}. Deze schakelaar doet het niet. Lees waarom.`}
            onClick={() => setUitlegOpen(true)}
            className="w-full cursor-help rounded-[var(--r-sm)] border border-dashed border-[var(--g-200)] p-5 text-left transition-colors hover:border-[var(--g-300)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            <span className="flex items-center justify-between gap-4">
              <span className="diba-card-title text-[var(--t-muted)]">
                {VIERDE_KNOP.label}
              </span>
              <span
                aria-hidden="true"
                className="relative flex h-7 w-12 shrink-0 items-center justify-end rounded-[var(--r-pill)] bg-[var(--g-050)] pr-1.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[var(--t-muted)]"
                  fill="none"
                >
                  <path
                    d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
            <span className="mt-2 block text-[15px] leading-7 text-[var(--t-muted)]">
              Deze schakelaar doet het niet. Druk erop als je wilt weten waarom.
            </span>
          </button>

          <div id={uitlegId} aria-live="polite">
            {uitlegOpen ? (
              <p className="mt-3 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(VIERDE_KNOP.waarom)}
              </p>
            ) : null}
          </div>
        </div>

        {/* ── De uitkomst ── */}
        <div
          className="mt-8 pt-6"
          aria-live="polite"
        >
          <Label>{`${telAan} van 3 aangepakt`}</Label>
          <h3 className="diba-card-title-lg mt-3">{uitkomst.kop}</h3>
          <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
            {uitkomst.tekst}
          </p>
        </div>
      </div>
    </div>
  );
}
