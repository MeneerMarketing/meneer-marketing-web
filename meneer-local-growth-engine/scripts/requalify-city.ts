/**
 * Re-run listing qualification on stored raw listings (M8.3).
 * Non-destructive: updates qualification fields only, never deletes leads.
 *
 * Run: npx --yes tsx scripts/requalify-city.ts --city arnhem
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
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
}

function arg(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function normalizeCityName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

async function main() {
  loadEnvLocal();
  const { createAdminClient } = await import("../src/lib/supabase/admin");
  const { qualifyPilatesListing, pilatesFocus } = await import(
    "../src/services/discovery/qualifyPilates"
  );

  const citySlug = arg("city", "arnhem") as string;
  const client = createAdminClient();

  const { data: city } = await client
    .from("cities")
    .select("id, name")
    .eq("slug", citySlug)
    .maybeSingle();
  if (!city?.id) throw new Error(`Stad ${citySlug} niet gevonden`);

  const { data: rows } = await client
    .from("businesses")
    .select("id, studio_name, raw_listing, qualification_status, lead_eligible")
    .eq("city_id", city.id)
    .eq("is_demo", false);

  const target = normalizeCityName(String(city.name));
  let changed = 0;

  for (const row of rows ?? []) {
    const listing = row.raw_listing as Record<string, unknown> | null;
    if (!listing) continue;

    const addressInfo = listing.address_info as { city?: string | null } | undefined;
    const listingCity = addressInfo?.city ? normalizeCityName(addressInfo.city) : "";
    const outOfCity =
      Boolean(listingCity) &&
      !(listingCity === target || listingCity.includes(target) || target.includes(listingCity));

    const qualification = qualifyPilatesListing(listing as never);
    const focus = pilatesFocus(listing as never);

    // Sitting in a neighbouring town does not make a studio a bad business, so
    // it stays qualified here. The acquisition fit layer decides whether it may
    // compete for this city.
    const evidence = { ...qualification.evidence };
    if (outOfCity) {
      evidence.negatives = [
        ...evidence.negatives,
        `Vestigingsplaats ${addressInfo?.city}, niet ${city.name}`,
      ];
    }

    const eligible = qualification.lead_eligible;
    const status = qualification.status;

    if (status === row.qualification_status && eligible === row.lead_eligible) continue;

    await client
      .from("businesses")
      .update({
        qualification_score: qualification.score,
        qualification_status: status,
        qualification_evidence: evidence,
        lead_eligible: eligible,
      })
      .eq("id", row.id);

    changed += 1;
    console.log(
      `${String(row.studio_name).slice(0, 50).padEnd(52)} ${row.qualification_status} -> ${status} · focus ${focus}${outOfCity ? " · buiten stad" : ""}`
    );
  }

  console.log(`\n${changed} van ${rows?.length ?? 0} leads bijgewerkt in ${city.name}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
