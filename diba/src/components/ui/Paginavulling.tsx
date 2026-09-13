import KliniekSchema from "@/components/ui/KliniekSchema";
import SiteChrome from "@/components/ui/SiteChrome";
import Taalmarkering from "@/components/ui/Taalmarkering";
import RevealObserver from "@/components/ui/RevealObserver";
import CookieBar from "@/components/ui/CookieBar";
import MobieleActiebalk from "@/components/ui/MobieleActiebalk";
import NaarBoven from "@/components/ui/NaarBoven";
import HuidprofielKnop from "@/components/ui/HuidprofielKnop";
import Analytics from "@/components/ui/Analytics";
import { DIBA_ADDRESS } from "@/lib/site";
import type { Taal } from "@/lib/taal";

/**
 * Alles wat op elke pagina staat: de omlijsting, de inhoud, en de vaste onderdelen die
 * eronder hangen.
 *
 * Dit zit los van `Paginaschil` omdat er één pagina is die het html- en body-element niet
 * zelf mag maken: de 404 buiten beide taalgroepen. Next zet daar zijn eigen document
 * omheen, en een tweede html-element in dezelfde stroom is ongeldige opmaak.
 *
 * Zonder `taal` is er geen route om de taal aan af te lezen; dan doet `Taalmarkering` het
 * in de browser.
 */
export default function Paginavulling({
  taal,
  children,
}: Readonly<{ taal?: Taal; children: React.ReactNode }>) {
  return (
    <>
      {taal === undefined ? <Taalmarkering /> : null}
      <SiteChrome>
        <RevealObserver />
        {children}
      </SiteChrome>
      <KliniekSchema />
      <span className="sr-only">{DIBA_ADDRESS.line}</span>
      <HuidprofielKnop />
      <MobieleActiebalk />
      <NaarBoven />
      <CookieBar />
      <Analytics />
    </>
  );
}
