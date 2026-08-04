"use client";

import { useId, useState } from "react";
import {
  AANZICHTEN,
  GEZICHT,
  GEZICHT_VIEWBOX,
  LICHAAM,
  LICHAAM_VIEWBOX,
  ZONE_VORMEN,
  zonesInAanzicht,
  type Aanzicht,
  type Vorm,
} from "@/data/laser-lichaamskaart";
import { LASER_ZONES } from "@/data/laser-zones";

/**
 * De kaart waarop je je zones aanwijst.
 *
 * Waarom dit er is: de vorige configurator was een lijst met knoppen, en dat is precies de
 * vorm waarin niemand denkt. Wie hierover twijfelt vraagt zich af of "bikinilijn" doorloopt
 * tot waar hij hem wil hebben en of "benen" ook de dijen dekt. Dat beantwoord je door het
 * aan te wijzen, niet door het te benoemen.
 *
 * Drie aanzichten, want een bovenlip is op een silhouet van vierhonderd pixels vier pixels
 * groot en dan wordt aanwijzen raden.
 *
 * Toegankelijkheid. De kaart is niet de enige ingang: naast elk aanzicht staat dezelfde
 * keuze als gewone knoppen in een lijst, en die lijst is de bediening voor wie met een
 * toetsenbord of een schermlezer werkt. De vormen in de tekening zijn daarom `aria-hidden`
 * en de lijst draagt de toestand. Een SVG-vorm met een `role` en een `tabindex` erin
 * frommelen levert een bediening op die technisch bestaat en praktisch onbruikbaar is.
 *
 * Op mobiel staat de lijst onder de tekening in plaats van ernaast, en zijn de knoppen
 * 48px hoog.
 */

function VormTekenen({ v, ...rest }: { v: Vorm } & React.SVGProps<SVGElement>) {
  const gedeeld = rest as Record<string, unknown>;
  if (v.soort === "cirkel") {
    return <circle cx={v.cx} cy={v.cy} r={v.r} {...gedeeld} />;
  }
  if (v.soort === "ellips") {
    return <ellipse cx={v.cx} cy={v.cy} rx={v.rx} ry={v.ry} {...gedeeld} />;
  }
  return (
    <rect
      x={v.x}
      y={v.y}
      width={v.b}
      height={v.h}
      rx={v.r}
      ry={v.r}
      {...gedeeld}
    />
  );
}

type Props = {
  gekozen: readonly string[];
  /** Zones die door een gekozen pakket gedekt worden: aan, maar niet los af te zetten. */
  gedekt: readonly string[];
  onWissel: (zoneId: string) => void;
};

export default function Lichaamskaart({ gekozen, gedekt, onWissel }: Props) {
  const [aanzicht, setAanzicht] = useState<Aanzicht>("voor");
  const titelId = useId();

  const isGezicht = aanzicht === "gezicht";
  const zichtbaar = zonesInAanzicht(aanzicht);
  const staat = (id: string) =>
    gedekt.includes(id) ? "gedekt" : gekozen.includes(id) ? "aan" : "uit";

  return (
    <div>
      {/* ── Aanzicht kiezen ── */}
      <div
        role="tablist"
        aria-label="Aanzicht"
        className="flex flex-wrap gap-2"
      >
        {AANZICHTEN.map((a) => (
          <button
            key={a.id}
            role="tab"
            type="button"
            aria-selected={a.id === aanzicht}
            onClick={() => setAanzicht(a.id)}
            className={`diba-label inline-flex min-h-11 items-center rounded-[var(--r-pill)] px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
              a.id === aanzicht
                ? "diba-pill-active"
                : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1fr] sm:gap-8">
        {/* ── De tekening ── */}
        <div className="rounded-[var(--r-md)] bg-white p-5 sm:p-6">
          <p id={titelId} className="sr-only">
            Schematische tekening, {isGezicht ? "gezicht" : aanzicht}. De zones
            zijn hiernaast als knoppen te bedienen.
          </p>
          <svg
            viewBox={isGezicht ? GEZICHT_VIEWBOX : LICHAAM_VIEWBOX}
            className="mx-auto block h-auto w-full max-w-[260px]"
            aria-hidden="true"
            focusable="false"
          >
            {(isGezicht ? GEZICHT : LICHAAM).map((v, i) => (
              <VormTekenen key={`basis-${i}`} v={v} fill="var(--g-100)" />
            ))}

            {zichtbaar.map((id) =>
              (ZONE_VORMEN[id]?.[aanzicht] ?? []).map((v, i) => {
                const s = staat(id);
                return (
                  <VormTekenen
                    key={`${id}-${i}`}
                    v={v}
                    fill={s === "uit" ? "transparent" : "var(--g-400)"}
                    stroke={s === "uit" ? "var(--g-300)" : "var(--g-700)"}
                    strokeWidth={s === "uit" ? 1 : 1.5}
                    strokeDasharray={s === "gedekt" ? "4 3" : undefined}
                    opacity={s === "aan" ? 0.9 : s === "gedekt" ? 0.55 : 1}
                    style={{
                      transition:
                        "fill .25s var(--ease-diba), opacity .25s var(--ease-diba)",
                    }}
                  />
                );
              }),
            )}
          </svg>
        </div>

        {/* ── Dezelfde keuze als lijst. Dit is de echte bediening. ── */}
        <ul className="flex flex-col gap-2">
          {zichtbaar.map((id) => {
            const zone = LASER_ZONES.find((z) => z.id === id);
            if (!zone) return null;
            const s = staat(id);
            return (
              <li key={id}>
                {/* Een zone die in een gekozen pakket zit is niet los uit te zetten. Dat
                    zou de opbouw niet veranderen en alleen verwarren; het pakket eronder
                    weghalen is de enige zinnige actie, en die staat er. */}
                <button
                  type="button"
                  aria-pressed={s !== "uit"}
                  disabled={s === "gedekt"}
                  onClick={() => onWissel(id)}
                  className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--r-sm)] border px-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    s === "uit"
                      ? "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                      : s === "gedekt"
                        ? "border-[var(--g-100)] bg-[var(--g-050)]"
                        : "border-[var(--g-700)] bg-[var(--g-050)]"
                  }`}
                >
                  <span className="text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                    {zone.label}
                  </span>
                  {s === "gedekt" ? (
                    <span className="diba-label shrink-0 text-[var(--t-muted)]">
                      In pakket
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--r-pill)] border ${
                        s === "aan"
                          ? "border-[var(--g-700)] bg-[var(--g-700)]"
                          : "border-[var(--g-300)]"
                      }`}
                    >
                      {s === "aan" ? (
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8.5 6.5 12 13 4.5" />
                        </svg>
                      ) : null}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
