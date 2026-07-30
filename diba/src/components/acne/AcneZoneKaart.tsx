"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import { ACNE_ZONES, lees, type ZoneId } from "@/data/acne-zones";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De acnekaart — het onderdeel dat deze pagina onderscheidt.
 *
 * Waar acne zit ís informatie: de kaaklijn wijst het vaakst op een hormonale factor, de
 * T-zone op talg, wangen vaker op contact en wrijving. Vrijwel elke acnepagina beschrijft
 * acne in het algemeen; deze laat de bezoeker zijn eigen zones aantikken en leest live
 * mee wat dat patroon betekent.
 *
 * Het is bewust een diagram en geen foto: A10 verbiedt AI-gegenereerde mensen of huid,
 * en abstracte SVG's zonder huid mogen wel. Dat past hier ook beter — een schema nodigt
 * uit om aan te tikken, een foto niet.
 *
 * Toegankelijkheid: elke zone in de tekening is een checkbox met toetsenbordbediening,
 * en dezelfde zones staan eronder als chips. Twee wegen naar hetzelfde, zodat het ook
 * werkt als aanwijzen op een tekening lastig is.
 */

type Vorm = { readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number; readonly rot?: number };

/**
 * De vlakken per zone, anatomisch geplaatst. Wangen en kaaklijn bestaan uit twee vormen.
 *
 * De maten zijn bewust kleiner dan het hoofd: als de zones het gezicht vullen leest het
 * niet meer als gezicht. De oog- en mondstreepjes worden ná de zones getekend, zodat ze
 * er niet achter verdwijnen.
 */
const ZONE_VORMEN: Record<ZoneId, readonly Vorm[]> = {
  voorhoofd: [{ cx: 160, cy: 92, rx: 52, ry: 25 }],
  neus: [{ cx: 160, cy: 170, rx: 16, ry: 31 }],
  wangen: [
    { cx: 110, cy: 177, rx: 24, ry: 27 },
    { cx: 210, cy: 177, rx: 24, ry: 27 },
  ],
  kaaklijn: [
    { cx: 114, cy: 240, rx: 25, ry: 14, rot: -28 },
    { cx: 206, cy: 240, rx: 25, ry: 14, rot: 28 },
  ],
  kin: [{ cx: 160, cy: 269, rx: 29, ry: 21 }],
  rug: [],
};


export default function AcneZoneKaart() {
  const [gekozen, setGekozen] = useState<ZoneId[]>([]);
  const [zweeft, setZweeft] = useState<ZoneId | null>(null);

  const lezing = useMemo(() => lees(gekozen), [gekozen]);

  const wissel = (id: ZoneId) =>
    setGekozen((huidig) =>
      huidig.includes(id) ? huidig.filter((z) => z !== id) : [...huidig, id],
    );

  const actief = (id: ZoneId) => gekozen.includes(id);
  const opgelicht = (id: ZoneId) => actief(id) || zweeft === id;

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
      {/* ── De tekening ── */}
      <div>
        <div className="relative rounded-[var(--r-md)] bg-white p-4 sm:p-6">
          <svg
            viewBox="0 0 320 360"
            className="mx-auto w-full max-w-[340px]"
            role="group"
            aria-label="Diagram van een gezicht met aanklikbare zones"
          >
            {/* Hoofdcontour, alleen lijn. Geen huid, geen persoon: dit is een schema. */}
            <path
              d="M160 38c45 0 80 32 84 92 4 62-24 134-54 166-12 13-22 20-30 20s-18-7-30-20c-30-32-58-104-54-166 4-60 39-92 84-92Z"
              fill="none"
              stroke="var(--g-300)"
              strokeWidth="1.5"
            />

            {ACNE_ZONES.filter((z) => !z.buitenGezicht).map((zone) =>
              ZONE_VORMEN[zone.id].map((v, i) => (
                <ellipse
                  key={`${zone.id}-${i}`}
                  cx={v.cx}
                  cy={v.cy}
                  rx={v.rx}
                  ry={v.ry}
                  transform={v.rot ? `rotate(${v.rot} ${v.cx} ${v.cy})` : undefined}
                  role={i === 0 ? "checkbox" : undefined}
                  aria-checked={i === 0 ? actief(zone.id) : undefined}
                  aria-label={i === 0 ? zone.naam : undefined}
                  tabIndex={i === 0 ? 0 : -1}
                  onClick={() => wissel(zone.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      wissel(zone.id);
                    }
                  }}
                  onMouseEnter={() => setZweeft(zone.id)}
                  onMouseLeave={() => setZweeft(null)}
                  onFocus={() => setZweeft(zone.id)}
                  onBlur={() => setZweeft(null)}
                  className="cursor-pointer transition-all duration-300 ease-[var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] motion-reduce:transition-none"
                  fill={
                    actief(zone.id)
                      ? "var(--g-700)"
                      : zweeft === zone.id
                        ? "var(--g-200)"
                        : "var(--g-050)"
                  }
                  stroke={opgelicht(zone.id) ? "var(--g-700)" : "var(--g-200)"}
                  strokeWidth={actief(zone.id) ? 0 : 1.5}
                />
              )),
            )}

            {/* Oog- en mondstreepjes ná de zones, zodat ze zichtbaar blijven. Net genoeg
                om het als gezicht te lezen, niet meer. */}
            <g
              stroke="var(--g-400)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              aria-hidden="true"
            >
              <path d="M121 133h21" />
              <path d="M178 133h21" />
              <path d="M145 226h30" />
            </g>

            {/* Naam van de zone waar je op staat, onderin de tekening. */}
            <text
              x="160"
              y="344"
              textAnchor="middle"
              className="fill-[var(--t-muted)] text-[11px] font-semibold uppercase [letter-spacing:0.14em]"
            >
              {zweeft ? ACNE_ZONES.find((z) => z.id === zweeft)?.naam : "Tik een zone aan"}
            </text>
          </svg>
        </div>

        {/* Dezelfde zones als chips: tweede, altijd werkende weg. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {ACNE_ZONES.map((zone) => (
            <button
              key={zone.id}
              type="button"
              aria-pressed={actief(zone.id)}
              onClick={() => wissel(zone.id)}
              onMouseEnter={() => setZweeft(zone.id)}
              onMouseLeave={() => setZweeft(null)}
              className={`diba-label min-h-12 rounded-[var(--r-pill)] px-4 transition ${
                actief(zone.id)
                  ? "bg-[var(--g-700)] text-white"
                  : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
            >
              {zone.naam}
              {zone.buitenGezicht ? " ·" : ""}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--t-muted)]">
          Rug en schouders staan niet in de tekening, maar tellen wel mee.
        </p>
      </div>

      {/* ── De lezing ── */}
      <div className="flex flex-col rounded-[var(--r-md)] bg-white p-6 sm:p-8" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <Label>{gekozen.length === 0 ? "Nog niets gekozen" : `${gekozen.length} van 6 zones`}</Label>
          {gekozen.length > 0 ? (
            <button
              type="button"
              onClick={() => setGekozen([])}
              className="diba-label text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Wissen
            </button>
          ) : null}
        </div>

        <h3 className="diba-card-title-lg mt-4">{lezing.kop}</h3>
        <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
          {publicCopy(lezing.tekst)}
        </p>

        <div className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5">
          <Label>Wat wij dan eerst doen</Label>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(lezing.eersteStap)}
          </p>
        </div>

        {/* De eerlijkheidsclausule hoort hier, niet in kleine lettertjes onderaan. */}
        <p className="mt-5 text-sm leading-6 text-[var(--t-muted)]">
          Dit is een patroonduiding, geen diagnose. Twee mensen met dezelfde zones kunnen
          een ander plan krijgen. Daarom meten we voordat we behandelen.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button
            href={`/intake?topic=acne${gekozen.length ? `&zones=${gekozen.join(",")}` : ""}`}
          >
            {gekozen.length ? "Neem dit mee naar de intake" : "Start je intake (4 min)"}
          </Button>
          <a
            href="#tijdlijn"
            className="diba-label inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
          >
            Hoe lang duurt het
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
