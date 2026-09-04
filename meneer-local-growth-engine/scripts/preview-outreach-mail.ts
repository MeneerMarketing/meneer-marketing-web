/**
 * Renders the outreach mail for a business without persisting anything.
 *
 * Run: npx tsx scripts/preview-outreach-mail.ts <businessId>
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

async function main() {
  loadEnvLocal();
  const businessId = process.argv[2];
  if (!businessId) throw new Error("Geef een businessId mee");

  const { generateOutreachDraft } = await import(
    "../src/services/outreach/outreachGenerator"
  );

  const result = await generateOutreachDraft({ businessId, dryRun: true });

  console.log("=".repeat(78));
  console.log("ONDERWERP:", result.generated.subject);
  console.log("CONTACT BRON:", result.contact_source);
  console.log("WOORDEN:", result.generated.word_count);
  console.log("CLAUDE:", result.generated.used_claude, "·", result.generated.model);
  console.log("KOSTEN:", `$${result.generated.anthropic_cost_usd.toFixed(5)}`);
  if (result.qualification_reasons.length) {
    console.log("NOG OPEN GATES:", result.qualification_reasons.join(", "));
  }
  if (result.validation_warnings.length) {
    console.log("WAARSCHUWINGEN:", result.validation_warnings.join(", "));
  }
  console.log("=".repeat(78));
  console.log(result.generated.body_text);
  console.log("=".repeat(78));

  mkdirSync(".tmp-hos", { recursive: true });
  writeFileSync(".tmp-hos/outreach.html", result.generated.body_html, "utf8");
  console.log("HTML weggeschreven naar .tmp-hos/outreach.html");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
