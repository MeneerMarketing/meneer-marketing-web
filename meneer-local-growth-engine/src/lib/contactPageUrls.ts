/**
 * Contact- en locatiepagina's om e-mail te scrapen (pilates + huidklinieken).
 */
export function contactPageUrls(base: string): string[] {
  try {
    const origin = new URL(base.startsWith("http") ? base : `https://${base}`).origin;
    const paths = [
      "",
      "/contact",
      "/contact/",
      "/contacteer-ons",
      "/contacteer-ons/",
      "/contact-us",
      "/contacteer",
      "/nl/contact",
      "/en/contact",
      "/over-ons",
      "/about",
      "/about-us",
      "/locatie",
      "/locaties",
      "/afspraak",
      "/afspraak-maken",
      "/book",
      "/booking",
      "/kliniek/contact",
      "/praktijk/contact",
      "/neem-contact-op",
      "/neem-contact-op/",
      "/contactgegevens",
      "/contactgegevens/",
      "/contact-opnemen",
      "/contact-opnemen/",
      "/footer",
    ];
    return paths.map((path) => `${origin}${path}`);
  } catch {
    return [];
  }
}
