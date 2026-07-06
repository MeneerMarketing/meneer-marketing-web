import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { businessEmail } from "@/lib/contact";
import {
  CONTACT_MAIL_NOT_CONFIGURED_CODE,
  CONTACT_MAIL_NOT_CONFIGURED_MESSAGE,
  isContactMailConfigured,
} from "@/lib/contact-mail";
import {
  ContactSubmissionSchema,
  type ContactSubmission,
} from "@/lib/contact-submission";

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}
function resolveFromAddress(): string {
  return (
    process.env.CONTACT_FROM_EMAIL ??
    "MeneerMarketing Website <aanvragen@meneermarketing.nl>"
  );
}

function resolveToAddress(): string {
  return process.env.CONTACT_TO_EMAIL ?? businessEmail;
}

async function sendContactMail(data: ContactSubmission): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    throw new Error(CONTACT_MAIL_NOT_CONFIGURED_MESSAGE);
  }
  const sourceLabel = data.source.replace(/-/g, " ");
  const htmlBody = data.body
    .split("\n")
    .map((line) =>
      line.trim() === ""
        ? "<br />"
        : `<p style="margin:0 0 8px;font-family:sans-serif;font-size:14px;line-height:1.5;color:#0f172a;">${escapeHtml(line)}</p>`,
    )
    .join("");

  const { error } = await resend.emails.send({
    from: resolveFromAddress(),
    to: resolveToAddress(),
    replyTo: data.replyToEmail,
    subject: data.subject,
    text: data.body,
    html: `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">
          Nieuwe aanvraag · ${escapeHtml(sourceLabel)}
        </p>
        ${htmlBody}
        <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />
        <p style="margin:0;font-size:12px;color:#64748b;">
          Antwoord direct naar ${escapeHtml(data.replyToName)} (${escapeHtml(data.replyToEmail)}).
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const raw: unknown = await req.json();
    const parsed = ContactSubmissionSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Controleer je invoer en probeer opnieuw." },
        { status: 400 },
      );
    }

    if (parsed.data.companyWebsite) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    await sendContactMail(parsed.data);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Interne serverfout bij versturen.";
    console.error("[API Contact Error]", message, err);

    if (!isContactMailConfigured()) {
      return NextResponse.json(
        {
          error: CONTACT_MAIL_NOT_CONFIGURED_MESSAGE,
          code: CONTACT_MAIL_NOT_CONFIGURED_CODE,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Publieke statuscheck (geen secrets). Handig na deploy. */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    configured: isContactMailConfigured(),
    to: process.env.CONTACT_TO_EMAIL ?? businessEmail,
  });
}