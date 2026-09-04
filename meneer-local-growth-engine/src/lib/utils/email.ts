/**
 * Cleaning for e-mail addresses lifted off a rendered page.
 *
 * Scraped markup fuses text across element boundaries, so a footer reading
 * "info@studio.nl" directly above "bottom of page" yields
 * "info@studio.nlbottom". Storing that address means every outreach mail
 * bounces silently, which is why both the crawler and the contact resolver
 * run everything through here.
 */

/** Ordered longest-first so `.co.uk` wins over `.co`. */
const KNOWN_TLDS = [
  "co.uk",
  "amsterdam",
  "health",
  "online",
  "studio",
  "coach",
  "info",
  "life",
  "shop",
  "com",
  "net",
  "org",
  "app",
  "fit",
  "nl",
  "be",
  "de",
  "eu",
  "io",
  "nu",
].sort((a, b) => b.length - a.length);

const JUNK = /example\.|sentry\.|wixpress|schema\.org|\.(png|jpe?g|webp|svg|gif)$/i;

export function normalizeScrapedEmail(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;

  // Strip anything glued to the front, e.g. "0610758555info@studio.nl".
  const tail = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/.exec(trimmed);
  const candidate = tail?.[1] ?? trimmed;

  const at = candidate.lastIndexOf("@");
  if (at < 1) return null;
  const local = candidate.slice(0, at);
  const domain = candidate.slice(at + 1);
  if (!local || !domain.includes(".")) return null;

  let cleaned = `${local}@${domain}`;
  for (const tld of KNOWN_TLDS) {
    const marker = `.${tld}`;
    const index = domain.indexOf(marker);
    if (index < 0) continue;
    cleaned = `${local}@${domain.slice(0, index + marker.length)}`;
    break;
  }

  if (JUNK.test(cleaned)) return null;
  return cleaned;
}
