import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync } from "node:fs";

const url =
  "https://tensfact.com/products/tensfact-automatische-voerbak-voor-kat-of-hond-met-hd-camera";

const { data: html } = await axios.get(url, {
  timeout: 25000,
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
});
const $ = cheerio.load(html);

const bodyText = $("body").text().replace(/\s+/g, " ");
const hits = [];
for (const re of [
  /10\.?000\+?[^.|]{0,40}/gi,
  /tevreden klanten[^.|]{0,40}/gi,
  /\d[.,]\d\s*\/\s*5/gi,
  /ster{1,5}/gi,
  /Trustpilot/gi,
  /Klarna[^.|]{0,60}/gi,
  /Gratis verzending[^.|]{0,60}/gi,
  /Retour[^.|]{0,80}/gi,
  /op voorraad|voorraad/gi,
  /€\s?\d+[.,]\d{2}/g,
]) {
  const m = bodyText.match(re);
  if (m) hits.push({ re: String(re), samples: [...new Set(m)].slice(0, 8) });
}

const json = [];
$('script[type="application/ld+json"]').each((_, el) => {
  try {
    json.push(JSON.parse($(el).html() || ""));
  } catch {
    /* ignore */
  }
});

const product = json.find(
  (j) =>
    String(j?.["@type"] || "").toLowerCase().includes("product") ||
    (Array.isArray(j) && j.some((x) => String(x?.["@type"]).includes("Product")))
);

writeFileSync(
  "tmp-tensfact-signals.json",
  JSON.stringify(
    {
      hits,
      productSnippet: product
        ? {
            type: product["@type"],
            name: product.name,
            aggregateRating: product.aggregateRating,
            offers: product.offers,
            reviewCount: Array.isArray(product.review)
              ? product.review.length
              : undefined,
          }
        : null,
      annCandidates: $("[class*='ann'], [class*='usp'], [class*='trust'], .rte li")
        .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
        .get()
        .filter((t) => t.length > 6 && t.length < 100)
        .slice(0, 40),
      h1: $("h1").first().text().trim(),
      desc: ($("meta[name=description]").attr("content") || "").slice(0, 300),
    },
    null,
    2
  )
);
console.log("wrote tmp-tensfact-signals.json");
