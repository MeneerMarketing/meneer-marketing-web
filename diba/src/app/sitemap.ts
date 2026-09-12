import { execSync } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, relative, sep } from "path";
import type { MetadataRoute } from "next";
import { INSURERS } from "@/data/insurers";
import { APPARATUUR } from "@/data/apparatuur";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { TOEPASSINGEN } from "@/data/toepassingen";
import { LANDINGS } from "@/data/landings";
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
const OVERSLAAN = /^\/(dev|resultaten|laserontharing\/configurator)(\/|$)/;

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
    route === "/tarieven" ||
    route === "/contact" ||
    route === "/laserontharing"
  )
    return 0.8;
  /* De landingspagina's: waar iemand terechtkomt die "X rotterdam" zoekt. Even zwaar als
     de behandelpagina's, want het is dezelfde koopvraag met de plaats erbij. */
  if (route.startsWith("/kennisbank/")) return 0.8;
  if (route.startsWith("/apparatuur")) return 0.6;
  if (route.startsWith("/vergoedingen")) return 0.6;
  /* De juridische pagina's horen erin te staan maar hoeven niet vaak nagelopen. */
  if (/^\/(privacybeleid|cookiebeleid|algemene-voorwaarden)$/.test(route))
    return 0.3;
  return 0.7;
}

/** Hoe vaak de inhoud verandert. Een prijslijst vaker dan de algemene voorwaarden. */
function frequentie(route: string): "weekly" | "monthly" | "yearly" {
  if (route === "/" || route === "/tarieven" || route === "/reviews")
    return "weekly";
  if (
    /^\/(privacybeleid|cookiebeleid|algemene-voorwaarden|klachten|werken-bij)$/.test(
      route,
    )
  )
    return "yearly";
  return "monthly";
}

/**
 * Wanneer een pagina voor het laatst inhoudelijk is veranderd.
 *
 * WAT HIER STOND, EN WAAROM DAT SLECHTER WAS DAN NIETS.
 *
 * `lastModified: new Date()` op elke pagina. Elke build meldde dus dat alle pagina's die dag
 * gewijzigd waren. Google leert daarvan dat het veld bij deze site niets betekent en negeert
 * het, ook op de dag dat er wél iets verandert. Een signaal dat altijd aan staat, is geen
 * signaal.
 *
 * HOE HET NU WERKT.
 *
 * De datum komt uit git: de laatste commit die het bestand van de pagina raakte, of het
 * databestand waar de inhoud uit komt. Eén git-aanroep voor de hele site, een halve seconde.
 * Een landingspagina draagt daarnaast zijn eigen datum (`gewijzigd`), en die telt als hij
 * recenter is.
 *
 * Staat er geen git-geschiedenis op de bouwmachine, dan blijft het veld weg. Weglaten mag en
 * is eerlijk; een verzonnen datum is dat niet.
 */
function commitdatums(): Map<string, number> {
  const uit = new Map<string, number>();
  try {
    const prefix = execSync("git rev-parse --show-prefix", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const log = execSync("git log --format=@%cI --name-only -- src", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    });
    let datum = 0;
    for (const regel of log.split("\n")) {
      if (regel.startsWith("@")) {
        datum = Date.parse(regel.slice(1).trim());
        continue;
      }
      const pad = regel.trim();
      if (!pad || !datum) continue;
      const lokaal =
        prefix && pad.startsWith(prefix) ? pad.slice(prefix.length) : pad;
      if (!uit.has(lokaal)) uit.set(lokaal, datum);
    }
  } catch {
    /* Geen git op de bouwmachine: dan geen datums, zie hierboven. */
  }
  return uit;
}

export default function sitemap(): MetadataRoute.Sitemap {
  /* Per route de bestanden waar de inhoud uit komt. De dynamische eerst, de statische
     daarna: heeft een slug ook een eigen page.tsx, dan is dat bestand de bron. */
  const bronnen = new Map<string, string[]>();
  for (const b of BEHANDELINGEN) {
    bronnen.set(`/behandelingen/${b.slug}`, [
      "src/app/behandelingen/[slug]/page.tsx",
      "src/data/behandelingen.ts",
    ]);
  }
  for (const t of TOEPASSINGEN) {
    bronnen.set(`/behandelingen/${t.behandeling}/${t.slug}`, [
      "src/app/behandelingen/[slug]/[toepassing]/page.tsx",
      "src/data/toepassingen.ts",
    ]);
  }
  for (const a of APPARATUUR) {
    bronnen.set(`/apparatuur/${a.slug}`, [
      "src/app/apparatuur/[slug]/page.tsx",
      "src/data/apparatuur.ts",
    ]);
  }
  for (const i of INSURERS) {
    bronnen.set(`/vergoedingen/${i.slug}`, [
      "src/app/vergoedingen/[slug]/page.tsx",
      "src/data/insurers.ts",
    ]);
  }
  for (const l of LANDINGS) {
    bronnen.set(`/kennisbank/${l.slug}`, [
      "src/components/kennisbank/LandingPagina.tsx",
      `src/data/landings/${l.slug}.ts`,
    ]);
  }
  for (const route of statischeRoutes()) {
    const eigen =
      route === "/" ? "src/app/page.tsx" : `src/app${route}/page.tsx`;
    /* Veel pagina's halen hun tekst uit een databestand met dezelfde naam, zoals
       /huidproblemen/acne uit data/acne.ts. Staat dat er, dan telt het mee. */
    const laatste = route.split("/").filter(Boolean).pop();
    const data = laatste ? `src/data/${laatste}.ts` : "";
    bronnen.set(
      route,
      data && existsSync(join(process.cwd(), data)) ? [eigen, data] : [eigen],
    );
  }

  const datums = commitdatums();
  const nieuwste = Math.max(0, ...datums.values());
  const landingDatum = new Map(
    LANDINGS.map((l) => [`/kennisbank/${l.slug}`, Date.parse(l.gewijzigd)]),
  );

  const laatstGewijzigd = (route: string): Date | undefined => {
    /* De homepage toont stukken van de hele site, dus hij verandert als de site verandert. */
    if (route === "/") return nieuwste ? new Date(nieuwste) : undefined;
    const kandidaten = (bronnen.get(route) ?? [])
      .map((b) => datums.get(b) ?? 0)
      .concat(landingDatum.get(route) ?? 0);
    const datum = Math.max(0, ...kandidaten);
    return datum ? new Date(datum) : undefined;
  };

  /* Een slug kan zowel een eigen page.tsx als een record in de data hebben. Dan staat hij
     er twee keer in, en een dubbele URL in een sitemap is een fout. */
  const uniek = [...new Set(bronnen.keys())].sort();

  return uniek.map((route) => {
    const datum = laatstGewijzigd(route);
    return {
      url: `${DIBA_SITE_URL}${route === "/" ? "" : route}`,
      ...(datum ? { lastModified: datum } : {}),
      changeFrequency: frequentie(route),
      priority: gewicht(route),
    };
  });
}
