/**
 * Hangt alles aan elkaar?
 *
 * De site heeft vier soorten pagina's die over hetzelfde gaan vanuit een andere hoek: een
 * huidprobleem, de behandeling ervoor, het apparaat waarop die draait, en soms een pagina
 * die geen van drieën is (snurken, PCOS). Iemand komt binnen op een willekeurige van de
 * vier en moet vandaar de andere drie kunnen vinden.
 *
 * Dit script loopt de gerenderde site af en telt per pagina naar welke soorten hij wijst.
 * Wat het aanwijst zijn de doodlopende einden: een behandelpagina die naar geen enkel
 * huidprobleem wijst, of een apparaat waar je alleen maar vandaan komt.
 *
 *   BASIS=http://localhost:3021 npm run links
 */
import { chromium } from "playwright";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/** Waar hoort een pad bij? */
function soort(pad) {
  if (pad.startsWith("/huidproblemen/")) return "huidprobleem";
  if (pad.startsWith("/behandelingen/")) return "behandeling";
  if (pad.startsWith("/apparatuur/")) return "apparaat";
  if (pad.startsWith("/vergoedingen/")) return "vergoeding";
  if (pad.startsWith("/doelgroep/")) return "doelgroep";
  return "overig";
}

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

const uit = new Map(); // pad -> Set van doelen
const naar = new Map(); // pad -> aantal pagina's dat ernaar wijst

for (const pad of paden) {
  await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" }).catch(() => {});

  /* Alleen links in de inhoud. De kop- en voettekst staan op elke pagina en zeggen dus
     niets over of déze pagina ergens heen wijst. */
  const doelen = await pagina
    .evaluate(() =>
      [...document.querySelectorAll("main a[href^='/']")]
        .map((a) => new URL(a.href).pathname)
        .filter((p, i, arr) => arr.indexOf(p) === i),
    )
    .catch(() => []);

  uit.set(pad, new Set(doelen.filter((d) => d !== pad)));
  for (const d of doelen) if (d !== pad) naar.set(d, (naar.get(d) ?? 0) + 1);
}

await browser.close();

/* ── Wat wijst waarheen ─────────────────────────────────────────────────── */
const SOORTEN = ["huidprobleem", "behandeling", "apparaat"];

console.log("\nPer paginasoort: naar hoeveel van de andere soorten wordt gewezen\n");
for (const s of SOORTEN) {
  const paginas = paden.filter((p) => soort(p) === s);
  const gaten = [];
  for (const p of paginas) {
    const doelSoorten = new Set([...uit.get(p)].map(soort));
    const mist = SOORTEN.filter((x) => x !== s && !doelSoorten.has(x));
    if (mist.length) gaten.push({ pad: p, mist });
  }
  console.log(
    `${s} (${paginas.length} pagina's): ${paginas.length - gaten.length} wijzen naar alle andere soorten`,
  );
  for (const g of gaten) console.log(`   ${g.pad}  mist: ${g.mist.join(", ")}`);
  console.log("");
}

/* ── Waar komt niemand ──────────────────────────────────────────────────── */
const wees = paden.filter((p) => p !== "/" && !naar.has(p));
console.log(`Pagina's waar geen enkele andere pagina naar wijst: ${wees.length}`);
for (const p of wees) console.log("   " + p);

const dun = paden.filter((p) => p !== "/" && (naar.get(p) ?? 0) === 1);
console.log(`\nPagina's met maar een verwijzing: ${dun.length}`);
for (const p of dun) console.log("   " + p);
