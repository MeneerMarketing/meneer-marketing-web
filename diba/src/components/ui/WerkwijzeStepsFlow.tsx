"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_WERKWIJZE_STEPS } from "@/data/home-werkwijze";

/**
 * De drie stappen naast "We behandelen alleen als we denken dat het zinvol is"
 *
 * WAT ER MIS WAS, EN WAAROM HET ALS EEN SJABLOON OOGDE.
 *
 * Er stond een tijdlijn van drie bolletjes met een gloeiend randje, een pulserend stipje
 * dat over een lijn liep, en drie kaarten met een rand eromheen. Los van elkaar zijn dat
 * nette dingen; samen waren het vier decoraties die alle vier hetzelfde zeiden. En de
 * randen botsten met de huisstijl: kaarten dragen zichzelf hier met een vlak, niet met
 * een lijn. Deze component was de enige plek op de site die dat wel deed, en precies
 * daarom viel hij op als vreemde eend.
 *
 * WAT ER NU STAAT.
 *
 * Drie gelijke kaarten, geen enkele lijn. Het verschil tussen actief en niet-actief zit
 * in de vulling: wit met een zachte slagschaduw tegenover een lichte tint. De voortgang
 * is een vulling die in ruim vier seconden onderin de actieve kaart vol loopt en dan
 * doorschuift. Dat is het enige dat beweegt.
 *
 * Die balk staat op `mt-auto`, dus hij zakt naar de voet van de kaart. Daardoor liggen de
 * drie balken altijd op één lijn, ook als een tekst op een smal scherm een regel langer
 * wordt. Dat is de reden dat de rij als één object leest en niet als drie losse kaartjes.
 *
 * De animatie loopt op een keyframe en niet op een CSS-transitie, want een transitie van
 * 0 naar 100% start niet bij de eerste render: de actieve kaart staat er dan al op 100%.
 * Met een `key` die meeloopt met de actieve stap begint hij elke keer opnieuw bij nul.
 *
 * Beweging staat stil zodra je er met de muis of met toetsenbordfocus in komt, zodat je
 * kunt lezen zonder dat het onder je handen wegschuift. Wie `prefers-reduced-motion` aan
 * heeft staan krijgt de balk zonder animatie; de stappen wisselen dan nog wel.
 */

const STAP_LABEL = ["Eerst", "Daarna", "Tot slot"] as const;

/** Hoe lang een stap in beeld blijft. Gelijk aan de duur van de vulling. */
const DUUR_MS = 4600;

export default function WerkwijzeStepsFlow({
  className = "",
}: {
  className?: string;
}) {
  const stappen = HOME_WERKWIJZE_STEPS;
  const [actief, setActief] = useState(0);
  const [gepauzeerd, setGepauzeerd] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const rij = useRef<HTMLUListElement>(null);
  const [inBeeld, setInBeeld] = useState(false);

  const volgende = useCallback(() => {
    setActief((vorig) => (vorig + 1) % stappen.length);
  }, [stappen.length]);

  /* Pas tellen als de rij in beeld staat. Anders is de derde stap al aan de beurt voordat
     iemand de sectie heeft bereikt (Yasin, 11 september 2026). */
  useEffect(() => {
    const el = rij.current;
    if (!el) return undefined;
    const waarnemer = new IntersectionObserver(
      ([item]) => setInBeeld(item.isIntersecting),
      { threshold: 0.34 },
    );
    waarnemer.observe(el);
    return () => waarnemer.disconnect();
  }, []);

  useEffect(() => {
    if (gepauzeerd || !inBeeld) return undefined;
    timer.current = setInterval(volgende, DUUR_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [volgende, gepauzeerd, inBeeld]);

  /* De rij meeschuiven met de stap die aan de beurt is. Alleen als er iets te schuiven
     valt: vanaf 640 pixels staan de drie naast elkaar en is de rij net zo breed als zijn
     inhoud. */
  useEffect(() => {
    const el = rij.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const kind = el.children[actief] as HTMLElement | undefined;
    const eerste = el.children[0] as HTMLElement | undefined;
    if (!kind || !eerste) return;
    el.scrollTo({
      left: kind.offsetLeft - eerste.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [actief]);

  return (
    <div
      /* `w-full min-w-0` op een telefoon: deze component staat in een flexrij naast de kop,
         en zonder die twee rekt de rij mee met de breedte van alle kaarten samen. Gemeten
         werd de pagina dan 813 pixels breed op een scherm van 390, en schoof de hele sectie
         naar links uit beeld. */
      className={`w-full min-w-0 sm:w-auto ${className}`}
      onMouseEnter={() => setGepauzeerd(true)}
      onMouseLeave={() => setGepauzeerd(false)}
      onPointerDown={() => setGepauzeerd(true)}
      onFocus={() => setGepauzeerd(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setGepauzeerd(false);
      }}
    >
      {/* Op een telefoon een rij die je ook zelf opzij kunt vegen; vanaf 640 een raster van
          drie. De rij loopt rechts door tot buiten de marge van deze kolom, want dat stuk
          van de volgende kaart is het teken dat er meer is. */}
      <ul
        ref={rij}
        className="diba-schuifrij flex snap-x snap-mandatory gap-3 sm:grid sm:grid-cols-3 sm:overflow-visible"
      >
        {stappen.map((stap, i) => {
          const aan = actief === i;
          return (
            <li
              key={stap.id}
              className="flex w-[82%] shrink-0 snap-start sm:w-auto"
            >
              <button
                type="button"
                aria-pressed={aan}
                onClick={() => setActief(i)}
                className={`flex h-full w-full flex-col rounded-[var(--r-md)] p-6 text-left transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-400)] sm:p-7 ${
                  aan
                    ? "cursor-default bg-white shadow-[0_18px_44px_rgba(67,79,58,.09)]"
                    : "cursor-pointer bg-[var(--g-025)] hover:bg-[var(--g-100)]"
                }`}
              >
                <span
                  className={`diba-label transition-colors duration-500 ${
                    aan ? "text-[var(--g-700)]" : "text-[var(--t-muted)]"
                  }`}
                >
                  {STAP_LABEL[i] ?? stap.title}
                </span>

                <span className="mt-5 block text-[26px] leading-none tracking-[-.05em] text-[var(--t-strong)]">
                  {stap.title}
                </span>

                <span className="mb-6 mt-3 block text-[14px] leading-6 text-[var(--t-body)]">
                  {stap.body}
                </span>

                {/* De voortgang. Een vulling en geen lijn: dat is het verschil tussen
                    huisstijl en sjabloon, en het is ook waarom de bak eronder in de
                    inactieve kaarten gewoon zichtbaar mag blijven. */}
                <span
                  aria-hidden="true"
                  className="mt-auto block h-1 w-full overflow-hidden rounded-[var(--r-pill)] bg-[var(--g-100)]"
                >
                  <span
                    key={`${stap.id}-${aan ? actief : "uit"}`}
                    className={`block h-full rounded-[var(--r-pill)] bg-[var(--g-400)] ${
                      aan ? "werkwijze-vullen" : "w-0"
                    }`}
                    style={
                      aan ? { animationDuration: `${DUUR_MS}ms` } : undefined
                    }
                  />
                </span>
                <span className="sr-only">
                  Stap {i + 1} van {stappen.length}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
