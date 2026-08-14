"use client";

import { useState, type CSSProperties } from "react";
import Label from "@/components/ui/Label";
import { BOUW, GEWICHT_TEKST, type Bouw } from "@/data/cellulitis";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De dwarsdoorsnede — de uitblinker van de cellulitispagina.
 *
 * Eén feit verklaart alles wat mensen over cellulitis niet begrijpen: de richting van de
 * bindweefselschotjes onder de huid. Rechtop bij vrouwen, kruislings bij mannen. Daarom
 * hebben slanke vrouwen het ook, daarom haalt sporten het patroon niet weg, en daarom
 * zitten mannen er nauwelijks mee.
 *
 * Je kunt dat opschrijven, maar het wordt pas overtuigend als je de twee doorsnedes naast
 * elkaar ziet met dezelfde hoeveelheid vet erin. Vandaar deze schakelaar: hij verandert
 * alleen de richting van de schotjes, en het oppervlak erboven verandert compleet mee.
 *
 * De tweede schuif is de eerlijke aanvulling: minder vet maakt het reliëf vlakker en laat
 * het patroon staan. Dat is precies waarom afvallen dit niet oplost.
 *
 * BEELD: schematisch, geen huid en geen lichaam (§14).
 */

export default function Dwarsdoorsnede() {
  const [bouw, setBouw] = useState<Bouw["id"]>("verticaal");
  const [vet, setVet] = useState(70);

  const b = BOUW[bouw];
  const verticaal = bouw === "verticaal";

  /* Vijf kamers. Bij verticale schotjes bolt het vet omhoog en trekken de schotjes de
     huid omlaag; bij kruislingse schotjes verdeelt dezelfde massa zich vlak. */
  const kamers = [0, 1, 2, 3, 4];
  const hoogte = 26 + (vet / 100) * 34;
  const bolling = verticaal ? 10 + (vet / 100) * 26 : 3 + (vet / 100) * 5;

  const huidPad = verticaal
    ? kamers
        .map((i) => {
          const x0 = 20 + i * 72;
          const x1 = x0 + 72;
          return `${i === 0 ? `M${x0} 54` : ""} Q${(x0 + x1) / 2} ${54 - bolling} ${x1} 54`;
        })
        .join(" ")
    : `M20 54 Q200 ${54 - bolling} 380 54`;

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── De doorsnede ── */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-5 sm:p-7">
        <div className="overflow-hidden rounded-[var(--r-sm)]">
          <svg
            viewBox="0 0 400 160"
            className="block w-full"
            aria-hidden="true"
          >
            <rect width="400" height="160" fill="var(--g-050)" />

            {/* De vetlaag. */}
            <rect
              x="20"
              y="54"
              width="360"
              height={hoogte}
              fill="var(--warn)"
              opacity="0.28"
              className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
            />

            {/* De spierlaag eronder, als vaste bodem. */}
            <rect
              x="20"
              y={54 + hoogte}
              width="360"
              height={106 - hoogte}
              fill="var(--g-200)"
              className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
            />

            {/* De schotjes: rechtop of kruislings. Dit is de hele boodschap. */}
            {verticaal
              ? kamers.map((i) => (
                  <line
                    key={i}
                    x1={20 + i * 72}
                    y1="54"
                    x2={20 + i * 72}
                    y2={54 + hoogte}
                    stroke="var(--g-600)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
                  />
                ))
              : kamers.flatMap((i) => [
                  <line
                    key={`a-${i}`}
                    x1={20 + i * 72}
                    y1="54"
                    x2={20 + i * 72 + 60}
                    y2={54 + hoogte}
                    stroke="var(--g-600)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />,
                  <line
                    key={`b-${i}`}
                    x1={20 + i * 72 + 60}
                    y1="54"
                    x2={20 + i * 72}
                    y2={54 + hoogte}
                    stroke="var(--g-600)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />,
                ])}

            {/* Het huidoppervlak. Bij verticale schotjes golft het, anders niet. */}
            <path
              d={huidPad}
              fill="none"
              stroke="var(--t-strong)"
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
            />

            <text
              x="200"
              y="24"
              textAnchor="middle"
              className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.14em]"
            >
              Dit is het oppervlak dat je ziet
            </text>
          </svg>
        </div>

        {/* Schakelaar tussen de twee bouwvormen. */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["verticaal", "kruislings"] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={bouw === id}
              onClick={() => setBouw(id)}
              className={`diba-label min-h-12 rounded-[var(--r-pill)] px-5 transition-colors ${
                bouw === id
                  ? "diba-pill-active"
                  : "bg-[var(--g-050)] text-[var(--t-label)] hover:bg-[var(--g-100)]"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
            >
              {BOUW[id].naam}
            </button>
          ))}
        </div>

        {/* De tweede schuif: dezelfde bouw, minder vet. */}
        <div className="mt-6 border-t border-[var(--g-100)] pt-5">
          <label htmlFor="vetlaag" className="diba-label block">
            Hoeveel vet ertussen zit
          </label>
          <input
            id="vetlaag"
            type="range"
            min={20}
            max={100}
            step={1}
            value={vet}
            onChange={(e) => setVet(Number(e.target.value))}
            aria-valuetext={`Vetlaag ${vet < 45 ? "dun" : vet < 75 ? "gemiddeld" : "dik"}`}
            className="diba-schuif fase-rijp mt-3"
            style={
              {
                "--schuif-voortgang": `${((vet - 20) / 80) * 100}%`,
              } as CSSProperties
            }
          />
          <p className="mt-3 text-sm leading-6 text-[var(--t-muted)]">
            Schuif hem helemaal naar links. Het reliëf wordt vlakker en het
            patroon staat er nog steeds, want de schotjes lopen nog waar ze
            liepen.
          </p>
        </div>
      </div>

      {/* ── De lezing ── */}
      <div aria-live="polite">
        <Label>{b.onder}</Label>
        <h3 className="diba-card-title-lg mt-4">{b.naam}</h3>

        <dl className="mt-6 space-y-5">
          <div className="border-l-2 border-[var(--g-200)] pl-4">
            <dt className="diba-label">Wat er onder de huid gebeurt</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(b.watErGebeurt)}
            </dd>
          </div>
          <div className="border-l-2 border-[var(--g-300)] pl-4">
            <dt className="diba-label">Wat je daarvan ziet</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {b.gevolg}
            </dd>
          </div>
        </dl>

        <div className="mt-8 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5">
          <Label>{GEWICHT_TEKST.kop}</Label>
          <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(GEWICHT_TEKST.tekst)}
          </p>
        </div>

        <p className="mt-6 border-l-2 border-[var(--g-300)] pl-4 text-[16px] leading-7 text-[var(--t-strong)]">
          Zet de schakelaar op kruislings en laat het vet staan waar het staat.
          Dezelfde hoeveelheid, een ander oppervlak. Dat is het hele verhaal.
        </p>
      </div>
    </div>
  );
}
