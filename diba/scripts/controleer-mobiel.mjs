/**
 * Loopt de hele site af op een telefoon en meet wat je met het oog niet betrapt.
 *
 * WAAROM DIT NAAST DE HUISREGELS STAAT.
 *
 * `controleer-huisregels.mjs` kijkt al naar horizontale overloop op 320 pixels. Dat vangt
 * de grofste fout — een pagina die opzij schuift — en verder niets. Alle andere manieren
 * waarop een pagina op een telefoon stukgaat blijven binnen de viewport en worden dus
 * netjes goedgekeurd:
 *
 * - een knop van vierentwintig pixels hoog, die je met een duim niet raakt;
 * - een prijs of een label van elf pixels, dat op een echt scherm onleesbaar is;
 * - een naam die in een vaste hoogte is afgeknipt, waardoor de helft wegvalt;
 * - twee knoppen die elkaar bijna raken, zodat je altijd de verkeerde indrukt.
 *
 * Dat is precies het soort schade dat pas opvalt als iemand het meldt, en op een site voor
 * een kliniek komt het merendeel van het verkeer van een telefoon.
 *
 * WAAROM DE DREMPELS ZIJN WAT ZE ZIJN.
 *
 * 24 pixels voor een tikdoel: de eis uit WCAG 2.5.8, niveau AA. Zie de constante verderop
 * voor waarom hier geen ruimere maat past.
 *
 * 13 pixels voor tekst: kleiner dan dat laat een telefoon standaard inzoomen bij het
 * invullen van een veld, en het is de grens waaronder mensen boven de veertig gaan turen.
 *
 * WAT ER BEWUST NIET IN ZIT.
 *
 * Links in een lopende zin. Die zijn zo hoog als de regel waarin ze staan en horen dat ook
 * te zijn; een tekstlink van twintig pixels hoog is geen fout maar een zin. Alleen wat als
 * knop of als losse link in beeld staat wordt gemeten.
 *
 * Draaien: `node scripts/controleer-mobiel.mjs` met de dev-server op :3010.
 */
import { chromium, devices } from "playwright";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/**
 * De ondergrens voor iets waar je op tikt, in pixels.
 *
 * Stond eerst op 40, de maat van een vingertop. Dat bleek geen drempel maar een wens: de
 * labellinks staan op sommige plaatsen twaalf pixels uit elkaar, dus een vlak van veertig
 * hoog zou over zijn buurman heen liggen en je zou stelselmatig de verkeerde link openen.
 * Een te groot tikvlak is net zo stuk als een te klein.
 *
 * 24 is wat WCAG 2.5.8 op niveau AA eist en wat hier past zonder overlap. De knoppen en
 * pillen zitten met hun eigen padding trouwens al op 44 tot 48.
 */
const TIKDOEL = 24;
/** De ondergrens voor leesbare tekst op een telefoon, in pixels. */
const LETTER = 13;
/** Hoeveel ruimte er minstens tussen twee tikdoelen hoort te zitten. */
const TUSSENRUIMTE = 8;

const browser = await chromium.launch();
const page = await browser.newPage();

function zoekPaginas(map) {
  const uit = [];
  for (const naam of readdirSync(map)) {
    const vol = join(map, naam);
    if (statSync(vol).isDirectory()) uit.push(...zoekPaginas(vol));
    else if (naam === "page.tsx") uit.push(map);
  }
  return uit;
}

await page.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await page.content();
const uitSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);

const OVERZICHTEN = [
  { pad: "/apparatuur", voorvoegsel: "/apparatuur/" },
  { pad: "/vergoedingen", voorvoegsel: "/vergoedingen/" },
];
const uitOverzichten = [];
for (const { pad, voorvoegsel } of OVERZICHTEN) {
  await page.goto(`${BASIS}${pad}`, { waitUntil: "networkidle" });
  uitOverzichten.push(
    ...(await page.evaluate(
      (v) =>
        [...document.querySelectorAll(`a[href^='${v}']`)]
          .map((a) => a.getAttribute("href"))
          .filter((h, i, l) => l.indexOf(h) === i),
      voorvoegsel,
    )),
  );
}

const statisch = zoekPaginas(join(process.cwd(), "src", "app"))
  .map(
    (m) =>
      "/" +
      relative(join(process.cwd(), "src", "app"), m)
        .split(sep)
        .join("/"),
  )
  .map((p) => (p === "/." ? "/" : p))
  .filter((p) => !p.includes("[") && !p.includes("("));

const paden = [...new Set([...statisch, ...uitSitemap, ...uitOverzichten])]
  .filter(
    (p) =>
      !p.startsWith("/preview-login") &&
      !p.startsWith("/api") &&
      !p.startsWith("/dev"),
  )
  .sort();

/**
 * De meting zelf, in de pagina.
 *
 * Alles gebeurt in één `evaluate` en niet in losse vragen heen en weer, want bij
 * negenentachtig pagina's maal vier metingen wordt dat de traagste stap van de hele
 * controle.
 */
const METEN = ({ TIKDOEL, LETTER, TUSSENRUIMTE }) => {
  const zichtbaar = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0")
      return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  /* `className` is op een SVG geen string maar een SVGAnimatedString, vandaar het
     attribuut en niet de eigenschap. */
  const omschrijf = (el) =>
    String(
      el.innerText ||
        el.getAttribute("aria-label") ||
        el.getAttribute("class") ||
        "",
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 46) || "(zonder tekst)";

  /* Een link telt als tikdoel zodra hij niet in een lopende zin staat.

     WCAG 2.5.8 zegt dit met zoveel woorden: een doel in een zin is uitgezonderd, want zijn
     hoogte wordt bepaald door de regel eromheen en niet door de knop. Een tekstlink groter
     maken dan zijn eigen regel kan gewoon niet.

     De eerste versie keek alleen naar de directe ouder, en trapte daarmee in
     "Draait op <span><a>HydraFacial Syndeo</a>,</span>": de span bevat niets anders dan de
     link, dus de link leek alleen te staan terwijl hij midden in een zin stond. Vandaar dat
     dit doorloopt tot de eerste doos die echt een tekstblok is. */
  const inLopendeTekst = (el) => {
    let ouder = el.parentElement;
    while (ouder && /^(SPAN|EM|STRONG|B|I)$/.test(ouder.tagName)) {
      ouder = ouder.parentElement;
    }
    if (!ouder) return false;
    if (!/^(P|LI|DD|DT|TD|BLOCKQUOTE|FIGCAPTION)$/.test(ouder.tagName))
      return false;
    return (
      (ouder.innerText || "").trim().length > el.innerText.trim().length + 8
    );
  };

  /* data-essentiele-maat: daar bepaalt de voorstelling de maat van het doel.

     Tot nu toe staat dat op precies een plek, de maandbalken van het zonjaar, en daar staat
     in de component uitgerekend waarom het niet anders kan. Het attribuut moet zeldzaam
     blijven: het is een bewijs dat je het hebt nagerekend, geen manier om een melding weg
     te krijgen. */
  const doelen = [...document.querySelectorAll("main a, main button")].filter(
    (el) =>
      zichtbaar(el) &&
      !inLopendeTekst(el) &&
      !el.closest("[data-essentiele-maat]"),
  );

  /* Het aanraakvlak, niet het zichtbare vlak.

     Platte labellinks dragen een ::after dat vijf pixels boven en onder uitsteekt (zie
     globals.css). Wie alleen getBoundingClientRect leest, meet de letters en meldt
     vierhonderd keer een probleem dat is opgelost. */
  const tikvlak = (el) => {
    const r = el.getBoundingClientRect();
    const na = getComputedStyle(el, "::after");
    if (na.content !== '""' || na.position !== "absolute") return r;
    const uit = (v) => (v.endsWith("px") ? -parseFloat(v) : 0);
    return {
      width: r.width + uit(na.left) + uit(na.right),
      height: r.height + uit(na.top) + uit(na.bottom),
    };
  };

  const teKlein = [];
  for (const el of doelen) {
    const r = tikvlak(el);
    if (r.height < TIKDOEL || r.width < TIKDOEL) {
      teKlein.push(
        `${Math.round(r.width)}×${Math.round(r.height)} "${omschrijf(el)}"`,
      );
    }
  }

  /* Twee tikdoelen die elkaar bijna raken.

     Alleen als er ook echt eentje te klein is. De eerste versie meldde vier pixels tussen
     de knoppen van de tijdlijn op /littekens, en die knoppen zijn 54 bij 48: dat is een
     segmented control zoals op elke telefoon, en daar is vier pixels precies goed. Ruimte
     tussen doelen is in WCAG 2.5.8 dan ook geen eis maar een uitweg voor doelen die de
     maat niet halen. Haalt het doel de maat wel, dan doet de ruimte er niet toe.

     Alleen naast elkaar op dezelfde regel, want onder elkaar is verticale ruimte veel
     minder foutgevoelig. */
  const dichtbij = [];
  for (let i = 0; i < doelen.length; i++) {
    const a = doelen[i].getBoundingClientRect();
    const aKlein = tikvlak(doelen[i]);
    if (aKlein.width >= TIKDOEL && aKlein.height >= TIKDOEL) continue;
    for (let j = i + 1; j < doelen.length; j++) {
      const b = doelen[j].getBoundingClientRect();
      const zelfdeRegel = Math.abs(a.top - b.top) < 6;
      if (!zelfdeRegel) continue;
      const gat = b.left > a.left ? b.left - a.right : a.left - b.right;
      if (gat >= 0 && gat < TUSSENRUIMTE) {
        dichtbij.push(
          `${Math.round(gat)}px tussen "${omschrijf(doelen[i])}" en "${omschrijf(doelen[j])}"`,
        );
      }
    }
  }

  /* Het label is met opzet klein, en dat is geen bevinding maar de huisstijl.

     Dit vak zocht eerst naar het kruimelpad, want dat kwam op zevenentachtig pagina's terug
     op elf pixels. Zodra dat eruit stond bleef de teller staan: er kwam op elke pagina een
     ander element van elf pixels voor terug. "In het kort", "Hierop draait", "Waarom dit
     ertoe doet".

     Het is dus niet het kruimelpad. Het is .diba-label zelf, de eyebrow uit het ontwerp, die
     overal op elf pixels staat. Dat is een tekstsoort met een eigen rol: hoofdletters,
     ruime letterafstand, boven een kop, nooit langer dan een paar woorden. Zo klein mag die
     zijn, en zo staat hij in Figma.

     Een klassenlijst bleek daar niet genoeg voor. Zodra .diba-label eruit stond, kwamen de
     knoppen terug: "Start je intake", "Bekijk de cirkel", "Plan Behandeling Nul". Die dragen
     de klasse niet maar wel exact dezelfde opmaak, met de hand geschreven: elf pixels,
     hoofdletters, ruime letterafstand, achtenveertig pixels hoog. Dezelfde keuze dus, alleen
     op een andere manier opgeschreven.

     Vandaar geen lijst met klassen maar de vorm zelf. Hoofdletters met opgerekte
     letterafstand is labeltypografie, en die meet je niet met de lat van leestekst. Wat er
     dan overblijft is wat er moet overblijven: gewone tekst die per ongeluk te klein is
     uitgevallen. */
  const isLabel = (el) => {
    const s = getComputedStyle(el);
    if (s.textTransform === "uppercase" && parseFloat(s.letterSpacing) > 0)
      return true;
    /* Een telling of een typenummer is geen zin maar een teken: de 10 in een badge, de 56
       naast de reviews, de II van een huidtype. Die lees je als symbool en niet als tekst,
       en ze staan altijd naast iets dat wel op leesmaat staat. */
    if (/^[0-9IVXL]{1,3}$/.test((el.innerText || "").trim())) return true;
    return Boolean(el.closest("[data-taalkeuze]"));
  };
  let geduld = 0;

  /* Te kleine letters. Alleen elementen met eigen tekst, anders telt elke ouder mee. */
  const klein = new Map();
  for (const el of document.querySelectorAll("main *")) {
    if (!zichtbaar(el)) continue;
    /* Tekst in een diagram is geen leestekst maar een bijschrift bij een tekening, en
       staat daar met opzet klein. */
    if (el instanceof SVGElement) continue;
    const eigen = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
    );
    if (!eigen) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < LETTER) {
      if (isLabel(el)) {
        geduld++;
        continue;
      }
      const sleutel = `${px}px`;
      if (!klein.has(sleutel)) klein.set(sleutel, omschrijf(el));
    }
  }

  /* Tekst die is afgeknipt doordat de doos een vaste hoogte heeft. */
  const afgeknipt = [];
  for (const el of document.querySelectorAll("main *")) {
    if (!zichtbaar(el)) continue;
    const s = getComputedStyle(el);
    if (s.overflow !== "hidden" && s.overflowY !== "hidden") continue;
    /* Een sr-only-span is met opzet een pixel hoog: die tekst is voor een schermlezer en
       hoort niet in beeld. */
    if (el.clientHeight <= 2) continue;
    /* Een doos met een absoluut geplaatst kind heeft bijna altijd een scrollHeight die
       groter is dan zijn clientHeight, zonder dat er iets wegvalt. De hero op de variant
       meldde zo 332 verdwenen pixels terwijl er niets miste. */
    if (
      [...el.querySelectorAll("*")].some((k) => {
        const ks = getComputedStyle(k).position;
        return ks === "absolute" || ks === "fixed";
      })
    )
      continue;
    if (
      el.scrollHeight > el.clientHeight + 2 &&
      el.innerText.trim().length > 0
    ) {
      afgeknipt.push(
        `${el.scrollHeight - el.clientHeight}px weg bij "${omschrijf(el)}"`,
      );
    }
  }

  return {
    teKlein: [...new Set(teKlein)],
    dichtbij: [...new Set(dichtbij)],
    klein: [...klein.entries()].map(([px, wat]) => `${px} "${wat}"`),
    geduld,
    afgeknipt: [...new Set(afgeknipt)],
    overloop:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  };
};

const telefoon = await browser.newPage({
  ...devices["iPhone 13"],
  viewport: { width: 375, height: 812 },
});

const bevindingen = [];
let geduldTotaal = 0;
for (const pad of paden) {
  const res = await telefoon.goto(BASIS + pad, {
    waitUntil: "domcontentloaded",
  });
  if (!res || res.status() >= 400) {
    bevindingen.push(`${pad}: status ${res ? res.status() : "geen antwoord"}`);
    continue;
  }
  const uit = await telefoon.evaluate(METEN, {
    TIKDOEL,
    LETTER,
    TUSSENRUIMTE,
  });

  for (const x of uit.teKlein) bevindingen.push(`${pad}: tikdoel ${x}`);
  for (const x of uit.dichtbij) bevindingen.push(`${pad}: krap ${x}`);
  for (const x of uit.klein) bevindingen.push(`${pad}: letter ${x}`);
  geduldTotaal += uit.geduld;
  for (const x of uit.afgeknipt) bevindingen.push(`${pad}: afgeknipt ${x}`);
  if (uit.overloop > 0) {
    bevindingen.push(`${pad}: ${uit.overloop}px overloop op 375`);
  }
}

await browser.close();

if (bevindingen.length) {
  /* Gegroepeerd per soort, want dezelfde fout op veertig pagina's is één fout in één
     component en geen veertig losse dingen om na te lopen. */
  const perSoort = new Map();
  for (const b of bevindingen) {
    const soort = b.split(": ")[1]?.split(" ")[0] ?? "overig";
    if (!perSoort.has(soort)) perSoort.set(soort, []);
    perSoort.get(soort).push(b);
  }
  console.error(
    `${bevindingen.length} bevinding(en) op ${paden.length} pagina's\n`,
  );
  for (const [soort, lijst] of [...perSoort].sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    console.error(`── ${soort} (${lijst.length})`);
    /* Standaard twaalf per soort, want dezelfde fout op veertig pagina's lees je niet
       veertig keer. ALLES=1 zet de rem eraf als je wil weten of het er echt veertig
       dezelfde zijn of veertig verschillende. */
    const rem = process.env.ALLES ? lijst.length : 12;
    for (const r of lijst.slice(0, rem)) console.error(`   ${r}`);
    if (lijst.length > rem) console.error(`   … en ${lijst.length - rem} meer`);
    console.error("");
  }
  process.exit(1);
}

console.log(
  `ok — ${paden.length} pagina's op een telefoon, niets gevonden` +
    (geduldTotaal
      ? `
   (${geduldTotaal}x labeltekst onder ${LETTER}px, met opzet; zie isLabel)`
      : ""),
);
