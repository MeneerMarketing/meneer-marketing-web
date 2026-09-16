/**
 * Plakt er ergens tekst tegen de bovenrand van een sectie?
 *
 * WAT YASIN ZAG. Op /apparatuur/gentlemax-pro begon het witte vlak onder de donkergroene
 * hero meteen met het label "WAARVOOR WE HET INZETTEN", zonder een millimeter lucht.
 * 15 september 2026: "tekst zit geplakt aan de bovenkant van de sectie."
 *
 * WAAROM DAT GEEN SLORDIGHEID WAS MAAR EEN REDENERING DIE NET NIET KLOPTE. De secties op
 * die pagina dragen alleen ónderruimte. Dat is met opzet: twee witte secties naast elkaar
 * met allebei hun eigen lucht geven een gat van 192 pixels, en dat leest als een fout in de
 * pagina. Alleen gaat die redenering niet op voor de eerste sectie na een gekleurd vlak: de
 * onderruimte van de hero zit bínnen het groen, dus daar bleef er nul over.
 *
 * WAT HIER GEMETEN WORDT. Niet de padding — die zegt niets, want de helft van de secties
 * zet zijn lucht op een div erbinnen. Wel de afstand van de bovenrand van de sectie tot de
 * eerste tekst die erin staat, en alleen daar waar de achtergrondkleur op die naad
 * verandert. Verandert hij niet, dan levert de buurman de lucht en is nul juist goed.
 *
 *   BASIS=http://localhost:3021 npm run secties
 *   BREEDTE=375 BASIS=... npm run secties
 *   GRENS=120 BASIS=... npm run secties   (ruimer, om te zien wat de krapste naden zijn)
 */
import { chromium } from "playwright";
import { alleAdressen } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const BREEDTE = Number(process.env.BREEDTE ?? 1440);

/* Onder deze afstand plakt tekst zichtbaar tegen de rand. Een regel tekst is op deze site
   ruim twintig pixels hoog, dus vierentwintig is krap maar niet gek. */
const GRENS = Number(process.env.GRENS ?? 24);

const ZOEK = (GRENS) => {
  /** De kleur die je op deze plek ziet: doorzichtig betekent dat je de ouder ziet. */
  const kleur = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== "transparent" && !/rgba\(0, 0, 0, 0\)/.test(c)) return c;
      n = n.parentElement;
    }
    return "wit";
  };

  /** Het eerste stukje zichtbare tekst binnen een knoop, met zijn positie. */
  const eersteTekst = (wortel) => {
    const loop = document.createTreeWalker(wortel, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = loop.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      const ouder = n.parentElement;
      if (!ouder || ouder.closest("script, style, noscript")) continue;
      const st = getComputedStyle(ouder);
      if (st.display === "none" || st.visibility === "hidden") continue;
      const r = document.createRange();
      r.selectNode(n);
      const doos = r.getBoundingClientRect();
      if (doos.height === 0) continue;
      return { top: doos.top, tekst: n.nodeValue.replace(/\s+/g, " ").trim() };
    }
    return null;
  };

  const uit = [];
  for (const sectie of document.querySelectorAll("main section")) {
    const doos = sectie.getBoundingClientRect();
    if (doos.height < 40) continue;

    /* Wat er direct boven staat. Zonder buur is er niets om tegenaan te plakken. */
    const vorige = sectie.previousElementSibling;
    if (!vorige || vorige.getBoundingClientRect().height < 4) continue;

    /* Verandert de kleur op deze naad? Zo niet, dan hoort de lucht bij de buurman. */
    if (kleur(sectie) === kleur(vorige)) continue;

    const eerste = eersteTekst(sectie);
    if (!eerste) continue;

    const lucht = Math.round(eerste.top - doos.top);
    if (lucht >= GRENS) continue;

    uit.push({
      id: sectie.id || "",
      lucht,
      tekst: eerste.tekst.slice(0, 50),
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
    await pagina.waitForTimeout(100);
    for (const g of await pagina.evaluate(ZOEK, GRENS))
      bevindingen.push({ pad, ...g });
  } catch {
    /* Een pagina die niet laadt is het probleem van een andere controle. */
  }
}

await browser.close();

/* Hetzelfde blok staat vaak op tientallen pagina's: het zit in een sjabloon. */
const groepen = new Map();
for (const b of bevindingen) {
  const sleutel = `${b.id}|${b.tekst}`;
  const g = groepen.get(sleutel) ?? { ...b, paden: [] };
  g.paden.push(b.pad);
  groepen.set(sleutel, g);
}
const lijst = [...groepen.values()].sort((a, b) => a.lucht - b.lucht);

console.log(
  `\n${paden.length} pagina's nagelopen op ${BREEDTE} pixels breed.\n`,
);

if (lijst.length === 0) {
  console.log(
    "ok — nergens plakt tekst tegen de bovenrand van een sectie met een eigen kleur.",
  );
} else {
  console.log(
    `${lijst.length} sectie(s) waar de tekst tegen de bovenrand plakt, samen ${bevindingen.length} keer:\n`,
  );
  for (const g of lijst) {
    console.log(
      `  ${String(g.lucht).padStart(3)} px lucht  ${g.id ? `#${g.id}  ` : ""}"${g.tekst}"`,
    );
    console.log(
      `        ${g.paden.slice(0, 3).join(", ")}${g.paden.length > 3 ? ` en nog ${g.paden.length - 3}` : ""}`,
    );
  }
  process.exitCode = 1;
}
