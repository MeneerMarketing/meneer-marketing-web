/**
 * Loopt de keten af die Yasin beschreef: mini-scan op de homepage, profiel onthouden,
 * behandelingen geordend op dat profiel.
 *
 * Dit is met opzet één doorlopende sessie in één browser en geen drie losse controles.
 * De fout die hier kan zitten is niet dat een van de drie stukken stuk is, maar dat het
 * doorgeven ertussen niet werkt: de opslagsleutel die verandert, een profiel dat op de
 * server leeg is en bij hydratatie de gekozen antwoorden wegduwt, of een knop die pas
 * verschijnt na een harde herlaadbeurt. Dat zie je alleen door het echt te lopen.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const UIT = "scratch/keten";
mkdirSync(UIT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const problemen = [];

await page.goto(BASIS, { waitUntil: "networkidle" });

/* De cookiebalk ligt over de onderkant en ving eerder taps af. Eerst wegklikken. */
const cookie = page.getByRole("button", { name: /akkoord/i }).first();
if ((await cookie.count()) > 0) {
  await cookie.click();
  await page.waitForTimeout(300);
}

await page
  .getByText(/Mini-scan/i)
  .first()
  .scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const startKnop = page.getByRole("button", { name: /^(Begin|Start)/i }).first();
if ((await startKnop.count()) === 0) {
  problemen.push("geen startknop voor de mini-scan gevonden");
} else {
  await startKnop.click();
  await page.waitForTimeout(400);

  /* Vier vragen, telkens de eerste optie. Radio's, geen knoppen: dat was eerder een
     valse melding in een ander script. */
  for (let v = 0; v < 6; v++) {
    const opties = page.getByRole("radio");
    if ((await opties.count()) === 0) break;
    await opties.first().click();
    await page.waitForTimeout(450);
  }
  await page.waitForTimeout(2500); // de scanfase loopt even
}

const profielTekst = await page.locator("body").innerText();
if (!/Jouw profielschets|profielschets/i.test(profielTekst)) {
  problemen.push("de mini-scan komt niet tot een profielschets");
}

/* ── 2. Is het bewaard, en biedt hij de weg naar het volledige profiel? ── */
const opgeslagen = await page.evaluate(() =>
  Object.keys(localStorage).filter((k) => k.includes("huidprofiel")),
);
if (opgeslagen.length === 0)
  problemen.push("er staat geen huidprofiel in localStorage");

const naarProfiel = page.getByRole("link", { name: /profiel verder aan/i });
if ((await naarProfiel.count()) === 0) {
  problemen.push("geen link naar /huidprofiel na de scan");
}

await page.screenshot({ path: `${UIT}/1-na-de-scan.png` });

/* ── 3. De zwevende knop hoort er nu te zijn, op elke pagina ── */
await page.goto(`${BASIS}/behandelingen`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const knop = page.getByRole("button", { name: /huidprofiel/i });
if ((await knop.count()) === 0) {
  problemen.push("de huidprofielknop verschijnt niet op /behandelingen");
}

/* ── 4. Ordent de behandelpagina op het profiel? ── */
const ordening = await page.evaluate(() => {
  const tekst = document.querySelector("main")?.innerText ?? "";
  return {
    noemtProfiel: /profiel/i.test(tekst),
    eerste: [...document.querySelectorAll("main a[href^='/behandelingen/']")]
      .slice(0, 3)
      .map((a) => a.innerText.split("\n")[0].trim()),
  };
});
if (!ordening.noemtProfiel) {
  problemen.push(
    "/behandelingen zegt nergens dat het op je profiel geordend is",
  );
}

await page.screenshot({ path: `${UIT}/2-behandelingen.png` });

/* ── 5. En blijft het staan na een harde herlaadbeurt? ── */
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);
if ((await page.getByRole("button", { name: /huidprofiel/i }).count()) === 0) {
  problemen.push("het profiel overleeft een herlaadbeurt niet");
}

await browser.close();

if (problemen.length) {
  console.error("PROBLEMEN:\n" + problemen.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}
console.log(
  `ok — keten loopt. Bovenaan op /behandelingen: ${ordening.eerste.join(", ")}`,
);
