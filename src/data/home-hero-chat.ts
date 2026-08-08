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

/** @deprecated Gebruik getHeroChatIntroLines() uit @/lib/hero-chat-time */
export const HERO_CHAT_INTRO = [
  "Hoi. Je hebt me live. Zeldzaam genoeg in marketing.",
  "Waar kom je voor? Tik een optie. Twijfel mag ook.",
] as const;

export const HERO_CHAT_OPTIONS: HeroChatOption[] = [
  {
    id: "build",
    label: "Site of shop",
    userReply: "Iets bouwen",
    meneerReply: "Lekker. From scratch of iets fixen? Beide kan, jij kiest.",
    focusPrompt: "Wat ga ik voor je neerzetten?",
    cta: siteCtas.projectStarten,
    focusOptions: [
      {
        id: "new-site",
        label: "Nieuwe website",
        userReply: "Nieuwe website",
        meneerReply:
          "Mooi. From scratch, geen template dat omvalt zodra je gaat adverteren. Wel iets dat blijft verkopen.",
        cta: siteCtas.projectStarten,
      },
      {
        id: "shop",
        label: "Shopify shop",
        userReply: "Shopify shop",
        meneerReply:
          "Custom Shopify. B2B-portaal, klanten bestellen zelf. Jouw shop op dat niveau.",
        cta: siteCtas.projectStarten,
      },
      {
        id: "fix",
        label: "Site verbeteren",
        userReply: "Bestaande site fixen",
        meneerReply:
          "Site lekt ergens? Eerst meten waar, dan fixen. Gericht oplossen, niet plugin-roulette en hopen op het beste.",
        cta: siteCtas.startIntake,
      },
    ],
  },
  {
    id: "grow",
    label: "Meer klanten",
    userReply: "Groei & marketing",
    meneerReply: "Respect. Meer klanten zonder je budget te verbranden? Daar doe ik dit voor.",
    focusPrompt: "Waar zit de grootste kans nu?",
    cta: siteCtas.schaalOp,
    focusOptions: [
      {
        id: "seo",
        label: "SEO / vindbaar",
        userReply: "SEO & vindbaarheid",
        meneerReply:
          "SEO én AI-vindbaarheid. Bovenaan in Google én genoemd in ChatGPT. Gratis verkeer dat blijft komen.",
        cta: siteCtas.schaalOp,
      },
      {
        id: "ads",
        label: "Google of Meta ads",
        userReply: "Ads opschalen",
        meneerReply:
          "Klein testen, hard meten, alleen opschalen wat ROAS oplevert. Jouw budget is geen speelgeld.",
        cta: siteCtas.schaalOp,
      },
      {
        id: "mix",
        label: "Alles door elkaar",
        userReply: "Geen idee waar te beginnen",
        meneerReply:
          "Chaos is mijn favoriete startpunt. Ik orden het en pak eerst de winst die het snelst binnenkomt.",
        cta: siteCtas.startIntake,
      },
    ],
  },
  {
    id: "spar",
    label: "Even sparren",
    userReply: "Even sparren",
    meneerReply: "Eerlijk advies van iemand die het zelf gebouwd heeft. Pitch-deck hoeft niet.",
    focusPrompt: "Wat zit je het meest dwars?",
    cta: siteCtas.startIntake,
    focusOptions: [
      {
        id: "begin",
        label: "Weet niet waar beginnen",
        userReply: "Weet niet waar te beginnen",
        meneerReply:
          "Helemaal logisch. 90% van mijn klanten wist dat ook niet. Daar ben ik precies voor.",
        cta: siteCtas.startIntake,
      },
      {
        id: "match",
        label: "Twijfel of het klikt",
        userReply: "Twijfel of we matchen",
        meneerReply:
          "Twijfel mag. Eén gesprek, nul verplicht traject. Klikt het niet, zeg ik het zelf.",
        cta: siteCtas.startIntake,
      },
      {
        id: "ideas",
        label: "Gewoon ideeën",
        userReply: "Gewoon ideeën uitwisselen",
        meneerReply:
          "Prima. Je hoeft geen plan B te hebben. Stuur je ideeën, ik help ze ordenen.",
        cta: siteCtas.contact,
      },
    ],
  },
  {
    id: "partner",
    label: "Vaste partner",
    userReply: "Langdurig samen",
    meneerReply:
      "Eén partner i.p.v. vijf bureaus die elkaar negeren. Slimme zet, eerlijk gezegd.",
    focusPrompt: "Waar wil je het meest hulp bij?",
    cta: siteCtas.samenwerken,
    focusOptions: [
      {
        id: "ecom",
        label: "Webshop / e-commerce",
        userReply: "Webshop laten groeien",
        meneerReply:
          "Shop, ads, e-mail, retentie. Eén lijn. Geen 'dat is niet mijn afdeling' meer.",
        cta: siteCtas.samenwerken,
      },
      {
        id: "b2b",
        label: "B2B / lang traject",
        userReply: "B2B en lang traject",
        meneerReply:
          "Portaal, SEO, acquisitie. Alles onder één dak. B2B-portaal-style, maar dan voor jou.",
        cta: siteCtas.samenwerken,
      },
      {
        id: "explore",
        label: "Nog verkennen",
        userReply: "Nog aan het verkennen",
        meneerReply:
          "Prima tempo. Intake duurt twee minuten. Kort en helder, zonder verkooppraat of kleine lettertjes.",
        cta: siteCtas.startIntake,
      },
    ],
  },
  {
    id: "talk",
    label: "Gewoon praten",
    userReply: "Even een vraag",
    meneerReply: "Top. Snel antwoord of uitgebreid gesprek? Jij beslist.",
    focusPrompt: "Hoe pakken we het aan?",
    cta: siteCtas.contact,
    focusOptions: [
      {
        id: "chat",
        label: "Typen via contact",
        userReply: "Liever typen",
        meneerReply:
          "Typ maar. Een formulier dat voelt als belastingaangifte hoeft niet. Ik lees alles zelf.",
        cta: siteCtas.contact,
      },
      {
        id: "call",
        label: "Even bellen",
        userReply: "Liever bellen",
        meneerReply:
          "Bel je liever? Plan het in via contact. Direct contact, zonder wachtmenu met drie keuzes die nergens op slaan.",
        cta: siteCtas.contact,
      },
      {
        id: "quick",
        label: "Snelle vraag",
        userReply: "Snelle vraag",
        meneerReply:
          "Korte vraag? Stuur hem. Ik antwoord zelf, persoonlijk.",
        cta: siteCtas.contact,
      },
    ],
  },
];
