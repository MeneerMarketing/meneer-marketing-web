"use client";

import { MIJN_DIBA } from "@/data/hoofdnavigatie";
import { useT } from "@/lib/gebruik-taal";
import { useRef } from "react";
import { useSluitBuiten } from "@/lib/sluit-buiten";

/**
 * Mijn Diba in de topbalk — het portaal dat er nog niet is.
 *
 * Het staat er al omdat het de kant is die we op gaan, en omdat een menu dat alleen toont
 * wat af is geen menu is maar een inventaris. Maar het is bewust geen link: er is niets
 * om naartoe te gaan, en een knop die op een lege pagina uitkomt is erger dan een knop
 * die zegt dat hij er nog niet is.
 *
 * Dus een uitklapje dat in drie regels vertelt wat het wordt. Zelfde `details`-vorm als
 * de taalkiezer ernaast, dus dezelfde bediening en geen JavaScript nodig.
 *
 * BESLUIT-OKAN: of dit portaal er komt en of het zo heet.
 */

export type MijnDibaProps = {
  /** Doorschijnend over een beeld: witte letters, geen eigen vlak. */
  opBeeld?: boolean;
};

export default function MijnDiba({ opBeeld = false }: MijnDibaProps) {
  const paneel = useRef<HTMLDetailsElement>(null);
  useSluitBuiten(paneel);
  const t = useT();
  return (
    <details ref={paneel} className="group relative">
      <summary
        className={`diba-label flex h-9 cursor-pointer list-none items-center gap-2 rounded-[var(--r-pill)] px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden ${
          opBeeld
            ? "border border-white/40 text-white hover:bg-white/15 focus-visible:outline-white"
            : "bg-[var(--g-050)] text-[var(--t-label)] hover:bg-[var(--g-100)] focus-visible:outline-[var(--g-700)]"
        }`}
      >
        {/* Het poppetje erfde zijn kleur niet: `--g-600` is donkergroen, en op de hero
            staat deze knop op een donkere foto. Yasin, 13 september 2026: "je ziet die
            bijna niet." Boven een beeld loopt hij nu mee met de witte letters ernaast. */}
        <svg
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 ${opBeeld ? "text-white" : "text-[var(--g-600)]"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="5.5" r="2.75" />
          <path d="M2.75 14c.6-2.6 2.7-4 5.25-4s4.65 1.4 5.25 4" />
        </svg>
        {t(MIJN_DIBA.label)}
      </summary>

      <div className="absolute right-0 z-[45] mt-2 w-72 rounded-[var(--r-sm)] border border-[var(--g-100)] bg-white p-5 shadow-[var(--shadow-float)]">
        <p className="diba-card-title text-[var(--t-strong)]">
          {t(MIJN_DIBA.kop)}
        </p>
        <ul className="mt-3 space-y-2">
          {MIJN_DIBA.regels.map((r) => (
            <li
              key={r}
              className="flex gap-2.5 text-[13px] leading-5 text-[var(--t-body)]"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[var(--r-pill)] bg-[var(--g-300)]"
              />
              {t(r)}
            </li>
          ))}
        </ul>
        {/* Bewust geen `diba-label`: een hele zin in kapitalen leest als geschreeuw. */}
        <p className="mt-4 border-t border-[var(--g-100)] pt-3 text-[12px] leading-5 text-[var(--t-muted)]">
          {t(MIJN_DIBA.voetnoot)}
        </p>
      </div>
    </details>
  );
}
