"use client";

import { useEffect } from "react";

/**
 * Klikken op een link naar de pagina waar je al staat.
 *
 * WAT ER GEBEURDE. Je staat onderaan /huidproblemen, in de voettekst, en klikt daar op
 * "Huidproblemen". De router ziet hetzelfde adres, doet niets, en jij blijft onderin
 * staan. Voor wie klikt ziet dat eruit alsof de link stuk is of alsof je opeens in de
 * voettekst van een andere pagina bent beland (Yasin, 12 september 2026).
 *
 * WAT DIT DOET. Alleen dat ene geval: dezelfde pagina, geen anker, gewone linkermuisklik.
 * Dan naar boven. Elke andere navigatie laat dit met rust, want die regelt de router al.
 *
 * Bewust zonder animatie: dit is geen sprong binnen de pagina maar het begin van een
 * nieuwe, en die hoort er meteen te staan. Zie ook de scroll-regel in `globals.css`.
 */
export default function NaarBoven() {
  useEffect(() => {
    const opKlik = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const doel = e.target instanceof Element ? e.target.closest("a") : null;
      if (!doel) return;

      const href = doel.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (doel.target && doel.target !== "_self") return;

      let url: URL;
      try {
        url = new URL(doel.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.hash) return;
      if (url.pathname !== window.location.pathname) return;

      window.scrollTo({ top: 0, behavior: "auto" });
    };

    /* In de capture-fase, dus vóór de router. De Link van Next roept `preventDefault` aan
       op het element zelf, en dat gebeurt eerder dan een gewone listener op document: die
       zag dan een klik die al afgehandeld leek en deed niets. */
    document.addEventListener("click", opKlik, true);
    return () => document.removeEventListener("click", opKlik, true);
  }, []);

  return null;
}
