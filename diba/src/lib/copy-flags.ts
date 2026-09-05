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

/**
 * Dezelfde schoonmaak, maar dan door een hele gegevensstructuur heen.
 *
 * Nodig omdat `publicCopy` pas werkt op het moment van tonen. Een client component krijgt
 * zijn gegevens ruw mee, en Next zet die gegevens in de pagina zodat de browser het
 * component kan overnemen. De vlaggen stonden daardoor in de broncode van zeventig
 * pagina's: onzichtbaar voor de bezoeker, leesbaar voor wie de bron opent.
 *
 * Gebruik dit op alles wat een client component als prop krijgt. Voor tekst die de server
 * zelf rendert blijft `publicCopy` genoeg.
 */
export function zonderVlaggen<T>(waarde: T): T {
  if (typeof waarde === "string") return publicCopy(waarde) as T;
  if (Array.isArray(waarde)) return waarde.map(zonderVlaggen) as T;
  if (waarde && typeof waarde === "object") {
    const uit: Record<string, unknown> = {};
    for (const [sleutel, v] of Object.entries(waarde)) {
      uit[sleutel] = zonderVlaggen(v);
    }
    return uit as T;
  }
  return waarde;
}
