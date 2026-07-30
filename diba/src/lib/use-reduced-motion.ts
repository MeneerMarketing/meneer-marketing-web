"use client";

import { useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Leest de systeeminstelling "beperk beweging" (§9: elke animatie is uit te zetten).
 *
 * matchMedia is een externe bron, geen afgeleide state — vandaar useSyncExternalStore
 * in plaats van een effect met setState. Op de server is het antwoord altijd false,
 * zodat de eerste render op server en client gelijk is en de hydratie klopt.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    (herteken) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", herteken);
      return () => mq.removeEventListener("change", herteken);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}
