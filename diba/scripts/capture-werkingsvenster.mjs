/**
 * Schiet het werkingsvenster in alle drie de standen, voor elk mechaniek.
 *
 * Zeven mechanieken maal drie stappen: als er één stand niet klopt, zie je dat hier en
 * niet pas als iemand op de site staat te kijken.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const UIT = "scratch/werkingsvenster";

/** Eén apparaat per mechaniek, zodat alle zeven tekeningen langskomen. */
const PROEF = [
  ["eve-m", "meten"],
  ["fotona", "licht"],
  ["skinpen-cit", "naald"],
  ["peelinglijnen", "chemisch"],
  ["hydrafacial-syndeo", "zuiging"],
  ["coolifting", "kou"],
  ["u225", "injectie"],
];

mkdirSync(UIT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problemen = [];

for (const [slug, mechaniek] of PROEF) {
  await page.goto(`${BASIS}/apparatuur/${slug}`, { waitUntil: "networkidle" });

  const venster = page.locator("svg[aria-label*='Doorsnede']").first();
  await venster.waitFor();
  const kaart = page.locator("svg[aria-label*='Doorsnede']").locator("xpath=../..");

  // Vlaggen mogen nooit op het scherm staan.
  const tekst = await page.locator("main").innerText();
  const vlaggen = tekst.match(/\[[A-Z-]+\]/g);
  if (vlaggen) problemen.push(`${slug}: vlag zichtbaar ${vlaggen.join(", ")}`);

  const stappen = page.locator("ol li button");
  const aantal = await stappen.count();
  if (aantal !== 3) problemen.push(`${slug}: ${aantal} stappen in plaats van 3`);

  for (let i = 0; i < aantal; i++) {
    await stappen.nth(i).click();
    await page.waitForTimeout(1100);
    await kaart.screenshot({ path: `${UIT}/${mechaniek}-${slug}-stap${i + 1}.png` });
  }

  // Na een klik moet het uit zichzelf stil blijven staan.
  const voor = await venster.getAttribute("aria-label");
  await page.waitForTimeout(4200);
  const na = await venster.getAttribute("aria-label");
  if (voor !== na) problemen.push(`${slug}: loopt door na een klik (${voor} → ${na})`);
}

// Het overzicht: filteren en de as.
await page.goto(`${BASIS}/apparatuur`, { waitUntil: "networkidle" });
const as = page.locator("main section").nth(2);
await as.screenshot({ path: `${UIT}/overzicht-as.png` });

const chips = page.getByRole("group", { name: "Filter op mechaniek" }).getByRole("button");
await chips.nth(2).click();
await page.waitForTimeout(600);
await as.screenshot({ path: `${UIT}/overzicht-as-gefilterd.png` });

const rijenNa = await page.locator("main ul li a[href^='/apparatuur/']").count();
if (rijenNa === 0) problemen.push("overzicht: filter laat niets over");

const breed = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
if (breed > 0) problemen.push(`overzicht: ${breed}px horizontale overloop`);

await browser.close();

if (problemen.length) {
  console.error("PROBLEMEN:\n" + problemen.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`ok — ${PROEF.length * 3 + 2} beelden in ${UIT}`);
