/**
 * Extra content voor dienstpagina's met de premium opmaak.
 * Alleen slugs met een entry hier krijgen de premium view;
 * de rest valt terug op de standaard dienstpagina.
 */

export interface DienstPremiumContent {
  /** Korte onderregel met punch in de hero */
  heroKicker: string;
  /** Onverwacht feitje of harde waarheid als pull-quote */
  funFact: string;
  funFactSource: string;
  approachSteps: { title: string; body: string }[];
  tickerItems: string[];
  heroStats: { label: string; value: string }[];
}

const PREMIUM: Record<string, DienstPremiumContent> = {
  webdevelopment: {
    heroKicker:
      "Geen template dat op duizend andere sites lijkt. Een website die vanaf regel één voor jouw bedrijf is gebouwd. Snel, veilig en klaar om te groeien.",
    funFact:
      "Een bezoeker oordeelt in ongeveer een halve seconde over je website. Nog voor er één woord is gelezen.",
    funFactSource: "Daarom bouwen we niks half",
    approachSteps: [
      {
        title: "Eerst begrijpen, dan bouwen",
        body: "We beginnen niet in de code maar bij jouw bedrijf: wie is je klant, wat moet de site opleveren en welke systemen moeten meepraten?",
      },
      {
        title: "Structuur en ontwerp",
        body: "De blauwdruk komt vóór de pixels: informatiestructuur, wireframes en een design dat bij jouw merk past. Jij kijkt mee op elk moment dat het ertoe doet.",
      },
      {
        title: "Bouwen from scratch",
        body: "Elke regel code schrijven we zelf. Geen pagebuilder-ballast, geen plugins die elkaar bijten. Wel een site die laadt voor je er erg in hebt.",
      },
      {
        title: "Live en verder",
        body: "Na de lancering krijg je documentatie, een korte uitleg en een site die je zelf kunt beheren. Wij blijven beschikbaar, maar je zit nergens aan vast.",
      },
    ],
    tickerItems: [
      "From scratch",
      "Geen templates",
      "Core Web Vitals",
      "Next.js",
      "SEO-klaar",
      "Zelf te beheren",
      "Veilig gebouwd",
    ],
    heroStats: [
      { label: "Aanpak", value: "From scratch · custom" },
      { label: "Snelheid", value: "Core Web Vitals groen" },
      { label: "Beheer", value: "Zelf content aanpassen" },
    ],
  },
};

export function getDienstPremium(slug: string): DienstPremiumContent | null {
  return PREMIUM[slug] ?? null;
}
