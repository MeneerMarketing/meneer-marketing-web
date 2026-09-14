import { anderePad, taalVanPad } from "@/lib/taal";

/**
 * Het adres zoals het in deze taal hoort te staan.
 *
 * In de praktijk komt er /en of /es voor het Nederlandse pad, met de slugs van die taal
 * erbij: `/tarieven` wordt `/en/prices` en `/es/precios`. De homepage is de uitzondering,
 * want /en is niet /en/.
 *
 * Dit staat los van de twee linkcomponenten omdat de een in de browser draait en de ander
 * op de server: een functie uit een `"use client"`-bestand is voor de server niet
 * aanroepbaar, alleen te renderen.
 */
export function inTaal(href: string, pad: string): string {
  const taal = taalVanPad(pad);
  if (taal === "nl") return href;
  if (!href.startsWith("/")) return href;
  /* Al in de goede taal: niet nog een keer het voorvoegsel ervoor. */
  if (href === `/${taal}` || href.startsWith(`/${taal}/`)) return href;

  const schoon = href.split(/[?#]/)[0];
  const rest = href.slice(schoon.length);
  const eigen = anderePad(schoon, taal);
  if (eigen) return eigen + rest;

  /* Geen tegenhanger (de vier paden uit `GEEN_VERTALING`): dan blijft het Nederlandse
     adres staan. Dat is de enige eerlijke uitkomst — een adres verzinnen dat niet bestaat
     levert een 404 op. */
  return href;
}
