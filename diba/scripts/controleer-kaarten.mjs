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

    const sleutel = teksten
      .map((t) => t.textContent.trim().slice(0, 30))
      .join("|");
    if (gezien.has(sleutel)) continue;
    gezien.add(sleutel);

    uit.push({
      regels: rs,
      teksten: teksten.map((t) => t.textContent.trim()),
    });
  }
  return uit;
};

/**
 * Koppen die over meer dan twee regels lopen.
 *
 * Yasin: "het moet echt perfect overal, max 2 regels die titels". Op de melasmapagina
 * stapelde een kop zich over vier regels omdat de kolom smal is en de zin lang. Dat is een
 * maat die je alleen ziet als je hem meet, want in de bron is het een zin van vijf woorden.
 *
 * H1 telt mee: ook de paginakop hoort binnen twee regels te passen.
 */
const meetKoppen = () => {
  const uit = [];
  for (const k of document.querySelectorAll("h1, h2, h3")) {
    const r = k.getBoundingClientRect();
    if (r.height < 5) continue;
    const lh = parseFloat(getComputedStyle(k).lineHeight);
    if (!lh) continue;
    const regels = Math.round(r.height / lh);
    if (regels > 2) {
      uit.push({
        regels,
        tag: k.tagName,
        tekst: k.textContent.trim().replace(/\s+/g, " "),
      });
    }
  }
  return uit;
};

let scheve = 0;
let lange = 0;
const perPagina = [];

for (const pad of paden) {
  await page.goto(BASIS + pad, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const rijen = await page.evaluate(meet);
  const koppen = await page.evaluate(meetKoppen);
  if (rijen.length || koppen.length) {
    perPagina.push({ pad, rijen, koppen });
    scheve += rijen.length;
    lange += koppen.length;
  }
}

await browser.close();

console.log(`\n${paden.length} pagina's nagemeten op 1280 pixels breed.\n`);

if (!scheve && !lange) {
  console.log(
    "ok — kaartrijen even lang, en geen kop over meer dan twee regels.\n",
  );
  process.exit(0);
}

console.log(
  `${scheve} kaartrijen staan scheef en ${lange} koppen lopen over meer dan twee regels.\n`,
);

for (const { pad, rijen, koppen } of perPagina) {
  console.log(pad);
  for (const rij of rijen) {
    console.log(`  kaartrij, regels ${rij.regels.join(" / ")}`);
    for (const t of rij.teksten) {
      console.log(
        `    ${String(t.length).padStart(3)} tekens  ${t.slice(0, 72)}`,
      );
    }
  }
  for (const k of koppen) {
    console.log(`  ${k.tag} over ${k.regels} regels: ${k.tekst.slice(0, 72)}`);
  }
  console.log("");
}

process.exitCode = 1;
