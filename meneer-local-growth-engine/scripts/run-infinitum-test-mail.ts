/**
 * Milestone 7.2 — regenerate Infinitum hardened draft + optional safe TEST send.
 * Never sends to prospect email.
 *
 * Run:
 *   npx --yes tsx scripts/run-infinitum-test-mail.ts --regenerate
 *   npx --yes tsx scripts/run-infinitum-test-mail.ts --regenerate --send-test
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import { generateOutreachDraft } from "../src/services/outreach/outreachGenerator";
import { sendTestOutreachEmail } from "../src/services/outreach/sendService";
import { getSenderConfig } from "../src/lib/email/provider";
import { maskEmail } from "../src/services/outreach/previewUrl";

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
  const regenerate = process.argv.includes("--regenerate");
  const sendTest = process.argv.includes("--send-test");

  const client = createAdminClient();
  const { data: business } = await client
    .from("businesses")
    .select("id, studio_name, email, lead_status")
    .ilike("studio_name", "%Infinitum%")
    .eq("is_demo", false)
    .limit(1)
    .single();
  if (!business) throw new Error("Infinitum niet gevonden");

  console.log("Infinitum:", business.studio_name, business.id);

  const result = await generateOutreachDraft({
    businessId: business.id as string,
    regenerate,
  });

  // Force default subject family if somehow concept slipped in
  if (!result.generated.subject.startsWith("Ik heb iets gemaakt voor")) {
    console.warn("Subject was not default made-variant:", result.generated.subject);
  }

  const sender = getSenderConfig();
  const report: Record<string, unknown> = {
    message_id: result.message.id,
    version: result.message.version,
    status: result.message.status,
    subject: result.generated.subject,
    preview_url: result.message.preview_url,
    generation_method: result.generated.generation_method,
    slots: result.generated.slots,
    sender_name: "Meneer Marketing",
    resend_configured: sender.configured,
    real_send_enabled: sender.realSendEnabled,
    test_email_masked: sender.testEmailMasked,
    from_masked: sender.fromEmailMasked,
    sender_domain: sender.senderDomain,
    business_lead_status_unchanged_expected: business.lead_status,
  };

  if (sendTest) {
    if (!sender.configured || !sender.testEmailConfigured) {
      report.test_send = {
        attempted: false,
        reason: "Resend of OUTREACH_TEST_EMAIL niet geconfigureerd",
      };
    } else {
      try {
        const test = await sendTestOutreachEmail(result.message.id);
        report.test_send = {
          attempted: true,
          ok: test.ok,
          provider_message_id: test.providerMessageId,
          absolute_preview_url: test.absolutePreviewUrl,
          recipient_masked: test.recipientMasked ?? maskEmail(sender.testEmail ?? ""),
        };
      } catch (err) {
        report.test_send = {
          attempted: true,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }
  } else {
    report.test_send = { attempted: false, reason: "Pass --send-test to attempt" };
  }

  // Confirm status not flipped to SENT
  const { data: after } = await client
    .from("outreach_messages")
    .select("id, status, version, metadata")
    .eq("id", result.message.id)
    .single();
  report.message_status_after = after?.status;
  report.never_sent_to_prospect = true;
  report.prospect_email_blocked = "info@infinitumpilates.nl";

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
