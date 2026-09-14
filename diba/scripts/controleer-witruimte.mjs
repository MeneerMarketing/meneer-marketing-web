/**
 * Staat er ergens ruimte gereserveerd die niemand gebruikt?
 *
 * WAT DIT MEET.
 *
 * `min-height` op een tekstblok is een belofte: hier komen N regels. Zolang de tekst die
 * regels vult zie je er niets van. Zodra de copy korter wordt blijft de belofte staan en
 * krijg je een gat. Dat gebeurde: op /huidproblemen/striae stonden twee alinea's van twee
 * regels in een blok van vier, twee keer in twee kaarten naast elkaar. Yasin, 15 september
 * 2026: "waarom zit hier zoveel witruimte?"
 *
 * Deze controle zet van elk element met een `min-height` de reservering even uit, meet hoe
 * hoog het dan werkelijk is, en meldt het verschil als dat meer dan één regel is.
 *
 * WAAROM ÉÉN REGEL MAG.
 *
 * Twee reserveringen zijn zinnig en kunnen niet verlopen: `min-h-[1lh]` op een regel die
 * leeg kan zijn (het merk op een apparatuurkaart) en `min-h-[2lh]` op een kaartkop, want
 * een kop is een of twee regels. Meer dan één lege regel kan daar niet uit komen. Alles
 * daarboven is een geteld getal over lopende tekst, en dat is precies wat verloopt.
 *
 * WAAROM IN DRIE TALEN.
 *
 * Een geteld getal kan hooguit in één taal kloppen. Dezelfde zin is in het Engels korter en
 * in het Spaans langer, dus een reservering die in het Nederlands precies past, staat in de
 * andere twee per definitie verkeerd. Daarom loopt dit over alle talen; zie
 * `scripts/lib/paden.mjs`.
 *
 * DE OPLOSSING IS ZELDEN EEN ANDER GETAL.
 *
 * Is het blok het laatste van de kaart, dan hoeft er niets: rasteritems rekken al tot
 * dezelfde hoogte. Staat er nog iets onder, dan krijgt het blok `grow` of wordt de kaart
 * een subgrid. Beide meten in plaats van te tellen. De uitleg staat in
 * `src/app/(nl)/huidproblemen/striae/page.tsx`.
 *
 *   BASIS=http://localhost:3021 npm run witruimte
 *   ALLES=1 BASIS=... npm run witruimte       (alle bevindingen)
 *   BREEDTE=768 BASIS=... npm run witruimte   (een ander breekpunt)
 */

import { chromium } from "playwright";
import { alleAdressen } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const ALLES = process.env.ALLES === "1";
const BREEDTE = Number(process.env.BREEDTE ?? 1440);

/* Eén lege regel mag. Een halve regel speling erbij, want een blok met een rand of een
   afwijkende regelhoogte komt anders net over de streep. */
const GRENS = 1.5;

const ZOEK = () => {
  const uit = [];
  /* Alleen een reservering in regelhoogtes: `min-h-[4lh]`. Een `min-h-11` op een knop
     gaat over het raakvlak van een vinger en een `min-h-[220px]` op een beeldvlak over de
     verhouding; die horen groter te zijn dan hun inhoud en zijn dus geen bevinding. */
  const REGELMAAT = /(?:^|:)min-h-\[(\d+)lh\]$/;

  for (const el of document.querySelectorAll("*")) {
    const klasse = (typeof el.className === "string" ? el.className : "")
      .split(/\s+/)
      .find((c) => REGELMAAT.test(c));
    if (!klasse) continue;

    const st = getComputedStyle(el);
    const gereserveerd = parseFloat(st.minHeight);
    const regel = parseFloat(st.lineHeight);
    /* Op deze breedte doet het breekpunt niet mee; dan valt er niets te meten. */
    if (!gereserveerd || !regel) continue;

    const oud = el.style.minHeight;
    el.style.minHeight = "0px";
    const gebruikt = el.getBoundingClientRect().height;
    el.style.minHeight = oud;

    const leeg = (gereserveerd - gebruikt) / regel;
    if (leeg <= 0) continue;

    uit.push({
      leeg: Math.round(leeg * 10) / 10,
      regels: Math.round((gereserveerd / regel) * 10) / 10,
      tag: el.tagName.toLowerCase(),
      klasse,
      tekst: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
    });
  }
  return uit;
};

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: BREEDTE, height: 1000 },
});
const pagina = await context.newPage();

const paden = await alleAdressen(BASIS);
const bevindingen = [];

for (const pad of paden) {
  try {
    await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" });
    await pagina.waitForTimeout(120);
    for (const g of await pagina.evaluate(ZOEK)) {
      if (g.leeg >= GRENS) bevindingen.push({ pad, ...g });
    }
  } catch {
    /* Een pagina die niet laadt is het probleem van een andere controle. */
  }
}

await browser.close();

/* Hetzelfde blok staat vaak op tientallen pagina's: het zit in een sjabloon. Groeperen op
   de klasse plus de tekst, zodat de lijst zegt hoeveel plekken er te repareren zijn en niet
   hoeveel pagina's er zijn. */
const groepen = new Map();
for (const b of bevindingen) {
  const sleutel = `${b.klasse}|${b.tekst}`;
  const g = groepen.get(sleutel) ?? { ...b, paden: [] };
  g.paden.push(b.pad);
  groepen.set(sleutel, g);
}
const lijst = [...groepen.values()].sort((a, b) => b.leeg - a.leeg);

console.log(
  `\n${paden.length} pagina's nagelopen op ${BREEDTE} pixels breed.\n`,
);

if (lijst.length === 0) {
  console.log("ok — nergens staat meer dan een lege regel gereserveerd.");
} else {
  console.log(
    `${lijst.length} blok(ken) met te veel gereserveerde ruimte, samen ${bevindingen.length} keer op de site.\n`,
  );
  for (const g of ALLES ? lijst : lijst.slice(0, 30)) {
    console.log(
      `  ${String(g.leeg).padStart(4)} lege regels van ${g.regels}  <${g.tag}> ${g.klasse}`,
    );
    console.log(`        "${g.tekst}"`);
    console.log(
      `        ${g.paden.slice(0, 3).join(", ")}${g.paden.length > 3 ? ` en nog ${g.paden.length - 3}` : ""}`,
    );
  }
  if (!ALLES && lijst.length > 30) {
    console.log(`\n  en nog ${lijst.length - 30}. ALLES=1 toont ze allemaal.`);
  }
  process.exitCode = 1;
}
