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

    /* `items-start` is de auteur die zegt: deze hoogtes verschillen met opzet. Zo staan de
       reviewkaarten, waar een citaat van twee regels naast een van zes hoort te kunnen
       zonder dat er een gat in de korte valt. */
    const uitlijning = getComputedStyle(groep).alignItems;
    if (uitlijning === "start" || uitlijning === "flex-start") continue;

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

    /* Blokken die met flex-grow worden uitgerekt zijn al even hoog; het aantal regels
       tekst binnen dat blok verschilt dan wel, maar dat zie je niet. Op /gevoelige-huid
       staan vier kaarten van 211 pixels met alinea's van 84, en toch meldde deze meter
       daar een verschil. Dat is een fout in de meter en niet in de pagina. */
    const uitgerekt = teksten.every(
      (t) => parseFloat(getComputedStyle(t).flexGrow) > 0,
    );
    const hoogtes = kaarten.map((c) =>
      Math.round(c.getBoundingClientRect().height),
    );
    if (uitgerekt && new Set(hoogtes).size === 1) continue;

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

    /* En de andere kant op: een kop van twee woorden die toch over twee regels staat.
       "Drie oorzaken" werd "Drie" met "oorzaken" eronder, en dat leest als een kop die
       is afgekapt. Onder de zestien tekens hoort hij op een regel; daarboven is de kolombreedte de reden en niet de kop. */
    const tekst = k.textContent.trim().replace(/\s+/g, " ");
    /* Alleen sectiekoppen. Een kaarttitel in een smalle kolom mag over twee regels;
       daar is de kolom de reden en niet de kop. */
    if (regels === 2 && tekst.length <= 16 && k.tagName !== "H3") {
      uit.push({ regels, tag: k.tagName, tekst, kort: true });
    }
  }
  return uit;
};

/**
 * Introzinnen naast een sectiekop die maar één regel vullen.
 *
 * Yasin over "De drie oorzaken naast elkaar, met per soort wat eraan te doen is": die zin
 * hangt als los vliegwerk naast een kop van twee regels. Twee regels is de maat; dan
 * staat er een alinea in plaats van een onderschrift.
 *
 * Alleen de intro's naast een sectiekop, want die staan in een eigen kolom. Lopende tekst
 * elders mag kort zijn.
 */
const meetIntros = () => {
  const uit = [];
  for (const k of document.querySelectorAll("h1, h2")) {
    const rij = k.parentElement?.parentElement;
    if (!rij) continue;
    const p = rij.querySelector(":scope > p");
    if (!p || p.textContent.trim().length < 15) continue;

    /* Een intro staat naast of vlak onder de kop. Een alinea die verderop staat, na een
       lijst bijvoorbeeld, is een voetnoot en geen intro. Op /contact haalde deze meter zo
       de zin onder de opsomming binnen. */
    const dk = k.getBoundingClientRect();
    const dp = p.getBoundingClientRect();
    if (dp.top - dk.top > 140) continue;
    const lh = parseFloat(getComputedStyle(p).lineHeight);
    if (!lh) continue;
    const regels = Math.round(p.getBoundingClientRect().height / lh);
    if (regels === 1) {
      uit.push({
        tekst: p.textContent.trim().replace(/\s+/g, " "),
        bij: k.textContent.trim().replace(/\s+/g, " ").slice(0, 40),
      });
    }
  }
  return uit;
};

let scheve = 0;
let lange = 0;
let losse = 0;
const perPagina = [];

for (const pad of paden) {
  await page.goto(BASIS + pad, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const rijen = await page.evaluate(meet);
  const koppen = await page.evaluate(meetKoppen);
  const intros = await page.evaluate(meetIntros);
  if (rijen.length || koppen.length || intros.length) {
    perPagina.push({ pad, rijen, koppen, intros });
    scheve += rijen.length;
    lange += koppen.length;
    losse += intros.length;
  }
}

await browser.close();

console.log(`\n${paden.length} pagina's nagemeten op 1280 pixels breed.\n`);

if (!scheve && !lange && !losse) {
  console.log(
    "ok — kaartrijen even lang, koppen binnen twee regels, intro's minstens twee.\n",
  );
  process.exit(0);
}

console.log(
  `${scheve} scheve kaartrijen, ${lange} koppen buiten de twee regels,` +
    ` ${losse} intro's van maar een regel.\n`,
);

for (const { pad, rijen, koppen, intros } of perPagina) {
  console.log(pad);
  for (const rij of rijen) {
    console.log(`  kaartrij, regels ${rij.regels.join(" / ")}`);
    for (const t of rij.teksten) {
      console.log(
        `    ${String(t.length).padStart(3)} tekens  ${t.slice(0, 70)}`,
      );
    }
  }
  for (const k of koppen) {
    const wat = k.kort
      ? `${k.tag} kort maar op twee regels`
      : `${k.tag} over ${k.regels} regels`;
    console.log(`  ${wat}: ${k.tekst.slice(0, 66)}`);
  }
  for (const i of intros) {
    console.log(
      `  intro van een regel bij "${i.bij}": ${i.tekst.slice(0, 60)}`,
    );
  }
  console.log("");
}

process.exitCode = 1;
