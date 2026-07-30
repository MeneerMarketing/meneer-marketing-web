"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { ACNE_TIJDLIJN } from "@/data/acne";

/**
 * De eerlijke tijdlijn, als bespeelbare lijn.
 *
 * Dit is De Lijn uit Addendum A4, precies zoals daar beschreven: één horizontale lijn
 * met één punt die meeschuift. Je beweegt over een fase en de punt glijdt erheen, de
 * lijn vult zich tot dat punt, en het paneel eronder wisselt.
 *
 * Fase één is bewust de startstand. Dat is de dip in week 1 en 2, en die is de reden dat
 * mensen te vroeg stoppen. Hem als eerste laten zien is eerlijker dan hem verstoppen —
 * en het is het enige moment op deze pagina waar oker mag (§5: oker voor aandacht,
 * nooit alarmrood voor iets dat geen fout is).
 */
export default function AcneTijdlijn() {
  const [actief, setActief] = useState(0);
  const fase = ACNE_TIJDLIJN[actief];
  const totaal = ACNE_TIJDLIJN.length;

  /** Midden van het segment van deze fase, als percentage van de lijn. */
  const positie = (i: number) => ((i + 0.5) / totaal) * 100;
  const kleur = fase.isDip ? "var(--warn)" : "var(--g-700)";

  return (
    <div className="mt-14">
      {/* ── De lijn met de schuivende punt ── */}
      <div className="relative">
        <div className="h-[1.5px] w-full bg-[var(--g-100)]" aria-hidden="true">
          <div
            className="h-full transition-[width,background-color] duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
            style={{ width: `${positie(actief)}%`, background: kleur }}
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-pill)] ring-4 ring-[var(--g-010)] transition-[left,background-color] duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
          style={{ left: `${positie(actief)}%`, background: kleur }}
        />

        {/* De vier grepen op de lijn. Tablist, dus pijltjes werken. */}
        <div
          role="tablist"
          aria-label="Fases in het acnetraject"
          className="grid grid-cols-2 gap-x-4 sm:grid-cols-4"
        >
          {ACNE_TIJDLIJN.map((f, i) => {
            const gekozen = i === actief;
            return (
              <button
                key={f.periode}
                role="tab"
                type="button"
                aria-selected={gekozen}
                aria-controls="tijdlijn-paneel"
                onClick={() => setActief(i)}
                onMouseEnter={() => setActief(i)}
                onFocus={() => setActief(i)}
                className="group min-h-12 pt-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                <span
                  className={`diba-label block transition-colors ${
                    gekozen
                      ? f.isDip
                        ? "text-[var(--warn-text)]"
                        : "text-[var(--g-700)]"
                      : "text-[var(--t-muted)]"
                  }`}
                >
                  {f.periode}
                </span>
                <span
                  className={`mt-1 block text-[15px] leading-6 transition-colors ${
                    gekozen ? "text-[var(--t-strong)]" : "text-[var(--t-body)]"
                  }`}
                >
                  {f.kop}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Het paneel van de actieve fase ── */}
      <div
        id="tijdlijn-paneel"
        role="tabpanel"
        aria-live="polite"
        className="mt-8 grid gap-6 rounded-[var(--r-md)] bg-white p-6 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10"
      >
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="diba-card-title-lg">{fase.kop}</h3>
            <span className="diba-label text-[var(--t-muted)]">{fase.periode}</span>
          </div>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">{fase.tekst}</p>
        </div>

        <div
          className="rounded-[var(--r-sm)] p-5"
          style={{ background: fase.isDip ? "#faf3e6" : "var(--g-050)" }}
        >
          <Label className={fase.isDip ? "text-[var(--warn-text)]" : undefined}>
            {fase.isDip ? "Let hier op" : "Wat wij dan doen"}
          </Label>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">{fase.watWijDoen}</p>
        </div>
      </div>
    </div>
  );
}
