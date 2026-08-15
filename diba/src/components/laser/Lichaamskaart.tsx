"use client";

import { useId, useState } from "react";
import {
  AANZICHTEN,
  DELEN_PER_AANZICHT,
  GEZICHT_TREKKEN,
  GEZICHT_VIEWBOX,
  LICHAAM_VIEWBOX,
  LICHAAMSDELEN,
  OVERTEKENEN,
  SPIEGEL_AS,
  ZONE_VOLGORDE,
  ZONE_VORMEN,
  type Aanzicht,
  type Lichaamsdeel,
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
 * Geen enkele rand. Elke zone is een vulling die door een clippad wordt bijgesneden op de
 * contour van het lichaamsdeel waar hij op zit. Dat is wat een zone er uit laat zien alsof
 * hij op het lichaam getekend is in plaats van erop geplakt. Je kunt op het lichaam zelf
 * zweven en klikken; onder de tekening staat een vaste strook met de naam en de prijs van
 * de zone onder je muis. Vast, want een tekstregel die verschijnt en verdwijnt duwt de hele
 * pagina op en neer.
 *
 * ELKE VORM WORDT TWEE KEER GETEKEND.
 *
 * De data is alleen de linkerhelft; `Paar` zet er de spiegeling naast. Daarvoor stond elke
 * kant apart in het bestand en liep de romp vier pixels uit het midden, waardoor de
 * borstzone links buiten de arm stak en rechts eronder verdween. Zo'n verschil kan nu niet
 * meer ontstaan, want er is geen rechterkant om van af te wijken.
 *
 * EN DE ARMEN EN BENEN TWEE KEER.
 *
 * De romp loopt onder de arm en het bekken door, anders zit er een naad. Maar dan loopt een
 * zone die op de romp is bijgesneden mee tot onder de arm. Door de arm en het been na de
 * rompzones opnieuw te vullen stopt elke rompzone precies in de oksel en de liesplooi.
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
const VULLING: Record<Staat | "zweef" | "rust", string> = {
  uit: "transparent",
  /** Alleen voor zones met `rustvlak`: zichtbaar zonder gekozen te zijn. Zie de kaartdata. */
  rust: "var(--g-200)",
  zweef: "var(--g-300)",
  aan: "var(--g-500)",
  gedekt: "var(--g-300)",
};

/** De vulling van het silhouet zelf. Op één plek, want hij staat in twee lagen. */
const HUID = "var(--g-100)";

/**
 * Een vorm en zijn spiegelbeeld.
 *
 * De hele kaart bestaat uit linkerhelften; dit is wat er een heel lichaam van maakt. Vormen
 * die de middenas raken lopen er in de data een paar pixels overheen, zodat de twee helften
 * elkaar overlappen en er geen haarlijn in het midden staat.
 */
function Paar({
  d,
  ...rest
}: { d: string } & React.SVGProps<SVGPathElement>) {
  return (
    <>
      <path d={d} {...rest} />
      <path d={d} transform={`matrix(-1 0 0 1 ${SPIEGEL_AS} 0)`} {...rest} />
    </>
  );
}

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

  /* De zones in twee lagen: eerst wat op de romp ligt, dan wat op een ledemaat ligt, met
     het silhouet van dat ledemaat ertussen. Zie `OVERTEKENEN` in de kaartdata. */
  const opLedemaat = (id: string) =>
    OVERTEKENEN.includes(
      ZONE_VORMEN[id]?.[aanzicht]?.knipOp as Lichaamsdeel,
    );
  const opRomp = zichtbaar.filter((id) => !opLedemaat(id));
  const opLedematen = zichtbaar.filter(opLedemaat);

  /** Eén zone, bijgesneden op het deel waar hij op ligt. */
  const tekenZone = (id: string) => {
    const vorm = ZONE_VORMEN[id]?.[aanzicht];
    if (!vorm) return null;
    const s = staat(id);
    const kleur =
      zweef === id && s === "uit"
        ? VULLING.zweef
        : s === "uit" && vorm.rustvlak
          ? VULLING.rust
          : VULLING[s];
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
          <Paar
            key={i}
            d={d}
            fill={kleur}
            style={{ transition: "fill .25s var(--ease-diba)" }}
          />
        ))}
      </g>
    );
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
                    <Paar key={i} d={d} />
                  ))}
                </clipPath>
              ))}
            </defs>

            {/* Het silhouet. Eén vulling, geen randen: de overlappen tussen de delen
                vallen daardoor weg en het geheel leest als één lichaam. */}
            {DELEN_PER_AANZICHT[aanzicht].map((deel) =>
              LICHAAMSDELEN[deel].map((d, i) => (
                <Paar key={`${deel}-${i}`} d={d} fill={HUID} />
              )),
            )}

            {/* Het oor hoort bij het silhouet en gaat er dus vóór de zones overheen. */}
            {isGezicht ? (
              <g pointerEvents="none">
                {GEZICHT_TREKKEN.silhouet.map((d, i) => (
                  <Paar key={`s${i}`} d={d} fill={HUID} />
                ))}
              </g>
            ) : null}

            {/* Eerst de zones op de romp en het hoofd. */}
            {opRomp.map(tekenZone)}

            {/* Dan de armen en benen er nog een keer overheen, zodat de borst niet over de
                schouder bloedt en de bikinilijn niet over het bovenbeen. Zelfde vulling als
                de eerste laag, dus je ziet alleen dat de zone precies in de oksel stopt. */}
            {OVERTEKENEN.filter((deel) =>
              DELEN_PER_AANZICHT[aanzicht].includes(deel),
            ).map((deel) =>
              LICHAAMSDELEN[deel].map((d, i) => (
                <Paar key={`over-${deel}-${i}`} d={d} fill={HUID} />
              )),
            )}

            {/* En dan hun eigen zones, die daar wél overheen horen. */}
            {opLedematen.map(tekenZone)}

            {/* Het haar gaat over de zones heen, in de vulling van het silhouet: het is
                geen zone en er wordt daar niets behandeld, dus het hoort de kleur van een
                zone ook nooit te dragen. Zo begrenst het het voorhoofd van boven, ook als
                het voorhoofd groen is. Stond het hier eerder in de rusttint, dan liep het
                naadloos over in de voorhoofdzone en werd het samen één pet.
                Verder staat er niets bovenop: geen oog, geen neus, geen mond. Zie de
                toelichting bij GEZICHT_TREKKEN. */}
            {isGezicht ? (
              <g pointerEvents="none">
                {GEZICHT_TREKKEN.haarlijn.map((d, i) => (
                  <Paar key={`h${i}`} d={d} fill={HUID} />
                ))}
              </g>
            ) : null}
          </svg>

          {/* Vaste strook. Leeg als je nergens op staat, zodat er niets verspringt.
              Stond op een streepje; een vlak scheidt net zo goed en past wel bij de rest. */}
          <div className="mt-4 flex min-h-11 items-center justify-between gap-3 rounded-[var(--r-sm)] bg-[var(--g-025)] px-4 py-3">
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
