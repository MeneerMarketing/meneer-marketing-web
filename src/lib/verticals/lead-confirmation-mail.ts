import { Resend } from "resend";

import { businessEmail, whatsappHref } from "@/lib/contact";
import { CONTACT_MAIL_NOT_CONFIGURED_MESSAGE } from "@/lib/contact-mail";
import type { VerticalInterestId } from "@/data/verticals/types";

const PACKAGE_LABELS: Record<VerticalInterestId, string> = {
  "studio-edition": "Studio Edition",
  "local-growth": "Local Growth",
  "growth-partner": "Growth Partner",
  "signature-custom": "Signature Custom",
  unsure: "Nog te bepalen (ik help je kiezen)",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendLeadConfirmationMail(input: {
  toEmail: string;
  studioName: string;
  city: string;
  source: "pilates-studios" | "huidklinieken";
  interest: VerticalInterestId;
  previewUrl?: string | null;
  meterUrl?: string | null;
  offerPageUrl: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error(CONTACT_MAIL_NOT_CONFIGURED_MESSAGE);
  }

  const resend = new Resend(key);
  const pkg = PACKAGE_LABELS[input.interest] ?? input.interest;
  const verticalLabel =
    input.source === "pilates-studios" ? "Pilates studio" : "Huidkliniek";
  const wa =
    whatsappHref(
      `Hoi! Ik heb net een aanvraag ingediend voor ${input.studioName}.`,
    ) ?? null;

  const lines = [
    `Hoi${input.studioName ? ` (${input.studioName})` : ""},`,
    "",
    "Je aanvraag is binnen. Ik lees hem zelf en reageer meestal binnen 24 uur.",
    "",
    `Pakket op je aanvraag: ${pkg}`,
    `Plaats: ${input.city}`,
    "",
    "Wat ik de komende dag doe:",
    "· Ik bekijk je situatie en je huidige online vindbaarheid",
    "· Je krijgt een concreet voorstel, geen standaard pitch",
    input.previewUrl
      ? `· Je concept-preview staat al klaar: ${input.previewUrl}`
      : null,
    "",
    `Alles over het aanbod voor ${verticalLabel.toLowerCase()}:`,
    input.offerPageUrl,
    input.meterUrl
      ? ""
      : null,
    input.meterUrl
      ? `Wil je alvast zien waar je site lekt? Plak je URL in de Meneer Meter:\n${input.meterUrl}`
      : null,
    wa ? "" : null,
    wa
      ? `Liever appen? Dat kan ook:\n${wa}`
      : "Vragen? Antwoord op deze mail is prima.",
    "",
    "Groet,",
    "Meneer Marketing",
    businessEmail,
  ].filter((line): line is string => line !== null);

  const text = lines.join("\n");
  const htmlBody = lines
    .map((line) =>
      line.trim() === ""
        ? "<br />"
        : `<p style="margin:0 0 10px;font-family:sans-serif;font-size:15px;line-height:1.55;color:#0f172a;">${escapeHtml(line)}</p>`,
    )
    .join("");

  const { error } = await resend.emails.send({
    from:
      process.env.CONTACT_FROM_EMAIL ??
      "Meneer Marketing <aanvragen@meneermarketing.nl>",
    to: input.toEmail,
    replyTo: businessEmail,
    subject: `Aanvraag ontvangen · ${input.studioName}`,
    text,
    html: `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:28px 24px;">
        <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#FF5722;">
          Aanvraag ontvangen
        </p>
        ${htmlBody}
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}

export async function sendSubscriptionConfirmationMail(input: {
  toEmail: string;
  studioName: string;
  city: string;
  source: "pilates-studios" | "huidklinieken";
  packageName: string;
  monthlyExclLabel: string;
  setupWaived: boolean;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error(CONTACT_MAIL_NOT_CONFIGURED_MESSAGE);
  }

  const resend = new Resend(key);
  const wa =
    whatsappHref(
      `Hoi! Ik heb net ${input.packageName} afgesloten voor ${input.studioName}.`,
    ) ?? null;

  const lines = [
    `Hoi${input.studioName ? ` (${input.studioName})` : ""},`,
    "",
    "Je betaling is binnen. Welkom aan boord.",
    "",
    `Pakket: ${input.packageName}`,
    input.city ? `Plaats: ${input.city}` : null,
    `Maandbedrag: ${input.monthlyExclLabel} ex. btw · maandelijks opzegbaar`,
    input.setupWaived
      ? "Launch staat tijdelijk op €0. Je eerste incasso is je maandbedrag."
      : null,
    "",
    "Wat nu:",
    "· Ik plan binnen 24 uur je kick-off in",
    "· Daarna starten we met je site en vindbaarheid",
    wa ? "" : null,
    wa
      ? `Liever appen? Dat kan ook:\n${wa}`
      : "Vragen? Antwoord op deze mail is prima.",
    "",
    "Groet,",
    "Meneer Marketing",
    businessEmail,
  ].filter((line): line is string => line !== null);

  const text = lines.join("\n");
  const htmlBody = lines
    .map((line) =>
      line.trim() === ""
        ? "<br />"
        : `<p style="margin:0 0 10px;font-family:sans-serif;font-size:15px;line-height:1.55;color:#0f172a;">${escapeHtml(line)}</p>`,
    )
    .join("");

  const { error } = await resend.emails.send({
    from:
      process.env.CONTACT_FROM_EMAIL ??
      "Meneer Marketing <aanvragen@meneermarketing.nl>",
    to: input.toEmail,
    replyTo: businessEmail,
    subject: `Betaling ontvangen · ${input.studioName}`,
    text,
    html: `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:28px 24px;">
        <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#FF5722;">
          Betaling ontvangen
        </p>
        ${htmlBody}
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}
