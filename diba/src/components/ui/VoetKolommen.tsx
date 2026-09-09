"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * De vier kolommen van de voettekst.
 *
 * Op desktop vier kolommen naast elkaar, zoals altijd. Op een telefoon stonden ze onder
 * elkaar: dertig links en twee schermen lang, onder elke pagina. Nu vier koppen die je
 * opent als je ze nodig hebt (Yasin, 9 september 2026: mobiel korter).
 */
export type VoetKolom = {
  readonly kop: string;
  readonly links: readonly { readonly label: string; readonly href: string }[];
};

export default function VoetKolommen({
  kolommen,
  kopKlasse,
  linkKlasse,
}: {
  kolommen: readonly VoetKolom[];
  kopKlasse: string;
  linkKlasse: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav
      aria-label="Voettekst"
      className="grid max-lg:divide-y max-lg:divide-[var(--g-100)] max-lg:border-y max-lg:border-[var(--g-100)] lg:grid-cols-4 lg:gap-10"
    >
      {kolommen.map((kolom) => {
        const isOpen = open === kolom.kop;
        const id = `voet-${kolom.kop.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        return (
          <div key={kolom.kop}>
            <h2 className={kopKlasse}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : kolom.kop)}
                className="flex min-h-12 w-full items-center justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] lg:hidden"
              >
                {kolom.kop}
                <svg
                  viewBox="0 0 12 12"
                  className={`h-3 w-3 shrink-0 text-[var(--g-700)] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
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
              <span className="hidden lg:inline">{kolom.kop}</span>
            </h2>
            <ul
              id={id}
              className={`space-y-2.5 lg:mt-5 ${
                isOpen ? "max-lg:pb-5" : "max-lg:hidden"
              }`}
            >
              {kolom.links.map((l) => (
                <li key={l.href}>
                  <Link prefetch={false} href={l.href} className={linkKlasse}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
