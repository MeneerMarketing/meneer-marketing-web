import { readdirSync, readFileSync } from "fs";
import { join, relative, sep } from "path";
import type { MetadataRoute } from "next";
import { INSURERS } from "@/data/insurers";
import { APPARATUUR } from "@/data/apparatuur";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { DOELGROEPEN } from "@/data/doelgroep";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * De sitemap leidt zichzelf af uit de routes.
 *
 * WAT ER MIS WAS.
 *
 * Hier stond een lijst die met de hand werd bijgehouden: `STATISCH_GEREED` met één route
 * erin (de homepage) en `STATISCH_IN_AANBOUW` met zestig routes die "nog niet af" waren.
 * Het idee erachter was goed — meld niets bij Google aan wat nog uit placeholders bestaat —
 * maar de uitkomst was dat de sitemap 23 van de 103 pagina's noemde, en dat de rijkste
 * pagina's van de site er allemaal buiten vielen. Elke huidprobleempagina, alle apparatuur,
 * alle prijzen.
 *
 * Belangrijker: dat gat beschermde niemand meer. De noindex is er in augustus 2026 op
 * verzoek afgehaald, dus Google vindt deze pagina's toch, via de navigatie en de interne
 * links. Ze buiten de sitemap houden vertraagde alleen het ontdekken en gooide de
 * lastmod-signalen weg. Een handrem die niet remt.
 *
 * HOE HET NU WERKT.
 *
 * De lijst komt uit de app-map zelf. Elke map met een page.tsx is een route, behalve:
 * - routes die alleen doorverwijzen (die hebben een canonical naar hun bestemming);
 * - /dev en de andere werkroutes;
 * - dynamische segmenten, want die worden hieronder uit de data uitgeklapt.
 *
 * Daarmee kan de sitemap niet meer achterlopen op de site: een nieuwe pagina staat er
 * vanzelf in. Vergeten is geen optie meer, en dat was het bij een handmatige lijst wel.
 *
 * Dit draait tijdens `next build` in Node, dus `fs` mag hier.
 */

const APP = join(process.cwd(), "src", "app");

/**
 * Routes die bestaan maar niet in een sitemap horen.
 *
 * Naast de werkroutes staan hier de twee pagina's die tijdelijk dichtstaan (Yasin,
 * 5 september 2026): /resultaten en de laserconfigurator. Hun adres verwijst door, en een
 * sitemap die naar een doorverwijzing wijst is een fout die Search Console meldt.
 *
 * Zodra ze weer opengaan: hier weghalen en de twee regels in redirects.ts.
 */
const OVERSLAAN =
  /^\/(dev|preview-login|home-variant|resultaten|laserontharing\/configurator)(\/|$)/;

/** Alle statische routes met een eigen pagina, gevonden in de app-map. */
function statischeRoutes(): string[] {
  const uit: string[] = [];

  const loop = (map: string) => {
    for (const item of readdirSync(map, { withFileTypes: true })) {
      const pad = join(map, item.name);
      if (item.isDirectory()) {
        loop(pad);
        continue;
      }
      if (item.name !== "page.tsx") continue;

      const rel = relative(APP, map).split(sep).join("/");
      const route = rel === "" ? "/" : `/${rel}`;

      /* Een dynamisch segment levert geen eigen URL op; die komen uit de data. */
      if (route.includes("[")) continue;
      if (OVERSLAAN.test(route)) continue;

      /* Een route die alleen doorverwijst is geen bestemming. Hij mag bestaan voor oude
         links, maar in de sitemap zou hij Google naar een 308 sturen. */
      const bron = readFileSync(pad, "utf8");
      if (/permanentRedirect\(|\bredirect\(/.test(bron)) continue;

      uit.push(route);
    }
  };

  loop(APP);
  return uit.sort();
}

/**
 * Hoe belangrijk een pagina is ten opzichte van de rest van deze site.
 *
 * Google gebruikt `priority` alleen binnen één domein, om te wegen waar hij zijn
 * crawlbudget aan besteedt. De volgorde volgt waarvoor mensen komen: eerst de klacht
 * waarmee ze zoeken, dan de behandeling, dan de rest.
 */
function gewicht(route: string): number {
  if (route === "/") return 1;
  if (route.startsWith("/huidproblemen/")) return 0.9;
  if (route === "/huidproblemen" || route === "/behandelingen") return 0.85;
  if (route.startsWith("/behandelingen/")) return 0.8;
  if (
    route === "/prijzen" ||
    route === "/contact" ||
    route === "/laserontharing"
  )
    return 0.8;
  if (route.startsWith("/apparatuur")) return 0.6;
  if (route.startsWith("/vergoedingen")) return 0.6;
  if (route.startsWith("/doelgroep")) return 0.6;
  /* De juridische pagina's horen erin te staan maar hoeven niet vaak nagelopen. */
  if (
    /^\/(privacybeleid|cookiebeleid|algemene-voorwaarden|klachten)$/.test(route)
  )
    return 0.3;
  return 0.7;
}

/** Hoe vaak de inhoud verandert. Een prijslijst vaker dan de algemene voorwaarden. */
function frequentie(route: string): "weekly" | "monthly" | "yearly" {
  if (route === "/" || route === "/prijzen" || route === "/reviews")
    return "weekly";
  if (
    /^\/(privacybeleid|cookiebeleid|algemene-voorwaarden|klachten|werken-bij)$/.test(
      route,
    )
  )
    return "yearly";
  return "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const nu = new Date();

  const routes = [
    ...statischeRoutes(),
    ...BEHANDELINGEN.map((b) => `/behandelingen/${b.slug}`),
    ...APPARATUUR.map((a) => `/apparatuur/${a.slug}`),
    ...INSURERS.map((i) => `/vergoedingen/${i.slug}`),
    ...DOELGROEPEN.map((d) => `/doelgroep/${d.slug}`),
  ];

  /* Een slug kan zowel een eigen page.tsx als een record in de data hebben. Dan staat hij
     er twee keer in, en een dubbele URL in een sitemap is een fout. */
  const uniek = [...new Set(routes)].sort();

  return uniek.map((route) => ({
    url: `${DIBA_SITE_URL}${route === "/" ? "" : route}`,
    lastModified: nu,
    changeFrequency: frequentie(route),
    priority: gewicht(route),
  }));
}
