import { anderePad, taalVanPad } from "@/lib/taal";

/**
 * Het adres zoals het in deze taal hoort te staan.
 *
 * In de praktijk komt er /en voor het Nederlandse pad. De lijst met paren staat er nog
 * voor de homepage, want /en is niet /en/; verder is elk Engels adres het Nederlandse met
 * /en ervoor.
 *
 * Dit staat los van de twee linkcomponenten omdat de een in de browser draait en de ander
 * op de server: een functie uit een `"use client"`-bestand is voor de server niet
 * aanroepbaar, alleen te renderen.
 */
export function inTaal(href: string, pad: string): string {
  if (taalVanPad(pad) !== "en") return href;
  if (!href.startsWith("/")) return href;
  if (href.startsWith("/en/") || href === "/en") return href;

  const schoon = href.split(/[?#]/)[0];
  const rest = href.slice(schoon.length);
  const eigen = anderePad(schoon, "en");
  if (eigen) return eigen + rest;

  return schoon === "/" ? `/en${rest}` : `/en${schoon}${rest}`;
}
