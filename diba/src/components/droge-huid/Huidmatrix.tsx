"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Button from "@/components/ui/Button";
import { AS_UITLEG, KWADRANTEN, bepaalKwadrant } from "@/data/droge-huid";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_GELIJK } from "@/lib/raster";

/**
 * De huidmatrix — de uitblinker van de pagina over een droge huid.
 *
 * Droog en uitgedroogd worden voortdurend door elkaar gehaald, en dat kost mensen jaren
 * aan producten die het verkeerde probleem oplossen. De reden dat de verwarring blijft
 * bestaan is dat het overal als één schaal wordt gepresenteerd: van vet naar droog. Zo is
 * het niet. Het zijn twee onafhankelijke assen, en een vette huid kan uitgedroogd zijn.
 *
 * Een schuifbalk zou die fout bevestigen. Dus is het een vlak: je zet jezelf ergens neer
 * en merkt vanzelf dat de twee richtingen los van elkaar bewegen. De vorm ís het argument.
 *
 * Toegankelijkheid: het punt is een echte knop die op de pijltjestoetsen reageert, dus
 * slepen is nooit de enige weg. De uitkomst wordt aangekondigd door de live region met de
 * lezing, want voor een besturing met twee assen tegelijk bestaat geen standaard ARIA-rol.
 */

const STAP = 6;

export default function Huidmatrix() {
  const [punt, setPunt] = useState({ x: 62, y: 58 });
  const [sleept, setSleept] = useState(false);
  const vlakRef = useRef<HTMLDivElement>(null);

  const kwadrant = KWADRANTEN[bepaalKwadrant(punt.x, punt.y)];

  function verplaats(e: PointerEvent<HTMLDivElement>) {
    const vlak = vlakRef.current;
    if (!vlak) return;
    const r = vlak.getBoundingClientRect();
    setPunt({
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    });
  }

  function opToets(e: KeyboardEvent<HTMLButtonElement>) {
    const richting: Record<string, [number, number]> = {
      ArrowLeft: [-STAP, 0],
      ArrowRight: [STAP, 0],
      ArrowUp: [0, -STAP],
      ArrowDown: [0, STAP],
    };
    const d = richting[e.key];
    if (!d) return;
    e.preventDefault();
    setPunt((p) => ({
      x: Math.min(100, Math.max(0, p.x + d[0])),
      y: Math.min(100, Math.max(0, p.y + d[1])),
    }));
  }

  return (
    <div className={`mt-12 ${RASTER_GELIJK}`}>
      {/* ── Het vlak ── */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-5 sm:p-7">
        {/* De vier aslabels staan elk aan hun eigen kant. Stonden ze alle drie op één
            rij boven het vlak, dan las het als drie labels van dezelfde as. */}
        <div className="diba-label text-center text-[var(--t-label)]">
          {AS_UITLEG.y.boven}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="diba-label [writing-mode:vertical-rl] rotate-180 text-[var(--t-muted)]">
            {AS_UITLEG.x.links}
          </span>

          <div
            ref={vlakRef}
            className="relative aspect-square w-full touch-none rounded-[var(--r-sm)] bg-[var(--g-050)]"
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
            {/* De vier vakken, met het actieve vak opgelicht. */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-[var(--r-sm)]">
              {(["normaal", "droog", "uitgedroogd", "beide"] as const).map(
                (id) => (
                  <span
                    key={id}
                    className={`flex items-start justify-center p-3 transition-colors duration-300 motion-reduce:transition-none ${
                      kwadrant.id === id ? "bg-[var(--g-100)]" : "bg-white"
                    }`}
                  >
                    <span
                      className={`diba-label text-center ${
                        kwadrant.id === id
                          ? "text-[var(--g-700)]"
                          : "text-[var(--t-muted)]"
                      }`}
                    >
                      {KWADRANTEN[id].naam}
                    </span>
                  </span>
                ),
              )}
            </div>

            {/* Assen door het midden: de twee richtingen zijn los van elkaar. */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[var(--g-200)]" />
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[var(--g-200)]" />

            {/* Het punt. Een echte knop, dus de pijltjestoetsen werken.
                Geen aria-valuetext: dat werkt alleen bij rollen als slider en wordt op
                een knop genegeerd. Voor twee assen tegelijk bestaat geen standaardrol,
                dus doet de live region rechts het werk: die noemt het kwadrant zodra het
                verandert. */}
            <button
              type="button"
              onKeyDown={opToets}
              aria-label="Zet jezelf in de matrix. Gebruik de pijltjestoetsen; de uitkomst staat rechts."
              className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-[var(--r-pill)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] active:cursor-grabbing"
              style={{ left: `${punt.x}%`, top: `${punt.y}%` }}
            >
              {/* De greep: een groene schijf met een witte erin, geen witte schijf met
                  een rand eromheen. Ziet er hetzelfde uit en houdt de tekening vrij van
                  randen, net als de rest van de site. */}
              <span className="absolute top-1/2 left-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-pill)] bg-[var(--g-700)] shadow-[var(--shadow-float)]">
                <span className="absolute inset-[3px] block rounded-[var(--r-pill)] bg-white" />
              </span>
            </button>
          </div>

          <span className="diba-label [writing-mode:vertical-rl] text-[var(--t-muted)]">
            {AS_UITLEG.x.rechts}
          </span>
        </div>

        <div className="diba-label mt-2 text-center text-[var(--t-label)]">
          {AS_UITLEG.y.onder}
        </div>

        <dl className="mt-6 space-y-3 pt-5">
          <div className="flex gap-4">
            <dt className="diba-label w-16 shrink-0">{AS_UITLEG.x.label}</dt>
            <dd className="text-sm leading-6 text-[var(--t-body)]">
              {AS_UITLEG.x.tekst}
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="diba-label w-16 shrink-0">{AS_UITLEG.y.label}</dt>
            <dd className="text-sm leading-6 text-[var(--t-body)]">
              {AS_UITLEG.y.tekst}
            </dd>
          </div>
        </dl>
      </div>

      {/* ── De lezing ── */}
      <div aria-live="polite">
        <h3 className="diba-card-title-lg">{kwadrant.naam}</h3>
        <p className="diba-label mt-3 text-[var(--t-muted)]">
          {kwadrant.vakterm}
        </p>

        <dl className="mt-6 space-y-5">
          {[
            ["Hoe je dit herkent", kwadrant.herken],
            ["Waar het vandaan komt", kwadrant.oorzaak],
            ["Wat er dan moet gebeuren", kwadrant.aanpak],
          ].map(([kop, tekst]) => (
            <div key={kop} className="rounded-[var(--r-sm)] bg-white p-4">
              <dt className="diba-label">{kop}</dt>
              <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
                {publicCopy(tekst)}
              </dd>
            </div>
          ))}
        </dl>

        {/* In het rustige kwadrant staat er geen afspraakknop. Er valt niets te halen. */}
        <div className="mt-7">
          {kwadrant.urgentie === "rustig" ? (
            <p className="text-[16px] leading-7 text-[var(--t-strong)]">
              Hier houdt het op. Zit je echt in dit vak, dan kost een
              behandeling je geld zonder dat er iets te winnen valt, en dan
              zeggen we dat liever nu.
            </p>
          ) : (
            <Button href={`/intake?topic=droge-huid&kwadrant=${kwadrant.id}`}>
              Laat meten waar je echt zit
            </Button>
          )}
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--t-muted)]">
          Twijfel je tussen twee vakken? Kijk naar het seizoen. De wateras
          beweegt mee met de winter, de vetas nauwelijks.
        </p>
      </div>
    </div>
  );
}
