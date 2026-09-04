import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Resend uses Svix-signed webhooks.
 * Returns false when secret is set but signature is missing/invalid.
 * Dev-only bypass when secret missing AND LGE_DEV_AUTH_BYPASS=true.
 */
export function verifyResendWebhookSignature(
  payload: string,
  headers: Headers
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return process.env.LGE_DEV_AUTH_BYPASS === "true";
  }

  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const secretKey = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice(6), "base64")
    : Buffer.from(secret);
  const expected = createHmac("sha256", secretKey).update(signedContent).digest("base64");

  const signatures = svixSignature.split(" ").map((part) => part.replace(/^v1,/, ""));
  return signatures.some((sig) => {
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}
