"use client";

import Link from "next/link";
import { useState } from "react";
import Label from "@/components/ui/Label";
import {
  BESTEMMINGEN,
  KENMERKEN,
  SPOED_TEKST,
  ZOEKER_LEEG,
} from "@/data/symptoomzoeker";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De zoeker — de wegwijzer over alle huidprobleempagina's heen.
 *
 * Vijftien pagina's zijn er te veel om doorheen te bladeren als je niet weet hoe je het
 * noemt, en dat is precies de situatie waarin de meeste mensen binnenkomen: ze weten wat
 * ze zien en niet hoe het heet.
 *
 * Dus staat er geen lijst met aandoeningen maar een lijst met wat je ziet en voelt. Je
 * kruist aan wat er speelt en de bestemmingen schuiven in volgorde van hoeveel ze dekken.
 * Geen enkel woord aan de linkerkant is een vakterm.
 *
 * Twee kenmerken gedragen zich anders: "een plekje dat verandert" en "ik voel me er ziek
 * bij" zetten de huisarts bovenaan, wat er verder ook is aangevinkt. Die staan dus niet
 * onderaan als kleine letters maar boven de uitkomst.
 *
 * Anders dan de kleurwijzer op de verkleuringspagina: die splitst op één as en toont een
 * vaste lijst. Deze filtert op meerdere kenmerken tegelijk en rangschikt.
 */

export default function Zoeker() {
  const [gekozen, setGekozen] = useState<ReadonlySet<string>>(new Set());

  const spoed = KENMERKEN.some((k) => k.urgent && gekozen.has(k.id));

  /* Rangschikken op overlap. Bij gelijke score blijft de volgorde uit de data staan, en
     die loopt van meest naar minst gezocht. */
  const treffers = BESTEMMINGEN.map((b) => ({
    ...b,
    score: b.kenmerken.filter((k) => gekozen.has(k)).length,
  }))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score);

  function wissel(id: string) {
    setGekozen((v) => {
      const n = new Set(v);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      {/* ── Wat je ziet ── */}
      <div className="self-start">
        <Label>Wat zie of voel je</Label>
        <ul className="mt-5 flex flex-wrap gap-2">
          {KENMERKEN.map((k) => {
            const aan = gekozen.has(k.id);
            return (
              <li key={k.id}>
                <button
                  type="button"
                  aria-pressed={aan}
                  onClick={() => wissel(k.id)}
                  className={`min-h-12 rounded-[var(--r-pill)] px-4 text-[15px] leading-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    aan
                      ? "bg-[var(--g-700)] text-[var(--on-dark)]"
                      : "bg-white text-[var(--t-body)] hover:bg-[var(--g-050)]"
                  }`}
                >
                  {k.tekst}
                </button>
              </li>
            );
          })}
        </ul>

        {gekozen.size > 0 ? (
          <button
            type="button"
            onClick={() => setGekozen(new Set())}
            className="diba-label mt-6 underline underline-offset-4 hover:text-[var(--g-700)]"
          >
            Begin opnieuw
          </button>
        ) : null}
      </div>

      {/* ── Waar je dan moet zijn ── */}
      <div aria-live="polite">
        {spoed ? (
          <div className="mb-6 rounded-[var(--r-md)] bg-[var(--g-700)] p-6 text-[var(--on-dark)] sm:p-8">
            <Label opDonker>Dit gaat voor</Label>
            <h3 className="diba-card-title-lg mt-4">{SPOED_TEKST.kop}</h3>
            <p className="mt-4 text-[16px] leading-7 text-[var(--on-dark-body)]">
              {publicCopy(SPOED_TEKST.tekst)}
            </p>
          </div>
        ) : null}

        {gekozen.size === 0 ? (
          <p className="max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            {ZOEKER_LEEG}
          </p>
        ) : (
          <>
            <Label>
              {treffers.length === 1
                ? "Eén pagina past hierbij"
                : `${treffers.length} pagina's passen hierbij`}
            </Label>
            <ul className="mt-5 space-y-3">
              {treffers.map((t) => (
                <li key={t.pad}>
                  <Link
                    href={t.pad}
                    className="flex items-baseline justify-between gap-4 rounded-[var(--r-sm)] border border-[var(--g-100)] bg-white p-5 transition-colors hover:border-[var(--g-300)] hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <span>
                      <span className="diba-card-title block">{t.naam}</span>
                      <span className="mt-1.5 block text-[15px] leading-7 text-[var(--t-body)]">
                        {t.zin}
                      </span>
                    </span>
                    {/* Hoeveel van jouw kenmerken deze pagina dekt. Geen score maar een
                        telling, zodat duidelijk is waarom hij bovenaan staat. */}
                    <span className="diba-label shrink-0 text-[var(--t-muted)]">
                      {t.score} van {gekozen.size}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
