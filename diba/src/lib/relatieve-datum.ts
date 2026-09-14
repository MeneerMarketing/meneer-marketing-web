import type { Taal } from "@/lib/taal";

/**
 * "23 dagen geleden" in de taal van de pagina.
 *
 * WAAROM DIT GEEN WOORDENBOEKREGELS ZIJN.
 *
 * De reviews dragen hun datum als tekst, zoals Salonized hem levert, en dat levert
 * vijfendertig verschillende zinnen op: van "ongeveer 12 uur geleden" tot "meer dan 7 jaar
 * geleden". Die allemaal in het woordenboek zetten werkt tot de volgende review binnenkomt
 * met een vorm die er nog niet in staat, en dan staat er ineens Nederlands tussen het
 * Engels. Dit zijn regels in plaats van losse regels, dus elke nieuwe vorm gaat vanzelf mee.
 *
 * De reviewtekst zelf vertalen we niet: die is door een klant geschreven en een vertaalde
 * review is een verzonnen review. De datum eromheen is van ons.
 */

const EENHEDEN: readonly (readonly [RegExp, string, string])[] = [
  [/\buur\b/, "hour", "hours"],
  [/\bdag(en)?\b/, "day", "days"],
  [/\bweken?\b/, "week", "weeks"],
  [/\bmaand(en)?\b/, "month", "months"],
  [/\bjaar|jaren\b/, "year", "years"],
];

export function relatieveDatum(nl: string, taal: Taal): string {
  /* Alleen Engels. De Spaanse kant toont voorlopig de Nederlandse vorm van een
     reviewdatum; die staat naast een Nederlandse review, dus dat is consequent. Zodra de
     reviews een Spaanse vertaling krijgen hoort hier een tabel per taal. */
  if (taal !== "en") return nl;

  const tekst = nl.toLowerCase();

  const eenheid = EENHEDEN.find(([patroon]) => patroon.test(tekst));
  if (!eenheid) return nl;

  const getal = tekst.match(/\d+/)?.[0];
  const isEen = /\been\b/.test(tekst);
  const aantal = getal ?? (isEen ? "a" : "");
  const woord = getal && getal !== "1" ? eenheid[2] : eenheid[1];

  /* De bepaling vooraf: "ongeveer", "bijna", "meer dan". */
  let vooraf = "";
  if (tekst.startsWith("ongeveer")) vooraf = "about ";
  else if (tekst.startsWith("bijna")) vooraf = "almost ";
  else if (tekst.startsWith("meer dan")) vooraf = "over ";

  const kern = `${vooraf}${aantal} ${woord} ago`.replace(/\s+/g, " ").trim();
  return kern.charAt(0).toUpperCase() + kern.slice(1);
}
