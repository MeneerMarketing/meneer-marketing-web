"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WoordenboekContext } from "@/components/i18n/Woordenboek";
import { taalVanPad } from "@/lib/taal";

type Boek = Readonly<Record<string, string>>;

/**
 * Het woordenboek gekozen op het adres, voor de ene plek die buiten de taalgroepen valt.
 *
 * De 404 in `app/not-found.tsx` hangt niet onder `(nl)`, `(en)` of `(es)`: een adres als
 * /en/oude-link past in geen enkele route, dus Next rendert de wortel-404 zonder indeling.
 * Daar is geen taalprovider, en dan zou `useT` Nederlands geven boven een Engels adres.
 *
 * WAAROM DE IMPORT LUI IS EN NIET STATISCH. De eerste versie importeerde beide
 * woordenboeken bovenaan dit bestand. Dat leek onschuldig — dit onderdeel staat alleen op
 * de 404 — maar Next neemt de wortel-404 op in de boom van élke route, als vangnet. Een
 * statische import hier komt daardoor in de gedeelde chunk terecht die iedere pagina laadt,
 * en de hele winst van de splitsing was weg: gemeten stond er weer 1989 kB woordenboek op
 * de homepage. Met `import()` in een effect wordt het een eigen chunk die pas over de lijn
 * gaat als dit onderdeel echt draait, dus alleen bij wie op een 404 belandt.
 *
 * Tot het geladen is staat er Nederlands. De server levert die 404 sowieso al in het
 * Nederlands uit, dus dat is geen verandering; de vertaling komt een tel na de hydratie.
 */
export default function WoordenboekOpPad({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const taal = taalVanPad(usePathname() ?? "/");
  const [boek, zetBoek] = useState<Boek>({});

  useEffect(() => {
    let actueel = true;
    /* Alleen de vreemde talen laden iets; het Nederlands heeft geen woordenboek nodig en
       zet hier dus ook niets — de lege beginstaat is al het goede antwoord. */
    if (taal === "en") {
      import("@/i18n/en").then((m) => actueel && zetBoek(m.WOORDENBOEK));
    } else if (taal === "es") {
      import("@/i18n/es").then((m) => actueel && zetBoek(m.WOORDENBOEK));
    }
    return () => {
      actueel = false;
    };
  }, [taal]);

  return (
    <WoordenboekContext.Provider value={taal === "nl" ? {} : boek}>
      {children}
    </WoordenboekContext.Provider>
  );
}
