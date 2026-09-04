import * as cheerio from "cheerio";
import type { CroAuditType, KeywordIntent } from "../../config/scoringWeights.js";
import type { PageRepresentation } from "../../types/audit.js";

export function buildPageRepresentation(input: {
  html: string;
  url: string;
  advertisement: PageRepresentation["advertisement"];
  business: PageRepresentation["business"];
  source: {
    auditType: CroAuditType;
    sourceQuality: number | null;
    keyword: string | null;
    keywordIntent: KeywordIntent | null;
    exactPaidEvidence: boolean;
  };
  knownProduct?: {
    name: string | null;
    price: number | null;
    currency: string | null;
    reviewCount: number | null;
    rating: number | null;
  };
}): PageRepresentation {
  const $ = cheerio.load(input.html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();

  const h1 = $("h1").first().text().trim() || null;
  const productTitle = input.knownProduct?.name ?? h1;
  const subtitle =
    $("h1").next("p, h2, .subtitle, .product__subtitle").first().text().trim() ||
    $("meta[name='description']").attr("content")?.trim()?.slice(0, 180) ||
    null;

  const primaryCta =
    findFirstText($, [
      "button:contains('Winkelwagen')",
      "button:contains('In winkelwagen')",
      "button:contains('Add to cart')",
      "button:contains('Koop')",
      "button:contains('Bestel')",
      "[name='add']",
      ".product-form button",
    ]) ?? null;

  const benefits = collectListItems($, [
    ".product__description li",
    ".product-benefits li",
    ".usps li",
    "[class*='benefit'] li",
    ".rte li",
  ]).slice(0, 8);

  const features = collectListItems($, [
    ".product-features li",
    "[class*='feature'] li",
    ".specs li",
  ]).slice(0, 8);

  const faq = $("[class*='faq'] , details summary")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean)
    .slice(0, 6);

  const trustBadges = collectTextMatches(bodyText, [
    "gratis verzending",
    "gratis retour",
    "30 dagen",
    "geld-terug",
    "garantie",
    "veilig betalen",
    "klantenservice",
    "trustpilot",
    "certified",
    "fda",
  ]);

  const socialProof = collectTextMatches(bodyText, [
    "review",
    "beoordeling",
    "klanten",
    "testimonials",
    "sterren",
  ]);

  const paymentSignals = collectTextMatches(bodyText.toLowerCase(), [
    "ideal",
    "paypal",
    "klarna",
    "creditcard",
    "bancontact",
    "apple pay",
  ]);

  const promotion = collectTextMatches(bodyText.toLowerCase(), [
    "korting",
    "sale",
    "actie",
    "%",
    "gratis",
    "bundle",
  ]);

  const productMedia = $("img")
    .map((_, el) => {
      const alt = ($(el).attr("alt") ?? "").trim();
      return alt.length > 3 ? alt.slice(0, 80) : null;
    })
    .get()
    .filter(Boolean)
    .slice(0, 6) as string[];

  const description = (() => {
    const meta = $("meta[name='description']").attr("content")?.trim();
    if (meta) return meta.slice(0, 1200);
    const rte = $(".product__description, .product-description, .rte")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    return rte ? rte.slice(0, 1200) : null;
  })();

  const shipping = extractSnippet(bodyText, ["verzending", "bezorg", "shipping"]);
  const returns = extractSnippet(bodyText, ["retour", "terugsturen", "returns"]);
  const guarantee = extractSnippet(bodyText, ["garantie", "guarantee", "geld-terug"]);
  const comparisonHints = collectTextMatches(bodyText, [
    "vergelijk",
    "versus",
    "waarom wij",
  ]);
  const beforeAfter = collectTextMatches(bodyText, ["before", "after", "voor/na", "resultaat"]);
  const ugc = collectTextMatches(bodyText, ["ugc", "instagram", "tiktok", "klantfoto"]);
  const testimonials = collectTextMatches(bodyText, ["testimonial", "ervaring", "review"]);

  return {
    url: input.url,
    aboveTheFold: {
      productTitle,
      subtitle,
      price: input.knownProduct?.price ?? null,
      compareAtPrice: null,
      currency: input.knownProduct?.currency ?? "EUR",
      reviews: input.knownProduct?.reviewCount ?? null,
      rating: input.knownProduct?.rating ?? null,
      primaryCta,
      benefits,
      trust: trustBadges,
      delivery: shipping,
      promotion,
      productMedia,
      shipping,
      trustBadges,
    },
    page: {
      description,
      benefits,
      features,
      reviews: socialProof,
      faq,
      guarantee,
      shipping,
      returns,
      payments: paymentSignals,
      comparison: comparisonHints,
      beforeAfter,
      ugc,
      testimonials,
    },
    pageContent: {
      description,
      usps: benefits,
      features,
      socialProof,
      faq,
      guarantee,
      shipping,
      returns,
      paymentSignals,
      comparisonHints,
    },
    advertisement: input.advertisement,
    business: input.business,
    source: input.source,
  };
}

function findFirstText($: cheerio.CheerioAPI, selectors: string[]): string | null {
  for (const selector of selectors) {
    try {
      if (selector.includes(":contains")) {
        const needle = selector.match(/contains\('(.+?)'\)/)?.[1]?.toLowerCase();
        const tag = selector.split(":")[0] ?? "button";
        const match = $(tag)
          .filter((_, el) => $(el).text().toLowerCase().includes(needle ?? ""))
          .first()
          .text()
          .replace(/\s+/g, " ")
          .trim();
        if (match) return match.slice(0, 80);
        continue;
      }
      const text = $(selector).first().text().replace(/\s+/g, " ").trim();
      if (text) return text.slice(0, 80);
    } catch {
      // continue
    }
  }
  return null;
}

function collectListItems($: cheerio.CheerioAPI, selectors: string[]): string[] {
  const items: string[] = [];
  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text && text.length > 3 && text.length < 180) {
        items.push(text);
      }
    });
  }
  return [...new Set(items)];
}

function collectTextMatches(text: string, needles: string[]): string[] {
  const lower = text.toLowerCase();
  return needles.filter((needle) => lower.includes(needle.toLowerCase()));
}

function extractSnippet(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  for (const keyword of keywords) {
    const idx = lower.indexOf(keyword.toLowerCase());
    if (idx >= 0) {
      return text.slice(Math.max(0, idx - 20), idx + 100).trim();
    }
  }
  return null;
}
