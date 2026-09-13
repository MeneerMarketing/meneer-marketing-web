"use client";

import { useTaal } from "@/lib/gebruik-taal";

/**
 * "Translated from Dutch", onder een blok met reviews.
 *
 * WAAROM DIT ER STAAT.
 *
 * De reviews zijn door klanten in het Nederlands geschreven. Op de Engelse site staan ze
 * vertaald, want anders is dat het enige stuk van de pagina dat een bezoeker niet kan
 * lezen. Maar een vertaling is niet wat die klant geschreven heeft, en dat zonder
 * vermelding als citaat neerzetten is geen vertalen meer maar woorden in iemands mond
 * leggen.
 *
 * Eén regel per blok, in dezelfde kleine grijze letter als de naam en de datum eronder.
 * Zo doen Booking, Google Maps en TripAdvisor het ook, en om dezelfde reden.
 *
 * Op de Nederlandse kant staat er niets: daar is niets vertaald.
 */
export default function Vertaaldnoot({
  className = "",
}: {
  className?: string;
}) {
  const taal = useTaal();
  if (taal !== "en") return null;
  return (
    <p
      className={`text-[13px] leading-6 text-[var(--t-muted)] ${className}`}
      lang="en"
    >
      Reviews translated from Dutch.
    </p>
  );
}
