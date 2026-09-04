const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function isPlausibleEmail(raw: string | null | undefined): boolean {
  if (!raw?.trim()) return false;
  return EMAIL_RE.test(raw.trim());
}

export function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  return raw.trim().toLowerCase();
}

export type InvalidEmailIssue = "no_email" | "suppressed" | "malformed";

export function classifyEmailIssue(input: {
  email: string | null | undefined;
  suppressed: boolean;
}): InvalidEmailIssue | null {
  const email = normalizeEmail(input.email);
  if (!email) return "no_email";
  if (input.suppressed) return "suppressed";
  if (!isPlausibleEmail(email)) return "malformed";
  return null;
}

export function invalidEmailLabel(issue: InvalidEmailIssue): string {
  switch (issue) {
    case "no_email":
      return "Geen e-mail";
    case "suppressed":
      return "Suppression";
    case "malformed":
      return "Ongeldig adres";
  }
}

export function suppressionReasonLabel(reason: string): string {
  const map: Record<string, string> = {
    hard_bounce: "Hard bounce",
    complained: "Spamklacht",
    unsubscribed: "Uitgeschreven",
    manual: "Handmatig",
    resend_webhook: "Resend webhook",
    system: "Systeem",
  };
  return map[reason] ?? reason.replaceAll("_", " ");
}
