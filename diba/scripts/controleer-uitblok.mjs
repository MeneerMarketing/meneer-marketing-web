/**
 * Valt er ergens tekst buiten zijn eigen vlak?
 *
 * Yasin, 11 september 2026: "op de acnepagina loopt dat knopje met verhoorning uit zijn blok
 * op mobiel omdat de tekst te lang is. Zulke foutjes wil ik niet meer zien; kun je zulke
 * dingen nalopen?"
 *
 * WAT DIT VANGT, EN WAAROM DE ANDERE CONTROLES HET LIETEN LOPEN.
 *
 * `controleer-knoppen` kijkt naar opschriften die over twee regels vallen, en dat is een
 * ander gebrek: daar wordt de tekst afgebroken, hier steekt hij aan de zijkant naar buiten.
 * Een woord van honderd pixels in een vak van zeventig loopt gewoon door over de rand van
 * het gekleurde vlak heen. Het valt op als slordig zonder dat je kunt zeggen waarom.
 *
 * `controleer-mobiel` meet of de hele pagina opzij schuift. Dit soort uitsteeksel doet dat
 * niet: het vak eromheen blijft netjes binnen het scherm, alleen de letters niet.
 *
 * TWEE VORMEN.
 *
 *   steekt uit     de inhoud is breder dan het element (`scrollWidth > clientWidth`)
 *   buiten de rand het element zelf steekt voorbij de rand van zijn ouder
 *
 * WAT ER NIET IN THUISHOORT.
 *
 * Tekst die met opzet wordt afgekapt: `truncate` (drie puntjes) en `line-clamp` (een vast
 * aantal regels). Dat zijn ontwerpkeuzes met een bedoeling, en de naam staat er dan volledig
 * bij in een `title` of eronder. Ook overgeslagen: elementen met een negatieve marge, want
 * dat is de manier waarop een rij hier bewust breder wordt gemaakt dan zijn kolom, en alles
 * in een eigen scrollvlak, want daar hóórt de inhoud breder te zijn dan het vak.
 *
 *   BASIS=http://localhost:3021 npm run uitblok
 *   ALLES=1 BASIS=... npm run uitblok
 */
import { chromium } from "playwright";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const ALLES = process.env.ALLES === "1";
const BREEDTES = [375, 768, 1440];

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 375, height: 812 } });

await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

const meet = () => {
  const uit = [];
  /* Zit er tussen dit stukje tekst en het vak dat we meten iets dat wegknipt of schuift?
     Dan zegt de plek van die letters niets: ze worden opgeruimd voordat je ze ziet. Zonder
     deze stap meldde de controle elke ankerbalk en elke afgekapte merknaam. */
  const geknipt = (van, tot) => {
    for (let p = van; p && p !== tot; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return true;
      if (s.textOverflow === "ellipsis") return true;
    }
    return false;
  };

  const inScrollvlak = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  };

  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(el);
    if (s.position === "fixed" || s.visibility === "hidden") continue;
    if (s.textOverflow === "ellipsis") continue;
    if (s.webkitLineClamp && s.webkitLineClamp !== "none") continue;
    if (inScrollvlak(el)) continue;

    /* Alleen korte, kleine dingen: opschriften, chips, labels, prijzen. Dat is de klasse
       waar dit misgaat. Een veegrij of een schuivende reviewband is per definitie breder
       dan zijn vak, en een alinea die uitsteekt bestaat niet: die loopt om. */
    const ruw = (el.innerText || "").trim().replace(/\s+/g, " ");
    if (!ruw || ruw.length > 60) continue;
    if (r.height > 120 || r.width > 420) continue;
    // Een eigen scrollvlak: daar hoort de inhoud breder te zijn dan het vak.
    if (/(auto|scroll)/.test(s.overflowX)) continue;
    const tekst = ruw.slice(0, 44);

    /* Steken de letters zelf buiten het vak uit? Gemeten aan de tekst en niet aan
       `scrollWidth`: dat getal wordt onbetrouwbaar zodra een element een negatieve marge
       met een even grote vulling combineert, en dat is hier de manier waarop een rij zijn
       hovervlak tot buiten de kolom laat lopen. Twintig valse meldingen, nul echte. */
    const loper = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let uiterst = -Infinity;
    let knoop = loper.nextNode();
    while (knoop) {
      if (knoop.nodeValue.trim() && !geknipt(knoop.parentElement, el)) {
        const bereik = document.createRange();
        bereik.selectNodeContents(knoop);
        for (const tr of bereik.getClientRects()) {
          if (tr.width > 0) uiterst = Math.max(uiterst, tr.right);
        }
      }
      knoop = loper.nextNode();
    }
    /* Vier pixels speling. Gemeten op een knop die er met het oog goed uitziet: de "›"
       steekt vier pixels voorbij zijn eigen letterbreedte, want de inkt van een glyph en
       de ruimte die hij inneemt zijn niet hetzelfde. Onder die grens meet je het lettertype
       en niet de opmaak. */
    const binnenrand = r.right - (parseFloat(s.paddingRight) || 0);
    if (uiterst > binnenrand + 4) {
      uit.push({
        soort: "steekt uit",
        over: Math.round(uiterst - binnenrand),
        tekst,
      });
      continue;
    }

    const ouder = el.parentElement;
    if (!ouder) continue;
    if (parseFloat(s.marginLeft) < 0 || parseFloat(s.marginRight) < 0) continue;
    /* Met de hand neergezet, dus het staat waar het hoort: de schakels op de rand van de
       krabcirkel, en het onzichtbare veld tegen scripts in het contactformulier. */
    if (s.position === "absolute") continue;
    const o = ouder.getBoundingClientRect();
    const over = Math.round(Math.max(r.right - o.right, o.left - r.left));
    if (over > 2) uit.push({ soort: "buiten de rand", over, tekst });
  }
  return uit;
};

const bevindingen = [];
for (const breedte of BREEDTES) {
  await pagina.setViewportSize({ width: breedte, height: 900 });
  for (const pad of paden) {
    await pagina
      .goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" })
      .catch(() => {});
    const weiger = pagina.locator("[data-cookiebalk] button").first();
    if (await weiger.count().catch(() => 0))
      await weiger.click().catch(() => {});
    const fouten = await pagina.evaluate(meet).catch(() => []);
    for (const f of fouten) bevindingen.push({ pad, breedte, ...f });
  }
}

await browser.close();

const groepen = new Map();
for (const b of bevindingen) {
  const sleutel = `${b.breedte}|${b.soort}|${b.tekst}`;
  const g = groepen.get(sleutel) ?? { ...b, paden: [] };
  g.over = Math.max(g.over, b.over);
  g.paden.push(b.pad);
  groepen.set(sleutel, g);
}
const lijst = [...groepen.values()].sort((a, b) => b.over - a.over);

console.log("");
console.log(
  `${paden.length} pagina's, gemeten op ${BREEDTES.join(", ")} pixels breed.`,
);
console.log("");
if (lijst.length === 0) {
  console.log("ok — nergens tekst buiten zijn vlak.");
} else {
  console.log(`${lijst.length} plek(ken) waar tekst buiten zijn vlak valt.`);
  console.log("");
  for (const g of ALLES ? lijst : lijst.slice(0, 25)) {
    console.log(
      `   ${String(g.over).padStart(4)}px  ${g.breedte}px  ${g.soort}  "${g.tekst}"`,
    );
    console.log(
      `          ${g.paden.slice(0, 3).join(", ")}${g.paden.length > 3 ? ` en nog ${g.paden.length - 3}` : ""}`,
    );
  }
  if (!ALLES && lijst.length > 25) {
    console.log(
      `   … en nog ${lijst.length - 25}. Draai met ALLES=1 voor alles.`,
    );
  }
}
console.log("");
