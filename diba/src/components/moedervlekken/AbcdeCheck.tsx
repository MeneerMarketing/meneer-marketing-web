"use client";

import { useId, useState } from "react";
import Label from "@/components/ui/Label";
import {
  ABCDE,
  LELIJK_EENDJE,
  UITKOMST_GEEN,
  UITKOMST_WEL,
  type Criterium,
} from "@/data/moedervlekken";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De ABCDE-check — de uitblinker van de moedervlekkenpagina, en de enige op de site
 * waarvan élke uitkomst buiten de kliniek eindigt.
 *
 * Dit is voorlichting, geen diagnose. Daarom is hij expres zo gebouwd dat hij nooit
 * geruststelt: er bestaat geen antwoordcombinatie die "het is niets" oplevert, en er staat
 * op geen enkel punt een knop naar onze intake. Bij nul opvallende punten is de uitkomst
 * dat een zelfcheck geen arts vervangt; bij één of meer is het de huisarts.
 *
 * Waarom de vorm anders is dan de spiegeltest op de kringenpagina: daar leidt een
 * beslisboom naar één van drie uitkomsten, hier tellen zes losse punten die allemaal even
 * zwaar naar dezelfde deur wijzen. Je ziet daarom je hele lijst tegelijk in beeld staan,
 * met per punt de twee tekeningen naast elkaar.
 *
 * BEELD: abstracte vlekvormen, geen huid en geen foto's van laesies (§14). Ze illustreren
 * het verschil tussen de twee antwoorden en zijn nadrukkelijk geen vergelijkingsmateriaal.
 */

type Keuze = "rustig" | "opvallend";
type Antwoorden = Record<string, Keuze>;

const PUNTEN: readonly (Criterium | typeof LELIJK_EENDJE)[] = [
  ...ABCDE,
  LELIJK_EENDJE,
];

function sleutel(p: (typeof PUNTEN)[number]) {
  return "letter" in p ? p.letter : "eend";
}

/** Een rafelige rand: afwisselend ver en dichtbij het midden, dus zichtbaar gekarteld. */
const GEKARTELD = Array.from({ length: 18 }, (_, i) => {
  const hoek = (i / 18) * Math.PI * 2;
  const straal = i % 2 === 0 ? 26 : 17;
  return `${(40 + straal * Math.cos(hoek)).toFixed(1)},${(40 + straal * Math.sin(hoek)).toFixed(1)}`;
}).join(" ");

/**
 * Twee abstracte vormen per punt: links rustig, rechts wat opvalt.
 *
 * De vórm draagt het verschil, niet de kleur. Alleen bij C mag kleur het werk doen, want
 * dat punt gáát over kleur. Zou je de opvallende variant overal oker maken, dan leert de
 * tekening je "oker is fout" in plaats van waar je op moet letten.
 */
function Vorm({
  punt,
  variant,
  uid,
}: {
  punt: string;
  variant: Keuze;
  uid: string;
}) {
  const opvallend = variant === "opvallend";
  const vulling = "var(--t-strong)";
  const dekking = 0.45;
  const knipId = `${uid}-knip-${punt}-${variant}`;

  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0" aria-hidden="true">
      {/* A — symmetrie. Rechts duidelijk scheef, met de vouwlijn erbij. */}
      {punt === "A" ? (
        <>
          <path
            /* Twee halve bogen met een andere straal aan weerszijden van de vouwlijn:
               smal links, breed rechts. Zo is de asymmetrie niet subtiel maar de hele
               vorm, en dat is precies wat het punt wil laten zien. */
            d={
              opvallend
                ? "M40 16 A15 24 0 0 0 40 64 A31 24 0 0 0 40 16 Z"
                : "M40 16 A24 24 0 0 0 40 64 A24 24 0 0 0 40 16 Z"
            }
            fill={vulling}
            fillOpacity={dekking}
          />
          <line
            x1="40"
            y1="8"
            x2="40"
            y2="72"
            stroke="var(--g-300)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </>
      ) : null}

      {/* B — begrenzing. Links glad, rechts gekarteld. */}
      {punt === "B" ? (
        opvallend ? (
          <polygon points={GEKARTELD} fill={vulling} fillOpacity={dekking} />
        ) : (
          <circle cx="40" cy="40" r="24" fill={vulling} fillOpacity={dekking} />
        )
      ) : null}

      {/* C — kleur. Hier mág kleur het verschil maken. */}
      {punt === "C" ? (
        <>
          <defs>
            <clipPath id={knipId}>
              <circle cx="40" cy="40" r="24" />
            </clipPath>
          </defs>
          <circle cx="40" cy="40" r="24" fill={vulling} fillOpacity={dekking} />
          {opvallend ? (
            <g clipPath={`url(#${knipId})`}>
              <rect
                x="16"
                y="16"
                width="48"
                height="26"
                fill="var(--t-strong)"
                opacity="0.75"
              />
              <ellipse
                cx="52"
                cy="54"
                rx="14"
                ry="11"
                fill="var(--warn)"
                opacity="0.95"
              />
              <ellipse
                cx="26"
                cy="52"
                rx="8"
                ry="7"
                fill="white"
                opacity="0.85"
              />
            </g>
          ) : null}
        </>
      ) : null}

      {/* D — doorsnede. Zelfde maatstreep eronder, dus de grootte is te vergelijken. */}
      {punt === "D" ? (
        <>
          <circle
            cx="40"
            cy="36"
            r={opvallend ? 28 : 10}
            fill={vulling}
            fillOpacity={dekking}
          />
          <line
            x1="12"
            y1="72"
            x2="68"
            y2="72"
            stroke="var(--g-300)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="68"
            x2="12"
            y2="76"
            stroke="var(--g-300)"
            strokeWidth="2"
          />
          <line
            x1="68"
            y1="68"
            x2="68"
            y2="76"
            stroke="var(--g-300)"
            strokeWidth="2"
          />
        </>
      ) : null}

      {/* E — evolutie. Rechts staat er gestippeld bij hoe het wás. */}
      {punt === "E" ? (
        <>
          <circle
            cx="40"
            cy="40"
            r={opvallend ? 28 : 22}
            fill={vulling}
            fillOpacity={dekking}
          />
          {opvallend ? (
            <circle
              cx="40"
              cy="40"
              r="16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          ) : null}
        </>
      ) : null}

      {/* Het lelijke eendje — alleen te zien náást de andere plekjes, dus staan die erbij. */}
      {punt === "eend" ? (
        <>
          <circle cx="18" cy="20" r="9" fill={vulling} fillOpacity="0.3" />
          <circle cx="62" cy="22" r="8" fill={vulling} fillOpacity="0.3" />
          <circle cx="20" cy="62" r="8" fill={vulling} fillOpacity="0.3" />
          {opvallend ? (
            <polygon
              points={GEKARTELD}
              fill={vulling}
              fillOpacity="0.62"
              transform="translate(8 8) scale(0.78)"
            />
          ) : (
            <circle cx="46" cy="48" r="9" fill={vulling} fillOpacity="0.3" />
          )}
        </>
      ) : null}
    </svg>
  );
}

export default function AbcdeCheck() {
  const [antwoorden, setAntwoorden] = useState<Antwoorden>({});
  const uid = useId().replace(/:/g, "");

  const beantwoord = Object.keys(antwoorden).length;
  const opvallend = Object.values(antwoorden).filter(
    (a) => a === "opvallend",
  ).length;
  const compleet = beantwoord === PUNTEN.length;
  const uitkomst = opvallend > 0 ? UITKOMST_WEL : UITKOMST_GEEN;

  return (
    <div className="mt-12">
      <ul className="grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)]">
        {PUNTEN.map((p) => {
          const k = sleutel(p);
          const gekozen = antwoorden[k];
          const naam = "letter" in p ? `${p.letter} · ${p.naam}` : p.naam;

          return (
            <li key={k} className="bg-white p-6 sm:p-8">
              <Label>{naam}</Label>
              <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--t-strong)]">
                {p.vraag}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(["rustig", "opvallend"] as const).map((variant) => {
                  const actief = gekozen === variant;
                  return (
                    <button
                      key={variant}
                      type="button"
                      aria-pressed={actief}
                      onClick={() =>
                        setAntwoorden((v) => ({ ...v, [k]: variant }))
                      }
                      className={`flex items-center gap-4 rounded-[var(--r-sm)] border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                        actief
                          ? "border-[var(--g-300)] bg-[var(--g-050)]"
                          : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                      }`}
                    >
                      <Vorm punt={k} variant={variant} uid={uid} />
                      <span className="text-[15px] leading-6 text-[var(--t-body)]">
                        {p[variant]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 rounded-[var(--r-sm)] bg-[var(--g-025)] p-4 text-sm leading-6 text-[var(--t-muted)]">
                {publicCopy(p.uitleg)}
              </p>
            </li>
          );
        })}
      </ul>

      {/* ── De uitkomst ── */}
      <div
        className="mt-8 rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-9"
        aria-live="polite"
      >
        {!compleet ? (
          <>
            <Label>{`${beantwoord} van ${PUNTEN.length} beantwoord`}</Label>
            <p className="mt-4 max-w-[70ch] text-[16px] leading-7 text-[var(--t-body)]">
              Loop de punten hierboven langs. Wat je ook invult, de uitkomst van
              deze check is nooit een oordeel over jouw plekje: hij helpt je
              alleen te bepalen of je ermee naar de huisarts gaat.
            </p>
          </>
        ) : (
          <>
            <Label
              className={opvallend > 0 ? "text-[var(--warn-text)]" : undefined}
            >
              {opvallend > 0
                ? `${opvallend} van ${PUNTEN.length} punten vielen op`
                : "Geen van de punten viel op"}
            </Label>
            <h3 className="diba-card-title-lg mt-4">{uitkomst.kop}</h3>
            <p className="mt-4 max-w-[70ch] text-[16px] leading-7 text-[var(--t-body)]">
              {uitkomst.tekst}
            </p>
            <p className="mt-4 max-w-[70ch] text-[16px] leading-7 text-[var(--t-strong)]">
              {uitkomst.advies}
            </p>
            <button
              type="button"
              onClick={() => setAntwoorden({})}
              className="diba-label mt-7 underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Check opnieuw doen
            </button>
          </>
        )}
      </div>

      <p className="mt-5 max-w-[80ch] text-sm leading-6 text-[var(--t-muted)]">
        Deze check is voorlichting en geen medisch onderzoek. Hij kan niet zien
        wat een arts met een dermatoscoop wel ziet, en hij kan dus ook niets
        uitsluiten. Bij twijfel geldt altijd hetzelfde advies: laat het
        nakijken.
      </p>
    </div>
  );
}
