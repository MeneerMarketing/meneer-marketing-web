/** Vaste CTA-regels in outreach-mail (geen ruwe URL's in de tekst). */
export const OUTREACH_PREVIEW_CTA = "→ Bekijk hier jullie conceptwebsite";
export const OUTREACH_OFFER_CTA = "→ Bekijk het samenwerkingsaanbod";

export function bodyIncludesPreviewCta(body: string): boolean {
  return body.includes(OUTREACH_PREVIEW_CTA);
}

export function bodyIncludesOfferCta(body: string): boolean {
  return body.includes(OUTREACH_OFFER_CTA);
}
