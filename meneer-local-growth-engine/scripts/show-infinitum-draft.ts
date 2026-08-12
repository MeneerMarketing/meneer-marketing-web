/**
 * Show latest Infinitum outreach draft (no send).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";

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

  const { data: message } = await client
    .from("outreach_messages")
    .select(
      "id, version, status, subject, body_text, preview_url, generation_method, personalization_metadata"
    )
    .eq("business_id", business.id)
    .eq("is_test", false)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!message) throw new Error("Geen outreach draft");

  const slots =
    (message.personalization_metadata as { slots?: Record<string, unknown> } | null)
      ?.slots ?? null;

  console.log("--- META ---");
  console.log(
    JSON.stringify(
      {
        message_id: message.id,
        version: message.version,
        status: message.status,
        generation_method: message.generation_method,
        preview_url: message.preview_url,
        slots,
        from: "Meneer Marketing",
      },
      null,
      2
    )
  );
  console.log("\n--- SUBJECT ---\n");
  console.log(message.subject);
  console.log("\n--- BODY ---\n");
  console.log(message.body_text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
