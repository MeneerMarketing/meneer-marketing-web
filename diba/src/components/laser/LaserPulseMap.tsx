"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Label from "@/components/ui/Label";
import {
  DELEN_PER_AANZICHT,
  LICHAAM_VIEWBOX,
  LICHAAMSDELEN,
  SPIEGEL_AS,
} from "@/data/laser-lichaamskaart";
import {
  LASER_ZONE_AREAS,
  zonesVoor,
  type LaserZoneArea,
} from "@/data/laser-zones";

/**
 * De gebiedskiezer op /laserontharing: een blik op wat er te kiezen valt, met de
 * configurator als volgende stap.
 *
 * TWEEDE VERSIE, EN DIT ONDERDEEL DATEERDE VAN VÓÓR HET ONTWERPSYSTEEM.
 *
 * Er zaten veertien hardgecodeerde hexkleuren in, waarvan negen niet in het tokenblok
 * voorkomen. Dat is niet alleen een regel die overtreden wordt: het betekent dat dit
 * onderdeel zijn eigen groen had en dus niet meebeweegt als de huisstijl verschuift, en
 * dat het contrast er nooit langs dezelfde meetlat is gegaan als de rest.
 *
 * TWEE BRONNEN VOOR ÉÉN LIJST.
 *
 * De zones per gebied stonden hier als losse lijst met de namen erin getypt, terwijl elke
 * zone in `laser-zones.ts` al een `area` draagt. Twee lijsten van dezelfde dingen lopen
 * uiteen zodra er één zone bijkomt, en dan staat op deze pagina een ander aanbod dan in de
 * configurator. Ze komen nu allebei uit de zonetabel.
 *
 * TWEE LICHAMEN.
 *
 * En er stond een tweede lichaam. Een ellips voor het hoofd, een trapezium voor de romp,
 * en een ellips met een streeklijn eromheen om aan te wijzen waar je bent: precies de
 * vormentaal die uit de configurator is gehaald omdat hij op een robot met een masker
 * leek. Er is al een lichaamstekening, hij is gespiegeld en dus symmetrisch, en hij staat
 * één klik verderop. Dit is diezelfde tekening, klein en zonder bediening.
 */

/**
 * Welk stuk van de tekening bij welk gebied hoort.
 *
 * Als hoogtes en niet als lichaamsdelen, want een gebied loopt er dwars doorheen: het
 * bovenlichaam is de romp én de armen, het onderlichaam is het bekken én de benen. Een
 * band over de hele breedte, bijgesneden op het silhouet, volgt dat vanzelf.
 */
const BAND: Record<Exclude<LaserZoneArea, "pakket">, [number, number]> = {
  gelaat: [0, 130],
  bovenlichaam: [118, 272],
  onderlichaam: [262, 560],
};

const GEBIEDEN = LASER_ZONE_AREAS.filter(
  (a) => a.id !== "pakket",
) as readonly { id: Exclude<LaserZoneArea, "pakket">; label: string }[];

export default function LaserPulseMap() {
  const [actief, setActief] =
    useState<Exclude<LaserZoneArea, "pakket">>("gelaat");

  /* De zones komen uit de tarieventabel, niet uit een tweede lijst hier. De damespocket
     is de langste van de twee en laat dus het volledige aanbod per gebied zien. */
  const zones = useMemo(
    () =>
      zonesVoor("dames")
        .filter((z) => z.area === actief)
        .map((z) => z.label),
    [actief],
  );

  const [boven, onder] = BAND[actief];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <svg
          viewBox={LICHAAM_VIEWBOX}
          className="mx-auto block h-auto w-full max-w-[240px]"
          role="img"
          aria-label={`Silhouet met het gebied ${GEBIEDEN.find((g) => g.id === actief)?.label.toLowerCase()} opgelicht.`}
        >
          <defs>
            <clipPath id="pulsekaart-lichaam">
              {DELEN_PER_AANZICHT.voor.flatMap((deel) =>
                LICHAAMSDELEN[deel].flatMap((d, i) => [
                  <path key={`${deel}-${i}`} d={d} />,
                  <path
                    key={`${deel}-${i}-s`}
                    d={d}
                    transform={`matrix(-1 0 0 1 ${SPIEGEL_AS} 0)`}
                  />,
                ]),
              )}
            </clipPath>
          </defs>

          {DELEN_PER_AANZICHT.voor.flatMap((deel) =>
            LICHAAMSDELEN[deel].flatMap((d, i) => [
              <path key={`${deel}-${i}`} d={d} fill="var(--g-100)" />,
              <path
                key={`${deel}-${i}-s`}
                d={d}
                fill="var(--g-100)"
                transform={`matrix(-1 0 0 1 ${SPIEGEL_AS} 0)`}
              />,
            ]),
          )}

          {/* Het gekozen gebied. Een band die door het silhouet wordt bijgesneden, dus hij
              stopt vanzelf waar het lichaam stopt en hoeft geen eigen contour te hebben. */}
          <g clipPath="url(#pulsekaart-lichaam)">
            <rect
              x="0"
              y={boven}
              width={SPIEGEL_AS}
              height={onder - boven}
              fill="var(--g-500)"
              className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
            />
          </g>
        </svg>
      </div>

      <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-9">
        <Label>Zones</Label>

        <div
          role="group"
          aria-label="Kies een gebied"
          className="mt-4 flex flex-wrap gap-2"
        >
          {GEBIEDEN.map((gebied) => (
            <button
              key={gebied.id}
              type="button"
              aria-pressed={actief === gebied.id}
              onClick={() => setActief(gebied.id)}
              className={`diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                actief === gebied.id
                  ? "diba-pill-active"
                  : "bg-white text-[var(--t-label)] hover:bg-[var(--g-025)]"
              }`}
            >
              {gebied.label}
            </button>
          ))}
        </div>

        <h3 className="diba-card-title-lg mt-7">Stel je zones samen.</h3>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-[var(--t-body)]">
          In de configurator zie je meteen wat je opbouw wordt, inclusief wat
          een pakket vervangt. Hieronder staat wat er in dit gebied valt.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {zones.map((zone) => (
            <li
              key={zone}
              className="rounded-[var(--r-pill)] bg-white px-4 py-2 text-[14px] leading-6 text-[var(--t-body)]"
            >
              {zone}
            </li>
          ))}
        </ul>

        <Link
          href="/laserontharing/configurator"
          className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          Open de configurator
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </div>
  );
}
