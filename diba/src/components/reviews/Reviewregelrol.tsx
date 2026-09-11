"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sterren from "@/components/ui/Sterren";

/**
 * De reviewregel die doorschuift.
 *
 * Yasin, 10 september 2026: "laat daar gewoon wat reviews sliden, maar let op: de pagina
 * mag niet de hele tijd vervormen doordat er een langere tekst komt en het blok groter
 * wordt."
 *
 * WAAROM DE HOOGTE VASTSTAAT.
 *
 * Dat is de hele opgave. Een regel die van twee naar drie regels springt duwt alles eronder
 * omlaag, en dan beweegt de bladzijde terwijl je leest.
 *
 * Alle zes staan daarom in dezelfde cel van een raster: `grid` met elk kind op rij één,
 * kolom één. Een raster maakt zich zo hoog als zijn hoogste kind, en dat kind is er altijd,
 * ook als het doorzichtig is. De hoogte staat dus vast op de langste van de zes, en die
 * wordt gemeten in plaats van geraden.
 *
 * Een vast getal in punten zou hetzelfde lijken te doen en het niet doen: op een telefoon
 * breekt de ene quote over drie regels en de andere over vier, en bij een nieuwe review uit
 * Salonized klopt het getal niet meer. Dat stond hier eerst, en er stak er dan ook een drie
 * punten buiten het vak.
 *
 * `Reviewregel` levert bovendien alleen reviews uit dezelfde lengteband aan, zodat het
 * verschil tussen de hoogste en de laagste klein blijft en er geen lucht onder een korte
 * zin gaapt.
 *
 * OVERVLOEIEN EN NIET SCHUIVEN.
 *
 * Schuiven vraagt om een tweede laag die van rechts binnenkomt, en dat trekt het oog weg van
 * de tekst eronder. Een korte overgang in doorzichtigheid doet hetzelfde werk en valt niet op
 * als beweging. Wie in zijn systeem heeft staan dat hij minder beweging wil, krijgt één
 * review en geen wisseling.
 */

export type Regelreview = {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly stars: number;
  readonly relativeDate?: string;
};

/** Hoe lang een review blijft staan. Lang genoeg om hem twee keer te lezen. */
const WISSEL_MS = 7000;

export default function Reviewregelrol({
  reviews,
  className = "",
}: {
  reviews: readonly Regelreview[];
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reviews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % reviews.length),
      WISSEL_MS,
    );
    return () => window.clearInterval(t);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <div className={className}>
      <div className="grid" aria-live="off">
        {reviews.map((r, n) => (
          <figure
            key={r.id}
            aria-hidden={n === i ? undefined : "true"}
            /* Alle zes op dezelfde plek in het raster. Ze staan er alle zes, dus het
               raster is zo hoog als de langste; alleen de actieve is zichtbaar. */
            className={`col-start-1 row-start-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 transition-opacity duration-500 [transition-timing-function:var(--ease-diba)] motion-reduce:transition-none ${
              n === i ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Sterren aantal={r.stars} maat="sm" />
            <blockquote className="min-w-0 text-[15px] leading-7 text-[var(--t-body)]">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="diba-label flex flex-wrap items-baseline gap-x-3 text-[var(--t-muted)]">
              <span>
                {r.name}
                {r.relativeDate ? `, ${r.relativeDate}` : ""}
              </span>
              <Link
                href="/reviews"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Alle reviews
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
