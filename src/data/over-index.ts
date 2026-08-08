export const OVER_HERO = {
  eyebrow: "Over Meneer Marketing",
  title: "Twaalf jaar online groei. Ik doe het nog steeds zelf.",
  subtitle:
    "Afgestudeerd als applicatieontwikkelaar, twaalf jaar webdesign en marketing op mijn naam. Ik help bedrijven groeien door samen te kiezen welke kanalen en platforms passen. Shopify, SEO, ads: niet omdat het hip is, wel omdat het bij jouw fase hoort.",
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
    id: "dopamine",
    badge: "Eerlijk",
    text: "Mijn dopamine? Jouw grafiek omhoog. Omzet, leads, ROAS. Koffie is fijn. Een mailtje 'het werkt echt' is beter.",
    accent: "#FF5722",
    tilt: 2,
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
    body: "In twaalf jaar heb ik gezien wat online écht werkt en wat vooral geld kost zonder resultaat. Van app developer naar marketeer: ik weet wat bedrijven nodig hebben om maximaal te scoren. Lessen uit echte projecten, niet theorie uit een boek. Daarom focus ik op groei en omzet, niet alleen op mooie plaatjes.",
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
    punchline: "Shortcuts zijn uit. Alleen wat bewezen werkt.",
    scene: "contrast",
    highlights: ["From scratch", "Meetplan", "Bewezen werkt"],
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
    title: "Jij kent je klant, ik ken de kanalen",
    body: "De beste keuzes komen uit gesprekken, niet uit een standaard pakket. Wel Shopify of Next.js? Google Ads nu of SEO eerst? Meta of e-mail? Jij kent je markt, ik ken wat technisch en commercieel werkt. Samen kiezen we de volgorde die bij jouw fase past.",
    punchline: "Richting en eerlijk advies. Dictatuur is niet mijn stijl.",
    scene: "partner",
    highlights: ["Kanalen kiezen", "Platform match", "Team modus"],
    metric: { label: "Aanpak", value: "Samen" },
    footnote: "Shopify · SEO · ads · e-mail · wat past",
  },
];

export const OVER_PRINCIPLES = [
  {
    title: "Meetbaar",
    body: "Elk project krijgt duidelijke cijfers en overzichten die je snapt. Geen 'het voelt wel goed' als enig bewijs. Keuzes op basis van data, niet op onderbuikgevoel. Liever één getal dat klopt dan tien slides mooie praat.",
  },
  {
    title: "Technisch sterk",
    body: "Shopify, websites from scratch, Next.js en slimme koppelingen. Ik bouw alles alsof het vandaag live moet, want dat moet het. Eén lijn van site tot campagne, zonder losse tools die elkaar negeren. Alles schaalt mee als jij groeit.",
  },
  {
    title: "Menselijk",
    body: "Gewone taal in je inbox. Mail, WhatsApp of bellen, wat voor jou het fijnst is. Samen kiezen welke kanalen en platforms passen. Duidelijk en soms droog grappig, strak professioneel waar het moet.",
  },
] as const;

export const OVER_STACK_SECTION = {
  intro:
    "Mijn gereedschapskist. Tik een logo en zie wat ik ermee doe bij echte klanten. Niet wat een pitch-deck ervan maakt.",
} as const;

export interface OverStackItem {
  id: string;
  label: string;
  body: string;
  quip: string;
  accent: string;
  chips: readonly string[];
}

export const OVER_STACK: OverStackItem[] = [
  {
    id: "shopify",
    label: "Shopify",
    body: "Webshops en B2B-portals from scratch. Custom build, niet een theme uit de Store met jouw logo erop.",
    quip: "Salons die om 2 uur 's nachts bestellen? Been there. Built that.",
    accent: "#96BF48",
    chips: ["Liquid", "B2B-portaal", "Checkout", "GraphQL"],
  },
  {
    id: "nextjs",
    label: "Next.js",
    body: "Sites en web-apps die snel laden en technisch schoon zijn. Core Web Vitals zijn geen bijzaak, het is je ranking.",
    quip: "50 ms en je bezoeker heeft al een oordeel. Ik ook.",
    accent: "#FFFFFF",
    chips: ["React", "TypeScript", "App Router", "CWV groen"],
  },
  {
    id: "seo",
    label: "SEO & content",
    body: "Google én ChatGPT. Landingspagina's op echte vragen, techniek die indexeert, autoriteit die blijft staan.",
    quip: "Positie 1 kost geen cent per klik. Alleen werk vooraf.",
    accent: "#00BCD4",
    chips: ["Technisch", "Semantisch", "Lokaal", "AI-zoek"],
  },
  {
    id: "google-ads",
    label: "Google Ads",
    body: "Search, Shopping, wat past. Campagnes die je kunt uitleggen aan je moeder. Transparant beheer, geen black box met een maandbudget.",
    quip: "Eerst converteren. Dan pas budget erbij. Anders gokken.",
    accent: "#4285F4",
    chips: ["Search", "Shopping", "ROAS", "Landings"],
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    body: "Instagram en Facebook met creatief én data. Niet alleen mooie Reels, ook omzet die je kunt terugvinden in je dashboard.",
    quip: "Je feed scrollt sneller dan je denkt. Je ad moet sneller overtuigen.",
    accent: "#E1306C",
    chips: ["Feed", "Reels", "UGC", "Retargeting"],
  },
  {
    id: "automation",
    label: "Automatisering",
    body: "Shopify, Klaviyo, n8n, CRM. Systemen die praten zodat jij niet copy-pastet tussen twaalf tabbladen.",
    quip: "Handmatig overtypen is geen proces. Dat is lijden met Excel open.",
    accent: "#FF5722",
    chips: ["n8n", "Klaviyo", "Webhooks", "Flows"],
  },
];

export interface OverDayMoment {
  id: string;
  time: string;
  timeLabel: string;
  title: string;
  body: string;
  quip: string;
  ping: string;
  mood: "coffee" | "code" | "chart" | "call" | "deploy";
  chips: readonly string[];
  accent: string;
}

export const OVER_DAY: OverDayMoment[] = [
  {
    id: "morning",
    time: "08:30",
    timeLabel: "Ochtend",
    title: "Koffie en cijfers checken",
    body: "Dashboard open voordat mijn ontbijt koud is. Conversies, ads, errors uit de nacht. Brandt er ergens iets? Dan fix ik het voordat jij je eerste mail opent.",
    quip: "Heldere afspraken tijdens je croissant. Dat is de deal.",
    ping: "3 conversies · 0 errors · koffie heet",
    mood: "coffee",
    chips: ["Analytics", "Alerts", "ROAS"],
    accent: "#FF5722",
  },
  {
    id: "build",
    time: "10:00",
    timeLabel: "Focus",
    title: "Bouwen of bijsturen",
    body: "Code, campagnes of content. Wat die week het meeste oplevert krijgt voorrang. Acht tabbladen tegelijk is geen productiviteit, dat is chaos met extra stappen.",
    quip: "Multitasken klinkt stoer op LinkedIn. Werkt zelden in echt.",
    ping: "layout.tsx · campagne NL · landingscopy",
    mood: "code",
    chips: ["Next.js", "Shopify", "Copy"],
    accent: "#FFFFFF",
  },
  {
    id: "data",
    time: "13:30",
    timeLabel: "Middag",
    title: "Cijfers eerlijk houden",
    body: "Wat stijgt krijgt budget. Wat niet converteert gaat eraf. Soms moet ik nee zeggen tegen een mooie campagne die niks oplevert. Pijnlijk? Soms. Nuttig? Altijd.",
    quip: "Ego heeft geen ROAS. Data wel.",
    ping: "Ad set gepauzeerd · budget verschoven",
    mood: "chart",
    chips: ["Google Ads", "Meta", "GA4"],
    accent: "#4285F4",
  },
  {
    id: "call",
    time: "15:00",
    timeLabel: "Contact",
    title: "WhatsApp, mail, gewoon praten",
    body: "Update in normale taal: wat live staat, wat het doet, wat de volgende stap is. Drie regels die ertoe doen, niet veertig slides. Gewoon menselijk.",
    quip: "Als ik moet gokken wat je bedoelt, is je briefing te ingewikkeld.",
    ping: "Hoi! De pagina staat live. ROAS ziet er goed uit 👍",
    mood: "call",
    chips: ["WhatsApp", "Mail", "Call"],
    accent: "#25D366",
  },
  {
    id: "ship",
    time: "17:00",
    timeLabel: "Einde dag",
    title: "Iets live zetten",
    body: "Liever iets kleins live dan iets groots in een mapje final_v3_definitief_echt. Momentum wint van perfectie. Elke dag een beetje vooruit is beter dan maanden polieren.",
    quip: "Perfectie is de favoriete reden om niks te shippen.",
    ping: "Deploy ✓ · live op productie",
    mood: "deploy",
    chips: ["Ship it", "Deploy", "Done"],
    accent: "#34D399",
  },
];

export const OVER_ANTI = {
  title: "Zo werk ik niet",
  subtitle: "Ik heb geen pingpongtafel. Wel twaalf jaar resultaat.",
  items: [
    {
      label: "Template-bureau",
      body: "Mooie demo, straks vastgelopen. Ik bouw from scratch omdat ik het daarna nog moet onderhouden.",
    },
    {
      label: "Corporate speak",
      body: "Mailtjes vol formeel gedoe waar niemand energie van krijgt. Ik typ gewoon Nederlands. Zakelijk waar het moet.",
    },
    {
      label: "Ads zonder plan",
      body: "Budget erin, omzet er niet uit. Eerst basis, dan gas. Soms zeg ik: nog even wachten met adverteren.",
    },
    {
      label: "Doorverwijzer",
      body: "Vijf bureaus, nul overzicht. Bij mij loopt strategie tot code in één lijn.",
    },
  ],
} as const;

export const OVER_FAQ = [
  {
    question: "Ben je een eenmanszaak of een bureau?",
    answer:
      "Eén aanspreekpunt met twaalf jaar ervaring in development, design en marketing. Strategie, bouw en campagnes komen uit hetzelfde hoofd. Altijd dezelfde persoon aan de lijn.",
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
      "Sneller schakelen, minder lagen, meer eigenaarschap. Senior die je dossier kent vóór de deadline, geen junior die net begint.",
  },
  {
    question: "Hoe communiceer je met klanten?",
    answer:
      "Als een mens, niet als een mailrobot. Afspraken, deadlines en cijfers zijn keihard professioneel. In je inbox gewoon duidelijk Nederlands. Soms droog, altijd helder, zodat jij en ik snel kunnen schakelen.",
  },
  {
    question: "Hoe begin je?",
    answer:
      "Met een intake. Twee minuten invullen, daarna een gesprek. Je krijgt helderheid op prioriteit en route. Daarna een voorstel dat past bij je fase, niet bij een standaardpakket.",
  },
] as const;

export const OVER_CTA = {
  title: "Klaar om kennis te maken?",
  body: "Vrijblijvend eerste gesprek in gewoon Nederlands. Vul de intake in (twee minuten) of neem contact op als je liever mailt.",
} as const;
