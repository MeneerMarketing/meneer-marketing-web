"use client";

import { useEffect, useState } from "react";
import { DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De actiebalk onderaan het scherm, alleen op een telefoon.
 *
 * WAAROM. Yasin, 9 september 2026: de site moet mobiel korter en meer op conversie. Op
 * een telefoon staat de knop uit de hero na één veeg buiten beeld, en de volgende staat
 * soms twaalf schermen lager. Deze balk houdt de twee uitgangen die er echt toe doen
 * binnen duimbereik: een afspraak maken en een vraag stellen via WhatsApp.
 *
 * WANNEER HIJ ER IS, EN WANNEER NIET.
 *
 * - Niet zolang de eerste primaire knop van de pagina in beeld is: twee primaire knoppen
 *   op één scherm is tegen de huisregel (§5). De balk verschijnt pas als die knop boven
 *   het scherm uit is gescrold; op een pagina zonder zo'n knop na één scherm.
 * - Niet onderaan de pagina: daar staat het afsluitende blok met dezelfde knop.
 * - Niet zolang de cookiebalk er staat; die heeft dezelfde plek en gaat voor.
 * - Nooit op desktop (lg en breder): daar is de knop in de navigatie altijd in beeld.
 *
 * De balk meldt zijn hoogte in `--actiebalk`, zodat de pagina eronder ruimte houdt en
 * de zwevende huidprofielknop erboven gaat staan in plaats van erachter.
 */

const MOBIEL = "(max-width: 1023px)";
const HOOGTE = "4.5rem";

export default function MobieleActiebalk() {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const bereken = () => {
      if (!window.matchMedia(MOBIEL).matches) {
        setZichtbaar(false);
        return;
      }
      const y = window.scrollY;
      const scherm = window.innerHeight;
      const totaal = document.documentElement.scrollHeight;
      const cookiebalk = document.querySelector("[data-cookiebalk]");
      /* De eerste primaire knop op de pagina: het donkergroene vlak of, op een donkere
         hero, het lichte knopvlak. Zolang die in beeld is, blijft de balk weg. */
      const eersteKnop = [
        ...document.querySelectorAll("main a, main button"),
      ].find(
        (el) =>
          /bg-\[var\(--g-700\)\]|bg-\[var\(--on-dark-btn\)\]/.test(
            el.className,
          ) && el.getBoundingClientRect().height > 30,
      );
      const voorbijKnop = eersteKnop
        ? eersteKnop.getBoundingClientRect().bottom < 0
        : y > scherm * 0.85;
      const bijHetEinde = y + scherm > totaal - 640;
      setZichtbaar(!cookiebalk && voorbijKnop && !bijHetEinde);
    };
    bereken();
    window.addEventListener("scroll", bereken, { passive: true });
    window.addEventListener("resize", bereken);
    /* De cookiebalk verdwijnt zonder dat er gescrold wordt; even nakijken. */
    const klok = window.setInterval(bereken, 800);
    return () => {
      window.removeEventListener("scroll", bereken);
      window.removeEventListener("resize", bereken);
      window.clearInterval(klok);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--actiebalk",
      zichtbaar ? HOOGTE : "0px",
    );
  }, [zichtbaar]);

  if (!zichtbaar) return null;

  /* Sinds 10 september 2026 staat de agenda op onze eigen pagina; zie /afspraak. */
  const boeken = "/afspraak";
  const extern = boeken.startsWith("http");

  return (
    <div
      role="region"
      aria-label="Snel een afspraak maken"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--g-100)] bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(67,79,58,.10)] backdrop-blur-sm lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <a
          href={boeken}
          {...(extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="diba-label flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          Afspraak maken
          {extern ? <span aria-hidden="true">↗</span> : null}
        </a>
        <a
          href={DIBA_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-4 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
