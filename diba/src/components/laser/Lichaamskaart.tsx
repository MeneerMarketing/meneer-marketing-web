"use client";

import { useId, useState } from "react";
import {
  AANZICHTEN,
  DELEN_PER_AANZICHT,
  GEZICHT_TREKKEN,
  GEZICHT_VIEWBOX,
  LICHAAM_VIEWBOX,
  LICHAAMSDELEN,
  ZONE_VOLGORDE,
  ZONE_VORMEN,
  type Aanzicht,
} from "@/data/laser-lichaamskaart";
import {
  vormenVanZones,
  zoneVoorVorm,
  type LaserGeslacht,
} from "@/data/laser-zones";
import { formatLaserPrice } from "@/lib/laser-pricing";

/**
 * De kaart waarop je je zones aanwijst.
 *
 * TWEEDE VERSIE, na terechte kritiek: de eerste zette blokken en ellipsen met randjes over
 * elkaar en dat zag eruit als een robot met een masker op.
 *
 * Wat er anders is:
 *
 * - Geen enkele rand. Elke zone is een vulling die door een clippad wordt bijgesneden op de
 *   contour van het lichaamsdeel waar hij op zit. Dat is wat een zone er uit laat zien alsof
 *   hij op het lichaam getekend is in plaats van erop geplakt.
 * - Je kunt op het lichaam zelf zweven en klikken. Onder de tekening staat een vaste strook
 *   die de naam en de prijs van de zone onder je muis toont. Vast, want een tekstregel die
 *   verschijnt en verdwijnt duwt de hele pagina op en neer.
 * - De overgang van uit naar aan loopt over een kwart seconde, dus je ziet wat er verandert.
 *
 * Toegankelijkheid. De tekening is niet de enige ingang: ernaast staat dezelfde keuze als
 * gewone knoppen, en dat is de bediening voor toetsenbord en schermlezer. De vormen in de
 * SVG zijn `aria-hidden` en dus puur muiswerk. Een SVG-pad met een role en een tabindex
 * erin frommelen levert een bediening op die technisch bestaat en praktisch onbruikbaar is.
 */

type Props = {
  gekozen: readonly string[];
  /** Zones die door een gekozen pakket gedekt worden: aan, maar niet los af te zetten. */
  gedekt: readonly string[];
  onWissel: (zoneId: string) => void;
  /**
   * Welke prijslijst er geldt.
   *
   * De kaart tekent vormen, niet tarieven. Welk tarief achter een vorm zit hangt af van de
   * lijst: heren betalen voor dezelfde wang meer, en hun lijst kent helemaal geen benen of
   * bikinilijn. Vormen zonder tarief op deze lijst worden niet getekend, want een gebied
   * dat oplicht maar niets kost is een belofte die de kliniek niet doet.
   */
  geslacht: LaserGeslacht;
};

type Staat = "uit" | "aan" | "gedekt";

/** De vulling per staat. Als tabel, zodat de tekening en de lijst niet uit elkaar lopen. */
const VULLING: Record<Staat | "zweef", string> = {
  uit: "transparent",
  zweef: "var(--g-300)",
  aan: "var(--g-500)",
  gedekt: "var(--g-300)",
};

export default function Lichaamskaart({
  gekozen,
  gedekt,
  onWissel,
  geslacht,
}: Props) {
  const [aanzicht, setAanzicht] = useState<Aanzicht>("voor");
  const [zweef, setZweef] = useState<string | null>(null);
  const sleutel = useId().replace(/:/g, "");

  const isGezicht = aanzicht === "gezicht";

  /* Een vorm is zichtbaar als hij getekend kan worden én op deze prijslijst staat. */
  const zone = (vorm: string) => zoneVoorVorm(vorm, geslacht);
  const zichtbaar = ZONE_VOLGORDE[aanzicht].filter(
    (vorm) => ZONE_VORMEN[vorm]?.[aanzicht] && zone(vorm),
  );

  /* Welke vormen oplichten doordat je iets anders koos.
   *
   * Twee gevallen die op hetzelfde neerkomen: een pakket dat de zone dekt, en een
   * combinatietarief dat over meerdere vormen loopt ("Gehele benen" raakt bovenbeen én
   * onderbeen). In beide gevallen heb je dit stuk huid al te pakken en verandert er niets
   * als je er nog een keer op klikt. Dus zien ze er hetzelfde uit en doen ze hetzelfde. */
  const gedektDoorAnders = vormenVanZones(gedekt);
  const verlichtDoorKeuze = vormenVanZones(gekozen);

  const staat = (vorm: string): Staat => {
    const z = zone(vorm);
    if (!z) return "uit";
    if (gedekt.includes(z.id) || gedektDoorAnders.has(vorm)) return "gedekt";
    if (gekozen.includes(z.id)) return "aan";
    /* Wel opgelicht, maar door een andere regel dan de hoofdzone van deze vorm. */
    if (verlichtDoorKeuze.has(vorm)) return "gedekt";
    return "uit";
  };

  /** Wat er in de strook onder de tekening staat. */
  const onderschrift = (() => {
    const id = zweef ?? null;
    if (!id) return null;
    const z = zone(id);
    if (!z) return null;
    return {
      naam: z.label,
      prijs: formatLaserPrice(z.singlePrice),
      staat: staat(id),
    };
  })();

  return (
    <div>
      {/* ── Aanzicht kiezen ── */}
      <div
        role="tablist"
        aria-label="Aanzicht"
        className="flex flex-wrap gap-2"
      >
        {AANZICHTEN.map((a) => (
          <button
            key={a.id}
            role="tab"
            type="button"
            aria-selected={a.id === aanzicht}
            onClick={() => {
              setAanzicht(a.id);
              setZweef(null);
            }}
            className={`diba-label inline-flex min-h-11 items-center rounded-[var(--r-pill)] px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
              a.id === aanzicht
                ? "diba-pill-active"
                : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1fr] sm:gap-8">
        {/* ── De tekening ── */}
        <div className="rounded-[var(--r-md)] bg-white p-5 sm:p-6">
          <svg
            viewBox={isGezicht ? GEZICHT_VIEWBOX : LICHAAM_VIEWBOX}
            className="mx-auto block h-auto w-full max-w-[280px]"
            aria-hidden="true"
            focusable="false"
            onPointerLeave={() => setZweef(null)}
          >
            <defs>
              {DELEN_PER_AANZICHT[aanzicht].map((deel) => (
                <clipPath key={deel} id={`${sleutel}-${deel}`}>
                  {LICHAAMSDELEN[deel].map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </clipPath>
              ))}
            </defs>

            {/* Het silhouet. Eén vulling, geen randen: de overlappen tussen de delen
                vallen daardoor weg en het geheel leest als één lichaam. */}
            {DELEN_PER_AANZICHT[aanzicht].map((deel) =>
              LICHAAMSDELEN[deel].map((d, i) => (
                <path key={`${deel}-${i}`} d={d} fill="var(--g-100)" />
              )),
            )}

            {/* De zones, elk bijgesneden op het deel waar hij op ligt. */}
            {zichtbaar.map((id) => {
              const vorm = ZONE_VORMEN[id]?.[aanzicht];
              if (!vorm) return null;
              const s = staat(id);
              const kleur =
                zweef === id && s === "uit" ? VULLING.zweef : VULLING[s];
              return (
                <g
                  key={id}
                  clipPath={`url(#${sleutel}-${vorm.knipOp})`}
                  onPointerEnter={() => setZweef(id)}
                  onClick={() => {
                    const z = zone(id);
                    if (s !== "gedekt" && z) onWissel(z.id);
                  }}
                  style={{
                    cursor: s === "gedekt" ? "default" : "pointer",
                    transition: "opacity .25s var(--ease-diba)",
                    opacity: s === "gedekt" ? 0.65 : 1,
                  }}
                >
                  {vorm.paden.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      fill={kleur}
                      style={{ transition: "fill .25s var(--ease-diba)" }}
                    />
                  ))}
                </g>
              );
            })}

            {/* De trekken van het gezicht liggen bovenop de zones, zodat het een gezicht
                blijft ook als er een wang oplicht. */}
            {isGezicht ? (
              <g pointerEvents="none">
                {GEZICHT_TREKKEN.vlakken.map((d, i) => (
                  <path key={`v${i}`} d={d} fill="var(--g-200)" />
                ))}
                {GEZICHT_TREKKEN.ogen.map((d, i) => (
                  <path key={`o${i}`} d={d} fill="var(--g-010)" />
                ))}
                {GEZICHT_TREKKEN.pupillen.map((p, i) => (
                  <circle key={`p${i}`} {...p} fill="var(--g-600)" />
                ))}
                {GEZICHT_TREKKEN.lijnen.map((d, i) => (
                  <path
                    key={`l${i}`}
                    d={d}
                    fill="none"
                    stroke="var(--g-500)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            ) : null}
          </svg>

          {/* Vaste strook. Leeg als je nergens op staat, zodat er niets verspringt. */}
          <div className="mt-4 flex min-h-11 items-center justify-between gap-3 border-t border-[var(--g-100)] pt-4">
            {onderschrift ? (
              <>
                <span className="text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                  {onderschrift.naam}
                </span>
                <span className="shrink-0 text-[14px] text-[var(--t-muted)] tabular-nums">
                  {onderschrift.staat === "gedekt"
                    ? "Zit al in je keuze"
                    : onderschrift.prijs}
                </span>
              </>
            ) : (
              <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                Beweeg over het lichaam of kies hiernaast.
              </span>
            )}
          </div>
        </div>

        {/* ── Dezelfde keuze als lijst. Dit is de echte bediening. ── */}
        <ul className="flex flex-col gap-2">
          {zichtbaar.map((id) => {
            const z = zone(id);
            if (!z) return null;
            const s = staat(id);
            return (
              <li key={id}>
                {/* Een zone die in een gekozen pakket zit is niet los uit te zetten. Dat
                    zou de opbouw niet veranderen en alleen verwarren; het pakket eronder
                    weghalen is de enige zinnige actie, en die staat er. */}
                <button
                  type="button"
                  aria-pressed={s !== "uit"}
                  disabled={s === "gedekt"}
                  onClick={() => onWissel(z.id)}
                  onPointerEnter={() => setZweef(id)}
                  onPointerLeave={() => setZweef(null)}
                  onFocus={() => setZweef(id)}
                  onBlur={() => setZweef(null)}
                  className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--r-sm)] px-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    s === "aan"
                      ? "bg-[var(--g-700)] text-white"
                      : s === "gedekt"
                        ? "bg-[var(--g-100)] text-[var(--t-muted)]"
                        : zweef === id
                          ? "bg-[var(--g-100)]"
                          : "bg-white hover:bg-[var(--g-050)]"
                  }`}
                >
                  <span
                    className={`text-[15px] leading-6 font-medium ${
                      s === "aan" ? "text-white" : "text-[var(--t-strong)]"
                    }`}
                  >
                    {z.label}
                  </span>
                  <span
                    className={`shrink-0 text-[13px] tabular-nums ${
                      s === "aan"
                        ? "text-[var(--on-dark-body)]"
                        : "text-[var(--t-muted)]"
                    }`}
                  >
                    {s === "gedekt"
                      ? "Zit er al in"
                      : formatLaserPrice(z.singlePrice)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
