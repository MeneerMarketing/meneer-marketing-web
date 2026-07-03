export const CONTACT_HERO = {
  eyebrow: "Contact",
  title: "Laten we kijken wat jouw situatie nodig heeft.",
  subtitle:
    "Geen standaard offerte uit een automaat. Vertel kort waar je tegenaan loopt en we bepalen samen of strategie, bouwen from scratch, SEO, Google Ads, Meta Ads of automatisering de slimste eerste stap is.",
  aside:
    "Geen chatbot die 'ik begrijp het' zegt en niks doet. Je bericht komt bij mij. Ik lees alles zelf.",
  stats: [
    { label: "Reactietijd", value: "1–2 dagen" },
    { label: "Aanpak", value: "Persoonlijk" },
    { label: "CRM-automaat", value: "Nee" },
  ],
} as const;

export interface ContactRoute {
  id: string;
  title: string;
  body: string;
  quip: string;
  href: string;
  external?: boolean;
  accent: string;
  scene: "form" | "mail" | "scan" | "intake";
}

export const CONTACT_ROUTES: ContactRoute[] = [
  {
    id: "form",
    title: "Stuur een bericht",
    body: "Het formulier hieronder. Naam, context en waar je tegenaan loopt. Meest gebruikt en het snelst.",
    quip: "Geen 'deel je gegevens voor een whitepaper'. Gewoon praten.",
    href: "#formulier",
    accent: "#FF5722",
    scene: "form",
  },
  {
    id: "mail",
    title: "Direct mailen",
    body: "Liever je eigen woorden in de mail? Prima. Onderwerp en context helpen ons direct schakelen.",
    quip: "Ik lees ook mails met alleen 'hoi, kunnen we bellen?'",
    href: "mailto:info@meneermarketing.nl",
    external: true,
    accent: "#0284c7",
    scene: "mail",
  },
  {
    id: "groeiscan",
    title: "Doe de Groeiscan",
    body: "Nog geen helder beeld? De Groeiscan geeft context op prioriteit en route vóór we groot bouwen.",
    quip: "Gratis scherpte. Geen verplichting.",
    href: "/groeiscan",
    accent: "#00BCD4",
    scene: "scan",
  },
  {
    id: "intake",
    title: "Start intake",
    body: "Weet je al wat er moet gebeuren? Plan een intake met onderwerp en prioriteit vooraf ingevuld.",
    quip: "Voor als je geen tijd hebt voor kleine talk.",
    href: "/intake",
    accent: "#22C55E",
    scene: "intake",
  },
];

export const CONTACT_PROCESS = [
  {
    tag: "Lezen",
    title: "Ik lees je bericht zelf",
    body: "Geen tussenlaag. Ik snap je context en stel scherpe vervolgvragen als dat nodig is.",
  },
  {
    tag: "Scherp",
    title: "Eerste reactie met richting",
    body: "Binnen één à twee werkdagen. Met een eerlijk beeld: past het, wat is logisch als eerste stap?",
  },
  {
    tag: "Gesprek",
    title: "Kennismaking of Groeiscan",
    body: "Kort gesprek of verdiepende sessie. Geen verplicht traject, wel helderheid.",
  },
  {
    tag: "Voorstel",
    title: "Voorstel op maat",
    body: "Geen standaardpakket. Wel een plan dat past bij je fase, budget en ambities.",
  },
] as const;

export interface ContactTopic {
  id: string;
  label: string;
  title: string;
  body: string;
  formValue: string;
  accent: string;
}

export const CONTACT_TOPICS: ContactTopic[] = [
  {
    id: "web",
    label: "Website of shop",
    title: "Bouwen from scratch",
    body: "Nieuwe site, Shopify-webshop of B2B-portaal. Custom code, geen template dat vastloopt.",
    formValue: "web-shop",
    accent: "#0F172A",
  },
  {
    id: "growth",
    label: "SEO & ads",
    title: "Vindbaarheid en campagnes",
    body: "SEO, vindbaarheid in AI, Google Ads en Meta Ads. In de volgorde die voor jou logisch is.",
    formValue: "marketing",
    accent: "#FF5722",
  },
  {
    id: "auto",
    label: "Automatisering",
    title: "Systemen knopen",
    body: "Orders, e-mail, CRM. Minder handwerk tussen tabbladen.",
    formValue: "automatisering",
    accent: "#00BCD4",
  },
  {
    id: "strategy",
    label: "Strategie",
    title: "Eerst de route",
    body: "Groeiscan, intake of sparren over prioriteit. Voordat je budget verbrandt.",
    formValue: "groeiscan",
    accent: "#22C55E",
  },
];

export const CONTACT_QUOTES = [
  "Psst. Hoe korter je bericht, hoe sneller ik kan schakelen. Tenzij het ingewikkeld is. Dan mag het lang.",
  "Geen 'dear sir/madam'. We kennen elkaar nog niet, maar we zijn al vrienden.",
  "Als je site-URL meestuurt, scheelt dat drie mails heen en weer. Trust me.",
  "Urgent? Zet 'urgent' in je onderwerp. Ik beloof niks, maar ik kijk wel eerder.",
] as const;

export const CONTACT_FAQ = [
  {
    question: "Hoe snel krijg ik reactie?",
    answer:
      "Reken op één à twee werkdagen. Sneller kan als het urgent is. Vermeld dat in je onderwerp, dan prioriteer ik.",
  },
  {
    question: "Is de Groeiscan verplicht voordat we praten?",
    answer:
      "Nee. Handig als je nog zoekt naar prioriteit. Weet je al wat er moet? Start direct met intake of het formulier.",
  },
  {
    question: "Werk je met vaste pakketten?",
    answer:
      "Nee. Elk traject is anders. SkinComplete begon met SEO. BestRest kreeg een eigen koers per product. Jij krijgt wat bij jouw fase past.",
  },
  {
    question: "Kan ik ook alleen even sparren?",
    answer:
      "Ja. Geen verplicht vervolgtraject. Wel een eerlijk gesprek over wat zinvol is en wat niet.",
  },
  {
    question: "Waar komen mijn gegevens terecht?",
    answer:
      "Direct bij mij via info@meneermarketing.nl. Geen CRM-automaat die je drie dagen later een generieke follow-up stuurt.",
  },
] as const;

export const CONTACT_CTA = {
  title: "Liever meteen scherpte?",
  body: "De Groeiscan geeft context op prioriteit en route. Gratis, geen verplichting. Of start direct met intake als je al weet wat er moet.",
} as const;
