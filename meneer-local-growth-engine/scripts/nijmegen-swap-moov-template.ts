/**
 * Wissel Moov Pilates naar template B (reformer-minimal) en REFORM STUDIOS naar editorial.
 *
 * Usage: npx --yes tsx scripts/nijmegen-swap-moov-template.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient, isAdminConfigured } from "../src/lib/supabase/admin";
import { generateBusinessPreview } from "../src/services/preview-generation/generateBusinessPreview";
import type { TemplateVariant } from "../src/types/studio";

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

const MOOV_ID = "f8eaa55e-adc9-4839-a7e5-f8c7aeb56b1e";
const REFORM_ID = "c1336a08-d950-48ef-9e91-77aa543e0f7c";

const SWAPS: Array<{ id: string; template: TemplateVariant; reason: string }> = [
  {
    id: MOOV_ID,
    template: "reformer-minimal",
    reason: "Handmatige keuze: reformer-minimal past beter bij Moov Pilates",
  },
  {
    id: REFORM_ID,
    template: "editorial",
    reason: "Swap met Moov: editorial vrijgemaakt in Nijmegen",
  },
];

async function main() {
  loadEnvLocal();
  if (!isAdminConfigured()) {
    console.error("SUPABASE_SECRET_KEY ontbreekt");
    process.exit(1);
  }

  const client = createAdminClient();
  const baseUrl = process.env.NEXT_PUBLIC_PREVIEW_BASE_URL ?? "https://preview.meneermarketing.nl";
  const now = new Date().toISOString();

  console.log("=== NIJMEGEN · TEMPLATE SWAP ===\n");

  await client
    .from("businesses")
    .update({ assigned_template: null, last_activity_at: now })
    .in("id", [MOOV_ID, REFORM_ID]);

  for (const swap of SWAPS) {
    const { data: business } = await client
      .from("businesses")
      .select("studio_name")
      .eq("id", swap.id)
      .single();

    await client
      .from("businesses")
      .update({
        assigned_template: swap.template,
        template_assignment_reason: swap.reason,
        template_assignment_confidence: 85,
        template_assigned_at: now,
        last_activity_at: now,
      })
      .eq("id", swap.id);

    console.log(`Assigned ${business?.studio_name} → ${swap.template}`);
  }

  console.log("\nRegenerating previews...\n");

  for (const swap of SWAPS) {
    const { data: business } = await client
      .from("businesses")
      .select("studio_name")
      .eq("id", swap.id)
      .single();

    const result = await generateBusinessPreview(swap.id, {
      forceTemplate: swap.template,
    });

    const { data: preview } = await client
      .from("previews")
      .select("slug, status")
      .eq("business_id", swap.id)
      .eq("template_variant", swap.template)
      .in("status", ["READY", "DRAFT", "APPROVED"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log(`• ${business?.studio_name}`);
    console.log(`  template: ${swap.template}`);
    console.log(`  preview: ${result.ok ? "OK" : "FAIL"}${result.error ? ` (${result.error})` : ""}`);
    if (preview?.slug) {
      console.log(`  url: ${baseUrl}/preview/${preview.slug}`);
    }
    console.log("");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
