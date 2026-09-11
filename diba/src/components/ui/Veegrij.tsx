"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Een rij kaarten die je opzij veegt.
 *
 * WAAROM DIT EEN GEDEELDE COMPONENT IS.
 *
 * Yasin, 11 september 2026: "eigenlijk moet dit op alle gestapelde blokken in de site, dan
 * bespaart het op mobiel verticale ruimte en is het ook leuker om te lezen." Drie kaarten
 * onder elkaar op een telefoon is bijna twee schermen; dezelfde drie naast elkaar is er
 * één, en je ziet meteen dat er meer is.
 *
 * Dat gaat dus op meer plekken gebeuren, en dan hoort het één ding te zijn en geen vijf
 * kopieën. Deze component draagt het schuiven, de stippen en het automatisch doorlopen; de
 * kaarten zelf komen van buiten en weten hier niets van.
 *
 * HOE HET SCHUIVEN WERKT.
 *
 * `scroll-snap` en `scrollTo`, en verder niets. Dat geeft de vegen van het besturings-
 * systeem zelf, inclusief het rubberbandje aan de randen. Een sliderbibliotheek zou hier
 * veertig kilobyte toevoegen om dat na te bouwen.
 *
 * MET DE MUIS SLEEP JE HEM.
 *
 * Alleen met muis of pen; een vinger laat het besturingssysteem met rust. Tijdens het
 * slepen gaat het vastklikken uit, anders springt de rij bij elke pixel terug. En een
 * sleep eindigt niet in een klik: de kaarten zijn links, en zonder die rem belandde je na
 * elke sleep op een andere pagina.
 *
 * De rij begint op dezelfde marge als de tekst erboven en loopt rechts door tot de
 * schermrand: dat stuk van de volgende kaart is het teken dat er meer is. `scroll-padding`
 * houdt die marge ook vast als je zelf veegt.
 *
 * WANNEER HET VANZELF DOORLOOPT, EN WANNEER HET STOPT.
 *
 * Alleen met `vanzelf`, en pas zodra de rij voor een derde in beeld staat. Anders loopt de
 * teller al tijdens het lezen van de bovenkant van de pagina, en kom je aan bij een rij die
 * al drie kaarten verder is (Yasin, 11 september 2026). Scrol je hem uit beeld, dan staat
 * hij weer stil.
 *
 * Verder stopt het zodra iemand zelf iets doet: aanraken, slepen, met de
 * muis erboven hangen, of met het toetsenbord in een kaart komen. Daarna gaat het niet meer
 * verder, want een rij die wegschuift terwijl je leest is erger dan een rij die stilstaat.
 * Wie in zijn systeem heeft staan dat hij minder beweging wil, krijgt de rij stil.
 *
 * VANAF WELKE MAAT HET EEN RASTER WORDT.
 *
 * Met `raster` wordt de rij op een breed scherm een gewoon raster: daar is de ruimte er
 * wel en is vegen omslachtiger dan kijken. De stippen verdwijnen dan mee.
 */

/** Hoe lang een kaart blijft staan voordat de rij doorschuift. */
const WISSEL_MS = 5000;

/** De standen van `raster`, als hele klassenamen (Tailwind leest geen samengestelde). */
const RASTER = {
  geen: { rij: "", item: "", stippen: "" },
  md: {
    rij: "md:grid md:grid-cols-3 md:overflow-visible md:px-9 lg:px-[7.5vw]",
    item: "md:w-auto md:max-w-none",
    stippen: "md:hidden",
  },
  lg: {
    rij: "lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-[7.5vw]",
    item: "lg:w-auto lg:max-w-none",
    stippen: "lg:hidden",
  },
} as const;

export type VeegrijItem = {
  /** Vaste sleutel per kaart, voor React en voor de stippen. */
  readonly sleutel: string;
  /** Wat er op de stip staat voor wie voorleest: "Naar acne en onzuiverheden". */
  readonly naam: string;
  readonly inhoud: ReactNode;
};

export default function Veegrij({
  items,
  label,
  breedte = "w-[78%] max-w-[340px] sm:w-[46%] lg:w-[31%]",
  raster = "geen",
  vanzelf = false,
  klasse = "",
}: {
  items: readonly VeegrijItem[];
  /** Waar deze rij over gaat, voor wie voorleest. */
  label: string;
  /** Hoe breed een kaart is, als Tailwind-klassen. */
  breedte?: string;
  /** Vanaf welke maat het een raster van drie wordt in plaats van een veegrij. */
  raster?: keyof typeof RASTER;
  /** Loopt de rij vanzelf door tot iemand zelf iets doet? */
  vanzelf?: boolean;
  klasse?: string;
}) {
  const rij = useRef<HTMLUListElement>(null);
  const [actief, setActief] = useState(0);
  /* Dezelfde waarde als `actief`, maar leesbaar binnen de timer. Die wordt één keer
     opgezet en zou anders voor altijd naar kaart 0 blijven kijken. */
  const actiefRef = useRef(0);
  const [zelfGedaan, setZelfGedaan] = useState(false);
  const [inBeeld, setInBeeld] = useState(false);
  const rustig = useReducedMotion();
  const stand = RASTER[raster];
  /* De sleepstand. In een ref en niet in state: dit verandert tientallen keren per seconde
     en mag geen enkele render kosten. */
  const sleep = useRef<{
    bezig: boolean;
    startX: number;
    startScroll: number;
    verplaatst: boolean;
  }>({ bezig: false, startX: 0, startScroll: 0, verplaatst: false });

  /* Naar welke kaart er nu gekeken wordt: die het dichtst bij het midden van de rij staat.
     Uit de scrollpositie en niet uit een teller, want vegen gebeurt buiten React om. */
  const meten = useCallback(() => {
    const el = rij.current;
    if (!el) return;
    const midden = el.scrollLeft + el.clientWidth / 2;
    let dichtst = 0;
    let besteAfstand = Infinity;
    [...el.children].forEach((kind, i) => {
      const doos = kind as HTMLElement;
      const kern = doos.offsetLeft + doos.offsetWidth / 2;
      const afstand = Math.abs(kern - midden);
      if (afstand < besteAfstand) {
        besteAfstand = afstand;
        dichtst = i;
      }
    });
    actiefRef.current = dichtst;
    setActief(dichtst);
  }, []);

  const naar = useCallback(
    (i: number, zacht = true) => {
      const el = rij.current;
      if (!el) return;
      const kind = el.children[i] as HTMLElement | undefined;
      const eerste = el.children[0] as HTMLElement | undefined;
      if (!kind || !eerste) return;
      /* Gemeten vanaf de eerste kaart en niet vanaf de rij: de rij heeft links dezelfde
         marge als de tekst erboven, en die hoort te blijven staan. */
      el.scrollTo({
        left: kind.offsetLeft - eerste.offsetLeft,
        behavior: zacht && !rustig ? "smooth" : "auto",
      });
    },
    [rustig],
  );

  useEffect(() => {
    const el = rij.current;
    if (!el || !vanzelf) return undefined;
    const waarnemer = new IntersectionObserver(
      ([item]) => setInBeeld(item.isIntersecting),
      { threshold: 0.34 },
    );
    waarnemer.observe(el);
    return () => waarnemer.disconnect();
  }, [vanzelf]);

  useEffect(() => {
    if (!vanzelf || !inBeeld || zelfGedaan || rustig || items.length < 2)
      return;
    const t = window.setInterval(() => {
      const el = rij.current;
      if (!el) return;
      /* Terug naar het begin zodra de laatste kaart helemaal in beeld staat, en niet pas
         bij de laatste index. Op een breed scherm staan er drie kaarten naast elkaar:
         doortellen zou dan een paar keer niets doen. */
      const aanHetEind = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      naar(aanHetEind ? 0 : Math.min(actiefRef.current + 1, items.length - 1));
    }, WISSEL_MS);
    return () => window.clearInterval(t);
  }, [vanzelf, inBeeld, zelfGedaan, rustig, items.length, naar]);

  const stop = useCallback(() => setZelfGedaan(true), []);

  /**
   * Het slepen begint hier en loopt daarna op `window`.
   *
   * Twee dingen die het eerst kapot maakten, allebei gemeten en niet geraden:
   *
   * 1. `preventDefault` op de pointerdown. Zonder dat pakt de browser het slepen zelf af:
   *    de kaarten dragen foto's, en een foto die je met ingedrukte muisknop verplaatst is
   *    voor de browser een sleepactie met een spookafbeelding eraan. Na één pointermove
   *    kwam er niets meer binnen. Klikken blijft werken; alleen de tekstselectie en dat
   *    slepen van het beeld vervallen.
   * 2. Luisteren op `window` en niet op de rij zelf. Sleep je door tot buiten de rij, dan
   *    gaan de bewegingen anders naar het element waar je op dat moment boven hangt, en
   *    blijft de rij halverwege hangen.
   */
  const sleepStart = useCallback((e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "touch") return;
    const el = rij.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    e.preventDefault();
    sleep.current = {
      bezig: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      verplaatst: false,
    };
    el.style.scrollSnapType = "none";

    const beweeg = (ev: PointerEvent) => {
      if (!sleep.current.bezig) return;
      const afstand = ev.clientX - sleep.current.startX;
      if (Math.abs(afstand) > 4) sleep.current.verplaatst = true;
      el.scrollLeft = sleep.current.startScroll - afstand;
    };
    const einde = () => {
      sleep.current.bezig = false;
      el.style.scrollSnapType = "";
      window.removeEventListener("pointermove", beweeg);
      window.removeEventListener("pointerup", einde);
      window.removeEventListener("pointercancel", einde);
    };
    window.addEventListener("pointermove", beweeg);
    window.addEventListener("pointerup", einde);
    window.addEventListener("pointercancel", einde);
  }, []);

  /* Was het een sleep, dan is het geen klik. De vlag gaat hier uit, want dit is het laatste
     moment waarop hij nodig is. */
  const misschienKlik = useCallback((e: ReactMouseEvent) => {
    if (!sleep.current.verplaatst) return;
    sleep.current.verplaatst = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className={klasse}>
      <ul
        ref={rij}
        aria-label={label}
        onScroll={meten}
        onPointerDown={(e) => {
          stop();
          sleepStart(e);
        }}
        onClickCapture={misschienKlik}
        onWheel={stop}
        onMouseEnter={stop}
        onFocusCapture={stop}
        className={`diba-schuifrij flex snap-x snap-mandatory scroll-pl-5 gap-4 px-5 pb-2 select-none sm:scroll-pl-9 sm:px-9 lg:scroll-pl-[7.5vw] lg:px-[7.5vw] [@media(pointer:fine)]:cursor-grab [@media(pointer:fine)]:active:cursor-grabbing ${stand.rij}`}
      >
        {items.map((item) => (
          <li
            key={item.sleutel}
            className={`shrink-0 snap-start ${breedte} ${stand.item}`}
          >
            {item.inhoud}
          </li>
        ))}
      </ul>

      {/* De stippen zeggen waar je bent en brengen je ergens heen. Het tikvlak is
          vierentwintig pixels; wat je ziet is de stip erin. */}
      <div
        className={`mx-auto mt-4 flex items-center justify-center gap-1 px-5 sm:px-9 lg:px-[7.5vw] ${stand.stippen}`}
      >
        {items.map((item, i) => (
          <button
            key={item.sleutel}
            type="button"
            onClick={() => {
              stop();
              naar(i);
            }}
            aria-label={`Naar ${item.naam}`}
            aria-current={i === actief ? "true" : undefined}
            className="grid h-6 w-6 place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-[var(--r-pill)] transition-all duration-300 [transition-timing-function:var(--ease-diba)] ${
                i === actief
                  ? "w-5 bg-[var(--g-700)]"
                  : "w-1.5 bg-[var(--g-300)]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
