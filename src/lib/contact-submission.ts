import { z } from "zod";
import { CONTACT_MAIL_NOT_CONFIGURED_CODE } from "@/lib/contact-mail";

export const FORM_SOURCES = [
  "contact",
  "samenwerken",
  "project-starten",
  "intake",
  "groeiscan",
  "schaal-op",
  "pilates-studios",
] as const;

export type FormSource = (typeof FORM_SOURCES)[number];

export const ContactSubmissionSchema = z.object({
  source: z.enum(FORM_SOURCES),
  subject: z.string().min(1).max(200),
  replyToEmail: z.string().email().max(254),
  replyToName: z.string().min(1).max(120),
  body: z.string().min(10).max(20_000),
  /** Honeypot: moet leeg blijven */
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
  code?: typeof CONTACT_MAIL_NOT_CONFIGURED_CODE;
  mailtoHref?: string;
}

function parseApiError(data: unknown): { message: string; code?: string } {
  if (!data || typeof data !== "object") {
    return { message: "Versturen lukte niet. Probeer het opnieuw of mail direct naar info@meneermarketing.nl." };
  }
  const record = data as Record<string, unknown>;
  const message =
    typeof record.error === "string"
      ? record.error
      : "Versturen lukte niet. Probeer het opnieuw of mail direct naar info@meneermarketing.nl.";
  const code = typeof record.code === "string" ? record.code : undefined;
  return { message, code };
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
    const { message, code } = parseApiError(data);
    const mailtoHref =
      code === CONTACT_MAIL_NOT_CONFIGURED_CODE
        ? buildMailtoFallback(payload)
        : undefined;

    return {
      ok: false,
      error: message,
      ...(code === CONTACT_MAIL_NOT_CONFIGURED_CODE
        ? { code: CONTACT_MAIL_NOT_CONFIGURED_CODE, mailtoHref }
        : {}),
    };
  }

  return { ok: true };
}

function buildMailtoFallback(payload: SubmitContactPayload): string {
  const params = new URLSearchParams();
  params.set("subject", payload.subject);
  params.set("body", payload.body);
  return `mailto:info@meneermarketing.nl?${params.toString()}`;
}
