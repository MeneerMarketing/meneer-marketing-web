/** Verwijdert interne redactie-vlaggen uit zichtbare UI-copy. */
export function publicCopy(text: string): string {
  return text
    .replace(/\s*\[MEDISCHE-CHECK-ROJDA\]/g, "")
    .replace(/\s*\[COPY-NODIG[^\]]*\]/g, "")
    .replace(/\s*\[PRIJS-NODIG\]/g, "")
    .replace(/\s*\[BEELD-NODIG[^\]]*\]/g, "")
    .replace(/\s*\[MENSELIJKE-ZIN\]/g, "")
    .trim();
}
