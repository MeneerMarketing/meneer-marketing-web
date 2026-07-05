export const OVER_HERO = {
  eyebrow: "Over Meneer Marketing",
  title: "Groei is geen toeval. Het is een systeem met een gezicht.",
  subtitle:
    "Afgestudeerd als applicatieontwikkelaar, jarenlang webdesign en marketing op mijn naam. Twaalf jaar later focus ik op wat echt telt: bedrijven laten groeien en maximaal uit online halen. Niet alleen mooie sites of systemen bouwen, maar alles wat moet scoren.",
  stats: [
    { label: "Ervaring", value: "12+ jaar" },
    { label: "Start", value: "Dev & design" },
    { label: "Nu", value: "Groei & omzet" },
  ],
} as const;

export interface OverHeroFact {
  id: string;
  badge: string;
  text: string;
  accent: string;
  tilt: number;
}

/** Persoonlijke weetjes voor de hero-rechterkolom op /over. */
export const OVER_HERO_FACTS: OverHeroFact[] = [
  {
    id: "mail",
    badge: "Inbox-proof",
    text: "Ik typ liever 'hoi, dit staat live' dan drie alinea's met ' naar aanleiding van uw e-mail'. Werkt beter. Voor ons allebei.",
    accent: "#FF5722",
    tilt: -1.5,
  },
  {
    id: "dev",
    badge: "Dev-hart",
    text: "Applicatieontwikkelaar in mijn hoofd. 200 ms trager? Voel ik bijna fysiek.",
    accent: "#0284C7",
    tilt: -1,
  },
  {
    id: "scratch",
    badge: "Anti-template",
    text: "Templates vastlopen na een half jaar. Daarom from scratch, geen page builder.",
    accent: "#0F172A",
    tilt: 1.5,
  },
  {
    id: "contact",
    badge: "Gewoon praten",
    text: "Mail, bellen, WhatsApp. Geen protocolboek, wel afspraken die kloppen.",
    accent: "#0D9488",
    tilt: -0.75,
  },
] as const;

export interface OverStoryChapter {
  id: string;
  tag: string;
  title: string;
  body: string;
  punchline: string;
  scene: "solo" | "contrast" | "stack" | "partner";
  highlights: readonly string[];
  metric: { label: string; value: string };
  footnote: string;
}

export const OVER_STORY: OverStoryChapter[] = [
  {
    id: "solo",
    tag: "Wie",
    title: "Twaalf jaar leren wat werkt",
    body: "In twaalf jaar heb ik gezien wat online écht werkt en wat vooral geld kost zonder resultaat. Van app developer naar marketeer: ik weet wat bedrijven nodig hebben om maximaal te scoren. Geen theorie uit een boek, maar lessen uit echte projecten. Daarom focus ik op groei en omzet, niet alleen op mooie plaatjes.",
    punchline: "Twaalf jaar les: groei is het doel, pixels zijn het middel.",
    scene: "solo",
    highlights: ["12 jaar", "Wat werkt", "Maximaal halen"],
    metric: { label: "Ervaring", value: "12+ jr" },
    footnote: "Dev · design · wat écht werkt",
  },
  {
    id: "contrast",
    tag: "Daarom",
    title: "From scratch, met meetplan",
    body: "Templates en page builders heb ik genoeg zien vastlopen. Rapporten vol moeilijke woorden leverden niks op. Ads zonder meetplan verbrandden budget. Na twaalf jaar weet ik: from scratch bouwen en meten is wat blijft werken als je echt wilt groeien.",
    punchline: "Geen shortcuts meer. Alleen wat bewezen werkt.",
    scene: "contrast",
    highlights: ["From scratch", "Meetplan", "Geen shortcuts"],
    metric: { label: "Templates", value: "Nul" },
    footnote: "Bouwen · meten · geen page builder",
  },
  {
    id: "stack",
    tag: "Wel",
    title: "Techniek die omzet oplevert",
    body: "In twaalf jaar zag ik welke techniek omzet oplevert en welke vooral duur oogt. Shopify, Next.js, SEO, ads en koppelingen. Alles alleen als het commercieel zinnig is. Daarom kies ik tools die winst geven, niet tools die cool klinken op papier.",
    punchline: "Techniek is middel. Omzet is het punt.",
    scene: "stack",
    highlights: ["Shopify", "Next.js", "Omzet first"],
    metric: { label: "Stack", value: "1 lijn" },
    footnote: "Bouwen · vindbaar · campagnes · koppelingen",
  },
  {
    id: "partner",
    tag: "Samen",
    title: "Gewoon praten, als een team",
    body: "De beste resultaten kwamen nooit uit formele mailketens. Wel uit open gesprekken waarin iedereen snapt wat er speelt. Mail, WhatsApp of bellen: wat voor jou het fijnst is. Twaalf jaar heeft me geleerd: menselijk praten levert betere beslissingen dan een corporate masker.",
    punchline: "Geen 'Geachte heer/mevrouw' als we al koffie hebben gedronken.",
    scene: "partner",
    highlights: ["Mail · WhatsApp", "Team modus", "Geen masker"],
    metric: { label: "Contact", value: "Menselijk" },
    footnote: "Zakelijk waar het telt · menselijk hoe we praten",
  },
];

export const OVER_PRINCIPLES = [
  {
    title: "Meetbaar",
    body: "Elk project krijgt duidelijke cijfers en overzichten die je snapt. Geen 'het voelt wel goed' als enig bewijs. Keuzes op basis van data, niet op onderbuikgevoel. Liever één getal dat klopt dan tien slides mooie praat.",
  },
  {
    title: "Technisch sterk",
    body: "Shopify, websites from scratch, Next.js en slimme koppelingen. Ik bouw alles alsof het vandaag live moet, want dat moet het. Geen losse tools die elkaar negeren. Eén lijn van site tot campagne, zonder verrassingen als je groeit.",
  },
  {
    title: "Menselijk",
    body: "Geen moeilijke bureautaal in je inbox. Mail, WhatsApp of bellen, wat voor jou het fijnst is. Duidelijk en soms droog grappig, en strak professioneel waar het moet. Lastige woorden leg ik uit in taal die je team direct snapt.",
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
    body: "Vindbaar in Google én in AI-antwoorden. Structuur, content en autoriteit in de juiste volgorde.",
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
    title: "Gewoon menselijk",
    body: "Update in normale taal: wat live staat, wat het doet, wat de volgende stap is. Geen 40 slides. Geen ' naar aanleiding van uw e-mail van gisteren'. Gewoon praten, als collega's.",
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
  subtitle: "Geen pingpongtafel. Geen zakelijke maskers. Wel resultaat.",
  items: [
    {
      label: "Template-bureau",
      body: "Mooie demo, straks vastgelopen. Wij bouwen from scratch.",
    },
    {
      label: "Corporate speak",
      body: "Mailtjes vol formeel gedoe waar niemand energie van krijgt. Wij praten gewoon. Zakelijk waar het moet.",
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
      "Eén aanspreekpunt met twaalf jaar ervaring in development, design en marketing. Strategie, bouw en campagnes komen uit hetzelfde hoofd. Geen wisselende accountmanagers.",
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
    question: "Hoe communiceer je met klanten?",
    answer:
      "Als een mens, niet als een mailrobot. Afspraken, deadlines en cijfers zijn keihard professioneel. In je inbox gewoon duidelijk Nederlands. Geen corporate masker, wel honderd procent begrip zodat we als team kunnen schakelen.",
  },
  {
    question: "Hoe starten we?",
    answer:
      "Met een intake. Twee minuten invullen, daarna een gesprek. Je krijgt helderheid op prioriteit en route. Daarna een voorstel dat past bij je fase, niet bij een standaardpakket.",
  },
] as const;

export const OVER_CTA = {
  title: "Klaar om kennis te maken?",
  body: "Geen verplichtingen. Wel een eerste gesprek in gewoon Nederlands. Vul de intake in (twee minuten) of neem contact op als je liever mailt.",
} as const;
