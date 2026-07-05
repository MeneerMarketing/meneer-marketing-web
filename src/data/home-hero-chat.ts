import { siteCtas, type SiteCta } from "@/lib/cta";

export interface HeroChatFocusOption {
  id: string;
  label: string;
  userReply: string;
  meneerReply: string;
  cta: SiteCta;
}

export interface HeroChatOption {
  id: string;
  label: string;
  userReply: string;
  meneerReply: string;
  focusPrompt: string;
  focusOptions: readonly HeroChatFocusOption[];
  cta: SiteCta;
}

export const HERO_CHAT_INTRO = [
  "Hoi. Je hebt me te pakken.",
  "Je hoeft me niet te vertellen wat je gisteren at. Tenzij het je conversie-ratio raakt. Grapje.",
  "Waar zit je hoofd? Site, shop, ads, SEO... of gewoon even sparren. Klik iets.",
] as const;

export const HERO_CHAT_OPTIONS: HeroChatOption[] = [
  {
    id: "build",
    label: "Site of shop",
    userReply: "Iets bouwen",
    meneerReply: "Mooi. Even scherp welk stuk je bedoelt.",
    focusPrompt: "Wat moet er gebeuren?",
    cta: siteCtas.projectStarten,
    focusOptions: [
      {
        id: "new-site",
        label: "Nieuwe website",
        userReply: "Nieuwe website",
        meneerReply: "From scratch? Dan pakken we dat strak aan.",
        cta: siteCtas.projectStarten,
      },
      {
        id: "shop",
        label: "Shopify shop",
        userReply: "Shopify shop",
        meneerReply: "Custom Shopify. Geen template die vastloopt.",
        cta: siteCtas.projectStarten,
      },
      {
        id: "fix",
        label: "Site verbeteren",
        userReply: "Bestaande site fixen",
        meneerReply: "Eerst meten wat pijn doet. Dan bouwen we door.",
        cta: siteCtas.startIntake,
      },
    ],
  },
  {
    id: "grow",
    label: "Meer klanten",
    userReply: "Groei & marketing",
    meneerReply: "Snap ik. Waar wil je eerst scherpte?",
    focusPrompt: "Wat voelt het meest urgent?",
    cta: siteCtas.schaalOp,
    focusOptions: [
      {
        id: "seo",
        label: "SEO / vindbaar",
        userReply: "SEO & vindbaarheid",
        meneerReply: "Organisch eerst is vaak slim. Dan pas gas op ads.",
        cta: siteCtas.schaalOp,
      },
      {
        id: "ads",
        label: "Google of Meta ads",
        userReply: "Ads opschalen",
        meneerReply: "Meten, sturen, opschalen. Geen gokken met budget.",
        cta: siteCtas.schaalOp,
      },
      {
        id: "mix",
        label: "Alles door elkaar",
        userReply: "Geen idee waar te beginnen",
        meneerReply: "Prima startpunt. Intake duurt twee minuten.",
        cta: siteCtas.startIntake,
      },
    ],
  },
  {
    id: "spar",
    label: "Even sparren",
    userReply: "Even sparren",
    meneerReply: "Lekker. Geen salespitch. Waar zit je mee?",
    focusPrompt: "Wat komt het dichtst?",
    cta: siteCtas.startIntake,
    focusOptions: [
      {
        id: "begin",
        label: "Weet niet waar beginnen",
        userReply: "Weet niet waar te beginnen",
        meneerReply: "Logisch. Dan ordenen we het eerst.",
        cta: siteCtas.startIntake,
      },
      {
        id: "match",
        label: "Twijfel of het klikt",
        userReply: "Twijfel of we matchen",
        meneerReply: "Eerlijk gesprek. Geen verplicht traject.",
        cta: siteCtas.startIntake,
      },
      {
        id: "ideas",
        label: "Gewoon ideeën",
        userReply: "Gewoon ideeën uitwisselen",
        meneerReply: "Prima. Geen plan nodig om te starten.",
        cta: siteCtas.contact,
      },
    ],
  },
  {
    id: "partner",
    label: "Vaste partner",
    userReply: "Langdurig samen",
    meneerReply: "Eén lijn in plaats van losse partijen. Snap ik.",
    focusPrompt: "Waar wil je hulp bij?",
    cta: siteCtas.samenwerken,
    focusOptions: [
      {
        id: "ecom",
        label: "Webshop / e-commerce",
        userReply: "Webshop laten groeien",
        meneerReply: "Shop, ads, retentie. Eén partner, één plan.",
        cta: siteCtas.samenwerken,
      },
      {
        id: "b2b",
        label: "B2B / lang traject",
        userReply: "B2B en lang traject",
        meneerReply: "Portaal, SEO, acquisitie. Alles onder één dak.",
        cta: siteCtas.samenwerken,
      },
      {
        id: "explore",
        label: "Nog verkennen",
        userReply: "Nog aan het verkennen",
        meneerReply: "Prima. Intake geeft al snel richting.",
        cta: siteCtas.startIntake,
      },
    ],
  },
  {
    id: "talk",
    label: "Gewoon praten",
    userReply: "Even een vraag",
    meneerReply: "Top. Hoe wil je het aanpakken?",
    focusPrompt: "Wat past bij jou?",
    cta: siteCtas.contact,
    focusOptions: [
      {
        id: "chat",
        label: "Typen via contact",
        userReply: "Liever typen",
        meneerReply: "Prima. Geen formulier-gevoel nodig.",
        cta: siteCtas.contact,
      },
      {
        id: "call",
        label: "Even bellen",
        userReply: "Liever bellen",
        meneerReply: "Kan. Contactpagina, dan plannen we het.",
        cta: siteCtas.contact,
      },
      {
        id: "quick",
        label: "Snelle vraag",
        userReply: "Snelle vraag",
        meneerReply: "Stuur maar. Ik lees alles zelf.",
        cta: siteCtas.contact,
      },
    ],
  },
];
