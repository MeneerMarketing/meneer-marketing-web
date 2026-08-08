export const CONTACT_HERO = {
  eyebrow: "Contact",
  title: "Gewoon even praten.",
  subtitle:
    "Een gesprek, geen standaard contactformulier met dropdowns en corporate tone. Typ wat je wilt: marketing, je site, een idee, of gewoon 'hoi, kunnen we bellen?'",
  stats: [
    { label: "Reactietijd", value: "1–2 dagen" },
    { label: "Tussenlaag", value: "Nul" },
    { label: "CRM-stalker", value: "Nee" },
  ],
} as const;

export const CONTACT_CHAT_OPENERS = [
  "Hoi. Je hebt me te pakken. Ik ben geen chatbot die 'ik begrijp het' zegt en niks doet.",
  "Marketing, je site, Shopify, ads, automatisering... of gewoon even je situatie uiten. Allemaal goed.",
  "Je hoeft me niet te vertellen welke pizza je gisteren at. Tenzij het je conversie-ratio raakt. Grapje. Praat gewoon.",
] as const;

export interface ContactFocusOption {
  id: string;
  label: string;
  meneerReply: string;
}

export interface ContactQuickReply {
  id: string;
  label: string;
  onderwerp: string;
  meneerReply: string;
  focusOptions: readonly ContactFocusOption[];
}

export const CONTACT_QUICK_REPLIES: ContactQuickReply[] = [
  {
    id: "sparren",
    label: "Even sparren",
    onderwerp: "anders",
    meneerReply:
      "Lekker. Eerst even scherp krijgen waar je zit. Salespitch hoeft niet.",
    focusOptions: [
      {
        id: "begin",
        label: "Weet niet waar te beginnen",
        meneerReply:
          "Logisch. Veel mensen starten daar. Vertel kort waar je bedrijf nu staat.",
      },
      {
        id: "match",
        label: "Twijfel of we matchen",
        meneerReply:
          "Snap ik. Vertel waar je mee zit. Dan merken we snel of het klikt.",
      },
      {
        id: "second",
        label: "Second opinion",
        meneerReply:
          "Prima. Wat doe je nu al en waar twijfel je over?",
      },
      {
        id: "ideas",
        label: "Gewoon ideeën uitwisselen",
        meneerReply:
          "Mooi. Vertel waar je over nadenkt. Verplicht plan hoeft niet.",
      },
    ],
  },
  {
    id: "bouwen",
    label: "Iets bouwen",
    onderwerp: "web-shop",
    meneerReply:
      "From scratch? Mooi. Even scherp welk stuk je bedoelt.",
    focusOptions: [
      {
        id: "site",
        label: "Nieuwe website",
        meneerReply:
          "Vertel wat de site moet doen en voor wie. URL meesturen mag.",
      },
      {
        id: "shopify",
        label: "Shopify webshop",
        meneerReply:
          "Shopify kan veel. Wat verkoop je en wat mist er nu?",
      },
      {
        id: "slow",
        label: "Site is traag of gedateerd",
        meneerReply:
          "Klassieker. Wat irriteert je het meest aan je huidige site?",
      },
      {
        id: "b2b",
        label: "B2B portaal",
        meneerReply:
          "Mooi. Hoe bestellen klanten nu en wat moet beter?",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing hulp",
    onderwerp: "marketing",
    meneerReply:
      "SEO, Google Ads, Meta Ads? Even kijken wat het meest urgent is.",
    focusOptions: [
      {
        id: "seo",
        label: "SEO / vindbaarheid",
        meneerReply:
          "Organisch eerst is vaak slim. Waar wil je gevonden worden?",
      },
      {
        id: "google",
        label: "Google Ads",
        meneerReply:
          "Ads meten is key. Draai je al campagnes of start je fresh?",
      },
      {
        id: "meta",
        label: "Meta Ads",
        meneerReply:
          "Social ads vragen goede creative. Wat heb je al geprobeerd?",
      },
      {
        id: "mix",
        label: "Alles door elkaar",
        meneerReply:
          "Snap ik. Vertel wat je nu doet en wat het meeste pijn doet.",
      },
    ],
  },
  {
    id: "strategie",
    label: "Eerst de route",
    onderwerp: "strategie",
    meneerReply:
      "Slim. Voordat je budget verbrandt. Waar wil je scherpte?",
    focusOptions: [
      {
        id: "order",
        label: "Volgorde kiezen",
        meneerReply:
          "Wat moet er over zes maanden anders zijn? Vertel je doel.",
      },
      {
        id: "budget",
        label: "Budget inschatten",
        meneerReply:
          "Eerlijk gesprek. Vertel je fase en wat je denkt te kunnen investeren.",
      },
      {
        id: "priority",
        label: "Prioriteit scherp",
        meneerReply:
          "Max drie dingen tegelijk. Wat voelt nu het meest urgent?",
      },
      {
        id: "plan",
        label: "Plan laten checken",
        meneerReply:
          "Prima. Wat staat er nu op papier en waar twijfel je over?",
      },
    ],
  },
  {
    id: "geen-idee",
    label: "Geen idee nog",
    onderwerp: "anders",
    meneerReply:
      "Ook prima. Kies wat het dichtst in de buurt komt. Rustig aan.",
    focusOptions: [
      {
        id: "stuck",
        label: "Website staat stil",
        meneerReply:
          "Gebeurt vaker dan je denkt. Wat moet de site voor je opleveren?",
      },
      {
        id: "ads",
        label: "Ads kosten te veel",
        meneerReply:
          "Lastig. Vertel wat je uitgeeft en wat je terugkrijgt.",
      },
      {
        id: "growth",
        label: "Groei stokt",
        meneerReply:
          "Frustrerend. Waar zat je een jaar geleden en waar zit je nu?",
      },
      {
        id: "blank",
        label: "Echt blank canvas",
        meneerReply:
          "Ook goed. Beschrijf je bedrijf in twee zinnen, dan zoeken we de ingang.",
      },
    ],
  },
];

export const CONTACT_CHAT_PROMPTS = {
  askFocus: "Waar zit je hoofd nu? Kies wat het dichtst in de buurt komt.",
  askMessage: "Nu jij. Typ wat je wilt delen. Kort mag, lang mag ook.",
  askName: "Top. En wie ben jij? Naam en e-mail, dan kan ik terugkoppelen.",
  askSend: "Klaar om te versturen? Ik lees alles zelf. Persoonlijk, geen automaat.",
  sent: "Bedankt. Staat in mijn inbox. Reactie binnen één à twee werkdagen.",
  teaserContinue:
    "Mooi. Vertel het verder op contact. Dan zit je meteen in mijn inbox.",
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
    body: "Liever je eigen woorden in de mail? Prima. Onderwerp en context helpen mij direct schakelen.",
    quip: "Ik lees ook mails met alleen 'hoi, kunnen we bellen?'",
    href: "mailto:info@meneermarketing.nl",
    external: true,
    accent: "#0284c7",
    scene: "mail",
  },
  {
    id: "intake",
    title: "Start intake",
    body: "Twee minuten invullen. Dan weet ik genoeg om het eerste gesprek scherp te starten.",
    quip: "Sneller dan drie mails heen en weer.",
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
    title: "Kennismaking of intake",
    body: "Kort gesprek na je aanvraag. Verplicht traject niet, wel helderheid.",
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
    body: "Intake of sparren over prioriteit. Voordat je budget verbrandt.",
    formValue: "strategie",
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
    question: "Moet ik eerst de intake invullen?",
    answer:
      "Nee. Handig als je snel context wilt delen. Hierboven kun je ook gewoon typen alsof je me app't.",
  },
  {
    question: "Werk je met vaste pakketten?",
    answer:
      "Elk traject is anders. Soms eerst SEO, soms een eigen koers per product. Jij krijgt wat bij jouw fase past.",
  },
  {
    question: "Kan ik ook alleen even sparren?",
    answer:
      "Ja. Verplicht vervolgtraject niet. Wel een eerlijk gesprek over wat zinvol is en wat niet.",
  },
  {
    question: "Waar komen mijn gegevens terecht?",
    answer:
      "Direct bij mij via info@meneermarketing.nl. Ik reageer zelf, geen CRM-automaat die je drie dagen later een generieke follow-up stuurt.",
  },
] as const;

export const CONTACT_CTA = {
  title: "Liever meteen een gestructureerd gesprek?",
  body: "De intake duurt twee minuten. Handig als je al weet dat je wilt starten. Hierboven kun je ook gewoon praten.",
} as const;
