"use client";

import { useId, useState } from "react";

/**
 * Op een telefoon ingeklapt, op desktop gewoon zichtbaar.
 *
 * Yasin, 9 september 2026: de site moet mobiel korter en op conversie, "ietsje minder
 * uitgebreid qua tekst". De tekst zelf is goed en hoort er te staan, ook voor Google.
 * Dus staat hij er, maar op een telefoon pas na een tik: de eerste alinea van een blok
 * blijft staan, de rest zit hierin en komt open met "Lees verder".
 *
 * Boven lg gebeurt er niets: de inhoud staat er zoals altijd en de knop bestaat niet.
 * Daarom is dit geen accordeon en ook geen "toon meer" op desktop, want daar is ruimte.
 */
export default function LeesVerder({
  children,
  label = "Lees verder",
  opDonker = false,
}: {
  children: React.ReactNode;
  label?: string;
  /** In een donkergroen vlak: de knop in de lichte accentkleur. */
  opDonker?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = `leesverder-${useId().replace(/:/g, "")}`;

  return (
    <>
      <div id={id} className={open ? "" : "max-lg:hidden"}>
        {children}
      </div>
      {open ? null : (
        <button
          type="button"
          aria-expanded={false}
          aria-controls={id}
          onClick={() => setOpen(true)}
          className={`diba-label mt-3 inline-flex min-h-11 items-center gap-1.5 underline underline-offset-4 lg:hidden ${
            opDonker
              ? "text-[var(--on-dark-accent)] active:text-white"
              : "text-[var(--g-700)] active:text-[var(--g-800)]"
          }`}
        >
          {label}
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" />
          </svg>
        </button>
      )}
    </>
  );
}
