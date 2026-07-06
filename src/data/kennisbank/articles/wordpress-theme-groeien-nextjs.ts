import type { KennisbankArticle } from "@/data/kennisbank/types";

export const WORDPRESS_THEME_GROEIEN_NEXTJS: KennisbankArticle = {
  slug: "wordpress-theme-groeien-nextjs",
  title: "Uit je WordPress-theme gegroeid? Dan knijpt het theme terug",
  description:
    "Wanneer WordPress genoeg is en wanneer custom build in Next.js logischer is voor snelheid, SEO en campagnes.",
  publishedAt: "2026-07-06",
  readMinutes: 8,
  category: "bouwen",
  keywords: [
    "wordpress website traag",
    "website from scratch vs wordpress",
    "migratie wordpress nextjs",
    "custom website laten maken",
  ],
  dienstSlugs: ["webdevelopment", "optimalisatie", "seo"],
  sections: [
    {
      type: "p",
      text: "Je theme was perfect voor jaar één. Logo erop, pagina's live, blogje erbij. Nu wil je landings per campagne, snelheid onder twee seconden, geen plugin die elk jaar instort als WordPress update. Het theme zegt: 'Ik ben gebouwd voor blogs en kleine sites.' Jij zegt: 'Ik wil schalen.' Iemand liegt. Hint: niet jij.",
    },
    {
      type: "callout",
      text: "Kort antwoord: blijf op WordPress als het werkt en je scope klein blijft. Overweeg custom build als snelheid, SEO, campagnes en eigen uitbreidingen je theme constant tegenwerken.",
    },
    {
      type: "h2",
      text: "Tekenen dat je bent uitgegroeid",
    },
    {
      type: "ul",
      items: [
        "Elke campagne vraagt om landings die je theme niet netjes kan zonder hacks.",
        "PageSpeed rood ondanks 'optimalisatie plugin'.",
        "Developer durft niet meer te updaten uit angst voor breuk.",
        "Je betaalt voor ads op een site die op mobiel traag is.",
        "SEO-content moet op plekken waar het theme structuur blokkeert.",
      ],
    },
    {
      type: "h2",
      text: "WordPress is geen vijand",
    },
    {
      type: "p",
      text: "Ik promoot WordPress niet als eindstation voor serieuze groei, maar migratie is een project. Soms is WordPress nog steeds goedkoper dan herbouwen. Soms is het duurder omdat je elk jaar plugins, fixes en hacks betaalt. Tel dev-tijd mee, niet alleen hosting.",
    },
    {
      type: "h2",
      text: "Waarom Next.js from scratch",
    },
    {
      type: "p",
      text: "Next.js geeft controle over performance, routing, landings, schema markup en campagnes. Geen theme-limiet. Geen plugin die JS toevoegt omdat iemand een sterretje wilde. Custom build is geen buzzword bij mij. Het is letterlijk wat je krijgt.",
    },
    {
      type: "ul",
      items: [
        "Semantische HTML en Core Web Vitals ingebakken.",
        "Landings per dienst, product, regio zonder template-gymnastiek.",
        "Marketing en dev spreken dezelfde taal: pagina's die converteren én ranken.",
      ],
    },
    {
      type: "h2",
      text: "Migratie zonder SEO-zelfmoord",
    },
    {
      type: "p",
      text: "Redirects zijn saai en cruciaal. Import-knop plus hopen is geen strategie. Google is chagrijnig bij verhuizing. Eerlijk zijn over een dip, redirects goed doen, sitemap updaten, Search Console monitoren.",
    },
    {
      type: "callout",
      text: "Templates zijn een start. Geen eindstation voor een bedrijf dat ads wil opschalen.",
    },
    {
      type: "p",
      text: "Als je theme je remt, is het theme niet gratis geweest. Het was uitstel met maandelijkse rente.",
    },
  ],
};
