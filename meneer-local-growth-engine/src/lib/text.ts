/**
 * Tekst-normalisatie voor previewcopy.
 * Studio-snapshots komen deels uit LLM-output; die levert regelmatig
 * lange streepjes en dubbele spaties op. Copy-regels verbieden em-dash.
 */

const DASHES = /[\u2012\u2013\u2014\u2015]/g;
const QUOTES_DOUBLE = /[\u201C\u201D\u201E\u00AB\u00BB]/g;
const WHITESPACE = /\s+/g;

export function plainText(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(DASHES, "-").replace(WHITESPACE, " ").trim();
}

/** Contact-e-mail altijd lowercase in UI en mailto-links. */
export function normalizeEmail(input: string | null | undefined): string | null {
  const cleaned = plainText(input);
  if (!cleaned || !cleaned.includes("@")) return null;
  return cleaned.toLowerCase();
}

export function quoteText(input: string | null | undefined): string {
  return plainText(input).replace(QUOTES_DOUBLE, "").replace(/^["']|["']$/g, "");
}

export function sentences(input: string | null | undefined): string[] {
  const text = plainText(input);
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function wordCount(input: string | null | undefined): number {
  const text = plainText(input);
  return text ? text.split(" ").length : 0;
}

/** Kort af op woordgrens. Knipt bij voorkeur op een komma zodat de zin loopt. */
export function clampWords(input: string | null | undefined, maxWords: number): string {
  const text = plainText(input);
  if (!text) return "";
  const parts = text.split(" ");
  if (parts.length <= maxWords) return text;

  const head = parts.slice(0, maxWords).join(" ");
  const lastComma = head.lastIndexOf(",");
  if (lastComma > head.length * 0.5) {
    return `${head.slice(0, lastComma)}.`;
  }
  return `${head.replace(/[.,;:]$/, "")}.`;
}

/** Groepeert zinnen in alinea's van maxPerParagraph zinnen. */
export function toParagraphs(
  input: string | null | undefined,
  maxPerParagraph = 2
): string[] {
  const all = sentences(input);
  if (all.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < all.length; i += maxPerParagraph) {
    out.push(all.slice(i, i + maxPerParagraph).join(" "));
  }
  return out;
}

export function lowerFirst(input: string): string {
  if (!input) return "";
  return input.charAt(0).toLowerCase() + input.slice(1);
}

/** UI-labels: eerste letter altijd hoofdletter (Huidbehandelingen, niet huidbehandelingen). */
export function formatDisplayLabel(input: string | null | undefined): string {
  const text = plainText(input);
  if (!text) return "";
  return text.charAt(0).toLocaleUpperCase("nl-NL") + text.slice(1);
}
