import { extractOfferLandingUrlFromText } from "@/config/verticalOffers";
import { getBrandSettings } from "@/services/outreach/brandSettingsLoader";
import { renderOutreachHtml } from "@/services/outreach/emailRenderer";
import {
  allOutreachLinksOk,
  auditOutreachLinks,
  type OutreachLinkAuditItem,
} from "@/services/outreach/outreachLinkAudit";
import { buildAbsolutePreviewUrl } from "@/services/outreach/previewUrl";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Business, OutreachMessage } from "@/types/domain";

export interface OutreachMailPreview {
  subject: string;
  bodyText: string;
  bodyHtml: string;
  previewUrl: string | null;
  landingPageUrl: string | null;
  linkAudit: OutreachLinkAuditItem[];
  allLinksOk: boolean;
}

function rewriteBodyWithAbsolutePreview(
  bodyText: string,
  previousUrl: string | null | undefined,
  absoluteUrl: string,
): string {
  let text = bodyText;
  if (previousUrl && text.includes(previousUrl)) {
    text = text.split(previousUrl).join(absoluteUrl);
  }
  text = text.replace(/https?:\/\/[^\s<>"]+\/preview\/[a-z0-9-]+/gi, absoluteUrl);
  text = text.replace(/(^|\n)\/preview\/[a-z0-9-]+/gi, `$1${absoluteUrl}`);
  return text;
}

async function loadPreviewContext(messageId: string): Promise<{
  message: OutreachMessage;
  business: Business;
}> {
  const client = createAdminClient();
  const { data: message } = await client
    .from("outreach_messages")
    .select("*")
    .eq("id", messageId)
    .single();
  if (!message) throw new Error("Outreach message niet gevonden");

  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", message.business_id)
    .single();
  if (!business) throw new Error("Business niet gevonden");

  return {
    message: message as OutreachMessage,
    business: business as Business,
  };
}

export async function buildOutreachMailPreview(input: {
  messageId: string;
  subject?: string;
  bodyText?: string;
}): Promise<OutreachMailPreview> {
  const { message } = await loadPreviewContext(input.messageId);
  const brand = await getBrandSettings();

  const subject = input.subject?.trim() || message.subject;
  const rawBody = input.bodyText ?? message.body_text ?? message.body;

  const meta = (message.personalization_metadata ?? {}) as {
    context?: { landing_page_url?: string };
  };

  let previewUrl: string | null = null;
  let bodyText = rawBody;

  if (message.preview_url) {
    previewUrl = buildAbsolutePreviewUrl({
      previewUrl: message.preview_url,
      brand,
    });
    bodyText = rewriteBodyWithAbsolutePreview(
      rawBody,
      message.preview_url,
      previewUrl,
    );
  }

  const landingPageUrl =
    meta.context?.landing_page_url ??
    extractOfferLandingUrlFromText(bodyText) ??
    null;

  const bodyHtml = renderOutreachHtml({
    bodyText,
    previewUrl: previewUrl ?? "",
    landingPageUrl: landingPageUrl ?? undefined,
    brand,
  });

  const linkAudit = auditOutreachLinks({
    bodyText,
    bodyHtml,
    previewUrl,
    landingPageUrl,
  });

  return {
    subject,
    bodyText,
    bodyHtml,
    previewUrl,
    landingPageUrl,
    linkAudit,
    allLinksOk: allOutreachLinksOk(linkAudit),
  };
}
