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
import {
  anderePad,
  taalAlternatieven,
  taalVanPad,
  TAAL_AF,
  VREEMDE_TALEN,
} from "@/lib/taal";

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

/**
 * Alle statische routes met een eigen pagina, gevonden in de app-map.
 *
 * Per route komt ook het bestand mee waar hij uit komt. Dat was eerst af te leiden uit het
 * adres, maar sinds de routegroepen `(nl)` en `(en)` klopt dat niet meer: /tarieven woont
 * in src/app/(nl)/tarieven. De commitdatum wordt met dat pad opgezocht, dus zonder dit
 * kreeg elke pagina de datum van de hele site.
 */
function statischeRoutes(): { route: string; bestand: string }[] {
  const uit: { route: string; bestand: string }[] = [];

  const loop = (map: string) => {
    for (const item of readdirSync(map, { withFileTypes: true })) {
      const pad = join(map, item.name);
      if (item.isDirectory()) {
        loop(pad);
        continue;
      }
      if (item.name !== "page.tsx") continue;

      /* Een segment tussen haakjes is een routegroep: die ordent de mappen maar staat niet
         in het adres. src/app/(nl)/tarieven is gewoon /tarieven. */
      const rel = relative(APP, map)
        .split(sep)
        .filter((deel) => !/^\(.*\)$/.test(deel))
        .join("/");
      const route = rel === "" ? "/" : `/${rel}`;

      /* Een dynamisch segment levert geen eigen URL op; die komen uit de data. */
      if (route.includes("[")) continue;
      if (OVERSLAAN.test(route)) continue;

      /* Een route die alleen doorverwijst is geen bestemming. Hij mag bestaan voor oude
         links, maar in de sitemap zou hij Google naar een 308 sturen. */
      const bron = readFileSync(pad, "utf8");
      if (/permanentRedirect\(|\bredirect\(/.test(bron)) continue;

      /* Een pagina die zichzelf op noindex zet hoort hier ook niet. */
      if (/robots:\s*\{\s*index:\s*false/.test(bron)) continue;

      /* En een taal waarvan de vertaling nog loopt ook niet. De wrappers zetten dat
         `noindex` niet meer zelf in hun bron maar krijgen het van `vertaaldeMetadata`, dus
         de regex hierboven ziet het niet; dit leest dezelfde schakelaar. */
      if (!TAAL_AF[taalVanPad(route)]) continue;

      uit.push({
        route,
        bestand: `${relative(process.cwd(), pad).split(sep).join("/")}`,
      });
    }
  };

  loop(APP);
  return uit.sort((a, b) => a.route.localeCompare(b.route));
}

/**
 * GEEN `priority` EN GEEN `changefreq`.
 *
 * Hier stonden `gewicht()` en `frequentie()`, die per route een gewicht van 0,3 tot 1 en
 * een frequentie van weekly tot yearly bepaalden. De toelichting erbij zei dat Google
 * `priority` gebruikt om zijn crawlbudget te verdelen. Dat is een hardnekkig verhaal dat
 * nergens op rust: Google negeert allebei de velden, staat zo in Search Central en is
 * meermaals bevestigd door Mueller. Uit het SEO-rapport van Okan, 15 september 2026.
 *
 * Wat wél gelezen wordt is `lastmod`, en die staat er hieronder — uit de git-historie, dus
 * hij zegt iets. Een veld dat niemand leest naast een veld dat dat wel doet, maakt het
 * tweede alleen maar moeilijker te vertrouwen.
 */

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
      "src/app/(nl)/behandelingen/[slug]/page.tsx",
      "src/data/behandelingen.ts",
    ]);
  }
  for (const t of TOEPASSINGEN) {
    bronnen.set(`/behandelingen/${t.behandeling}/${t.slug}`, [
      "src/app/(nl)/behandelingen/[slug]/[toepassing]/page.tsx",
      "src/data/toepassingen.ts",
    ]);
  }
  for (const a of APPARATUUR) {
    bronnen.set(`/apparatuur/${a.slug}`, [
      "src/app/(nl)/apparatuur/[slug]/page.tsx",
      "src/data/apparatuur.ts",
    ]);
  }
  for (const i of INSURERS) {
    bronnen.set(`/vergoedingen/${i.slug}`, [
      "src/app/(nl)/vergoedingen/[slug]/page.tsx",
      "src/data/insurers.ts",
    ]);
  }
  for (const l of LANDINGS) {
    bronnen.set(`/kennisbank/${l.slug}`, [
      "src/components/kennisbank/LandingPagina.tsx",
      `src/data/landings/${l.slug}.ts`,
    ]);
  }
  for (const { route, bestand: eigen } of statischeRoutes()) {
    /* Veel pagina's halen hun tekst uit een databestand met dezelfde naam, zoals
       /huidproblemen/acne uit data/acne.ts. Staat dat er, dan telt het mee. */
    const laatste = route.split("/").filter(Boolean).pop();
    const data = laatste ? `src/data/${laatste}.ts` : "";
    bronnen.set(
      route,
      data && existsSync(join(process.cwd(), data)) ? [eigen, data] : [eigen],
    );
  }

  /* Elke Nederlandse pagina heeft een tegenhanger per vreemde taal, op vier na. Die
     stonden hier alleen als ze een eigen bestand hadden, en dat hebben de pagina's met een
     slug niet: /en/treatments/hydrafacial komt uit de route [slug]. Er stonden daardoor
     59 Engelse adressen in de sitemap tegenover 156 Nederlandse, terwijl ze alle 152
     bestaan. Ze delen hun bron met het Nederlands en dus ook hun datum: de tekst komt uit
     hetzelfde bestand, alleen door het woordenboek.

     Een taal die nog niet geïndexeerd wordt staat er niet in. Een sitemap is een
     uitnodiging om te komen kijken, en dat hoort niet te gelden voor pagina's die zelf
     `noindex` dragen omdat hun vertaling nog loopt. Zie `TAAL_AF` in lib/taal.ts. */
  for (const [route, bron] of [...bronnen]) {
    if (taalVanPad(route) !== "nl") continue;
    for (const taal of VREEMDE_TALEN) {
      if (!TAAL_AF[taal]) continue;
      const ander = anderePad(route, taal);
      if (ander) bronnen.set(ander, bron);
    }
  }

  const datums = commitdatums();
  const nieuwste = Math.max(0, ...datums.values());
  const landingDatum = new Map(
    LANDINGS.map((l) => [`/kennisbank/${l.slug}`, Date.parse(l.gewijzigd)]),
  );

  const laatstGewijzigd = (route: string): Date | undefined => {
    /* De homepage toont stukken van de hele site, dus hij verandert als de site verandert. */
    if (route === "/" || VREEMDE_TALEN.some((t) => route === `/${t}`))
      return nieuwste ? new Date(nieuwste) : undefined;
    const kandidaten = (bronnen.get(route) ?? [])
      .map((b) => datums.get(b) ?? 0)
      .concat(landingDatum.get(route) ?? 0);
    const datum = Math.max(0, ...kandidaten);
    return datum ? new Date(datum) : undefined;
  };

  /* Een slug kan zowel een eigen page.tsx als een record in de data hebben. Dan staat hij
     er twee keer in, en een dubbele URL in een sitemap is een fout. */
  const uniek = [...new Set(bronnen.keys())].sort();

  const heel = (p: string) => `${DIBA_SITE_URL}${p === "/" ? "" : p}`;

  return uniek.map((route) => {
    const datum = laatstGewijzigd(route);
    /* Dezelfde hreflang-verwijzingen als in de kop van de pagina zelf. Google mag ze uit
       de sitemap of uit de HTML halen; twee keer hetzelfde signaal is geen probleem, een
       ontbrekend signaal wel. */
    const talen = taalAlternatieven(route);
    return {
      url: heel(route),
      ...(datum ? { lastModified: datum } : {}),
      ...(talen
        ? {
            alternates: {
              languages: Object.fromEntries(
                Object.entries(talen).map(([taal, p]) => [taal, heel(p)]),
              ),
            },
          }
        : {}),
    };
  });
}
