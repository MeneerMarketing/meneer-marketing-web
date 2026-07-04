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
  heroVisual?:
    | "build"
    | "shopify"
    | "portal"
    | "speed"
    | "ux"
    | "brand"
    | "motion"
    | "seo"
    | "ai-search"
    | "local"
    | "content"
    | "reviews"
    | "growth-plan"
    | "ads-strategy"
    | "cro"
    | "leads"
    | "tracking"
    | "google-ads"
    | "meta-ads-feed"
    | "social-organic"
    | "ugc"
    | "influencer"
    | "marketplace"
    | "media-ads"
    | "email-flow"
    | "retention-ltv"
    | "automation-nodes"
    | "order-chain"
    | "chat-rag";
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
      "Je concurrent kan hetzelfde theme kopen als jij. Dan betaal jij harder adverteren voor hetzelfde vertrouwen.",
    funFactSource: "Daarom uniek gebouwd",
    funFactStat: "Copy",
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
      "De Shopify Store heeft duizenden themes. Geen daarvan is jouw merk. Ik bouw custom: eigen Liquid, checkout, portals. Geen shortcuts.",
    funFact:
      "Geen theme uit de Shopify Store met jouw logo erop. Dat is geen maatwerk, dat is vermomde template.",
    funFactSource: "Daarom from scratch",
    funFactStat: "0",
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
      title: "Al bezig met Shopify? Tijd om op te schalen.",
      body: "Je shop draait al, maar groeit niet meer mee. Theme, snelheid of campagnes remmen. Via Schaal op kijken we waar jouw grootste hefboom zit en bouwen we daaromheen.",
    },
  },
  "web-apps": {
    heroVisual: "portal",
    heroKicker:
      "Portals, boekingsapps en interne tools from scratch. Geen losse spreadsheet-ketting, geen duct-tape tussen vijf systemen. Wel één product dat klanten en team begrijpen.",
    funFact:
      "Nog steeds orders via mail en Excel? Dat werkt tot je groeit. Dan wordt het chaos voor jou en je klant.",
    funFactSource: "Daarom één portaal",
    funFactStat: "Mail",
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
    lens: "Een portaal of app is het zenuwstelsel van je bedrijf: orders, agenda, klantdata, interne processen. Ik bouw het from scratch zodat het meegroeit. Niet vastzit aan een template of een developer die allang weg is.",
    approachSteps: [
      {
        title: "Gebruikers en stappen in kaart",
        body: "Wie logt in, wat moet die persoon kunnen, welke data hoort waar? We tekenen de keten voordat er code is.",
      },
      {
        title: "Architectuur & koppelingen",
        body: "Next.js, auth, database, API's naar Shopify of je CRM. Alles typed, alles gedocumenteerd. Jij snapt waar data leeft.",
      },
      {
        title: "Bouwen in sprints",
        body: "Eerst het belangrijkste pad live (inloggen, bestellen, boeken). Daarna uitbreiden. Je ziet elke week vooruitgang, geen maanden zwarte doos.",
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
          "Orders, klantdata en automatische mails lopen door dezelfde bron van waarheid. Minder handwerk, minder fouten, meer rust in je team.",
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
      "Google beloont snelle, goed gestructureerde pagina's. Trage sites met rommelige HTML verliezen crawlruimte én clicks.",
    funFactSource: "Daarom bouwen en SEO samen",
    funFactStat: "SEO",
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
      "Ontwerp dat verkopen en vertrouwen combineert. Geen mooie plaatjes zonder doel: structuur, hiërarchie en schermen die duidelijk maken wat de volgende stap is. Op desktop én mobiel.",
    funFact:
      "Bezoekers vormen in minder dan een halve seconde een eerste indruk van je site. Nog voordat ze je aanbod hebben gelezen.",
    funFactSource: "Daarom hiërarchie vóór decoratie",
    funFactStat: "0,5 sec",
    principles: [
      {
        title: "Structuur vóór pixels",
        body: "Ik teken eerst de klantreis: wat moet iemand doen, waar twijfelt hij, wat is de enige primaire actie per scherm? Pas daarna kleur, typo en beeld. Zo ontwerp je geen mooie doodlopende straat.",
      },
      {
        title: "Context boven templates",
        body: "Een checkout voor luxe goederen vraagt andere hiërarchie dan een B2B-formulier of een Shopify PDP. Elke niche krijgt eigen UI-logica. Geen one-size template.",
      },
      {
        title: "Design dat gebouwd wordt",
        body: "Componenten, states, spacing en toegankelijkheid vanaf het eerste scherm. Development-klaar, zodat bouwen voorspelbaar blijft en je merk consistent meegroeit bij elke iteratie.",
      },
    ],
    lens: "UI/UX is de laag tussen je aanbod en de klik. Slecht ontwerp kost omzet zonder dat je het in je ads-statistieken ziet. Ik ontwerp alsof elke pagina een landingspagina is: één duidelijke actie, vertrouwen op de plekken waar twijfel zit, en mobiel als echte omzet-driver als dat bij jou klopt.",
    approachSteps: [
      {
        title: "Klantreis en acties",
        body: "We brengen in kaart wie er landt, waar ze vandaan komen (SEO, Google Ads, Meta Ads) en welke stap je per scherm wilt. Objections van sales en support nemen we mee.",
      },
      {
        title: "Wireframes",
        body: "Structuur eerst: pagina's, secties, formulieren, checkout. Jij keurt de logica goed voordat er visuele polish komt.",
      },
      {
        title: "Visueel design",
        body: "Merk, typo, kleur en componenten die herhaalbaar zijn. Design system-light: snel itereren zonder dat elke pagina een eigen dialect spreekt.",
      },
      {
        title: "Handoff en iteratie",
        body: "Ontwerp met specs, states en a11y-notities. Afstemming met development zodat wat ontworpen is ook zo live gaat. Daarna meten we gedrag en scherpen bij.",
      },
    ],
    capabilities: [
      "Structuur eerst",
      "Specs klaar",
      "Mobiel-first",
      "Conversie-led",
      "Design system",
      "A11y meegenomen",
      "Build-ready",
    ],
    outcomes: [
      {
        title: "Schermen die twijfel wegnemen",
        detail:
          "Wireframes en schermen waar de primaire actie direct duidelijk is. Minder afhakers op mobiel, minder 'waar moet ik klikken?' in je inbox.",
      },
      {
        title: "Ontwerp met componenten en states",
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
      { label: "Aanpak", value: "Structuur eerst" },
      { label: "Deliverable", value: "Design klaar" },
      { label: "Focus", value: "Conversie" },
    ],
  },
  branding: {
    heroVisual: "brand",
    heroKicker:
      "Huisstijl die op je site, in Google Ads, Meta Ads en mail hetzelfde verhaal vertelt. Geen los logo-PDF dat in een la verdwijnt. Wel merk dat klanten herkennen en vertrouwen.",
    funFact:
      "Microsoft testte tientallen tinten blauw voor één linkkleur in Bing. De winnaar leverde tientallen miljoenen extra op. Kleur is geen smaak, kleur is omzet.",
    funFactSource: "Daarom strategie én uitvoering",
    funFactStat: "40",
    principles: [
      {
        title: "Positionering vóór pixels",
        body: "Wie ben je voor wie, en waarom jij en niet de concurrent? Dat bepaalt toon, kleur en beeld. Pas daarna logo, typo en templates. Geen mooi plaatje zonder verhaal.",
      },
      {
        title: "Eén merk, alle kanalen",
        body: "Je site kan strak zijn terwijl je ads nog 'oud' aanvoelen. Of omgekeerd. Ik zet richtlijnen neer die op site, mail, social en campagnes werken. BestRest en SkinComplete hebben elk een eigen wereld, geen copy-paste.",
      },
      {
        title: "Guidelines die je team snapt",
        body: "Geen 80-pagina PDF die niemand leest. Wel kleur, typo, beeldstijl en componenten die je team en partners direct kunnen toepassen. Klaar voor web, ads en mail.",
      },
    ],
    lens: "Branding is geen logo-ontwerp in isolatie. Het is hoe klanten je herkennen op de productpagina, in de nieuwsbrief en in de Google Ads die ze terugzien. Ik verbind merkstrategie met wat er écht live gaat, zodat je niet twee keer betaalt voor hetzelfde gevoel.",
    approachSteps: [
      {
        title: "Positionering & onderscheid",
        body: "Wie is je klant, wat belooft je merk, en waar wijk je af van alternatieven? We maken dat concreet voordat er kleur op papier komt.",
      },
      {
        title: "Visuele identiteit",
        body: "Logo, kleurpalet, typografie, beeldstijl en tone of voice. Alles getest op leesbaarheid, contrast en hoe het voelt op mobiel.",
      },
      {
        title: "Templates & componenten",
        body: "Social formats, ad-templates, e-mail headers en web-componenten. Herhaalbaar, zodat je team consistent blijft zonder elke keer opnieuw te bedenken.",
      },
      {
        title: "Live en door",
        body: "Guidelines overdragen, afstemmen met web en campagnes. Zo blijft je merk één geheel na launch, niet twee parallelle werelden.",
      },
    ],
    capabilities: [
      "Positionering",
      "Logo & huisstijl",
      "Web- & ad-templates",
      "Ad-ready",
      "Tone of voice",
      "Guidelines",
      "Web + campagnes",
    ],
    outcomes: [
      {
        title: "Positionering die onderscheidt",
        detail:
          "Duidelijk verhaal: wie je bent, voor wie, en waarom jij. Geen vage missie, wel keuzes die doorwerken in copy, design en campagnes.",
      },
      {
        title: "Huisstijl op alle kanalen",
        detail:
          "Site, Google Ads, Meta Ads, mail en social voelen als één merk. Geen oude banner naast een nieuwe homepage.",
      },
      {
        title: "Guidelines die blijven werken",
        detail:
          "Je team en partners weten welke kleur, welke font en welk beeld. Zonder elke keer jou te mailen voor 'even snel het logo'.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Strategie eerst" },
      { label: "Deliverable", value: "Guide + templates" },
      { label: "Focus", value: "Herkenning" },
    ],
  },
  animaties: {
    heroVisual: "motion",
    heroKicker:
      "Beweging die je site premium laat voelen zonder af te leiden. Micro-interacties, scroll-storytelling en overgangen met een performance-budget. GPU-vriendelijk, reduced motion ingebouwd.",
    funFact:
      "Skeleton screens laten een wachttijd tot veertig procent korter voelen dan een spinner. Motion met functie voelt sneller. Decoratie voelt traag.",
    funFactSource: "Daarom storyboard vóór animatie",
    funFactStat: "40%",
    principles: [
      {
        title: "Functie vóór flair",
        body: "Elke animatie moet iets doen: hiërarchie, feedback of richting. Geen parallax omdat het kan. Ik storyboard per sectie welke energie past: rust op trust, tempo op product, speelsheid waar het merk het toelaat.",
      },
      {
        title: "Performance-budget",
        body: "Transform en opacity, hardware-versneld. Geen layout-thrashing of zware filters op omzetpagina's. Je Google Ads-landings en checkout blijven groen terwijl de site levend aanvoelt.",
      },
      {
        title: "Reduced motion standaard",
        body: "prefers-reduced-motion hoort in elke component. Zo blijft je site premium voor iedereen, ook wie geen trillingen of excessieve beweging wil. Geen afterthought, wel onderdeel van het ontwerp.",
      },
    ],
    lens: "Motion is de laag tussen statisch design en een site die je onthoudt. Te veel beweging kost conversie. Te weinig voelt goedkoop. Ik kies per scherm en sectie wat vertrouwen, speelsheid of tempo ondersteunt. Binnen een budget dat Core Web Vitals niet sloopt.",
    approachSteps: [
      {
        title: "Storyboard & energie",
        body: "Welke secties rust, welke tempo? We brengen de klantreis in kaart en kiezen waar motion verhaal vertelt en waar stilte conversie dient.",
      },
      {
        title: "Micro-interacties",
        body: "Hover, press, focus, loading en scroll-reveals. Framer Motion of CSS: wat past bij stack, team en onderhoud. Altijd met states die development kan bouwen.",
      },
      {
        title: "Implementatie & test",
        body: "GPU-vriendelijke animaties, prefers-reduced-motion en meting op echte devices. Geen demo die op je MacBook Pro vloeiend is en op mobiel hapert.",
      },
      {
        title: "Iteratie op gedrag",
        body: "Heatmaps, scroll-diepte en conversie per sectie. Motion die niet helpt gaat eruit. Motion die richting geeft, blijft en schaalt mee bij groei.",
      },
    ],
    capabilities: [
      "Storyboard",
      "Micro-interacties",
      "Scroll reveals",
      "Framer Motion",
      "CSS motion",
      "Reduced motion",
      "CWV-safe",
    ],
    outcomes: [
      {
        title: "Motion met doel",
        detail:
          "Animaties die hiërarchie en feedback geven, geen ruis. Bezoekers weten waar ze moeten klikken en voelen dat de site responsief is.",
      },
      {
        title: "Snel en toegankelijk",
        detail:
          "Hardware-versnelde transitions binnen je performance-budget. Reduced motion ingebouwd, zodat premium niet ten koste gaat van inclusiviteit.",
      },
      {
        title: "Storyboard per sectie",
        detail:
          "Consistente energie over de hele site: rust waar twijfel zit, tempo waar je product of proces uitlegt. Geen willekeurige effecten per pagina.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Storyboard" },
      { label: "Stack", value: "FM + CSS" },
      { label: "Focus", value: "Conversie" },
    ],
  },
  seo: {
    heroVisual: "seo",
    heroKicker:
      "Hoger in Google door content die antwoord geeft, structuur die klopt en techniek die zoekmachines begrijpen. Geen trucjes. Wel posities die blijven staan.",
    funFact:
      "Bijna dertig procent van alle kliks gaat naar resultaat één. Resultaat tien krijgt minder dan één procent. Positie is geen trofee, positie is omzet.",
    funFactSource: "Daarom meten we per pagina, niet per vanity keyword",
    funFactStat: "30%",
    principles: [
      {
        title: "Zoekintentie vóór volume",
        body: "Ik begin bij wat jouw klant echt typt en waarom. Niet bij keywords met hoog volume waar niemand koopt. SkinComplete domineerde eerst organisch. Ads kwamen daarna, goedkoper.",
      },
      {
        title: "Techniek én content samen",
        body: "Snelheid, schema, interne links en copy horen bij elkaar. Een perfecte blog helpt niks als Google je site niet kan crawlen. Ik pak beide laag in één traject.",
      },
      {
        title: "Meten wat omzet oplevert",
        body: "Posities zijn leuk. Conversie per pagina is waar je op stuurt. Search Console, rankings en wat er in je CRM binnenkomt: één verhaal, geen losse SEO-rapportage.",
      },
    ],
    lens: "SEO is geen los kanaal. Het is het fundament onder ads, content en AI-zoek. Elke pagina die je organisch wint, maakt elke euro advertentie daarna goedkoper.",
    approachSteps: [
      {
        title: "Audit & zoekintentie",
        body: "We brengen in kaart waar je staat, wat je klant zoekt en welke pagina's al verkeer of omzet dragen. Geen alles-tegelijk-plan.",
      },
      {
        title: "Structuur & clusters",
        body: "Hubs, interne links en URL-logica die passen bij jouw niche. Lokale dienst, webshop of B2B: elk vraagt een andere architectuur.",
      },
      {
        title: "Content & techniek",
        body: "Pagina's die antwoord geven, schema-markup, snelheid en crawlbaarheid. Alles custom, alles meetbaar per template.",
      },
      {
        title: "Posities vasthouden",
        body: "Maandelijks bijsturen: wat stijgt krijgt versterking, wat stagneert krijgt een test. Geen set-and-forget.",
      },
    ],
    capabilities: [
      "Zoekintentie",
      "Technische SEO",
      "Contentclusters",
      "Schema markup",
      "Search Console",
      "Per pagina meten",
      "Organisch eerst",
    ],
    outcomes: [
      {
        title: "Posities op vragen die verkopen",
        detail:
          "Niet alleen traffic op brede termen. Pagina's die de koopintentie raken en leads of orders opleveren. Meetbaar in Search Console én in je omzet.",
      },
      {
        title: "Site die Google snapt",
        detail:
          "Logische structuur, snelle templates, schema en interne links. De onzichtbare laag die bepaalt of je content überhaupt kan ranken.",
      },
      {
        title: "Fundament voor ads en AI",
        detail:
          "Sterke organische basis maakt Google Ads goedkoper en geeft AI-modellen citeerbare bronnen. Eén investering, drie kanalen.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Intentie-first" },
      { label: "Meting", value: "Per pagina" },
      { label: "Case", value: "SkinComplete" },
    ],
  },
  "ai-zoek": {
    heroVisual: "ai-search",
    heroKicker:
      "Gevonden worden als iemand ChatGPT of Gemini vraagt welk bedrijf ze moeten kiezen. Geen toekomstmuziek. Wel structuren die AI vandaag al citeert.",
    funFact:
      "Steeds meer jongvolwassenen stellen hun eerste vraag aan AI, niet aan Google. Sta jij niet in dat antwoord, dan besta je voor hen niet.",
    funFactSource: "Daarom optimaliseren we voor Google én AI",
    funFactStat: "AI",
    principles: [
      {
        title: "Citeerbaar schrijven",
        body: "AI-modellen pakken duidelijke, feitelijke antwoorden met structuur. Vage marketingtaal negeren ze. Ik schrijf en structureer zodat jij bron wordt, niet ruis.",
      },
      {
        title: "SEO als fundament",
        body: "Wat goed rankt in Google voedt vaak ook AI-antwoorden. Schema, autoriteit en heldere pagina's doen dubbel werk. Geen aparte truc, wel één keten.",
      },
      {
        title: "Meten waar je genoemd wordt",
        body: "We testen wat ChatGPT, Gemini en AI Overviews nu antwoorden op jouw categorie. Niet gokken, wel bijsturen op basis van wat er echt verschijnt.",
      },
    ],
    lens: "AI-zoek is een volwaardig kanaal naast Google. Wie daar niet in het antwoord staat, verliest klanten voordat die ooit een zoekresultaat zien. Ik bouw dat mee in je content en techniek.",
    approachSteps: [
      {
        title: "Baseline in AI-antwoorden",
        body: "Wat zegt ChatGPT over jouw markt? Waar word jij genoemd, waar niet? Dat is het startpunt, niet een gevoel.",
      },
      {
        title: "Content & entiteiten",
        body: "Heldere antwoorden op klantvragen, bedrijfsinformatie die klopt overal, schema en interne structuur die autoriteit opbouwt.",
      },
      {
        title: "Technische signalen",
        body: "Snelheid, crawlbaarheid, gestructureerde data en consistente merk- en bedrijfsinfo. AI leest je site letterlijk.",
      },
      {
        title: "Bijhouden & versterken",
        body: "Modellen veranderen. We meten periodiek opnieuw en scherpen pagina's aan die het meest geciteerd worden.",
      },
    ],
    capabilities: [
      "ChatGPT",
      "Gemini",
      "AI Overviews",
      "Schema markup",
      "Citeerbare copy",
      "Entity SEO",
      "Meetbaar",
    ],
    outcomes: [
      {
        title: "Vermelding in AI-antwoorden",
        detail:
          "Zichtbaar als iemand vraagt welk bedrijf ze moeten kiezen in jouw categorie. Meetbaar door periodieke checks op de belangrijkste prompts.",
      },
      {
        title: "Content die modellen begrijpen",
        detail:
          "Pagina's met duidelijke koppen, feiten en antwoorden. Geen keyword-stuffing, wel structuur die zowel Google als AI kan parsen.",
      },
      {
        title: "Sterker klassiek SEO",
        detail:
          "Elke AI-optimalisatie versterkt ook je Google-posities. Dubbel rendement op dezelfde pagina's.",
      },
    ],
    heroStats: [
      { label: "Kanalen", value: "Google + AI" },
      { label: "Focus", value: "Citeerbaar" },
      { label: "Meting", value: "Prompt checks" },
    ],
  },
  "local-seo": {
    heroVisual: "local",
    heroKicker:
      "Bovenaan in Maps als iemand in jouw regio zoekt. Google Business, lokale pagina's en reviews op één lijn. Geen generieke landingspagina voor heel Nederland.",
    funFact:
      "Zoekopdrachten met 'bij mij in de buurt' zijn de afgelopen jaren harder gegroeid dan bijna elk ander type. Lokaal is geen bijzaak meer.",
    funFactSource: "Daarom per regio en dienst ingericht",
    funFactStat: "Lokaal",
    principles: [
      {
        title: "Profiel dat compleet is",
        body: "Half ingevuld Google Business-profiel verliest van de concurrent die foto's, diensten, Q&A en posts wél bijhoudt. Ik richt alles in alsof elke dag iemand langs komt kijken.",
      },
      {
        title: "Pagina's per plek",
        body: "'Dienst + stad' is geen trucje als de pagina echt lokaal antwoord geeft. Ik bouw landings die scoren én converteren voor mensen die dichtbij zoeken.",
      },
      {
        title: "Reviews als ranking",
        body: "Sterren en volume bepalen wie in de local pack staat. Ik koppel reviewstrategie aan je Google Business, niet als los project achteraf.",
      },
    ],
    lens: "Lokaal zoeken is impulsief: kaart open, drie opties, bellen of route. Jouw plek in dat lijstje bepaalt of de telefoon gaat. Alles moet kloppen: profiel, pagina's, reviews, NAP overal hetzelfde.",
    approachSteps: [
      {
        title: "Regio & profiel audit",
        body: "Waar zitten je klanten echt? Hoe compleet is je Google Business? Waar lekt vertrouwen weg in profiel, foto's of categorieën?",
      },
      {
        title: "Lokale pagina's",
        body: "Landings per dienst en regio met unieke copy, schema en interne links. Geen copy-paste met alleen de stad gewisseld.",
      },
      {
        title: "Reviews & reputatie",
        body: "Meer en betere reviews op de plekken die tellen. Systematisch vragen, netjes reageren, ook op kritiek.",
      },
      {
        title: "Consistentie & groei",
        body: "Naam, adres, telefoon overal identiek. Posts, updates en maandelijkse check op posities in Maps.",
      },
    ],
    capabilities: [
      "Google Business",
      "Maps",
      "Lokale landings",
      "Review flow",
      "NAP consistent",
      "Local schema",
      "Per regio",
    ],
    outcomes: [
      {
        title: "Zichtbaar in de local pack",
        detail:
          "Top-drie in Maps voor de zoektermen die in jouw regio omzet opleveren. Niet alleen in Google, ook als iemand via telefoon Maps opent.",
      },
      {
        title: "Profiel dat vertrouwen geeft",
        detail:
          "Complete Google Business met foto's, diensten, posts en Q&A. Bezoekers zien meteen dat je actief en betrouwbaar bent.",
      },
      {
        title: "Reviews die blijven stromen",
        detail:
          "Structurele stroom nieuwe beoordelingen via flows na aankoop of afronding. Hogere score, meer kliks, minder twijfel.",
      },
    ],
    heroStats: [
      { label: "Focus", value: "Maps + GBP" },
      { label: "Aanpak", value: "Per regio" },
      { label: "Reviews", value: "Ingebouwd" },
    ],
  },
  "content-marketing": {
    heroVisual: "content",
    heroKicker:
      "Pagina's en artikelen die de vragen van je klant echt beantwoorden. Geen opgeblazen blogkalender. Wel content die verkeer, vertrouwen en verkopen oplevert.",
    funFact:
      "Bedrijven die consistent antwoord geven op klantvragen in content zien gemiddeld drie keer meer organisch verkeer dan sites die alleen productpagina's hebben.",
    funFactSource: "Daarom clusters, geen losse posts",
    funFactStat: "3×",
    principles: [
      {
        title: "Vragen vóór kalender",
        body: "Ik start bij wat mensen zoeken en wat sales je vertelt over twijfel. Geen artikel per week omdat het moet. Wel pagina's die een taak hebben in je funnel.",
      },
      {
        title: "Clusters, geen losse posts",
        body: "Eén hub-pagina met satellite-artikelen die intern linken en autoriteit opbouwen per onderwerp. Zo rank je op hele thema's, niet op één keyword.",
      },
      {
        title: "Conversie ingebouwd",
        body: "Traffic zonder vervolgstap is hobby. Elke pagina weet waar naartoe: aanvraag, product, shop. Content is verkoopkanaal, geen kostenpost.",
      },
    ],
    lens: "Content zonder zoekintentie is drukte. Ik schrijf en structureer wat jouw klant echt nodig heeft, in Google én in AI-zoek. Elke pagina groeit mee en versterkt de rest van je site.",
    approachSteps: [
      {
        title: "Zoekvragen & gaps",
        body: "Wat vraagt je klant vóór de koop? Wat mist er op je site? We prioriteren op impact, niet op volume alleen.",
      },
      {
        title: "Cluster & structuur",
        body: "Hubs, interne links en URL-logica. Jij levert vakkennis, ik zorg dat het rankbaar en leesbaar wordt.",
      },
      {
        title: "Schrijven & publiceren",
        body: "Artikelen en landings die menselijk klinken, technisch kloppen en schema dragen waar het helpt.",
      },
      {
        title: "Meten & bijsturen",
        body: "Verkeer, posities en conversie per pagina. Wat werkt krijgt vervolg, wat niet werkt gaat eruit.",
      },
    ],
    capabilities: [
      "Zoekintentie",
      "Topic clusters",
      "Interne links",
      "AI-ready copy",
      "Per pagina meten",
      "Geen fluff",
      "Conversiepad",
    ],
    outcomes: [
      {
        title: "Autoriteit per onderwerp",
        detail:
          "Clusters die je positioneren als dé bron in jouw niche. Meer vertrouwen, meer verkeer, kortere salescyclus.",
      },
      {
        title: "Verkeer dat converteert",
        detail:
          "Pagina's met een duidelijke vervolgstap. Geen bounce naar nergens, wel routes naar aanvraag, shop of contact.",
      },
      {
        title: "Content die blijft werken",
        detail:
          "Evergreen pagina's die maand na maand traffic opleveren. Bijgewerkt waar nodig, niet weggegooid na één seizoen.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Clusters" },
      { label: "Focus", value: "Intentie" },
      { label: "Meting", value: "Per pagina" },
    ],
  },
  reviews: {
    heroVisual: "reviews",
    heroKicker:
      "Meer en betere reviews op de plekken waar klanten kijken vóór ze kopen. Geen hoop dat ze vanzelf komen. Wel een systeem dat tevreden klanten op het juiste moment vraagt.",
    funFact:
      "Negen van de tien mensen leest reviews vóór een aankoop. Gemiddeld scoren bedrijven met actieve reviewflow tientallen procentpunten meer dan wie passief afwacht.",
    funFactSource: "Daarom automatisch vragen op het juiste moment",
    funFactStat: "9/10",
    principles: [
      {
        title: "Juiste moment, juiste platform",
        body: "Te vroeg vragen irriteert. Te laat vergeet men het. Ik koppel reviewverzoeken aan aankoop, levering of afronding. Op Google, Trustpilot of wat in jouw branche telt.",
      },
      {
        title: "Kritiek hoort erbij",
        body: "Een perfecte 5,0 zonder enkele kritische review gelooft niemand. Ik help netjes reageren. Dat wekt meer vertrouwen dan tien juichende zonder context.",
      },
      {
        title: "Zichtbaar waar het telt",
        body: "Reviews op je site met schema voor sterren in Google, gekoppeld aan Maps en je productpagina's. Social proof overal waar twijfel zit.",
      },
    ],
    lens: "Reviews zijn gratis verkoopkracht als je ze systematisch opbouwt. Ze verhogen Maps-posities, CTR in Google en conversie op je site. Ik bouw de flow, jij levert de service waar mensen blij van worden.",
    approachSteps: [
      {
        title: "Platforms & baseline",
        body: "Waar kijkt jouw klant? Wat is je score nu versus concurrenten? We kiezen waar we eerst op sturen.",
      },
      {
        title: "Review flow bouwen",
        body: "Automatische mails of SMS na aankoop of afronding. Timing, toon en link naar het juiste platform.",
      },
      {
        title: "Zichtbaar maken",
        body: "Reviews op site, schema-markup, widgets waar het vertrouwen geeft zonder rommelig te worden.",
      },
      {
        title: "Reageren & bijsturen",
        body: "Templates en proces voor kritiek. Maandelijks: volume, score en wat we testen in timing of channel.",
      },
    ],
    capabilities: [
      "Google reviews",
      "Trustpilot",
      "Auto flow",
      "Schema sterren",
      "Kritiek netjes",
      "Maps boost",
      "Meetbaar",
    ],
    outcomes: [
      {
        title: "Steeds meer reviews",
        detail:
          "Structurele stroom nieuwe beoordelingen in plaats van af en toe een lucky shot. Hogere score, betere Maps-posities.",
      },
      {
        title: "Sterren in Google",
        detail:
          "Rich snippets en vertrouwen in zoekresultaten. Meer kliks op dezelfde positie door zichtbare social proof.",
      },
      {
        title: "Minder twijfel op site",
        detail:
          "Echte reviews op product- of dienstpagina's waar mensen nog twijfelen. Conversie omhoog zonder hardere salescopy.",
      },
    ],
    heroStats: [
      { label: "Focus", value: "Google + site" },
      { label: "Aanpak", value: "Auto flow" },
      { label: "Resultaat", value: "Meer sterren" },
    ],
  },
  strategie: {
    heroVisual: "growth-plan",
    heroKicker:
      "Eén groeiplan voor jouw bedrijf: welke kanalen, welk budget en wat eerst. Ik schrijf het én voer het uit. Dus het blijft geen PDF in een la.",
    funFact:
      "De gemiddelde ondernemer werkt met drie tot vijf aparte partijen voor site, ads en SEO. Dan praat niemand met elkaar en betaal je dubbel.",
    funFactSource: "Daarom één plan onder één dak",
    funFactStat: "3–5",
    principles: [
      {
        title: "Data vóór kanalen",
        body: "Ik begin bij je cijfers: waar komt omzet vandaan, waar lekt het weg, wat mag een klant kosten. Pas daarna kies ik kanalen. Niet andersom.",
      },
      {
        title: "Maximaal drie focuspunten",
        body: "Alles tegelijk is niets tegelijk. We kiezen max drie hefbomen tegelijk. De rest wacht zijn beurt met een duidelijke reden.",
      },
      {
        title: "Plan én uitvoering",
        body: "Ik bouw sites, zet Google Ads en Meta Ads op en schrijf content zelf. Dus het plan is realistisch. Geen twintig kanalen waarvan er achttien blijven liggen.",
      },
    ],
    lens: "Strategie is het stuurwiel. Zonder plan verbrand je budget op losse acties. Met een plan weet je wat eerst moet, wat het kost en wanneer je opschaalt. BestRest kreeg per product een eigen route. Jij krijgt jouw route.",
    approachSteps: [
      {
        title: "Cijfers & doelen",
        body: "Omzet, marge, huidige kanalen en waar je over twaalf maanden wilt staan. Eerlijk, op basis van data waar die er is.",
      },
      {
        title: "Kanalen & volgorde",
        body: "Welke hefbomen leveren het snelst winst? SEO eerst, site eerst, ads eerst? Dat beslissen we op jouw situatie, niet op hype.",
      },
      {
        title: "Plan op papier én in de agenda",
        body: "Budget, KPI's, wie wat doet en wanneer je resultaat verwacht. Uitvoerbaar, niet theoretisch.",
      },
      {
        title: "Maandelijks bijsturen",
        body: "Wat werkt krijgt gas. Wat niet werkt gaat eruit. Geen sentiment, wel cijfers.",
      },
    ],
    capabilities: [
      "Groeiplan",
      "Max. 3 kanalen",
      "Budget & volgorde",
      "Meetbaar",
      "Plan + uitvoering",
      "Maandelijks sturen",
      "Geen PDF-lade",
    ],
    outcomes: [
      {
        title: "Eén plan dat klopt",
        detail:
          "Kanalen, budget en volgorde in één document dat je snapt. Geen losse acties meer tussen bureaus die elkaar tegenwerken.",
      },
      {
        title: "Onderbouwd met jouw cijfers",
        detail:
          "Keuzes op marge, huidige omzet en realistische groeidoelen. Niet op wat de concurrent doet of wat LinkedIn zegt.",
      },
      {
        title: "Uitvoering inbegrepen",
        detail:
          "Ik voer het plan zelf uit: bouwen, SEO, Google Ads, Meta Ads. Dus het blijft geen strategie die in een la verdwijnt.",
      },
    ],
    heroStats: [
      { label: "Focus", value: "Max. 3 kanalen" },
      { label: "Aanpak", value: "Data-first" },
      { label: "Case", value: "BestRest" },
    ],
  },
  adverteren: {
    heroVisual: "ads-strategy",
    heroKicker:
      "Google Ads en Meta Ads op één lijn: budget, funnel en schaalpad. Geen losse campagnes zonder landingspagina. Wel een structuur die je snapt en kunt sturen.",
    funFact:
      "Gemiddeld gaat ruim een kwart van advertentiebudget naar zoektermen die je al organisch scoret. Wie SEO en ads combineert, betaalt dubbel voor dezelfde klik.",
    funFactSource: "Daarom eerst kijken wat al werkt",
    funFactStat: "26%",
    principles: [
      {
        title: "Funnel vóór budget",
        body: "Koud, warm, hot: elke fase krijgt eigen creatives, landings en KPI's. Ik schaal pas als de keten klopt, niet als Google om meer vraagt.",
      },
      {
        title: "Google én Meta bewust",
        body: "Zoekintentie op Google, discovery op Meta. Twee kanalen, één verhaal. Creatives en landings vertellen hetzelfde, anders lekt budget weg.",
      },
      {
        title: "Meting tot de verkoop",
        body: "ROAS op dashboard-niveau is leuk. ROAS op echte marge is waar je op stuurt. Conversie moet kloppen, anders optimaliseer je op ruis.",
      },
    ],
    lens: "Advertentiestrategie is niet 'budget omhoog'. Het is weten welk kanaal wanneer gas krijgt, welke landings klaar moeten zijn en wanneer je stopt met testen en gaat schalen.",
    approachSteps: [
      {
        title: "Break-even & marge",
        body: "Wat mag een klant kosten? Welke ROAS of CPA is winstgevend? Dat bepalen we vóór er euro's uitgaan.",
      },
      {
        title: "Account & funnel structuur",
        body: "Google Ads en Meta Ads ingericht op jouw salescyclus. Audiences, creatives en landings per fase.",
      },
      {
        title: "Testen met leercurve",
        body: "Klein starten, snel leren welke hooks en zoektermen renderen. Budget naar winnaars, rest eruit.",
      },
      {
        title: "Schaalpad",
        body: "Wanneer meer budget zinvol is. En wanneer eerst CRO of site de bottleneck is. Dat maak ik expliciet.",
      },
    ],
    capabilities: [
      "Google Ads",
      "Meta Ads",
      "Funnel structuur",
      "ROAS-sturing",
      "Schaalpad",
      "Landings aligned",
      "Maandelijks rapport",
    ],
    outcomes: [
      {
        title: "Budget naar klanten",
        detail:
          "Accountstructuur die zoektermen en audiences uitsluit die nooit converteren. Minder lekkage, meer omzet per euro.",
      },
      {
        title: "Google + Meta op één lijn",
        detail:
          "Creatives, copy en landings die hetzelfde beloven. Geen Meta-advertentie die naar een homepage zonder CTA leidt.",
      },
      {
        title: "Schaalpad dat klopt",
        detail:
          "Duidelijk wanneer opschalen slim is en wanneer eerst site, tracking of CRO moet. Geen budget burn zonder leercurve.",
      },
    ],
    heroStats: [
      { label: "Kanalen", value: "Google + Meta" },
      { label: "Sturing", value: "ROAS / CPA" },
      { label: "Focus", value: "Funnel" },
    ],
  },
  cro: {
    heroVisual: "cro",
    heroKicker:
      "Meer omzet uit hetzelfde aantal bezoekers. Ik kijk waar mensen afhaken, wat twijfel wegneemt en welke knoppen beter kunnen. Op data, niet op gevoel.",
    funFact:
      "Een verbetering van één procentpunt conversie op een site met tienduizend bezoekers per maand levert soms meer op dan duizenden euro extra adsbudget.",
    funFactSource: "Daarom eerst frictie weg, dan pas meer traffic",
    funFactStat: "1%",
    principles: [
      {
        title: "Gedrag vóór meningen",
        body: "Scroll-diepte, rage clicks, formulier-abandon: ik start bij wat je bezoeker doet. Niet bij wat iemand in een vergadering mooi vindt.",
      },
      {
        title: "Hypotheses, geen gokken",
        body: "Elke wijziging heeft een reden en een meetpunt. Soms is een UX-sprint met sessie-opnames slimmer dan een A/B-test zonder volume.",
      },
      {
        title: "Samen met ads en SEO",
        body: "Meer conversie op verkeerde bezoekers helpt niet. CRO werkt het best als traffic-kwaliteit en landings op één lijn zitten.",
      },
    ],
    lens: "CRO is geen knopkleur veranderen. Het is frictie wegnemen op checkout, formulieren en mobiel. BestRest en SkinComplete hadden elk andere bottlenecks. Jij ook.",
    approachSteps: [
      {
        title: "Gedrag in kaart",
        body: "Heatmaps, scroll, formulier-drop en sessie-opnames op pagina's die omzet dragen. Waar haken mensen af?",
      },
      {
        title: "Hypotheses prioriteren",
        body: "Wat levert de grootste winst voor de minste inspanning? Trust, copy, layout, snelheid: ik rank op impact.",
      },
      {
        title: "Testen of doorvoeren",
        body: "A/B waar volume het toelaat. UX-sprints waar sneller inzicht meer oplevert. Altijd met eerlijke conclusies.",
      },
      {
        title: "Meten en door",
        body: "Voor/na op conversie en omzet per pagina. Wat werkt blijft, wat niet werkt gaat terug.",
      },
    ],
    capabilities: [
      "Heatmaps",
      "A/B-tests",
      "UX-sprints",
      "Checkout focus",
      "Mobiel-first",
      "Met ads aligned",
      "Eerlijke stats",
    ],
    outcomes: [
      {
        title: "Meer conversie, zelfde traffic",
        detail:
          "Hogere conversie op checkout, formulieren en landings zonder extra adsbudget. Meetbaar in GA4, Clarity of je shop-data.",
      },
      {
        title: "Hypotheses met bewijs",
        detail:
          "Wijzigingen op basis van gedrag, niet op underbuikgevoel. Duidelijke voor/na of testresultaten waar volume het toelaat.",
      },
      {
        title: "Samenhang met acquisitie",
        detail:
          "CRO afgestemd op Google Ads, Meta Ads en SEO. Betere traffic én betere landings, niet één van twee.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Gedrag-first" },
      { label: "Focus", value: "Checkout · mobiel" },
      { label: "Meting", value: "Conversie" },
    ],
  },
  leadgeneratie: {
    heroVisual: "leads",
    heroKicker:
      "B2B en e-commerce leads die niet verdwijnen in je inbox. Aanbod, landings, CRM-koppeling en opvolging als één keten. Kwaliteit boven volume.",
    funFact:
      "Een lead die binnen vijf minuten wordt opgevolgd, converteert tot negen keer vaker dan een lead die een dag wacht. Snelheid is geen luxe.",
    funFactSource: "Daarom flows, geen losse formulieren",
    funFactStat: "9×",
    principles: [
      {
        title: "Aanbod dat pijn raakt",
        body: "Een leadmagnet voor accountants ziet er anders uit dan voor webshops. Ik ontwerp proposities die aansluiten op echte twijfel, niet op generieke ebooks.",
      },
      {
        title: "CRM, geen inbox-chaos",
        body: "Leads gaan direct naar je CRM met scoring waar het zinvol is. Sales ziet context, geen dump van ongelezen mail.",
      },
      {
        title: "Opvolging menselijk",
        body: "Automatische mails die klinken als jij, niet als spambot. Sequences met timing die past bij B2B-deals of shop-aankopen.",
      },
    ],
    lens: "Leadgeneratie is een keten: aanbod, landing, form, CRM, opvolging, deal. Breekt één schakel, dan betaal je voor leads die nergens landen.",
    approachSteps: [
      {
        title: "Pijnpunten & propositie",
        body: "Wat houdt je ideale klant tegen? We vertalen dat naar een aanbod en landing die direct duidelijk zijn.",
      },
      {
        title: "Landing & form",
        body: "Pagina's die converteren, forms die niet te veel vragen en tracking die elke lead registreert.",
      },
      {
        title: "CRM & scoring",
        body: "Koppeling met HubSpot, Pipedrive of wat jij gebruikt. Scoring en routing waar sales tijd bespaart.",
      },
      {
        title: "Opvolging & rapportage",
        body: "Mailflows, reminders en maandelijkse cijfers: kosten per lead, kwaliteit en doorloop naar deal.",
      },
    ],
    capabilities: [
      "B2B leads",
      "E-commerce leads",
      "Landings",
      "CRM koppeling",
      "Scoring",
      "Mail flows",
      "CPL meten",
    ],
    outcomes: [
      {
        title: "Pipeline die vult",
        detail:
          "Gestage stroom leads die sales of jouw team kunnen opvolgen. Niet alleen volume, ook relevantie per bron.",
      },
      {
        title: "Kosten per lead helder",
        detail:
          "Rapportage op CPL, kwaliteit en doorloop. Je weet welk kanaal leads oplevert die echt deals worden.",
      },
      {
        title: "Opvolging zonder spam",
        detail:
          "Sequences die menselijk blijven en op tijd arriveren. Geen leads die na drie dagen koud zijn.",
      },
    ],
    heroStats: [
      { label: "Focus", value: "Kwaliteit" },
      { label: "Koppeling", value: "CRM" },
      { label: "Meting", value: "CPL · deals" },
    ],
  },
  tracking: {
    heroVisual: "tracking",
    heroKicker:
      "GTM, dataLayer, Clarity en dashboards die kloppen. Eén waarheid voor Google Ads, Meta Ads, site en shop. Anders optimaliseer je op ruis.",
    funFact:
      "Tot veertig procent van conversiedata in advertentieplatforms gaat verloren door verkeerde tags, consent-problemen of dubbele events. Dan stuur je blind.",
    funFactSource: "Daarom event-spec vóór opschalen",
    funFactStat: "40%",
    principles: [
      {
        title: "Events met functie",
        body: "Elk event heeft een doel: sturen op ads, CRO of boardroom. Geen dataLayer vol ruis waar niemand iets mee doet.",
      },
      {
        title: "Consent netjes",
        body: "Tags en cookies die samenwerken met je banner. Geen meting die AVG negeert, geen consent die je ads kapot maakt.",
      },
      {
        title: "Debugbaar voor je team",
        body: "Documentatie en een proces om te checken of events nog kloppen na elke site-wijziging. Geen black box die niemand durft aan te raken.",
      },
    ],
    lens: "Als meting niet klopt, vechten kanalen om schuld. Tracking is het fundament onder strategie, ads en CRO. Eén waarheid, zelfde cijfers in campagnes én in je vergadering.",
    approachSteps: [
      {
        title: "Audit & event-spec",
        body: "Wat moet je meten voor ads, site en management? We brengen gaps en dubbele events in kaart.",
      },
      {
        title: "GTM & dataLayer",
        body: "Tags, triggers en variabelen op maat. Server-side waar het nodig is, client-side waar het kan.",
      },
      {
        title: "Consent & testen",
        body: "Cookie-banner, tag firing en debug in staging. Geen live-gang zonder check op echte conversies.",
      },
      {
        title: "Dashboards & onderhoud",
        body: "Overzichten die je écht opent. Plus uitleg voor je team wat te doen als iets afwijkt.",
      },
    ],
    capabilities: [
      "GTM",
      "DataLayer",
      "Clarity",
      "GA4",
      "Server-side",
      "Consent",
      "Debug docs",
    ],
    outcomes: [
      {
        title: "Conversies die kloppen",
        detail:
          "Google Ads en Meta Ads optimaliseren op echte verkopen of leads, niet op ghost-conversies door dubbele tags.",
      },
      {
        title: "Event-spec op maat",
        detail:
          "E-commerce, leads, scroll, video: alles gedocumenteerd en testbaar. Je team weet wat elk event doet.",
      },
      {
        title: "Dashboards die je gebruikt",
        detail:
          "Geen veertig tabbladen. Wel de cijfers die je nodig hebt voor campagnes én voor je maandelijkse beslissing.",
      },
    ],
    heroStats: [
      { label: "Stack", value: "GTM · GA4" },
      { label: "Focus", value: "Eén waarheid" },
      { label: "Extra", value: "Clarity" },
    ],
  },
  "google-ads": {
    heroVisual: "google-ads",
    heroKicker:
      "Bovenaan staan op het moment dat iemand zoekt naar wat jij verkoopt. Structuur die je snapt, meting die klopt, budget naar klanten. Niet naar loze klikken.",
    funFact:
      "Gemiddeld klikt iemand op één van de eerste drie Google-resultaten. Onder positie vier verdwijnt je kans exponentieel. Positie is geen vanity metric.",
    funFactSource: "Daarom uitsluiten wat niet converteert",
    funFactStat: "Top 3",
    principles: [
      {
        title: "Zoekintentie boven volume",
        body: "Ik bied op termen die verkopen, niet op brede keywords die alleen traffic opleveren. Shopping, Search of Performance Max: wat past bij jouw marge en aanbod.",
      },
      {
        title: "Structuur die je snapt",
        body: "Campagnes ingericht zodat jij ziet waar budget naartoe gaat. Geen black box account waar alleen het bureau de weg kent.",
      },
      {
        title: "Meting tot de verkoop",
        body: "Conversies moeten kloppen tot aan checkout of lead. Anders optimaliseert Google op ghost-data en betaal jij voor klikken zonder waarde.",
      },
    ],
    lens: "Google Ads is het kanaal voor mensen die al zoeken. Dat moment is goud waard, maar Google verdient aan klikken. Ik bewaak dat verschil elke week opnieuw.",
    approachSteps: [
      {
        title: "Break-even & structuur",
        body: "Wat mag een klant kosten? Welke zoektermen en campagnes passen bij je marge? We zetten de basis vóór er budget uitgaat.",
      },
      {
        title: "Campagnes live",
        body: "Search, Shopping, Performance Max waar het zinvol is. Landings die converteren, tracking die klopt.",
      },
      {
        title: "Leren & uitsluiten",
        body: "Zoektermenrapport, negatieve keywords, audiences. Budget naar winnaars, ruis eruit.",
      },
      {
        title: "Schaal of fix",
        body: "Meer budget alleen als ROAS of CPA klopt. Anders eerst landings, CRO of tracking.",
      },
    ],
    capabilities: [
      "Search",
      "Shopping",
      "Performance Max",
      "Negatieve keywords",
      "ROAS-sturing",
      "Landings aligned",
      "Rapportage NL",
    ],
    outcomes: [
      {
        title: "Budget naar klanten",
        detail:
          "Campagnes die zoektermen uitsluiten die nooit converteren. Minder lekkage, meer omzet per euro.",
      },
      {
        title: "Structuur die je volgt",
        detail:
          "Account opgebouwd zodat jij snapt waar budget naartoe gaat. Maandelijkse rapportage in gewone taal.",
      },
      {
        title: "Schaalpad met discipline",
        detail:
          "Opschalen als cijfers kloppen. Stoppen of bijsturen als landings of tracking de bottleneck zijn.",
      },
    ],
    heroStats: [
      { label: "Kanalen", value: "Search · Shopping" },
      { label: "Sturing", value: "ROAS / CPA" },
      { label: "Focus", value: "Intentie" },
    ],
  },
  "meta-ads": {
    heroVisual: "meta-ads-feed",
    heroKicker:
      "Facebook en Instagram campagnes die verkopen. Creatives die stoppen met scrollen, doelgroepen die kloppen, meting die overeind blijft na alle privacy-wijzigingen.",
    funFact:
      "De gemiddelde gebruiker scrollt honderden meters per dag door feeds. Je creative heeft minder dan een seconde om op te vallen. Hook of weg.",
    funFactSource: "Daarom varianten testen, niet één video",
    funFactStat: "1 sec",
    principles: [
      {
        title: "Creative is het product",
        body: "Op Meta koop je aandacht. De hook, het beeld en de eerste regel copy bepalen of iemand stopt. Ik test varianten tot er winnaars zijn.",
      },
      {
        title: "Funnel van koud tot hot",
        body: "Prospecting, retargeting, bestaande kopers: elke fase krijgt eigen creatives en KPI's. Geen koud publiek met hard-sell zonder warming.",
      },
      {
        title: "Meting die blijft werken",
        body: "Conversie-API, events en landings op één lijn. Privacy verandert, je stuurcijfers moeten betrouwbaar blijven.",
      },
    ],
    lens: "Meta Ads onderbreken iemand die iets anders deed. Dat lukt alleen met content die niet als advertentie voelt en een aanbod dat direct duidelijk is.",
    approachSteps: [
      {
        title: "Funnel & doelgroep",
        body: "Waar zit je publiek? Koud, warm, hot? We tekenen de structuur en kiezen formats per fase.",
      },
      {
        title: "Creatives & hooks",
        body: "Varianten voor testen: UGC, studio, carrousel, video. Zelf gemaakt of via creators.",
      },
      {
        title: "Live & leren",
        body: "Klein budget, snel leren welke hooks en audiences renderen. Winnaars schalen, rest eruit.",
      },
      {
        title: "Retargeting & LTV",
        body: "Terugkerende kopers, abandoned cart, lookalikes. Altijd met frequency caps die irritatie voorkomen.",
      },
    ],
    capabilities: [
      "Facebook",
      "Instagram",
      "UGC creatives",
      "Retargeting",
      "CAPI",
      "A/B hooks",
      "ROAS-sturing",
    ],
    outcomes: [
      {
        title: "Campagnes die verkopen",
        detail:
          "Meta Ads met creatives die getest zijn, niet gegokt. Meetbaar op aankopen of leads, niet alleen op clicks.",
      },
      {
        title: "Hooks die stoppen met scrollen",
        detail:
          "Varianten en iteraties op basis van data. Geen enkele creative die maanden blijft draaien zonder te vermoeien.",
      },
      {
        title: "Retargeting zonder irritatie",
        detail:
          "Warm publiek terughalen met relevante boodschappen en caps. Meer omzet, minder ad fatigue.",
      },
    ],
    heroStats: [
      { label: "Platforms", value: "FB · IG" },
      { label: "Focus", value: "Creatives" },
      { label: "Meting", value: "CAPI" },
    ],
  },
  "social-media": {
    heroVisual: "social-organic",
    heroKicker:
      "Organisch zichtbaar op Instagram, TikTok of LinkedIn. Ritme en formats die je team volhoudt. Geen dagelijkse dansjes, wel een uithangbord dat vertrouwen geeft.",
    funFact:
      "Negen van de tien kopers checkt je social voordat ze een aankoop doen. Een dode feed kost vertrouwen, ook als je ads perfect draaien.",
    funFactSource: "Daarom ritme boven viraliteit",
    funFactStat: "9/10",
    principles: [
      {
        title: "Twee kanalen goed",
        body: "Beter Instagram en LinkedIn strak dan vijf halfslachtig. Ik kies waar jouw klant echt zit en waar jij content kunt volhouden.",
      },
      {
        title: "Eén verhaal overal",
        body: "Social, site, Google Ads en Meta Ads moeten hetzelfde beloven. Ik sluit organic content aan op je campagnes, niet los ervan.",
      },
      {
        title: "Meten wat telt",
        body: "Niet alleen likes. Bereik dat leidt naar site, aanvragen of shop. Dat koppel ik aan je groeiplan.",
      },
    ],
    lens: "Social is je uithangbord. Klanten checken of je leeft voordat ze kopen. Consistent ritme wint van virale uitschieters die niemand volhoudt.",
    approachSteps: [
      {
        title: "Kanaal & doel",
        body: "Waar zit je klant? Wat moet social opleveren: vertrouwen, bereik of traffic? We kiezen max twee focuskanalen.",
      },
      {
        title: "Formats & ritme",
        body: "Templates, contentpijlers en een schema dat past bij je team. Haalbaar, niet aspirational.",
      },
      {
        title: "Productie & publicatie",
        body: "Batch waar het kan, live waar het moet. Alles aligned met merk en campagnes.",
      },
      {
        title: "Meten & bijsturen",
        body: "Wat levert bereik, saves en clicks op? Maandelijks scherpen op basis van data, niet op trends.",
      },
    ],
    capabilities: [
      "Instagram",
      "TikTok",
      "LinkedIn",
      "Contentritme",
      "Formats",
      "Merk aligned",
      "Meetbaar",
    ],
    outcomes: [
      {
        title: "Consistent zichtbaar",
        detail:
          "Een feed of kanaal dat leeft, zonder dat jij er dagelijks uren in stopt. Ritme dat je team volhoudt.",
      },
      {
        title: "Vertrouwen vóór de koop",
        detail:
          "Social proof en content die laten zien dat je echt bent. Minder twijfel op je site en in ads.",
      },
      {
        title: "Aansluiting op campagnes",
        detail:
          "Organic en paid vertellen hetzelfde verhaal. Geen oude post naast een nieuwe landingspagina.",
      },
    ],
    heroStats: [
      { label: "Aanpak", value: "Max 2 kanalen" },
      { label: "Focus", value: "Ritme" },
      { label: "Doel", value: "Vertrouwen" },
    ],
  },
  ugc: {
    heroVisual: "ugc",
    heroKicker:
      "Video's van echte mensen die jouw product laten zien zoals klanten het gebruiken. Betere ads dan studio, omdat het geloofwaardiger voelt.",
    funFact:
      "UGC-video's scoren in veel niches hogere CTR en lagere CPA dan gepolijste studio-advertenties. Niet mooier, wel echter.",
    funFactSource: "Daarom creators + briefings",
    funFactStat: "UGC",
    principles: [
      {
        title: "Briefing die werkt",
        body: "Creators krijgen scripts en hooks die jouw bezwaren wegnemen, zonder dat het scripted aanvoelt. Ik regisseer de boodschap, zij leveren authenticiteit.",
      },
      {
        title: "Varianten voor testen",
        body: "Meerdere hooks en lengtes per batch. Klaar voor Meta Ads en Google Ads, zodat je campagnes niet stilvallen.",
      },
      {
        title: "Rechten netjes",
        body: "Usage rights, whitelisting en hergebruik zwart op wit. Geen video die je niet mag inzetten na de eerste campagne.",
      },
    ],
    lens: "UGC is content die je koopt, niet het bereik van de creator. Perfect voor ads die moeten voelen als iemand die jij kent, niet als een bureau.",
    approachSteps: [
      {
        title: "Product & hooks",
        body: "Welk product, welke bezwaren, welke hook? We briefen vóór creator-selectie.",
      },
      {
        title: "Creators selecteren",
        body: "Passend bij je doelgroep en merk. Geen generic faces, wel mensen die je klant herkent.",
      },
      {
        title: "Productie & review",
        body: "Scripts, takes, feedback. Jij keurt goed wat live mag.",
      },
      {
        title: "Inzet in campagnes",
        body: "Varianten klaar voor Meta Ads en Google Ads. Meten welke hook wint.",
      },
    ],
    capabilities: [
      "Creator selectie",
      "Scripts",
      "Hooks",
      "Meta-ready",
      "Google-ready",
      "Usage rights",
      "Varianten",
    ],
    outcomes: [
      {
        title: "Ads die echt voelen",
        detail:
          "Video's die stoppen met scrollen omdat ze authentiek zijn. Lagere CPA in veel tests versus studio-only.",
      },
      {
        title: "Stroom aan varianten",
        detail:
          "Nieuwe hooks elke maand zodat campagnes niet vermoeien. Geen enkele creative die eeuwig draait.",
      },
      {
        title: "Rechten geregeld",
        detail:
          "Content die je overal mag gebruiken: ads, site, social. Zonder juridische grijze zones.",
      },
    ],
    heroStats: [
      { label: "Output", value: "Video hooks" },
      { label: "Voor", value: "Meta · Google" },
      { label: "Focus", value: "Authentiek" },
    ],
  },
  "influencer-marketing": {
    heroVisual: "influencer",
    heroKicker:
      "Creators die passen bij je merk en marge. Bereik, vertrouwen en content in één deal. Meetbaar met codes en links, niet met vague 'exposure'.",
    funFact:
      "Micro-influencers met tienduizend tot vijftigduizend volgers hebben vaak hogere engagement dan mega-accounts. En kosten een fractie.",
    funFactSource: "Daarom match boven reach",
    funFactStat: "10–50k",
    principles: [
      {
        title: "Echt bereik, geen bots",
        body: "Ik selecteer op engagement en eerdere samenwerkingen, niet op volgersaantallen. Gekochte followers kosten jou geld, niet de creator.",
      },
      {
        title: "Afspraken zwart op wit",
        body: "Content, timing, rechten, vergoeding en exclusiviteit. Geen vage DM-deals die later escaleren.",
      },
      {
        title: "Meten per creator",
        body: "Kortingscodes, UTM's en sales attribution. Je weet welke samenwerking rendeerde.",
      },
    ],
    lens: "Influencer marketing werkt als de match klopt. Bereik kopen zonder meting is gokken. Ik regel van eerste contact tot rapportage, met creators die je klant echt volgt.",
    approachSteps: [
      {
        title: "Doel & budget",
        body: "Bereik, content of allebei? Wat past bij je marge? We stellen verwachtingen vóór de eerste DM.",
      },
      {
        title: "Selectie & outreach",
        body: "Creators op engagement, niche en eerdere campagnes. Geen volgersaantallen als enige criterium.",
      },
      {
        title: "Deal & content",
        body: "Afspraken, scripts waar nodig, timing en rechten. Alles zwart op wit.",
      },
      {
        title: "Meten & door",
        body: "Codes, links, omzet per creator. Langdurige deals met wie levert, stoppen met wie niet levert.",
      },
    ],
    capabilities: [
      "Creator match",
      "Engagement check",
      "Deals zwart op wit",
      "Tracking codes",
      "UGC reuse",
      "Long-term",
      "Rapportage",
    ],
    outcomes: [
      {
        title: "Creators die passen",
        detail:
          "Samenwerkingen met accounts die je doelgroep echt volgt. Geen generic influencers met nep-engagement.",
      },
      {
        title: "Meetbaar bereik",
        detail:
          "Per campagne zichtbaar wat codes, links en omzet opleverden. Geen vage exposure-deals.",
      },
      {
        title: "Content én bereik",
        detail:
          "Vaak combineerbaar met UGC: creator levert zowel post als raw content voor je ads.",
      },
    ],
    heroStats: [
      { label: "Selectie", value: "Engagement" },
      { label: "Meting", value: "Codes · UTM" },
      { label: "Focus", value: "Match" },
    ],
  },
  marketplaces: {
    heroVisual: "marketplace",
    heroKicker:
      "Gevonden en gekozen worden op Bol en Amazon. Listings, reviews en marketplace-ads afgestemd op marge. Naast je shop, niet ten koste van.",
    funFact:
      "Voor veel productcategorieën begint de zoektocht direct op Bol of Amazon, nog vóór Google. Wie daar niet staat, mist kopers die al willen betalen.",
    funFactSource: "Daarom listings + reviews + ads",
    funFactStat: "Bol",
    principles: [
      {
        title: "Marge vóór volume",
        body: "Marketplace-kosten eten marge. Ik start bij producten die qua prijs en fulfilment op Bol of Amazon kunnen. Niet alles hoeft op elk platform.",
      },
      {
        title: "Listings die scoren",
        body: "Titels, bullets en zoekwoorden op hoe mensen binnen Bol en Amazon zoeken. Geen copy-paste van je webshop zonder aanpassing.",
      },
      {
        title: "Shop + marketplace aligned",
        body: "Assortiment en prijsstrategie zodat kanalen elkaar versterken in plaats of kannibaliseren.",
      },
    ],
    lens: "Bol en Amazon zijn het schap waar je klant al staat. Listings, reviews en ads moeten samen werken. SkinComplete en andere cases leerden me: marketplace is kanaal, geen afterthought.",
    approachSteps: [
      {
        title: "Assortiment & marge",
        body: "Welke SKU's passen op Bol, Amazon of beide? Fulfilment, fees en prijs doorgerekend.",
      },
      {
        title: "Listings optimaliseren",
        body: "Titels, afbeeldingen, A+ content waar beschikbaar. Zoekgedrag binnen de marketplace als uitgangspunt.",
      },
      {
        title: "Reviews & Buy Box",
        body: "Reviewopbouw, prijsstabiliteit en operational excellence voor de Buy Box.",
      },
      {
        title: "Ads & afstemming shop",
        body: "Marketplace-advertenties waar marge het toelaat. Afgestemd op je eigen Shopify of site.",
      },
    ],
    capabilities: [
      "Bol.com",
      "Amazon",
      "Listings",
      "Reviews",
      "Buy Box",
      "Marketplace ads",
      "Shop aligned",
    ],
    outcomes: [
      {
        title: "Gevonden op Bol & Amazon",
        detail:
          "Producten die scoren op marketplace-zoekgedrag. Niet alleen live staan, ook gekozen worden.",
      },
      {
        title: "Reviews die converteren",
        detail:
          "Reviewstrategie en listings die vertrouwen geven in het marketplace-venster zelf.",
      },
      {
        title: "Extra kanaal, geen kannibalisatie",
        detail:
          "Marketplace bereikt kopers die je shop mist. Met prijs- en assortimentsafstemming.",
      },
    ],
    heroStats: [
      { label: "Platforms", value: "Bol · Amazon" },
      { label: "Focus", value: "Listings" },
      { label: "Sturing", value: "Marge" },
    ],
  },
  media: {
    heroVisual: "media-ads",
    heroKicker:
      "Foto en video die stoppen met scrollen in Google Ads en Meta Ads. Hooks, varianten en formats die passen bij platform én merk. Klaar om te testen.",
    funFact:
      "Campagnes met drie of meer creative varianten presteren gemiddeld significant beter dan campagnes met één enkele advertentie. Testen is geen luxe.",
    funFactSource: "Daarom varianten per hook",
    funFactStat: "3+",
    principles: [
      {
        title: "Platform-first formats",
        body: "9:16 voor Reels, 1:1 voor feed, 16:9 voor YouTube: elk format heeft eigen regels. Ik lever wat je campagnes nodig hebben, niet één JPG voor alles.",
      },
      {
        title: "Hook boven polish",
        body: "De eerste seconde of regel copy wint. Studio-mooi helpt niks als niemand stopt. Ik ontwerp voor scroll-stop, binnen je merk.",
      },
      {
        title: "Iteratie op data",
        body: "Winnaars schalen, verliezers eruit. Bestanden en benaming gestructureerd zodat je team snel kan bijleveren.",
      },
    ],
    lens: "Beeld en video zijn het verschil tussen een campagne die rendeert en budget verbranden. Ik lever creatives die aansluiten op je landings en merk, klaar voor Google Ads en Meta Ads.",
    approachSteps: [
      {
        title: "Hooks & formats",
        body: "Welke platforms, welke lengtes, welke bezwaren moet de creative wegnemen? We briefen vóór productie.",
      },
      {
        title: "Productie",
        body: "Studio, UGC-stijl of mix. Fotografie, motion, carrousels: wat past bij je testplan.",
      },
      {
        title: "Varianten leveren",
        body: "Meerdere hooks en crops per asset. Klaar voor upload in ad managers.",
      },
      {
        title: "Performance feedback",
        body: "Data terugkoppelen naar nieuwe batches. Winnaars worden templates voor volgende rondes.",
      },
    ],
    capabilities: [
      "Foto ads",
      "Video ads",
      "9:16 · 1:1 · 16:9",
      "Hooks",
      "Varianten",
      "Merk aligned",
      "Ad-ready",
    ],
    outcomes: [
      {
        title: "Creatives die testen",
        detail:
          "Meerdere hooks en formats per campagne. Sneller leren wat stopt en wat converteert.",
      },
      {
        title: "Consistent met merk",
        detail:
          "Ads die hetzelfde beloven als je landingspagina. Geen oude banner naast nieuwe site.",
      },
      {
        title: "Snelle iteratie",
        detail:
          "Gestructureerde bestanden en naming. Je team of ik kan snel bijleveren als data een richting wijst.",
      },
    ],
    heroStats: [
      { label: "Formats", value: "Multi-ratio" },
      { label: "Focus", value: "Hooks" },
      { label: "Voor", value: "Google · Meta" },
    ],
  },
  email: {
    heroVisual: "email-flow",
    heroKicker:
      "De juiste mail op het juiste moment. Welkom, herinnering, opvolging na aankoop. Geen spam, wel omzet uit klanten die je al hebt.",
    funFact:
      "Gemiddeld laat zeven van de tien winkelwagens liggen. Een goed getimede herinnermail haalt daar een flink deel van terug. Zonder extra advertentiebudget.",
    funFactSource: "Daarom flows vóór losse nieuwsbrieven",
    funFactStat: "70%",
    principles: [
      {
        title: "Timing boven volume",
        body: "Eén mail op het moment dat iemand klaar is om te kopen werkt beter dan vier generieke nieuwsbrieven per maand. Welkom, cart, post-purchase: elk met een eigen doel.",
      },
      {
        title: "Segmentatie die klopt",
        body: "Nieuwe klant, terugkerende koper, VIP: andere boodschap, andere aanbieding. Ik segmenteer op gedrag en aankoopdata, niet op gokken.",
      },
      {
        title: "Design dat verkoopt",
        body: "Templates die op mobiel én desktop professioneel ogen en passen bij je merk. Klaviyo, Shopify Mail of jouw tool: technisch strak opgezet.",
      },
    ],
    lens: "E-mail is het kanaal waar jij de relatie bewaakt. Geen algoritme dat je bereik verlaagt. Als je list gezond is en je flows logisch lopen, is dit vaak je hoogste ROI-kanaal.",
    approachSteps: [
      {
        title: "Audit & data",
        body: "Welke mails stuur je nu? Welke tool, welke segmenten, welke open- en clickcijfers? We brengen gaten en quick wins in kaart.",
      },
      {
        title: "Flows & templates",
        body: "Welkom, abandoned cart, post-purchase, win-back waar het zinvol is. Copy en design aligned met je site en campagnes.",
      },
      {
        title: "Techniek & koppeling",
        body: "Events uit Shopify of site, juiste triggers, deliverability basics. Geen mails die in spam belanden.",
      },
      {
        title: "Test & optimaliseer",
        body: "Subject lines, timing, segmenten. Winnaars opschalen, ruis eruit. Rapportage in gewone taal.",
      },
    ],
    capabilities: [
      "Welkom flows",
      "Cart recovery",
      "Post-purchase",
      "Klaviyo · Shopify",
      "Segmentatie",
      "Templates",
      "Deliverability",
    ],
    outcomes: [
      {
        title: "Omzet uit bestaande lijst",
        detail:
          "Flows die op het juiste moment converteren. Minder afhankelijkheid van steeds duurder adverteren.",
      },
      {
        title: "Merk dat consistent blijft",
        detail:
          "Mails die eruitzien en klinken als je site. Geen losse template uit 2019 naast je nieuwe shop.",
      },
      {
        title: "Structuur die je team snapt",
        detail:
          "Overzichtelijke flows en naming. Jij of je team kan later zelf bijsturen zonder alles te breken.",
      },
    ],
    heroStats: [
      { label: "Tools", value: "Klaviyo · Shopify" },
      { label: "Focus", value: "Flows" },
      { label: "Meet", value: "Omzet · LTV" },
    ],
  },
  retentie: {
    heroVisual: "retention-ltv",
    heroKicker:
      "Klanten die terugkomen kosten een fractie van nieuwe werving. Loyaliteit, SMS en win-back op momenten die logisch zijn. Gemeten op herhaalaankopen, niet op opens.",
    funFact:
      "Een stijging van vijf procent in retentie kan je winst met twintig tot negentig procent verhogen, afhankelijk van je marge. Elke procent telt.",
    funFactSource: "Daarom LTV boven losse campagnes",
    funFactStat: "+5%",
    principles: [
      {
        title: "Klantwaarde als kompas",
        body: "Herhaalaankopen en gemiddelde orderwaarde over tijd. Niet vanity metrics. Ik stuur op wat je marge echt verbetert.",
      },
      {
        title: "Journey na de eerste koop",
        body: "Waar verdwijnen klanten stilletjes? Opvolging, replenishment, loyalty: elk product heeft een logische herkooptermijn.",
      },
      {
        title: "SMS waar het past",
        body: "Soms is een korte SMS effectiever dan een lange mail. Ik combineer kanalen op timing en toestemming, niet op hype.",
      },
    ],
    lens: "Retentie is de goedkoopste omzet die er bestaat. Je hebt die klant al betaald via ads of SEO. Nu moet je hem een reden geven om terug te komen.",
    approachSteps: [
      {
        title: "Cohort & churn",
        body: "Hoeveel kopers komen terug? Na hoeveel dagen? We tekenen je baseline en zoeken waar het lekt.",
      },
      {
        title: "Programma & flows",
        body: "Loyalty, replenishment, win-back. Aanbiedingen die bij je marge passen, geen race naar de bodem.",
      },
      {
        title: "SMS & mail combineren",
        body: "Welk kanaal op welk moment? Met juiste opt-in en frequency caps die irritatie voorkomen.",
      },
      {
        title: "Meten & opschalen",
        body: "Herhaalaankoopratio, LTV, win-back omzet. Wat werkt krijgt meer budget en aandacht.",
      },
    ],
    capabilities: [
      "LTV-sturing",
      "Loyalty",
      "Win-back",
      "Replenishment",
      "SMS · e-mail",
      "Cohort analyse",
      "Herhaalaankoop",
    ],
    outcomes: [
      {
        title: "Meer omzet per klant",
        detail:
          "Herhaalaankopen en hogere klantwaarde. Meer marge om nieuwe klanten te werven zonder paniek.",
      },
      {
        title: "Programma's die passen",
        detail:
          "Loyaliteit en win-back afgestemd op je product en marge. Geen generieke puntenclub die niets oplevert.",
      },
      {
        title: "Inzicht in churn",
        detail:
          "Je ziet waar klanten afhaken en welke acties ze terugbrengen. Data, geen onderbuikgevoel.",
      },
    ],
    heroStats: [
      { label: "Sturing", value: "LTV · cohort" },
      { label: "Kanalen", value: "Mail · SMS" },
      { label: "Focus", value: "Herkoop" },
    ],
  },
  automatisering: {
    heroVisual: "automation-nodes",
    heroKicker:
      "Terugkerend handwerk eruit. Systemen die met elkaar praten zodat jij dat niet hoeft. n8n, Make of wat bij jouw stack past. Met logging en fallbacks.",
    funFact:
      "De gemiddelde kenniswerker verspilt ruim een dag per week aan repetitief copy-paste werk tussen systemen. Dat schaalt niet en het foutpercentage wel.",
    funFactSource: "Daarom eerst waar het pijn doet",
    funFactStat: "1 dag",
    principles: [
      {
        title: "Pijn eerst, alles later",
        body: "Ik automatiseer niet je hele bedrijf in één keer. We beginnen waar handwerk het meest zeer doet of fouten maakt. Quick wins met robuuste basis.",
      },
      {
        title: "Robuust of niet doen",
        body: "Logging, retries, alerts en fallbacks. Operations mag niet op zwart zaad zitten als een API even hapert.",
      },
      {
        title: "Eigenaarschap bij jou",
        body: "Documentatie en keuzes die je begrijpt. Geen black box die alleen de maker kan fixen. Tooling op onderhoudbaarheid, niet op hype.",
      },
    ],
    lens: "Automatisering is geen speeltje. Het is operations die op autopilot draait. Maar alleen als je weet wat er gebeurt als iets misgaat.",
    approachSteps: [
      {
        title: "Inventarisatie",
        body: "Welke systemen, welke triggers, welke edge cases? We tekenen de keten voordat er code of flows worden gebouwd.",
      },
      {
        title: "Prioriteit & scope",
        body: "Waar levert automatisering morgen al tijdwinst? Eén robuuste flow is beter dan tien fragiele.",
      },
      {
        title: "Bouwen & testen",
        body: "n8n, Make of custom waar nodig. Met testdata, error handling en iemand die weet wat live gaat.",
      },
      {
        title: "Documentatie & overdracht",
        body: "Playbook voor je team: wat doet welke flow, wat als X faalt, wie is owner.",
      },
    ],
    capabilities: [
      "n8n · Make",
      "API koppelingen",
      "Logging",
      "Retries",
      "Alerts",
      "Documentatie",
      "AVG-aware",
    ],
    outcomes: [
      {
        title: "Minder handwerk",
        detail:
          "Repetitieve taken uit handen. Je team focust op werk dat echt denken vraagt.",
      },
      {
        title: "Minder fouten",
        detail:
          "Geen vergeten exports, dubbele invoer of verkeerde klantmails door menselijke slip-ups.",
      },
      {
        title: "Schaal zonder extra FTE",
        detail:
          "Meer orders of leads zonder lineair meer administratie. De keten groeit mee.",
      },
    ],
    heroStats: [
      { label: "Tools", value: "n8n · Make" },
      { label: "Focus", value: "Robuust" },
      { label: "Eigenaar", value: "Jij" },
    ],
  },
  workflows: {
    heroVisual: "order-chain",
    heroKicker:
      "Van betaalde order tot track & trace en herhaalaankoop. E-commerce workflows die kloppen, ook bij deels verzonden, retour of multi-warehouse.",
    funFact:
      "Klanten die binnen vier uur een bevestiging én later een track-link krijgen, geven vaker een goede review. Communicatie is onderdeel van je product.",
    funFactSource: "Daarom keten denken, niet losse mails",
    funFactStat: "4 uur",
    principles: [
      {
        title: "Keten, geen losse stapjes",
        body: "Order, voorraad, fulfilment, finance en mail horen op één lijn. Ik teken edge cases uit vóór we automatiseren.",
      },
      {
        title: "Edge cases expliciet",
        body: "Deels verzonden, gedeeltelijke refund, voorraad op meerdere locaties: standaardflows falen hier. Wij niet.",
      },
      {
        title: "Playbook bij storing",
        body: "Als een koppeling uitvalt, moet je team weten wat er gebeurt. Geen paniek, wel een duidelijk protocol.",
      },
    ],
    lens: "E-commerce workflows zijn het zenuwstelsel van je shop. Als die hapert, voelt de klant het direct. En jouw team zit in Excel.",
    approachSteps: [
      {
        title: "Keten in kaart",
        body: "Van checkout tot retour: elke stap, elk systeem, elke uitzondering die wekelijks terugkomt.",
      },
      {
        title: "Bron van waarheid",
        body: "Waar leeft klant, order, voorraad? We kiezen één leidend systeem per datapunt.",
      },
      {
        title: "Automatisering live",
        body: "ERP, 3PL, boekhouding, klantmails: gesynchroniseerd met foutafhandeling.",
      },
      {
        title: "Monitoring & finetune",
        body: "Wat faalt, wat vertraagt? Dashboards en alerts zodat je proactief bijstuurt.",
      },
    ],
    capabilities: [
      "Order sync",
      "Fulfilment",
      "Voorraad",
      "Track & trace",
      "Retour flows",
      "Multi-warehouse",
      "Klantmails",
    ],
    outcomes: [
      {
        title: "Operations op autopilot",
        detail:
          "Orders stromen door zonder handmatige tussenstappen. Schalen zonder Excel-stress.",
      },
      {
        title: "Klantmails die kloppen",
        detail:
          "Statusupdates op het juiste moment, in je tone of voice. Geen verkeerde tracking of dubbele mails.",
      },
      {
        title: "Finance die synchroon loopt",
        detail:
          "Exports en boekingen die altijd kloppen met wat er echt verkocht en verzonden is.",
      },
    ],
    heroStats: [
      { label: "Scope", value: "Order → retour" },
      { label: "Focus", value: "Edge cases" },
      { label: "Voor", value: "E-commerce" },
    ],
  },
  chatbots: {
    heroVisual: "chat-rag",
    heroKicker:
      "AI-chat op jouw data en tone of voice. Pre-sales en support ontlasten zonder foute antwoorden. Met escalatie naar mens waar het moet.",
    funFact:
      "Twee derde van klanten verwacht antwoord binnen tien minuten. Een bot die je FAQ en productdata kent, vangt het merendeel op zonder wachtrij.",
    funFactSource: "Daarom trainen op echte bronnen",
    funFactStat: "10 min",
    principles: [
      {
        title: "Kennis uit jouw bronnen",
        body: "Site, FAQ, productfeed, policies: gestructureerd ingelezen. Geen hallucinaties over prijzen of levertijden die niet kloppen.",
      },
      {
        title: "Mens waar het complex wordt",
        body: "Escalatie met context mee. Support ziet wat de klant al gevraagd heeft. Geen herhalen van hetzelfde verhaal.",
      },
      {
        title: "Meten wat het oplevert",
        body: "Welke vragen komen binnen, waar haken mensen af, hoeveel tickets bespaart het? Privacy en AVG vanaf dag één.",
      },
    ],
    lens: "Een bot die fout antwoordt is erger dan geen bot. Ik bouw alleen wat nuttig is voor team én klant, getraind op wat jij echt weet.",
    approachSteps: [
      {
        title: "Use cases & bronnen",
        body: "Welke vragen komen het vaakst? Welke documenten zijn leidend en up-to-date? We kiezen scope bewust.",
      },
      {
        title: "Train & tone",
        body: "RAG op jouw kennis, tone of voice afgestemd op merk. Testen op edge cases vóór live.",
      },
      {
        title: "Escalatie & integratie",
        body: "Wanneer neemt een mens over? Hoe ziet die handoff eruit in je helpdesk of CRM?",
      },
      {
        title: "Live & verbeteren",
        body: "Meting op vragen, afhakers en tijdsbesparing. Nieuwe bronnen toevoegen als je assortiment groeit.",
      },
    ],
    capabilities: [
      "RAG chatbot",
      "Product FAQ",
      "Tone of voice",
      "Escalatie",
      "Helpdesk koppeling",
      "Analytics",
      "AVG-proof",
    ],
    outcomes: [
      {
        title: "Snellere antwoorden",
        detail:
          "Klanten krijgen direct antwoord op veelgestelde vragen. Minder wachtrij, hogere tevredenheid.",
      },
      {
        title: "Team ontlast",
        detail:
          "Support en sales focussen op complexe cases. De bot vangt het repetitieve op.",
      },
      {
        title: "Betrouwbare antwoorden",
        detail:
          "Gebaseerd op jouw echte data, niet op gokken. Met duidelijke grenzen wanneer een mens overneemt.",
      },
    ],
    heroStats: [
      { label: "Basis", value: "RAG · FAQ" },
      { label: "Focus", value: "Escalatie" },
      { label: "Meet", value: "Tickets · CSAT" },
    ],
  },
};

export function getDienstPremium(slug: string): DienstPremiumContent | null {
  return PREMIUM[slug] ?? null;
}
