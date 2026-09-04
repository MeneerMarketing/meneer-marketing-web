/**
 * Quick smoke test for website email scraping (no DB).
 *
 * Usage:
 *   npx tsx scripts/test-email-scrape.ts https://example-studio.nl
 */
import { scrapeWebsiteEmailCandidates } from "../src/services/enrichment/scrapeWebsiteEmails";

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Geef een website URL mee, bv. npx tsx scripts/test-email-scrape.ts https://studio.nl");
    process.exit(1);
  }

  console.log(`Scannen: ${url}\n`);
  const candidates = await scrapeWebsiteEmailCandidates({ websiteUrl: url });
  if (candidates.length === 0) {
    console.log("Geen e-mail gevonden.");
    process.exit(2);
  }

  for (const entry of candidates) {
    console.log(`${entry.email}  (${entry.source})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
