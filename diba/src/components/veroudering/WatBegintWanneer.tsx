"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { FASES, FASE_ADVIES, PROCESSEN, type Stand } from "@/data/veroudering";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Wat begint wanneer — de tweede interactie op de pagina over huidveroudering.
 *
 * Bewust een andere vorm dan de onderarmtest erboven: daar veeg je over een beeld, hier
 * tik je een levensfase aan en zie je vijf sporen tegelijk verspringen. Twee interacties
 * op één pagina mogen niet hetzelfde aanvoelen.
 *
 * Het argument zit in de kleur, niet in de tekst: sporen die door zon komen kleuren oker,
 * sporen die door tijd komen groen. Bij elke fase zie je in één oogopslag dat het
 * merendeel van wat je in de spiegel "ouder" noemt aan de okerkant staat, en dat is
 * precies de kant met een knop.
 *
 * Geen cijfers. We meten deze processen niet per leeftijd, dus we zetten er ook geen
 * percentage omheen; drie standen in woorden is wat we eerlijk kunnen zeggen (A7).
 */

const STAND_SEGMENTEN: Record<Stand, number> = {
  "nog-niet": 0,
  loopt: 1,
  zichtbaar: 3,
};

const STAND_TEKST: Record<Stand, string> = {
  "nog-niet": "Nog niet aan de orde",
  loopt: "Loopt, meestal nog onzichtbaar",
  zichtbaar: "Zichtbaar",
};

const BRON_LABEL = {
  tijd: "Tijd",
  zon: "Zon",
  allebei: "Tijd en zon",
} as const;

/** Oker is het zonspoor, groen het tijdspoor. Vaste kleur per rij, dus geen transitie. */
const BRON_VULLING = {
  tijd: "bg-[var(--g-600)]",
  zon: "bg-[var(--warn)]",
  allebei: "bg-[var(--g-400)]",
} as const;

/* Het chipvlak is overal gelijk; alleen de letterkleur verschilt. De balkjes dragen het
   kleurverschil al, en een tweede warm vlak zou een extra tint in de huisstijl smokkelen. */
const BRON_CHIP = {
  tijd: "text-[var(--t-label)]",
  zon: "text-[var(--warn-text)]",
  allebei: "text-[var(--t-label)]",
} as const;

export default function WatBegintWanneer() {
  const [index, setIndex] = useState(1); // 30 tot 40: waar de meeste mensen dit gaan zoeken
  const fase = FASES[index];
  const advies = FASE_ADVIES[fase.id];

  return (
    <div className="mt-12">
      {/* Fasekiezer. Tikken, geen schuiven: dit zijn losse fases en geen doorlopende as. */}
      <div
        role="tablist"
        aria-label="Levensfase"
        className="flex flex-wrap gap-2"
      >
        {FASES.map((f, i) => (
          <button
            key={f.id}
            role="tab"
            type="button"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`diba-label min-h-12 rounded-[var(--r-pill)] px-5 transition-colors ${
              i === index
                ? "diba-pill-active"
                : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* De vijf sporen. */}
        <ul className="space-y-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)]">
          {PROCESSEN.map((p) => {
            const stand = p.standen[index];
            const gevuld = STAND_SEGMENTEN[stand];
            return (
              <li key={p.id} className="bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <h3 className="diba-card-title">{p.naam}</h3>
                  <span
                    className={`diba-label rounded-[var(--r-pill)] bg-[var(--g-050)] px-3 py-1 ${BRON_CHIP[p.bron]}`}
                  >
                    {BRON_LABEL[p.bron]}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((s) => (
                      <span
                        key={s}
                        className={`h-2 w-10 rounded-[var(--r-pill)] transition-colors duration-300 motion-reduce:transition-none ${
                          s < gevuld
                            ? BRON_VULLING[p.bron]
                            : "bg-[var(--g-100)]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--t-muted)]">
                    {STAND_TEKST[stand]}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                  {publicCopy(p.uitleg)}
                </p>
                <p className="diba-label mt-2 text-[var(--t-muted)]">
                  {p.vakterm}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Het advies bij deze fase. */}
        <div aria-live="polite" className="lg:sticky lg:top-24 lg:self-start">
          <Label>Wat wij hier zouden zeggen</Label>
          <h3 className="diba-card-title-lg mt-4">{advies.kop}</h3>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
            {advies.tekst}
          </p>

          <div className="mt-8 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
            <Label>Waarom de kleur ertoe doet</Label>
            <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
              Tel de okeren balkjes. Dat is het deel van wat je ziet dat door
              zon komt, en daarmee het deel waar vandaag nog iets aan te doen
              valt. De groene balkjes lopen door wat je ook kiest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
