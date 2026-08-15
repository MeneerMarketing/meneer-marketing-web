"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { CIRKEL, CIRKEL_SLOT, WIE_LABEL } from "@/data/eczeem";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De krabcirkel — de uitblinker van de eczeempagina.
 *
 * Eczeem is een cirkel en geen plek: jeuk geeft krabben, krabben breekt de barrière, een
 * kapotte barrière laat prikkels door, en die geven weer jeuk. Wie alleen naar de plek
 * kijkt behandelt één punt van een lus die daarna gewoon doordraait.
 *
 * Daarom is dit geen lijst maar een ring. Je tikt een schakel aan en ziet wat daar gebeurt
 * en wie hem kan doorbreken. Bij twee van de vier zijn wij dat niet, en dat staat er met
 * dezelfde nadruk bij als de schakel waar we wél iets kunnen.
 *
 * Vorm: bewust rond en niet lineair, want dat is precies het verschil met alle andere
 * interacties op de site. Een tijdlijn heeft een begin en een eind, deze niet.
 *
 * Toegankelijkheid: de vier punten zijn gewone knoppen in de leesvolgorde van de lus, en
 * de lezing staat in een live region. De ring is versiering; de tekst draagt de betekenis.
 */

/**
 * Vier posities op de ring, met de klok mee vanaf boven.
 *
 * Dit werkt alleen omdat de labels kort zijn: een label van twee woorden groeit met zijn
 * tekst de ring in en legt zich over wat daar staat. Vandaar `kort` in de data, met de
 * volle naam in de lezing ernaast.
 */
const POSITIES = [
  { x: 50, y: 4 },
  { x: 96, y: 50 },
  { x: 50, y: 96 },
  { x: 4, y: 50 },
] as const;

const WIE_KLEUR = {
  huisarts: "text-[var(--warn-text)]",
  jij: "text-[var(--g-700)]",
  wij: "text-[var(--g-700)]",
} as const;

export default function Krabcirkel() {
  const [actief, setActief] = useState(0);
  const schakel = CIRKEL[actief];

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── De ring ── */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-6 sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[400px]">
          {/* De ring als vlak, niet als lijn.
              Dit waren twee cirkels met een streekdikte van tien en een streepjespatroon
              dat meedraaide. Op zich leesbaar, maar het was de laatste lijntekening op de
              site en een ring is net zo goed een vlak: een grote schijf met een kleinere
              eruit geknipt. Dezelfde vorm, en nu volgens dezelfde regel als de rest. */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M100 33a67 67 0 1 1 0 134a67 67 0 1 1 0-134ZM100 43a57 57 0 1 0 0 114a57 57 0 1 0 0-114Z"
              fill="var(--g-100)"
              fillRule="evenodd"
            />
            {/* Het lopende deel: een kwart ring die naar de gekozen schakel draait. */}
            <g
              className="transition-transform duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
              style={{ transform: `rotate(${actief * 90}deg)`, transformOrigin: "100px 100px" }}
            >
              <path
                d="M100 33a67 67 0 0 1 67 67h-10a57 57 0 0 0-57-57Z"
                fill="var(--g-300)"
              />
            </g>
          </svg>

          {/* De tekst in het midden stond in de SVG en schaalde dus mee met de tekening.
              Als gewone tekst leest hij op elk formaat even goed. */}
          <p className="diba-label pointer-events-none absolute top-1/2 left-1/2 w-40 -translate-x-1/2 -translate-y-1/2 text-center text-[var(--t-muted)]">
            Draait door tot je hem breekt
          </p>

          {CIRKEL.map((s, i) => {
            const aan = i === actief;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={aan}
                onClick={() => setActief(i)}
                style={{ left: `${POSITIES[i].x}%`, top: `${POSITIES[i].y}%` }}
                className={`absolute flex min-h-12 -translate-x-1/2 -translate-y-1/2 items-center rounded-[var(--r-pill)] px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "diba-pill-active"
                    : "bg-white text-[var(--t-label)] shadow-[var(--shadow-float)] hover:bg-[var(--g-050)]"
                }`}
              >
                <span className="diba-label whitespace-nowrap">{s.kort}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--t-muted)]">
          Tik een schakel aan. Elk punt heeft iemand die hem kan doorbreken, en
          dat is lang niet altijd dezelfde.
        </p>
      </div>

      {/* ── De lezing ── */}
      <div aria-live="polite">
        <Label className={WIE_KLEUR[schakel.wie]}>
          {WIE_LABEL[schakel.wie]}
        </Label>
        <h3 className="diba-card-title-lg mt-4">{schakel.naam}</h3>

        <dl className="mt-6 space-y-5">
          <div className="rounded-[var(--r-sm)] bg-white p-4">
            <dt className="diba-label">Wat er gebeurt</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(schakel.watGebeurtEr)}
            </dd>
          </div>
          <div className="rounded-[var(--r-sm)] bg-white p-4">
            <dt className="diba-label">Hier valt de cirkel te breken</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(schakel.doorbreken)}
            </dd>
          </div>
        </dl>

        <p className="mt-8 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
          {CIRKEL_SLOT}
        </p>
      </div>
    </div>
  );
}
