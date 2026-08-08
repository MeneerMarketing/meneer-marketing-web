"use client";

import { useId, useState, type CSSProperties } from "react";
import Label from "@/components/ui/Label";
import { GLASTEST, GLASTEST_UITLEG, type Uitkomst } from "@/data/huiduitslag";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De glastest — de uitblinker van de pagina over huiduitslag.
 *
 * Dit is de enige zelftest op de hele site die over spoed gaat. Vlekjes die niet
 * wegdrukken onder glas kunnen betekenen dat er bloed buiten de vaatjes zit, en dat is in
 * combinatie met ziek zijn een reden om vandaag te bellen in plaats van morgen. Artsen
 * gebruiken hem zelf, hij kost tien seconden, en bijna niemand kent hem.
 *
 * De demonstratie laat beide uitkomsten zien in plaats van er één te kiezen: je schuift
 * het glas over het vlak en ziet links wat wegdrukken eruitziet en rechts wat niet
 * wegdrukken eruitziet. Zo hoef je niet te raden welke van de twee je zelf ziet; je
 * herkent hem.
 *
 * De test kan niets uitsluiten en dat staat er expliciet bij. Er is geen uitkomst die
 * geruststelt en er staat nergens een knop naar onze intake.
 *
 * BEELD: schematisch, geen huid en geen foto's van uitslag (§14).
 */

/** Vaste stippen, links wegdrukbaar en rechts niet. Deterministisch, geen willekeur. */
const VLEKJES = Array.from({ length: 46 }, (_, i) => {
  const rij = Math.floor(i / 8);
  const kol = i % 8;
  return {
    cx: 26 + kol * 54 + (rij % 2 === 0 ? 0 : 22),
    cy: 30 + rij * 42 + ((kol * 7) % 13),
    r: 5 + ((i * 5) % 4),
  };
});

export default function Glastest() {
  const [glas, setGlas] = useState(50);
  const uid = useId().replace(/:/g, "");

  /* Welke kant je vooral laat zien bepaalt welke lezing eronder staat. */
  const kant: Uitkomst["id"] = glas >= 50 ? "wegdrukbaar" : "niet-wegdrukbaar";
  const uitkomst = GLASTEST[kant];

  return (
    <div className="mt-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* ── Het vlak met het glas ── */}
        <div className="self-start rounded-[var(--r-md)] bg-white p-5 sm:p-7">
          <div className="relative overflow-hidden rounded-[var(--r-sm)]">
            <svg
              viewBox="0 0 460 220"
              className="block w-full"
              aria-hidden="true"
            >
              <defs>
                {/* Het glas: alleen binnen deze rechthoek verandert het beeld. */}
                <clipPath id={`${uid}-glas`}>
                  <rect x="0" y="0" width={(glas / 100) * 460} height="220" />
                </clipPath>
              </defs>

              <rect width="460" height="220" fill="var(--g-050)" />

              {/* Onderlaag: de vlekjes zoals ze zonder druk zijn. */}
              {VLEKJES.map((v) => (
                <circle
                  key={`vrij-${v.cx}-${v.cy}`}
                  cx={v.cx}
                  cy={v.cy}
                  r={v.r}
                  fill="var(--litteken-vers)"
                  opacity="0.6"
                />
              ))}

              {/* Onder het glas: links verbleken ze, rechts niet. Hier ligt de hele
                  boodschap, dus staat het verschil naast elkaar en niet na elkaar. */}
              <g clipPath={`url(#${uid}-glas)`}>
                <rect width="460" height="220" fill="white" opacity="0.55" />
                {VLEKJES.map((v) => (
                  <circle
                    key={`onder-${v.cx}-${v.cy}`}
                    cx={v.cx}
                    cy={v.cy}
                    r={v.r}
                    fill="var(--litteken-vers)"
                    opacity="0.08"
                  />
                ))}
              </g>

              {/* De rand van het glas. */}
              <line
                x1={(glas / 100) * 460}
                y1="0"
                x2={(glas / 100) * 460}
                y2="220"
                stroke="var(--g-700)"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>

            <span className="diba-label pointer-events-none absolute top-3 left-3 rounded-[var(--r-pill)] bg-white/90 px-3 py-1.5">
              Onder het glas
            </span>
            <span className="diba-label pointer-events-none absolute top-3 right-3 rounded-[var(--r-pill)] bg-white/90 px-3 py-1.5">
              Zonder druk
            </span>
          </div>

          <label htmlFor={`${uid}-schuif`} className="diba-label mt-6 block">
            Schuif het glas over de vlekken
          </label>
          <input
            id={`${uid}-schuif`}
            type="range"
            min={0}
            max={100}
            step={1}
            value={glas}
            onChange={(e) => setGlas(Number(e.target.value))}
            aria-valuetext={
              glas >= 50
                ? "Vooral het beeld onder het glas in zicht"
                : "Vooral het beeld zonder druk in zicht"
            }
            className="diba-schuif fase-vers mt-3"
            style={{ "--schuif-voortgang": `${glas}%` } as CSSProperties}
          />

          <p className="mt-5 text-sm leading-6 text-[var(--t-muted)]">
            Links zie je hoe het eruitziet als vlekken wél wegdrukken. Wat jij
            thuis ziet is óf het linkerbeeld óf het rechterbeeld, en dat
            verschil bepaalt of je vandaag belt.
          </p>
        </div>

        {/* ── De lezing ── */}
        <div aria-live="polite">
          {uitkomst.spoed ? (
            <Label className="text-[var(--warn-text)]">
              Dit is een reden om te bellen
            </Label>
          ) : (
            <Label>Geen haast, wel een vraag</Label>
          )}

          <h3 className="diba-card-title-lg mt-4">{uitkomst.kop}</h3>

          <dl className="mt-6 space-y-5">
            {[
              ["Wat je ziet", uitkomst.watJeZag],
              ["Wat dat kan betekenen", uitkomst.watHetKanBetekenen],
              ["Wat je dan doet", uitkomst.watJeDoet],
            ].map(([kop, tekst]) => (
              <div
                key={kop}
                className={`border-l-2 pl-4 ${
                  uitkomst.spoed
                    ? "border-[var(--warn)]"
                    : "border-[var(--g-200)]"
                }`}
              >
                <dt className="diba-label">{kop}</dt>
                <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
                  {publicCopy(tekst)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="mt-8 max-w-[80ch] text-sm leading-6 text-[var(--t-muted)]">
        {publicCopy(GLASTEST_UITLEG)}
      </p>
    </div>
  );
}
