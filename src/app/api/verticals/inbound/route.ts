import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

import { businessEmail } from "@/lib/contact";
import {
  CONTACT_MAIL_NOT_CONFIGURED_CODE,
  CONTACT_MAIL_NOT_CONFIGURED_MESSAGE,
  isContactMailConfigured,
} from "@/lib/contact-mail";
import { isLgeSupabaseConfigured } from "@/lib/lge/supabase-admin";
import { persistInboundSubmission } from "@/lib/lge/inbound-store";
import { postCampaignEvent } from "@/lib/lge/campaign";
import { packageIdToKey } from "@/lib/lge/package-map";
import type { VerticalInterestId } from "@/data/verticals/types";
import { sendLeadConfirmationMail } from "@/lib/verticals/lead-confirmation-mail";

const bodySchema = z.object({
  source: z.enum(["pilates-studios", "huidklinieken"]),
  studioName: z.string().min(1).max(160),
  city: z.string().min(1).max(120),
  email: z.string().email().max(254),
  phone: z.string().max(40).optional(),
  interest: z.string().min(1).max(40),
  bookingNeed: z.string().min(1).max(40),
  message: z.string().max(5000).optional(),
  campaignRef: z.string().max(80).optional().nullable(),
  launchPromoActive: z.boolean().optional(),
  launchAmountCents: z.number().int().min(0).max(500_000),
  companyWebsite: z.string().max(0).optional(),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendNotificationMail(input: {
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

  if (error) throw new Error(error.message);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const raw: unknown = await req.json();
    const parsed = bodySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Controleer je invoer en probeer opnieuw." },
        { status: 400 },
      );
    }

    if (parsed.data.companyWebsite) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const {
      source,
      studioName,
      city,
      email,
      phone,
      interest,
      bookingNeed,
      message,
      campaignRef,
      launchPromoActive,
      launchAmountCents,
    } = parsed.data;

    let submissionId: string | null = null;

    if (isLgeSupabaseConfigured()) {
      const row = await persistInboundSubmission({
        source,
        studioName,
        city,
        email,
        phone,
        interest: interest as VerticalInterestId,
        bookingNeed,
        message,
        campaignRef: campaignRef ?? null,
        launchPromoActive: launchPromoActive ?? false,
        launchAmountCents,
      });
      submissionId = row.id;
    }

    const bodyLines = [
      `Aanvraag via meneermarketing.nl/${source}`,
      submissionId ? `LGE submission: ${submissionId}` : null,
      "",
      `Studio: ${studioName.trim()}`,
      `Plaats: ${city.trim()}`,
      `E-mail: ${email.trim()}`,
      `Telefoon: ${phone?.trim() || "n.v.t."}`,
      `Boeken: ${bookingNeed}`,
      `Interesse: ${interest}`,
      launchPromoActive ? "Launch promo: actief" : null,
      campaignRef ? `Campaign ref: ${campaignRef}` : "Campaign: geen",
      "",
      "Situatie / vraag:",
      message?.trim() || "n.v.t.",
    ].filter((line): line is string => line !== null);

    try {
      await sendNotificationMail({
        source,
        subject: `[${source.replace(/-/g, " ")}] ${studioName.trim()} · ${city.trim()}`,
        replyToEmail: email.trim(),
        replyToName: studioName.trim() || "Studio",
        body: bodyLines.join("\n"),
      });
    } catch (mailErr) {
      console.error("[API vertical inbound] notify mail", mailErr);
      if (!submissionId) {
        throw mailErr;
      }
    }

    const siteBase =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://meneermarketing.nl";
    const offerPageUrl = campaignRef
      ? `${siteBase}/${source}?ref=${encodeURIComponent(campaignRef)}`
      : `${siteBase}/${source}`;

    try {
      await sendLeadConfirmationMail({
        toEmail: email.trim(),
        studioName: studioName.trim(),
        city: city.trim(),
        source,
        interest: interest as VerticalInterestId,
        offerPageUrl,
        meterUrl: null,
      });
    } catch (mailErr) {
      console.error("[API vertical inbound] confirmation mail", mailErr);
    }

    if (campaignRef) {
      const pkg = packageIdToKey(interest as VerticalInterestId);
      void postCampaignEvent({
        campaignRef,
        eventType: "CONTACT_SUBMITTED",
        metadata: {
          path: `/${source}`,
          section: "aanvraag",
          ...(pkg ? { package: pkg } : {}),
        },
        idempotencyKey: `CONTACT_SUBMITTED:${campaignRef}:${email.trim().toLowerCase()}`,
      });
    }

    return NextResponse.json({
      ok: true,
      submissionId,
      launchAmountCents,
      paymentRequired: launchAmountCents > 0,
      paymentStatus: launchAmountCents <= 0 ? "waived" : "none",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Interne serverfout bij versturen.";
    console.error("[API vertical inbound]", message, err);

    if (!isContactMailConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error: CONTACT_MAIL_NOT_CONFIGURED_MESSAGE,
          code: CONTACT_MAIL_NOT_CONFIGURED_CODE,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    supabase: isLgeSupabaseConfigured(),
    mail: isContactMailConfigured(),
  });
}
