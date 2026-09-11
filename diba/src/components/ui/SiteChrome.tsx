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

  const eigenChrome = pathname === "/";

  if (eigenChrome) {
    return <>{children}</>;
  }

  return (
    <div className={figmaHomeShell}>
      <Topbalk />
      <HoofdNav />
      {children}
      <SiteFooter />
    </div>
  );
}
