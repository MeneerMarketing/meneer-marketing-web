import { SEO_CITY_REGISTRY } from "@/data/seo-landings/city-registry";
import type {
  SeoLandingPage,
  SeoLandingSceneBreak,
  SeoLandingStep,
} from "@/data/seo-landings/types";
import {
  cityProfile,
  fill,
  pageVars,
  pick,
  pickMany,
} from "@/lib/seo-landings-voice";

export const CITY_TRIO_BASE_SLUGS = new Set([
  "website-laten-maken",
  "seo-specialist",
]);

type TrioBaseSlug = "website-laten-maken" | "seo-specialist" | "marketing-bureau";

type RegionBucket =
  | "gelderland"
  | "brabant-limburg"
  | "randstad"
  | "utrecht-flevoland"
  | "overijssel-noord";

function resolveBaseSlug(slug: string): string {
  for (const city of SEO_CITY_REGISTRY) {
    const suffix = `-${city.slug}`;
    if (slug.endsWith(suffix)) {
      return slug.slice(0, -suffix.length);
    }
  }
  return slug;
}

function getRegionBucket(region?: string): RegionBucket {
  if (!region) return "gelderland";
  const r = region.toLowerCase();
  if (r.includes("gelderland")) return "gelderland";
  if (r.includes("brabant") || r.includes("limburg")) return "brabant-limburg";
  if (r.includes("holland")) return "randstad";
  if (r.includes("utrecht") || r.includes("flevoland")) return "utrecht-flevoland";
  if (
    r.includes("overijssel") ||
    r.includes("groningen") ||
    r.includes("friesland")
  ) {
    return "overijssel-noord";
  }
  return "gelderland";
}

const TRIO_PAIN_POOL: Record<
  TrioBaseSlug,
  Record<RegionBucket, readonly { title: string; body: string }[]>
> = {
  "website-laten-maken": {
    gelderland: [
      {
        title: "Theme dat niet meeschaaft",
        body: "MKB in {city} groeit sneller dan je WordPress-theme aankan. Plugins stapelen, snelheid daalt, ads worden duur.",
      },
      {
        title: "Offerte zonder techniek",
        body: "Bureau uit de Randstad stuurt een mooi deck. Geen idee hoe je site straks meet, rankt of converteert in {region}.",
      },
      {
        title: "Mobiel is afterthought",
        body: "In {city} komt het meeste verkeer vanaf de telefoon. Je huidige site laadt traag tussen afspraken door.",
      },
      {
        title: "Geen landings voor campagnes",
        body: "Je wilt adverteren op {kw}. Je homepage is geen landingspagina. Elke klik kost geld zonder duidelijke CTA.",
      },
      {
        title: "Bouwer verdwenen na live",
        body: "Site staat. Vraag over tracking of SEO? Radio stilte. Ondernemers in {city} hebben geen tijd voor zoeken.",
      },
    ],
    "brabant-limburg": [
      {
        title: "Industrie-site, retail-snelheid",
        body: "{city} heeft veel maakbedrijven én webshops. Je site voelt als brochure terwijl klanten online bestellen.",
      },
      {
        title: "Concurrent uit Eindhoven wint",
        body: "Brabant adverteert op jouw regio. Zonder snelle custom build ben je backup-optie bij {kw}.",
      },
      {
        title: "Shopify of Next.js onduidelijk",
        body: "Iedereen heeft een mening. Niemand legt uit wat past bij jouw marge en groei in {region}.",
      },
      {
        title: "Design zonder conversie",
        body: "Mooi beeldmateriaal, lege inbox. In {city} telt wat je site oplevert, niet wat je designer mooi vond.",
      },
      {
        title: "Tracking ontbreekt",
        body: "Je weet niet welke pagina leads oplevert. Ads schalen blind is duur spel voor MKB in {city}.",
      },
    ],
    randstad: [
      {
        title: "Template in drukke markt",
        body: "{city} is competitief. Een generieke theme valt weg tussen honderden vergelijkbare sites.",
      },
      {
        title: "Bureau te duur, freelancer te los",
        body: "Je zoekt {kw} zonder tien partijen. Strategie hier, bouwer daar, SEO ergens anders.",
      },
      {
        title: "Snelheid kost conversie",
        body: "Rotterdam, Amsterdam, Den Haag: iedereen vergelijkt op mobiel. Trage site = wegklikken.",
      },
      {
        title: "Geen SEO in de basis",
        body: "Page builder levert mooi design. Schema, semantiek en Core Web Vitals moet je daarna alsnog fixen.",
      },
      {
        title: "Landings ontbreken",
        body: "Campagnes linken naar homepage. In {city} betaal je premium CPC voor generieke ervaring.",
      },
    ],
    "utrecht-flevoland": [
      {
        title: "Groei zonder fundament",
        body: "Almere en Utrecht schalen snel. Je site groeit niet mee met nieuwe diensten of regio's.",
      },
      {
        title: "Page builder plafond",
        body: "Leuk voor start. Bij {kw} in {city} wil je controle over snelheid, landings en integraties.",
      },
      {
        title: "Verkeer zonder actie",
        body: "Bezoekers komen, niemand belt. CTA's en vertrouwen ontbreken op mobiel.",
      },
      {
        title: "Geen plan na launch",
        body: "Site live, dan stilte. Geen indexatie, geen landings voor zoek, geen tracking voor ads.",
      },
      {
        title: "Vendor lock-in",
        body: "Je zit vast aan een platform dat {region} niet kent en jouw marges niet snapt.",
      },
    ],
    "overijssel-noord": [
      {
        title: "Lokaal vertrouwen, generieke site",
        body: "In {city} koopt men van mensen. Je site voelt als template zonder {region}-context.",
      },
      {
        title: "Te laat met moderniseren",
        body: "Concurrenten in Zwolle of Enschede investeren online. Jouw site dateert van vóór mobiel-first.",
      },
      {
        title: "Geen B2B-portaal",
        body: "Zakelijke klanten in {region} willen online bestellen. Jij mailt nog PDF's.",
      },
      {
        title: "SEO als plugin",
        body: "Yoast groen is geen strategie. {kw} vraagt pagina's die echt helpen, niet vinkjes.",
      },
      {
        title: "Ads op zwakke basis",
        body: "Budget naar Google terwijl landings in {city} niet converteren. Leren via je portemonnee.",
      },
    ],
  },
  "seo-specialist": {
    gelderland: [
      {
        title: "Rapport zonder pagina's",
        body: "SEO-advies voor {city}, maar niemand bouwt de landings die ranken moeten.",
      },
      {
        title: "Blogs zonder koopintentie",
        body: "Vier artikelen per maand op termen die niemand in {region} koopt.",
      },
      {
        title: "Lokaal ranken mislukt",
        body: "GBP half leeg, reviews oud, site zegt alleen '{city}' in de footer.",
      },
      {
        title: "Techniek blijft liggen",
        body: "Crawl errors, trage mobiel, kapotte interne links. Advies ligt in Drive.",
      },
      {
        title: "AI-zoek genegeerd",
        body: "ChatGPT kent je niet. Concurrent in {city} wel, omdat die dieper antwoord geeft.",
      },
    ],
    "brabant-limburg": [
      {
        title: "Volume boven marge",
        body: "Specialist rankt op brede termen. Jouw Brabantse klant zoekt specifieker.",
      },
      {
        title: "Geen link tussen SEO en ads",
        body: "Organisch en paid lopen los. Dubbel werk, dubbele kosten in {region}.",
      },
      {
        title: "Product-SEO ontbreekt",
        body: "Webshop in {city} met leverancier-copy. Google ziet duplicaten, geen autoriteit.",
      },
      {
        title: "Maandpakket zonder prioriteit",
        body: "Alles is 'belangrijk'. Niets is af. {kw} voelt als abonnement op hopen.",
      },
      {
        title: "Geen uitvoerder",
        body: "PDF klaar, developer zoeken, wachten. Ondernemers in {city} willen snelheid.",
      },
    ],
    randstad: [
      {
        title: "Duur bureau, dunne output",
        body: "Retainer in {city}, maar pagina's blijven generiek. Geen differentiatie in SERP.",
      },
      {
        title: "Keyword-stuffing reflex",
        body: "Oude tactics in competitieve markt. Google is strenger, jij betaalt de prijs.",
      },
      {
        title: "Geen business case",
        body: "Positie 4 op term die niets oplevert. Mooie grafiek, lege pipeline in {region}.",
      },
      {
        title: "Content zonder structuur",
        body: "Blogs stapelen, interne links ontbreken. Autoriteit groeit niet.",
      },
      {
        title: "Lokaal vs nationaal",
        body: "Je target {city} maar content is NL-breed. Intentie matcht niet.",
      },
    ],
    "utrecht-flevoland": [
      {
        title: "Groeiende stad, stilstaande SEO",
        body: "{city} verandert snel. Je site deed het ooit, nu zakken posities.",
      },
      {
        title: "Technische schuld",
        body: "Migratie zonder redirects, dubbele titels, schema ontbreekt. {kw} lijdt eronder.",
      },
      {
        title: "Geen AI-zichtbaarheid",
        body: "Semantische SEO en antwoord-pagina's ontbreken. ChatGPT citeert anderen.",
      },
      {
        title: "Reviews niet gekoppeld",
        body: "Offline goede naam in {region}, online matige GBP. Disconnect.",
      },
      {
        title: "Specialist zonder code",
        body: "Fixes wachten op derden. Elke week verlies je zichtbaarheid.",
      },
    ],
    "overijssel-noord": [
      {
        title: "Regio onderschat",
        body: "Randstad-bureau schrijft voor NL. {city} zoekt anders, lokaal, concreet.",
      },
      {
        title: "Dunne dienstpagina's",
        body: "Eén pagina voor alles. Long-tail in {region} pakt je concurrent.",
      },
      {
        title: "Geen updates op oude content",
        body: "Nieuwe blogs, oude posts verrotten. Autoriteit daalt stilletjes.",
      },
      {
        title: "Maps vs website",
        body: "GBP actief, site zwak. Google wil consistentie. Jij niet.",
      },
      {
        title: "SEO los van site",
        body: "Advies over {kw}, maar site is traag en oud. Rankings plafonneren.",
      },
    ],
  },
  "marketing-bureau": {
    gelderland: [
      {
        title: "Tien facturen, nul lijn",
        body: "SEO-bureau, ads-guy, freelancer site. Jij coördineert in {city} terwijl je moet ondernemen.",
      },
      {
        title: "Slides zonder livegang",
        body: "Marketingplan klaar. Landings, feeds en flows blijven open.",
      },
      {
        title: "Ads vóór conversie",
        body: "Budget naar Google terwijl site in {region} niet overtuigt op mobiel.",
      },
      {
        title: "Geen marge-inzicht",
        body: "Bureau rapporteert klikken. Jij wilt weten of {kw} iets oplevert deze maand.",
      },
      {
        title: "Retainer zonder prioriteit",
        body: "Alles is urgent. Niets wordt af. MKB in {city} heeft geen geduld voor theater.",
      },
    ],
    "brabant-limburg": [
      {
        title: "Channel-spaghetti",
        body: "Meta, Google, mail, SEO los van elkaar. Geen plan voor {region}.",
      },
      {
        title: "Bureau zonder bouwer",
        body: "Strategie mooi. Site moet iemand anders doen. Kosten en tijd lopen op.",
      },
      {
        title: "Shop en ads niet gekoppeld",
        body: "Feed-fouten, verkeerde landings. Shopping in {city} kost marge.",
      },
      {
        title: "Creatives zonder landings",
        body: "Reels en carousels top. Link gaat naar homepage. Weggegooid bereik.",
      },
      {
        title: "Volgorde verkeerd",
        body: "Influencer vóór tracking. Duur experiment zonder meting.",
      },
    ],
    randstad: [
      {
        title: "Corporate traagheid",
        body: "Groot bureau, lange lijnen. {city} MKB wil deze week schakelen, niet vol kwartaal.",
      },
      {
        title: "Accountmanager-telefoon",
        body: "Jij praat met sales. Niemand die je shop opent of account leest.",
      },
      {
        title: "Budget zonder breakeven",
        body: "Opschalen omdat het kan. Niet omdat marge het toelaat in {region}.",
      },
      {
        title: "Kanaal-hype",
        body: "TikTok omdat het hot is. Niet omdat jouw klant in {city} daar koopt.",
      },
      {
        title: "Geen eigenaarschap",
        body: "Iedereen doet een stukje. Niemand voelt je P&L.",
      },
    ],
    "utrecht-flevoland": [
      {
        title: "Groei zonder fundament",
        body: "Nieuwe regio, oude site. {kw} in {city} vraagt meer dan logo swap.",
      },
      {
        title: "Mail los van shop",
        body: "Nieuwsbrief stuurt, checkout weet van niks. Omzet lekt.",
      },
      {
        title: "Te veel tools",
        body: "Zes dashboards, geen antwoord op 'wat werkt?'",
      },
      {
        title: "Bureau wissel trauma",
        body: "Vorige partij liet rommel achter. Opnieuw beginnen kost vertrouwen in {region}.",
      },
      {
        title: "Strategie zonder hands",
        body: "Deck oké. Google Ads, Meta Ads en site blijven hangen.",
      },
    ],
    "overijssel-noord": [
      {
        title: "Postbus-marketing",
        body: "Bureau kent {city} van Google Maps. Geen context, wel retainer.",
      },
      {
        title: "Offline sterk, online matig",
        body: "Mond-tot-mond in {region} top. Site en vindbaarheid achterlopen.",
      },
      {
        title: "Geen B2B-flow",
        body: "Leads in mail. Geen portal, geen nurture. Handwerk blijft.",
      },
      {
        title: "Ads zonder SEO",
        body: "Alles betaald, niets organisch. Duur op termijn voor MKB in {city}.",
      },
      {
        title: "Rapportcultuur",
        body: "Maandelijks PDF. Geen pagina live, geen campagne bijgestuurd.",
      },
    ],
  },
};

const TRIO_PROCESS: Record<TrioBaseSlug, readonly (readonly SeoLandingStep[])[]> = {
  "website-laten-maken": [
    [
      {
        title: "Doel in {city}",
        body: "Wie moet wat doen op je site? Lokaal vertrouwen en conversie eerst, pixels later.",
      },
      {
        title: "Structuur & copy",
        body: "Sitemap en teksten die {kw} in {region} echt beantwoorden. Geen filler.",
      },
      {
        title: "Bouwen & meten",
        body: "Next.js custom, tracking live, mobiel getest vóór je de link deelt in {city}.",
      },
      {
        title: "Launch + groei",
        body: "Indexeren, landings voor campagnes, klaar voor Google Ads als marge het toelaat.",
      },
    ],
    [
      {
        title: "Audit op mobiel",
        body: "Huidige site doorlopen in {city}-context. Waar lekt vertrouwen of snelheid?",
      },
      {
        title: "Architectuur kiezen",
        body: "Custom build die past bij groei in {region}. Geen theme-plafond.",
      },
      {
        title: "Ontwikkelen",
        body: "Schema, CWV, formulieren, interne links. Alles in één lijn.",
      },
      {
        title: "Live + vindbaar",
        body: "{kw} begint bij een site die Google en bezoekers uit {city} serieus nemen.",
      },
    ],
    [
      {
        title: "Intake met cijfers",
        body: "Wat komt binnen via je huidige site? Wat moet {kw} opleveren?",
      },
      {
        title: "Design dat converteert",
        body: "Merk, trust, CTA's. Mooi én functioneel voor ondernemers in {region}.",
      },
      {
        title: "Build from scratch",
        body: "Geen page builder. Code die meeschaaft met ads en SEO.",
      },
      {
        title: "Overdracht zonder gaten",
        body: "Documentatie, tracking, eerste landings. Jij bent niet gevangen.",
      },
    ],
  ],
  "seo-specialist": [
    [
      {
        title: "Baseline {city}",
        body: "Rankings, techniek, concurrenten in {region}. Weten waar je staat.",
      },
      {
        title: "Prioriteiten op marge",
        body: "Welke pagina's leveren leads? Die eerst, niet volume om volume.",
      },
      {
        title: "Bouwen & fixen",
        body: "Ik schrijf én publiceer. Geen wachten op derden voor {kw}.",
      },
      {
        title: "Bijsturen op omzet",
        body: "Posities plus pipeline. Google update of AI-zoek: we passen aan.",
      },
    ],
    [
      {
        title: "Technische scan",
        body: "Indexatie, snelheid, schema in {city}-context. Lekken dichten.",
      },
      {
        title: "Keyword-kaart",
        body: "Koopintentie in {region}, niet alleen zoekvolume.",
      },
      {
        title: "Landings live",
        body: "Antwoord-pagina's die ranken én converteren voor {kw}.",
      },
      {
        title: "Lokaal versterken",
        body: "GBP, reviews, interne links. {city} moet online kloppen.",
      },
    ],
    [
      {
        title: "Concurrentie in SERP",
        body: "Wie wint in {city} en waarom? Eerlijk gap-analyse.",
      },
      {
        title: "Roadmap kwartaal",
        body: "Volgorde op impact. Geen twaalf projecten tegelijk.",
      },
      {
        title: "Content + code",
        body: "Specialist die de pagina opent en aanpast. Zelf.",
      },
      {
        title: "Rapport met actie",
        body: "Wat live ging, wat volgende maand. Geen PDF zonder besluit.",
      },
    ],
  ],
  "marketing-bureau": [
    [
      {
        title: "Inventarisatie {city}",
        body: "Site, marges, kanalen, wat je al probeerde in {region}.",
      },
      {
        title: "Volgorde op breakeven",
        body: "Bouwen, ranken, Google Ads, Meta Ads, mail. Niet alles dag één.",
      },
      {
        title: "Uitvoeren onder één dak",
        body: "Ik bouw, schrijf en zet live. Jij praat met mij, niet met vijf partijen.",
      },
      {
        title: "Dashboard op omzet",
        body: "{kw} moet iets opleveren. Leads, ROAS, rankings in één verhaal.",
      },
    ],
    [
      {
        title: "Situatie schetsen",
        body: "Waar zit je bedrijf in {city}? Wat werkt offline, wat hapert online?",
      },
      {
        title: "Fundament eerst",
        body: "Site en conversie vóór budget naar ads. Anders leer je duur.",
      },
      {
        title: "Kanalen koppelen",
        body: "SEO, paid, mail, content. Eén lijn voor {region}.",
      },
      {
        title: "Maandelijks bijsturen",
        body: "Opschalen wat werkt. Stoppen wat marge vreet.",
      },
    ],
    [
      {
        title: "Quick wins zoeken",
        body: "Vaak ligt winst in tracking, landings of feed. Eerst dat, dan hype.",
      },
      {
        title: "Plan in mensentaal",
        body: "Geen jargon-deck. Wel: dit doen we in {city}, dit niet.",
      },
      {
        title: "Hands-on livegang",
        body: "Campagnes, pagina's, flows. Niet alleen slides over {kw}.",
      },
      {
        title: "Eigenaarschap",
        body: "Ik ken je shop en accounts. Geen accountmanager-telefoon.",
      },
    ],
  ],
};

const TRIO_STORY_TITLES: Record<TrioBaseSlug, readonly string[]> = {
  "website-laten-maken": [
    "{kw} in {city}: geen template met je logo erop",
    "Waarom ondernemers in {city} vastlopen op {kw}",
    "From scratch in {region}, niet from theme store",
    "{city} verdient een site die meeschaaft met ads",
    "Website laten maken zonder na live alleen te hopen",
    "{kw} voor MKB dat in {city} online wil winnen",
  ],
  "seo-specialist": [
    "{kw} in {city} zonder rapportenla",
    "SEO in {region}: advies is gratis, uitvoering niet",
    "Waarom {city} generieke SEO-spam ruikt",
    "Specialist die {kw} zelf bouwt, niet uitbesteedt",
    "Ranken in {city} vraagt pagina's, geen maandblogs",
    "{kw}: hands-on in {region}, geen PowerPoint",
  ],
  "marketing-bureau": [
    "{kw} in {city} zonder tien partijen",
    "Marketing in {region} met één aanspreekpunt",
    "Waarom bureaus in {city} vaak slides leveren",
    "{kw} die site, SEO en ads in één lijn zet",
    "MKB in {city} heeft geen tijd voor retainer-theater",
    "Volgorde telt: {kw} zonder spaghetti",
  ],
};

const TRIO_STORY_OPENERS: Record<
  TrioBaseSlug,
  Record<RegionBucket, readonly string[]>
> = {
  "website-laten-maken": {
    gelderland: [
      "In {city} en {region} zie ik het vaak: ondernemer wil {kw}, krijgt een theme met Veluwe-foto's erop. Ziet er oké uit. Laadt traag op mobiel. Tracking ontbreekt. Zes maanden later wil je adverteren en betaal je voor klikken naar een homepage die niets uitlegt.",
      "Gelderland MKB werkt hard. Online moet hetzelfde tempo hebben. {kw} via page builder klinkt goedkoop tot je merkt dat elke landingspagina een plugin-gevecht wordt.",
    ],
    "brabant-limburg": [
      "Brabant en Limburg maken en verkopen. {kw} in {city} moet beide kunnen: showroom-vertrouwen én checkout-snelheid. Template-sites wankelen daar tussen.",
      "Je concurrent in Eindhoven of Tilburg adverteert al op {region}. Zonder custom build ben je de trage optie in de vergelijking.",
    ],
    randstad: [
      "{city} is druk, duur, competitief. {kw} met generieke theme valt weg tussen honderden vergelijkbare sites. Je hebt snelheid, structuur en landings nodig, niet nog een Figma die nooit live komt.",
      "Randstad-bureaus rekenen premium. MKB in {city} wil resultaat, geen maandrapport met groene pijltjes over je template-site.",
    ],
    "utrecht-flevoland": [
      "{city} groeit snel. Je diensten ook. {kw} met starre site remt campagnes af. Almere en Utrecht ondernemers merken het als ads duurder worden terwijl conversie stilstaat.",
      "Utrecht en Flevoland zitten tussen Randstad en regio. Je site moet lokaal vertrouwen én landelijke schaal aankunnen.",
    ],
    "overijssel-noord": [
      "In {city} heb je offline vaak al naam. Online blijft {kw} hangen op oude WordPress of een site die '{city}' in de footer zet en verder niets. Google en klanten zien het verschil.",
      "Overijssel en het noorden worden onderschat door Randstad-bureaus. {region} verdient {kw} met context, niet copy-paste.",
    ],
  },
  "seo-specialist": {
    gelderland: [
      "Je zocht {kw} in {city}. Je kreeg audits, soms blogs, zelden een pagina die rankt op koopintentie. De specialist schreef advies. De developer las het niet. Posities bleven steken.",
      "Gelderland is geen postbus-SEO-regio. {kw} vraagt GBP, reviews, landings en techniek in één hand.",
    ],
    "brabant-limburg": [
      "Brabantse webshops en maakbedrijven zoeken specifieker dan je denkt. {kw} op volume-termen oplevert vaak niets in {city}. Marge-termen wel, als iemand de pagina ook bouwt.",
      "In {region} concurreer je met shops die feeds, SEO en ads koppelen. Alleen rapporten houden je achter.",
    ],
    randstad: [
      "{city} SERP's zijn vol. {kw} met dunne content en oude tactics werkt niet meer. Je betaalt retainer, concurrent bouwt antwoord-pagina's.",
      "Randstad SEO-bureaus sturen juniors. MKB in {city} wil iemand die zelf in Search Console zit én code leest.",
    ],
    "utrecht-flevoland": [
      "Utrecht en Flevoland groeien. Je oude SEO-strategie niet. {kw} in {city} vraagt updates, niet alleen nieuwe blogs bovenop verrotte pagina's.",
      "Migraties zonder redirects, schema dat ontbreekt: {region} MKB leert het via dalende posities.",
    ],
    "overijssel-noord": [
      "Lokaal ranken in {city} betekent meer dan citations. Je site moet {kw} uitleggen alsof je aan tafel zit. Template-SEO ruikt de regio.",
      "Enschede, Zwolle, Groningen: ondernemers zijn direct. {kw} via maandpakket zonder live pagina's voelt als geld weg.",
    ],
  },
  "marketing-bureau": {
    gelderland: [
      "Marketing in {city} wordt te snel: SEO-bureau links, ads-specialist rechts, site-bouwer ergens anders. Jij bent projectmanager geworden. {kw} onder één dak klinkt simplistisch tot je de facturen optelt.",
      "Gelderland MKB wil eerlijkheid. Slides over {kw} zonder landings live is theater.",
    ],
    "brabant-limburg": [
      "Brabant draait op marge. {kw} in {city} die budget naar Meta stuurt terwijl je feed lekt is een dure hobby. Volgorde: site, SEO, dan ads.",
      "In {region} zie ik shops met sterke producten en zwakke funnels. Bureau zegt 'schalen'. Ik zeg: eerst meten.",
    ],
    randstad: [
      "{city} MKB wordt vaak behandeld als mini-corporate. Lange contracten, accountmanagers, weinig hands-on. {kw} vraagt iemand die je shop opent.",
      "Randstad hype: TikTok, influencers, alles tegelijk. In {city} wil je weten wat breakeven haalt vóór je opschaalt.",
    ],
    "utrecht-flevoland": [
      "Groei in {city} betekent niet twaalf kanalen tegelijk. {kw} met plan: bouwen, ranken, adverteren, mail. In die volgorde als het moet.",
      "Utrecht en Flevoland zitten tussen snelle Randstad en regionale markten. Je marketing moet beide snappen.",
    ],
    "overijssel-noord": [
      "Offline sterk in {city}, online achter. {kw} via postbus-bureau dat {region} niet kent helpt niet. Mond-tot-mond begint steeds vaker met Google.",
      "Noord en Overijssel: ondernemers willen cijfers, geen retainer zonder live werk.",
    ],
  },
};

const TRIO_STORY_MIDDLES: Record<TrioBaseSlug, readonly string[]> = {
  "website-laten-maken": [
    "Ik bouw from scratch in Next.js of Shopify custom. Snelheid, schema, landings en tracking zitten erin vóór launch. SkinComplete en BestRest zijn zo opgebouwd.",
    "{kw} bij mij is één lijn: code, SEO-fundament, conversie. Geen page builder die vastloopt als je wilt adverteren in {city}.",
    "Je klant in {region} vergelijkt op mobiel. Custom build is geen luxe, het is de minimumeis voor {kw} die campagnes aankan.",
    "Landings per dienst, niet alles op homepage. Google Ads en Meta Ads linken naar pagina's die {kw} beantwoorden, niet naar je logo.",
  ],
  "seo-specialist": [
    "Ik doe keyword-plan, technische fixes én landings bouwen. SkinComplete rankte op salonvragen vóór ads. Zo hoort {kw} te werken.",
    "12 jaar Google. AI-zoek erbij. {kw} in {city} vraagt antwoord-pagina's die ChatGPT kan citeren, niet keyword-lists.",
    "Eerlijk als ads slimmer zijn dan nog een blog. MKB in {region} heeft geen budget voor ego-SEO.",
    "GBP, reviews, interne links, snelheid: {kw} is geen los advies, het is live werk op je domein.",
  ],
  "marketing-bureau": [
    "Ik bouw site en shop, regel SEO, zet Google Ads en Meta Ads live als de basis staat. E-mail en flows houden wat je betaald hebt.",
    "SkinComplete: shop, SEO, ads, mail. BestRest: per product een plan. {kw} in {city} krijgt dezelfde eerlijkheid over volgorde.",
    "Geen retainer zonder prioriteit. We beginnen waar marge het snelst stijgt: vaak site of techniek, niet viral stunt.",
    "Jij praat met mij. Ik ken je accounts en je checkout. {kw} zonder keten van specialisten.",
  ],
};

const TRIO_DEEPDIVE: Record<TrioBaseSlug, readonly string[]> = {
  "website-laten-maken": [
    "{kw} is geen visitekaartje meer. In {city} is je site je eerste verkoper. Traag, vaag of template: je verliest vergelijkingen vóór iemand belt.",
    "Custom build betekent controle. Snelheid, schema, landings, GTM. Alles wat page builders als add-on verkopen, zit in de basis.",
    "Campagnes in {region} falen op message match. Ad belooft X, homepage zegt Y. Landings per intentie fixen dat.",
    "Mobiel-first is geen trend in {city}. Het is waar je klant je vindt. Core Web Vitals zijn ranking én conversie.",
    "After launch blijf ik betrokken. Site aanpassen, landings bijbouwen, tracking checken. Geen bouwer die verdwijnt.",
  ],
  "seo-specialist": [
    "{kw} zonder uitvoering is een PDF. Rankings komen van pagina's die helpen, techniek die klopt en updates die blijven komen.",
    "Lokaal in {city}: GBP actief, reviews recent, site die dienst uitlegt. Footer-adres alleen werkt niet meer.",
    "AI-zoek in 2026: antwoord-pagina's, schema, echte expertise. Bulk-blogs zonder diepgang verdwijnen.",
    "Interne links vanaf sterke pagina's naar {kw}-landings. Autoriteit stromen, niet stapelen.",
    "Ik meet op leads en omzet, niet alleen positie. Positie 1 op term zonder koopintentie is decoratie.",
  ],
  "marketing-bureau": [
    "{kw} is geen lijst kanalen. Het is volgorde op marge. Site die converteert, SEO die gratis verkeer brengt, ads die opschalen wat werkt.",
    "Google Ads en Meta Ads expliciet in het plan. Niet verstopt achter 'performance'. Jij moet weten waar budget naartoe gaat.",
    "E-mail en flows in {city} vaak onderbenut. Gratis geld na eerste aankoop, als shop en mail gekoppeld zijn.",
    "Te veel partijen = niemand voelt je P&L. Eén aanspreekpunt die bouwt en bijstuurt wint op snelheid.",
    "SkinComplete-gedachte: organisch fundament, dan pas ads. {region} MKB kan die volgorde niet skippen zonder te betalen.",
  ],
};

const TRIO_SCENE_BREAKS: Record<TrioBaseSlug, readonly SeoLandingSceneBreak[]> = {
  "website-laten-maken": [
    {
      placement: "after-story",
      visual: "tracking-lab",
      eyebrow: "{city} · from scratch",
      title: "Site die campagnes in {region} aankan",
      caption:
        "Custom build, tracking live, landings klaar. {kw} begint bij techniek die niet wankelt op mobiel.",
    },
    {
      placement: "after-deep-dive",
      visual: "website-build",
      eyebrow: "Launch",
      title: "Geen template-geur in {city}",
      caption: "Next.js of Shopify custom. Jouw merk, geen theme store met logo swap.",
    },
  ],
  "seo-specialist": [
    {
      placement: "after-story",
      visual: "content-hub",
      eyebrow: "{city} · SEO",
      title: "Pagina's die ranken én converteren",
      caption:
        "{kw} in {region}: ik schrijf, bouw en publiceer. Geen wachtrij bij een developer.",
    },
    {
      placement: "after-deep-dive",
      visual: "ai-search",
      eyebrow: "2026",
      title: "Google én AI in {city}",
      caption: "Antwoord-pagina's die ChatGPT en Gemini kunnen citeren.",
    },
  ],
  "marketing-bureau": [
    {
      placement: "after-story",
      visual: "strategy-stack",
      eyebrow: "{city} · één lijn",
      title: "Site, SEO, Google Ads, Meta Ads",
      caption:
        "{kw} zonder tien facturen. Strategie die live gaat, niet in slides blijft hangen.",
    },
    {
      placement: "after-deep-dive",
      visual: "metrics-dashboard",
      eyebrow: "MKB {region}",
      title: "Volgorde op breakeven",
      caption: "Fundament eerst, dan schalen. Cijfers die actie geven in {city}.",
    },
  ],
};

const TRIO_HOT_TAKES: Record<TrioBaseSlug, readonly { label: string; body: string }[]> = {
  "website-laten-maken": [
    {
      label: "Heet take",
      body: "{kw} via template in {city} is een maatpak uit de sale. Het past nooit echt als je wilt adverteren.",
    },
    {
      label: "Eerlijk",
      body: "Page builder in {region} is oké voor start. Bij groei en ads wordt custom goedkoper dan plugins repareren.",
    },
    {
      label: "Meneer zegt",
      body: "Je homepage is geen landingspagina. {kw} in {city} vraagt pagina's per intentie, niet één hero met stockfoto.",
    },
  ],
  "seo-specialist": [
    {
      label: "Heet take",
      body: "Een {kw} die geen code leest, is weerman in {city} met gesloten raam.",
    },
    {
      label: "Eerlijk",
      body: "Vier blogs per maand in {region} zonder landings is SEO-theater. Ranken vraagt pagina's die helpen.",
    },
    {
      label: "Meneer zegt",
      body: "Positie zonder pipeline is trofee op een lege kast. {kw} moet omzet raken.",
    },
  ],
  "marketing-bureau": [
    {
      label: "Heet take",
      body: "Een {kw} dat niet kan bouwen is PowerPoint-fabriek met duur uurtarief in {city}.",
    },
    {
      label: "Eerlijk",
      body: "Tien kanalen tegelijk in {region} is spaghetti. Volgorde op marge wint.",
    },
    {
      label: "Meneer zegt",
      body: "Ads opschalen vóór je site converteert is lerngeld met extra zeros. {kw} begint bij fundament.",
    },
  ],
};

const TRIO_PROOF: Record<TrioBaseSlug, readonly string[]> = {
  "website-laten-maken": [
    "MeneerMarketing.nl, SkinComplete en klantportalen: custom builds die in {city} en landelijk meeschalen. Geen theme dat 10.000 anderen ook hebben.",
    "From scratch in {region} betekent: snelheid en landings die klaar zijn vóór je Google Ads aanzet.",
    "Ik bouw wat je nodig hebt voor {kw}, niet wat een theme store toevallig aanbiedt.",
  ],
  "seo-specialist": [
    "12 jaar hands-on. Pagina's live in {city}-context en nationaal. SkinComplete rankte vóór ads. BestRest per product.",
    "{kw} in {region} met uitvoering: ik fix techniek én publiceer landings zelf.",
    "Core updates overleefd omdat pagina's helpen, niet omdat ik trucjes uit 2014 herhaal.",
  ],
  "marketing-bureau": [
    "Van shop tot ads en mail voor SkinComplete. BestRest kreeg per product een plan. {kw} in {city} krijgt diezelfde volgorde-eerlijkheid.",
    "Eén aanspreekpunt in {region}. Ik open je site, je accounts en je checkout. Geen keten.",
    "Praktijk, geen theorie-deck. {kw} moet deze maand iets opleveren, niet vol kwartaal.",
  ],
};

function buildCityTrioStory(
  baseSlug: TrioBaseSlug,
  page: SeoLandingPage,
): { title: string; paragraphs: string[] } {
  const v = pageVars(page);
  const bucket = getRegionBucket(page.location?.region);
  const profile = cityProfile(page.location!.city);

  const title = fill(pick(page.slug, TRIO_STORY_TITLES[baseSlug], "trio-story-title"), v);
  const opener = fill(
    pick(page.slug, TRIO_STORY_OPENERS[baseSlug][bucket], "trio-story-open"),
    v,
  );
  const middles = pickMany(
    page.slug,
    TRIO_STORY_MIDDLES[baseSlug],
    2,
    "trio-story-mid",
  ).map((p) => fill(p, v));

  const cityClose = pick(page.slug, [
    `${page.location!.city} voelt als ${profile.vibe}. ${profile.zoekgedrag}. Deze pagina over ${page.primaryKeyword} is daarop gebouwd.`,
    `Ondernemers in ${page.location!.city} zijn vaak ${profile.ondernemerstype}. ${profile.detail} Dat bepaalt hoe ik ${page.primaryKeyword} aanpak.`,
    `${profile.zoekgedrag} In ${page.location!.city} en ${page.location!.region ?? "de regio"} moet ${page.primaryKeyword} online net zo overtuigen als offline.`,
    `Ik schrijf ${page.primaryKeyword} voor ${page.location!.city}, niet voor 'Nederland generiek' met een stadnaam in de H1.`,
  ], "trio-story-close");

  return {
    title,
    paragraphs: [opener, ...middles, cityClose],
  };
}

function buildCityTrioDeepDive(
  baseSlug: TrioBaseSlug,
  page: SeoLandingPage,
): { title: string; paragraphs: string[] } {
  const v = pageVars(page);
  const titles = [
    `{kw} in {city}: praktijk zonder bullshit`,
    `Dieper op {kw} in {region}`,
    `Wat {kw} in {city} echt vraagt`,
    `{kw} onder de motorkap`,
  ];
  return {
    title: fill(pick(page.slug, titles, "trio-deep-title"), v),
    paragraphs: pickMany(page.slug, TRIO_DEEPDIVE[baseSlug], 4, "trio-deep-body").map(
      (p) => fill(p, v),
    ),
  };
}

function buildCityTrioScenes(
  baseSlug: TrioBaseSlug,
  page: SeoLandingPage,
): SeoLandingSceneBreak[] {
  const v = pageVars(page);
  return TRIO_SCENE_BREAKS[baseSlug].map((scene) => ({
    ...scene,
    eyebrow: fill(scene.eyebrow, v),
    title: fill(scene.title, v),
    caption: scene.caption ? fill(scene.caption, v) : undefined,
  }));
}

function buildCityTrioPains(
  baseSlug: TrioBaseSlug,
  page: SeoLandingPage,
): { title: string; body: string }[] {
  const v = pageVars(page);
  const bucket = getRegionBucket(page.location?.region);
  const pool = TRIO_PAIN_POOL[baseSlug][bucket];
  return pickMany(page.slug, pool, 3, "trio-pains").map((p) => ({
    title: fill(p.title, v),
    body: fill(p.body, v),
  }));
}

function buildCityTrioProcess(
  baseSlug: TrioBaseSlug,
  page: SeoLandingPage,
): SeoLandingStep[] {
  const v = pageVars(page);
  const variant = pick(page.slug, TRIO_PROCESS[baseSlug], "trio-process");
  return variant.map((step) => ({
    title: fill(step.title, v),
    body: fill(step.body, v),
  }));
}

const TRIO_PROCESS_TITLES: Record<TrioBaseSlug, readonly string[]> = {
  "website-laten-maken": [
    "Van idee naar live in {city}",
    "Zo bouw ik {kw} in {region}",
    "Proces voor {city} MKB",
  ],
  "seo-specialist": [
    "Werkwijze {kw} in {city}",
    "SEO in {region}, hands-on",
    "Zo pak ik {kw} aan",
  ],
  "marketing-bureau": [
    "Marketing in {city}, één lijn",
    "Zo werk ik als bureau in {region}",
    "{kw} zonder spaghetti",
  ],
};

/**
 * Unieke contentlaag voor city-varianten van website-laten-maken,
 * seo-specialist (trio-fill + handmatige steden).
 */
export function applyCityTrioLayer(page: SeoLandingPage): SeoLandingPage {
  const baseSlug = resolveBaseSlug(page.slug);
  if (!CITY_TRIO_BASE_SLUGS.has(baseSlug) || !page.location) {
    return page;
  }

  const trioBase = baseSlug as TrioBaseSlug;
  const v = pageVars(page);
  const hotTake = pick(page.slug, TRIO_HOT_TAKES[trioBase], "trio-hot");
  const proofBody = fill(
    pick(page.slug, TRIO_PROOF[trioBase], "trio-proof"),
    v,
  );
  const processTitle = fill(
    pick(page.slug, TRIO_PROCESS_TITLES[trioBase], "trio-process-title"),
    v,
  );

  return {
    ...page,
    pains: buildCityTrioPains(trioBase, page),
    processSteps: buildCityTrioProcess(trioBase, page),
    processTitle,
    proofBody,
    hotTake: {
      label: hotTake.label,
      body: fill(hotTake.body, v),
    },
    sceneBreaks: buildCityTrioScenes(trioBase, page),
    enrichedOverrides: {
      ...page.enrichedOverrides,
      story: buildCityTrioStory(trioBase, page),
      deepDive: buildCityTrioDeepDive(trioBase, page),
    },
  };
}
