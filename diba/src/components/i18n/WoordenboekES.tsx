"use client";

import { WOORDENBOEK } from "@/i18n/es";
import { WoordenboekContext } from "@/components/i18n/Woordenboek";

/**
 * Het Spaanse woordenboek, alleen onder /es. Zie `WoordenboekEN.tsx` en `Woordenboek.tsx`.
 */
export default function WoordenboekES({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <WoordenboekContext.Provider value={WOORDENBOEK}>
      {children}
    </WoordenboekContext.Provider>
  );
}
