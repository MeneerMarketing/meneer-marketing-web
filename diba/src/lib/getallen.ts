import { TAALCODES, type Taal } from "@/lib/taal";

/**
 * Getallen in de taal van de pagina.
 *
 * WAAROM DIT MOET.
 *
 * Nederlands en Engels zetten de punt en de komma precies omgekeerd. `3.893` is hier
 * bijna vierduizend en in het Engels bijna vier; `9,7` is hier een rapportcijfer en in het
 * Engels niets. Op /en stond onder in beeld "based on 3.893 reviews" en in de hero "€ 1.495"
 * voor een laserpakket — allebei letterlijk duizend keer te laag gelezen.
 *
 * Het is dus geen opmaakdetail maar een vertaalfout, en hij zat overal waar een getal op
 * het scherm komt: de cijferstrook, de reviewbalk, de tarieven en de tabellen.
 *
 * HOE.
 *
 * Deze functies krijgen de taal mee in plaats van hem zelf op te zoeken. Dat is met opzet:
 * de server kent hem via `taalNu()` en de browser via `useTaal()`, en een functie die in
 * beide werelden wordt aangeroepen kan geen van beide zelf gebruiken. Een verplicht
 * argument betekent bovendien dat de compiler elke plek aanwijst waar het nog ontbreekt.
 */

/**
 * De opmaakcode van een taal.
 *
 * Staat in `lib/taal.ts` naast de hreflang- en de Open Graph-code, zodat er één plek is
 * waar een nieuwe taal zijn codes krijgt. Let op: het Spaans schrijft de punt en de komma
 * net als het Nederlands (1.495 en 9,7), het Engels omgekeerd.
 */
export function taalcode(taal: Taal): string {
  return TAALCODES[taal].html;
}

/**
 * Een getal in de notatie van de taal: 3.893 hier, 3,893 in het Engels.
 *
 * Zonder afronding, en dat is met opzet. Hier stond `maximumFractionDigits: 0` als
 * standaard, en daarmee werd het Zorgkaart-cijfer 9,7 in alle drie de talen een ronde 10.
 * Een getal afronden is een keuze van de aanroeper, niet van de opmaak; wie een heel getal
 * wil zegt dat erbij (zie `euro` hieronder en `prijsCijfer`).
 *
 * Let op wat het Spaans hier anders doet: dat groepeert een getal van vier cijfers niet
 * ("3893 reseñas" en niet "3.893"), en dat is de Spaanse schrijfwijze en geen fout.
 */
export function getal(
  n: number,
  taal: Taal,
  opties: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(taalcode(taal), opties).format(n);
}

/**
 * Een bedrag in hele euro's: "€ 1.495" hier, "€ 1,495" in het Engels.
 *
 * De harde spatie staat er met de hand in en komt niet uit `Intl`. Twee redenen: het
 * Engels zet er van zichzelf géén spatie tussen, en de honderd zinnen in het woordenboek
 * die zelf een bedrag noemen schrijven allemaal "€ 50". Zonder die spatie zou de ene
 * helft van een Engelse pagina "€50" tonen en de andere helft "€ 50".
 *
 * Hard en niet gewoon, omdat een bedrag nooit over twee regels mag breken.
 */
export function euro(bedrag: number, taal: Taal): string {
  return `€ ${getal(bedrag, taal)}`;
}
