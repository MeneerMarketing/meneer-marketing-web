"use client";

import { useId, useState } from "react";
import {
  GOLFLENGTES,
  golflengte,
  toewijzing,
  type GolflengteId,
} from "@/data/gentlemax";
import { FITZPATRICK_TYPES, type FitzpatrickId } from "@/data/laser-zones";

/**
 * Het golflengtevenster.
 *
 * WAT DIT LAAT ZIEN DAT NERGENS ANDERS STAAT.
 *
 * Dat er twee lasers in dit apparaat zitten, en dat jouw huidtype bepaalt welke van de
 * twee je krijgt. Dat is de enige technische keuze op deze site die rechtstreeks over
 * veiligheid gaat, en in folders staat hij nooit: die noemen "geschikt voor huidtype I tot
 * VI" en laten weg dat dat aan twee verschillende golflengtes te danken is.
 *
 * DE TEKENING.
 *
 * Twee stralen in dezelfde doorsnede, allebei vanaf het oppervlak naar hun eigen diepte.
 * De 755 stopt hoger en is fel, want die wordt sterk opgenomen; de 1064 gaat dieper en is
 * ijler, want die wordt minder opgenomen. Dat is geen versiering: precies dat verschil in
 * opname is de reden dat ze bij verschillende huidtypes horen.
 *
 * De gekozen straal is vol zichtbaar, de andere blijft zwak staan. Weglaten zou de
 * vergelijking kapotmaken, en de vergelijking is het hele punt.
 *
 * GEEN HUIDSKLEUREN IN DE TEKENING.
 *
 * De ring toont Fitzpatrick-types als cijfers en niet als kleurvlakjes. Zes vakjes in
 * oplopende bruintinten naast de vraag "welke ben jij" leest als een sorteerkaart, en dat
 * is precies wat je op een medische pagina niet wil. Het cijfer plus de omschrijving doet
 * hetzelfde werk zonder iemand in een kleurvak te zetten.
 *
 * [MEDISCHE-CHECK-ROJDA] de koppeling huidtype naar golflengte in `gentlemax.ts`.
 */

const OPPERVLAK = 26;
const BODEM = 190;

function diepteY(procent: number): number {
  return OPPERVLAK + ((BODEM - OPPERVLAK) * procent) / 100;
}

export default function Golflengtevenster() {
  const [type, setType] = useState<FitzpatrickId>("III");
  const id = useId();

  const keuze = toewijzing(type);
  const actief: readonly GolflengteId[] =
    keuze.kies === "beide" ? ["755", "1064"] : [keuze.kies];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Kiezer plus tekening. */}
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <p className="diba-label text-[var(--t-label)]">Kies je huidtype</p>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-7 text-[var(--t-body)]">
          De schaal van Fitzpatrick gaat over hoe je huid op zon reageert, niet
          over hoe hij eruitziet. Weet je het niet zeker, dan wordt hij bij de
          intake bepaald.
        </p>

        <div
          role="radiogroup"
          aria-labelledby={`${id}-kop`}
          className="mt-6 flex flex-wrap gap-2"
        >
          <span id={`${id}-kop`} className="sr-only">
            Fitzpatrick huidtype
          </span>
          {FITZPATRICK_TYPES.map((t) => {
            const aan = t.id === type;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={aan}
                onClick={() => setType(t.id)}
                className={`min-h-12 min-w-12 rounded-[var(--r-md)] px-4 text-[16px] leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-[var(--g-025)] text-[var(--g-900)] hover:bg-[var(--g-050)]"
                }`}
              >
                {t.id}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
          {FITZPATRICK_TYPES.find((t) => t.id === type)?.description}
        </p>

        {/* De doorsnede. */}
        <svg
          viewBox="0 0 270 210"
          role="img"
          aria-label={`Doorsnede van de huid met de laserstralen. Bij huidtype ${type} wordt gewerkt met ${actief.map((a) => `${golflengte(a).nm} nanometer`).join(" of ")}.`}
          className="mt-8 w-full"
        >
          {/* Huid: donker, zodat het licht erin kan oplichten. */}
          <rect
            x="0"
            y={OPPERVLAK}
            width="270"
            height={BODEM - OPPERVLAK}
            rx="10"
            fill="var(--g-700)"
          />
          <rect
            x="0"
            y={OPPERVLAK}
            width="270"
            height="22"
            fill="var(--g-800)"
            opacity="0.55"
          />
          <text
            x="12"
            y={OPPERVLAK - 8}
            className="fill-[var(--t-label)] text-[9px] tracking-[.14em] uppercase"
          >
            Oppervlak
          </text>

          {/* Haarwortel: het doelwit. */}
          <path
            d={`M148 ${OPPERVLAK + 4} L152 ${diepteY(58)}`}
            stroke="white"
            strokeOpacity="0.25"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="152" cy={diepteY(60)} r="7" fill="white" opacity="0.3" />
          <text
            x="166"
            y={diepteY(62)}
            className="fill-white text-[9px] tracking-[.14em] uppercase"
            opacity="0.65"
          >
            Wortel
          </text>

          {/* De twee stralen. */}
          {GOLFLENGTES.map((g, i) => {
            const aan = actief.includes(g.id);
            const x = i === 0 ? 58 : 100;
            return (
              <g
                key={g.id}
                style={{
                  opacity: aan ? 1 : 0.22,
                  transition: "opacity .4s ease",
                }}
              >
                <rect
                  x={x - 9}
                  y={OPPERVLAK}
                  width="18"
                  height={diepteY(g.diepte) - OPPERVLAK}
                  rx="9"
                  fill="white"
                  opacity={g.id === "755" ? 0.92 : 0.5}
                />
                <circle
                  cx={x}
                  cy={diepteY(g.diepte)}
                  r="11"
                  fill="white"
                  opacity={g.id === "755" ? 0.95 : 0.55}
                />
                <text
                  x={x}
                  y={diepteY(g.diepte) + 26}
                  textAnchor="middle"
                  className="fill-white text-[10px]"
                >
                  {g.nm}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
          De felle straal wordt sterk door pigment opgenomen en stopt hoger. De
          ijle gaat er grotendeels langs en komt dieper.
        </p>
      </div>

      {/* De uitkomst. */}
      <div className="flex flex-col gap-4">
        <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
          <p className="diba-label diba-label-on-dark">
            Bij huidtype {type} werken we met
          </p>
          <p className="mt-4 text-[34px] leading-none font-medium tracking-[-.05em]">
            {keuze.kies === "beide"
              ? "Allebei, dat hangt af van jou"
              : `${golflengte(keuze.kies).nm} nm`}
          </p>
          {keuze.kies !== "beide" ? (
            <p className="mt-2 text-[17px] leading-7 text-[var(--on-dark-accent)]">
              {golflengte(keuze.kies).naam}
            </p>
          ) : null}
          <p className="mt-5 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
            {keuze.waarom}
          </p>
        </div>

        <ul className="grid flex-1 gap-4 sm:grid-cols-2">
          {GOLFLENGTES.map((g) => {
            const aan = actief.includes(g.id);
            return (
              <li
                key={g.id}
                className={`rounded-[var(--r-lg)] p-6 transition-colors duration-300 sm:p-7 ${
                  aan ? "bg-[var(--g-200)]" : "bg-white"
                }`}
              >
                <p
                  className={`text-[22px] leading-none font-medium tracking-[-.04em] ${aan ? "text-[var(--g-900)]" : "text-[var(--t-strong)]"}`}
                >
                  {g.nm} nm
                </p>
                <p
                  className={`mt-2 text-[15px] leading-6 ${aan ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {g.naam}
                </p>
                <p
                  className={`mt-4 text-[14px] leading-6 ${aan ? "text-[var(--g-900)]" : "text-[var(--t-muted)]"}`}
                >
                  {g.opname}
                </p>
                <p
                  className={`mt-4 text-[15px] leading-7 ${aan ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {g.sterk}
                </p>
                <p
                  className={`mt-4 rounded-[var(--r-md)] p-4 text-[14px] leading-6 ${
                    aan
                      ? "bg-white text-[var(--t-body)]"
                      : "bg-[var(--g-025)] text-[var(--t-body)]"
                  }`}
                >
                  <span className="diba-label block text-[var(--t-label)]">
                    De keerzijde
                  </span>
                  <span className="mt-2 block">{g.zwak}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
