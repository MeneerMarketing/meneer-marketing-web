"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { ACNE_TYPES } from "@/data/acne";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * "Welke acne heb jij?" — de kern van de pagina.
 *
 * Acne is geen één ding, en juist het type bepaalt wat er wél helpt. De meeste
 * acnepagina's gooien alles op één hoop en beloven daarna één oplossing. Hier kies je
 * je eigen beeld en zie je meteen wat dat betekent, inclusief de gevallen waarin we
 * doorverwijzen in plaats van behandelen.
 *
 * Toetsenbord: de knoppen zijn een radiogroup, dus tabben en pijltjes werken. Elke
 * knop is minimaal 48px hoog (§13).
 */
export default function AcneTypeKiezer() {
  const [actief, setActief] = useState(0);
  const type = ACNE_TYPES[actief];

  return (
    <div className={`mt-10 ${RASTER_SECTIE}`}>
      <div
        role="radiogroup"
        aria-label="Kies het beeld dat het dichtst bij jouw huid komt"
      >
        <ul className="space-y-2">
          {ACNE_TYPES.map((t, i) => {
            const gekozen = i === actief;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={gekozen}
                  onClick={() => setActief(i)}
                  className={`flex min-h-12 w-full flex-col items-start gap-0.5 rounded-[var(--r-sm)] px-4 py-3.5 text-left transition ${
                    gekozen
                      ? "bg-[var(--g-700)] text-white"
                      : "bg-[var(--g-050)] hover:bg-[var(--g-075)]"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
                >
                  <span className="text-[15px] font-medium leading-6">
                    {t.naam}
                  </span>
                  <span
                    className={`text-sm leading-5 ${
                      gekozen
                        ? "text-[var(--on-dark-body)]"
                        : "text-[var(--t-body)]"
                    }`}
                  >
                    {t.klanttaal}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Het antwoordpaneel. aria-live zodat een screenreader de wisseling meekrijgt. */}
      <div
        className="rounded-[var(--r-md)] bg-white p-6 sm:p-8"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="diba-card-title-lg">{type.naam}</h3>
          <span className="diba-label text-[var(--t-muted)]">
            {type.vakterm}
          </span>
        </div>

        <dl className="mt-6 space-y-5">
          {[
            ["Wat je ziet", type.watJeZiet],
            ["Wat het betekent", type.watHetBetekent],
            ["Wat wij eerst doen", type.watWijEersteDoen],
          ].map(([kop, tekst]) => (
            <div key={kop} className="rounded-[var(--r-sm)] bg-[var(--g-025)] p-4">
              <dt className="diba-label">{kop}</dt>
              <dd className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(tekst)}
              </dd>
            </div>
          ))}
        </dl>

        {/* Het misverstand dat bij dit type het vaakst voorkomt. Dit is de plek waar de
            pagina iets wegneemt in plaats van iets uitlegt. */}
        <div className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-075)] p-5">
          <Label>Wat mensen hier vaak verkeerd hebben</Label>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(type.verwarMetNiet)}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href={`/intake?topic=acne&beeld=${type.id}`}>
            Laat dit beeld bekijken
          </Button>
          <Label className="max-w-[24ch]">
            Weet je het niet zeker? Dan kiezen we het samen.
          </Label>
        </div>
      </div>
    </div>
  );
}
