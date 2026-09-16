"use client";

import { useTaal } from "@/lib/gebruik-taal";
import type { Taal } from "@/lib/taal";

/**
 * "Translated from Dutch", onder een blok met reviews.
 *
 * WAAROM DIT ER STAAT.
 *
 * De reviews zijn door klanten in het Nederlands geschreven. Op de Engelse en de Spaanse
 * site staan ze vertaald, want anders is dat het enige stuk van de pagina dat een
 * bezoeker niet kan lezen. Maar een vertaling is niet wat die klant geschreven heeft, en
 * dat zonder vermelding als citaat neerzetten is geen vertalen meer maar woorden in
 * iemands mond leggen.
 *
 * Eén regel per blok, in dezelfde kleine grijze letter als de naam en de datum eronder.
 * Zo doen Booking, Google Maps en TripAdvisor het ook, en om dezelfde reden.
 *
 * Op de Nederlandse kant staat er niets: daar is niets vertaald. Komt er ooit een blok dat
 * in één taal nog niet vertaald is, dan zegt `vertaald` waar de noot wél klopt; daarbuiten
 * staat er ook niets. Sinds 16 september 2026 zijn alle blokken in beide talen vertaald.
 */
type Vreemd = Exclude<Taal, "nl">;

const NOOT: Readonly<Record<Vreemd, string>> = {
  en: "Reviews translated from Dutch.",
  es: "Reseñas traducidas del neerlandés.",
};

const ALLE: readonly Vreemd[] = ["en", "es"];

export default function Vertaaldnoot({
  className = "",
  vertaald = ALLE,
}: {
  className?: string;
  /** De talen waarin het blok erboven echt vertaald is. */
  vertaald?: readonly Vreemd[];
}) {
  const taal = useTaal();
  if (taal === "nl" || !vertaald.includes(taal)) return null;
  return (
    <p
      className={`text-[13px] leading-6 text-[var(--t-muted)] ${className}`}
      lang={taal}
    >
      {NOOT[taal]}
    </p>
  );
}
