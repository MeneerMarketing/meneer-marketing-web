"use client";

import { usePathname } from "next/navigation";
import HoofdNav from "@/components/nav/HoofdNav";
import Topbalk from "@/components/nav/Topbalk";
import SiteFooter from "@/components/ui/SiteFooter";
import { figmaHomeShell } from "@/lib/figma-home-layout";

type SiteChromeProps = {
  children: React.ReactNode;
  instagramHref?: string;
};

/**
 * De vaste omlijsting van elke pagina: topbalk, hoofdnavigatie, inhoud, voettekst.
 *
 * Twee routes brengen hun eigen kop mee en slaan dit over: de homepage en de hero-variant
 * die als voorbeeld naast de homepage staat. Zonder die uitzondering staan er twee headers
 * boven elkaar en valt er niets te beoordelen.
 *
 * De topbalk scrollt gewoon mee weg, alleen de navigatie blijft hangen. Andersom zou een
 * kwart van een telefoonscherm permanent bezet zijn door een waardering en een taalkiezer.
 */
export default function SiteChrome({
  children,
  instagramHref,
}: SiteChromeProps) {
  const pathname = usePathname();

  const eigenChrome = pathname === "/" || pathname === "/home-variant";

  if (eigenChrome) {
    return <>{children}</>;
  }

  return (
    <div className={figmaHomeShell}>
      <Topbalk />
      <HoofdNav />
      {children}
      <SiteFooter instagramHref={instagramHref} />
    </div>
  );
}
