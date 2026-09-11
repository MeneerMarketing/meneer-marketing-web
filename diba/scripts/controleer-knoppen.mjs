/**
 * Staat elk knopopschrift op één regel?
 *
 * Yasin, 11 september 2026: "waarom zie ik weer een knop die gestapeld is op 2 regels? loop
 * dat overal na en los dat op, knoppen moeten tekst max op 1 regel."
 *
 * WAAROM DIT ERTOE DOET. Onze knoppen hebben een vaste hoogte (`h-12`) en `leading-none`.
 * Een opschrift dat omloopt wordt dus niet opgevangen door een hogere knop maar loopt het
 * vlak uit: twee regels tekst in achtenveertig pixels, tegen de randen aan. Het is altijd
 * een fout, nooit een keuze.
 *
 * HOE DIT MEET. Per stukje tekst apart, met een Range: hoeveel regels beslaat dit ene
 * stukje? Regels die minder dan vier pixels in hoogte verschillen zijn dezelfde regel.
 *
 * Bewust per stukje en niet over de hele knop. Een knop met een opschrift en een regel
 * uitleg eronder is twee stukjes tekst op twee regels, en dat is een ontwerp. Een opschrift
 * dat zelf omslaat is een stuk tekst over twee regels, en dat is een fout. Alleen dat
 * tweede telt hier. Een pijltje naast de tekst telt nergens mee.
 *
 * WAT ALS KNOP TELT. Een `a` of `button` in echte pilvorm: de ronding is minstens de halve
 * hoogte, en dat is `--r-pill` en niets anders. Verder tussen de veertig en tweeenzeventig
 * pixels hoog, zonder blokinhoud en met een opschrift van hooguit vijfenveertig tekens.
 *
 * Tegels met een ronding van vierentwintig (`--r-md`) vallen er dus buiten. Dat is met
 * opzet: een tegel van vierenzestig pixels hoog met gecentreerde tekst is gemaakt om twee
 * regels te dragen. De regel gaat over knoppen.
 *
 * Die laatste drie eisen zijn er na de eerste meting bij gekomen. Zonder die eisen telde
 * het script zeshonderd kaarten mee: een kaart is ook een `a` met ronde hoeken, maar daar
 * staat een kop met een alinea in en daar hoort tekst juist om te lopen. Een knop draagt
 * een opschrift en verder niets.
 *
 *   BASIS=http://localhost:3021 npm run knoppen
 *   ALLES=1 BASIS=... npm run knoppen   (alle bevindingen, niet de eerste twintig)
 */
import { chromium } from "playwright";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const ALLES = process.env.ALLES === "1";

/** De maten waarop we kijken: de smalste telefoon die we ondersteunen, en een tablet. */
const BREEDTES = [
  { naam: "375", width: 375, height: 812 },
  { naam: "768", width: 768, height: 1024 },
  { naam: "1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 375, height: 812 } });

await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

const meet = () => {
  const uit = [];

  /** Het langste stuk tekst in dit element: over hoeveel regels loopt dat? */
  const regels = (el) => {
    const loper = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let meeste = 0;
    let knoop = loper.nextNode();
    while (knoop) {
      if (knoop.nodeValue.trim()) {
        const bereik = document.createRange();
        bereik.selectNodeContents(knoop);
        const toppen = [];
        for (const r of bereik.getClientRects()) {
          if (r.width < 1 || r.height < 1) continue;
          if (!toppen.some((t) => Math.abs(t - r.top) < 4)) toppen.push(r.top);
        }
        meeste = Math.max(meeste, toppen.length);
      }
      knoop = loper.nextNode();
    }
    return meeste;
  };

  for (const el of document.querySelectorAll("a, button")) {
    const doos = el.getBoundingClientRect();
    if (doos.height < 40 || doos.width < 1) continue;
    const stijl = getComputedStyle(el);
    if (stijl.visibility === "hidden" || stijl.display === "none") continue;
    if (doos.height > 72) continue;
    const ronding = parseFloat(stijl.borderTopLeftRadius) || 0;
    if (ronding < doos.height / 2 - 1) continue;
    // Een kaart, geen knop: daar hoort de tekst juist om te lopen.
    if (el.querySelector("p, h1, h2, h3, h4, h5, h6, li, img, figure"))
      continue;
    const tekst = el.innerText.trim().replace(/\s+/g, " ");
    if (!tekst || tekst.length > 45) continue;
    const n = regels(el);
    if (n > 1) uit.push({ tekst, regels: n, breedte: Math.round(doos.width) });
  }
  return uit;
};

const bevindingen = [];

for (const b of BREEDTES) {
  await pagina.setViewportSize({ width: b.width, height: b.height });
  for (const pad of paden) {
    await pagina
      .goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" })
      .catch(() => {});
    /* De cookiebalk dekt de onderkant af; zijn eigen knoppen tellen wel mee, die van de
       pagina eronder kunnen niet gemeten worden als ze eronder liggen. Hij staat er
       alleen bij het eerste bezoek, dus wegklikken en door. */
    const weiger = pagina.locator("[data-cookiebalk] button").first();
    if (await weiger.count().catch(() => 0)) {
      await weiger.click().catch(() => {});
    }
    const fouten = await pagina.evaluate(meet).catch(() => []);
    for (const f of fouten) bevindingen.push({ pad, maat: b.naam, ...f });
  }
}

await browser.close();

/* Dezelfde knop op dertig pagina's is één fout, geen dertig. Groeperen op opschrift en
   maat, en de pagina's erbij noemen. */
const groepen = new Map();
for (const b of bevindingen) {
  const sleutel = `${b.maat}|${b.tekst}`;
  const g = groepen.get(sleutel) ?? { ...b, paden: [] };
  g.paden.push(b.pad);
  groepen.set(sleutel, g);
}
const lijst = [...groepen.values()].sort(
  (a, b) => b.paden.length - a.paden.length,
);

console.log("");
console.log(
  `${paden.length} pagina's, gemeten op ${BREEDTES.map((b) => b.naam).join(", ")} pixels breed.`,
);
console.log("");

if (lijst.length === 0) {
  console.log("ok — elk knopopschrift staat op één regel.");
} else {
  const totaal = bevindingen.length;
  console.log(
    `${lijst.length} knop(pen) met een opschrift over meerdere regels, ${totaal} keer geteld.`,
  );
  console.log("");
  for (const g of ALLES ? lijst : lijst.slice(0, 20)) {
    console.log(
      `   ${g.maat}px  ${g.regels} regels, knop ${g.breedte} breed  "${g.tekst}"`,
    );
    console.log(
      `          ${g.paden.slice(0, 3).join(", ")}${g.paden.length > 3 ? ` en nog ${g.paden.length - 3}` : ""}`,
    );
  }
  if (!ALLES && lijst.length > 20) {
    console.log(
      `   … en nog ${lijst.length - 20}. Draai met ALLES=1 voor alles.`,
    );
  }
}
console.log("");
