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
      detail: "Eerst wilde ik alles perfect in code. Typisch.",
    },
    {
      id: "years",
      era: "12",
      eraSub: "jaar",
      title: "Web + marketing",
      detail: "Geleerd wat online geld oplevert en wat alleen mooi oogt.",
    },
    {
      id: "now",
      era: "Live",
      title: "Groeipartner",
      detail: "Aan tafel: welk kanaal, welk platform, welke volgorde?",
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
  dopamine: {
    label: "Mijn dopamine hit",
    body: "Jouw cijfers omhoog zien gaan. Omzet, leads, ROAS.",
    punchline: "Koffie is fijn. Een mailtje 'het werkt echt' is beter.",
  },
  quote:
    "Ik groei als jij groeit. Geen agency-praat. Wel iemand die meedenkt en doorpakt.",
  ctaLabel: "Meer over Meneer",
  ctaHref: "/over",
} as const;
