/**
 * Milestone 7.2 — webhook signature structure smoke test (no network).
 * Run: npx --yes tsx scripts/verify-resend-webhook.ts
 */
import { createHmac } from "node:crypto";
import { verifyResendWebhookSignature } from "../src/lib/email/resendWebhook";

function main() {
  const secret = "whsec_" + Buffer.from("test-secret-bytes-123456").toString("base64");
  process.env.RESEND_WEBHOOK_SECRET = secret;
  process.env.LGE_DEV_AUTH_BYPASS = "false";

  const payload = JSON.stringify({ type: "email.delivered", data: { email_id: "msg_test" } });
  const svixId = "msg_header_1";
  const svixTimestamp = String(Math.floor(Date.now() / 1000));
  const secretKey = Buffer.from(secret.slice(6), "base64");
  const expected = createHmac("sha256", secretKey)
    .update(`${svixId}.${svixTimestamp}.${payload}`)
    .digest("base64");

  const okHeaders = new Headers({
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": `v1,${expected}`,
  });
  const badHeaders = new Headers({
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": "v1,deadbeef",
  });

  const valid = verifyResendWebhookSignature(payload, okHeaders);
  const invalid = verifyResendWebhookSignature(payload, badHeaders);
  const missing = verifyResendWebhookSignature(payload, new Headers());

  console.log(
    JSON.stringify(
      {
        valid_signature: valid,
        invalid_signature: invalid,
        missing_headers: missing,
        ok: valid === true && invalid === false && missing === false,
      },
      null,
      2
    )
  );

  if (!(valid && !invalid && !missing)) {
    process.exit(1);
  }
}

main();
