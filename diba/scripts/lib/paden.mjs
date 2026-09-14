import { readFileSync } from "node:fs";

/**
 * Welke adressen een controle moet aflopen.
 *
 * WAAROM DIT NIET GEWOON DE SITEMAP IS.
 *
 * De sitemap draagt alleen de talen die in Google mogen. Een taal waarvan de vertaling nog
 * loopt staat er met opzet niet in (zie `TAAL_AF` in lib/taal.ts) — en dat is juist
 * de taal waar een controle het hardst nodig is: langere zinnen breken knoppen, plakken
 * woorden aan elkaar en duwen tekst uit zijn vlak. Toen het Spaans erbij kwam liepen
 * `spaties`, `knoppen` en `uitblok` er alle drie omheen.
 *
 * Dit neemt de Nederlandse adressen uit de sitemap en zet er per vreemde taal het vertaalde
 * adres bij, met de slugtabellen uit `lib/slugs.ts`. Eén bron, en een nieuwe taal komt er
 * vanzelf bij.
 */

/** De vreemde talen uit lib/taal.ts. */
export function vreemdeTalen() {
  const bron = readFileSync("src/lib/taal.ts", "utf8");
  const blok = bron.split("export const VREEMDE_TALEN = [")[1].split("]")[0];
  return [...blok.matchAll(/"([a-z]{2})"/g)].map((m) => m[1]);
}

/** De slugtabel van een taal: Nederlands segment naar dat van die taal. */
export function slugtabel(taal) {
  const bron = readFileSync("src/lib/slugs.ts", "utf8");
  const blok = bron.split(`const NAAR_${taal.toUpperCase()}`)[1].split("};")[0];
  const uit = new Map();
  for (const m of blok.matchAll(/^\s*"?([A-Za-z0-9-]+)"?:\s*"([^"]+)",/gm)) {
    uit.set(m[1], m[2]);
  }
  return uit;
}

/** In welke taal staat dit pad? */
export function taalVanPad(pad, talen = vreemdeTalen()) {
  const eerste = pad.split("/")[1] ?? "";
  return talen.includes(eerste) ? eerste : "nl";
}

/** Het adres van een Nederlands pad in een andere taal. */
export function inTaal(pad, taal, tabel = slugtabel(taal)) {
  if (pad === "/") return `/${taal}`;
  const delen = pad
    .split("/")
    .filter(Boolean)
    .map((d) => tabel.get(d) ?? d);
  return `/${taal}/${delen.join("/")}`;
}

/**
 * Alle adressen van de site, in alle talen.
 *
 * `alleenTalen` beperkt de vreemde talen; laat hem weg voor allemaal. Het Nederlands zit er
 * altijd bij, want dat is de bron waar de rest uit volgt.
 */
export async function alleAdressen(basis, { alleenTalen } = {}) {
  const xml = await (await fetch(`${basis}/sitemap.xml`)).text();
  const talen = vreemdeTalen();
  const nl = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => taalVanPad(p, talen) === "nl")
    .filter((p, i, a) => a.indexOf(p) === i)
    .sort();

  const uit = [...nl];
  for (const taal of alleenTalen ?? talen) {
    const tabel = slugtabel(taal);
    for (const p of nl) uit.push(inTaal(p, taal, tabel));
  }
  return uit;
}
