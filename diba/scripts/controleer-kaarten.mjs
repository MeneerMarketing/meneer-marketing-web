/**
 * Kaartrijen die scheef ogen.
 *
 * WAAROM DIT EEN SCRIPT IS EN GEEN GOEDE VOORNEMEN.
 *
 * Yasin wees op drie kaarten waarvan er een twee regels had en twee er drie. Ik zei dat ik
 * dat voortaan zou controleren, fixte de homepage, en liet dezelfde fout op de acne-pagina
 * staan. Twee dagen later wees hij dezelfde fout opnieuw aan. Beloven werkt niet.
 *
 * WAT HET MEET.
 *
 * Per pagina: elke rij van drie of meer kaarten die naast elkaar staan (zelfde bovenkant,
 * zelfde breedte). In elke kaart het laatste tekstblok, en daarvan het aantal regels.
 * Verschillen die, dan staat de rij scheef en is de tekst niet even lang geschreven.
 *
 * Twee regels naast drie is een verschil dat je ziet. Daarom is de grens nul: binnen een
 * rij horen alle tekstblokken evenveel regels te vullen.
 *
 * WAT HET NIET MEET.
 *
 * Kaarten die met opzet verschillen in vorm, zoals de drie blokken op de homepage waarvan
 * er een een foto is. Die hebben geen tekstblok aan het eind en vallen dus af.
 */
import { chromium } from "playwright";
import { readFileSync } from "fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/* Dezelfde bron als de tekstexport: de sitemap, zodat er geen pagina buiten valt. */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await page.content();
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

/** In de pagina uitgevoerd: geeft de scheve rijen terug. */
const meet = () => {
  const regels = (el) => {
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    return lh ? Math.round(el.getBoundingClientRect().height / lh) : 0;
  };

  const uit = [];
  const gezien = new Set();

  for (const groep of document.querySelectorAll("ul, ol, div")) {
    const kaarten = [...groep.children].filter(
      (c) => c.getBoundingClientRect().height > 40,
    );
    if (kaarten.length < 3) continue;

    /* Alleen echte rijen: zelfde bovenkant, zelfde breedte. */
    const eerste = kaarten[0].getBoundingClientRect();
    const opEenRij = kaarten.every((c) => {
      const r = c.getBoundingClientRect();
      return (
        Math.abs(r.top - eerste.top) < 4 && Math.abs(r.width - eerste.width) < 4
      );
    });
    if (!opEenRij) continue;

    const teksten = kaarten.map((c) => {
      const blokken = [...c.querySelectorAll("p, span, li")].filter(
        (e) => e.children.length === 0 && e.textContent.trim().length > 20,
      );
      return blokken[blokken.length - 1] ?? null;
    });
    if (teksten.some((t) => !t)) continue;

    const rs = teksten.map(regels);
    if (new Set(rs).size === 1) continue;

    const sleutel = teksten.map((t) => t.textContent.trim().slice(0, 30)).join("|");
    if (gezien.has(sleutel)) continue;
    gezien.add(sleutel);

    uit.push({
      regels: rs,
      teksten: teksten.map((t) => t.textContent.trim()),
    });
  }
  return uit;
};

let scheve = 0;
const perPagina = [];

for (const pad of paden) {
  await page.goto(BASIS + pad, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const rijen = await page.evaluate(meet);
  if (rijen.length) {
    perPagina.push({ pad, rijen });
    scheve += rijen.length;
  }
}

await browser.close();

console.log(`\n${paden.length} pagina's nagemeten op 1280 pixels breed.\n`);

if (!scheve) {
  console.log("ok — elke kaartrij heeft even lange tekstblokken.\n");
  process.exit(0);
}

console.log(
  `${scheve} kaartrijen staan scheef: binnen een rij vullen de tekstblokken` +
    ` een verschillend aantal regels.\n`,
);

for (const { pad, rijen } of perPagina) {
  console.log(pad);
  for (const rij of rijen) {
    console.log(`  regels ${rij.regels.join(" / ")}`);
    for (let i = 0; i < rij.teksten.length; i++) {
      const t = rij.teksten[i];
      console.log(`    ${String(t.length).padStart(3)} tekens  ${t.slice(0, 74)}`);
    }
  }
  console.log("");
}

process.exitCode = 1;
