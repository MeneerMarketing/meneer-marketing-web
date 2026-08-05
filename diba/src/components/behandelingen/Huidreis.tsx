"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  BEHANDELINGEN,
  HUIDLAGEN,
  VOORLOPIGE_PRIJZEN,
  type HuidlaagId,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De huidreis — het hart van de behandelingenpagina.
 *
 * Dit is geen illustratie bij de tekst. Dit is de pagina.
 *
 * Waarom. Elke kliniek zet een raster met behandelkaarten neer: een foto, een naam, "vanaf
 * € 95" en een knop. Dat werkt alleen voor wie al weet wat hij wil, en dat is bijna
 * niemand. De rest kiest op gevoel, of op wat er het duurst uitziet.
 *
 * Wat wij weten en zij niet vertellen: je kiest geen behandeling, je kiest een diepte.
 * Daar volgt de rest uit. Wat het kost, hoe lang je rood bent, hoe vaak je moet komen.
 * Een peeling en microneedling verschillen niet in smaak maar in welke laag ze raken.
 *
 * Dus maken we van die ene waarheid een gebaar. Je sleept een sonde door je huid naar
 * beneden, en één voor één vallen de behandelingen af die daar niet komen. Bovenaan zijn
 * het er vier. Helemaal onderin nog één. Dat is de hele pagina in drie seconden, zonder
 * dat er één woord uitleg aan te pas komt.
 *
 * Wat dit expliciet níet is: een spelletje. Er zit geen score in, geen animatie die je
 * moet uitzitten en geen scrolldwang. Je sleept, of je tikt een laag aan, en het antwoord
 * staat er. Wie niet wil slepen leest gewoon de lijst eronder.
 *
 * Bediening. Slepen met muis of vinger op de doorsnede, en daarnaast vier knoppen die
 * dezelfde lagen kiezen. Die knoppen zijn niet de tweede keus maar de echte bediening:
 * ze werken met toetsenbord en schermlezer, en de doorsnede is `aria-hidden`.
 */

/** Waar elke laag begint en eindigt, als percentage van de doorsnede. */
const GRENZEN: Record<HuidlaagId, { readonly van: number; readonly tot: number }> = {
  hoornlaag: { van: 0, tot: 9 },
  opperhuid: { van: 9, tot: 27 },
  "lederhuid-boven": { van: 27, tot: 55 },
  "lederhuid-diep": { van: 55, tot: 100 },
};

function laagVoorDiepte(d: number): HuidlaagId {
  const gevonden = HUIDLAGEN.find((l) => d >= GRENZEN[l.id].van && d < GRENZEN[l.id].tot);
  return gevonden?.id ?? "lederhuid-diep";
}

/** Het midden van een laag, zodat een knop de sonde netjes middenin zet. */
function middenVan(id: HuidlaagId): number {
  const g = GRENZEN[id];
  return g.van + (g.tot - g.van) / 2;
}

export default function Huidreis() {
  const [diepte, setDiepte] = useState(18);
  const [sleept, setSleept] = useState(false);
  const vlak = useRef<HTMLDivElement | null>(null);

  const laagId = laagVoorDiepte(diepte);
  const laag = HUIDLAGEN.find((l) => l.id === laagId)!;
  const hier = BEHANDELINGEN.filter((b) => b.lagen.includes(laagId));

  const uitPositie = useCallback((klientY: number) => {
    const doos = vlak.current?.getBoundingClientRect();
    if (!doos) return;
    const p = ((klientY - doos.top) / doos.height) * 100;
    setDiepte(Math.min(99.5, Math.max(0, p)));
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
      {/* ── De doorsnede ── */}
      <div>
        <div
          ref={vlak}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setSleept(true);
            uitPositie(e.clientY);
          }}
          onPointerMove={(e) => sleept && uitPositie(e.clientY)}
          onPointerUp={() => setSleept(false)}
          onPointerCancel={() => setSleept(false)}
          aria-hidden="true"
          className="relative h-[420px] cursor-grab touch-none overflow-hidden rounded-[var(--r-lg)] select-none active:cursor-grabbing sm:h-[520px]"
          style={{ background: "var(--g-100)" }}
        >
          {/* De lagen, van buiten naar binnen. Elke laag is iets donkerder dan de vorige;
              dat maakt van de doorsnede meteen een schaal. */}
          {HUIDLAGEN.map((l, i) => (
            <div
              key={l.id}
              className="absolute inset-x-0"
              style={{
                top: `${GRENZEN[l.id].van}%`,
                height: `${GRENZEN[l.id].tot - GRENZEN[l.id].van}%`,
                background: ["var(--g-050)", "var(--g-100)", "var(--g-200)", "var(--g-300)"][i],
              }}
            />
          ))}

          {/* Wat de sonde tot nu toe heeft doorlopen. */}
          <div
            className="absolute inset-x-0 top-0 bg-[var(--g-600)]"
            style={{
              height: `${diepte}%`,
              opacity: 0.82,
              transition: sleept ? "none" : "height .3s var(--ease-diba)",
            }}
          />

          {/* De laagnamen. Wit zolang de sonde eroverheen is, anders donker. */}
          {HUIDLAGEN.map((l) => {
            const bereikt = diepte >= GRENZEN[l.id].tot - 0.5;
            const gedeeltelijk = diepte > GRENZEN[l.id].van && !bereikt;
            return (
              <span
                key={l.id}
                className="absolute right-6 text-[13px] leading-5 font-medium"
                style={{
                  top: `calc(${GRENZEN[l.id].van}% + 10px)`,
                  color: bereikt || gedeeltelijk ? "#ffffff" : "var(--t-strong)",
                  transition: "color .3s var(--ease-diba)",
                }}
              >
                {l.naam}
              </span>
            );
          })}

          {/* De sonde zelf. */}
          <div
            className="absolute inset-x-0 flex items-center"
            style={{
              top: `${diepte}%`,
              transform: "translateY(-50%)",
              transition: sleept ? "none" : "top .3s var(--ease-diba)",
            }}
          >
            {/* De lijn was half doorzichtig en verdween daarmee in het lichte groen
                eronder. Vol wit met een schaduw: je moet kunnen zien waar je staat. */}
            <div className="h-0.5 flex-1 bg-white shadow-[0_1px_3px_rgba(15,45,28,.25)]" />
            <div className="flex h-11 items-center gap-2.5 rounded-[var(--r-pill)] bg-white px-4 shadow-[var(--shadow-float)]">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 shrink-0 text-[var(--g-700)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v12M4.5 10.5 8 14l3.5-3.5M11.5 5.5 8 2 4.5 5.5" />
              </svg>
              <span className="text-[13px] leading-4 font-medium whitespace-nowrap text-[var(--t-strong)]">
                {laag.naam}
              </span>
            </div>
            <div className="h-0.5 flex-1 bg-white shadow-[0_1px_3px_rgba(15,45,28,.25)]" />
          </div>
        </div>

        {/* De echte bediening: vier knoppen, met toetsenbord te doen. */}
        <div
          role="tablist"
          aria-label="Hoe diep"
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {HUIDLAGEN.map((l) => (
            <button
              key={l.id}
              role="tab"
              type="button"
              aria-selected={l.id === laagId}
              onClick={() => setDiepte(middenVan(l.id))}
              className={`flex min-h-12 items-center justify-center rounded-[var(--r-pill)] px-3 text-center text-[13px] leading-4 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                l.id === laagId
                  ? "bg-[var(--g-700)] text-white"
                  : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
              }`}
            >
              {l.naam}
            </button>
          ))}
        </div>
      </div>

      {/* ── Wat daar zit, en wat er komt ── */}
      <div className="lg:pt-6">
        <p className="diba-label text-[var(--t-muted)]">Je bent nu in de</p>
        <h2
          key={laag.id}
          className="diba-display-m mt-3 max-w-[16ch]"
          style={{ animation: "diba-paneel-in .3s var(--ease-diba) both" }}
        >
          {laag.naam}
        </h2>
        <p className="mt-5 max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
          {laag.zin}
        </p>

        <div className="mt-9 border-t border-[var(--g-100)] pt-7">
          <p className="diba-label text-[var(--t-muted)]">
            {hier.length === 0
              ? "Hier komt niets van ons"
              : hier.length === 1
                ? "Eén van onze behandelingen komt hier"
                : `${hier.length} van onze behandelingen komen hier`}
          </p>

          <ul className="mt-5 space-y-2">
            {hier.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/behandelingen/${b.slug}`}
                  className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-[var(--r-sm)] bg-white px-6 py-5 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="text-[17px] leading-7 font-medium text-[var(--t-strong)]">
                    {b.naam}
                  </span>
                  <span className="flex-1 text-[14px] leading-6 text-[var(--t-muted)]">
                    {publicCopy(b.herstel)}
                  </span>
                  <span className="shrink-0 text-[15px] leading-7 font-medium text-[var(--t-strong)] tabular-nums">
                    € {b.prijs}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3 shrink-0 text-[var(--g-700)] transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          {hier.length === 0 ? (
            <p className="mt-5 max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Zo diep gaan wij niet. Wat hier zit hoort bij een arts, of bij niemand.
            </p>
          ) : null}

          {VOORLOPIGE_PRIJZEN ? (
            <p className="mt-5 text-[13px] leading-5 text-[var(--t-muted)]">
              De bedragen zijn voorlopig en nog niet door de kliniek vastgesteld.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
