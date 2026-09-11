"use client";

import Link from "next/link";
import { useState } from "react";
import Label from "@/components/ui/Label";
import {
  BESTEMMINGEN,
  KENMERK_GROEPEN,
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
 *
 * WAAROM HET GEEN PILLEN MEER ZIJN.
 *
 * Yasin, 11 september 2026: "de symptoomzoeker is super rommelig en onoverzichtelijk; zorg
 * voor een goede ervaring op mobiel zodat het fijn oogt." Het waren achttien pillen van elk
 * een andere breedte in een rij die omloopt. Op een telefoon gaf dat rijen met soms één en
 * soms twee pillen, rafelige randen aan beide kanten, en geen volgorde om op te rusten. Je
 * moest achttien keer opnieuw beginnen met lezen.
 *
 * Nu zijn het regels onder elkaar met een vinkvakje links, in vier groepen met een kopje
 * erboven. Alles begint op dezelfde x, elke regel is even hoog, en je leest van boven naar
 * beneden in plaats van heen en weer. Een vinkvakje zegt bovendien zonder woorden dat je er
 * meerdere mag kiezen; bij een pil moet je dat raden.
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
    <div className="mt-8 sm:mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      {/* ── Wat je ziet ── */}
      <div className="self-start">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Label>Wat zie of voel je</Label>
          {gekozen.size > 0 ? (
            <button
              type="button"
              onClick={() => setGekozen(new Set())}
              className="diba-label text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Begin opnieuw
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-6">
          {KENMERK_GROEPEN.map((groep) => (
            <div key={groep.id}>
              <p className="diba-label text-[var(--t-muted)]">{groep.naam}</p>
              <ul className="mt-3 space-y-1.5">
                {KENMERKEN.filter((k) => k.groep === groep.id).map((k) => {
                  const aan = gekozen.has(k.id);
                  return (
                    <li key={k.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={aan}
                        onClick={() => wissel(k.id)}
                        className={`flex min-h-12 w-full items-center gap-3 rounded-[var(--r-sm)] px-4 py-2.5 text-left text-[15px] leading-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                          aan
                            ? "bg-white text-[var(--t-strong)] ring-2 ring-[var(--g-700)]"
                            : "bg-white text-[var(--t-body)] hover:bg-[var(--g-100)]"
                        }`}
                      >
                        {/* Het vinkvakje draagt de stand. Een hele regel groen kleuren
                            werkt bij één keuze, maar hier vink je er vijf aan en dan is het
                            blok groen met wat wit ertussen. */}
                        <span
                          aria-hidden="true"
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors ${
                            aan
                              ? "border-[var(--g-700)] bg-[var(--g-700)] text-white"
                              : "border-[var(--g-200)] bg-white"
                          }`}
                        >
                          {aan ? (
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 8.5l3.2 3.2L13 5" />
                            </svg>
                          ) : null}
                        </span>
                        {k.tekst}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
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
                    className="flex items-baseline justify-between gap-4 rounded-[var(--r-sm)] bg-white p-5 transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
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
