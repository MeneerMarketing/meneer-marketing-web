"use client";

import { useEffect, type RefObject } from "react";

/**
 * Een uitklapmenu dat dichtgaat als je ergens anders klikt.
 *
 * `details`/`summary` doet dat niet uit zichzelf: het paneel blijft openstaan tot je weer
 * op de knop klikt. Yasin, 13 september 2026: "het is irritant dat ik weer helemaal op de
 * taalswitcher moet klikken." Terecht, want dat is niet hoe een menu zich hoort te
 * gedragen; elk ander uitklapmenu sluit bij een klik erbuiten.
 *
 * Ook de Escape-toets sluit hem, en dan gaat de aandacht terug naar de knop. Dat is de
 * afspraak voor elk paneel dat over de pagina heen valt, en hij was hier nog niet gemaakt.
 */
export function useSluitBuiten(ref: RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    const buiten = (e: Event) => {
      const el = ref.current;
      if (!el || !el.open) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      el.open = false;
    };

    const opToets = (e: KeyboardEvent) => {
      const el = ref.current;
      if (!el || !el.open || e.key !== "Escape") return;
      el.open = false;
      el.querySelector("summary")?.focus();
    };

    /* In de capture-fase: een klik op een link elders wordt door de router afgevangen en
       komt dan niet meer bij een gewone listener op document aan. */
    document.addEventListener("click", buiten, true);
    document.addEventListener("keydown", opToets);
    return () => {
      document.removeEventListener("click", buiten, true);
      document.removeEventListener("keydown", opToets);
    };
  }, [ref]);
}
