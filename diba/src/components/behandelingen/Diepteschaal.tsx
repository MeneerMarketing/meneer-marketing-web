"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BEHANDELINGEN,
  HUIDLAGEN,
  VOORLOPIGE_PRIJZEN,
  diepte,
  type HuidlaagId,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De diepteschaal: alle vijf naast elkaar op één as.
 *
 * De huidreis erboven laat je één laag tegelijk zien. Dit laat ze alle vijf tegelijk zien,
 * en dat is een andere vraag: niet "wat komt hier" maar "hoe verhouden ze zich".
 *
 * Wat je in één blik ziet, en wat op geen enkele andere behandelpagina staat: de balken
 * worden langer naar rechts, en de hersteltijd eronder wordt langer in precies dezelfde
 * volgorde. Dat is geen toeval en geen marketing. Het is de reden dat deze pagina bestaat.
 *
 * De huidanalyse heeft geen balk. Dat gat is het punt: er gebeurt niets met je huid.
 */

/** Onderkant van elke laag als percentage. Zelfde schaal als de huidreis. */
const ONDER: Record<HuidlaagId, number> = {
  hoornlaag: 9,
  opperhuid: 27,
  "lederhuid-boven": 55,
  "lederhuid-diep": 100,
};

function tot(lagen: readonly HuidlaagId[]): number {
  if (lagen.length === 0) return 0;
  return ONDER[lagen[lagen.length - 1]];
}

export default function Diepteschaal() {
  const [zweef, setZweef] = useState<string | null>(null);
  const opDiepte = [...BEHANDELINGEN].sort((a, b) => diepte(a) - diepte(b));

  return (
    <div className="mt-12">
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:gap-6 sm:overflow-visible sm:px-0">
        {/* De laagnamen langs de as, één keer links. */}
        <div className="relative hidden w-[140px] shrink-0 sm:block" aria-hidden="true">
          <div className="relative h-[300px]">
            {HUIDLAGEN.map((l, i) => {
              const van = i === 0 ? 0 : ONDER[HUIDLAGEN[i - 1].id];
              return (
                <span
                  key={l.id}
                  className="absolute right-0 text-right text-[12px] leading-4 text-[var(--t-muted)]"
                  style={{ top: `calc(${van}% + 4px)` }}
                >
                  {l.naam}
                </span>
              );
            })}
          </div>
        </div>

        {/* De vijf kolommen. */}
        <ul className="relative grid min-w-[520px] flex-1 grid-cols-5 gap-3 sm:min-w-0 sm:gap-4">
          {/* Hulplijnen op de laaggrenzen, dwars over alle vijf. */}
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-[300px]"
            style={{ listStyle: "none" }}
          >
            {/* De lagen zelf, heel flauw. Alleen grenslijnen was te weinig: de namen
                links stonden dan tegen wit en er viel niets te herkennen. */}
            {HUIDLAGEN.map((l, i) => {
              const van = i === 0 ? 0 : ONDER[HUIDLAGEN[i - 1].id];
              return (
                <span
                  key={l.id}
                  className="absolute inset-x-0"
                  style={{
                    top: `${van}%`,
                    height: `${ONDER[l.id] - van}%`,
                    background: ["var(--g-010)", "var(--g-025)", "var(--g-050)", "var(--g-075)"][i],
                  }}
                />
              );
            })}
          </li>

          {opDiepte.map((b) => {
            const hoogte = tot(b.lagen);
            const aan = zweef === b.slug;
            return (
              <li key={b.slug}>
                <Link
                  href={`/behandelingen/${b.slug}`}
                  onPointerEnter={() => setZweef(b.slug)}
                  onPointerLeave={() => setZweef(null)}
                  onFocus={() => setZweef(b.slug)}
                  onBlur={() => setZweef(null)}
                  className="group block rounded-[var(--r-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--g-700)]"
                >
                  {/* De balk. Loopt vanaf de huidoppervlakte tot waar deze behandeling komt. */}
                  <span className="relative block h-[300px]">
                    <span
                      className="absolute inset-x-0 top-0 block rounded-b-[var(--r-sm)]"
                      style={{
                        height: `${hoogte}%`,
                        background: aan ? "var(--g-700)" : "var(--g-500)",
                        transition:
                          "height .4s var(--ease-diba), background-color .25s var(--ease-diba)",
                      }}
                    />
                    {hoogte === 0 ? (
                      <span className="absolute inset-x-0 top-0 flex h-8 items-center justify-center rounded-[var(--r-sm)] border border-dashed border-[var(--g-300)] text-[11px] text-[var(--t-muted)]">
                        niets
                      </span>
                    ) : null}
                  </span>

                  <span className="mt-4 block text-[14px] leading-5 font-medium text-[var(--t-strong)] sm:text-[15px]">
                    {b.naam}
                  </span>
                  <span className="mt-1 block min-h-[3.75rem] text-[12px] leading-4 text-[var(--t-muted)]">
                    {publicCopy(b.herstel)}
                  </span>
                  <span className="mt-2 block text-[14px] leading-5 font-medium text-[var(--t-strong)] tabular-nums">
                    € {b.prijs}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-10 max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
        Kijk naar de volgorde. De balken worden langer naar rechts, en de hersteltijd
        eronder wordt in precies dezelfde volgorde langer. Dat is geen toeval en geen
        marketing: het is dezelfde wet twee keer.
        {VOORLOPIGE_PRIJZEN
          ? " De bedragen zijn voorlopig en nog niet door de kliniek vastgesteld."
          : ""}
      </p>
    </div>
  );
}
