/**
 * De technische SEO-audit die anders een bureau een keer per kwartaal doet.
 *
 * WAT DIT MEET, PER PAGINA EN IN ALLE TALEN.
 *
 *   KOPPEN       precies één h1, niet leeg; geen sprong van h1 naar h3 zonder h2.
 *   METADATA     titel; omschrijving tussen 50 en 160 tekens; canonical, absoluut en op
 *                de eigen host; og:title, og:image, og:url; twitter:card.
 *   INDEXATIE    geen `noindex` op een taal die af is (zie TAAL_AF in lib/taal.ts).
 *   HREFLANG     wederkerig. Als A zegt "mijn Engelse tegenhanger is B", dan hoort B
 *                terug te wijzen naar A. Zonder die wederkerigheid negeert Google het paar.
 *   STRUCTUUR    elk JSON-LD-blok is geldige JSON, en draagt de velden die Google voor dat
 *                type verplicht stelt. Een FAQPage zonder antwoorden of een JobPosting
 *                zonder datePosted levert geen rich result op — het valt stil weg.
 *   INHOUD       minder dan 150 woorden in de hoofdtekst, of minder dan drie interne
 *                links: geen fout, wel een pagina die weinig te bieden heeft aan een crawler.
 *
 * Fouten laten de controle vallen; waarschuwingen staan in de lijst om naar te kijken.
 *
 *   BASIS=http://localhost:3021 npm run seo
 *   ALLES=1 BASIS=... npm run seo     (alle bevindingen, niet de eerste dertig per soort)
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { alleAdressen, taalVanPad } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const ALLES = process.env.ALLES === "1";

/* Welke talen af zijn, uit de bron: alleen daar is `noindex` een fout. */
const taalAf = (() => {
  const bron = readFileSync("src/lib/taal.ts", "utf8");
  const blok = bron.split("export const TAAL_AF")[1]?.split("};")[0] ?? "";
  const uit = {};
  for (const m of blok.matchAll(/([a-z]{2}):\s*(true|false)/g))
    uit[m[1]] = m[2] === "true";
  return uit;
})();

/** Verplichte velden per schematype, naar Google's eisen voor rich results. */
const VERPLICHT = {
  MedicalClinic: ["name", "address", "telephone", "url"],
  LocalBusiness: ["name", "address", "telephone", "url"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  MedicalProcedure: ["name", "description"],
  Person: ["name", "jobTitle"],
  JobPosting: [
    "title",
    "description",
    "datePosted",
    "validThrough",
    "hiringOrganization",
    "jobLocation",
  ],
  Service: ["name", "provider"],
  Article: ["headline", "datePublished", "author"],
  BlogPosting: ["headline", "datePublished", "author"],
  MedicalWebPage: ["name"],
};

const LEES = () => {
  const koppen = [...document.querySelectorAll("h1, h2, h3, h4")].map((h) => ({
    n: Number(h.tagName[1]),
    tekst: (h.textContent ?? "").replace(/\s+/g, " ").trim(),
  }));
  const meta = (sel) =>
    document.querySelector(sel)?.getAttribute("content") ?? "";
  const alternates = {};
  for (const l of document.querySelectorAll(
    'link[rel="alternate"][hreflang]',
  )) {
    alternates[l.getAttribute("hreflang")] = l.getAttribute("href");
  }
  const blokken = [
    ...document.querySelectorAll('script[type="application/ld+json"]'),
  ].map((s) => s.textContent ?? "");
  const hoofd = document.querySelector("main") ?? document.body;
  const woorden = (hoofd.innerText ?? "").split(/\s+/).filter(Boolean).length;
  const interneLinks = new Set(
    [...document.querySelectorAll("main a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/")),
  ).size;
  return {
    titel: document.title,
    omschrijving: meta('meta[name="description"]'),
    canonical:
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
      "",
    ogTitel: meta('meta[property="og:title"]'),
    ogBeeld: meta('meta[property="og:image"]'),
    ogUrl: meta('meta[property="og:url"]'),
    twitter: meta('meta[name="twitter:card"]'),
    robots: meta('meta[name="robots"]'),
    koppen,
    alternates,
    blokken,
    woorden,
    interneLinks,
  };
};

const browser = await chromium.launch();
const pagina = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
});
const paden = await alleAdressen(BASIS);

const fouten = [];
const waarschuwingen = [];
const alternatesPerPad = new Map();
const host = new URL(BASIS).host;
/* De canonical wijst naar het productieadres, niet naar de meetserver. */
const eigenHost = (() => {
  const bron = readFileSync("src/lib/site.ts", "utf8");
  return new URL(
    /export const DIBA_SITE_URL = "([^"]+)"/.exec(bron)?.[1] ?? BASIS,
  ).host;
})();

const fout = (pad, soort, tekst) => fouten.push({ pad, soort, tekst });
const waarschuw = (pad, soort, tekst) =>
  waarschuwingen.push({ pad, soort, tekst });

for (const pad of paden) {
  let r;
  try {
    await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" });
    await pagina.waitForTimeout(80);
    r = await pagina.evaluate(LEES);
  } catch {
    fout(pad, "laden", "pagina laadt niet");
    continue;
  }
  const taal = taalVanPad(pad);

  /* KOPPEN */
  const h1s = r.koppen.filter((k) => k.n === 1);
  if (h1s.length !== 1) fout(pad, "h1", `${h1s.length} h1-koppen`);
  else if (!h1s[0].tekst) fout(pad, "h1", "lege h1");
  let vorige = 0;
  for (const k of r.koppen) {
    if (vorige && k.n > vorige + 1) {
      waarschuw(
        pad,
        "kopvolgorde",
        `h${vorige} -> h${k.n} zonder h${vorige + 1}: "${k.tekst.slice(0, 40)}"`,
      );
      break;
    }
    vorige = k.n;
  }

  /* METADATA */
  if (!r.titel) fout(pad, "titel", "geen <title>");
  if (!r.omschrijving) fout(pad, "omschrijving", "geen meta description");
  else if (r.omschrijving.length < 50)
    waarschuw(pad, "omschrijving", `te kort (${r.omschrijving.length} tekens)`);
  else if (r.omschrijving.length > 160)
    waarschuw(
      pad,
      "omschrijving",
      `te lang (${r.omschrijving.length} tekens), wordt afgekapt`,
    );
  if (!r.canonical) fout(pad, "canonical", "geen canonical");
  else {
    let c;
    try {
      c = new URL(r.canonical);
    } catch {
      fout(pad, "canonical", `niet absoluut: ${r.canonical}`);
    }
    if (c && c.host !== eigenHost && c.host !== host)
      fout(pad, "canonical", `wijst naar andere host: ${c.host}`);
  }
  if (!r.ogTitel) fout(pad, "opengraph", "geen og:title");
  if (!r.ogBeeld) fout(pad, "opengraph", "geen og:image");
  if (!r.ogUrl) fout(pad, "opengraph", "geen og:url");
  if (!r.twitter) waarschuw(pad, "opengraph", "geen twitter:card");

  /* INDEXATIE */
  if (/noindex/i.test(r.robots) && taalAf[taal])
    fout(pad, "noindex", `noindex op een taal die af is (${taal})`);

  /* HREFLANG: verzamelen, wederkerigheid komt na de loop. */
  alternatesPerPad.set(pad, r.alternates);

  /* STRUCTUUR */
  for (const [i, tekst] of r.blokken.entries()) {
    let json;
    try {
      json = JSON.parse(tekst);
    } catch {
      fout(pad, "json-ld", `blok ${i + 1} is geen geldige JSON`);
      continue;
    }
    const items = Array.isArray(json)
      ? json
      : json["@graph"]
        ? json["@graph"]
        : [json];
    for (const item of items) {
      const typen = [].concat(item["@type"] ?? []);
      for (const type of typen) {
        const eisen = VERPLICHT[type];
        if (!eisen) continue;
        for (const veld of eisen) {
          const w = item[veld];
          const leeg =
            w === undefined ||
            w === null ||
            w === "" ||
            (Array.isArray(w) && w.length === 0);
          if (leeg) fout(pad, "schema", `${type} zonder ${veld}`);
        }
        if (type === "FAQPage" && Array.isArray(item.mainEntity)) {
          for (const v of item.mainEntity) {
            if (!v.name || !v.acceptedAnswer?.text) {
              fout(
                pad,
                "schema",
                "FAQPage-vraag zonder name of acceptedAnswer.text",
              );
              break;
            }
          }
        }
        if (type === "BreadcrumbList" && Array.isArray(item.itemListElement)) {
          for (const v of item.itemListElement) {
            if (!v.name || !v.item || !v.position) {
              fout(
                pad,
                "schema",
                "BreadcrumbList-stap zonder name, item of position",
              );
              break;
            }
          }
        }
        /* Een Service mag zijn tarieven als `offers` dragen óf als `hasOfferCatalog` met
           regels erin; `dienstSchema` doet het tweede. Pas als allebei ontbreken is het
           een aanbod zonder bedrag. */
        if (
          type === "Service" &&
          !item.offers &&
          !(item.hasOfferCatalog?.itemListElement?.length > 0)
        )
          waarschuw(pad, "schema", "Service zonder offers of offer-catalogus");
        if (type === "MedicalWebPage" && !item.lastReviewed && !item.reviewedBy)
          waarschuw(
            pad,
            "schema",
            "MedicalWebPage zonder lastReviewed of reviewedBy",
          );
      }
    }
  }

  /* INHOUD */
  if (r.woorden < 150)
    waarschuw(pad, "dun", `${r.woorden} woorden in de hoofdtekst`);
  if (r.interneLinks < 3)
    waarschuw(pad, "links", `${r.interneLinks} interne links in de hoofdtekst`);
}
await browser.close();

/* HREFLANG-WEDERKERIGHEID: A -> B vraagt B -> A. */
const padVan = (url) => {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return url;
  }
};
for (const [pad, alts] of alternatesPerPad) {
  for (const [lang, url] of Object.entries(alts)) {
    if (lang === "x-default") continue;
    const doel = padVan(url);
    if (doel === pad) continue;
    const terug = alternatesPerPad.get(doel);
    if (!terug) {
      waarschuw(
        pad,
        "hreflang",
        `${lang} wijst naar ${doel}, dat niet in de sitemap staat`,
      );
      continue;
    }
    if (!Object.values(terug).some((u) => padVan(u) === pad))
      fout(
        pad,
        "hreflang",
        `${lang} -> ${doel}, maar ${doel} wijst niet terug`,
      );
  }
}

/* RAPPORT, gegroepeerd op soort en tekst. */
const groepeer = (lijst) => {
  const m = new Map();
  for (const b of lijst) {
    const s = `${b.soort}|${b.tekst}`;
    if (!m.has(s)) m.set(s, { ...b, paden: [] });
    m.get(s).paden.push(b.pad);
  }
  return [...m.values()].sort((a, b) => b.paden.length - a.paden.length);
};
const toon = (kop, lijst) => {
  console.log(
    `\n${kop} (${lijst.length} soorten, ${lijst.reduce((s, g) => s + g.paden.length, 0)} keer)`,
  );
  for (const g of ALLES ? lijst : lijst.slice(0, 30)) {
    console.log(
      `  ${String(g.paden.length).padStart(4)}x  [${g.soort}] ${g.tekst}`,
    );
    console.log(
      `         ${g.paden.slice(0, 3).join(", ")}${g.paden.length > 3 ? ` en nog ${g.paden.length - 3}` : ""}`,
    );
  }
  if (!ALLES && lijst.length > 30)
    console.log(`  en nog ${lijst.length - 30} soorten. ALLES=1 toont alles.`);
};

console.log(`\n${paden.length} pagina's nagelopen op ${BASIS}.`);
const gf = groepeer(fouten);
const gw = groepeer(waarschuwingen);
if (gf.length) toon("FOUTEN", gf);
else console.log("\nFOUTEN: geen.");
if (gw.length) toon("WAARSCHUWINGEN", gw);
else console.log("\nWAARSCHUWINGEN: geen.");
if (gf.length) process.exitCode = 1;
else
  console.log(
    "\nok — koppen, metadata, hreflang en structuurdata kloppen op elke pagina.",
  );
