/**
 * Wat staat er op de Engelse kant nog in het Nederlands?
 *
 * Zet de Engelse pagina naast zijn Nederlandse tegenhanger en vergelijkt de zichtbare
 * tekst. Wat op allebei precies hetzelfde is, is niet vertaald. Eigennamen en getallen
 * vallen af, want die horen hetzelfde te blijven.
 *
 *   BASIS=http://localhost:3021 npm run vertaalstand
 *   BASIS=... PAD=/behandelingen/hydrafacial npm run vertaalstand   (één pagina, met lijst)
 */
import { chromium } from "playwright";

const BASIS = process.env.BASIS ?? "http://localhost:3021";
const ALLEEN = process.env.PAD ?? "";

/* Wat hetzelfde hoort te blijven: merknamen, apparaten, eigennamen, losse getallen. */
const ZELFDE =
  /^(diba clinics|hydrafacial|skinpen|dermapen|nordlys|fotona|gentlemax pro|eve-m|cosmelan|dermamelan|oxygeneo|salonized|anbos|nvh|pcos|led|ipl|whatsapp|instagram|tiktok|facebook|rotterdam|contact|reviews|signature|deluxe|platinum|nederlands|english|español|français|pronto|bientôt|home|fotona timewalker|dermapen 4|skinpen cit|peelinglijnen|hydrafacial syndeo|u225|dermaplane pro|precision photonic system|nordlys ipl|eve-m|meneer marketing|weissenbruchlaan 166|[\d\s.,:+€%-]+)$/i;

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1280, height: 900 } });

/** De zichtbare tekst van een pagina, als lijst losse stukken. */
async function teksten(url) {
  await pagina.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await pagina.waitForTimeout(250);
  return pagina.evaluate(() => {
    const uit = [];
    const loop = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = loop.nextNode())) {
      const ouder = n.parentElement;
      if (!ouder) continue;
      if (ouder.closest("script, style, noscript")) continue;
      const s = getComputedStyle(ouder);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const tekst = (n.textContent ?? "").replace(/\s+/g, " ").trim();
      if (tekst.length > 2) uit.push(tekst);
    }
    return uit;
  });
}

/* Welke paren er zijn: elke Engelse pagina met zijn Nederlandse tegenhanger. */
await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
let paden = [...(await pagina.content()).matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p) => !p.startsWith("/en"))
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();
if (ALLEEN) paden = [ALLEEN];

let totaal = 0;
let open = 0;
const perPad = [];

for (const pad of paden) {
  const nl = await teksten(`${BASIS}${pad}`);
  const en = await teksten(`${BASIS}${pad === "/" ? "/en" : `/en${pad}`}`);
  if (!en.length) continue;

  const nlSet = new Set(nl);
  const nietVertaald = [];
  for (const stuk of new Set(en)) {
    if (!nlSet.has(stuk)) continue;
    if (ZELFDE.test(stuk)) continue;
    nietVertaald.push(stuk);
  }
  const alles = [...new Set(en)].filter((s) => !ZELFDE.test(s));
  /* Een pagina die niets opleverde is niet klaar maar niet gemeten: dat gebeurt als hij
     net niet geladen was. Zonder deze regel telde hij als honderd procent, en dat gaf een
     te mooi beeld. */
  if (alles.length === 0) continue;
  totaal += alles.length;
  open += nietVertaald.length;
  perPad.push({ pad, open: nietVertaald.length, alles: alles.length, nietVertaald });
}

await browser.close();

const klaar = totaal - open;
console.log(
  `\n${perPad.length} pagina's naast elkaar gelegd.\n` +
    `${klaar} van de ${totaal} zichtbare teksten staan in het Engels (${Math.round((klaar / Math.max(1, totaal)) * 100)}%).\n`,
);

if (ALLEEN) {
  for (const r of perPad) {
    console.log(`${r.pad}: ${r.open} nog Nederlands van ${r.alles}\n`);
    for (const s of r.nietVertaald) console.log(`   ${s}`);
  }
} else {
  perPad.sort((a, b) => b.open - a.open);
  console.log("De pagina's met het meeste werk:\n");
  for (const r of perPad.slice(0, 20)) {
    const pct = Math.round(((r.alles - r.open) / Math.max(1, r.alles)) * 100);
    console.log(`  ${String(r.open).padStart(4)} open  ${String(pct).padStart(3)}% klaar  ${r.pad}`);
  }
  const af = perPad.filter((r) => r.open === 0);
  console.log(`\n${af.length} pagina's zijn helemaal vertaald.`);
  if (af.length) console.log("  " + af.map((r) => r.pad).join(", "));
}
