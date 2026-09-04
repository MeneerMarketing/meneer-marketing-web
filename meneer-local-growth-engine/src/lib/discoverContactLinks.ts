import * as cheerio from "cheerio";

const CONTACT_HINT =
  /contact|contacteer|over-ons|about|locatie|afspraak|book|bereik|mail|praktijk|kliniek|team|studio|footer|privacy|voorwaarden/i;

export function discoverContactLinks(html: string, origin: string): string[] {
  const $ = cheerio.load(html);
  const found = new Set<string>();

  function addHref(href: string | undefined) {
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
    try {
      const url = new URL(href, origin);
      if (!["http:", "https:"].includes(url.protocol)) return;
      if (url.origin !== origin) return;
      if (/\.(pdf|jpg|jpeg|png|gif|webp|svg|zip|mp4)(\?|$)/i.test(url.pathname)) return;
      found.add(url.toString());
    } catch {
      /* invalid href */
    }
  }

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const text = $(el).text().replace(/\s+/g, " ").trim();
    const aria = $(el).attr("aria-label") ?? "";
    if (CONTACT_HINT.test(href) || CONTACT_HINT.test(text) || CONTACT_HINT.test(aria)) {
      addHref(href);
    }
  });

  $("footer a[href], [role='contentinfo'] a[href]").each((_, el) => {
    addHref($(el).attr("href"));
  });

  return Array.from(found);
}
