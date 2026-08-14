import type { VerticalLandingConfig } from "@/data/verticals/types";

/**
 * Centrale config voor /huidklinieken.
 * Local Growth Engine vertical #2 (na Pilates). Templates volgen; demoHref is placeholder.
 */
export const HUIDKLINIEKEN_VERTICAL: VerticalLandingConfig = {
  slug: "huidklinieken",
  path: "/huidklinieken",
  verticalName: "Huidkliniek",
  verticalNamePlural: "Huidklinieken",
  themeAccent: "#FF5722",
  seo: {
    title: "Huidkliniek online: site, Maps & intake | Meneer Marketing",
    description:
      "Custom website voor je huidkliniek, lokale SEO en een pad van Google naar intake. Clinic Edition vanaf €89/m, launch tijdelijk €0. Eén partner per stad.",
    keywords: [
      "huidkliniek website",
      "cosmetische kliniek marketing",
      "lokale seo huidkliniek",
      "google business huidkliniek",
      "website cosmetische kliniek",
      "intake boeken website kliniek",
    ],
  },
  pricing: {
    currency: "EUR",
    minTermMonths: 1,
    termDisclaimer: "Per maand, maandelijks opzegbaar.",
    launchPromo: {
      active: true,
      current: { amount: 0, unit: "eur", cadence: "one_time" },
      was: { amount: 295, unit: "eur", cadence: "one_time" },
      badge: "Tijdelijk €0 launch",
      note: "Normaal €295 eenmalige launch. Nu tijdelijk gratis bij start.",
    },
    packages: [
      {
        id: "studio-edition",
        name: "Clinic Edition",
        eyebrow: "Digitale voordeur",
        tagline: "De digitale voordeur van je kliniek. Rustig, helder, klaar om te boeken.",
        ladderLabel: "Kliniek-site",
        monthly: { amount: 89, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Ik wil Clinic Edition",
        inclusions: [
          "Website live binnen 5 werkdagen",
          "SEO-injectie op huidkliniek [jouw stad]",
          "Eén van de high-end Clinic Editions",
          "Aangepast aan naam, logo en huisstijl",
          "Mobiel geoptimaliseerd (daar boeken de meeste intakes)",
          "Behandelingen, team, tarieven, contact en locatie",
          "Afspraakkoppeling met bestaand systeem (waar technisch redelijk)",
          "Technische SEO + schema + tracking-basis",
          "Hosting, onderhoud, beveiliging en kleine wijzigingen",
        ],
      },
      {
        id: "local-growth",
        name: "Local Growth",
        eyebrow: "Maps & stad",
        tagline:
          "Zichtbaar op huidkliniek + stad, behandelingen en Maps. Elke maand bijgestuurd.",
        ladderLabel: "Site + lokale vindbaarheid",
        recommended: true,
        monthly: { amount: 179, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Local Growth is mijn ding",
        inclusions: [
          "Alles uit Clinic Edition",
          "Meerdere landingspagina's (behandelingen, huidverbetering, …)",
          "SEO op bredere lokale zoektermen, niet alleen huidkliniek [stad]",
          "Actieve lokale SEO + maandelijkse bijsturing",
          "Google Business Profile-optimalisatie",
          "Keywordstrategie, Search Console en rank tracking",
          "SEO-dashboard / rapportage",
          "Lokale concurrentieanalyse",
          "Stadsexclusiviteit binnen dit programma",
        ],
      },
      {
        id: "growth-partner",
        name: "Growth Partner",
        eyebrow: "Agenda vullen",
        tagline:
          "Organisch blijft lopen. Google Ads, Meta Ads en creators vullen de agenda sneller.",
        ladderLabel: "Vindbaarheid + ads",
        monthly: { amount: 399, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Praat over Growth Partner",
        inclusions: [
          "Alles uit Local Growth",
          "Google Ads-beheer (advertentiebudget niet inbegrepen)",
          "Meta Ads waar bereik en retargeting het verschil maken",
          "Campagne-landingspagina's die direct naar intake leiden",
          "Influencer-matches en collabs die bij jouw kliniek passen",
          "Creator-boosts: content die klikt én boekt",
          "Conversion tracking op intake en herhaalafspraak",
          "Advertenties gekoppeld aan relevante behandelingen",
          "Booking funnel-analyse + CRO",
          "Retargeting / aanvullende campagnes waar relevant",
          "Maandelijkse groeianalyse",
        ],
      },
    ],
    signatureCustom: {
      name: "Signature Custom",
      heading: "Alles op maat, vanaf nul.",
      lead: "Past je kliniek niet in een vakje? Dan bouw ik een complete from-scratch site. Eigen art direction, UX en architectuur.",
      fromPrice: {
        amount: 2950,
        unit: "eur",
        cadence: "one_time",
        prefix: "Vanaf",
      },
      bullets: [
        "Volledig unieke art direction",
        "Custom UX en componentarchitectuur",
        "Bijzondere koppelingen en funnels",
        "Multi-location en complexe klinieken",
        "SEO en Growth daarna optioneel erbij",
      ],
      ctaLabel: "Bespreek Signature Custom",
    },
  },
  demo: {
    primaryHref: "#live-design",
    primaryLabel: "Bekijk de kliniek-richtingen",
  },
  artDirections: [
    {
      id: "editorial",
      name: "Clinical Editorial",
      blurb:
        "Magazine-strak. Typografie met punch, behandelingen als editorial spreads.",
      demoHref: "#aanvraag",
      ready: false,
      shortLabel: "1",
    },
    {
      id: "reformer-minimal",
      name: "Soft Clinical",
      blurb:
        "Warm licht, zachte materialen, rust zonder soft-focus fluff.",
      demoHref: "#aanvraag",
      ready: false,
      shortLabel: "2",
    },
    {
      id: "soft-movement",
      name: "Precision Dark",
      blurb:
        "Donkere precisie. High-end cosmetische kliniek, scherp en rustig.",
      demoHref: "#aanvraag",
      ready: false,
      shortLabel: "3",
    },
  ],
  bookingRoutes: [
    {
      id: "existing",
      title: "Bestaand systeem koppelen",
      lead: "Heb je al een agenda of patiëntensysteem dat werkt? Mooi. Dan koppel ik intake, consult en herhaalafspraken netjes aan de nieuwe site.",
      bullets: [
        "Intake en consult",
        "Herhaalafspraken",
        "Zit in Clinic Edition waar technisch redelijk",
      ],
    },
    {
      id: "branded-app",
      title: "Branded kliniek-app",
      lead: "Een professionele route via geschikte kliniek-software. Jouw logo, jouw huisstijl, zonder custom-app-prijskaartje.",
      bullets: [
        "App met jouw logo en huisstijl",
        "Agenda, boeken, herinneringen",
        "Klantbeheer waar de provider dat biedt",
        "Integratie met de website",
      ],
      priceNote:
        "Meneer Marketing setup vanaf €395 eenmalig. Softwarelicentie van de provider apart.",
    },
    {
      id: "custom",
      title: "Volledig maatwerk",
      lead: "Voor klinieken met bijzondere processen: custom funnel, portaal of app. Alleen als de scope dat echt vraagt.",
      bullets: [
        "Custom booking funnel vanaf €750",
        "Custom app / klantomgeving vanaf €4.950 of op aanvraag",
        "Alleen wanneer scope dat echt vraagt",
      ],
    },
  ],
  bookingProviderNote:
    "Externe softwareprijzen hardcode ik bewust niet. Die wijzigen. Ik kies wat bij budget en kliniek past, niet automatisch het duurste.",
  flowPhases: [
    {
      id: "found",
      title: "Gevonden",
      body: "Lokale zoekvraag, Maps en structuur die jouw kliniek tonen.",
      detail: "Local SEO, Google Business Profile, intentie rond behandelingen.",
    },
    {
      id: "trust",
      title: "Vertrouwen",
      body: "Site die behandelingen, team en tarieven in één scroll helder maakt.",
      detail: "Art direction, bewijs, rust en precisie op kliniekniveau.",
    },
    {
      id: "book",
      title: "Afspraak",
      body: "Klik wordt een intake of consult in je agenda.",
      detail: "Afspraakflow die past bij jouw systeem of app.",
    },
    {
      id: "return",
      title: "Terugkeer",
      body: "Reminder, nazorgpad en herhaalbezoek blijven in het systeem.",
      detail: "Digitaal pad dat blijft werken na de eerste afspraak.",
    },
  ],
  exclusivity: {
    headline: "Jouw stad. Jouw kliniek. Niet die van de concurrent.",
    lead: "Eén huidkliniek-partner per stad binnen dit programma.",
    body: "Als ik jouw lokale vindbaarheid en Maps-positie bouw, help ik niet tegelijk de kliniek om de hoek om dezelfde zoekvraag te pakken. Dat blijft zo zolang de exclusieve samenwerking actief is.",
    cities: [],
  },
  caseStudy: {
    enabled: false,
    client: "",
    city: "",
    href: "/huidklinieken",
    websiteUrl: "https://meneermarketing.nl/huidklinieken",
    imageSrc: "/cases/hills-pilates-hero.png",
    imageAlt: "",
    eyebrow: "",
    title: "",
    lead: "",
    facets: [],
  },
  faq: [
    {
      question:
        "Past dit bij een cosmetische kliniek, of alleen bij “huidkliniek” in de naam?",
      answer:
        "Beide. Ik richt structuur en zoektermen op hoe mensen in jouw stad zoeken: klinieknaam, behandelingen, Maps. De site volgt jouw merkstijl en agenda, niet een generiek schoonheidssjabloon.",
    },
    {
      question: "Wat als we al een agenda of patiëntensysteem hebben?",
      answer:
        "Dan houd je dat. Waar het technisch redelijk is, koppel ik de site aan intake, consult en herhaalafspraak. Zo blijft de boeking in jullie bestaande flow.",
    },
    {
      question: "Schrijf jij teksten die medische claims claimen?",
      answer:
        "Nee. Ik zorg voor vindbaarheid, structuur en een pad naar afspraak. Wat je wél mag zeggen over behandelingen bepaal jij met je eigen kaders. Ik duw geen beloftes in je copy die niet bij een kliniek horen.",
    },
    {
      question: "Hoe snel staat Clinic Edition live?",
      answer:
        "Ik mik op circa 5 werkdagen zodra logo, behandelaanbod en de nodige assets binnen zijn. Launch is tijdelijk €0; daarna geldt het maandbedrag per maand.",
    },
    {
      question: "Wat betekent één partner per stad concreet?",
      answer:
        "Binnen dit programma werk ik met maximaal één actieve huidkliniek-partner per stad. Jouw lokale SEO bouw ik niet tegelijk voor de concurrent om de hoek.",
    },
    {
      question: "Is het maandelijks opzegbaar?",
      answer:
        "Ja. Clinic Edition, Local Growth en Growth Partner betaal je per maand. Opzeggen kan maandelijks via mij, zonder lang contract.",
    },
    {
      question:
        "Wanneer kies ik Local Growth of Growth Partner in plaats van alleen Clinic Edition?",
      answer:
        "Clinic Edition zet site + basisinjectie op huidkliniek [jouw stad]. Local Growth trekt bredere lokale zoektermen, Maps en maandelijkse sturing. Growth Partner voegt Google Ads, Meta Ads en creator-werk toe; mediabudget blijft apart.",
    },
  ],
  howItWorks: [
    {
      title: "Ik loop je kliniek digitaal na",
      body: "Behandelingen, agenda, Google Business Profile, merkstijl. Kort en concreet.",
    },
    {
      title: "Richting kiezen",
      body: "Clinical Editorial, Soft Clinical of Precision Dark. Of Signature Custom als je volledig uniek wilt.",
    },
    {
      title: "Site, Maps en intake-route",
      body: "Jouw content erin, lokale structuur scherp, knop naar afspraak die klopt.",
    },
    {
      title: "Live in circa 5 werkdagen",
      body: "Clinic Edition online met SEO-injectie op huidkliniek [jouw stad].",
    },
    {
      title: "Groeien op jouw tempo",
      body: "Local Growth voor meer zoektermen en Maps. Growth Partner plus Google Ads, Meta Ads en creators.",
    },
  ],
  localSeoExamples: {
    queries: [
      "huidkliniek Utrecht",
      "cosmetische kliniek Utrecht",
      "laserontharing Utrecht",
      "huidverbetering Utrecht",
    ],
    pages: [
      "Homepage",
      "Behandelingen",
      "Huidverbetering",
      "Intake / consult",
      "Prijzen",
      "Team / kliniek",
      "FAQ",
    ],
  },
};

export const HUIDKLINIEKEN_PACKAGE_BY_ID = Object.fromEntries(
  HUIDKLINIEKEN_VERTICAL.pricing.packages.map((p) => [p.id, p]),
) as Record<
  (typeof HUIDKLINIEKEN_VERTICAL.pricing.packages)[number]["id"],
  (typeof HUIDKLINIEKEN_VERTICAL.pricing.packages)[number]
>;

export const HUIDKLINIEKEN_RELATED_LINKS = [
  {
    href: "/diensten/local-seo",
    label: "Lokale SEO",
    hint: "Stad, Maps, Google Business",
  },
  {
    href: "/bouwen",
    label: "Websites from scratch",
    hint: "Custom build voor merken die serieus zijn",
  },
  {
    href: "/diensten/webdesign",
    label: "Webdesign",
    hint: "Design dat rust en precisie uitstraalt",
  },
  {
    href: "/vindbaarheid",
    label: "SEO & vindbaarheid",
    hint: "Google + AI-antwoorden",
  },
  {
    href: "/campagnes",
    label: "Google Ads & campagnes",
    hint: "Ads die naar de intake leiden",
  },
  {
    href: "/diensten/google-ads",
    label: "Google Ads",
    hint: "Search die afspraken oplevert",
  },
  {
    href: "/contact",
    label: "Contact",
    hint: "Bel, mail of WhatsApp",
  },
] as const;
