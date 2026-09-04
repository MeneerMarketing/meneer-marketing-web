"use client";

import {
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { LAGEN, LAMP_UITLEG, type Laag } from "@/data/melasma";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De woodlamp — de uitblinker van de melasmapagina.
 *
 * Bij melasma bepaalt de diepte de uitkomst, en die diepte zie je met het blote oog niet.
 * Een dermatoloog pakt er een woodlamp bij: pigment dat hoog zit springt er onder dat licht
 * uit, pigment dat dieper ligt juist niet. Dat is de enige meting die vooraf zegt of
 * behandelen zin heeft, en bijna geen enkele kliniek legt uit dat hij bestaat.
 *
 * Dus geef je de bezoeker de lamp. Je sleept hem zelf over de vlek, en waar je hem
 * neerzet verandert wat je ziet én wat het antwoord is. Het gedeelte links reageert, het
 * gedeelte rechts niet, en dat verschil is in gewoon licht onzichtbaar.
 *
 * Waarom dit geen kopie is van de onderarmtest: daar veeg je een grens over een beeld en
 * vergelijk je twee helften. Hier is de lamp een gereedschap dat je ergens neerzet, en het
 * beeld eronder is een ánder beeld dan eromheen. Je onthult, je vergelijkt niet.
 *
 * Toegankelijkheid: slepen is nooit de enige weg. Onder het vlak staan drie knoppen die de
 * lamp op elk gebied zetten, en die zijn met het toetsenbord te bedienen. De lezing staat
 * in een live region.
 *
 * BEELD: schematisch. Geen huidtint en geen echte of gegenereerde huid (§14).
 */

/** Waar de drie gebieden liggen, als middelpunt in procenten van het vlak. */
const GEBIEDEN: Record<Laag["id"], { x: number; y: number }> = {
  epidermaal: { x: 24, y: 42 },
  gemengd: { x: 50, y: 55 },
  dermaal: { x: 76, y: 40 },
};

const VOORUITZICHT_KLEUR = {
  goed: "text-[var(--g-700)]",
  matig: "text-[var(--warn-text)]",
  beperkt: "text-[var(--t-muted)]",
} as const;

/** De vlek zelf: drie overlappende velden, zoals melasma in het echt ook ligt. */
const VLEKKEN = [
  { cx: 130, cy: 130, rx: 92, ry: 62, laag: "epidermaal" as const },
  { cx: 300, cy: 168, rx: 86, ry: 58, laag: "gemengd" as const },
  { cx: 466, cy: 124, rx: 96, ry: 64, laag: "dermaal" as const },
];

/** Onder de lamp neemt het contrast toe naarmate het pigment hoger zit. */
const CONTRAST: Record<Laag["id"], number> = {
  epidermaal: 0.86,
  gemengd: 0.55,
  dermaal: 0.3,
};

export default function Woodlamp() {
  const [positie, setPositie] = useState(GEBIEDEN.epidermaal);
  const [sleept, setSleept] = useState(false);
  const vlakRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  /** Welk gebied ligt het dichtst bij de lamp? Dat is wat je aan het bekijken bent. */
  const actief = (Object.keys(GEBIEDEN) as Laag["id"][]).reduce(
    (beste, id) => {
      const a = GEBIEDEN[id];
      const b = GEBIEDEN[beste];
      const da = (a.x - positie.x) ** 2 + (a.y - positie.y) ** 2;
      const db = (b.x - positie.x) ** 2 + (b.y - positie.y) ** 2;
      return da < db ? id : beste;
    },
    "epidermaal" as Laag["id"],
  );

  const laag = LAGEN.find((l) => l.id === actief)!;

  function verplaats(e: ReactPointerEvent<HTMLDivElement>) {
    const vlak = vlakRef.current;
    if (!vlak) return;
    const r = vlak.getBoundingClientRect();
    setPositie({
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    });
  }

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── Het vlak met de lamp ── */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-5 sm:p-7">
        <div
          ref={vlakRef}
          className="relative cursor-grab touch-none overflow-hidden rounded-[var(--r-sm)] active:cursor-grabbing"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setSleept(true);
            verplaats(e);
          }}
          onPointerMove={(e) => {
            if (sleept) verplaats(e);
          }}
          onPointerUp={() => setSleept(false)}
          onPointerCancel={() => setSleept(false)}
        >
          <svg
            viewBox="0 0 600 300"
            className="block w-full"
            aria-hidden="true"
          >
            <defs>
              {/* De lamp: alles buiten de cirkel blijft gewoon licht. */}
              <mask id={`${uid}-lamp`}>
                <rect width="600" height="300" fill="black" />
                <circle
                  cx={(positie.x / 100) * 600}
                  cy={(positie.y / 100) * 300}
                  r="86"
                  fill="white"
                />
              </mask>
            </defs>

            {/* Laag 1: hoe het er in gewoon licht uitziet. Alle drie de velden
                zien er hier hetzelfde uit, en dat is precies het probleem. */}
            <rect width="600" height="300" fill="var(--g-050)" />
            {VLEKKEN.map((v) => (
              <ellipse
                key={`gewoon-${v.laag}`}
                cx={v.cx}
                cy={v.cy}
                rx={v.rx}
                ry={v.ry}
                fill="var(--warn)"
                opacity="0.28"
              />
            ))}

            {/* Laag 2: hetzelfde vlak onder de lamp, alleen zichtbaar in de cirkel.
                Nu verschilt het contrast per veld, en dát bepaalt de uitkomst. */}
            <g mask={`url(#${uid}-lamp)`}>
              <rect width="600" height="300" fill="var(--g-900)" />
              {VLEKKEN.map((v) => (
                <ellipse
                  key={`lamp-${v.laag}`}
                  cx={v.cx}
                  cy={v.cy}
                  rx={v.rx}
                  ry={v.ry}
                  fill="var(--on-dark-accent)"
                  opacity={CONTRAST[v.laag]}
                />
              ))}
            </g>

            {/* De rand van de lamp. */}
            <circle
              cx={(positie.x / 100) * 600}
              cy={(positie.y / 100) * 300}
              r="86"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              opacity="0.9"
            />
          </svg>

          {/* De greep. Puur visueel: het slepen zit op het hele vlak. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[var(--r-pill)] border border-white/70 bg-white/15"
            style={{ left: `${positie.x}%`, top: `${positie.y}%` }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
              <path
                d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3.5"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--t-muted)]">
          Beweeg de lamp over de vlek om het verschil te zien. In gewoon licht
          lijkt alles gelijk; onder UV-licht niet.
        </p>

        {/* Slepen is nooit de enige weg. */}
        <div className="mt-5 pt-5">
          <Label>Of zet de lamp direct op</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {LAGEN.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={l.id === actief}
                onClick={() => setPositie(GEBIEDEN[l.id])}
                className={`diba-label min-h-12 rounded-[var(--r-pill)] px-5 transition-colors ${
                  l.id === actief
                    ? "diba-pill-active"
                    : "bg-[var(--g-050)] text-[var(--t-label)] hover:bg-[var(--g-100)]"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
              >
                {l.naam}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── De lezing ── */}
      <div aria-live="polite">
        <h3 className="diba-card-title-lg">{laag.naam}</h3>
        <p className="diba-label mt-3 text-[var(--t-muted)]">{laag.vakterm}</p>

        <dl className="mt-6 space-y-5">
          {[
            ["Wat je onder de lamp ziet", laag.onderDeLamp],
            ["Wat dat betekent", laag.watHetBetekent],
            ["Wat er mogelijk is", laag.watMogelijkIs],
          ].map(([kop, tekst]) => (
            <div key={kop} className="rounded-[var(--r-sm)] bg-white p-4">
              <dt className="diba-label">{kop}</dt>
              <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
                {publicCopy(tekst)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button
            href={`/intake?topic=melasma&diepte=${laag.id}`}
            variant={laag.vooruitzicht === "beperkt" ? "secundair" : "primair"}
          >
            {laag.vooruitzicht === "beperkt"
              ? "Laat eerlijk narekenen wat dit oplevert"
              : "Laat de diepte meten"}
          </Button>
          <Label
            className={`max-w-[24ch] ${VOORUITZICHT_KLEUR[laag.vooruitzicht]}`}
          >
            {laag.vooruitzicht === "goed"
              ? "Hier valt het meeste te halen"
              : laag.vooruitzicht === "matig"
                ? "Verbetering ja, schoon nee"
                : "Hier raden we het meestal af"}
          </Label>
        </div>

        <p className="mt-8 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
          {LAMP_UITLEG}
        </p>
      </div>
    </div>
  );
}
