"use client";

import { useState } from "react";
import { prijsTekst, type Variant } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De prijs in de hero, als kiezer in plaats van als los getal.
 *
 * WAAROM DIT MOEST.
 *
 * Er stond "Per sessie" met daarachter het laagste tarief, terwijl er in de data drie
 * varianten zaten van 170, 190 en 220 euro. Dat is precies het trucje waar deze site
 * tegen is: het goedkoopste getal laten zien en de rest pas noemen als iemand al zit.
 * Alle tarieven staan hier nu naast elkaar, en het duurste is even zichtbaar als het
 * goedkoopste.
 *
 * WAAROM HET IN HET DONKERE BLOK ZIT.
 *
 * Een aparte prijstabel eronder zou een derde donker vlak op deze pagina zijn, en dat
 * mag niet (§5). Belangrijker: een prijslijst verderop is alsnog een lijst die je moet
 * gaan zoeken. De duurdere variant hoort op dezelfde plek als de goedkope, in hetzelfde
 * blok, op hetzelfde moment.
 *
 * Er staat geen enkele variant voorgeselecteerd als "aanbevolen" en ze staan in de
 * volgorde van de tarievenlijst, niet op prijs gesorteerd. Welke er past bepaalt een
 * mens na de meting, en een sterretje bij de duurste is een verkoopargument vermomd
 * als advies.
 */

type Props = {
  readonly varianten: readonly Variant[];
  /** Het tarief dat geldt als er geen varianten zijn. */
  readonly basisprijs: number;
};

export default function Variantkiezer({ varianten, basisprijs }: Props) {
  const [gekozen, setGekozen] = useState(0);

  /* Zonder varianten is er niets te kiezen: dan is het gewoon een getal. */
  if (varianten.length === 0) {
    return (
      <div className="flex items-baseline justify-between gap-6">
        <span className="diba-label diba-label-on-dark">Per sessie</span>
        <span className="diba-card-title text-right tabular-nums">
          {prijsTekst(basisprijs)}
        </span>
      </div>
    );
  }

  const actief = varianten[gekozen];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-6">
        <span className="diba-label diba-label-on-dark">
          {varianten.length === 1
            ? "Per sessie"
            : `Per sessie · ${varianten.length} varianten`}
        </span>
        <span className="diba-card-title text-right tabular-nums">
          {prijsTekst(actief.prijs)}
        </span>
      </div>

      {varianten.length > 1 ? (
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Kies een variant"
        >
          {varianten.map((v, i) => {
            const aan = i === gekozen;
            return (
              <button
                key={v.naam}
                type="button"
                onClick={() => setGekozen(i)}
                aria-pressed={aan}
                className={`inline-flex min-h-11 items-center gap-2 rounded-[var(--r-pill)] px-4 text-[14px] leading-5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--on-dark-btn)] ${
                  aan
                    ? "bg-[var(--on-dark-btn)] font-medium text-[var(--on-dark-btn-text)]"
                    : "border border-white/30 text-[var(--on-dark-body)] hover:border-white/60"
                }`}
              >
                {publicCopy(v.naam)}
                <span className="tabular-nums opacity-80">
                  {prijsTekst(v.prijs)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {actief.bij ? (
        <p className="mt-4 text-[14px] leading-6 text-[var(--on-dark-body)]">
          {publicCopy(actief.bij)}
        </p>
      ) : null}
    </div>
  );
}
