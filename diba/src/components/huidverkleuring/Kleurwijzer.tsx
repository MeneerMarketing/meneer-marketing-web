"use client";

import Link from "next/link";
import { useState } from "react";
import Label from "@/components/ui/Label";
import { KLEUREN, KLEUR_UITLEG } from "@/data/huidverkleuring";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De kleurwijzer — de uitblinker van de pagina over huidverkleuring.
 *
 * Deze pagina behandelt niets, hij sorteert. Mensen zoeken op "verkleuring" omdat ze de
 * goede term niet kennen, en dan is de nuttigste vraag precies de vraag die een behandelaar
 * als eerste stelt: welke kleur. Die zegt namelijk iets over de laag waarin het zit, en dus
 * over wat er mogelijk is.
 *
 * Vandaar vier stalen in plaats van een lijst met aandoeningsnamen. Je hoeft geen woord te
 * kennen om te kunnen kiezen, en dat is het hele punt van een wegwijzer.
 *
 * Bij twee kleuren staat de huisarts tussen de uitkomsten. Die staat er niet onderaan als
 * disclaimer maar ertussen als gelijkwaardige route, want dat is hij ook.
 */

export default function Kleurwijzer() {
  const [actief, setActief] = useState(0);
  const kleur = KLEUREN[actief];

  return (
    <div className="mt-12">
      {/* De vier stalen. Kiezen zonder dat je een term hoeft te kennen. */}
      <div
        role="tablist"
        aria-label="Kleur van de verkleuring"
        className="flex flex-wrap gap-3"
      >
        {KLEUREN.map((k, i) => (
          <button
            key={k.id}
            role="tab"
            type="button"
            aria-selected={i === actief}
            onClick={() => setActief(i)}
            className={`flex min-h-12 items-center gap-3 rounded-[var(--r-pill)] py-2 pr-5 pl-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
              i === actief
                ? "diba-pill-active"
                : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
            }`}
          >
            <span
              aria-hidden="true"
              className="block h-7 w-7 shrink-0 rounded-[var(--r-pill)] border border-white/40"
              style={{ background: k.staal }}
            />
            <span className="diba-label">{k.naam}</span>
          </button>
        ))}
      </div>

      <div className={`mt-10 ${RASTER_SECTIE}`} aria-live="polite">
        {/* ── Wat die kleur betekent ── */}
        <div className="self-start rounded-[var(--r-md)] bg-white p-6 sm:p-8">
          <Label>Wat deze kleur betekent</Label>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(kleur.watHetIs)}
          </p>
          <p className="mt-6 pt-5 text-[16px] leading-7 text-[var(--t-strong)]">
            {kleur.vraag}
          </p>
        </div>

        {/* ── Waar het dan over gaat ── */}
        <div>
          <Label>Dan gaat het waarschijnlijk hierover</Label>
          <ul className="mt-5 space-y-3">
            {kleur.routes.map((r) => (
              <li key={r.naam}>
                <Link
                  href={r.pad}
                  className="block rounded-[var(--r-sm)] bg-white p-5 transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="diba-card-title block">{r.naam}</span>
                  <span className="mt-1.5 block text-[15px] leading-7 text-[var(--t-body)]">
                    {r.wanneer}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 max-w-[80ch] rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
        {KLEUR_UITLEG}
      </p>
    </div>
  );
}
