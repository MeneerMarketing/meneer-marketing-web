/**
 * Milestone 7 — generate Infinitum outreach DRAFT (no send).
 * Run: npx --yes tsx scripts/run-infinitum-outreach-draft.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import { generateOutreachDraft } from "../src/services/outreach/outreachGenerator";

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

async function main() {
  loadEnvLocal();
  const client = createAdminClient();
  const { data: business } = await client
    .from("businesses")
    .select("id, studio_name")
    .ilike("studio_name", "%Infinitum%")
    .eq("is_demo", false)
    .limit(1)
    .single();
  if (!business) throw new Error("Infinitum niet gevonden");

  console.log("Generating draft for", business.studio_name, business.id);
  const result = await generateOutreachDraft({
    businessId: business.id as string,
    regenerate: process.argv.includes("--regenerate"),
  });

  console.log(
    JSON.stringify(
      {
        message_id: result.message.id,
        status: result.message.status,
        version: result.message.version,
        generation_method: result.generated.generation_method,
        contact_source: result.contact_source,
        contact_id: result.message.contact_id,
        subject: result.generated.subject,
        body_text: result.generated.body_text,
        word_count: result.generated.word_count,
        fixed_parts: result.generated.fixed_parts,
        ai_parts: result.generated.ai_parts,
        slots: result.generated.slots,
        facts_used: result.generated.facts_used,
        facts_omitted: result.generated.facts_omitted,
        confidence: result.generated.confidence,
        used_claude: result.generated.used_claude,
        model: result.generated.model,
        anthropic_cost_usd: result.generated.anthropic_cost_usd,
        preview_url: result.message.preview_url,
        validation_warnings: result.validation_warnings,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
