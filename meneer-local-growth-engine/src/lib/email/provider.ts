/**
 * Email provider architecture — Resend + stub.
 */

import { Resend } from "resend";
import { getBrandSettings } from "@/services/outreach/brandSettingsLoader";

export type EmailSendInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, string>;
  from?: string;
  fromName?: string;
};

export type EmailSendResult = {
  provider: string;
  providerMessageId: string;
  accepted: boolean;
};

export type EmailStatusResult = {
  providerMessageId: string;
  status:
    | "queued"
    | "sent"
    | "delivered"
    | "opened"
    | "clicked"
    | "bounced"
    | "complained"
    | "unknown";
  raw?: unknown;
};

export interface EmailProvider {
  readonly name: string;
  readonly configured: boolean;
  send(input: EmailSendInput): Promise<EmailSendResult>;
  getStatus(providerMessageId: string): Promise<EmailStatusResult>;
}

export class StubEmailProvider implements EmailProvider {
  readonly name = "stub";
  readonly configured = false;

  async send(input: EmailSendInput): Promise<EmailSendResult> {
    void input;
    return {
      provider: this.name,
      providerMessageId: `stub_${Date.now()}`,
      accepted: false,
    };
  }

  async getStatus(providerMessageId: string): Promise<EmailStatusResult> {
    return { providerMessageId, status: "unknown" };
  }
}

function mapResendError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("api key") || lower.includes("unauthorized") || lower.includes("401")) {
    return "Ongeldige Resend API key";
  }
  if (lower.includes("not verified") || lower.includes("unverified") || lower.includes("domain")) {
    return "Sender domain niet geverifieerd in Resend";
  }
  if (lower.includes("from") && lower.includes("invalid")) {
    return "Ongeldig afzenderadres";
  }
  if (lower.includes("rate") || lower.includes("429")) {
    return "Resend rate limit bereikt. Probeer later opnieuw.";
  }
  return "Resend provider error";
}

export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";
  readonly configured: boolean;
  private client: Resend | null;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    const key = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL ?? "";
    this.fromName = process.env.RESEND_FROM_NAME ?? "Meneer Marketing";
    this.configured = Boolean(key && this.fromEmail);
    this.client = key ? new Resend(key) : null;
  }

  async send(input: EmailSendInput): Promise<EmailSendResult> {
    if (!this.client || !this.configured) {
      throw new Error("Resend is niet geconfigureerd");
    }

    const fromEmail = input.from || this.fromEmail;
    const fromName = input.fromName || this.fromName;
    const brand = await getBrandSettings();
    const domain = fromEmail.split("@")[1]?.toLowerCase();
    const allowed = brand.allowed_sender_domains.map((d) => d.toLowerCase());
    if (!domain || !allowed.includes(domain)) {
      throw new Error(`Sender domain niet toegestaan: ${domain ?? "unknown"}`);
    }

    try {
      const { data, error } = await this.client.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo || brand.reply_to || undefined,
        tags: input.tags
          ? Object.entries(input.tags).map(([name, value]) => ({ name, value }))
          : undefined,
      });

      if (error || !data?.id) {
        throw new Error(mapResendError(error?.message ?? "send failed"));
      }

      return {
        provider: this.name,
        providerMessageId: data.id,
        accepted: true,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Never leak API key material
      throw new Error(mapResendError(message.replace(/re_[A-Za-z0-9_]+/g, "[redacted]")));
    }
  }

  async getStatus(providerMessageId: string): Promise<EmailStatusResult> {
    return { providerMessageId, status: "unknown" };
  }
}

export function isEmailProviderReady(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function isRealSendEnabled(): boolean {
  return process.env.OUTREACH_REAL_SEND_ENABLED === "true";
}

export function getEmailProvider(): EmailProvider {
  if (isEmailProviderReady()) {
    return new ResendEmailProvider();
  }
  return new StubEmailProvider();
}

function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

export function getSenderConfig(): {
  configured: boolean;
  provider: string;
  fromEmail: string | null;
  fromEmailMasked: string | null;
  fromName: string;
  senderDomain: string | null;
  domainVerificationHint: string;
  testEmail: string | null;
  testEmailMasked: string | null;
  testEmailConfigured: boolean;
  webhookConfigured: boolean;
  realSendEnabled: boolean;
  previewBaseUrl: string | null;
} {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? null;
  const domain = fromEmail?.split("@")[1]?.toLowerCase() ?? null;
  return {
    configured: isEmailProviderReady(),
    provider: isEmailProviderReady() ? "resend" : "stub",
    fromEmail,
    fromEmailMasked: maskEmail(fromEmail),
    fromName: process.env.RESEND_FROM_NAME ?? "Meneer Marketing",
    senderDomain: domain,
    domainVerificationHint: domain
      ? `Controleer in Resend of ${domain} geverifieerd is`
      : "Geen sender domain gezet",
    testEmail: process.env.OUTREACH_TEST_EMAIL ?? null,
    testEmailMasked: maskEmail(process.env.OUTREACH_TEST_EMAIL ?? null),
    testEmailConfigured: Boolean(process.env.OUTREACH_TEST_EMAIL),
    webhookConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
    realSendEnabled: isRealSendEnabled(),
    previewBaseUrl: process.env.OUTREACH_PREVIEW_BASE_URL || null,
  };
}
