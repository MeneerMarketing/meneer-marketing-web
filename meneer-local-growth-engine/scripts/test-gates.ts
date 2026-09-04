import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
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
}
loadEnvLocal();

/** Smoke test for the M8.3 preview + outreach gates. */
async function main() {
  const { createAdminClient } = await import("../src/lib/supabase/admin");
  const { checkPreviewGate, checkRedesignOutreachGate } = await import(
    "../src/services/acquisition-fit/acquisitionGates"
  );
  const client = createAdminClient();

  const { data } = await client
    .from("businesses")
    .select("id, studio_name, prospect_type, preview_eligible")
    .in("prospect_type", ["WEBSITE_TRANSFORMATION", "GROWTH_ONLY", "WEAK_BUSINESS", "NOT_ELIGIBLE"])
    .order("prospect_type");

  const seen = new Set<string>();
  for (const business of data ?? []) {
    const key = `${business.prospect_type}:${business.preview_eligible}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const preview = await checkPreviewGate(business.id);
    const previewForced = await checkPreviewGate(business.id, { override: true });
    const outreach = await checkRedesignOutreachGate(business.id);

    console.log(`\n${business.studio_name} (${business.prospect_type}, preview_eligible=${business.preview_eligible})`);
    console.log(`  preview gate      : ${preview.allowed ? "ALLOW" : "BLOCK"} — ${preview.reason}`);
    console.log(
      `  preview override  : ${previewForced.allowed ? "ALLOW" : "BLOCK"}${previewForced.warning ? ` — waarschuwing: ${previewForced.warning}` : ""}`
    );
    console.log(`  outreach gate     : ${outreach.allowed ? "ALLOW" : "BLOCK"} — ${outreach.reason}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
