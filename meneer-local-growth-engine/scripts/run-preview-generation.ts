/**
 * One-shot preview generation for a QUALIFIED Arnhem Pilates studio.
 * Run: npx --yes tsx scripts/run-preview-generation.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateBusinessPreview } from "../src/services/preview-generation/generateBusinessPreview";

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
  const businessId =
    process.argv[2] || "a562dd0b-3e17-45c0-8935-358dede447c8"; // Infinitum Pilates

  console.log("Generating preview for", businessId);
  const result = await generateBusinessPreview(businessId);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
