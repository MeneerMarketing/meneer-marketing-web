"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { STAPPEN } from "@/data/intake";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De tijdlijn van het uur — de uitblinker van de intakepagina.
 *
 * De twijfel voor een intake gaat zelden over de meting. Hij gaat over de vraag of je
 * straks met een verkoopgesprek en een pakket de deur uitloopt. Daar helpt een
 * geruststellende zin niet tegen; daar helpt alleen laten zien hoe het uur is opgebouwd.
 *
 * Vandaar de derde kolom: bij elke stap staat wat je op dat moment níet hoeft. Niet één
 * keer onderaan als voorwaarde, maar vijf keer, op de plek waar de twijfel zit. Dat is het
 * enige wat deze tijdlijn anders maakt dan die van elke andere kliniek, en het is genoeg.
 *
 * Toegankelijkheid: de stappen zijn gewone knoppen in volgorde, en de lezing staat in een
 * live region. De verticale lijn is versiering.
 */

export default function Uurtijdlijn() {
  const [actief, setActief] = useState(0);
  const stap = STAPPEN[actief];

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
      {/* ── De stappen ── */}
      <ol className="self-start">
        {STAPPEN.map((s, i) => {
          const aan = i === actief;
          const laatste = i === STAPPEN.length - 1;
          return (
            <li key={s.id} className="relative flex gap-4">
              {/* De lijn die de stappen verbindt. */}
              <span aria-hidden="true" className="flex flex-col items-center">
                <span
                  className={`mt-4 block h-3 w-3 shrink-0 rounded-[var(--r-pill)] transition-colors ${
                    aan ? "bg-[var(--g-700)]" : "bg-[var(--g-200)]"
                  }`}
                />
                {!laatste ? (
                  <span className="w-px grow bg-[var(--g-200)]" />
                ) : null}
              </span>

              <button
                type="button"
                aria-pressed={aan}
                onClick={() => setActief(i)}
                className={`mb-1 w-full rounded-[var(--r-sm)] px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan ? "bg-white" : "hover:bg-white/60"
                }`}
              >
                <span className="diba-label block text-[var(--t-muted)]">
                  {s.tijd}
                </span>
                <span
                  className={`diba-card-title mt-1 block ${
                    aan ? "text-[var(--t-strong)]" : "text-[var(--t-body)]"
                  }`}
                >
                  {s.naam}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ── De lezing ── */}
      <div aria-live="polite" className="self-start">
        <Label>{stap.tijd}</Label>
        <h3 className="diba-card-title-lg mt-4">{stap.naam}</h3>

        <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
          {publicCopy(stap.watErGebeurt)}
        </p>

        {/* De kolom die deze tijdlijn anders maakt dan die van iedereen. */}
        <div className="mt-7 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5">
          <Label>Wat je hier niet hoeft</Label>
          <p className="mt-3 text-[16px] leading-7 text-[var(--t-strong)]">
            {stap.nietNodig}
          </p>
        </div>
      </div>
    </div>
  );
}
