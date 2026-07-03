export type CaseSceneId = "b2b-portal" | "seo-first" | "bestrest";

export interface HomeCase {
  id: string;
  client: string;
  eyebrow: string;
  title: string;
  metric: string;
  metricHint: string;
  body: string;
  challenge: string;
  move: string;
  result: string;
  tags: readonly string[];
  accent: string;
  scene: CaseSceneId;
  href: string;
}

export const HOME_CASES: HomeCase[] = [
  {
    id: "skincomplete-b2b",
    client: "SkinComplete",
    eyebrow: "Shopify · B2B",
    title: "Een B2B-portal waar salons zelf bestellen",
    metric: "24/7",
    metricHint: "portal open, geen mailtjes meer",
    body: "Salons loggen in, zien hun prijzen en bestellen zelf. Geen heen-en-weer met spreadsheets of losse offertes.",
    challenge: "Orders liepen via mail en Excel. Traag, foutgevoelig en niet schaalbaar.",
    move: "Custom B2B-portal in Shopify met eigen accounts, prijslijsten en checkout op maat.",
    result: "Salons bestellen wanneer het hen uitkomt. Jij hoeft niet meer elke order handmatig te verwerken.",
    tags: ["Shopify B2B", "Custom build", "Portaal"],
    accent: "#00BCD4",
    scene: "b2b-portal",
    href: "/cases",
  },
  {
    id: "skincomplete-seo",
    client: "SkinComplete",
    eyebrow: "SEO · E-mail",
    title: "Eerst organisch scoren, dan pas adverteren",
    metric: "€0",
    metricHint: "advertentiebudget bij de start",
    body: "Eerst SEO en e-mailflows die verkopen. Pas daarna ads op een fundament dat al converteert.",
    challenge: "Veel merken zetten direct budget op ads terwijl de site en content nog niet meewerken.",
    move: "SEO-structuur, content en flows eerst. Ads pas toen organisch verkeer en e-mail al omzet brachten.",
    result: "Advertenties bouwden voort op bestaande winst, niet op hoop en een kale landingspagina.",
    tags: ["SEO eerst", "E-mailflows", "Google Ads later"],
    accent: "#FF5722",
    scene: "seo-first",
    href: "/cases",
  },
  {
    id: "bestrest",
    client: "BestRest",
    eyebrow: "Strategie · E-commerce",
    title: "Matrassen verkopen in een moordende markt",
    metric: "Eigen",
    metricHint: "koers, geen copy-paste strategie",
    body: "Geen schreeuwen tegen miljoenenbudgetten. Wel scherp positioneren op toppers en matrassen met een eigen plan.",
    challenge: "De grote spelers domineren met budget. Me-too marketing werkt niet in deze categorie.",
    move: "Eigen positionering, productfocus en kanalenmix per assortimentsstuk. Geen standaard pakket.",
    result: "Een koers die past bij BestRest: meetbaar, eigen en zonder mee te schreeuwen in de ruis.",
    tags: ["Strategie", "Positionering", "E-commerce"],
    accent: "#45382C",
    scene: "bestrest",
    href: "/cases",
  },
] as const;
