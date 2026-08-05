"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Spinnenweb from "@/components/ui/Spinnenweb";
import {
  aandachtspunten,
  hoeLangGeleden,
  maakMatches,
  SCAN_ASSEN,
} from "@/data/huidprofiel";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * Je huidprofiel, rechtsonder, op elke pagina.
 *
 * Wie de mini-scan heeft gedaan krijgt hier zijn spinnenweb terug, waar hij ook heen
 * navigeert. Dat is het verschil tussen een tooltje op de homepage en een site die je
 * onthoudt: je profiel loopt met je mee.
 *
 * Drie regels die deze knop niet mag overtreden.
 *
 * 1. GEEN PROFIEL, GEEN KNOP. Hij verschijnt alleen als er iets te tonen valt. Een
 *    permanent bolletje dat je uitnodigt iets in te vullen is een pop-up met een andere
 *    jas aan.
 * 2. HIJ DEKT NIETS AF. Op mobiel staat de cookiebalk onderin en die is belangrijker;
 *    daarom zit er ruimte onder gereserveerd zolang die balk er is. Ingeklapt is het een
 *    knop van 48 pixels en verder niets.
 * 3. HIJ SLUIT ALTIJD. Escape, de kruisknop, of klikken buiten het paneel.
 *
 * Wat erin staat is een samenvatting en geen tweede pagina: het spinnenweb, de twee assen
 * die eruit springen, en welke behandelingen erbij passen. Wie meer wil klikt door.
 */

export default function HuidprofielKnop() {
  const { profiel } = useHuidprofiel();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function opToets(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", opToets);
    return () => document.removeEventListener("keydown", opToets);
  }, [open]);

  const scan = profiel.scan;
  if (!scan) return null;

  const top = aandachtspunten(scan);
  const passend = maakMatches(profiel).filter((m) => m.oordeel === "past");
  const wanneer = hoeLangGeleden(scan.op);

  return (
    <>
      {/* Klikvanger. Alleen als het paneel openstaat, en zonder eigen kleur: hij hoort
          niet te laten zien dat hij er is. */}
      {open ? (
        <button
          type="button"
          aria-label="Huidprofiel sluiten"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[45] cursor-default"
        />
      ) : null}

      <div className="fixed right-4 bottom-4 z-[46] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        {open ? (
          <div
            role="dialog"
            aria-label="Je huidprofiel"
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--r-lg)] bg-white shadow-[var(--shadow-float)]"
            style={{ animation: "diba-paneel-in .28s var(--ease-diba) both" }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--g-100)] px-6 pt-6 pb-5">
              <div>
                <p className="diba-label text-[var(--t-label)]">Je huidprofiel</p>
                <p className="mt-1 text-[13px] leading-5 text-[var(--t-muted)]">
                  Ingevuld {wanneer}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="-mt-1 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-pill)] text-[var(--t-muted)] transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M5 5l10 10M15 5 5 15" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center gap-5">
                <Spinnenweb waarden={scan.assen} className="h-28 w-28 shrink-0" />
                <ul className="min-w-0 flex-1 space-y-2">
                  {top.map((as) => (
                    <li key={as.id}>
                      <span className="block text-[14px] leading-5 font-medium text-[var(--t-strong)]">
                        {as.label}
                      </span>
                      <span className="block text-[12px] leading-4 text-[var(--t-muted)] tabular-nums">
                        {scan.assen[as.id]} van 100
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 text-[13px] leading-5 text-[var(--t-muted)]">
                Dit is wat jij ons vertelde, nog niet wat we gemeten hebben. De open
                buitenrand is precies dat verschil.
              </p>

              {passend.length > 0 ? (
                <div className="mt-5 border-t border-[var(--g-100)] pt-5">
                  <p className="diba-label text-[var(--t-muted)]">Past hierbij</p>
                  <ul className="mt-3 space-y-1.5">
                    {passend.map((m) => (
                      <li key={m.behandeling.slug}>
                        <Link
                          href={`/behandelingen/${m.behandeling.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-baseline justify-between gap-3 text-[14px] leading-6 text-[var(--t-strong)] hover:text-[var(--g-700)]"
                        >
                          {m.behandeling.naam}
                          <span className="shrink-0 text-[13px] text-[var(--t-muted)] tabular-nums">
                            € {m.behandeling.prijs}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/behandelingen"
                  onClick={() => setOpen(false)}
                  className="diba-label flex min-h-11 items-center justify-center rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-white transition-colors hover:bg-[var(--g-800)]"
                >
                  Bekijk je hele profiel
                </Link>
                {scan.pillar ? (
                  <Link
                    href={`/huidproblemen/${scan.pillar}`}
                    onClick={() => setOpen(false)}
                    className="diba-label flex min-h-11 items-center justify-center text-[var(--g-700)] underline underline-offset-4"
                  >
                    Lees over {scan.kort ?? "je huidprobleem"}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((b) => !b)}
          /* Op een telefoon is dit alleen het blad. De twee regels ernaast namen daar
             de halve breedte in beslag en dekten de inhoud af; op een groot scherm is er
             ruimte zat en helpt het label. */
          className="flex min-h-12 items-center gap-3 rounded-[var(--r-pill)] bg-white p-2 shadow-[var(--shadow-float)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:py-2 sm:pr-5 sm:pl-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)]">
            <DibaLeafMark className="h-5 w-5" />
          </span>
          <span className="sr-only sm:not-sr-only sm:text-left">
            <span className="diba-label block text-[var(--t-label)]">Je huidprofiel</span>
            <span className="block text-[12px] leading-4 text-[var(--t-muted)]">
              {top.map((a) => a.label.toLowerCase()).join(" en ")}
            </span>
          </span>
        </button>
      </div>

      {/* Ruimte voor de schermlezer: het aantal assen wordt nergens genoemd en dit is de
          enige plek waar dat nog uit te leggen valt zonder de kaart vol te zetten. */}
      <p className="sr-only">
        Je huidprofiel is opgebouwd uit {SCAN_ASSEN.length} onderdelen die je zelf hebt
        aangegeven in de mini-scan.
      </p>
    </>
  );
}
