"use client";

import Link from "next/link";
import { TAAL_COOKIE, TAAL_COOKIE_MAXAGE, type Taal } from "@/lib/taal";

/**
 * Een link die tegelijk de taalkeuze bijwerkt.
 *
 * WAAROM DIT BESTAAT.
 *
 * Op de Engelse pagina's staan een paar links die zeggen wat ze doen: "Full site in Dutch",
 * en op een behandelpagina de verwijzing naar dezelfde behandeling in het Nederlands. Wie
 * daarop klikt, kiest een taal. Deden die links dat niet, dan bleef het koekje op `en`
 * staan en kwam dezelfde bezoeker de volgende keer opnieuw in het Engels binnen, terwijl
 * hij net had aangegeven dat hij het Nederlands wil.
 *
 * Dit is dus geen extra techniek maar dezelfde regel als in de taalkiezer: het koekje
 * verandert alleen als iemand zelf op een taal klikt. Deze links zijn zo'n klik.
 */

export function onthoudTaal(taal: Taal) {
  document.cookie = `${TAAL_COOKIE}=${taal}; path=/; max-age=${TAAL_COOKIE_MAXAGE}; samesite=lax`;
}

export type TaalLinkProps = {
  readonly href: string;
  /** De taal waar deze link heen gaat. */
  readonly taal: Taal;
  readonly className?: string;
  readonly children: React.ReactNode;
};

export default function TaalLink({
  href,
  taal,
  className,
  children,
}: TaalLinkProps) {
  return (
    <Link
      href={href}
      lang={taal}
      className={className}
      onClick={() => onthoudTaal(taal)}
    >
      {children}
    </Link>
  );
}
