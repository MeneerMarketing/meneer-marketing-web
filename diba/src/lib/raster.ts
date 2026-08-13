/**
 * Het tweekolomsraster van de secties.
 *
 * WAAROM DIT BESTAAT.
 *
 * De koppen van secties (`SectieKop`) staan in twee kolommen: kop links, introzin rechts.
 * De inhoud eronder staat ook in twee kolommen. Die twee raakten los van elkaar, en dat
 * was zichtbaar: op de littekenpagina begon de introzin op 594 pixels terwijl het paneel
 * eronder op 626 begon. Tweeëndertig pixels ernaast, precies in het midden van het scherm
 * waar je het het hardst ziet.
 *
 * De oorzaak was niet één foutje. Over de componenten heen stonden negentien verschillende
 * kolomverhoudingen met door elkaar lopende gaps: 0.85/1.15 met gap-6, 0.9/1.1 met gap-8,
 * 1.05/0.95 met lg:gap-12. Elke sectie had zijn eigen indeling verzonnen, dus uitlijnen
 * kon per definitie niet.
 *
 * HOE HET NU WERKT.
 *
 * Eén verhouding en één gap voor elke sectie die "kop links, inhoud rechts" doet. Wie deze
 * constante gebruikt lijnt automatisch uit met de kop erboven, want die gebruikt hem ook.
 *
 * De verhouding 0.9/1.1 is gekozen omdat de rechterkolom bijna altijd het paneel met tekst
 * is en die meer ruimte nodig heeft dan de kop links. De gap loopt van 32 naar 48 pixels
 * mee met het scherm, zoals de rest van de site.
 *
 * WANNEER JE HEM NIET GEBRUIKT.
 *
 * Bij een sectie die geen kop-plus-inhoud is maar twee gelijkwaardige helften, of bij een
 * raster van kaarten. Daar is uitlijnen met een sectiekop niet aan de orde. Zet er dan wel
 * een reden bij, anders groeit het aantal varianten vanzelf weer terug naar negentien.
 */

/** Kop links, inhoud rechts. Gebruik dit in `SectieKop` én in wat eronder staat. */
export const RASTER_SECTIE =
  "grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12";

/**
 * Twee gelijke helften, voor een sectie die twee dingen náást elkaar zet.
 *
 * Wat werkt tegenover wat niet werkt, bijvoorbeeld: die twee horen even zwaar te wegen en
 * dus even breed te zijn. De verhouding 0.9/1.1 zou daar suggereren dat de rechterkolom
 * belangrijker is.
 */
export const RASTER_GELIJK = "grid gap-8 lg:grid-cols-2 lg:gap-8";

/**
 * Dezelfde kolommen, maar met de onderkanten gelijk.
 *
 * Alleen voor de sectiekop zelf: de introzin hoort op één lijn met de onderkant van de
 * kop te staan en niet tegen de bovenkant geplakt.
 */
export const RASTER_SECTIEKOP = `${RASTER_SECTIE} lg:items-end`;

/**
 * De sectiekop boven een sectie met twee gelijke helften.
 *
 * Zonder deze variant stond de introzin op 635 terwijl de twee kaarten eronder op 681
 * begonnen: zesenveertig pixels ernaast, en dat zie je omdat de zin er recht boven staat.
 * De kop volgt dus de indeling van wat eronder komt en niet andersom.
 */
export const RASTER_SECTIEKOP_GELIJK = `${RASTER_GELIJK} lg:items-end`;
