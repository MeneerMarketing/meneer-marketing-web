import type { Metadata } from "next";
import { DIBA_CITAAT, DIBA_SITE } from "@/lib/site";
import type { Taal } from "@/lib/taal";
import { vertaal } from "@/lib/vertaal";

/**
 * De metadata van de wortelindeling, in de taal van de indeling.
 *
 * Hier staat de titelsjabloon en de omschrijving die een pagina gebruikt als hij er zelf
 * geen meebrengt. Dat laatste komt bijna niet voor, maar als het gebeurt hoort er op de
 * Engelse kant geen Nederlandse zin te staan.
 *
 * De taal komt als argument binnen en niet uit `taalNu()`: metadata wordt berekend bij het
 * laden van de module, en dan is er nog geen paginaopbouw waar een taal in staat.
 */
export function basisMetadata(taal: Taal): Metadata {
  return {
    title: {
      default: `${DIBA_SITE.name} | ${vertaal(DIBA_SITE.area, taal)}`,
      template: `%s | ${DIBA_SITE.name}`,
    },
    description: vertaal(DIBA_CITAAT, taal),
    metadataBase: new URL(DIBA_SITE.baseUrl),
    // Geen `icons` meer: src/app/icon.svg wordt automatisch als favicon opgepikt.
    // Dat is de groene variant uit de merkmap (#405038) in plaats van de bijna-zwarte
    // PNG, en 2 kB in plaats van 70 kB.
  };
}
