/**
 * Doen de omleidingen wat ze beloven?
 *
 * WAT ER MIS KAN GAAN, EN WAAROM JE HET NIET ZIET.
 *
 * Een omleiding is de enige regel op deze site die je nooit tegenkomt terwijl je zelf aan
 * het klikken bent: hij geldt alleen voor adressen die hier niet meer bestaan. Kapot gaat
 * hij dus in stilte, en je hoort het pas van Google.
 *
 * Drie dingen worden hier gemeten, per regel uit `redirects.ts`, `redirects-en.ts` en
 * `redirects-oud.ts`:
 *
 *   1. LEIDT HIJ OM. Geeft het oude adres een 3xx? Zo niet, dan staat de regel er wel maar
 *      doet hij niets.
 *
 *   2. BESTAAT DE BESTEMMING, EN IN ÉÉN SPRONG. Elke extra sprong is een verzoek erbij, en
 *      Google geeft door een ketting minder van de opgebouwde waarde door. Komt de
 *      bestemming zelf op een 404 uit, dan is de omleiding erger dan geen omleiding: dan
 *      zag Google een verhuizing naar een pagina die er niet is.
 *
 *   3. OVERSCHADUWT HIJ EEN EIGEN PAGINA. Dit is de gevaarlijke. Next handelt omleidingen
 *      af vóór de routes, dus een bron die ook een pagina van ons is, maakt die pagina
 *      onbereikbaar — zonder foutmelding, in elke taal tegelijk. Toen de lijst met oude
 *      WordPress-adressen binnenkwam zaten /es en /es/tratamientos erin; dat waren
 *      inmiddels onze eigen Spaanse pagina's.
 *
 * Takken met een patroon (`/blog/:pad*`) worden getoetst met een verzonnen adres eronder,
 * want het patroon zelf is geen adres.
 *
 *   BASIS=http://localhost:3021 npm run omleidingen
 */
import { readFileSync } from "node:fs";
import { alleAdressen } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/** De regels uit een tabelbestand. `{ source: "...", destination: "..." }`. */
function tabel(bestand) {
  const bron = readFileSync(bestand, "utf8");
  return [
    ...bron.matchAll(
      /source:\s*"((?:[^"\\]|\\.)*)"\s*,\s*destination:\s*"((?:[^"\\]|\\.)*)"/g,
    ),
  ].map((m) => ({ source: m[1], destination: m[2], bestand }));
}

const regels = [
  ...tabel("src/data/redirects.ts"),
  ...tabel("src/data/redirects-en.ts"),
  ...tabel("src/data/redirects-oud.ts"),
];

/** Een patroon is geen adres: `/blog/:pad*` wordt `/blog/iets-ouds`. */
function alsAdres(source) {
  return source.replace(/\/:[A-Za-z]+\*?/g, "/iets-ouds-van-vroeger");
}

/** Waar kom je uit, en in hoeveel sprongen? */
async function volg(pad, stappen = 0) {
  const r = await fetch(BASIS + pad, { redirect: "manual" });
  const naar = r.headers.get("location");
  if (naar && stappen < 6) {
    return volg(naar.replace(/^https?:\/\/[^/]+/, ""), stappen + 1);
  }
  return { pad, code: r.status, stappen };
}

const eigenPaginas = new Set(await alleAdressen(BASIS));

const stil = [];
const stuk = [];
const ketting = [];
const schaduw = [];
const dubbel = [];

const gezien = new Set();
for (const r of regels) {
  if (gezien.has(r.source)) dubbel.push(r);
  gezien.add(r.source);

  /* Een bron die ook een eigen pagina is, wordt door de omleiding opgeslokt. */
  if (eigenPaginas.has(r.source)) schaduw.push(r);

  const uit = await volg(alsAdres(r.source));
  if (uit.stappen === 0) stil.push({ ...r, code: uit.code });
  else if (uit.code !== 200) stuk.push({ ...r, eind: uit.pad, code: uit.code });
  else if (uit.stappen > 1)
    ketting.push({ ...r, eind: uit.pad, n: uit.stappen });
}

const toon = (kop, lijst, regel) => {
  if (!lijst.length) return;
  console.log(`\n${kop} (${lijst.length})`);
  for (const r of lijst) console.log("   " + regel(r));
};

console.log(
  `\n${regels.length} omleidingen nagelopen op ${BASIS}, en ${eigenPaginas.size} eigen adressen ernaast gelegd.`,
);

toon(
  "OVERSCHADUWT EEN EIGEN PAGINA — deze pagina is niet meer te bereiken",
  schaduw,
  (r) => `${r.source} -> ${r.destination}   (${r.bestand})`,
);
toon(
  "BESTEMMING BESTAAT NIET",
  stuk,
  (r) => `${r.source} -> ${r.destination}   eindigt op ${r.eind} (${r.code})`,
);
toon(
  "LEIDT NIET OM — de regel staat er, maar het adres blijft waar het is",
  stil,
  (r) => `${r.source}   geeft ${r.code}`,
);
toon(
  "KETTING — meer dan een sprong",
  ketting,
  (r) =>
    `${r.source} -> ${r.destination}   ${r.n} sprongen, eindigt op ${r.eind}`,
);
toon("DUBBELE BRON — alleen de eerste telt", dubbel, (r) => r.source);

const fout =
  schaduw.length + stuk.length + stil.length + ketting.length + dubbel.length;
if (fout === 0) {
  console.log(
    "\nok — elk oud adres komt in een sprong op een bestaande pagina uit, en geen enkele omleiding staat voor een eigen pagina.",
  );
} else {
  process.exitCode = 1;
}
