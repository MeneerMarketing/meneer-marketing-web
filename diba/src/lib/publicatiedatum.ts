import { execSync } from "node:child_process";

/**
 * Wanneer een bestand voor het eerst in de repo kwam: de publicatiedatum van een pagina.
 *
 * WAAROM UIT GIT EN NIET UIT DE DATA. De kennisbankpagina's dragen `gewijzigd`, de dag
 * van de laatste inhoudelijke wijziging, en die vult `dateModified`. Voor `datePublished`
 * is er geen veld, en met de hand een datum verzinnen is precies wat een zoekmachine
 * afstraft zodra hij hem naast de crawlgeschiedenis legt. De eerste commit waarin het
 * databestand verschijnt ís de publicatie, en git weet dat op de seconde.
 *
 * Dezelfde aanpak als `lastmod` in `app/sitemap.ts`: één git-aanroep voor de hele map,
 * daarna uit het geheugen. Staat er geen git-geschiedenis op de bouwmachine, dan komt er
 * `undefined` uit en blijft het veld weg. Weglaten mag; een verzonnen datum niet.
 */
let cache: Map<string, string> | null = null;

function laad(): Map<string, string> {
  if (cache) return cache;
  cache = new Map();
  try {
    /* De repo-wortel ligt boven deze map; git geeft paden vanaf die wortel terug. */
    const prefix = execSync("git rev-parse --show-prefix", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    /* `--diff-filter=A`: alleen de commit waarin het bestand is toegevoegd. Nieuwste eerst,
       dus bij een bestand dat ooit verwijderd en opnieuw toegevoegd is wint de laatste
       toevoeging — en dat is dan ook de publicatie die telt. */
    const log = execSync(
      "git log --diff-filter=A --format=@%cI --name-only -- src/data/landings",
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    let datum = "";
    for (const regel of log.split("\n")) {
      if (regel.startsWith("@")) datum = regel.slice(1).trim();
      else if (regel.trim() && datum) {
        const pad = regel.trim().startsWith(prefix)
          ? regel.trim().slice(prefix.length)
          : regel.trim();
        if (!cache.has(pad)) cache.set(pad, datum);
      }
    }
  } catch {
    /* Geen git: leeg, en dus geen datePublished. */
  }
  return cache;
}

/** ISO-datum van de eerste commit van dit bestand, of `undefined` zonder git. */
export function publicatiedatum(bestand: string): string | undefined {
  return laad().get(bestand);
}
