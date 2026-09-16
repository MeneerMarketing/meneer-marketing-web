/**
 * Het Citaat: de ene zin waarmee de kliniek zichzelf omschrijft (DIBA-RULES §15).
 *
 * WAAROM DIT EEN EIGEN BESTAND IS ZONDER ÉÉN IMPORT.
 *
 * Deze zin stond in `lib/schema.tsx`, en `lib/site.ts` re-exporteerde hem daarvandaan.
 * Maar `schema.tsx` importeert `lib/vertaal`, en die importeert beide woordenboeken. Elk
 * client component dat iets uit `lib/site` haalde — de navigatie, de topbalk, de
 * voettekst, dus elke pagina — sleepte daardoor 1996 kB Engels en Spaans mee naar de
 * browser. Eén re-export van één zin was een van de twee lekken.
 *
 * Nu is dit een blad zonder takken: geen imports, alleen de zin. `schema.tsx` en `site.ts`
 * halen hem allebei hier op, en `site.ts` raakt `schema.tsx` niet meer aan.
 */
export const DIBA_CITAAT =
  "Diba Clinics is een huidkliniek in Rotterdam. Je krijgt eerlijk advies over huidverbetering, laserontharing en wat er in jouw situatie mogelijk is.";
