import { inTaal } from "@/lib/taalpad";
import { taalNu } from "@/lib/taalcontext";

/**
 * Het adres in de taal van deze aanvraag, voor server components.
 *
 * `Linktaal` doet dit voor een `<Link>`, maar niet elke link is er een: een lijstje waarin
 * het adres soms een pagina is en soms een `mailto:` staat als rauwe `<a>` in de pagina, en
 * die ging op de Engelse kant naar het Nederlands. Zo bleef /en/careers naar
 * /vacatures/huidtherapeut wijzen terwijl /en/vacancies/skin-therapist ernaast stond en
 * nergens vandaan bereikbaar was.
 *
 * Een adres dat geen pad is (mailto:, tel:, https:) komt er onveranderd uit; zie `inTaal`.
 */
export function eigenPad(href: string): string {
  const taal = taalNu();
  return inTaal(href, taal === "nl" ? "/" : `/${taal}`);
}
