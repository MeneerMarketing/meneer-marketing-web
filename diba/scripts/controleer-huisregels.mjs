/**
 * Loopt de hele site af en controleert de huisregels die je met het blote oog mist.
 *
 * WAAROM DIT SCRIPT ER IS.
 *
 * Drie keer nu is er een redactievlag op het scherm beland: in de configurator, in het
 * werkingsvenster en in de laser-FAQ. Elke keer op een andere manier, elke keer omdat de
 * tekst niet door `publicCopy` liep, en elke keer pas gevonden doordat er toevallig iemand
 * naar die ene pagina keek. Dat is geen oplettendheid maar geluk, en geluk schaalt niet
 * naar honderd pagina's.
 *
 * Wat er gecontroleerd wordt:
 *
 * 1. Redactievlaggen. Die horen in de broncode en nooit in beeld.
 * 2. De u-vorm. Verboden buiten de juridische pagina's, en juist dáár verplicht, dus het
 *    is geen kwestie van overal wegpoetsen.
 * 3. Kastlijntjes in zichtbare tekst.
 * 4. Horizontale overloop op een telefoon.
 *
 * Het loopt over de sitemap, zodat een nieuwe pagina er vanzelf in valt. Wie een pagina
 * toevoegt hoeft hier niets aan te doen; dat is de enige manier waarop zo'n controle blijft
 * werken.
 */
import { chromium, devices } from "playwright";
import { readFileSync } from "node:fs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/**
 * Op deze pagina's is de u-vorm juist de bedoeling.
 *
 * De eerste vijf zijn juridisch: daar is de u-vorm de conventie en zou de je-vorm raar
 * staan. /verwijzers is er later bij gekomen en is van een andere soort: die pagina praat
 * tegen een huisarts en niet tegen een klant, en in professioneel Nederlands is "u" daar
 * de norm. Besluit van Yasin, augustus 2026.
 *
 * Het staat hier en niet als uitgezette controle, want dan verdwijnt ook het toezicht op
 * de pagina's die de je-vorm wél moeten volgen.
 */
/**
 * Het Nederlandse adres van een pagina, welke taal hij ook draagt.
 *
 * /en/referrers en /es/derivaciones zijn dezelfde pagina als /verwijzers. De regels
 * hieronder staan met hun Nederlandse naam, dus moet een vertaald adres eerst terug. De
 * tabellen komen uit `lib/slugs.ts` met een regex: dat is TypeScript en dit draait op kale
 * node, maar het blijft daarmee wel één bron.
 */
const slugsBron = readFileSync("src/lib/slugs.ts", "utf8");
const TERUG = new Map();
for (const m of slugsBron.matchAll(/const NAAR_([A-Z]{2})[\s\S]*?\n};/g)) {
  const taal = m[1].toLowerCase();
  const tabel = new Map();
  for (const p of m[0].matchAll(/^\s*"?([A-Za-z0-9-]+)"?:\s*"([^"]+)",/gm)) {
    tabel.set(p[2], p[1]);
  }
  TERUG.set(taal, tabel);
}

function nederlandsPad(pad) {
  const taal = pad.match(/^\/([a-z]{2})(\/|$)/)?.[1];
  const tabel = taal && TERUG.get(taal);
  if (!tabel) return pad;
  const rest = pad.slice(taal.length + 1);
  if (!rest) return "/";
  return (
    "/" +
    rest
      .split("/")
      .filter(Boolean)
      .map((d) => tabel.get(d) ?? d)
      .join("/")
  );
}

const JURIDISCH = [
  "/algemene-voorwaarden",
  "/privacybeleid",
  "/cookiebeleid",
  "/disclaimer",
  "/klachten",
  "/verwijzers",
];

const VLAG = /\[(COPY|PRIJS|BEELD|GEGEVEN|MEDISCHE|BESLUIT)-[A-Z-]*[^\]]*\]/g;

/**
 * "u" als aanspreekvorm, niet als letter in een woord of in een productnaam.
 *
 * Twee versies waren mis. Eerst een lijstje werkwoorden ("u kunt", "u heeft"), dat "wij
 * koppelen u aan een therapeut" miste omdat de u daar achteraan stond. Toen elke
 * losstaande u, en die vond prompt de U225 en de Gentle Laser Pro-U: apparaten uit de
 * kliniek, geen beleefdheidsvorm.
 *
 * Wat overblijft is de u in kleine letters, want productnamen schrijven hem groot, plus
 * de u aan het begin van een zin als er een gewoon woord achteraan komt.
 */
const U_VORM = /(^|[\s(])u(?=[\s.,;:!?)])|\buw\b|(?:^|[.!?"]\s+)U\s+[a-z]/gu;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

/*
 * De routes komen uit de app-map en niet uit de sitemap.
 *
 * Dat was mijn eerste opzet, en die controleerde eenenveertig pagina's terwijl de build er
 * negenennegentig maakt: de sitemap bevat alleen behandelingen en huidproblemen. Alle
 * statische pagina's en de hele apparatuurreeks stonden er niet in, en laat dat nou net de
 * pagina's zijn waar ik de vlaggen op vond. Een controle die zijn lijst uit een
 * onvolledige bron haalt, meldt met veel vertrouwen dat er niets aan de hand is.
 *
 * (De sitemap zelf is daarmee ook een bevinding. Die staat in het verslag, niet hier.)
 */
const { readdirSync, statSync } = await import("fs");
const { join, relative, sep } = await import("path");

function zoekPaginas(map) {
  const uit = [];
  for (const naam of readdirSync(map)) {
    const vol = join(map, naam);
    if (statSync(vol).isDirectory()) uit.push(...zoekPaginas(vol));
    else if (naam === "page.tsx") uit.push(map);
  }
  return uit;
}

/* De dynamische routes vullen we met de slugs uit de sitemap plus de apparatuur. */
await page.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await page.content();
const uitSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);

/**
 * Dynamische routes die noch in de sitemap noch onder src/app als eigen bestand staan.
 *
 * Dit stond hier eerst alleen voor apparatuur, met de slugs hardgeplakt in één blok. Toen
 * /vergoedingen/[slug] zes echte pagina's kreeg, telde de controle nog steeds 81 en zag hij
 * die zes niet. Er stond prompt een u-vorm op die er niet hoorde, en de controle zweeg.
 *
 * Vandaar per overzichtspagina de links eronder oogsten. Komt er een nieuwe dynamische
 * reeks bij, dan hoort zijn overzichtspagina hier in de lijst.
 */
const OVERZICHTEN = [
  { pad: "/apparatuur", voorvoegsel: "/apparatuur/" },
  { pad: "/vergoedingen", voorvoegsel: "/vergoedingen/" },
];

const uitOverzichten = [];
for (const { pad, voorvoegsel } of OVERZICHTEN) {
  await page.goto(`${BASIS}${pad}`, { waitUntil: "networkidle" });
  const gevonden = await page.evaluate(
    (v) =>
      [...document.querySelectorAll(`a[href^='${v}']`)]
        .map((a) => a.getAttribute("href"))
        .filter((h, i, l) => l.indexOf(h) === i),
    voorvoegsel,
  );
  uitOverzichten.push(...gevonden);
}
const apparaatSlugs = uitOverzichten;

const statisch = zoekPaginas(join(process.cwd(), "src", "app"))
  .map(
    (m) =>
      "/" +
      relative(join(process.cwd(), "src", "app"), m)
        .split(sep)
        /* Een segment tussen haakjes is een routegroep: `(nl)` en `(en)` ordenen de
           mappen maar staan niet in het adres. src/app/(nl)/tarieven is /tarieven. */
        .filter((deel) => !/^\(.*\)$/.test(deel))
        .join("/"),
  )
  .map((p) => (p === "/." || p === "/" ? "/" : p))
  .filter((p) => !p.includes("["));

const paden = [...new Set([...statisch, ...uitSitemap, ...apparaatSlugs])]
  /* Routes die geen pagina voor bezoekers zijn.
     `/dev/components` is de etalage waarin elk component met placeholders staat; daar
     hóren de vlaggen, dat is precies waar hij voor is. */
  .filter((p) => !p.startsWith("/api") && !p.startsWith("/dev"))
  .sort();

if (paden.length === 0) {
  console.error("Geen routes gevonden.");
  process.exit(1);
}

const problemen = [];

/*
 * Eén bezoek per pagina, en `domcontentloaded` in plaats van `networkidle`.
 *
 * De eerste versie liep elke pagina twee keer af en wachtte elke keer tot het netwerk
 * stil was. Bij tweeëntachtig pagina's liep de dev-server daarop vast met
 * ERR_INSUFFICIENT_RESOURCES, ergens rond de zestigste. Voor wat we hier meten (tekst en
 * breedte) is wachten op de laatste afbeelding niet nodig.
 */
const mobiel = await browser.newPage({ ...devices["iPhone SE"] });

for (const pad of paden) {
  const res = await page.goto(BASIS + pad, { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) {
    problemen.push(`${pad}: status ${res ? res.status() : "geen antwoord"}`);
    continue;
  }

  const { tekst, alts } = await page.evaluate(() => ({
    tekst: document.querySelector("main")?.innerText ?? "",
    /* Alt-teksten staan niet in innerText en worden dus nooit gezien, terwijl een
       schermlezer ze wél voorleest. Een vlag hoort daar net zo min. */
    alts: [...document.querySelectorAll("main img[alt]")].map((i) =>
      i.getAttribute("alt"),
    ),
  }));

  const vlaggen = tekst.match(VLAG);
  if (vlaggen) {
    problemen.push(`${pad}: vlag in beeld ${[...new Set(vlaggen)].join(", ")}`);
  }

  const vlagInAlt = alts.filter((a) => VLAG.test(a));
  if (vlagInAlt.length > 0) {
    problemen.push(`${pad}: vlag in alt-tekst "${vlagInAlt[0]}"`);
  }

  /* De vertaalde tegenhanger van een pagina volgt dezelfde uitzondering: /en/referrers en
     /es/derivaciones zijn dezelfde pagina als /verwijzers, alleen in een andere taal.

     Het voorvoegsel eraf is genoeg; de slug erachter hoeft niet terugvertaald te worden,
     want de uitzonderingen gelden per pagina en die staan hieronder toch al met hun
     Nederlandse naam. Wat wél moet: elke taal, en niet alleen /en. Toen het Spaans erbij
     kwam meldde deze regel /es/derivaciones als overtreding terwijl /verwijzers de u-vorm
     juist hóórt te gebruiken. */
  const kaalPad = nederlandsPad(pad);
  /* Alleen op het Nederlands. De u-vorm is een regel over de Nederlandse aanspreekvorm;
     in het Spaans is "u" het woord voor "of" vóór een o- ("marrones u oscuras") en meldde
     deze regel dus onzin. Het Engels kent het woord helemaal niet. */
  if (nederlandsPad(pad) === pad && !JURIDISCH.includes(kaalPad)) {
    const u = tekst.match(U_VORM);
    if (u) {
      const regel = tekst
        .split("\n")
        .find((r) => U_VORM.test(r))
        ?.trim()
        .slice(0, 70);
      problemen.push(`${pad}: u-vorm in "${regel ?? u[0]}"`);
    }
  }

  if (tekst.includes("—")) {
    const regel = tekst.split("\n").find((r) => r.includes("—"));
    problemen.push(`${pad}: kastlijntje in "${regel.trim().slice(0, 60)}"`);
  }

  /* Overloop meet je op de smalste telefoon die we aanhouden, niet op een bureaublad. */
  await mobiel.goto(BASIS + pad, { waitUntil: "domcontentloaded" });
  /* Terug naar de scrollbreedte. De variant die de pagina opzij probeerde te duwen zag de
     echte overloop niet: een scrollvlak binnen `overflow-x: clip` lekt zijn breedte door in
     de pagina zonder dat `scrollTo` meegeeft. Zie controleer-mobiel.mjs. */
  const over = await mobiel.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  if (over > 0) {
    problemen.push(`${pad}: ${over}px horizontale overloop op mobiel`);
  }
}

/*
 * De cijfers van §11, op de homepage van elke taal.
 *
 * WAAROM DIT EEN EIGEN CONTROLE IS. De regel "alleen deze cijfers" ging tot nu toe over de
 * bron: staat er geen ander getal in de teksten. Dat dekt niet wat de opmaak ermee doet.
 * Op 15 september 2026 kreeg `getal()` een standaard van nul decimalen, en daarmee werd het
 * Zorgkaart-cijfer 9,7 in alle drie de talen een ronde 10. Geen enkele meting zag dat: het
 * is geen Nederlands woord, geen verkeerde notatie en geen vlag — het is gewoon een ander
 * cijfer dan wat er hoort te staan.
 *
 * Drie pagina's, vier exacte tekenreeksen per taal, geen valse meldingen.
 */
const site = readFileSync("src/lib/site.ts", "utf8");
const uitSite = (naam) =>
  Number(site.match(new RegExp(naam + "\\s*[:=]\\s*([0-9.]+)"))?.[1]);

const ZORGKAART = uitSite("score");
const SALONIZED = uitSite("DIBA_SALONIZED_RATING");
const REVIEWS = uitSite("DIBA_SALONIZED_REVIEW_COUNT");

const HOMES = [
  { pad: "/", code: "nl-NL" },
  { pad: "/en", code: "en-GB" },
  { pad: "/es", code: "es-ES" },
];

for (const { pad, code } of HOMES) {
  const res = await page.goto(BASIS + pad, { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) continue;
  const tekst = await page.evaluate(() => document.body.innerText);
  const eendecimaal = new Intl.NumberFormat(code, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const heel = new Intl.NumberFormat(code);
  for (const verwacht of [
    eendecimaal.format(ZORGKAART),
    eendecimaal.format(SALONIZED),
    heel.format(REVIEWS),
  ]) {
    if (!tekst.includes(verwacht)) {
      problemen.push(`${pad}: cijfer "${verwacht}" staat niet op de pagina`);
    }
  }
}

await browser.close();

if (problemen.length) {
  console.error(
    `${problemen.length} probleem(en) op ${paden.length} pagina's:\n` +
      problemen.map((p) => ` - ${p}`).join("\n"),
  );
  process.exit(1);
}
console.log(`ok — ${paden.length} pagina's gecontroleerd, geen overtredingen`);
