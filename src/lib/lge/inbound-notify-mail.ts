import { Resend } from "resend";

import { businessEmail } from "@/lib/contact";
import { CONTACT_MAIL_NOT_CONFIGURED_MESSAGE } from "@/lib/contact-mail";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface InboundNotifyBodyInput {
  source: string;
  submissionId?: string | null;
  studioName: string;
  city: string;
  email: string;
  phone?: string;
  bookingNeed: string;
  interest: string;
  launchPromoActive?: boolean;
  campaignRef?: string | null;
  message?: string;
  paymentNote?: string;
}

export function buildInboundNotifyBody(input: InboundNotifyBodyInput): string {
  return [
    `Aanvraag via meneermarketing.nl/${input.source}`,
    input.submissionId ? `LGE submission: ${input.submissionId}` : null,
    input.paymentNote ?? null,
    "",
    `Studio: ${input.studioName.trim()}`,
    `Plaats: ${input.city.trim()}`,
    `E-mail: ${input.email.trim()}`,
    `Telefoon: ${input.phone?.trim() || "n.v.t."}`,
    `Boeken: ${input.bookingNeed}`,
    `Interesse: ${input.interest}`,
    input.launchPromoActive ? "Launch promo: actief" : null,
    input.campaignRef ? `Campaign ref: ${input.campaignRef}` : "Campaign: geen",
    "",
    "Situatie / vraag:",
    input.message?.trim() || "n.v.t.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export async function sendInboundNotifyMail(input: {
  source: string;
  subject: string;
  replyToEmail: string;
  replyToName: string;
  body: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error(CONTACT_MAIL_NOT_CONFIGURED_MESSAGE);
  }

  const resend = new Resend(key);
  const sourceLabel = input.source.replace(/-/g, " ");
  const htmlBody = input.body
    .split("\n")
    .map((line) =>
      line.trim() === ""
        ? "<br />"
        : `<p style="margin:0 0 8px;font-family:sans-serif;font-size:14px;line-height:1.5;color:#0f172a;">${escapeHtml(line)}</p>`,
    )
    .join("");

  const { error } = await resend.emails.send({
    from:
      process.env.CONTACT_FROM_EMAIL ??
      "MeneerMarketing Website <aanvragen@meneermarketing.nl>",
    to: process.env.CONTACT_TO_EMAIL ?? businessEmail,
    replyTo: input.replyToEmail,
    subject: input.subject,
    text: input.body,
    html: `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">
          Nieuwe aanvraag · ${escapeHtml(sourceLabel)}
        </p>
        ${htmlBody}
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
