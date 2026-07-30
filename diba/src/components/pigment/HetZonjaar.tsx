"use client";

import { useState, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { ZONJAAR } from "@/data/pigment";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Het zonjaar — de uitblinker van de pigmentpagina.
 *
 * Bij pigment bepaalt UV bijna alles, en in Nederland is juni starten weggegooid geld:
 * je behandelt dan vier maanden tegen de zon in. Bijna elke kliniek verkoopt juist in de
 * zomer het hardst. Deze sectie doet het omgekeerde en zegt op de pagina zelf dat je
 * beter wacht. Dat is A7 in de praktijk en het is precies waarom dit hier hoort.
 *
 * Het detail dat het af maakt: de kalender weet welke maand het is en zet die maand
 * meteen open. Kom je hier in juni, dan is het eerste wat je leest dat dit het slechtste
 * moment van het jaar is.
 *
 * De huidige maand komt via useSyncExternalStore en niet via new Date() in de render:
 * dat laatste zou tussen server en client kunnen verschillen rond een maandgrens. Op de
 * server is de uitkomst null, en dan valt de kalender terug op oktober — het beste
 * startmoment, dus een zinnige standaard.
 */

const BESTE_MAAND = 9; // oktober

function useHuidigeMaand(): number | null {
  return useSyncExternalStore(
    () => () => {},
    () => new Date().getMonth(),
    () => null,
  );
}

const STAAF_KLEUR = {
  goed: "var(--g-700)",
  kan: "var(--warn)",
  "liever-niet": "var(--error)",
} as const;

const ADVIES_LABEL = {
  goed: "Goed startmoment",
  kan: "Kan, met voorbehoud",
  "liever-niet": "Liever niet nu",
} as const;

const ADVIES_TEKSTKLEUR = {
  goed: "text-[var(--g-700)]",
  kan: "text-[var(--warn-text)]",
  "liever-niet": "text-[var(--error)]",
} as const;

export default function HetZonjaar() {
  const huidigeMaand = useHuidigeMaand();
  const [gekozenDoorGebruiker, setGekozen] = useState<number | null>(null);

  // Voorkeur: wat de gebruiker aanklikte, anders deze maand, anders oktober.
  const actief = gekozenDoorGebruiker ?? huidigeMaand ?? BESTE_MAAND;
  const maand = ZONJAAR[actief];
  const maxUv = Math.max(...ZONJAAR.map((m) => m.uv));

  return (
    <div className="mt-12">
      <div className="rounded-[var(--r-md)] bg-white p-5 sm:p-8">
        {/* ── De staven ── */}
        <div
          role="tablist"
          aria-label="Maanden van het jaar, met de UV-belasting in Nederland"
          className="flex items-end gap-1.5 sm:gap-2.5"
        >
          {ZONJAAR.map((m, i) => {
            const gekozen = i === actief;
            const isNu = i === huidigeMaand;
            return (
              <button
                key={m.naam}
                role="tab"
                type="button"
                aria-selected={gekozen}
                aria-controls="zonjaar-paneel"
                aria-label={`${m.naam}, UV-index ${m.uv}. ${ADVIES_LABEL[m.start]}`}
                onClick={() => setGekozen(i)}
                onMouseEnter={() => setGekozen(i)}
                onFocus={() => setGekozen(i)}
                className="group flex flex-1 flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                {/* "Nu"-markering, alleen boven de staaf van déze maand. De hoogte staat
                    vast zodat de staven niet verschuiven; de tekst staat er niet twaalf
                    keer onzichtbaar in, want dan leest een screenreader hem twaalf keer. */}
                <span className="mb-1.5 h-[15px]" aria-hidden={!isNu}>
                  {isNu ? (
                    <span className="diba-label whitespace-nowrap text-[var(--t-strong)]">
                      Nu
                    </span>
                  ) : null}
                </span>

                <span
                  className="w-full rounded-t-[6px] transition-all duration-400 ease-[var(--ease-diba)] motion-reduce:transition-none"
                  style={{
                    height: `${28 + (m.uv / maxUv) * 122}px`,
                    background: STAAF_KLEUR[m.start],
                    opacity: gekozen ? 1 : 0.32,
                  }}
                  aria-hidden="true"
                />

                <span
                  className={`diba-label mt-2.5 transition-colors ${
                    gekozen ? "text-[var(--t-strong)]" : "text-[var(--t-muted)]"
                  }`}
                >
                  {m.kort}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legenda: verklaart de kleuren zonder dat je erop moet klikken. */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--g-100)] pt-5">
          {(["goed", "kan", "liever-niet"] as const).map((k) => (
            <span key={k} className="diba-label flex items-center gap-2 text-[var(--t-muted)]">
              <span
                className="h-2.5 w-2.5 rounded-[var(--r-pill)]"
                style={{ background: STAAF_KLEUR[k] }}
                aria-hidden="true"
              />
              {ADVIES_LABEL[k]}
            </span>
          ))}
          <span className="diba-label text-[var(--t-muted)]">
            Staafhoogte = gemiddelde UV-index
          </span>
        </div>
      </div>

      {/* ── Het paneel van de gekozen maand ── */}
      <div
        id="zonjaar-paneel"
        role="tabpanel"
        aria-live="polite"
        className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8"
      >
        <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="diba-card-title-lg">{maand.naam}</h3>
            <span className="diba-label text-[var(--t-muted)] tabular-nums">
              UV-index {maand.uv.toFixed(1)}
            </span>
          </div>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(maand.watGebeurt)}
          </p>
        </div>

        <div className="rounded-[var(--r-md)] bg-[var(--g-075)] p-6 sm:p-8">
          <Label className={ADVIES_TEKSTKLEUR[maand.start]}>{ADVIES_LABEL[maand.start]}</Label>
          <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
            {maand.startAdvies}
          </p>

          {maand.start === "liever-niet" ? (
            <p className="mt-4 text-sm leading-6 text-[var(--t-muted)]">
              We zeggen dit ook aan de telefoon. Je mag wel nu al de nulmeting doen, dan
              staan we in september klaar met een vertrekpunt.
            </p>
          ) : null}

          <Button
            href={`/intake?topic=pigment&maand=${maand.kort}`}
            variant={maand.start === "liever-niet" ? "secundair" : "primair"}
            className="mt-6"
          >
            {maand.start === "liever-niet" ? "Alleen de nulmeting doen" : "Plan je nulmeting"}
          </Button>
        </div>
      </div>
    </div>
  );
}
