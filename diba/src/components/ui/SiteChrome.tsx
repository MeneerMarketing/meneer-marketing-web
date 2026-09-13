"use client";

import { usePathname } from "next/navigation";
import HoofdNav from "@/components/nav/HoofdNav";
import Topbalk from "@/components/nav/Topbalk";
import SiteFooter from "@/components/ui/SiteFooter";
import { figmaHomeShell } from "@/lib/figma-home-layout";

type SiteChromeProps = {
  children: React.ReactNode;
};

/**
 * De vaste omlijsting van elke pagina: topbalk, hoofdnavigatie, inhoud, voettekst.
 *
 * Een route brengt zijn eigen kop mee en slaat dit over: de homepage, met de schermvullende
 * hero. Zonder die uitzondering staan er twee headers boven elkaar. De hero-variant die hier
 * ook stond is weg sinds de livegang.
 *
 * De topbalk scrollt gewoon mee weg, alleen de navigatie blijft hangen. Andersom zou een
 * kwart van een telefoonscherm permanent bezet zijn door een waardering en een taalkiezer.
 */
export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  /* De homepage brengt zijn eigen kop mee, in beide talen: /en is dezelfde pagina. */
  const eigenChrome = pathname === "/" || pathname === "/en";

  if (eigenChrome) {
    return <>{children}</>;
  }

  /* Hier stond een aparte Engelse omlijsting, omdat het menu naar honderdvijftig
     Nederlandse pagina's wees die er in het Engels niet waren. Die pagina's zijn er nu
     wel, dus het is weer één omlijsting voor allebei de talen: dezelfde balk, hetzelfde
     menu, dezelfde voettekst, met de teksten in de taal van het adres. Dat is wat Yasin
     op 12 september 2026 vroeg: dezelfde site, alleen andere woorden.

     Sinds 13 september is er ook geen uitzondering meer: de vier pagina's die een eigen
     Engels adres hadden zijn weg, en elk adres is nu dezelfde pagina met /en ervoor. */

  return (
    <div className={figmaHomeShell}>
      <Topbalk />
      <HoofdNav />
      {children}
      <SiteFooter />
    </div>
  );
}
