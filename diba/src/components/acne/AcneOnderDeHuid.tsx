"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { ACNE_STADIA } from "@/data/acne";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Onder je huid — één porie die je door de vier stadia heen ziet veranderen.
 *
 * WAT ER MIS WAS.
 *
 * De tekening was er wel, maar hij was klein en zweefde linksboven in een kaart die twee
 * keer zo groot was. Daardoor las hij als een pictogram in plaats van als een doorsnede.
 * Er was ook geen huid te zien: één buisje en een bolletje, zonder lagen, dus je keek naar
 * een schema zonder te weten waar je naar keek. En de vier stadia stonden als losse pillen
 * onderaan, waardoor je nergens zag dat het een volgorde was: je kon op vier knoppen
 * drukken en het leek vier keer iets anders in plaats van vier keer verderop.
 *
 * WAT ER NU STAAT.
 *
 * De doorsnede vult de kaart en toont echte lagen: hoornlaag, opperhuid, lederhuid, met de
 * porie die er dwars doorheen loopt en de talgklier onderin. Dat is meteen de reden dat
 * dit een tekening moet zijn en geen foto: op een foto zie je alleen de bovenkant, en het
 * hele punt van deze sectie is dat het probleem eronder zit. (A10 verbiedt bovendien
 * AI-huid, en dit is geen omweg om die regel heen maar de betere vorm.)
 *
 * De vier stadia bouwen op in dezelfde porie. Je ziet dus niet vier plaatjes maar één
 * porie die dichtslibt, en daardoor is te zien wat de tekst zegt: bij elk punt zit een
 * andere knop. Harder schrobben grijpt aan op stadium twee en maakt stadium vier erger.
 *
 * De balk onder de tekening is een vulling en geen streepje per stap: hij loopt door de
 * vier stadia heen, zodat je ziet hoe ver in het proces je kijkt. Vullingen en geen
 * lijnen, zoals overal.
 *
 * KLEUR.
 *
 * Alles staat in de groentinten, op één uitzondering: de ontsteking gebruikt --warn, de
 * grafische oker. Dat is de enige plek waar een andere kleur iets betekent in plaats van
 * dat hij versiert. Rood zou hier misstaan; het gaat om een reactie van je afweer en niet
 * om alarm.
 */

/** Hoe ver het proces gevorderd is, per stadium. Bepaalt wat de tekening laat zien. */
type Fase = 0 | 1 | 2 | 3;

export default function AcneOnderDeHuid() {
  const [actief, setActief] = useState<Fase>(0);
  const stadium = ACNE_STADIA[actief];

  const verhoornd = actief >= 1;
  const afgesloten = actief >= 2;
  const ontstoken = actief >= 3;

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:gap-12">
      {/* ── De doorsnede ── */}
      <div className="flex flex-col rounded-[var(--r-md)] bg-white p-5 sm:p-7">
        <svg
          viewBox="0 0 400 460"
          className="w-full flex-1"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Doorsnede van de huid bij stadium ${actief + 1} van 4: ${stadium.naam}. ${publicCopy(stadium.merkbaar)}`}
        >
          {/* ── De lagen, van buiten naar binnen ── */}
          <rect x="0" y="70" width="400" height="34" fill="var(--g-100)" />
          <rect x="0" y="104" width="400" height="126" fill="var(--g-050)" />
          <rect x="0" y="230" width="400" height="230" fill="var(--g-025)" />

          {/* De lederhuid kleurt mee als het ontstoken raakt: de reactie zit rondom de
              porie en niet erin. Vandaar een cirkel en geen vlak. */}
          {ontstoken ? (
            <circle cx="200" cy="250" r="150" fill="var(--warn)" opacity="0.13" />
          ) : null}

          {/* ── De porie ──
              Twee zijwanden die naar beneden toe smaller worden. Bij verhoorning knijpt de
              opening dicht: dezelfde vorm, andere x. */}
          <path
            d={
              verhoornd
                ? "M176 70 L188 300 L212 300 L224 70 Z"
                : "M168 70 L188 300 L212 300 L232 70 Z"
            }
            fill="var(--g-200)"
            className="transition-all duration-500"
          />

          {/* Talg in de porie. Loopt voller naarmate hij minder weg kan. */}
          <path
            d={
              afgesloten
                ? "M178 88 L188 298 L212 298 L222 88 Z"
                : verhoornd
                  ? "M180 150 L188 298 L212 298 L220 150 Z"
                  : "M184 210 L188 298 L212 298 L216 210 Z"
            }
            fill="var(--g-400)"
            opacity="0.55"
            className="transition-all duration-500"
          />

          {/* ── De talgklier ── */}
          <ellipse cx="200" cy="330" rx="52" ry="34" fill="var(--g-300)" />
          <ellipse cx="200" cy="330" rx="30" ry="19" fill="var(--g-400)" opacity="0.5" />

          {/* De haarschacht: het kanaal waar het langs omhoog gaat. */}
          <path
            d="M200 300 L200 74"
            stroke="var(--g-600)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={afgesloten ? 0.25 : 0.55}
            className="transition-opacity duration-500"
          />

          {/* ── Verhoorning: schilfers die aan de rand blijven plakken ── */}
          {verhoornd
            ? [
                [172, 78],
                [226, 80],
                [178, 92],
                [220, 94],
                [175, 106],
                [223, 108],
              ].map(([x, y]) => (
                <rect
                  key={`s-${x}-${y}`}
                  x={x - 6}
                  y={y - 3}
                  width="12"
                  height="6"
                  rx="3"
                  fill="var(--g-600)"
                  opacity="0.45"
                />
              ))
            : null}

          {/* ── Bacterie: stipjes in de afgesloten porie ── */}
          {afgesloten
            ? [
                [194, 140],
                [207, 162],
                [192, 186],
                [209, 208],
                [196, 232],
                [206, 256],
              ].map(([x, y]) => (
                <circle
                  key={`b-${x}-${y}`}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="var(--g-800)"
                  opacity="0.7"
                />
              ))
            : null}

          {/* ── Ontsteking: de bult die je in de spiegel ziet ── */}
          {ontstoken ? (
            <>
              <path
                d="M148 70 Q200 16 252 70 Z"
                fill="var(--warn)"
                opacity="0.55"
              />
              <path
                d="M170 66 Q200 40 230 66 Z"
                fill="var(--warn)"
                opacity="0.85"
              />
            </>
          ) : null}

          {/* ── Het huidoppervlak ──
              Als laatste getekend, zodat de bult er netjes tegenaan sluit. */}
          <rect
            x="0"
            y="66"
            width="400"
            height="5"
            fill="var(--g-700)"
            opacity="0.35"
          />

          {/* ── Waar je naar kijkt ── */}
          <text
            x="16"
            y="52"
            fill="var(--t-muted)"
            fontSize="15"
            letterSpacing="1.6"
          >
            HUIDOPPERVLAK
          </text>
          <text
            x="16"
            y="440"
            fill="var(--t-muted)"
            fontSize="15"
            letterSpacing="1.6"
          >
            TALGKLIER
          </text>
        </svg>

        {/* ── De vier stadia als één doorlopende weg ──

            Vier knoppen boven één balk die meegroeit. Zo is te zien dat dit een volgorde
            is en hoe ver je erin zit, in plaats van vier losse keuzes. */}
        <div className="mt-6">
          <div className="grid grid-cols-4 gap-1.5">
            {ACNE_STADIA.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={actief === i}
                onClick={() => setActief(i as Fase)}
                className={`diba-label rounded-[var(--r-sm)] px-2 py-3 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-400)] ${
                  actief === i
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-[var(--g-050)] text-[var(--t-label)] hover:bg-[var(--g-100)]"
                }`}
              >
                {s.naam}
              </button>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="mt-3 h-1 w-full overflow-hidden rounded-[var(--r-pill)] bg-[var(--g-100)]"
          >
            <div
              className="h-full rounded-[var(--r-pill)] bg-[var(--g-400)] transition-[width] duration-500 ease-out"
              style={{ width: `${((actief + 1) / ACNE_STADIA.length) * 100}%` }}
            />
          </div>
          <p className="diba-label mt-3 text-[var(--t-muted)]">
            Stadium {actief + 1} van {ACNE_STADIA.length}
          </p>
        </div>
      </div>

      {/* ── Wat er op dit punt gebeurt ── */}
      <div className="flex flex-col justify-center">
        <h3 className="text-[30px] leading-none tracking-[-.05em] text-[var(--t-strong)] sm:text-[34px]">
          {stadium.naam}
        </h3>

        <div className="mt-7 space-y-6">
          <div>
            <Label>Wat je hiervan merkt</Label>
            <p className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(stadium.merkbaar)}
            </p>
          </div>

          <div>
            <Label>Wat er gebeurt</Label>
            <p className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(stadium.uitleg)}
            </p>
          </div>
        </div>

        {/* De knop van dit stadium. Dit is het hele punt van de sectie, dus hij krijgt
            een eigen vlak in plaats van dat hij als derde alinea meeleest. */}
        <div className="mt-7 rounded-[var(--r-md)] bg-[var(--g-075)] p-6 sm:p-7">
          <Label className="text-[var(--warn-text)]">
            Waar je hier iets kunt veranderen
          </Label>
          <p className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(stadium.ingrijpen)}
          </p>
        </div>
      </div>
    </div>
  );
}
