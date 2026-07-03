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

export interface DienstPremiumContent {
  /** Welke hero-illustratie rechts in de hero */
  heroVisual?: "build" | "shopify";
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
      { label: "Aanpak", value: "From scratch · custom" },
      { label: "Snelheid", value: "Core Web Vitals groen" },
      { label: "Beheer", value: "Zelf content aanpassen" },
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
      { label: "Aanpak", value: "Theme · from scratch" },
      { label: "Expertise", value: "Shopify · alles kan" },
      { label: "Performance", value: "CWV per release" },
    ],
  },
};

export function getDienstPremium(slug: string): DienstPremiumContent | null {
  return PREMIUM[slug] ?? null;
}
