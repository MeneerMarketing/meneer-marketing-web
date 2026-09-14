import { WOORDENBOEK as EN } from "@/i18n/en";
import { WOORDENBOEK as ES } from "@/i18n/es";
import type { Taal } from "@/lib/taal";

/**
 * Welk woordenboek hoort bij welke taal.
 *
 * Het Nederlands heeft er geen: dat is de bron, en de sleutel ís de Nederlandse zin. Een
 * leeg object in plaats van een uitzondering, zodat `vertaal()` één vorm houdt.
 */
export const WOORDENBOEKEN: Readonly<
  Record<Taal, Readonly<Record<string, string>>>
> = {
  nl: {},
  en: EN,
  es: ES,
};
