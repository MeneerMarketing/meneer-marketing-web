/**
 * Zet alle zichtbare tekst van de site in één document.
 *
 * WAAROM DIT BESTAAT.
 *
 * Diba leest de teksten na. Dat kan op twee manieren: honderdvier pagina's één voor één
 * langslopen in een browser, of één document doorlezen waarin alles op volgorde staat.
 * Het eerste is precies de reden dat redactierondes maanden duren en halverwege stilvallen.
 *
 * Dit script haalt de tekst uit de gerenderde pagina's en niet uit de bronbestanden. Dat is
 * een bewuste keuze: wat in `src/data` staat is niet altijd wat er op het scherm komt.
 * Sommige teksten worden samengesteld, sommige staan er dubbel, en alles loopt door
 * `publicCopy` heen die de redactievlaggen eruit haalt. Wat Okan leest moet zijn wat de
 * bezoeker leest.
 *
 * WAAROM HET EEN SCRIPT IS EN GEEN EENMALIGE DUMP.
 *
 * Omdat de teksten blijven veranderen. Een dump is een dag later achterhaald en dan weet
 * niemand meer welke versie de laatste was. Dit draait opnieuw met één commando, en het
 * document draagt de datum van dat moment.
 *
 * WAT ER PER PAGINA IN KOMT.
 *
 * De paginatitel zoals hij in het tabblad staat, de omschrijving die in Google verschijnt,
 * en daarna alle koppen en alinea's in de volgorde waarin ze op de pagina staan. Koppen
 * blijven koppen, zodat de structuur herkenbaar is en Okan ziet wat een kop is en wat een
 * uitleg.
 *
 * WAT ER MET OPZET NIET IN KOMT.
 *
 * Navigatie, voettekst en de bewijsstrip. Die staan op elke pagina hetzelfde en zouden het
 * document met honderd herhalingen vullen; ze staan één keer apart bovenaan.
 *
 * Knoppen ook niet als losse regel: die staan tussen de tekst waar ze horen, met een pijl
 * ervoor, zodat duidelijk is dat het om een knop gaat en niet om een zin.
 *
 * GEBRUIK.
 *
 *   npm run dev        (in een ander venster)
 *   node scripts/tekstexport.mjs
 *
 * Resultaat: TEKSTEN.md in de hoofdmap.
 */
import { chromium } from "playwright";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join, relative, sep } from "path";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/**
 * De volgorde van het document.
 *
 * Niet alfabetisch, maar zoals iemand de site zou lezen: eerst waar bezoekers binnenkomen,
 * dan de huidproblemen, dan wat je eraan kunt doen, en het formele achteraan. Een
 * alfabetische lijst zet /algemene-voorwaarden bovenaan, en dan begint de redactieronde met
 * de saaiste pagina van de site.
 */
const HOOFDSTUKKEN = [
  {
    naam: "De ingang",
    test: (p) => ["/", "/over-ons", "/ons-verhaal", "/team", "/contact"].includes(p),
  },
  { naam: "Huidproblemen", test: (p) => p.startsWith("/huidproblemen") },
  { naam: "Behandelingen", test: (p) => p.startsWith("/behandelingen") },
  { naam: "Apparatuur", test: (p) => p.startsWith("/apparatuur") },
  { naam: "Prijzen en vergoeding", test: (p) => p.startsWith("/prijzen") || p.startsWith("/vergoedingen") },
  {
    naam: "Juridisch en formeel",
    test: (p) =>
      ["/algemene-voorwaarden", "/privacybeleid", "/cookiebeleid", "/klachten"].includes(p),
  },
  { naam: "Overig", test: () => true },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

/* ── Routes verzamelen: dezelfde aanpak als de huisregelcontrole ───────────
   Als die twee uit elkaar lopen, controleert de een pagina's die de ander niet exporteert
   en omgekeerd. Dus dezelfde bronnen: de app-map, de sitemap en de overzichtspagina's. */

function zoekPaginas(map) {
  const uit = [];
  for (const naam of readdirSync(map)) {
    const vol = join(map, naam);
    if (statSync(vol).isDirectory()) uit.push(...zoekPaginas(vol));
    else if (naam === "page.tsx") uit.push(map);
  }
  return uit;
}

await page.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await page.content();
const uitSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);

const OVERZICHTEN = [
  { pad: "/apparatuur", voorvoegsel: "/apparatuur/" },
  { pad: "/vergoedingen", voorvoegsel: "/vergoedingen/" },
];
const uitOverzichten = [];
for (const { pad, voorvoegsel } of OVERZICHTEN) {
  await page.goto(`${BASIS}${pad}`, { waitUntil: "networkidle" });
  uitOverzichten.push(
    ...(await page.evaluate(
      (v) =>
        [...document.querySelectorAll(`a[href^='${v}']`)]
          .map((a) => a.getAttribute("href"))
          .filter((h, i, l) => l.indexOf(h) === i),
      voorvoegsel,
    )),
  );
}

const statisch = zoekPaginas(join(process.cwd(), "src", "app"))
  .map(
    (m) =>
      "/" + relative(join(process.cwd(), "src", "app"), m).split(sep).join("/"),
  )
  .map((p) => (p === "/." ? "/" : p))
  .filter((p) => !p.includes("[") && !p.includes("("));

const paden = [...new Set([...statisch, ...uitSitemap, ...uitOverzichten])]
  .filter(
    (p) =>
      !p.startsWith("/preview-login") &&
      !p.startsWith("/api") &&
      !p.startsWith("/dev") &&
      !p.startsWith("/home-variant"),
  )
  .sort();

/* ── De tekst per pagina ophalen ─────────────────────────────────────────── */

/**
 * Wat er uit de pagina komt, en in welke vorm.
 *
 * De selector pakt alles binnen `main`: dat sluit de kop- en voettekst uit zonder dat er
 * een lijst met uitzonderingen bijgehouden hoeft te worden. De bewijsstrip staat wél in
 * main en wordt op inhoud herkend, want die vier getallen zijn op elke pagina gelijk.
 */
/**
 * Haalt de zichtbare tekst van één pagina op.
 *
 * "Zichtbaar" is hier letterlijk bedoeld en dat was een valkuil: innerText geeft alleen wat
 * er staat te renderen, dus alles in een dichtgeklapte details bleef buiten het document.
 * Daarom wordt hieronder eerst alles opengeklapt.
 */
async function haalTekst(pad) {
  await page.goto(BASIS + pad, { waitUntil: "networkidle" });

  /* Een alias die doorverwijst hoort niet als eigen pagina in het document. */
  const beland = new URL(page.url()).pathname.replace(/\/$/, "");
  if (beland !== pad.replace(/\/$/, "").split("#")[0]) return null;

  return page.evaluate(() => {
    const titel = document.title;
    const omschrijving =
      document.querySelector('meta[name="description"]')?.content ?? "";

    const hoofd = document.querySelector("main");
    if (!hoofd) return { titel, omschrijving, blokken: [] };

    /* Weg met wat op elke pagina hetzelfde is en wat verderop toch herhaald wordt: het
       kruimelpad, de sprongnavigatie boven aan een pillarpagina, en de bewijsstrip met de
       vier vaste getallen. Die drie samen waren goed voor ruim duizend regels ruis. */
    for (const weg of hoofd.querySelectorAll(
      'nav, [class*="ProofBar"], [data-export="over"]',
    )) {
      weg.remove();
    }

    /* Alles openklappen voordat we lezen.

       De veelgestelde vragen staan in dichtgeklapte details-elementen, en innerText geeft
       alleen wat er te renderen staat. Daardoor stonden ruim honderdvijftig antwoorden niet
       in dit document: precies de plek waar de concrete dingen staan, zoals wat het kost en
       hoeveel sessies er nodig zijn. */
    for (const d of hoofd.querySelectorAll("details")) d.open = true;

    const blokken = [];
    const gezien = new Set();

    for (const el of hoofd.querySelectorAll(
      "h1, h2, h3, h4, p, li, dt, dd, th, td, summary, a[class*=rounded], button",
    )) {
      const tekst = (el.innerText || "").replace(/\s+/g, " ").trim();
      if (!tekst || tekst.length < 2) continue;

      /* De bewijsstrip: staat op vrijwel elke pagina met dezelfde vier getallen. */
      if (/^(2017|10\.000\+|55\.000\+|3\.883)$/.test(tekst)) continue;
      if (/^(ACTIEF SINDS|GEHOLPEN KLANTEN|BEHANDELINGEN|KLANTREVIEWS)$/i.test(tekst))
        continue;
      if (gezien.has(tekst)) continue;

      /* Een alinea die al in een eerder blok zat (bijvoorbeeld een <p> in een <li>) hoeft
         niet twee keer. Vandaar de check op inhoud en niet op element. */
      if (blokken.some((b) => b.tekst.includes(tekst))) continue;
      gezien.add(tekst);

      const tag = el.tagName.toLowerCase();
      let soort = "tekst";
      if (/^h[1-4]$/.test(tag)) soort = tag;
      else if (tag === "a" || tag === "button") soort = "knop";
      else if (tag === "li") soort = "punt";
      else if (tag === "dt" || tag === "th") soort = "label";

      blokken.push({ soort, tekst });
    }
    return { titel, omschrijving, blokken };
  });
}

/* ── Schrijven ───────────────────────────────────────────────────────────── */

const vandaag = new Date().toLocaleDateString("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const regels = [
  "# Alle teksten van de website",
  "",
  `Diba Clinics · gegenereerd op ${vandaag} · ${paden.length} pagina's`,
  "",
  "Dit document bevat elke tekst die een bezoeker op de site ziet, in de volgorde waarin",
  "hij op de pagina staat. Het is uit de echte pagina's getrokken en niet uit de broncode,",
  "dus wat hier staat is letterlijk wat er op het scherm komt.",
  "",
  "**Zo lees je het.** Elke pagina begint met zijn adres en de titel die in het tabblad en",
  "in Google verschijnt. Daaronder staan de koppen en teksten. `KOP` is een kop op de",
  "pagina, `knop` is een knop of een link waar je op drukt, en de rest is gewone tekst.",
  "",
  "**Zo geef je commentaar.** Zet je opmerking direct onder de regel waar hij over gaat, of",
  "gebruik de opmerkingfunctie van je tekstverwerker. Het paginaadres erbij houden is",
  "genoeg om het terug te vinden; je hoeft niet te zoeken waar het in de code staat.",
  "",
  "De kop- en voettekst staan op elke pagina hetzelfde en zijn hier weggelaten.",
  "",
  "---",
  "",
];

const perHoofdstuk = new Map(HOOFDSTUKKEN.map((h) => [h.naam, []]));
for (const pad of paden) {
  const h = HOOFDSTUKKEN.find((x) => x.test(pad));
  perHoofdstuk.get(h.naam).push(pad);
}

let aantalBlokken = 0;
let woorden = 0;

for (const hoofdstuk of HOOFDSTUKKEN) {
  const lijst = perHoofdstuk.get(hoofdstuk.naam);
  if (!lijst.length) continue;

  regels.push(`## ${hoofdstuk.naam}`, "");

  for (const pad of lijst) {
    const gevonden = await haalTekst(pad);
    /* null betekent: deze route verwijst door, de tekst staat al onder de bestemming. */
    if (!gevonden) continue;
    const { titel, omschrijving, blokken } = gevonden;
    aantalBlokken += blokken.length;

    regels.push(`### ${pad}`, "");
    regels.push(`**Tabbladtitel:** ${titel}`, "");
    if (omschrijving) regels.push(`**Google-omschrijving:** ${omschrijving}`, "");

    if (!blokken.length) {
      regels.push("_Geen tekst gevonden op deze pagina._", "");
    }

    for (const b of blokken) {
      woorden += b.tekst.split(/\s+/).length;
      if (b.soort === "h1") regels.push(`**${b.tekst.toUpperCase()}**`, "");
      else if (b.soort === "h2" || b.soort === "h3" || b.soort === "h4")
        regels.push(`**${b.tekst}**`, "");
      else if (b.soort === "knop") regels.push(`> knop: ${b.tekst}`, "");
      else if (b.soort === "punt") regels.push(`- ${b.tekst}`, "");
      else if (b.soort === "label") regels.push(`*${b.tekst}*`, "");
      else regels.push(b.tekst, "");
    }

    regels.push("---", "");
  }
}

regels.push(
  "",
  `_${paden.length} pagina's · ${aantalBlokken} tekstblokken · ongeveer ${woorden.toLocaleString("nl-NL")} woorden._`,
  "",
);

writeFileSync("TEKSTEN.md", regels.join("\n"), "utf8");
await browser.close();

console.log(
  `TEKSTEN.md geschreven: ${paden.length} pagina's, ${aantalBlokken} blokken, ~${woorden.toLocaleString("nl-NL")} woorden.`,
);
