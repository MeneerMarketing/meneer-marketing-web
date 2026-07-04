/**
 * Extra content voor dienstpagina's met de premium opmaak.
 * Alleen slugs met een entry hier krijgen de premium view;
 * de rest valt terug op de standaard dienstpagina.
 */

export interface DienstPremiumOutcome {
  title: string;
  detail: string;
}

export interface DienstPremiumPrinciple {
  title: string;
  body: string;
}

export interface DienstPremiumScaleCallout {
  title: string;
  body: string;
}

export interface DienstPremiumContent {
  /** Welke hero-illustratie rechts in de hero */
  heroVisual?: "build" | "shopify" | "portal" | "speed" | "ux";
  /** Korte onderregel met punch in de hero */
  heroKicker: string;
  /** Onverwacht feitje of harde waarheid */
  funFact: string;
  funFactSource: string;
  /** Groot getal of kernwoord als watermerk achter het feitje */
  funFactStat: string;
  /** "Hoe ik werk" als drie gelijkwaardige principes */
  principles: DienstPremiumPrinciple[];
  /** Herschreven blok-lens in de tone of voice van de pagina */
  lens: string;
  approachSteps: { title: string; body: string }[];
  /** Sticker-strip onder de hero */
  capabilities: string[];
  /** Resultaten met gelijkwaardige titels en details */
  outcomes: DienstPremiumOutcome[];
  heroStats: { label: string; value: string }[];
  /** Optioneel: doorverwijzing naar /schaal-op voor bestaande Shopify-klanten */
  scaleCallout?: DienstPremiumScaleCallout;
}

const PREMIUM: Record<string, DienstPremiumContent> = {
  webdevelopment: {
    heroVisual: "build",
    heroKicker:
      "Geen template dat op duizend andere sites lijkt. Een website die vanaf regel één voor jouw bedrijf is gebouwd. Snel, veilig en klaar om te groeien.",
    funFact:
      "Een bezoeker oordeelt in ongeveer een halve seconde over je website. Nog voor er één woord is gelezen.",
    funFactSource: "Daarom bouwen we niks half",
    funFactStat: "0,5 sec",
    principles: [
      {
        title: "Eerst luisteren, dan bouwen",
        body: "Wat een webshop nodig heeft, verschilt nogal van een B2B-dienstverlener. Zelfs als ze allebei 'gewoon een site' vragen. Dus ik begin met vragen stellen, niet met bouwen.",
      },
      {
        title: "Eén aanspreekpunt, geen estafette",
        body: "Geen keten van vijf specialisten die naar elkaar wijzen als iets misgaat. Web, marketing en techniek komen bij mij uit één brein. Scheelt vergaderingen, scheelt misverstanden.",
      },
      {
        title: "Taal die je gewoon snapt",
        body: "Je krijgt uitleg in normaal Nederlands, met keuzes die je zelf kunt maken. Het jargon bewaar ik voor de code. Daar hoort het thuis en daar leest niemand mee.",
      },
    ],
    lens: "Een site is bij mij geen los project maar het fundament onder alles wat erna komt: SEO, ads, e-mail. Daarom bouw ik alsof jouw bedrijf over vijf jaar drie keer zo groot is. Dat is namelijk wel de bedoeling.",
    approachSteps: [
      {
        title: "Eerst begrijpen, dan bouwen",
        body: "We beginnen niet in de code maar bij jouw bedrijf: wie is je klant, wat moet de site opleveren en welke systemen moeten meepraten?",
      },
      {
        title: "Structuur en ontwerp",
        body: "De blauwdruk komt vóór de pixels: informatiestructuur, wireframes en een design dat bij jouw merk past. Jij kijkt mee op elk moment dat het ertoe doet.",
      },
      {
        title: "Bouwen from scratch",
        body: "Elke regel code schrijven we zelf. Geen pagebuilder-ballast, geen plugins die elkaar bijten. Wel een site die laadt voor je er erg in hebt.",
      },
      {
        title: "Live en verder",
        body: "Na de lancering krijg je documentatie, een korte uitleg en een site die je zelf kunt beheren. Wij blijven beschikbaar, maar je zit nergens aan vast.",
      },
    ],
    capabilities: [
      "From scratch",
      "Nul templates",
      "Laadt onder de seconde",
      "SEO-klaar",
      "Zelf te beheren",
      "Veilig gebouwd",
      "Groeit met je mee",
    ],
    outcomes: [
      {
        title: "Snelheid die je voelt",
        detail:
          "Core Web Vitals in het groen en laadtijden onder de seconde. Bezoekers merken het meteen en Google beloont het elke dag opnieuw.",
      },
      {
        title: "Beheer zonder gedoe",
        detail:
          "Teksten, foto's en pagina's pas je zelf aan zonder technische kennis. Geen belletje naar een bouwer voor elke komma die anders moet.",
      },
      {
        title: "Eigenaarschap bij jou",
        detail:
          "Code, documentatie en alle toegangen zijn van jou. Je zit nergens aan vast, ook niet aan mij. Al blijven de meeste klanten gewoon.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "From scratch" },
      { label: "Snelheid", value: "CWV groen" },
      { label: "Beheer", value: "Zelf beheren" },
    ],
  },
  "shopify-enterprise": {
    heroVisual: "shopify",
    heroKicker:
      "Ik ben Shopify-expert en bouw webshops from scratch. Geen theme uit de store, geen template dat op honderd andere shops lijkt. Custom theme, custom secties. In Shopify is vrijwel alles mogelijk. Ik weet hoe.",
    funFact:
      "Shopify verwerkt in piekmomenten meer dan een miljoen checkouts per minuut. Jouw shop hoeft niet stuk te gaan omdat het theme het op drukke dagen niet aankan.",
    funFactSource: "Daarom themes from scratch",
    funFactStat: "1M+",
    principles: [
      {
        title: "Themes from scratch",
        body: "Ik koop geen theme in de Shopify Store en plak je logo erop. Elke shop start op een leeg canvas: eigen secties, eigen Liquid, jouw merk. Daarmee kan alles wat Shopify aankan.",
      },
      {
        title: "Geen app-estafette",
        body: "Veel Shopify-projecten ontsporen door twintig apps die elkaar bijten. Ik bouw liever in het theme wat kan, houd wat werkt en geef je één aanspreekpunt voor code, koppelingen en performance.",
      },
      {
        title: "Shopify-expert, punt",
        body: "Checkout, Storefront API, koppelingen, portals: ik spreek Shopify vloeiend en leg keuzes uit in normaal Nederlands. Jij hoeft geen extra developer in te huren naast mij.",
      },
    ],
    lens: "Bij Shopify bouw ik alsof je over een jaar drie keer zo groot bent: meer producten, meer kanalen, meer automatisering. Alles in één maatwerk theme dat je team snapt. Geen template, geen black box.",
    approachSteps: [
      {
        title: "Stack & catalogus audit",
        body: "We brengen je huidige theme, apps, koppelingen en bottlenecks in kaart. Wat is kritisch, wat is ballast, en waar lekt omzet weg?",
      },
      {
        title: "Theme from scratch",
        body: "Design, secties en Liquid op maat. OS 2.0, headless of hybride: ik laat je zien waarom, wat het betekent voor onderhoud, SEO en snelheid.",
      },
      {
        title: "Bouwen & migreren",
        body: "Custom theme, checkout en koppelingen in sprints met staging en QA. Migraties plannen we met redirects en campagne-impact, zodat SEO en ads niet schokken.",
      },
      {
        title: "Live, meten, doorontwikkelen",
        body: "Na launch meten we Core Web Vitals, conversie en operationele tijdwinst. Je team krijgt documentatie en een roadmap voor wat later kan.",
      },
    ],
    capabilities: [
      "From scratch",
      "Custom theme",
      "Shopify-expert",
      "Storefront API",
      "CWV groen",
      "Minimale apps",
      "Alles mogelijk",
    ],
    outcomes: [
      {
        title: "Theme from scratch",
        detail:
          "Geen template uit de store. Eigen secties en code die meegroeien met je assortiment en merk. Je team past content aan zonder bang te zijn iets te breken.",
      },
      {
        title: "Checkout zonder gedoe",
        detail:
          "Complexe prijzen, bundles en internationale storefronts werken stabiel. Geen ketting van apps die elkaar tegenwerken zodra je één regel aanpast.",
      },
      {
        title: "Snelheid als harde eis",
        detail:
          "Core Web Vitals in het groen bij elke release, niet als bijlage na launch. Snellere storefront betekent betere SEO én hogere conversie op ads.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Theme from scratch" },
      { label: "Expertise", value: "Shopify-expert" },
      { label: "Performance", value: "CWV per release" },
    ],
    scaleCallout: {
      title: "Al Shopify? Tijd om op te schalen.",
      body: "Je shop draait al, maar groeit niet meer mee. Theme, snelheid of campagnes remmen. Via Schaal op kijken we waar jouw grootste hefboom zit en bouwen we daaromheen.",
    },
  },
  "web-apps": {
    heroVisual: "portal",
    heroKicker:
      "Portals, boekingsapps en interne tools from scratch. Geen losse spreadsheet-flow, geen duct-tape tussen vijf systemen. Wel één product dat klanten en team begrijpen.",
    funFact:
      "De gemiddelde medewerker wisselt 9 keer per uur van app. Elke extra login is een kans om af te haken.",
    funFactSource: "Daarom één portaal dat klopt",
    funFactStat: "9×",
    principles: [
      {
        title: "Rollen eerst, pixels daarna",
        body: "Wie mag wat zien en doen? Dat bepaalt elk scherm. SkinComplete salons zien andere prijzen dan jij. Hills Pilates klanten boeken alleen hun eigen lessen. Dat map ik voordat er design is.",
      },
      {
        title: "Koppelingen zonder spaghetti",
        body: "Shopify, CRM, e-mail, boekhouding: alles praat met elkaar via nette API's. Geen copy-paste tussen tabbladen. Geen 'even exporteer ik het wel'.",
      },
      {
        title: "Product dat blijft leven",
        body: "Een portaal is geen eenmalig project. Je team moet het snappen, data moet kloppen en nieuwe features mogen erbij zonder alles om te gooien. Daarom bouw ik alsof versie twee al gepland is.",
      },
    ],
    lens: "Een portaal of app is het zenuwstelsel van je bedrijf: orders, agenda, klantdata, interne workflows. Ik bouw het from scratch zodat het meegroeit. Niet vastzit aan een template of een developer die allang weg is.",
    approachSteps: [
      {
        title: "Gebruikers en flows in kaart",
        body: "Wie logt in, wat moet die persoon kunnen, welke data hoort waar? We tekenen de keten voordat er code is.",
      },
      {
        title: "Architectuur & koppelingen",
        body: "Next.js, auth, database, API's naar Shopify of je CRM. Alles typed, alles gedocumenteerd. Jij snapt waar data leeft.",
      },
      {
        title: "Bouwen in sprints",
        body: "Eerst de kernflow live (inloggen, bestellen, boeken). Daarna uitbreiden. Je ziet elke week vooruitgang, geen maanden zwarte doos.",
      },
      {
        title: "Live, meten, doorontwikkelen",
        body: "Na launch meten we adoptie: gebruikt je team het, boeken klanten, lekt er data? Documentatie en een roadmap voor wat logisch volgt.",
      },
    ],
    capabilities: [
      "From scratch",
      "B2B-portalen",
      "Boekingsapps",
      "Rollen & auth",
      "API-koppelingen",
      "Next.js",
      "Adoptie-proof",
    ],
    outcomes: [
      {
        title: "B2B-portaal dat salons zelf laat bestellen",
        detail:
          "SkinComplete: salons loggen in, zien hun prijzen en bestellen 24/7. Geen mailtjes meer, geen Excel. Custom gebouwd in Shopify, klaar om te schalen.",
      },
      {
        title: "App met agenda en boekingen",
        detail:
          "Hills Pilates: website, e-mailmarketing en een eigen app met agenda. Klanten boeken zelf, het team ziet alles op één plek.",
      },
      {
        title: "Koppelingen die blijven werken",
        detail:
          "Orders, klantdata en e-mailflows lopen door dezelfde bron van waarheid. Minder handwerk, minder fouten, meer rust in je team.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "From scratch" },
      { label: "Stack", value: "Next.js · typed" },
      { label: "Cases", value: "SC · Hills" },
    ],
  },
  optimalisatie: {
    heroVisual: "speed",
    heroKicker:
      "Snellere site, betere scores in Google. Geen cosmetische speed plugin maar code, assets en server: meten op pagina's die omzet draaien, prioriteren, fixen, opnieuw meten.",
    funFact:
      "Meer dan de helft van mobiele bezoekers hakt af als een pagina langer dan drie seconden laadt. Google meet dat mee in Core Web Vitals.",
    funFactSource: "Daarom meten op geld-pagina's",
    funFactStat: "53%",
    principles: [
      {
        title: "Meten waar het telt",
        body: "Niet je homepage-score als trofee. Ik kijk naar productpagina's, landingspagina's en templates die ads, SEO of checkout dragen. LCP en INP per device, gekoppeld aan echte traffic.",
      },
      {
        title: "Prioriteit boven polish",
        body: "Soms levert één zware app of een trage font-stack meer winst dan micro-optimalisatie overal. Ik maak die afweging expliciet, inclusief wat het betekent voor je roadmap en je Google Ads-budget.",
      },
      {
        title: "Snel blijven na launch",
        body: "Elke nieuwe feature is een kans om snelheid terug te verliezen. Daarom documenteer ik wat we aanpassen en waar je op moet letten. Jij of je team hoeft geen performance-engineer te worden.",
      },
    ],
    lens: "Optimaliseren is geen eenmalige sprint. Het is voorkomen dat je site langzamer wordt terwijl je groeit: meer SKU's, meer scripts, meer campagnes. Bij BestRest en SkinComplete bouwden we al snel from scratch. Deze dienst houdt dat vast, of herstelt wat een template of app-estafette heeft gesloopt.",
    approachSteps: [
      {
        title: "Audit op echte templates",
        body: "We brengen in kaart welke URL's omzet, leads of autoriteit dragen. Core Web Vitals, third-parties, theme-bloat en crawl-problemen per template, niet alleen op de homepage.",
      },
      {
        title: "Prioriteren met impact",
        body: "Wat levert de grootste winst voor LCP, INP en CLS zonder functionaliteit te breken? Ik leg uit wat nu moet, wat later kan, en wat je zelf kunt beheren.",
      },
      {
        title: "Fixen in code en assets",
        body: "Afbeeldingen, fonts, lazy loading, script-loading, Liquid-bloat, caching. Geen plugin die alles maskeert. Wel concrete fixes die je kunt terugvinden in de codebase.",
      },
      {
        title: "Meten, documenteren, door",
        body: "Voor/na metingen op dezelfde pagina's. Documentatie voor je team. En een korte lijst: wat mag je nooit meer ongemerkt toevoegen aan productpagina's.",
      },
    ],
    capabilities: [
      "CWV groen",
      "LCP · INP · CLS",
      "Geen speed plugins",
      "Third-party trim",
      "Technische SEO",
      "Voor/na meting",
      "Blijft snel",
    ],
    outcomes: [
      {
        title: "Concrete winst op LCP, INP en CLS",
        detail:
          "Gemeten voor en na op de templates die ertoe doen. Geen vage 'sneller gevoel', wel cijfers die je kunt koppelen aan conversie en crawlruimte in Google.",
      },
      {
        title: "Minder ballast, zelfde functionaliteit",
        detail:
          "Apps, scripts en theme-code die elkaar tegenwerken. Ik trim wat kan, vervang wat moet, en laat zien wat echt nodig is voor ads, consent en chat.",
      },
      {
        title: "Documentatie die blijft werken",
        detail:
          "Je team weet wat een nieuwe sectie of app doet met snelheid. Geen black box die over drie maanden weer rood wordt zodra iemand een slider toevoegt.",
      },
    ],
    heroStats: [
      { label: "Meting", value: "Geld-pagina's" },
      { label: "Metrics", value: "LCP · INP · CLS" },
      { label: "Resultaat", value: "CWV groen" },
    ],
  },
  webdesign: {
    heroVisual: "ux",
    heroKicker:
      "Ontwerp dat verkopen en vertrouwen combineert. Geen mooie plaatjes zonder doel: flows, hiërarchie en schermen die duidelijk maken wat de volgende stap is. Op desktop én mobiel.",
    funFact:
      "Bezoekers vormen in minder dan een halve seconde een eerste indruk van je site. Nog voordat ze je aanbod hebben gelezen.",
    funFactSource: "Daarom hiërarchie vóór decoratie",
    funFactStat: "0,5 sec",
    principles: [
      {
        title: "Flows vóór pixels",
        body: "Ik teken eerst de klantreis: wat moet iemand doen, waar twijfelt hij, wat is de enige primaire actie per scherm? Pas daarna kleur, typo en beeld. Zo ontwerp je geen mooie doodlopende straat.",
      },
      {
        title: "Context boven templates",
        body: "Een checkout voor luxe goederen vraagt andere hiërarchie dan een B2B-formulier of een Shopify PDP. SkinComplete en BestRest kregen elk een eigen UI-logica. Geen one-size Figma-template.",
      },
      {
        title: "Design dat gebouwd wordt",
        body: "Componenten, states, spacing en toegankelijkheid in Figma. Development-klaar, zodat bouwen voorspelbaar blijft en je merk consistent meegroeit bij elke iteratie.",
      },
    ],
    lens: "UI/UX is de laag tussen je aanbod en de klik. Slecht ontwerp kost omzet zonder dat je het in je ads-statistieken ziet. Ik ontwerp alsof elke pagina een landingspagina is: één duidelijke actie, vertrouwen op de plekken waar twijfel zit, en mobiel als echte omzet-driver als dat bij jou klopt.",
    approachSteps: [
      {
        title: "Klantreis en acties",
        body: "We brengen in kaart wie er landt, waar ze vandaan komen (SEO, Google Ads, Meta Ads) en welke stap je per scherm wilt. Objections van sales en support nemen we mee.",
      },
      {
        title: "Wireframes en flows",
        body: "Structuur eerst: pagina's, secties, formulieren, checkout. Jij keurt de logica goed voordat er visuele polish komt.",
      },
      {
        title: "Visueel design",
        body: "Merk, typo, kleur en componenten die herhaalbaar zijn. Design system-light: snel itereren zonder dat elke pagina een eigen dialect spreekt.",
      },
      {
        title: "Handoff en iteratie",
        body: "Figma met specs, states en a11y-notities. Afstemming met development zodat wat ontworpen is ook zo live gaat. Daarna meten we gedrag en scherpen bij.",
      },
    ],
    capabilities: [
      "Flows eerst",
      "Figma klaar",
      "Mobiel-first",
      "Conversie-led",
      "Design system",
      "A11y meegenomen",
      "Build-ready",
    ],
    outcomes: [
      {
        title: "Flows die twijfel wegnemen",
        detail:
          "Wireframes en schermen waar de primaire actie direct duidelijk is. Minder afhakers op mobiel, minder 'waar moet ik klikken?' in je inbox.",
      },
      {
        title: "Figma met componenten en states",
        detail:
          "Hover, focus, error, loading: alles wat development nodig heeft om zonder giswerk te bouwen. Geen losse JPG's of vage 'maak het zoals Apple'.",
      },
      {
        title: "Consistent en toegankelijk",
        detail:
          "Contrast, focus states en semantiek vanaf dag één. Premium voelt premium, ook voor mensen die reduced motion of screenreaders gebruiken.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Flows eerst" },
      { label: "Deliverable", value: "Figma klaar" },
      { label: "Focus", value: "Conversie" },
    ],
  },
};

export function getDienstPremium(slug: string): DienstPremiumContent | null {
  return PREMIUM[slug] ?? null;
}
