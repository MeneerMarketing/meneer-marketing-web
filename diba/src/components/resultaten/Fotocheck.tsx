"use client";

import { useMemo, useState } from "react";
import {
  FOTOVARIABELEN,
  FOTO_MAX,
  fotooordeel,
  type Fotovariabele,
} from "@/data/fotobewijs";

/**
 * De Fotocheck.
 *
 * WAAROM DIT HET MIDDELPUNT VAN /RESULTATEN IS.
 *
 * Er zijn nog geen echte voor-en-na-foto's, en verzinnen mag niet. Dat lijkt een gebrek en
 * het is een kans: in plaats van drie beelden die je moet geloven, krijgt de bezoeker hier
 * het gereedschap om elk voor-en-na-beeld te beoordelen. Ook dat van een andere kliniek.
 * Ook dat van ons, straks.
 *
 * DE VORM.
 *
 * Zeven schakelaars, één oordeel. Je begint met alles uit, want dat is de eerlijke
 * beginstand: over een willekeurige foto op internet weet je niets. Elke schakelaar die je
 * omzet is iets wat de fotograaf gelijk heeft gehouden.
 *
 * De drempels liggen hoog. Bij dit onderwerp helpt het niet om het meeste goed te doen:
 * één losse variabele verklaart het hele verschil, en dan bewijst de rest niets meer. Dat
 * is streng en het is de reden dat klinische fotografie protocollen kent.
 *
 * WAT DE BALK LAAT ZIEN.
 *
 * Niet een percentage "score" maar hoeveel van de twijfel je hebt weggenomen. Licht, hoek
 * en selectie wegen dubbel; die drie doen in de praktijk het meeste werk.
 */

/**
 * Het vlak wordt donkerder naarmate je meer twijfel wegneemt, en de tekstkleuren lopen mee.
 *
 * Dat laatste is geen sierlijkheid maar noodzaak. Gemeten op deze vier vlakken haalt
 * `--t-muted` op `--g-200` nog maar 4,25 en `--t-label` 4,21, allebei onder de AA-grens van
 * 4,5. Op dat vlak gaat alle tekst daarom naar `--g-900` (9,59). Op `--g-100` halen de
 * zachte kleuren het net wel (4,55 en 4,51) en blijven ze staan.
 */
const NIVEAU = {
  geen: {
    vlak: "bg-[var(--g-050)]",
    kop: "text-[var(--t-strong)]",
    label: "text-[var(--t-label)]",
    body: "text-[var(--t-body)]",
    zacht: "text-[var(--t-muted)]",
    baan: "bg-white",
    vulling: "bg-[var(--g-700)]",
  },
  zwak: {
    vlak: "bg-[var(--g-100)]",
    kop: "text-[var(--t-strong)]",
    label: "text-[var(--t-label)]",
    body: "text-[var(--t-body)]",
    zacht: "text-[var(--t-muted)]",
    baan: "bg-white",
    vulling: "bg-[var(--g-700)]",
  },
  redelijk: {
    vlak: "bg-[var(--g-200)]",
    kop: "text-[var(--g-900)]",
    label: "text-[var(--g-900)]",
    body: "text-[var(--g-900)]",
    zacht: "text-[var(--g-900)]",
    baan: "bg-white",
    vulling: "bg-[var(--g-700)]",
  },
  goed: {
    vlak: "bg-[var(--g-700)]",
    kop: "text-white",
    label: "diba-label-on-dark",
    body: "text-[var(--on-dark-body)]",
    zacht: "text-[var(--on-dark-body)]",
    baan: "bg-white/20",
    vulling: "bg-white",
  },
} as const;

export default function Fotocheck() {
  const [aan, setAan] = useState<ReadonlySet<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);

  const score = useMemo(
    () => FOTOVARIABELEN.filter((v) => aan.has(v.id)).reduce((t, v) => t + v.gewicht, 0),
    [aan],
  );
  const oordeel = fotooordeel(score);
  const kleur = NIVEAU[oordeel.niveau];
  const uitleg: Fotovariabele | undefined = open
    ? FOTOVARIABELEN.find((v) => v.id === open)
    : undefined;

  function wissel(id: string) {
    setAan((vorig) => {
      const volgend = new Set(vorig);
      if (volgend.has(id)) volgend.delete(id);
      else volgend.add(id);
      return volgend;
    });
    setOpen(id);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      {/* De zeven schakelaars. */}
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <p className="diba-label text-[var(--t-label)]">
          Vink aan wat gelijk is gehouden
        </p>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-7 text-[var(--t-body)]">
          Alles staat uit, want dat is wat je van een willekeurige foto weet.
          Zet aan wat je zeker weet, en kijk wat er overblijft.
        </p>

        <ul className="mt-7 space-y-2">
          {FOTOVARIABELEN.map((v) => {
            const staatAan = aan.has(v.id);
            return (
              <li key={v.id}>
                <button
                  type="button"
                  aria-pressed={staatAan}
                  onClick={() => wissel(v.id)}
                  className={`flex w-full min-h-12 items-center gap-4 rounded-[var(--r-md)] px-5 py-4 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    staatAan
                      ? "bg-[var(--g-200)] text-[var(--g-900)]"
                      : "bg-[var(--g-025)] text-[var(--t-body)] hover:bg-[var(--g-050)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--r-sm)] text-[13px] leading-none transition-colors ${
                      staatAan
                        ? "bg-[var(--g-700)] text-white"
                        : "bg-white text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  {/*
                    Op 375px is er naast het label geen ruimte voor de pil: gemeten werd
                    "Niet alleen de beste eruit" dan drie regels hoog (152px). Met
                    basis-full valt de pil op smal scherm onder het label en gaat hij vanaf
                    sm weer inline mee.
                  */}
                  <span className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-[16px] leading-6">{v.label}</span>
                    {v.gewicht === 2 ? (
                      <span className="diba-label w-fit basis-full rounded-[var(--r-pill)] bg-white px-3 py-1 text-[var(--g-700)] sm:ml-auto sm:basis-auto">
                        Weegt dubbel
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => {
            setAan(new Set());
            setOpen(null);
          }}
          className="diba-label mt-6 inline-flex min-h-12 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
        >
          Begin opnieuw
        </button>
      </div>

      {/* Het oordeel en de uitleg. */}
      <div className="flex flex-col gap-4">
        <div
          className={`rounded-[var(--r-lg)] p-7 transition-colors duration-300 sm:p-9 ${kleur.vlak}`}
        >
          <p className={`diba-label ${kleur.label}`}>Het oordeel</p>
          <p className={`diba-card-title mt-3 ${kleur.kop}`}>{oordeel.kop}</p>
          <p className={`mt-3 text-[15px] leading-7 ${kleur.body}`}>
            {oordeel.zin}
          </p>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={FOTO_MAX}
            aria-valuenow={score}
            aria-valuetext={`${score} van ${FOTO_MAX} punten twijfel weggenomen`}
            className={`mt-6 h-2 w-full overflow-hidden rounded-[var(--r-pill)] ${kleur.baan}`}
          >
            <div
              className={`h-full rounded-[var(--r-pill)] transition-[width] duration-500 ${kleur.vulling}`}
              style={{ width: `${Math.round((score / FOTO_MAX) * 100)}%` }}
            />
          </div>
          <p className={`mt-3 text-[14px] leading-6 ${kleur.zacht}`}>
            {score} van {FOTO_MAX} punten twijfel weggenomen
          </p>
        </div>

        <div className="flex-1 rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
          {uitleg ? (
            <>
              <p className="diba-label text-[var(--t-label)]">{uitleg.label}</p>
              <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
                {uitleg.effect}
              </p>
              <p className="mt-4 text-[15px] leading-7 text-[var(--t-muted)]">
                {uitleg.waarom}
              </p>
              <div className="mt-6 rounded-[var(--r-md)] bg-[var(--g-050)] p-5">
                <p className="diba-label text-[var(--t-label)]">
                  Wat wij hier doen
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                  {uitleg.onzeRegel}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="diba-label text-[var(--t-label)]">De uitleg</p>
              <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
                Zet een schakelaar om, dan staat hier wat die variabele met een
                foto doet en wat wij eraan doen zodra we onze eigen beelden
                publiceren.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
