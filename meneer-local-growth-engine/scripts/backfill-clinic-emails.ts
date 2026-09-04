/**
 * Bulk backfill: e-mail ophalen voor leads zonder opgeslagen e-mail.
 *
 * Usage:
 *   npx tsx scripts/backfill-clinic-emails.ts --dry-run
 *   npx tsx scripts/backfill-clinic-emails.ts
 *   npx tsx scripts/backfill-clinic-emails.ts --city=rotterdam --limit=25
 *   npx tsx scripts/backfill-clinic-emails.ts --vertical=skin-clinics
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* .env.local optional in CI */
  }
}

loadEnvLocal();

import { createAdminClient, isAdminConfigured } from "../src/lib/supabase/admin";
import { sanitizeEmailCandidate } from "../src/lib/extractEmailsFromHtml";
import { enrichBusinessEmailFromWebsite } from "../src/services/enrichment/enrichBusinessEmail";
import { evaluateEmailConfidence } from "../src/services/email/emailConfidenceService";
import { syncBusinessEmailRecord } from "../src/services/enrichment/emailSyncService";

type CliOptions = {
  dryRun: boolean;
  limit: number;
  vertical: string;
  city: string | null;
  delayMs: number;
};

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    dryRun: argv.includes("--dry-run"),
    limit: 500,
    vertical: "skin-clinics",
    city: null,
    delayMs: 400,
  };

  for (const arg of argv) {
    if (arg.startsWith("--limit=")) {
      opts.limit = Math.max(1, Number.parseInt(arg.slice("--limit=".length), 10) || opts.limit);
    }
    if (arg.startsWith("--vertical=")) {
      opts.vertical = arg.slice("--vertical=".length).trim() || opts.vertical;
    }
    if (arg.startsWith("--city=")) {
      opts.city = arg.slice("--city=".length).trim().toLowerCase() || null;
    }
    if (arg.startsWith("--delay-ms=")) {
      opts.delayMs = Math.max(0, Number.parseInt(arg.slice("--delay-ms=".length), 10) || opts.delayMs);
    }
  }

  return opts;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!isAdminConfigured()) {
    console.error("SUPABASE_SECRET_KEY ontbreekt in .env.local");
    process.exit(1);
  }

  const client = createAdminClient();

  const { data: vertical, error: verticalError } = await client
    .from("verticals")
    .select("id, slug, name")
    .eq("slug", opts.vertical)
    .maybeSingle();

  if (verticalError || !vertical?.id) {
    console.error(`Vertical '${opts.vertical}' niet gevonden`);
    process.exit(1);
  }

  let cityId: string | null = null;
  if (opts.city) {
    const { data: city } = await client
      .from("cities")
      .select("id, name, slug")
      .eq("slug", opts.city)
      .maybeSingle();
    if (!city?.id) {
      console.error(`Stad '${opts.city}' niet gevonden`);
      process.exit(1);
    }
    cityId = String(city.id);
    console.log(`Filter stad: ${city.name} (${city.slug})`);
  }

  let query = client
    .from("businesses")
    .select(
      "id, studio_name, website_url, domain, normalized_domain, email, website_intelligence, city_id, cities:city_id(name, slug)",
    )
    .eq("vertical_id", vertical.id)
    .eq("is_demo", false)
    .not("website_url", "is", null)
    .or("email.is.null,email.eq.")
    .order("studio_name")
    .limit(opts.limit);

  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  const { data: rows, error } = await query;
  if (error) {
    console.error("Query mislukt:", error.message);
    process.exit(1);
  }

  const leads = (rows ?? []).filter((row) => !sanitizeEmailCandidate(String(row.email ?? "")));

  console.log(`\n=== E-mail backfill · ${vertical.name} ===`);
  console.log(`Leads zonder e-mail (max ${opts.limit}): ${leads.length}`);
  if (opts.dryRun) {
    console.log("\nDRY RUN — geen wijzigingen\n");
    for (const row of leads) {
      const city = row.cities as { name?: string; slug?: string } | null;
      const intel = row.website_intelligence as { emails?: string[] } | null;
      const cached = intel?.emails?.[0] ?? "—";
      console.log(`· ${row.studio_name} (${city?.slug ?? "?"}) · cached: ${cached}`);
      console.log(`  ${row.website_url}`);
    }
    return;
  }

  let syncedFromIntel = 0;
  let scraped = 0;
  let found = 0;
  let missed = 0;
  let failed = 0;

  for (const row of leads) {
    const city = row.cities as { name?: string; slug?: string } | null;
    const label = `${row.studio_name} (${city?.slug ?? "?"})`;
    const intel = row.website_intelligence as { emails?: string[] } | null;
    const cachedEmail = sanitizeEmailCandidate(intel?.emails?.[0] ?? "");

    try {
      if (cachedEmail) {
        const confidence = await evaluateEmailConfidence({
          email: cachedEmail,
          businessDomain: row.normalized_domain ?? row.domain,
          source: "website_intelligence",
        });
        await syncBusinessEmailRecord({
          client,
          businessId: String(row.id),
          studioName: String(row.studio_name),
          email: cachedEmail,
          source: "website_intelligence_backfill",
          confidence,
        });
        syncedFromIntel += 1;
        found += 1;
        console.log(`✓ ${label} · ${cachedEmail} (uit intelligence)`);
        await sleep(opts.delayMs);
        continue;
      }

      const result = await enrichBusinessEmailFromWebsite(client, {
        businessId: String(row.id),
        websiteUrl: String(row.website_url),
        domain: row.normalized_domain ?? row.domain,
        studioName: String(row.studio_name),
      });
      scraped += 1;

      if (result.email) {
        found += 1;
        console.log(`✓ ${label} · ${result.email} (${result.source ?? "website"})`);
      } else {
        missed += 1;
        console.log(`✗ ${label} · geen e-mail gevonden`);
      }
    } catch (err) {
      failed += 1;
      console.log(
        `! ${label} · ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    await sleep(opts.delayMs);
  }

  console.log("\n=== Samenvatting ===");
  console.log(`Totaal verwerkt: ${leads.length}`);
  console.log(`Gevonden: ${found}`);
  console.log(`  └ uit intelligence cache: ${syncedFromIntel}`);
  console.log(`  └ live scrape: ${scraped}`);
  console.log(`Niet gevonden: ${missed}`);
  console.log(`Fouten: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
