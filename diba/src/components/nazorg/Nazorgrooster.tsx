"use client";

import { useState } from "react";
import {
  BEZIGHEDEN,
  NAZORG,
  wachtNiveau,
  wachttijdTekst,
  type BezigheidId,
} from "@/data/nazorg";

/**
 * Het nazorgrooster: wat mag wanneer weer.
 *
 * WAAROM EEN ROOSTER EN GEEN TIJDLIJN.
 *
 * Hier stond een tijdlijn: direct na, eerste week, eerste maand. Die leest prettig en
 * beantwoordt de vraag niet die mensen thuis stellen. Die vraag is altijd concreet en
 * altijd dezelfde: mag ik morgen sporten, mag ik make-up op, wanneer mag die retinol weer.
 *
 * Een rooster van bezigheden tegen behandelingen beantwoordt precies dat, in één blik, en
 * het laat bovendien iets zien wat een tijdlijn verbergt: dat de meeste beperkingen kort
 * zijn en dat er telkens één rij uitspringt. Bij bijna elke behandeling is dat de zon.
 *
 * ELKE CEL HEEFT EEN REDEN.
 *
 * Een regel zonder reden is een verbod, en verboden worden genegeerd. Klik een cel en de
 * reden staat eronder. Dat is ook waarom het rooster interactief is en geen plaatje: de
 * reden past niet in een cel en hoort er wel bij.
 *
 * De kleur zegt hoe zwaar de beperking weegt, niet hoe streng we zijn: licht is een dag
 * of minder, midden tot een week, donker langer. Bij pigment staat de zon op maanden, en
 * dat is geen strengheid maar het verschil tussen een geslaagd traject en opnieuw beginnen.
 */

const NIVEAU_VLAK = {
  kort: "bg-[var(--g-050)] text-[var(--t-strong)]",
  middel: "bg-[var(--g-200)] text-[var(--g-900)]",
  lang: "bg-[var(--g-700)] text-white",
} as const;

type Cel = { readonly behandeling: string; readonly bezigheid: BezigheidId };

export default function Nazorgrooster() {
  const [gekozen, setGekozen] = useState<Cel | null>(null);

  const actief = gekozen
    ? NAZORG.find((n) => n.slug === gekozen.behandeling)
    : null;
  const bezigheid = gekozen
    ? BEZIGHEDEN.find((b) => b.id === gekozen.bezigheid)
    : null;
  const cel = actief && gekozen ? actief.wachten[gekozen.bezigheid] : null;

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          {/* Kop: de behandelingen. */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `minmax(190px, 1.1fr) repeat(${NAZORG.length}, minmax(0, 1fr))`,
            }}
          >
            <span className="diba-label self-end text-[var(--t-label)]">
              Wat wil je doen
            </span>
            {NAZORG.map((n) => (
              <span
                key={n.slug}
                className="self-end text-[15px] leading-6 font-medium text-[var(--t-strong)]"
              >
                {n.naam}
              </span>
            ))}
          </div>

          {/* Eén rij per bezigheid. */}
          <div className="mt-4 space-y-2">
            {BEZIGHEDEN.map((b) => (
              <div
                key={b.id}
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `minmax(190px, 1.1fr) repeat(${NAZORG.length}, minmax(0, 1fr))`,
                }}
              >
                <span className="flex items-center text-[15px] leading-6 text-[var(--t-strong)]">
                  {b.label}
                </span>

                {NAZORG.map((n) => {
                  const w = n.wachten[b.id];
                  const niveau = wachtNiveau(w.uren);
                  const aan =
                    gekozen?.behandeling === n.slug &&
                    gekozen?.bezigheid === b.id;
                  return (
                    <button
                      key={n.slug}
                      type="button"
                      aria-pressed={aan}
                      onClick={() =>
                        setGekozen(
                          aan ? null : { behandeling: n.slug, bezigheid: b.id },
                        )
                      }
                      className={`flex min-h-12 items-center justify-center rounded-[var(--r-sm)] px-3 text-center text-[14px] leading-5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                        NIVEAU_VLAK[niveau]
                      } ${aan ? "ring-2 ring-[var(--g-900)] ring-offset-2" : "hover:opacity-85"}`}
                    >
                      {wachttijdTekst(w.uren)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* De reden. Een regel zonder reden is een verbod. */}
      <div className="mt-6 min-h-[120px] rounded-[var(--r-lg)] bg-white p-7 sm:p-8">
        {actief && bezigheid && cel ? (
          <>
            <p className="diba-label text-[var(--t-label)]">
              {bezigheid.label} na {actief.naam.toLowerCase()}
            </p>
            <p className="diba-card-title mt-3 text-[var(--t-strong)]">
              {wachttijdTekst(cel.uren)}
            </p>
            <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              {cel.reden}
            </p>
            <p className="mt-3 max-w-[62ch] text-[14px] leading-6 text-[var(--t-muted)]">
              {bezigheid.zin}
            </p>
          </>
        ) : (
          <>
            <p className="diba-label text-[var(--t-label)]">De reden erbij</p>
            <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              Klik een vakje aan, dan staat hier waarom die termijn er is. Een
              regel zonder reden is een verbod, en verboden worden genegeerd.
            </p>
          </>
        )}
      </div>

      {/* Legenda. */}
      <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {(
          [
            ["kort", "Een dag of korter"],
            ["middel", "Tot een week"],
            ["lang", "Langer dan een week"],
          ] as const
        ).map(([n, tekst]) => (
          <li key={n} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`h-4 w-8 rounded-[var(--r-sm)] ${NIVEAU_VLAK[n]}`}
            />
            <span className="text-[14px] leading-6 text-[var(--t-body)]">
              {tekst}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
