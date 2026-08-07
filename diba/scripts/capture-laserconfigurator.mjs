/**
 * Controleert de laserconfigurator nu er twee prijslijsten zijn.
 *
 * De fout die hier kan ontstaan is niet zichtbaar met het blote oog: bedragen van de ene
 * lijst naast zonenamen van de andere. Alles ziet er dan prima uit en alles klopt niet.
 * Vandaar dat dit script de bedragen tegen de brondata aanlegt en niet tegen zichzelf.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const PAD = "/laserontharing/configurator";
const UIT = "scratch/laser";
mkdirSync(UIT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const problemen = [];

await page.goto(BASIS + PAD, { waitUntil: "networkidle" });

const lijstKnoppen = page.getByRole("group", { name: "Prijslijst" }).getByRole("button");
if ((await lijstKnoppen.count()) !== 2) {
  problemen.push("prijslijstkeuze ontbreekt of heeft niet twee knoppen");
}

/** De zonelijst naast de tekening, met naam en bedrag per knop. */
async function zoneRegels() {
  return page.evaluate(() =>
    [...document.querySelectorAll("main ul li button")]
      .map((b) => b.innerText.replace(/\n+/g, " | ").trim())
      .filter((s) => /€|Nog niet bekend|Zit er al in/.test(s)),
  );
}

/**
 * De zonelijst hoort bij het gekozen aanzicht. Voorhoofd staat pas in de lijst als je
 * naar het gezicht kijkt; mijn eerste versie van dit script vergeleek de gezichtszones
 * met het vooraanzicht en riep terecht dat voorhoofd ontbrak.
 */
async function naarGezicht() {
  await page.getByRole("tab", { name: /gezicht/i }).click();
  await page.waitForTimeout(300);
}

const damesRegels = await zoneRegels();
if (damesRegels.length === 0) problemen.push("geen zones zichtbaar op de damespagina");

await naarGezicht();
const damesGezicht = await zoneRegels();

// Naar heren: de bedragen moeten mee veranderen.
await lijstKnoppen.nth(1).click();
await page.waitForTimeout(400);
await naarGezicht();
const herenGezicht = await zoneRegels();
await page.getByRole("tab", { name: /voor/i }).first().click();
await page.waitForTimeout(300);
const herenRegels = await zoneRegels();

const damesVoorhoofd = damesGezicht.find((r) => r.startsWith("Voorhoofd"));
const herenVoorhoofd = herenGezicht.find((r) => r.startsWith("Voorhoofd"));
if (!damesVoorhoofd || !herenVoorhoofd) {
  problemen.push("voorhoofd staat niet op beide lijsten");
} else if (damesVoorhoofd === herenVoorhoofd) {
  problemen.push(`voorhoofd kost op beide lijsten hetzelfde: ${damesVoorhoofd}`);
}

// Heren hebben geen benen of bikinilijn op hun tarievenlijst.
const herenTekst = herenRegels.join(" ");
for (const verboden of ["Bikinilijn", "Onderbenen", "Bovenbenen"]) {
  if (herenTekst.includes(verboden)) {
    problemen.push(`${verboden} staat op de herenlijst maar niet in de tarieven`);
  }
}

// De prijslijst hoort in de URL, anders opent een gedeelde link op de andere lijst.
if (!page.url().includes("lijst=heren")) {
  problemen.push(`prijslijst staat niet in de URL: ${page.url()}`);
}

// Wisselen wist de keuze.
await lijstKnoppen.nth(0).click();
await page.waitForTimeout(300);
const eersteZone = page.locator("main ul li button").first();
await eersteZone.click();
await page.waitForTimeout(300);
const naKeuze = await page.locator("aside").innerText();
if (!/€/.test(naKeuze)) problemen.push("opbouw toont geen bedrag na een keuze");

await lijstKnoppen.nth(1).click();
await page.waitForTimeout(400);
const naWissel = await page.locator("aside").innerText();
if (naWissel.includes("€") && !/€\s?0|Nog niet/.test(naWissel)) {
  const subtotaal = naWissel.match(/€\s?[\d.]+/);
  if (subtotaal && subtotaal[0].replace(/\D/g, "") !== "0") {
    problemen.push(`na wisselen van lijst staat er nog een bedrag: ${subtotaal[0]}`);
  }
}

// Geen vlaggen, en de voorlopig-melding hoort weg te zijn.
await lijstKnoppen.nth(0).click();
await page.waitForTimeout(300);
const tekst = await page.locator("main").innerText();
const vlaggen = tekst.match(/\[[A-Z-]+[^\]]*\]/g);
if (vlaggen) problemen.push(`vlag zichtbaar: ${vlaggen.join(", ")}`);
if (tekst.includes("voorlopig")) {
  problemen.push("de melding over voorlopige bedragen staat er nog");
}

// Een pakket moet de losse zones die het dekt uit de opbouw halen.
const pakketKnop = page.getByRole("button", { name: /Pakket A/ }).first();
if ((await pakketKnop.count()) > 0) {
  await pakketKnop.click();
  await page.waitForTimeout(300);
  const opbouw = await page.locator("aside").innerText();
  if (!/Pakket A/i.test(opbouw)) problemen.push("pakket A komt niet in de opbouw");
}

await page.screenshot({ path: `${UIT}/configurator-dames.png`, fullPage: false });
await lijstKnoppen.nth(1).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${UIT}/configurator-heren.png`, fullPage: false });

await browser.close();

if (problemen.length) {
  console.error("PROBLEMEN:\n" + problemen.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}
console.log(
  `ok — ${damesRegels.length} zones dames, ${herenRegels.length} zones heren`,
);
