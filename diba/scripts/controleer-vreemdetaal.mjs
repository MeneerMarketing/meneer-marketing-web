/**
 * Spreekt een vertaalde kant echt die taal?
 *
 * WAT DIT VINDT DAT `vertaalstand` NIET VINDT.
 *
 * `vertaalstand` telt hoeveel zinnen uit de bron in het woordenboek staan. Dat is de
 * voorraad, niet het resultaat. Er zijn drie manieren waarop Nederlands alsnog op een
 * vertaalde pagina komt terwijl die telling op honderd procent staat:
 *
 *   1. EEN SJABLOONTEKST. `${bedrag}, ${minuten} minuten` wordt per behandeling anders en
 *      kan dus geen sleutel zijn. Zo stond er onder elke Engelse behandelpagina in Google
 *      "Vanaf € 170, 60 minuten. Bij Diba Clinics in Rotterdam."
 *
 *   2. METADATA. De titel in het tabblad ging wel door het woordenboek, de titel voor Open
 *      Graph niet: die draagt de merknaam ("Hoe wij werken | Diba Clinics") en die hele
 *      regel staat nergens als sleutel. Dat is de titel die in een gedeelde link staat.
 *
 *   3. DE NOTATIE VAN EEN GETAL. "3.893 reviews" is geen Nederlands woord en valt dus door
 *      elke woordenzeef heen, maar een Engelstalige leest er bijna vier. Dat geldt alleen
 *      voor het Engels: het Spaans schrijft de punt en de komma net als het Nederlands.
 *
 * Dit script leest de gerenderde pagina en zoekt alle drie, per taal.
 *
 *   BASIS=http://localhost:3021 npm run vreemdetaal          # alle vreemde talen
 *   BASIS=http://localhost:3021 npm run vreemdetaal es       # er een
 *
 * De pagina's komen niet uit de sitemap: een taal die nog `noindex` draagt staat daar niet
 * in, en dat is juist de taal die nagekeken moet worden. Ze komen uit de hreflang van de
 * Nederlandse pagina's, aangevuld met het adres dat `lib/slugs.ts` ervan maakt.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/** De vreemde talen en de slugtabellen uit de bron, zodat die de enige waarheid blijven. */
function uitBron(naam, patroon) {
  return [
    ...readFileSync("src/lib/taal.ts", "utf8")
      .split(naam)[1]
      .split("]")[0]
      .matchAll(patroon),
  ];
}

const VREEMDE_TALEN = uitBron(
  "export const VREEMDE_TALEN = [",
  /"([a-z]{2})"/g,
).map((m) => m[1]);

function slugtabel(taal) {
  const bron = readFileSync("src/lib/slugs.ts", "utf8");
  const blok = bron.split(`const NAAR_${taal.toUpperCase()}`)[1].split("};")[0];
  const uit = new Map();
  for (const m of blok.matchAll(/^\s*"?([A-Za-z0-9-]+)"?:\s*"([^"]+)",/gm)) {
    uit.set(m[1], m[2]);
  }
  return uit;
}

function vertaaldPad(pad, tabel, taal) {
  if (pad === "/") return `/${taal}`;
  const delen = pad
    .split("/")
    .filter(Boolean)
    .map((d) => tabel.get(d) ?? d);
  return `/${taal}/${delen.join("/")}`;
}

const GEVRAAGD = process.argv.slice(2).filter((a) => VREEMDE_TALEN.includes(a));
const TALEN = GEVRAAGD.length ? GEVRAAGD : VREEMDE_TALEN;

/**
 * Alleen woorden die in de doeltaal niet bestaan.
 *
 * Elk woord dat ook Engels kan zijn (van, die, met, hoe, want, per) staat met opzet niet in
 * de Engelse lijst. Een zeef die honderd valse meldingen geeft wordt niet gelezen, en dan
 * vindt hij de ene echte ook niet meer. Voor het Spaans valt "no" af en komt "meer" erbij.
 */
const NL_IN_EN =
  /\b(wij|jouw|jij|niet|geen|waarom|huid|behandeling|behandelingen|afspraak|tarieven|vanaf|minuten|weken|maanden|dagen|zonder|eerste|tweede|altijd|nooit|meestal|misschien|daarna|daarom|precies|gewoon|samen|tijdens|volgens|ongeveer|bijvoorbeeld|huidtherapeut|huidtherapeuten|klanten|kliniek|meting|sessies|zelf|omdat|terwijl|maar|ook|nog|wel|dus|welke|hoeveel|wanneer|iedereen|niets|veel|weinig|beter|bekijk|lees|maken|kiezen|weten|zien|gaan|komen|staat|staan|heeft|hebben|wordt|worden|kost|kosten)\b/gi;

const NL_IN_ES =
  /\b(wij|jouw|jij|niet|geen|waarom|huid|behandeling|behandelingen|afspraak|tarieven|vanaf|minuten|weken|maanden|dagen|zonder|eerste|tweede|altijd|nooit|meestal|misschien|daarna|daarom|precies|gewoon|samen|tijdens|volgens|ongeveer|bijvoorbeeld|huidtherapeut|huidtherapeuten|klanten|kliniek|meting|sessies|zelf|omdat|terwijl|maar|meer|ook|nog|wel|dus|welke|hoeveel|wanneer|iedereen|niets|veel|weinig|goed|beter|bekijk|lees|maken|kiezen|weten|zien|gaan|komen|staat|staan|heeft|hebben|wordt|worden|kost|kosten|het|een|jouw|deze|die|dat|voor|door|naar|over|bij|uit|aan|tot)\b/gi;

const ZEVEN = { en: NL_IN_EN, es: NL_IN_ES };

/**
 * Nederlandse cijfernotatie is alleen voor het Engels een fout.
 *
 * Het Spaans schrijft 1.495 en 9,7 precies zoals het Nederlands, dus daar valt niets te
 * melden. De punt-variant kijkt naar precies drie cijfers erna en geen vierde, zodat een
 * versienummer of een adres er niet in loopt; de komma-variant vraagt één cijfer aan elke
 * kant, zodat "1,500 people" (Engels duizendtal) erbuiten valt.
 */
const ANDERE_CIJFERS = new Set(["en"]);
const NL_GETAL = /(?<!\d)\d{1,3}\.\d{3}(?!\d)|(?<!\d)\d{1,3},\d(?!\d)/g;

const browser = await chromium.launch();
const pagina = await browser.newPage({
  viewport: { width: 1280, height: 900 },
});

await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const nlPaden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter(
    (p) => !VREEMDE_TALEN.some((t) => p === `/${t}` || p.startsWith(`/${t}/`)),
  )
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

/** De zichtbare tekst per stuk. Een heel `innerText` maakt de melding onleesbaar. */
async function zichtbareTekst() {
  return pagina
    .evaluate(() => {
      const uit = [];
      const loop = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(n) {
            const el = n.parentElement;
            if (!el) return NodeFilter.FILTER_REJECT;
            if (el.closest("script,style,noscript"))
              return NodeFilter.FILTER_REJECT;
            /* De taalwisselaar zegt met `lang` dat hij Nederlands is; die hoort dat ook te
             zijn. Hetzelfde geldt voor een review die als Nederlands is gemarkeerd. */
            if (el.closest("[lang='nl'],[hreflang='nl']"))
              return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );
      let n;
      while ((n = loop.nextNode())) {
        const tekst = (n.nodeValue ?? "").trim();
        if (tekst.length > 2) uit.push(tekst);
      }
      return uit;
    })
    .catch(() => []);
}

function toon(titel, rijen, regel) {
  console.log(`\n${titel}: ${rijen.length}\n`);
  if (rijen.length === 0) {
    console.log("   geen");
    return;
  }
  for (const r of rijen.slice(0, 30)) console.log(regel(r));
  if (rijen.length > 30) console.log(`   … en nog ${rijen.length - 30}`);
}

let totaalFout = 0;

for (const taal of TALEN) {
  const tabel = slugtabel(taal);
  const paden = nlPaden.map((p) => vertaaldPad(p, tabel, taal));
  const zeef = ZEVEN[taal];

  const woordfouten = [];
  const getalfouten = [];
  const metafouten = [];

  for (const pad of paden) {
    const r = await pagina
      .goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" })
      .catch(() => null);
    if (!r || r.status() >= 400) {
      console.log(`   ${r ? r.status() : "geen antwoord"}  ${pad}`);
      totaalFout++;
      continue;
    }

    for (const zin of await zichtbareTekst()) {
      const woorden = [
        ...new Set((zin.match(zeef) ?? []).map((w) => w.toLowerCase())),
      ];
      if (woorden.length) woordfouten.push({ pad, zin, woorden });
      if (ANDERE_CIJFERS.has(taal)) {
        const getallen = [...new Set(zin.match(NL_GETAL) ?? [])];
        if (getallen.length) getalfouten.push({ pad, zin, getallen });
      }
    }

    const velden = await pagina.evaluate(() => ({
      titel: document.title,
      omschrijving:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") ?? "",
      "og:title":
        document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content") ?? "",
      "og:description":
        document
          .querySelector('meta[property="og:description"]')
          ?.getAttribute("content") ?? "",
    }));
    for (const [naam, waarde] of Object.entries(velden)) {
      const woorden = [
        ...new Set((waarde.match(zeef) ?? []).map((w) => w.toLowerCase())),
      ];
      const getallen = ANDERE_CIJFERS.has(taal)
        ? [...new Set(waarde.match(NL_GETAL) ?? [])]
        : [];
      if (woorden.length || getallen.length) {
        metafouten.push({ pad, naam, waarde, woorden, getallen });
      }
    }
  }

  console.log(
    `\n══ ${taal.toUpperCase()} ── ${paden.length} pagina's nagelopen`,
  );
  toon(
    "Nederlandse woorden in de zichtbare tekst",
    woordfouten,
    (f) => `   ${f.pad}\n      [${f.woorden.join(" ")}] ${f.zin.slice(0, 130)}`,
  );
  if (ANDERE_CIJFERS.has(taal)) {
    toon(
      "Nederlandse cijfernotatie in de zichtbare tekst",
      getalfouten,
      (f) =>
        `   ${f.pad}\n      [${f.getallen.join(" ")}] ${f.zin.slice(0, 130)}`,
    );
  }
  toon(
    "Nederlands in titel of omschrijving",
    metafouten,
    (f) =>
      `   ${f.pad} [${f.naam}] ${[...f.woorden, ...f.getallen].join(" ")}\n      ${f.waarde.slice(0, 130)}`,
  );
  totaalFout += woordfouten.length + getalfouten.length + metafouten.length;
}

await browser.close();
console.log("");
process.exit(totaalFout ? 1 : 0);
