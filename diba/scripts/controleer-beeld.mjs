/**
 * Waar snijdt een foto er iets af, en aan welke kant?
 *
 * Aanleiding: op /werken-bij stonden twee behandelaars met hun hoofd buiten beeld. De
 * oorzaak is `object-cover` met `object-center`: past een foto niet in zijn kader, dan gaat
 * er van boven en onder evenveel af. Bij een foto van mensen is dat de verkeerde helft,
 * want onderaan staat vloer en bovenaan staat het gezicht.
 *
 * Dit script rekent per foto uit hoeveel procent er verticaal wegvalt en aan welke kant.
 * Alles boven de grens hieronder is het bekijken waard; of er echt een hoofd sneuvelt kan
 * een script niet zien, dus het levert een kijklijst en geen oordeel.
 *
 * Draaien met de site erbij:
 *   BASIS=http://localhost:3021 npm run beeld
 */
import { chromium } from "playwright";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/* Onder de tien procent valt er zo weinig weg dat er niets in gevaar komt. */
const GRENS_PROCENT = 10;

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/* De sitemap als bron, net als de andere controles. */
await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

const bevindingen = [];

for (const pad of paden) {
  await pagina.goto(`${BASIS}${pad}`, { waitUntil: "networkidle" }).catch(() => {});

  const beelden = await pagina.evaluate(() => {
    const uit = [];
    for (const img of document.querySelectorAll("img")) {
      if (!img.naturalWidth || !img.naturalHeight) continue;
      const stijl = getComputedStyle(img);
      if (stijl.objectFit !== "cover") continue;

      const doos = img.getBoundingClientRect();
      if (doos.width < 200 || doos.height < 120) continue;

      /* Hoeveel van de foto valt er verticaal buiten het kader?
         Bij cover schaalt de foto tot de kortste kant past. Is de foto relatief hoger
         dan het kader, dan gaat het verschil er van boven en onder af. */
      const fotoVerhouding = img.naturalWidth / img.naturalHeight;
      const kaderVerhouding = doos.width / doos.height;
      if (fotoVerhouding >= kaderVerhouding) continue; // dan snijdt hij links en rechts

      const zichtbaar = fotoVerhouding / kaderVerhouding;
      uit.push({
        src: img.currentSrc.replace(/^.*?url=/, "").split("&")[0],
        alt: img.alt,
        weg: Math.round((1 - zichtbaar) * 100),
        positie: stijl.objectPosition,
        kader: `${Math.round(doos.width)}x${Math.round(doos.height)}`,
      });
    }
    return uit;
  }).catch(() => []);

  for (const b of beelden) {
    if (b.weg >= GRENS_PROCENT) bevindingen.push({ pad, ...b });
  }
}

await browser.close();

/* Dezelfde foto komt op meerdere pagina's voor; groeperen scheelt herhaling. */
const perFoto = new Map();
for (const b of bevindingen) {
  const sleutel = `${decodeURIComponent(b.src)} @ ${b.positie}`;
  if (!perFoto.has(sleutel)) perFoto.set(sleutel, []);
  perFoto.get(sleutel).push(b);
}

console.log(
  `\n${bevindingen.length} plaatsingen snijden ${GRENS_PROCENT}% of meer van de hoogte af.\n`,
);

for (const [sleutel, lijst] of [...perFoto.entries()].sort(
  (a, b) => b[1][0].weg - a[1][0].weg,
)) {
  const e = lijst[0];
  console.log(`${String(e.weg).padStart(3)}% weg  ${sleutel}`);
  console.log(`           ${e.alt.slice(0, 88)}`);
  for (const p of lijst) console.log(`           ${p.pad}  (${p.kader})`);
  console.log("");
}

console.log(
  "Een script ziet niet of er een hoofd sneuvelt. Dit is de kijklijst: bij een foto van\n" +
    'mensen met "50% 50%" hoort meestal brandpunt="boven".',
);
