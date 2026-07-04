export const OVER_HERO = {
  eyebrow: "Over Meneer Marketing",
  title: "Groei is geen toeval. Het is een systeem met een gezicht.",
  subtitle:
    "Ik ben je online marketingmanager: strategie, bouwen from scratch, vindbaarheid, Google Ads, Meta Ads en alles wat daarna moet blijven draaien. Geen 47 accountmanagers. Wel iemand die je stack snapt.",
  aside:
    "Fun fact: de gemiddelde ondernemer werkt met drie tot vijf partijen voor website, ads en SEO. Dan praat niemand met elkaar en betaal je dubbel.",
  stats: [
    { label: "Aanpak", value: "Plan + uitvoer" },
    { label: "Blokken", value: "5" },
    { label: "Humor", value: "Inbegrepen" },
  ],
} as const;

export interface OverStoryChapter {
  id: string;
  tag: string;
  title: string;
  body: string;
  punchline: string;
  scene: "solo" | "contrast" | "stack" | "partner";
}

export const OVER_STORY: OverStoryChapter[] = [
  {
    id: "solo",
    tag: "Wie",
    title: "Eén brein, het hele plaatje",
    body: "Meneer Marketing is geen groot bureau met lagen. Het is strategie, code en campagnes onder één dak. Jij praat met degene die het ook bouwt en bijstuurt.",
    punchline: "Geen doorverwijzing naar 'de technische afdeling'. Die afdeling ben ik.",
    scene: "solo",
  },
  {
    id: "contrast",
    tag: "Niet",
    title: "Geen templates, geen vaagheid",
    body: "Websites from scratch. Geen page builders die je over een jaar tegen de plinten laten lopen. Geen rapporten vol jargon waar je niks mee kunt. Geen ads zonder meetplan.",
    punchline: "Als iets niet meetbaar is, optimaliseren we op meningen. En dat doen we niet.",
    scene: "contrast",
  },
  {
    id: "stack",
    tag: "Wel",
    title: "Techniek die productie is",
    body: "Shopify, Next.js, SEO, mailautomatisering, Google Ads en Meta Ads. Alles custom waar het moet, alles gekoppeld waar het kan. SkinComplete kreeg een B2B-portaal. BestRest een eigen koers per product.",
    punchline: "Jouw stack hoeft niet perfect te zijn. Wel eerlijk in kaart.",
    scene: "stack",
  },
  {
    id: "partner",
    tag: "Samen",
    title: "Jij blijft de baas",
    body: "Ik denk mee, bouw mee en stuur bij op data. Documentatie en overdracht horen erbij. Geen gatekeeping: je team begrijpt wat er live staat en waarom.",
    punchline: "Succes delen we. Complexiteit niet.",
    scene: "partner",
  },
];

export const OVER_PRINCIPLES = [
  {
    title: "Meetbaar",
    body: "KPI's, events en dashboards horen bij elk traject. Als het niet meetbaar is, optimaliseren we op meningen. En dat doen we niet.",
  },
  {
    title: "Technisch sterk",
    body: "Shopify, websites from scratch, Next.js, n8n. We bouwen en koppelen alsof het productie is. Want dat is het.",
  },
  {
    title: "Menselijk",
    body: "Geen gatekeeping: documentatie, overdracht en taal die je team begrijpt. Jargon vertaal ik naar gewoon Nederlands.",
  },
] as const;

export interface OverStackItem {
  id: string;
  label: string;
  body: string;
  quip: string;
  accent: string;
}

export const OVER_STACK: OverStackItem[] = [
  {
    id: "shopify",
    label: "Shopify",
    body: "Webshops en B2B-portals from scratch. Geen thema dat na zes maanden vastloopt.",
    quip: "Salons die zelf bestellen? Been there.",
    accent: "#96BF48",
  },
  {
    id: "nextjs",
    label: "Next.js",
    body: "Sites en web-apps die snel laden en technisch schoon zijn. Core Web Vitals zijn geen bijzaak.",
    quip: "50 ms en je bezoeker heeft al een oordeel.",
    accent: "#0F172A",
  },
  {
    id: "seo",
    label: "SEO & content",
    body: "Vindbaar in Google én in AI-zoekmachines. Structuur, content en autoriteit in de juiste volgorde.",
    quip: "15% van alle zoekopdrachten is gloednieuw. Altijd ruimte.",
    accent: "#00BCD4",
  },
  {
    id: "google-ads",
    label: "Google Ads",
    body: "Campagnes die je kunt uitleggen en waar je op kunt sturen. Geen black box met een maandbudget.",
    quip: "Eerst converteren, dan opschalen.",
    accent: "#4285F4",
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    body: "Facebook en Instagram met creatief en data in balans. Niet alleen mooie beelden, ook meetbare omzet.",
    quip: "Je feed scrollt sneller dan je denkt.",
    accent: "#E1306C",
  },
  {
    id: "automation",
    label: "Automatisering",
    body: "Systemen aan elkaar knopen: orders, e-mail, CRM. Minder handwerk, meer rust in je team.",
    quip: "Geen copy-paste tussen tabbladen.",
    accent: "#FF5722",
  },
];

export interface OverDayMoment {
  id: string;
  time: string;
  title: string;
  body: string;
  mood: "coffee" | "code" | "chart" | "call" | "deploy";
}

export const OVER_DAY: OverDayMoment[] = [
  {
    id: "morning",
    time: "08:30",
    title: "Koffie en dashboards",
    body: "Eerst kijken wat er 's nachts gebeurde. Conversies, ads, errors. Geen verrassingen tijdens je ontbijt.",
    mood: "coffee",
  },
  {
    id: "build",
    time: "10:00",
    title: "Bouwen of bijsturen",
    body: "Code, campagnes of content. Afhankelijk van wat die week het meeste oplevert. Niet alles tegelijk.",
    mood: "code",
  },
  {
    id: "data",
    time: "13:30",
    title: "Cijfers eerlijk houden",
    body: "Wat werkt krijgt gas. Wat niet werkt gaat eraf. Geen sentiment, wel resultaat. Soms pijnlijk, altijd nuttig.",
    mood: "chart",
  },
  {
    id: "call",
    time: "15:00",
    title: "Gewoon Nederlands",
    body: "Update met jou: wat live staat, wat het doet en wat de volgende move is. Geen 40 slides.",
    mood: "call",
  },
  {
    id: "ship",
    time: "17:00",
    title: "Iets live zetten",
    body: "Liever iets kleins live dan iets groots in een mapje. Momentum wint van perfectie.",
    mood: "deploy",
  },
];

export const OVER_ANTI = {
  title: "Dit zijn we niet",
  subtitle: "Geen pingpongtafel. Wel resultaat.",
  items: [
    {
      label: "Template-bureau",
      body: "Mooie demo, straks vastgelopen. Wij bouwen from scratch.",
    },
    {
      label: "Rapportenmachine",
      body: "30 pagina's PDF waar niemand iets mee doet. Wij leveren wat live kan.",
    },
    {
      label: "Ads zonder plan",
      body: "Budget erin, omzet er niet uit. Eerst basis, dan gas.",
    },
    {
      label: "Doorverwijzer",
      body: "Vijf bureaus, nul overzicht. Eén lijn van strategie tot code.",
    },
  ],
} as const;

export const OVER_FAQ = [
  {
    question: "Ben je een eenmanszaak of een bureau?",
    answer:
      "Eén aanspreekpunt met het brein van een heel team. Strategie, bouw en campagnes komen uit hetzelfde hoofd. Geen wisselende accountmanagers.",
  },
  {
    question: "Werk je alleen in Nederland?",
    answer:
      "De focus ligt op Nederlandse ondernemers en merken. Shopify en web zijn internationaal inzetbaar; de aanpak en taal zijn op jouw markt afgestemd.",
  },
  {
    question: "Moet ik alles bij je onderbrengen?",
    answer:
      "Niet per se, maar het helpt. Website bij A, ads bij B en SEO bij C betekent dat jij de projectmanager bent. Eén partner houdt de lijn strak.",
  },
  {
    question: "Hoe verschilt dit van een groot marketingbureau?",
    answer:
      "Sneller schakelen, minder lagen, meer eigenaarschap. Geen junior die jouw account leert kennen terwijl de deadline nadert.",
  },
  {
    question: "Hoe starten we?",
    answer:
      "Met de Groeiscan of een intake. Je krijgt helderheid op prioriteit en route. Daarna een voorstel dat past bij je fase, niet bij een standaardpakket.",
  },
] as const;

export const OVER_CTA = {
  title: "Klaar om kennis te maken?",
  body: "Geen verplichtingen. Wel een scherpe eerste sessie. Kies de Groeiscan voor context, of intake als je al weet wat er moet gebeuren.",
} as const;
