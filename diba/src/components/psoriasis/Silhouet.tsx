"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { SILHOUET_SLOT, ZONES } from "@/data/psoriasis";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Het silhouet — de uitblinker van de psoriasispagina.
 *
 * Psoriasis wordt gezocht als huidprobleem en is er geen. Het is een afweeraandoening die
 * zich op meerdere plekken laat zien, en juist die spreiding is het bewijs: hoofdhuid,
 * strekzijden, nagels en gewrichten horen bij elkaar. Wie alleen naar de plekken kijkt,
 * mist de nagels die voor schimmel worden aangezien en de gewrichten waar wachten
 * blijvende schade geeft.
 *
 * Daarom een silhouet en geen gezicht. De acnekaart laat zien wáár op je gezicht iets zit
 * en waarom dat iets betekent over de oorzaak; dit laat zien hoe ver de aandoening reikt.
 * Andere vraag, ander beeld.
 *
 * De gewrichtszone is de enige met een dringende toon, en dat is geen opsmuk: schade aan
 * een gewricht komt niet terug.
 *
 * BEELD: schematisch silhouet zonder gezicht en zonder huidtint (§14).
 */

/**
 * De labels staan buiten de romp en niet erop. Het silhouet is smal, dus een label dat op
 * een lichaamsdeel gecentreerd staat legt zich eroverheen; met de korte namen uit de data
 * passen ze links en rechts ernaast.
 */
const ANKERS = [
  "left-1/2 top-0 -translate-x-1/2",
  "left-0 top-[36%]",
  "right-0 top-[52%]",
  "left-1/2 bottom-0 -translate-x-1/2",
] as const;

export default function Silhouet() {
  const [actief, setActief] = useState(0);
  const zone = ZONES[actief];

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
      {/* ── Het silhouet ── */}
      <div className="self-start rounded-[var(--r-md)] bg-white p-6 sm:p-8">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px]">
          {/* Het silhouet krijgt niet de volle hoogte: boven en onder blijft ruimte over
              voor het label dat daar staat. */}
          <svg
            viewBox="0 0 120 160"
            className="absolute inset-x-0 top-[11%] bottom-[11%] h-[78%] w-full"
            aria-hidden="true"
          >
            {/* Hoofd, romp en ledematen als losse vormen. Geen gezicht, geen huid. */}
            <circle cx="60" cy="16" r="11" fill="var(--g-100)" />
            <path
              d="M46 32h28c4 0 7 3 7 7v34c0 4-3 7-7 7H46c-4 0-7-3-7-7V39c0-4 3-7 7-7z"
              fill="var(--g-100)"
            />
            <path d="M39 40 24 78l8 3 12-34z" fill="var(--g-100)" />
            <path d="M81 40l15 38-8 3-12-34z" fill="var(--g-100)" />
            <path d="M48 82h9l-2 62h-9z" fill="var(--g-100)" />
            <path d="M63 82h9l2 62h-9z" fill="var(--g-100)" />
          </svg>

          {ZONES.map((z, i) => {
            const aan = i === actief;
            return (
              <button
                key={z.id}
                type="button"
                aria-pressed={aan}
                onClick={() => setActief(i)}
                className={`absolute flex min-h-12 items-center rounded-[var(--r-pill)] px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  ANKERS[i]
                } ${
                  aan
                    ? "bg-[var(--g-700)] text-[var(--on-dark-label)]"
                    : "bg-white text-[var(--t-label)] shadow-[var(--shadow-float)] hover:bg-[var(--g-050)]"
                }`}
              >
                <span className="diba-label whitespace-nowrap">{z.kort}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--t-muted)]">
          Tik de plekken aan. Ze horen bij dezelfde aandoening, ook als ze niet tegelijk
          opspelen.
        </p>
      </div>

      {/* ── De lezing ── */}
      <div aria-live="polite">
        {zone.dringend ? (
          <Label className="text-[var(--warn-text)]">Hier niet mee wachten</Label>
        ) : (
          <Label>Wat hier bij hoort</Label>
        )}

        <h3 className="diba-card-title-lg mt-4">{zone.naam}</h3>
        <p className="diba-label mt-3 text-[var(--t-muted)]">{zone.vakterm}</p>

        <dl className="mt-6 space-y-5">
          <div className="border-l-2 border-[var(--g-200)] pl-4">
            <dt className="diba-label">Wat je ziet of voelt</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(zone.watJeZiet)}
            </dd>
          </div>
          <div
            className={`border-l-2 pl-4 ${
              zone.dringend ? "border-[var(--warn)]" : "border-[var(--g-300)]"
            }`}
          >
            <dt className="diba-label">Waarom dit telt</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(zone.waaromHetTelt)}
            </dd>
          </div>
        </dl>

        <p className="mt-8 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
          {SILHOUET_SLOT}
        </p>
      </div>
    </div>
  );
}
