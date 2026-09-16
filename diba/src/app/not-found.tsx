import type { Metadata } from "next";
import WoordenboekOpPad from "@/components/i18n/WoordenboekOpPad";
import Nietgevonden from "@/components/ui/Nietgevonden";
import Paginavulling from "@/components/ui/Paginavulling";
import { LETTERKLASSEN } from "@/lib/lettertypen";
import "./globals.css";

/**
 * De 404 voor een adres dat bij geen van beide talen hoort.
 *
 * Dit bestand staat buiten `(nl)` en `(en)`, en daarmee buiten allebei de wortelindelingen:
 * een adres als /oude-link-uit-2019 valt in geen van de twee groepen, dus Next weet niet
 * welke indeling eromheen hoort. Zonder dit bestand krijgt zo'n bezoeker de kale
 * "404: This page could not be found." van Next, in plaats van onze pagina met de zoekhulp.
 *
 * Next zet hier zijn eigen html en body omheen. Daarom maakt deze pagina die niet zelf; een
 * tweede html-element in dezelfde stroom is ongeldige opmaak. Het gevolg is wel dat onze
 * klassen niet op html en body kunnen staan: de lettertypes en de kolomindeling staan
 * daarom op deze schil, met `.paginaschil-los` in globals.css erbij voor de basisletter.
 *
 * Binnen een taal is er een eigen 404: `(nl)/not-found.tsx` en `(en)/not-found.tsx`. Die
 * vangen `notFound()` vanuit een pagina die wél bestaat, bijvoorbeeld een behandeling die
 * er niet meer is, en staan netjes in de indeling van hun eigen taal.
 */

export const metadata: Metadata = {
  title: "Deze link hoort bij de oude site",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={`${LETTERKLASSEN} paginaschil-los antialiased`}>
      {/* Deze 404 hangt buiten de taalgroepen, dus hij krijgt zijn woordenboek niet van
          een indeling. `WoordenboekOpPad` kiest het op het adres en laadt het lui — alleen
          hier, en alleen wie hier belandt betaalt dat. Hij staat óm `Paginavulling`, want
          die zet navigatie en voettekst om de inhoud heen en ook die moeten vertaald zijn.
          Zie components/i18n/Woordenboek.tsx. */}
      <WoordenboekOpPad>
        <Paginavulling>
          <Nietgevonden />
        </Paginavulling>
      </WoordenboekOpPad>
    </div>
  );
}
