"use client";

import Image from "next/image";
import { useId, useState } from "react";

/**
 * Een voor-en-na met een schuif ertussen.
 *
 * WAAROM DIT EEN LEGE STAAT HEEFT, EN WAAROM DIE ZO NADRUKKELIJK IS.
 *
 * De beelden zijn er nog niet. Ze komen pas als er klanten zijn die er toestemming voor
 * gaven en de opnamen volgens het protocol geschoten zijn: zelfde licht, zelfde hoek,
 * zelfde afstand. Tot die tijd staat hier een vak dat zegt dat het leeg is.
 *
 * Dat is geen tijdelijke slordigheid maar het hele punt. Een resultatenpagina met
 * voorbeeldfoto's erin, ook als "placeholder" bedoeld, is een pagina die resultaten toont
 * die niemand behaald heeft. Een grijs vlak met een grijs vlak ernaast kan niemand
 * verkeerd begrijpen; twee mooie huidfoto's uit een andere shoot wel.
 *
 * Zodra er een paar is, vul je `voor` en `na` en verandert er verder niets: dezelfde
 * schuif, dezelfde plek in het raster.
 *
 * BEDIENING.
 *
 * De schuif is een echte `input[type=range]` en geen sleepbaar blokje. Daarmee werkt hij
 * met het toetsenbord, met een schermlezer en met een muis zonder dat daar iets voor
 * gebouwd hoeft te worden. Hij ligt onzichtbaar over het hele beeld, zodat het voelt alsof
 * je de scheiding zelf vastpakt.
 */

export type VoorNaPaar = {
  readonly id: string;
  /** Wat er behandeld is. Kort, want dit staat onder een beeld. */
  readonly behandeling: string;
  /** Wat er nodig was om hier te komen. Nooit een belofte, altijd een feit. */
  readonly traject: string;
  /** Huidtype volgens Fitzpatrick, want dat bepaalt mee wat er kan. */
  readonly huidtype?: string;
  readonly voor?: { readonly src: string; readonly alt: string };
  readonly na?: { readonly src: string; readonly alt: string };
};

export default function VoorNaSchuif({ paar }: { paar: VoorNaPaar }) {
  const [stand, setStand] = useState(50);
  const id = useId();
  const compleet = Boolean(paar.voor && paar.na);

  return (
    <figure className="overflow-hidden rounded-[var(--r-lg)] bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--g-050)]">
        {compleet ? (
          <>
            {/* Na ligt onder, voor ligt erover en wordt weggeschoven. */}
            <Image
              src={paar.na!.src}
              alt={paar.na!.alt}
              fill
              sizes="(min-width: 1024px) 32vw, 92vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${stand}%` }}
            >
              {/* Vaste breedte op de binnenkant, anders schaalt de foto mee met de
                  uitsnede en schuif je twee verschillende beelden langs elkaar. */}
              <div className="relative h-full" style={{ width: `${(100 / stand) * 100}%` }}>
                <Image
                  src={paar.voor!.src}
                  alt={paar.voor!.alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, 92vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </>
        ) : (
          /* De lege staat. Twee helften, allebei leeg, met erin wat er komt. */
          <div className="absolute inset-0 flex">
            <div className="flex flex-1 items-end bg-[var(--g-100)] p-5">
              <span className="diba-label text-[var(--t-muted)]">Voor</span>
            </div>
            <div className="flex flex-1 items-end justify-end bg-[var(--g-050)] p-5">
              <span className="diba-label text-[var(--t-muted)]">Na</span>
            </div>
            <p className="diba-label absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-[var(--t-muted)]">
              Nog geen beeld
            </p>
          </div>
        )}

        {/* De scheiding. Een vulling en geen lijn, met een greep in het midden. */}
        {compleet ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white"
              style={{ left: `${stand}%` }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[var(--r-pill)] bg-white text-[var(--g-700)] shadow-[0_4px_18px_rgba(23,55,42,.25)]"
              style={{ left: `${stand}%` }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
              </svg>
            </div>

            <label htmlFor={id} className="sr-only">
              Schuif tussen de opname vooraf en de opname achteraf
            </label>
            <input
              id={id}
              type="range"
              min={0}
              max={100}
              value={stand}
              onChange={(e) => setStand(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-400)] [&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:opacity-0 [&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:opacity-0"
            />
          </>
        ) : null}
      </div>

      <figcaption className="p-6">
        <p className="diba-card-title text-[var(--t-strong)]">
          {paar.behandeling}
        </p>
        <p className="diba-label mt-2 text-[var(--t-label)]">{paar.traject}</p>
        {paar.huidtype ? (
          <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
            Huidtype {paar.huidtype}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
