"use client";

import { WOORDENBOEK } from "@/i18n/en";
import { WoordenboekContext } from "@/components/i18n/Woordenboek";

/**
 * Het Engelse woordenboek, alleen onder /en.
 *
 * De import hierboven is de hele reden dat dit een apart bestand is: hij staat in een
 * client component dat alleen door `(en)/layout.tsx` wordt aangeraakt, en komt daardoor
 * alleen in de chunks van de Engelse routes terecht. Zie `Woordenboek.tsx`.
 */
export default function WoordenboekEN({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <WoordenboekContext.Provider value={WOORDENBOEK}>
      {children}
    </WoordenboekContext.Provider>
  );
}
