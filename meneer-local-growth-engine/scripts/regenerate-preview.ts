/**
 * Usage: npx --yes tsx scripts/regenerate-preview.ts <businessId> [template]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

async function main() {
  loadEnvLocal();
  const businessId = process.argv[2];
  const template = process.argv[3] as TemplateVariant | undefined;
  if (!businessId) {
    console.error("businessId required");
    process.exit(1);
  }

  const result = await generateBusinessPreview(businessId, {
    forceTemplate: template,
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
