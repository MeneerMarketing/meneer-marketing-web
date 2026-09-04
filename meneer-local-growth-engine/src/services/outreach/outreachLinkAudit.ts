import {
  OUTREACH_OFFER_CTA,
  OUTREACH_PREVIEW_CTA,
  bodyIncludesOfferCta,
  bodyIncludesPreviewCta,
} from "./outreachCopy";

export type LinkAuditStatus = "ok" | "warn" | "error";

export interface OutreachLinkAuditItem {
  id: "preview_cta" | "offer_cta" | "preview_link" | "offer_link";
  label: string;
  status: LinkAuditStatus;
  detail: string;
  href?: string | null;
}

function htmlContainsLinkedHref(html: string, href: string): boolean {
  if (!href.trim()) return false;
  const normalized = href.replace(/&amp;/g, "&");
  return (
    html.includes(`href="${href}"`) ||
    html.includes(`href="${normalized}"`) ||
    html.includes(`href='${href}'`) ||
    html.includes(`href='${normalized}'`)
  );
}

function isHttpsUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function auditOutreachLinks(input: {
  bodyText: string;
  bodyHtml: string;
  previewUrl: string | null;
  landingPageUrl: string | null;
}): OutreachLinkAuditItem[] {
  const items: OutreachLinkAuditItem[] = [];

  const previewCtaOk = bodyIncludesPreviewCta(input.bodyText);
  items.push({
    id: "preview_cta",
    label: "Preview-CTA in tekst",
    status: previewCtaOk ? "ok" : "error",
    detail: previewCtaOk
      ? `"${OUTREACH_PREVIEW_CTA}" staat in de mail.`
      : `Ontbreekt: "${OUTREACH_PREVIEW_CTA}".`,
  });

  const offerCtaOk = bodyIncludesOfferCta(input.bodyText);
  const offerExpected = Boolean(input.landingPageUrl?.trim());
  items.push({
    id: "offer_cta",
    label: "Aanbod-CTA in tekst",
    status: offerCtaOk ? "ok" : offerExpected ? "error" : "warn",
    detail: offerCtaOk
      ? `"${OUTREACH_OFFER_CTA}" staat in de mail.`
      : offerExpected
        ? `Ontbreekt: "${OUTREACH_OFFER_CTA}".`
        : "Geen aanbod-URL geconfigureerd voor deze studio.",
    href: input.landingPageUrl,
  });

  const previewUrl = input.previewUrl?.trim() ?? "";
  const previewLinkOk =
    Boolean(previewUrl) &&
    isHttpsUrl(previewUrl) &&
    htmlContainsLinkedHref(input.bodyHtml, previewUrl);
  items.push({
    id: "preview_link",
    label: "Conceptwebsite-link in HTML",
    status: !previewUrl ? "error" : previewLinkOk ? "ok" : "error",
    detail: !previewUrl
      ? "Geen preview-URL beschikbaar."
      : previewLinkOk
        ? "Preview-CTA linkt naar de conceptwebsite."
        : isHttpsUrl(previewUrl)
          ? "Preview-URL ontbreekt als klikbare link in de HTML."
          : "Preview-URL moet een absolute https-URL zijn.",
    href: previewUrl || null,
  });

  const landingUrl = input.landingPageUrl?.trim() ?? "";
  if (landingUrl) {
    const offerLinkOk =
      isHttpsUrl(landingUrl) && htmlContainsLinkedHref(input.bodyHtml, landingUrl);
    items.push({
      id: "offer_link",
      label: "Aanbod-link in HTML",
      status: offerLinkOk ? "ok" : "error",
      detail: offerLinkOk
        ? "Aanbod-CTA linkt naar de landingspagina."
        : isHttpsUrl(landingUrl)
          ? "Aanbod-URL ontbreekt als klikbare link in de HTML."
          : "Aanbod-URL moet https zijn.",
      href: landingUrl,
    });
  }

  return items;
}

export function allOutreachLinksOk(items: OutreachLinkAuditItem[]): boolean {
  return items.every((item) => item.status === "ok");
}
