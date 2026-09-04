/** Haalt het e-mailadres uit "Naam <mail@domein.nl>" of plain mail@. */
export function parseEmailAddress(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  const angle = trimmed.match(/<([^>]+)>/);
  const candidate = (angle?.[1] ?? trimmed).trim().toLowerCase();
  if (!candidate.includes("@")) return null;
  return candidate;
}

export function normalizeEmailForMatch(raw: string | null | undefined): string | null {
  const parsed = parseEmailAddress(raw);
  if (!parsed) return null;
  return parsed.replace(/^mailto:/, "");
}
