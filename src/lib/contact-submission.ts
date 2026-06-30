import { z } from "zod";

export const FORM_SOURCES = [
  "contact",
  "samenwerken",
  "project-starten",
  "intake",
  "groeiscan",
  "schaal-op",
] as const;

export type FormSource = (typeof FORM_SOURCES)[number];

export const ContactSubmissionSchema = z.object({
  source: z.enum(FORM_SOURCES),
  subject: z.string().min(1).max(200),
  replyToEmail: z.string().email().max(254),
  replyToName: z.string().min(1).max(120),
  body: z.string().min(10).max(20_000),
  /** Honeypot — moet leeg blijven */
  companyWebsite: z.string().max(0).optional(),
});

export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export interface SubmitContactPayload extends ContactSubmission {}

export interface SubmitContactResult {
  ok: true;
}

export interface SubmitContactError {
  ok: false;
  error: string;
}

export async function submitContactForm(
  payload: SubmitContactPayload,
): Promise<SubmitContactResult | SubmitContactError> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Versturen lukte niet. Probeer het opnieuw of mail direct naar info@meneermarketing.nl.";
    return { ok: false, error: message };
  }

  return { ok: true };
}
