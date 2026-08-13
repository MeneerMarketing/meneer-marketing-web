import {
  getSenderDisplay,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Email-safe stack close to Meneer Marketing (Plus Jakarta / system UI). */
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

/**
 * Plain, professional HTML email. No newsletter chrome.
 * Custom webfonts (Plus Jakarta) are unreliable in mail clients; system sans is intentional.
 */
export function renderOutreachHtml(input: {
  bodyText: string;
  previewUrl: string;
  brand: MeneerMarketingBrandSettings;
}): string {
  const previewEsc = escapeHtml(input.previewUrl);
  const paragraphs = input.bodyText
    .trim()
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Body text already includes signature; render a single HTML signature instead
  const groetIndex = paragraphs.findIndex((p) => /^Groet,?/i.test(p.trim()));
  const renderParas =
    groetIndex > 0 ? paragraphs.slice(0, groetIndex) : paragraphs;

  const bodyHtml = renderParas
    .map((p) => {
      let html = escapeHtml(p).replace(/\n/g, "<br>\n");

      if (/→ Bekijk hier jullie conceptwebsite/i.test(p)) {
        html = html.replace(
          /→ Bekijk hier jullie conceptwebsite/i,
          `<a href="${previewEsc}" style="color:#FF5722;font-weight:700;text-decoration:none;border-bottom:2px solid #FF5722;">→ Bekijk hier jullie conceptwebsite</a>`
        );
        html = html.replace(previewEsc, "");
        html = html.replace(/(?:<br>\n?){2,}/g, "<br>\n");
        html = html.replace(/<br>\n?\s*$/g, "");
      } else if (html.includes(previewEsc)) {
        html = html.replace(
          previewEsc,
          `<a href="${previewEsc}" style="color:#94a3b8;font-size:13px;text-decoration:none;word-break:break-all;">${previewEsc}</a>`
        );
      }

      return `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#0f172a;font-family:${FONT};">${html}</p>`;
    })
    .join("\n");

  const sender = getSenderDisplay(input.brand);
  const companyLine = sender.signature_company
    ? `<br>${escapeHtml(sender.signature_company)}`
    : "";
  const kvk = input.brand.kvk ? `<br>KVK ${escapeHtml(input.brand.kvk)}` : "";

  let hostHint = "";
  try {
    hostHint = new URL(input.previewUrl).host;
  } catch {
    hostHint = "";
  }

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;font-family:${FONT};">
    ${bodyHtml}
    ${
      hostHint
        ? `<p style="margin:0 0 24px;font-size:12px;line-height:1.45;color:#94a3b8;font-family:${FONT};">${escapeHtml(hostHint)}</p>`
        : ""
    }
    <p style="margin:0;padding-top:4px;font-size:14px;line-height:1.6;color:#64748b;font-family:${FONT};">
      Groet,<br><br>
      <span style="color:#0f172a;font-weight:600;">${escapeHtml(sender.signature_name)}</span>${companyLine}<br>
      ${escapeHtml(input.brand.tagline)}<br>
      <a href="${escapeHtml(input.brand.website)}" style="color:#FF5722;text-decoration:none;font-weight:600;">${escapeHtml(input.brand.website_label)}</a>${kvk}
    </p>
  </div>
</body>
</html>`;
}
