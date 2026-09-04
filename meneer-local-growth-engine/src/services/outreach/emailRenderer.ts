import {
  getSenderDisplay,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";
import {
  OUTREACH_OFFER_CTA,
  OUTREACH_PREVIEW_CTA,
} from "./outreachCopy";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Plain, professional HTML email. No newsletter chrome.
 */
export function renderOutreachHtml(input: {
  bodyText: string;
  previewUrl: string;
  landingPageUrl?: string;
  brand: MeneerMarketingBrandSettings;
}): string {
  const previewEsc = escapeHtml(input.previewUrl);
  const landingEsc = input.landingPageUrl
    ? escapeHtml(input.landingPageUrl)
    : "";
  const linkUrls = [input.landingPageUrl].filter(
    (url): url is string => Boolean(url?.trim()),
  );
  const paragraphs = input.bodyText
    .trim()
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const bodyHtml = paragraphs
    .map((p) => {
      let html = escapeHtml(p).replace(/\n/g, "<br>\n");

      const previewCtaEsc = escapeHtml(OUTREACH_PREVIEW_CTA);
      const offerCtaEsc = escapeHtml(OUTREACH_OFFER_CTA);

      if (p.includes(OUTREACH_PREVIEW_CTA)) {
        html = html.replace(
          previewCtaEsc,
          `<a href="${previewEsc}" style="color:#C2410C;font-weight:700;text-decoration:underline;">${previewCtaEsc}</a>`
        );
      } else if (html.includes(previewEsc)) {
        html = html.replace(
          previewEsc,
          `<a href="${previewEsc}" style="color:#C2410C;font-weight:700;text-decoration:underline;">${previewEsc}</a>`
        );
      }

      if (p.includes(OUTREACH_OFFER_CTA) && landingEsc) {
        html = html.replace(
          offerCtaEsc,
          `<a href="${landingEsc}" style="color:#C2410C;font-weight:700;text-decoration:underline;">${offerCtaEsc}</a>`
        );
      }

      for (const url of linkUrls) {
        const esc = escapeHtml(url);
        if (html.includes(esc)) {
          html = html.replace(
            esc,
            `<a href="${esc}" style="color:#C2410C;font-weight:600;text-decoration:underline;">${esc}</a>`
          );
        }
      }

      return `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#1e293b;font-family:Georgia,'Times New Roman',serif;">${html}</p>`;
    })
    .join("\n");

  const sender = getSenderDisplay(input.brand);
  const companyLine = sender.signature_company
    ? `<br>${escapeHtml(sender.signature_company)}`
    : "";
  const email = input.brand.reply_to || input.brand.from_email || "info@meneermarketing.nl";
  const phone = input.brand.contact_phone?.trim()
    ? `<br>${escapeHtml(input.brand.contact_phone.trim())}`
    : "";
  const kvkNumber = input.brand.kvk || "42095913";
  const kvk = `<br>KVK ${escapeHtml(kvkNumber)}`;

  let hostHint = "";
  try {
    hostHint = new URL(input.previewUrl).host;
  } catch {
    hostHint = "";
  }

  return `<!DOCTYPE html>
<html lang="nl">
<body style="margin:0;padding:0;background:#ffffff;">
  <div style="max-width:560px;margin:0 auto;padding:28px 18px;">
    ${bodyHtml}
    ${
      hostHint
        ? `<p style="margin:0 0 20px;font-size:12px;line-height:1.4;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">Preview via ${escapeHtml(hostHint)}</p>`
        : ""
    }
    <p style="margin:8px 0 0;font-size:13px;line-height:1.55;color:#64748b;font-family:Arial,Helvetica,sans-serif;">
      ${escapeHtml(sender.signature_name)}${companyLine}<br>
      ${escapeHtml(input.brand.tagline)}<br>
      <a href="mailto:${escapeHtml(email)}" style="color:#C2410C;text-decoration:none;">${escapeHtml(email)}</a>${phone}${kvk}
    </p>
  </div>
</body>
</html>`;
}
