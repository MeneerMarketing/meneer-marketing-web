/**
 * Wijst de canonical naar het adres dat we ook echt uitleveren?
 *
 * WAT ER MIS WAS. `DIBA_SITE_URL` stond op https://dibaclinics.nl en de site wordt
 * uitgeleverd op https://www.dibaclinics.nl. Dat ene getal loopt door alles heen: de
 * canonical, de sitemap, hreflang, og:url en de verwijzing naar de sitemap in robots.txt.
 * Alle 312 canonicals wezen dus naar een adres dat met een 308 doorstuurt (gemeten
 * 15 september 2026). Zie de toelichting in `lib/site.ts`.
 *
 * WAAROM DIT EEN CONTROLE VERDIENT. Het is één regel, hij staat goed of fout, en het valt
 * op geen enkele manier op: de site werkt, elke pagina laadt, elke link doet het. Je hoort
 * het pas van Google, maanden later.
 *
 * WAT HIER GEMETEN WORDT.
 *
 *   1. Geeft `DIBA_SITE_URL` zelf een 200, of stuurt hij door?
 *   2. Doet de andere schrijfwijze wat hij hoort te doen — doorsturen naar de onze, en niet
 *      allebei een 200 geven? Twee adressen die allebei dezelfde pagina uitleveren is de
 *      klassieke dubbele-inhoudsval.
 *   3. Komt de canonical die wij op een pagina zetten overeen met de host die hem uitlevert?
 *
 * Dit praat met de live site, want daar zit de vraag. Zonder netwerk slaat hij over.
 *
 *   npm run basisadres
 *   BASIS=https://staging.example.nl npm run basisadres
 */
import { readFileSync } from "node:fs";

const bron = readFileSync("src/lib/site.ts", "utf8");
/** Wat er in de code staat: het adres dat in elke canonical terechtkomt. */
const INGESTELD =
  /export const DIBA_SITE_URL = "([^"]+)"/.exec(bron)?.[1] ?? "";
/**
 * Waar we het gaan halen.
 *
 * Standaard het ingestelde adres zelf, want daar zit de vraag. Met `BASIS` kun je de
 * pagina's van een bouw op localhost lezen; de canonical wordt dan nog steeds vergeleken
 * met wat er in de code staat, want dat is wat er straks in productie uitgaat.
 */
const HAAL = process.env.BASIS ?? INGESTELD;

if (!INGESTELD) {
  console.log("DIBA_SITE_URL niet gevonden in src/lib/site.ts");
  process.exitCode = 1;
}

/** De andere schrijfwijze: met www als wij zonder staan, en omgekeerd. */
function andereVorm(url) {
  return url.includes("://www.")
    ? url.replace("://www.", "://")
    : url.replace("://", "://www.");
}

async function kijk(url) {
  try {
    const r = await fetch(url, { redirect: "manual" });
    return { code: r.status, naar: r.headers.get("location") ?? "" };
  } catch (e) {
    return { fout: String(e.message ?? e) };
  }
}

const fouten = [];

console.log(`\nIngesteld als basis: ${INGESTELD}\n`);

const eigen = await kijk(INGESTELD);
if (eigen.fout) {
  console.log(`  geen verbinding (${eigen.fout}) — controle overgeslagen.`);
  process.exit(0);
}

if (eigen.code >= 300 && eigen.code < 400) {
  console.log(
    `  FOUT  ${INGESTELD} geeft ${eigen.code} en stuurt door naar ${eigen.naar}`,
  );
  console.log(
    `        Elke canonical, hreflang en og:url wijst dus naar een adres dat doorstuurt.`,
  );
  console.log(
    `        Zet DIBA_SITE_URL in src/lib/site.ts op ${eigen.naar.replace(/\/$/, "")}.`,
  );
  fouten.push("basis stuurt door");
} else if (eigen.code !== 200) {
  console.log(`  FOUT  ${INGESTELD} geeft ${eigen.code}`);
  fouten.push("basis geeft geen 200");
} else {
  console.log(`  ok    ${INGESTELD} geeft 200`);
}

const ander = await kijk(andereVorm(INGESTELD));
if (ander.fout) {
  console.log(`  ?     ${andereVorm(INGESTELD)} niet te bereiken`);
} else if (ander.code === 200) {
  console.log(
    `  FOUT  ${andereVorm(INGESTELD)} geeft óók een 200. Twee adressen met dezelfde inhoud.`,
  );
  fouten.push("beide schrijfwijzen leveren uit");
} else {
  console.log(
    `  ok    ${andereVorm(INGESTELD)} geeft ${ander.code} naar ${ander.naar || "(onbekend)"}`,
  );
}

/* En wat staat er in de pagina zelf? */
try {
  const html = await (await fetch(`${HAAL}/tarieven`)).text();
  const canon = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
  if (!canon) {
    console.log("  ?     geen canonical gevonden op /tarieven");
  } else if (canon.startsWith(INGESTELD)) {
    console.log(`  ok    de canonical op /tarieven staat op ${canon}`);
  } else {
    console.log(`  FOUT  de canonical op /tarieven staat op ${canon}`);
    console.log(`        maar DIBA_SITE_URL staat op ${INGESTELD}`);
    fouten.push("canonical wijkt af van de host");
  }
} catch {
  console.log("  ?     /tarieven niet op te halen");
}

console.log(
  fouten.length === 0
    ? "\nok — de canonical wijst naar het adres dat de site ook uitlevert."
    : `\n${fouten.length} probleem/problemen.`,
);
if (fouten.length) process.exitCode = 1;
