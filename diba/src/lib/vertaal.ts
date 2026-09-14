import { WOORDENBOEKEN } from "@/i18n";
import { publicCopy } from "@/lib/copy-flags";
import { taalNu } from "@/lib/taalcontext";
import type { Taal } from "@/lib/taal";

/**
 * Eén zichtbare tekst, in de taal van deze pagina.
 *
 * WAAROM DE NEDERLANDSE ZIN DE SLEUTEL IS.
 *
 * De gebruikelijke manier is een sleutel per tekst, `home.hero.kop`. Bij zevenduizend
 * teksten betekent dat zevenduizend namen verzinnen, en een sleutel die nergens meer
 * gebruikt wordt valt niet op. Hier is de Nederlandse zin zelf de sleutel:
 *
 *   t("Alle tarieven op één plek")
 *
 * Voordelen die hier zwaarder wegen dan de nadelen: de code blijft leesbaar zonder het
 * woordenboek erbij te pakken, een ontbrekende vertaling levert Nederlands op in plaats
 * van een kapotte sleutel, en `scripts/vertaalstand.mjs` kan precies zeggen hoeveel er nog
 * open staat.
 *
 * Het nadeel is dat een wijziging in de Nederlandse zin de vertaling losmaakt. Dat is met
 * opzet: een gewijzigde zin ís een nieuwe vertaling, en hij hoort weer op de lijst te
 * komen in plaats van stilletjes de oude Engelse tekst te houden.
 */
export function t(nl: string): string {
  return vertaal(nl, taalNu());
}

/** Dezelfde vertaling, met de taal er expliciet bij. Voor client components. */
export function vertaal(nl: string, taal: Taal): string {
  if (taal === "nl") return nl;
  return WOORDENBOEKEN[taal][nl] ?? nl;
}

/** Staat deze tekst al in het woordenboek van deze taal? Voor de voortgangsmeting. */
export function isVertaald(nl: string, taal: Taal = "en"): boolean {
  return Object.prototype.hasOwnProperty.call(WOORDENBOEKEN[taal], nl);
}

/**
 * De gepubliceerde tekst, in de taal van deze pagina.
 *
 * Dit is de sleutel tot de rest van de site. Bijna alle zichtbare tekst komt uit de
 * databestanden en gaat daar door `publicCopy`, dat de redactievlaggen eraf haalt. Door
 * die ene aanroep te vervangen door deze loopt al die tekst ook langs het woordenboek,
 * zonder dat er honderd pagina's herschreven hoeven te worden.
 *
 * De sleutel in het woordenboek is de schoongemaakte Nederlandse zin, dus zonder
 * [MEDISCHE-CHECK-ROJDA] en de andere markeringen. Dat leest beter en het voorkomt dat een
 * vertaling losraakt zodra er een vlag bij komt of afgaat.
 */
export function tc(ruw: string, terugval = ""): string {
  return t(publicCopy(ruw, terugval));
}
