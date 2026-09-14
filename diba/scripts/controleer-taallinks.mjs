/**
 * Blijft een link in zijn eigen taal?
 *
 * HET LEK. De hele site is in het Nederlands geschreven en verwijst naar Nederlandse
 * adressen. De Engelse kant is diezelfde site met een andere taal en een ander adres, en
 * twee linkcomponenten (`Linktaal` op de server, `Taalpad` in de browser) zetten elk
 * intern adres om. Wie in plaats daarvan een rauwe `<a href="/intake">` schrijft, zet de
 * bezoeker op /en/contact met één klik terug in het Nederlands. Dat is geen kleinigheid:
 * de Engelse pagina waar niemand meer naartoe wees (/en/vacancies/skin-therapist) viel
 * daarmee uit de interne structuur, en dat is precies wat een zoekmachine gebruikt om te
 * bepalen of een pagina ertoe doet.
 *
 * Dit script kijkt op twee plekken, want geen van beide ziet alles:
 *
 *   BRON — elke `<a>` in de bron met een letterlijk intern pad moet door `inTaal` of
 *   `eigenPad`. Dit vindt ook de links die pas na een klik verschijnen, zoals de uitkomst
 *   van de mini-scan; een crawler ziet die nooit.
 *
 *   BROWSER — elke gerenderde pagina, beide kanten op: een Engelse pagina mag geen
 *   Nederlands adres bevatten en andersom. Dit vindt wat de bronregel niet kan zien,
 *   bijvoorbeeld een adres dat uit gegevens komt en nergens letterlijk in een `.tsx` staat.
 *
 * De taalwisselaar is de ene uitzondering: die hoort juist naar de andere kant te wijzen
 * en draagt daarom `hreflang`.
 *
 *   BASIS=http://localhost:3021 npm run taallinks
 *   BRON=1 npm run taallinks     # alleen de bronregel, zonder server
 */
import { chromium } from "playwright";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/* De vreemde talen uit lib/taal.ts, zodat die lijst de enige bron blijft. Met een regex
   en niet met een import: dat bestand is TypeScript en dit script draait op kale node. */
const VREEMDE_TALEN = [
  ...readFileSync("src/lib/taal.ts", "utf8")
    .split("export const VREEMDE_TALEN = [")[1]
    .split("]")[0]
    .matchAll(/"([a-z]{2})"/g),
].map((m) => m[1]);

const taalVanPad = (pad) => {
  const eerste = pad.split("/")[1] ?? "";
  return VREEMDE_TALEN.includes(eerste) ? eerste : "nl";
};

const BASIS = process.env.BASIS ?? "http://localhost:3010";
let fouten = 0;

/* ── 1. De bron: rauwe ankers met een intern pad ────────────────────────── */

function tsxBestanden(map) {
  const uit = [];
  for (const naam of readdirSync(map)) {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) uit.push(...tsxBestanden(pad));
    else if (naam.endsWith(".tsx")) uit.push(pad.replaceAll("\\", "/"));
  }
  return uit;
}

/** Het stuk `<a ... >` vanaf een positie, met de accolades meegeteld. */
function ankerkop(bron, start) {
  let i = start;
  let diepte = 0;
  while (i < bron.length) {
    const c = bron[i];
    if (c === "{") diepte++;
    else if (c === "}") diepte--;
    else if (c === ">" && diepte === 0) break;
    i++;
  }
  return bron.slice(start, i);
}

const bronfouten = [];
for (const bestand of tsxBestanden("src")) {
  const bron = readFileSync(bestand, "utf8");
  for (const m of bron.matchAll(/<a\s/g)) {
    const kop = ankerkop(bron, m.index);
    const hm = kop.match(/href=(\{[\s\S]*?\}|"[^"]*")/);
    if (!hm) continue;
    const href = hm[1];
    /* Een letterlijk pad in de uitdrukking: "/tarieven" of `/huidproblemen/${x}`.
       Een anker (#meten) en een adres buiten de site blijven waar ze zijn. */
    if (!/["`]\/[a-z]/.test(href)) continue;
    if (/\binTaal\(|\beigenPad\(/.test(href)) continue;
    bronfouten.push({
      bestand,
      regel: bron.slice(0, m.index).split("\n").length,
      href: href.replace(/\s+/g, " ").slice(0, 70),
    });
  }
}

console.log("\nBron: rauwe <a> met een intern pad dat niet door inTaal gaat\n");
if (bronfouten.length === 0) {
  console.log("   geen");
} else {
  for (const f of bronfouten) {
    console.log(`   ${f.bestand}:${f.regel}  ${f.href}`);
  }
  fouten += bronfouten.length;
}

if (process.env.BRON) {
  console.log("");
  process.exit(fouten ? 1 : 0);
}

/* ── 2. De browser: wat er echt in de pagina staat ──────────────────────── */

const browser = await chromium.launch();
const pagina = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});

await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const nlPaden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p) => taalVanPad(p) === "nl")
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

/* Elke taal erbij, en niet alleen wat er in de sitemap staat: een taal die nog op
   `noindex` staat hoort juist nagekeken te worden vóórdat hij erin komt. De vertaalde
   adressen leiden we af uit de Nederlandse pagina zelf, want die kent zijn eigen slugs
   niet — die staan in lib/slugs.ts, en dit script draait op kale node. */
const paden = [...nlPaden];
for (const pad of nlPaden) {
  await pagina
    .goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" })
    .catch(() => {});
  const vertaald = await pagina
    .evaluate(() =>
      [...document.querySelectorAll("a[hreflang]")].map(
        (a) => new URL(a.href).pathname,
      ),
    )
    .catch(() => []);
  for (const p of vertaald) if (!paden.includes(p)) paden.push(p);
}
paden.sort();

/** Verzamelt per fout adres op welke pagina's het staat. */
const lek = new Map();

for (const pad of paden) {
  const taal = taalVanPad(pad);
  await pagina
    .goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" })
    .catch(() => {});

  const misser = await pagina
    .evaluate(
      ({ taal, talen }) => {
        const vanPad = (p) => {
          const eerste = p.split("/")[1] ?? "";
          return talen.includes(eerste) ? eerste : "nl";
        };
        const uit = [];
        for (const a of document.querySelectorAll("a[href^='/']")) {
          /* De taalwisselaar wijst met opzet naar de overkant en zegt dat met hreflang. */
          if (a.hasAttribute("hreflang")) continue;
          const p = new URL(a.href).pathname;
          if (vanPad(p) !== taal) uit.push(p);
        }
        return [...new Set(uit)];
      },
      { taal, talen: [...VREEMDE_TALEN] },
    )
    .catch(() => []);

  for (const doel of misser) {
    if (!lek.has(doel)) lek.set(doel, []);
    lek.get(doel).push(pad);
  }
}

await browser.close();

console.log(`\nBrowser: ${paden.length} pagina's nagelopen\n`);
if (lek.size === 0) {
  console.log("   elke link blijft in zijn eigen taal");
} else {
  const op = [...lek.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [doel, paginas] of op) {
    console.log(
      `   ${String(paginas.length).padStart(3)} pagina's  ${doel.padEnd(42)} bv. ${paginas[0]}`,
    );
    fouten++;
  }
}

console.log("");
process.exit(fouten ? 1 : 0);
