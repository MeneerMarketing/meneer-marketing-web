/**
 * Verwijdert interne redactievlaggen uit zichtbare UI-copy.
 *
 * De lijst hieronder is dezelfde als die in `lib/pagina-af.ts`, en dat moet zo blijven.
 * Toen die twee uit elkaar liepen stonden `[GEGEVEN-NODIG]` en `[BESLUIT-OKAN]` gewoon in
 * beeld: de poort herkende ze wél als onaf, maar deze functie haalde ze niet weg.
 *
 * Blijft er ná het strippen niets over, dan bestond de tekst alleen uit een vlag. Geef dan
 * een `terugval` mee: een leeg vlak op de plek van een prijs is verwarrender dan de
 * mededeling dat hij er nog niet staat.
 */
const VLAGGEN =
  /\s*\[(COPY-NODIG|PRIJS-NODIG|BEELD-NODIG|GEGEVEN-NODIG|MENSELIJKE-ZIN|MEDISCHE-CHECK-ROJDA|BESLUIT-OKAN)[^\]]*\]/g;

export function publicCopy(text: string, terugval = ""): string {
  const schoon = text.replace(VLAGGEN, "").trim();
  return schoon || terugval;
}
