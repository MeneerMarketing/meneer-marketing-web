/**
 * Gebruiken de tabbladtitels de ruimte die ze krijgen?
 *
 * WAAROM DIT ERTOE DOET. Google toont ongeveer zestig tekens van een titel, en dat is de
 * eerste en vaak enige regel die iemand van deze site ziet voordat hij kiest. Wat je daar
 * niet gebruikt, gebruikt niemand. "FRAC3 | Diba Clinics" was twintig van die zestig, en
 * wie niet weet wat FRAC3 is, wist het na dat zoekresultaat nog steeds niet. Uit het
 * SEO-rapport van Okan, 15 september 2026: 79 van de 156 Nederlandse pagina's stonden onder
 * de veertig tekens, waarvan 46 behandelpagina's.
 *
 * WAT HIER GEMETEN WORDT.
 *
 *   - Te kort: onder de veertig tekens blijft er ruimte liggen. Dat is geen fout maar een
 *     signaal; sommige titels zijn met recht kort ("Ons team").
 *   - Te lang: boven de zestig kapt Google hem af. Dat mag als alleen " | Diba Clinics" nog
 *     wegvalt — de merknaam missen is niet erg — maar niet als de inhoud sneuvelt.
 *   - Dubbel: twee pagina's met dezelfde titel concurreren in de zoekresultaten met elkaar
 *     in plaats van met de buurman. Dat is wél een fout, en het is de reden dat de halve
 *     regels in `data/titelclaims.ts` met de hand geschreven zijn en niet afgeleid.
 *
 * Alleen dubbele titels laten deze controle vallen. De rest is een lijst om naar te kijken.
 *
 *   BASIS=http://localhost:3021 npm run titels
 */
import { chromium } from "playwright";
import { alleAdressen, taalVanPad } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const KORT = 40;
const LANG = 60;
/* Wat de sjabloon achter elke titel plakt. Valt dat als enige weg, dan is er niets aan de
   hand: iemand die zoekt weet na het lezen van de titel waar hij is. */
const MERK = " | Diba Clinics";

const browser = await chromium.launch();
const pagina = await browser.newPage();
const paden = await alleAdressen(BASIS);

const rijen = [];
for (const pad of paden) {
  try {
    await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" });
    rijen.push({ pad, titel: await pagina.title() });
  } catch {
    /* Een pagina die niet laadt is het probleem van een andere controle. */
  }
}
await browser.close();

const kort = rijen
  .filter((r) => r.titel.length < KORT)
  .sort((a, b) => a.titel.length - b.titel.length);

/* Te lang telt alleen als er meer sneuvelt dan de merknaam. */
const lang = rijen.filter(
  (r) => r.titel.length > LANG && r.titel.length - MERK.length > LANG,
);

/**
 * Dubbel, maar dan binnen één taal.
 *
 * /behandelingen/fotona-4d en /en/treatments/fotona-4d dragen dezelfde titel, en dat is
 * precies goed: het zijn elkaars hreflang-tegenhangers en ze concurreren niet, ze verwijzen
 * naar elkaar. Zonder dit onderscheid meldde deze controle 104 "dubbele" titels die
 * allemaal zo'n paar waren.
 *
 * Draagt een Spaanse pagina de Nederlandse titel, dan is dat een gat in het woordenboek en
 * niet in de titel; daar gaat `npm run vreemdetaal es` over.
 */
const perTitel = new Map();
for (const r of rijen) {
  const sleutel = `${taalVanPad(r.pad)}|${r.titel}`;
  if (!perTitel.has(sleutel))
    perTitel.set(sleutel, { titel: r.titel, paden: [] });
  perTitel.get(sleutel).paden.push(r.pad);
}
const dubbel = [...perTitel.values()]
  .filter((g) => g.paden.length > 1)
  .map((g) => [g.titel, g.paden]);

const gem = rijen.reduce((s, r) => s + r.titel.length, 0) / (rijen.length || 1);
console.log(
  `\n${rijen.length} pagina's, gemiddeld ${gem.toFixed(0)} van de ${LANG} tekens gebruikt.\n`,
);

if (dubbel.length) {
  console.log(
    `DUBBELE TITELS (${dubbel.length}) — deze pagina's beconcurreren elkaar:`,
  );
  for (const [titel, p] of dubbel) {
    console.log(`   "${titel}"`);
    console.log(`      ${p.join(", ")}`);
  }
  console.log("");
}

if (lang.length) {
  console.log(`TE LANG (${lang.length}) — hier valt meer weg dan de merknaam:`);
  for (const r of lang)
    console.log(`   ${r.titel.length}  ${r.titel}  ${r.pad}`);
  console.log("");
}

console.log(`Korter dan ${KORT} tekens: ${kort.length}`);
for (const r of kort.slice(0, 25)) {
  console.log(
    `   ${String(r.titel.length).padStart(3)}  ${r.titel.padEnd(44)} ${r.pad}`,
  );
}
if (kort.length > 25) console.log(`   en nog ${kort.length - 25}.`);

if (dubbel.length) {
  process.exitCode = 1;
} else {
  console.log("\nok — geen twee pagina's delen een titel.");
}
