import type { KennisbankArticle } from "@/data/kennisbank/types";

export const WORDPRESS_THEME_GROEIEN_NEXTJS: KennisbankArticle = {
  slug: "wordpress-theme-groeien-nextjs",
  title: "Uit je WordPress-theme gegroeid? Dan knijpt het theme terug",
  description:
    "Wanneer WordPress genoeg is en wanneer custom build in Next.js logischer is voor snelheid, SEO en campagnes.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 15,
  category: "bouwen",
  keywords: [
    "wordpress website traag",
    "website from scratch vs wordpress",
    "migratie wordpress nextjs",
    "custom website laten maken",
  ],
  dienstSlugs: ["webdevelopment", "optimalisatie", "seo"],
  faqs: [
    {
      question: "Wanneer is migratie van WordPress naar Next.js de moeite waard?",
      answer:
        "Als landings, snelheid, SEO-structuur of ads je theme constant tegenwerken, en je elke update vreest. Kleine site met weinig campagnes mag op WordPress blijven als het écht werkt.",
    },
    {
      question: "Verlies ik SEO bij een migratie?",
      answer:
        "Alleen als redirects, canonicals en URL-planning rommelig zijn. 301 per belangrijke URL, sitemap updaten, Search Console monitoren. Een dip kan kort. Chaos in redirects is structureel.",
    },
    {
      question: "Shopify of Next.js als ik een webshop heb?",
      answer:
        "Catalogus + checkout: Shopify is vaak slimmer. Content-, lead- of marketingmachine met strakke landings: Next.js from scratch. Keuze volgt wat je verkoopt, niet wat hip klinkt.",
    },
    {
      question: "Kan ik WordPress behouden en alleen landings custom bouwen?",
      answer:
        "Soms als hybride. Vaak wordt het twee systemen onderhouden. Als ads serieus zijn, is één snelle stack meestal goedkoper dan eindeloze theme-hacks.",
    },
    {
      question: "Hoe lang duurt een migratie?",
      answer:
        "Afhankelijk van pagina's, content en integraties. Tel redirects en content-inventaris mee, niet alleen 'nieuwe site live'. Haast zonder URL-plan is SEO-zelfmoord.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je theme was perfect voor jaar één. Logo erop, pagina's live, blogje erbij. Nu wil je landings per campagne, snelheid onder twee seconden, geen plugin die elk jaar instort als WordPress update. Het theme zegt: ik ben gebouwd voor blogs en kleine sites. Jij zegt: ik wil schalen. Iemand liegt. Hint: niet jij.",
    },
    {
      type: "callout",
      text: "Kort antwoord: blijf op WordPress als het werkt en je scope klein blijft. Overweeg custom build als snelheid, SEO, campagnes en eigen uitbreidingen je theme constant tegenwerken.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Theme-check",
      title: "Theme-knijpt-meter",
      intro:
        "Vink aan wat klopt. Hoe hoger, hoe harder je WordPress-theme terugknijpt terwijl jij wilt schalen.",
      storageKey: "mm-wp-knijpt",
      eventName: "wp_knijpt_complete",
      sharePath: "/kennisbank/wordpress-theme-groeien-nextjs",
      scoreNoun: "knijp",
      ctaHref: "/diensten/webdevelopment",
      ctaLabel: "Websites from scratch",
      checks: [
        {
          id: "landings",
          label: "Elke campagne vraagt landings die alleen met hacks lukken",
          fix: "Custom landings of migratie. Theme is geen ads-stack.",
        },
        {
          id: "psi",
          label: "PageSpeed rood ondanks optimalisatie-plugin",
          fix: "Plugin-pleisters lossen theme-schuld niet op. Meet Core Web Vitals.",
        },
        {
          id: "update",
          label: "Niemand durft WordPress of plugins te updaten",
          fix: "Angst is een signaal. Staging + migratieplan, of blijf bewust klein.",
        },
        {
          id: "ads",
          label: "Je betaalt ads naar een site die op mobiel traag is",
          fix: "CPA-hygiëne eerst. Snelle stack voor geld-pagina's.",
        },
        {
          id: "seo",
          label: "SEO-structuur botst met wat het theme toelaat",
          fix: "URL's, schema, snelle templates. From scratch als theme blijft blokkeren.",
        },
        {
          id: "builder",
          label: "Page builder + twintig plugins is 'het systeem'",
          fix: "Minder glue, meer eigen code waar het telt.",
        },
        {
          id: "hybride",
          label: "Je onderhoudt al twee stacks 'even tussendoor'",
          fix: "Kies één pad. Hybride zonder eigenaar is dubbel werk.",
        },
        {
          id: "scope",
          label: "Scope is groot (campagnes, SEO, leads) maar stack is blog-theme",
          fix: "WordPress mag blijven bij kleine scope. Schalen vraagt andere lat.",
        },
      ],
      tiers: [
        {
          id: "fit",
          min: 0,
          max: 24,
          label: "Theme past nog",
          quip: "Blijf. Optimaliseer. Migratie is geen statussymbool.",
        },
        {
          id: "wrang",
          min: 25,
          max: 49,
          label: "Wrang maar werkbaar",
          quip: "Eén geld-pagina hard maken. Meet of migratie de CPA waard is.",
        },
        {
          id: "knijpt",
          min: 50,
          max: 74,
          label: "Theme knijpt",
          quip: "Campagnes en SEO betalen de prijs. Plan redirects en custom build.",
        },
        {
          id: "breuk",
          min: 75,
          max: 100,
          label: "Update-angst",
          quip: "Je site is een museumstuk met ads. Migratie vóór de volgende crash.",
        },
      ],
    },
    {
      type: "h2",
      text: "Tekenen dat je bent uitgegroeid",
    },
    {
      type: "ul",
      items: [
        "Elke campagne vraagt om landings die je theme niet netjes kan zonder hacks.",
        "PageSpeed rood ondanks optimalisatie-plugin.",
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
      type: "p",
      text: "Voor een lokale dienstverlener met vijf pagina's en weinig ads kan WordPress prima. Voor een bedrijf dat landings, A/B, schema en Core Web Vitals serieus neemt, knijpt een theme vaak eerder dan je denkt.",
    },
    {
      type: "h2",
      text: "Waarom Next.js from scratch",
    },
    {
      type: "p",
      text: "Next.js geeft controle over performance, routing, landings, schema markup en campagnes. Theme-limiet? Die is er niet. Plugin die JS toevoegt omdat iemand een sterretje wilde? Die bouw je niet in. Custom build is geen buzzword bij mij. Het is letterlijk wat je krijgt.",
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
      text: "Shopify of Next.js?",
    },
    {
      type: "p",
      text: "Webshop met catalogus en checkout? Shopify is vaak slimmer dan WooCommerce of een custom cart. Content- en leadmachine met strakke landings? Next.js from scratch. Ik kies op wat je verkoopt en hoe je groeit, niet op wat hip klinkt.",
    },
    {
      type: "h2",
      text: "Ads, CWV en het theme dat knijpt",
    },
    {
      type: "p",
      text: "Elke trage seconde op mobiel eet conversie. Optimalisatie-plugins stapelen JS tot je site zucht. Custom build in Next.js laat je alleen laden wat de landings nodig heeft. Stacks die ik bouw zijn gemaakt om ads aan te kunnen. Theme-hacks met page builders houden die belofte zelden.",
    },
    {
      type: "h2",
      text: "Migratie zonder SEO-zelfmoord",
    },
    {
      type: "p",
      text: "Redirects zijn saai en cruciaal. Import-knop plus hopen is geen strategie. Google is chagrijnig bij verhuizing. Eerlijk zijn over een dip, redirects goed doen, sitemap updaten, Search Console monitoren. URL-structuur bewust houden waar het kan.",
    },
    {
      type: "ul",
      items: [
        "Inventariseer URL's die verkeer of backlinks hebben.",
        "301 per oude URL naar de juiste nieuwe. Ketens vermijden.",
        "Canonicals en interne links in één keer goed.",
        "Na launch: Search Console, 404's, CWV. Niet pas na een maand.",
      ],
    },
    {
      type: "h2",
      text: "Wat ik in een migratie-intake vraag",
    },
    {
      type: "ul",
      items: [
        "Welke URL's brengen leads of omzet vandaag?",
        "Welke campagnes staan klaar of branden al budget?",
        "Welke integraties (forms, CRM, mail) mogen niet stuk?",
        "Is de pijn theme-techniek of content/strategie?",
      ],
    },
    {
      type: "callout",
      text: "Templates zijn een start. Geen eindstation voor een bedrijf dat ads wil opschalen.",
    },
    {
      type: "p",
      text: "Als je theme je remt, is het theme niet gratis geweest. Het was uitstel met maandelijkse rente. Bouw from scratch als je groei serieus is. Blijf op WordPress als je scope klein blijft en het écht werkt. Ik zeg het eerlijk, ook als dat betekent dat we nog niet migreren.",
    },
  ],
};
