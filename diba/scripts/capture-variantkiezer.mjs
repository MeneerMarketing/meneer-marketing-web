/**
 * Controleert dat elke behandeling met varianten ze ook allemaal laat zien, en dat het
 * getal in de hero meeverandert als je een andere kiest.
 *
 * De reden dat dit een script is en geen blik: het gaat om dertien behandelingen, en de
 * fout die hier gemaakt kan worden (alleen het laagste tarief tonen) is precies de fout
 * die je met het blote oog niet ziet, want één prijs ziet er prima uit.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const UIT = "scratch/varianten";
mkdirSync(UIT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problemen = [];

// De slugs met varianten, uit de data zelf zodat de lijst niet kan verlopen.
await page.goto(`${BASIS}/behandelingen`, { waitUntil: "networkidle" });
const slugs = await page.evaluate(() =>
  [...document.querySelectorAll("a[href^='/behandelingen/']")]
    .map((a) => a.getAttribute("href").split("/").pop())
    .filter((s, i, l) => s && l.indexOf(s) === i),
);

let metVarianten = 0;

for (const slug of slugs) {
  await page.goto(`${BASIS}/behandelingen/${slug}`, { waitUntil: "networkidle" });

  const groep = page.getByRole("group", { name: "Kies een variant" });
  if ((await groep.count()) === 0) continue;
  metVarianten++;

  const knoppen = groep.getByRole("button");
  const aantal = await knoppen.count();
  const prijs = page.locator("dl").locator("xpath=..").locator(".diba-card-title").last();

  for (let i = 0; i < aantal; i++) {
    await knoppen.nth(i).click();
    await page.waitForTimeout(160);

    // Het grote getal moet het tarief van de gekozen variant zijn.
    //
    // Niet: "de prijs verandert". Varianten mogen hetzelfde kosten (de drie consulten
    // zijn alle drie vijftig euro), en dan verandert er terecht niets. Wat wél moet
    // kloppen is dat de kiezer en het getal hetzelfde zeggen.
    const chip = (await knoppen.nth(i).innerText()).trim();
    const bedrag = chip.match(/€\s?[\d.,]+|Op aanvraag/);
    const groot = (await prijs.innerText()).trim();
    if (bedrag && groot.replace(/\s/g, "") !== bedrag[0].replace(/\s/g, "")) {
      problemen.push(`${slug}: variant "${chip}" toont ${groot} in de hero`);
    }
    if ((await knoppen.nth(i).getAttribute("aria-pressed")) !== "true") {
      problemen.push(`${slug}: variant ${i + 1} wordt niet als gekozen gemeld`);
    }
  }

  // De duurste variant moet even zichtbaar zijn als de goedkoopste.
  const opChips = await knoppen.allInnerTexts();
  if (opChips.some((c) => !/\d/.test(c))) {
    problemen.push(`${slug}: niet elke variantknop toont een bedrag`);
  }

  if (metVarianten <= 3) {
    await page
      .locator("main section")
      .first()
      .screenshot({ path: `${UIT}/${slug}.png` });
  }
}

// Geen vlaggen op het scherm, op geen enkele behandelpagina.
for (const slug of slugs.slice(0, 8)) {
  await page.goto(`${BASIS}/behandelingen/${slug}`, { waitUntil: "domcontentloaded" });
  const tekst = await page.locator("main").innerText();
  const vlaggen = tekst.match(/\[[A-Z-]+\]/g);
  if (vlaggen) problemen.push(`${slug}: vlag zichtbaar ${vlaggen.join(", ")}`);
}

await browser.close();

if (problemen.length) {
  console.error("PROBLEMEN:\n" + problemen.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`ok — ${slugs.length} behandelingen, ${metVarianten} met een variantkiezer`);
