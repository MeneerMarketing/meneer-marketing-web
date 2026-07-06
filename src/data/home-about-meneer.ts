export interface AboutMeneerStrategyMessage {
  id: string;
  from: "meneer" | "klant";
  text: string;
}

export const HOME_ABOUT_MENEER_STRATEGY_CHAT: readonly AboutMeneerStrategyMessage[] = [
  {
    id: "reach",
    from: "klant",
    text: "We willen meer bereik, maar onze ads voelen té veel als reclame.",
  },
  {
    id: "trust",
    from: "meneer",
    text: "Snap ik. Wie vertrouwt jouw product al? Klanten, creators, fans?",
  },
  {
    id: "unbox",
    from: "klant",
    text: "Onze unboxings op Instagram doen het goed. Mensen taggen ons constant.",
  },
  {
    id: "pitch",
    from: "meneer",
    text: "Dan is dit geen 'nog meer budget op Meta'. Influencer deals plus UGC. Eerlijk en herkenbaar.",
  },
  {
    id: "confirm",
    from: "klant",
    text: "Dus creators én video's die we in ads kunnen hergebruiken?",
  },
  {
    id: "close",
    from: "meneer",
    text: "Precies. Ik match creators, regel deals en zorg dat de content ook in je ads landt. Meetbaar.",
  },
] as const;

export const HOME_ABOUT_MENEER_STRATEGY_OUTCOME = {
  eyebrow: "Voorgestelde strategie",
  exampleLabel: "Voorbeeld",
  title: "Influencer + UGC",
  body: "Zo kan een keuze eruitzien na ons gesprek. Geen standaardpakket: bij jou bepalen we wat past. En ja, dit regel ik ook, niet alleen het plan.",
  previewCaption: "Illustratie · één mogelijke mix na intake",
} as const;

export interface AboutMeneerJourneyStep {
  id: string;
  /** Hoofdlabel in badge (bijv. 12, Dag 1, Live) */
  era: string;
  /** Optioneel sublabel onder era (bijv. jaar) */
  eraSub?: string;
  title: string;
  detail: string;
}

export interface AboutMeneerChannelChoice {
  id: string;
  label: string;
  meneer: string;
}

export const HOME_ABOUT_MENEER = {
  eyebrow: "Wie zit er achter dit?",
  title: "Van code schrijven naar bedrijven laten groeien.",
  intro:
    "Ik begon als applicatieontwikkelaar. Inmiddels zit ik al twaalf jaar in webdesign en marketing. Het leukste? Samen met jou uitzoeken wat écht werkt. Geen standaard pakket van de plank. Wel een plan waar we allebei achter staan.",
  journey: [
    {
      id: "dev",
      era: "Dag 1",
      title: "App-developer",
      detail: "Ik wilde alles perfect in code. Typisch.",
    },
    {
      id: "years",
      era: "12",
      eraSub: "jaar",
      title: "Web + marketing",
      detail: "Geleerd wat echt geld oplevert. En wat alleen mooi oogt.",
    },
    {
      id: "now",
      era: "Live",
      title: "Groeipartner",
      detail: "Nu zit ik aan tafel met jou. Welk kanaal, welk platform, welke volgorde?",
    },
  ] as const satisfies readonly AboutMeneerJourneyStep[],
  collabTitle: "Samen beslissen wat past",
  collabBody:
    "Ik kies niet in mijn eentje of Shopify, Google Ads of SEO eerst komt. Jij kent je klant. Ik ken de kanalen. Samen bepalen we wat slim is voor jouw fase.",
  channelHint: "Tik een kanaal. SEO? Landingspagina's op topniveau.",
  channelChoices: [
    {
      id: "shopify",
      label: "Shopify",
      meneer: "Als je verkoopt online en wilt schalen zonder Excel-chaos.",
    },
    {
      id: "seo",
      label: "SEO",
      meneer:
        "Als je gratis organisch verkeer wilt. Landingspagina's die bovenaan scoren. Dat is mijn specialiteit.",
    },
    {
      id: "google",
      label: "Google Ads",
      meneer: "Als mensen al zoeken naar wat jij verkoopt en je site converteert.",
    },
    {
      id: "meta",
      label: "Meta",
      meneer: "Als je product visueel pakkend is en je creative er is.",
    },
    {
      id: "email",
      label: "E-mail",
      meneer: "Als je klanten al koopt en je ze terug wilt laten komen.",
    },
  ] as const satisfies readonly AboutMeneerChannelChoice[],
  quote:
    "Mijn dopamine? Jij met meer klanten en een volle inbox. App je me 'hé, het loopt'? Dan sla ik die harder aan dan mijn ochtendkoffie.",
  ctaLabel: "Meer over Meneer",
  ctaHref: "/over",
} as const;
