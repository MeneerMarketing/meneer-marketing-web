export interface GoogleExpertEra {
  id: string;
  label: string;
  year: string;
  headline: string;
  meneer: string;
  /** SERP-positie in de demo (1 = best). */
  rank: number;
  searchSnippet: string;
}

export const HOME_MOBILE_GOOGLE_EXPERT = {
  statLabel: "Google-updates overleefd",
  statValue: "47+",
  statSub: "en nog steeds vrienden met de zoekbalk",
  searchQuery: "beste [jouw dienst] nederland",
  competitorSnippet: "Generieke pagina · template · pagina 2 vibes",
} as const;

export const HOME_MOBILE_GOOGLE_ERAS: readonly GoogleExpertEra[] = [
  {
    id: "early",
    label: "Vroeger",
    year: "2014",
    headline: "Keywords in elke zin. Twee keer. Drie keer.",
    meneer:
      "Ik zag sites met witte tekst vol zoekwoorden. Google zag het ook. Spoiler: dat werkte niet meer.",
    rank: 9,
    searchSnippet: "Jouw merk · Nog niet zichtbaar in de top",
  },
  {
    id: "mobile",
    label: "Mobiel",
    year: "2018",
    headline: "Mobile-first. Je desktop was een museumstuk.",
    meneer:
      "Mooie site op 27 inch. Op je telefoon? Scrollen, wachten, weg. Ik fixte dat voor klanten die wel wilden ranken.",
    rank: 5,
    searchSnippet: "Jouw merk · Pagina 1 randje, bijna zichtbaar",
  },
  {
    id: "content",
    label: "Content",
    year: "2022",
    headline: "Helpful content. Geen AI-prutswerk.",
    meneer:
      "Iedereen plakte ChatGPT-tekst op hun blog. Google wilde antwoorden die echt helpen. Dat bouw ik: pagina's die ranken én converteren.",
    rank: 2,
    searchSnippet: "Jouw merk · Expert in [jouw dienst] · Sterke landingspagina",
  },
  {
    id: "now",
    label: "Nu",
    year: "12+ jr",
    headline: "Positie 1. Organisch. Gratis kliks.",
    meneer:
      "Ads stoppen als je budget stopt. Een pagina op #1 levert gewoon door. SkinComplete deed dit eerst organisch, daarna pas ads.",
    rank: 1,
    searchSnippet: "Jouw merk · Expert in [jouw dienst] · Geciteerd door Google",
  },
] as const;
