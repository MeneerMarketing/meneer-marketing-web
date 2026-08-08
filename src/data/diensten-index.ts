export const DIENSTEN_HERO = {
  eyebrow: "Diensten & trajecten",
  title: "Van strategie tot Google Ads.",
  titleAccent: "Vijf blokken. Eén plan van code tot campagne.",
  subtitle:
    "Strategie, websites from scratch, vindbaarheid in Google én ChatGPT, Google Ads, Meta Ads en behoud. Eén aanspreekpunt die alles snapt. Eén plan dat klopt van code tot campagne.",
  stats: [
    { label: "Hoofdblokken", value: "5" },
    { label: "Concrete trajecten", value: "30+" },
    { label: "Thuisbasis", value: "Apeldoorn" },
  ],
} as const;

export interface DienstenHeroFact {
  id: string;
  badge: string;
  text: string;
  accent: string;
  tilt: number;
}

export const DIENSTEN_HERO_FACTS: DienstenHeroFact[] = [
  {
    id: "b2b-portaal",
    badge: "B2B-portaal",
    text: "Custom portaal, Shopify theme en mail. Eerst SEO. Ads pas wanneer het al verkocht. Bewuste volgorde, geen budgetgok.",
    accent: "#FF5722",
    tilt: -1.25,
  },
  {
    id: "eigen-route",
    badge: "Eigen route",
    text: "Custom Shopify in een drukke markt. Per productlijn eigen SEO, mail en ads. Jouw koers, geen copy-paste.",
    accent: "#0284C7",
    tilt: 1,
  },
  {
    id: "anti-template",
    badge: "From scratch",
    text: "Custom build in Next.js of Shopify waar het moet. Code die meegroeit, zonder page builder die je over een jaar tegen de plinten loopt.",
    accent: "#0F172A",
    tilt: -0.5,
  },
  {
    id: "ai-zoek",
    badge: "AI-antwoorden",
    text: "Vindbaar in ChatGPT en Gemini is een volwaardig kanaal. Het staat live in het aanbod, niet op de roadmap van 2027.",
    accent: "#00BCD4",
    tilt: 1.5,
  },
  {
    id: "eerlijk",
    badge: "Eerlijk",
    text: "Soms zeg ik: begin niet met ads. Als je site nog niet converteert, is adverteren water in een emmer met gaten.",
    accent: "#FF5722",
    tilt: -1,
  },
];

export const DIENSTEN_CHAOS = {
  eyebrow: "Herkenbaar?",
  title: "Drie bureaus.",
  titleAccent: "Nul overzicht.",
  lead: "De gemiddelde ondernemer heeft een website-bouwer, een SE'er die 'alleen content doet' en een ads-guy die nooit met de developer praat. Iedereen heeft gelijk. Niemand heeft het totaalplaatje.",
  chaosItems: [
    {
      label: "Bureau A",
      quote: "Je site moet eerst live, dan praten we over SEO.",
      problem: "Live zonder fundament = dure ads straks.",
    },
    {
      label: "Bureau B",
      quote: "We doen alleen Google Ads. De landingspagina is niet ons probleem.",
      problem: "ROAS op een pagina die niet converteert? Succes.",
    },
    {
      label: "Bureau C",
      quote: "Shopify template is snel klaar. Custom kan later wel.",
      problem: "Later wordt nooit. En 'snel klaar' remt je groei.",
    },
  ],
  punchline:
    "Bij Meneer Marketing zit strategie, bouw, vindbaarheid, campagnes en behoud onder één dak. In Apeldoorn. Met dezelfde stem in je mail, op je site en in je account.",
} as const;

export const DIENSTEN_FIVE_BLOCKS = [
  {
    slug: "strategie" as const,
    emoji: "🧭",
    title: "Strategie & groei",
    tagline: "Eerst weten waar je naartoe rijdt",
    body: "Groeiplan, advertentiestrategie, CRO en tracking. Een plan dat je opent: welk kanaal wanneer, en waarom.",
    highlight: "Per productlijn een eigen route. Jouw funnel, niet een standaard template.",
    accent: "#FF5722",
  },
  {
    slug: "bouwen" as const,
    emoji: "⚡",
    title: "Bouwen from scratch",
    tagline: "Websites, Shopify, apps",
    body: "Next.js, custom Shopify themes, B2B-portalen. From scratch. Code die meegroeit als jij opschaalt.",
    highlight: "B2B-portaal waar klanten 24/7 bestellen. Van nachtelijke mailtjes naar een systeem dat meeschaalt.",
    accent: "#0284C7",
  },
  {
    slug: "vindbaarheid" as const,
    emoji: "🔍",
    title: "Vindbaarheid & autoriteit",
    tagline: "Google, content, AI-antwoorden",
    body: "SEO, techniek, semantische content en vindbaarheid in ChatGPT. Organisch verkeer dat je ads later goedkoper maakt.",
    highlight: "Eerst organisch domineren. Ads pas op een shop die al verkocht.",
    accent: "#00BCD4",
  },
  {
    slug: "campagnes" as const,
    emoji: "📣",
    title: "Acquisitie & creators",
    tagline: "Google Ads, Meta Ads, UGC",
    body: "Search, Shopping, Meta, influencers. Expliciet benoemd, niet verstopt achter 'datagedreven adverteren'.",
    highlight: "Campagnes landen op pagina's die converteren. Niet op je homepage met vijf boodschappen tegelijk.",
    accent: "#FF5722",
  },
  {
    slug: "behoud" as const,
    emoji: "🔗",
    title: "Behoud & koppelingen",
    tagline: "E-mail, flows, automatisering",
    body: "Klaviyo, n8n, abandoned cart, B2B-portaal-koppelingen. Klanten vasthouden is goedkoper dan steeds nieuwe jagen.",
    highlight: "E-mail en flows vóór je ads opschaalt. Anders lekt je budget weg naar bezoekers die je niet vasthoudt.",
    accent: "#8D6E63",
  },
] as const;

export const DIENSTEN_VOLGORDE = {
  eyebrow: "De volgorde die wél werkt",
  title: "Fundament eerst.",
  titleAccent: "Ads als versterker.",
  body: "Bewuste volgorde: eerst site, SEO en mail. Pas wanneer organisch verkeer verkocht, gaat er budget naar Google Ads en Meta. Advertenties versterken wat er al is. Een zwakke shop wordt er alleen armer van.",
  bullets: [
    "Organisch verkeer bewijst dat je pagina's overtuigen zonder geld op de klik.",
    "E-mail vangt bezoekers op die nog niet kopen.",
    "Ads op bewezen landings = elke euro werkt harder.",
  ],
  cta: { label: "Bekijk cases", href: "/cases" },
} as const;

export const DIENSTEN_CASE_PROOF = {
  eyebrow: "Bewijs, geen beloftes",
  title: "Dit heb ik echt gebouwd.",
  cases: [
    {
      name: "B2B e-commerce",
      hook: "Klanten bestelden via mail. Nu 24/7 via B2B-portaal.",
      tags: ["Shopify", "B2B-portaal", "SEO vóór ads"],
      href: "/cases/skincomplete",
    },
    {
      name: "E-commerce matrassen",
      hook: "Eigen koers in een markt met miljoenenbudgetten.",
      tags: ["Custom Shopify", "Per-lijn SEO", "Google Ads & Meta"],
      href: "/cases/bestrest",
    },
    {
      name: "Boekingsplatform",
      hook: "Website, boekingsapp en mails in één lijn.",
      tags: ["Next.js", "Boekingsapp", "Automatisering"],
      href: "/cases/hills-pilates",
    },
  ],
} as const;

export const DIENSTEN_APPROACH = [
  {
    tag: "Begrijpen",
    title: "Eerst jouw context",
    body: "Doelen, data, stack en waar het nu lekt. Eerst helderheid, dan pas een offerte. Ik stel soms ongemakkelijke vragen. Dat is de bedoeling.",
    meneerLine: "Als je zegt 'ik wil ads' maar je site converteert op 0,4%, begin ik ergens anders.",
  },
  {
    tag: "Route",
    title: "Volgorde bepalen",
    body: "Maximaal drie focuspunten tegelijk. SEO eerst, ads later, of andersom. Per klant anders. Jouw route, niet een standaardpakket.",
    meneerLine: "Soms SEO en mail eerst. Soms per productlijn. Jij krijgt jouw volgorde.",
  },
  {
    tag: "Bouwen",
    title: "Uitvoeren & meten",
    body: "Sites, shops, campagnes en mail. Alles met meetpunten vanaf dag één. Ik meet vanaf week één, niet pas na drie maanden.",
    meneerLine: "Deploy, meet, bijsturen. De grafiek omhoog is mijn dopamine. Koffie is ook fijn.",
  },
  {
    tag: "Opschalen",
    title: "Wat werkt krijgt gas",
    body: "Budget verschuiven naar winnaars. Resultaat boven sentiment. Wat niet rendeert, gaat uit. Hard maar eerlijk.",
    meneerLine: "Ads opschalen doe je op pagina's die al bewezen hebben. Niet op hoop.",
  },
] as const;

export const DIENSTEN_WHY = {
  title: "Waarom alles bij één partner past",
  body: "Drie tot vijf partijen voor website, ads en SEO betekent: niemand praat met elkaar, jij bent de projectmanager, en je betaalt dubbel voor hetzelfde inzicht.",
  points: [
    {
      title: "Eén lijn tussen strategie en code",
      body: "Het plan en de uitvoering komen uit hetzelfde brein. Eén brein van strategie tot implementatie, zonder vertaalfouten.",
    },
    {
      title: "Google Ads en Meta Ads expliciet",
      body: "Campagnes die je kunt uitleggen en waar je op kunt sturen. Expliciet benoemd, niet verstopt achter vaag jargon.",
    },
    {
      title: "Vindbaar in Google én in AI",
      body: "SEO, content en techniek voor Google. Plus zichtbaarheid in ChatGPT en Gemini waar je klant steeds vaker begint.",
    },
  ],
} as const;

export const DIENSTEN_DISCOVER = {
  title: "Verder verdiepen",
  items: [
    {
      label: "Kennisbank",
      description: "Praktische artikelen over SEO, ads, Shopify en automatisering. Gratis, in gewone taal.",
      href: "/kennisbank",
      accent: "#00BCD4",
    },
    {
      label: "Zoeken per regio",
      description: "Landingspagina's per dienst en stad. Apeldoorn, Arnhem, Randstad en meer.",
      href: "/zoeken",
      accent: "#FF5722",
    },
    {
      label: "Werkwijze",
      description: "Hoe een traject start, wat je mag verwachten en hoe ik communiceer.",
      href: "/werkwijze",
      accent: "#0284C7",
    },
  ],
} as const;

export const DIENSTEN_EXPERT_SUMMARY =
  "Meneer Marketing biedt vijf dienstenblokken onder één dak: strategie en groei, websites en Shopify from scratch, vindbaarheid in Google en AI-antwoorden, Google Ads en Meta Ads, en behoud via e-mail en automatisering. Gevestigd in Apeldoorn, actief in heel Nederland.";

export const DIENSTEN_FAQ = [
  {
    question: "Kan ik ook één dienst afnemen?",
    answer:
      "Ja, als het past bij je fase. Vaak hangen dingen wel samen: een site zonder meetplan of SEO maakt ads duurder. Daarom begin ik met context en kies ik de juiste volgorde.",
  },
  {
    question: "Bouw je met templates of page builders?",
    answer:
      "Nee. Websites en Shopify-thema's bouw ik from scratch. Custom code, snel en klaar om op te schalen. Eigen code die meegroeit, zonder template dat je over een jaar tegen de plinten loopt.",
  },
  {
    question: "Doe je ook alleen Google Ads of alleen SEO?",
    answer:
      "Dat kan, mits de basis klopt. Vaak begin ik met SEO en e-mail. Ads pas wanneer organisch verkeer al verkocht. Die volgorde bespreek ik eerlijk.",
  },
  {
    question: "Wat is het verschil tussen een blokpagina en een dienstpagina?",
    answer:
      "Elk hoofdblok (strategie, bouwen, vindbaarheid, campagnes, behoud) heeft een eigen verhaal met proces en bewijs. Onder elk blok vallen concrete diensten zoals Google Ads, Shopify of mailautomatisering met meer detail.",
  },
  {
    question: "Hoe start ik een traject?",
    answer:
      "Met een intake. Twee minuten invullen, daarna een gesprek. Je krijgt scherpte op prioriteit en route. Daarna een voorstel dat past bij je fase, niet bij een standaardpakket.",
  },
  {
    question: "Werk je ook buiten Apeldoorn?",
    answer:
      "Ja. Apeldoorn is thuisbasis, maar ik werk landelijk met dezelfde aanpak. Online groeien, waar je ook zit.",
  },
] as const;

export const PILLAR_ACCENTS: Record<string, string> = {
  strategie: "#FF5722",
  bouwen: "#0284c7",
  vindbaarheid: "#00BCD4",
  campagnes: "#FF5722",
  behoud: "#8D6E63",
};
