/**
 * Zet outreach + cron env vars op Vercel (production + preview).
 * Leest waarden uit .env.local — draai eenmalig na wijzigingen.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function parseEnvFile(content) {
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const env = parseEnvFile(readFileSync(envPath, "utf8"));

const VARS = [
  "CRON_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_FROM_NAME",
  "OUTREACH_TEST_EMAIL",
  "OUTREACH_REAL_SEND_ENABLED",
  "OUTREACH_REPLY_TO",
  "OUTREACH_SENDER_NAME",
  "OUTREACH_SENDER_MODE",
  "OUTREACH_SENDER_BRAND_NAME",
  "OUTREACH_KVK",
  "OUTREACH_CONTACT_PHONE",
  "OUTREACH_YEARS_EXPERIENCE",
  "OUTREACH_ALLOWED_SENDER_DOMAINS",
  "OUTREACH_PREVIEW_BASE_URL",
];

const targets = "production,preview";

for (const name of VARS) {
  const value = env[name];
  if (!value) {
    console.warn(`skip ${name} (leeg in .env.local)`);
    continue;
  }
  console.log(`→ ${name}`);
  execSync(
    `npx vercel env add ${name} ${targets} --value ${JSON.stringify(value)} --force --yes --sensitive`,
    { cwd: root, stdio: "inherit", shell: true }
  );
}

console.log("\nKlaar. Redeploy LGE op Vercel zodat nieuwe vars actief worden.");
