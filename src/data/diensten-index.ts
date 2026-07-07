export const DIENSTEN_HERO = {
  eyebrow: "Diensten & trajecten",
  title: "Van strategie tot Google Ads.",
  titleAccent: "Vijf blokken. Eén bureau dat alles snapt.",
  subtitle:
    "Strategie, websites from scratch, vindbaarheid in Google én ChatGPT, Google Ads, Meta Ads en behoud. Geen keten van freelancers die elkaar de bal toeschoppen. Wel één plan dat klopt van code tot campagne.",
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
    id: "skincomplete",
    badge: "SkinComplete",
    text: "B2B-portaal, Shopify theme en mail. Eerst SEO. Ads pas toen het al verkocht. Geen gok met budget.",
    accent: "#FF5722",
    tilt: -1.25,
  },
  {
    id: "bestrest",
    badge: "BestRest",
    text: "Custom Shopify in een markt met miljoenenbudgetten. Per productlijn eigen SEO, mail en ads. Geen copy-paste.",
    accent: "#0284C7",
    tilt: 1,
  },
  {
    id: "anti-template",
    badge: "From scratch",
    text: "Geen page builder die je over een jaar tegen de plinten loopt. Custom build in Next.js of Shopify waar het moet.",
    accent: "#0F172A",
    tilt: -0.5,
  },
  {
    id: "ai-zoek",
    badge: "AI-antwoorden",
    text: "Vindbaar in ChatGPT en Gemini is geen bijzaak. Het staat live in het aanbod, niet op de roadmap van 2027.",
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
    body: "Groeiplan, advertentiestrategie, CRO en tracking. Geen 40 pagina's powerpoint. Wel: welk kanaal wanneer, en waarom.",
    highlight: "BestRest kreeg per productlijn een eigen route. Geen standaard funnel.",
    accent: "#FF5722",
  },
  {
    slug: "bouwen" as const,
    emoji: "⚡",
    title: "Bouwen from scratch",
    tagline: "Websites, Shopify, apps",
    body: "Next.js, custom Shopify themes, B2B-portalen. Geen templates. Code die meegroeit als jij opschaalt.",
    highlight: "SkinComplete: B2B-portaal waar salons 24/7 bestellen. Geen Excel meer om 2 uur 's nachts.",
    accent: "#0284C7",
  },
  {
    slug: "vindbaarheid" as const,
    emoji: "🔍",
    title: "Vindbaarheid & autoriteit",
    tagline: "Google, content, AI-antwoorden",
    body: "SEO, techniek, semantische content en vindbaarheid in ChatGPT. Organisch verkeer dat je ads later goedkoper maakt.",
    highlight: "SkinComplete domineerde eerst organisch. Ads kwamen pas op een shop die al verkocht.",
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
  body: "Bij SkinComplete koos ik bewust: eerst site, SEO en mail. Pas toen organisch verkeer verkocht, ging er budget naar Google Ads en Meta. Advertenties versterken wat er al is. Een zwakke shop wordt er alleen armer van.",
  bullets: [
    "Organisch verkeer bewijst dat je pagina's overtuigen zonder geld op de klik.",
    "E-mail vangt bezoekers op die nog niet kopen.",
    "Ads op bewezen landings = elke euro werkt harder.",
  ],
  cta: { label: "Lees de SkinComplete case", href: "/cases/skincomplete" },
} as const;

export const DIENSTEN_CASE_PROOF = {
  eyebrow: "Bewijs, geen beloftes",
  title: "Dit heb ik echt gebouwd.",
  cases: [
    {
      name: "SkinComplete",
      hook: "Salons bestelden via mail. Nu 24/7 via B2B-portaal.",
      tags: ["Shopify", "B2B-portaal", "SEO vóór ads"],
      href: "/cases/skincomplete",
    },
    {
      name: "BestRest",
      hook: "Eigen koers in matrassenland met miljoenenbudgetten.",
      tags: ["Custom Shopify", "Per-lijn SEO", "Google Ads & Meta"],
      href: "/cases/bestrest",
    },
    {
      name: "Hills Pilates",
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
    body: "Doelen, data, stack en waar het nu lekt. Geen offerte voordat dat helder is. Ik stel soms ongemakkelijke vragen. Dat is de bedoeling.",
    meneerLine: "Als je zegt 'we willen ads' maar je site converteert op 0,4%, beginnen we ergens anders.",
  },
  {
    tag: "Route",
    title: "Volgorde bepalen",
    body: "Maximaal drie focuspunten tegelijk. SEO eerst, ads later, of andersom. Per klant anders. Geen standaardpakket dat voor iedereen hetzelfde is.",
    meneerLine: "SkinComplete: SEO en mail. BestRest: per productlijn. Jij krijgt jouw volgorde.",
  },
  {
    tag: "Bouwen",
    title: "Uitvoeren & meten",
    body: "Sites, shops, campagnes en mail. Alles met meetpunten vanaf dag één. Geen 'we kijken wel na drie maanden'.",
    meneerLine: "Deploy, meet, bijsturen. De grafiek omhoog is mijn dopamine. Koffie is ook fijn.",
  },
  {
    tag: "Opschalen",
    title: "Wat werkt krijgt gas",
    body: "Budget verschuiven naar winnaars. Geen sentiment, wel resultaat. Wat niet rendeert, gaat uit. Hard maar eerlijk.",
    meneerLine: "Ads opschalen doe je op pagina's die al bewezen hebben. Niet op hoop.",
  },
] as const;

export const DIENSTEN_WHY = {
  title: "Waarom alles bij één partner past",
  body: "Drie tot vijf partijen voor website, ads en SEO betekent: niemand praat met elkaar, jij bent de projectmanager, en je betaalt dubbel voor hetzelfde inzicht.",
  points: [
    {
      title: "Eén lijn tussen strategie en code",
      body: "Het plan en de uitvoering komen uit hetzelfde brein. Geen vertaalfouten tussen designer, developer en marketeer.",
    },
    {
      title: "Google Ads en Meta Ads expliciet",
      body: "Geen vaag 'datagedreven adverteren'. Wel campagnes die je kunt uitleggen en waar je op kunt sturen.",
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
      description: "Hoe een traject start, wat je mag verwachten en hoe we communiceren.",
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
      "Ja, als het past bij je fase. Vaak hangen dingen wel samen: een site zonder meetplan of SEO maakt ads duurder. Daarom beginnen we met context en kiezen we de juiste volgorde.",
  },
  {
    question: "Bouwen jullie met templates of page builders?",
    answer:
      "Nee. Websites en Shopify-thema's bouwen we from scratch. Custom code, snel en klaar om op te schalen. Geen template dat je over een jaar tegen de plinten loopt.",
  },
  {
    question: "Doen jullie ook alleen Google Ads of alleen SEO?",
    answer:
      "Dat kan, mits de basis klopt. SkinComplete begon bijvoorbeeld met SEO en e-mail. Ads kwamen pas toen organisch verkeer al verkocht. Die volgorde bespreken we eerlijk.",
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
    question: "Werken jullie ook buiten Apeldoorn?",
    answer:
      "Ja. Apeldoorn is thuisbasis, maar ik werk landelijk met dezelfde aanpak. SkinComplete en BestRest zijn geen lokale bakkerijen. Wel klanten die online willen groeien.",
  },
] as const;

export const PILLAR_ACCENTS: Record<string, string> = {
  strategie: "#FF5722",
  bouwen: "#0284c7",
  vindbaarheid: "#00BCD4",
  campagnes: "#FF5722",
  behoud: "#8D6E63",
};
