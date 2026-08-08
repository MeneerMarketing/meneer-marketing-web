"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { ACNE_STADIA } from "@/data/acne";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Onder je huid — een doorsnede die je door de vier stadia kunt klikken.
 *
 * Dit verving vier kaartjes met "01 02 03 04" erboven. Die nummers zijn een sjabloon en
 * geen gedachte: de volgorde blijkt hier uit de tekening zelf, en per stadium zie je
 * wát er verandert in plaats van dat je het moet lezen.
 *
 * De echte educatieve winst zit in het derde blok van elk stadium: bij elk punt in dit
 * proces is er een ándere lever. Daarom werkt harder poetsen niet — dat grijpt aan op
 * stadium twee en maakt stadium vier erger.
 *
 * Alles is schema, geen huid: A10 verbiedt AI-gegenereerde huid, en een doorsnede in
 * lijnen leest hier ook beter dan een foto ooit zou doen.
 */
export default function AcneOnderDeHuid() {
  const [actief, setActief] = useState(0);
  const stadium = ACNE_STADIA[actief];

  /** Hoeveel van het proces is bereikt: bepaalt wat de tekening laat zien. */
  const talg = actief >= 0;
  const dicht = actief >= 1;
  const bacterie = actief >= 2;
  const ontstoken = actief >= 3;

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      {/* ── De doorsnede ── */}
      <div className="rounded-[var(--r-md)] bg-white p-5 sm:p-7">
        <svg
          viewBox="0 0 420 300"
          className="w-full"
          role="img"
          aria-label={`Doorsnede van de huid, stadium: ${stadium.naam}. ${stadium.merkbaar}`}
        >
          {/* Huidoppervlak */}
          <line
            x1="20"
            y1="70"
            x2="400"
            y2="70"
            stroke="var(--g-300)"
            strokeWidth="1.5"
          />
          <text
            x="20"
            y="56"
            className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            Huidoppervlak
          </text>

          {/* Bovenste huidlaag als lichte band */}
          <rect x="20" y="70" width="380" height="26" fill="var(--g-050)" />

          {/* De porie: twee wanden die naar elkaar toe komen als hij dichtgaat */}
          <path
            d={
              dicht
                ? "M186 70 C188 120 190 150 194 196"
                : "M180 70 C182 120 184 150 188 196"
            }
            fill="none"
            stroke="var(--g-300)"
            strokeWidth="1.5"
            className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
          />
          <path
            d={
              dicht
                ? "M234 70 C232 120 230 150 226 196"
                : "M240 70 C238 120 236 150 232 196"
            }
            fill="none"
            stroke="var(--g-300)"
            strokeWidth="1.5"
            className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
          />

          {/* Talgklier */}
          <ellipse
            cx="210"
            cy="222"
            rx="42"
            ry="30"
            fill={talg ? "var(--g-200)" : "var(--g-050)"}
            stroke="var(--g-300)"
            strokeWidth="1.5"
            className="transition-all duration-500 motion-reduce:transition-none"
          />
          <text
            x="210"
            y="272"
            textAnchor="middle"
            className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            Talgklier
          </text>

          {/* Talgdruppels die omhoog komen */}
          <g
            className="transition-opacity duration-500 motion-reduce:transition-none"
            opacity={talg ? 1 : 0}
          >
            {[
              [210, 196],
              [204, 174],
              [216, 152],
              [208, 130],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4.5}
                fill="var(--g-400)"
                opacity={0.55 + i * 0.1}
              />
            ))}
          </g>

          {/* Verhoornde cellen die de opening dichtplakken */}
          <g
            className="transition-opacity duration-500 motion-reduce:transition-none"
            opacity={dicht ? 1 : 0}
          >
            {[
              [193, 84],
              [206, 79],
              [219, 84],
              [228, 90],
              [199, 92],
              [214, 91],
            ].map(([x, y], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width="8"
                height="6"
                rx="2"
                fill="var(--g-300)"
                transform={`rotate(${i * 23} ${x + 4} ${y + 3})`}
              />
            ))}
          </g>

          {/* Bacterie: kleine staafjes in de afgesloten porie */}
          <g
            className="transition-opacity duration-500 motion-reduce:transition-none"
            opacity={bacterie ? 1 : 0}
          >
            {[
              [204, 118],
              [216, 136],
              [206, 154],
              [218, 170],
            ].map(([x, y], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width="9"
                height="3.5"
                rx="1.75"
                fill="var(--g-700)"
                transform={`rotate(${30 + i * 40} ${x + 4.5} ${y + 1.75})`}
              />
            ))}
          </g>

          {/* Ontsteking: een warme halo rond de porie */}
          <g
            className="transition-opacity duration-700 motion-reduce:transition-none"
            opacity={ontstoken ? 1 : 0}
          >
            <ellipse
              cx="210"
              cy="130"
              rx="70"
              ry="62"
              fill="var(--error)"
              opacity="0.10"
            />
            <ellipse
              cx="210"
              cy="130"
              rx="48"
              ry="44"
              fill="var(--error)"
              opacity="0.14"
            />
            {/* De zwelling boven het oppervlak */}
            <path
              d="M170 70 C176 40 244 40 250 70 Z"
              fill="var(--error)"
              opacity="0.18"
            />
          </g>
        </svg>

        {/* Stadiumkiezer */}
        <div
          role="tablist"
          aria-label="Stadia van acne onder de huid"
          className="mt-5 flex flex-wrap gap-2"
        >
          {ACNE_STADIA.map((s, i) => {
            const gekozen = i === actief;
            return (
              <button
                key={s.id}
                role="tab"
                type="button"
                aria-selected={gekozen}
                aria-controls="stadium-paneel"
                onClick={() => setActief(i)}
                onMouseEnter={() => setActief(i)}
                onFocus={() => setActief(i)}
                className={`diba-label min-h-12 rounded-[var(--r-pill)] px-4 transition ${
                  gekozen
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-[var(--g-050)] text-[var(--t-label)] hover:bg-[var(--g-075)]"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
              >
                {s.naam}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── De uitleg ── */}
      <div
        id="stadium-paneel"
        role="tabpanel"
        aria-live="polite"
        className="flex flex-col"
      >
        <h3 className="diba-card-title-lg">{stadium.naam}</h3>

        <dl className="mt-6 space-y-6">
          {[
            ["Wat je hiervan merkt", stadium.merkbaar],
            ["Wat er gebeurt", stadium.uitleg],
          ].map(([kop, tekst]) => (
            <div key={kop} className="border-l-2 border-[var(--g-200)] pl-4">
              <dt className="diba-label">{kop}</dt>
              <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
                {publicCopy(tekst)}
              </dd>
            </div>
          ))}
        </dl>

        {/* De kern van dit onderdeel: elk stadium heeft een eigen lever. */}
        <div className="mt-7 rounded-[var(--r-sm)] bg-[var(--g-075)] p-5">
          <Label>Waar je hier iets kunt veranderen</Label>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(stadium.ingrijpen)}
          </p>
        </div>
      </div>
    </div>
  );
}
