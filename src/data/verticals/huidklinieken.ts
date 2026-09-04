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
    title: "Huidkliniek website laten maken | SEO & marketing | Meneer Marketing",
    description:
      "Huidkliniek website laten maken? Site from scratch, Salonized, hosting inbegrepen. Local Growth met huidproblemen-SEO. Growth Partner met Shopify. Clinic Edition vanaf €89/m, launch tijdelijk €0.",
    keywords: [
      "huidkliniek website",
      "huidkliniek website laten maken",
      "cosmetische kliniek marketing",
      "website cosmetische kliniek",
      "lokale seo huidkliniek",
      "google business huidkliniek",
      "salonized koppeling website",
      "shopify kliniek webshop",
      "intake boeken website kliniek",
    ],
  },
  pricing: {
    currency: "EUR",
    minTermMonths: 1,
    termDisclaimer: "Per maand, maandelijks opzegbaar. Prijzen ex. btw.",
    includedInfraNote:
      "Inclusief domeinnaam en hosting (t.w.v. €25 per maand).",
    includedCareNote:
      "Onderhoud, updates en kleine sitewijzigingen zitten in je abonnement. Remote bereikbaar: ik pak je wensen direct op.",
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
        eyebrow: "Instap die voelt als premium",
        tagline: "Je kliniek digitaal. Salonized erop. Eindelijk op niveau.",
        ladderLabel: "Website + Salonized",
        monthly: { amount: 89, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Ik wil Clinic Edition",
        inclusions: [
          "Website live binnen 5 werkdagen",
          "SEO-injectie op huidkliniek [jouw stad]",
          "Website designed around jouw kliniek en branding",
          "Aangepast aan naam, logo en huisstijl",
          "Mobiel geoptimaliseerd (daar boeken de meeste intakes)",
          "Behandelingen, team, tarieven, contact en locatie",
          "Salonized-koppeling (agenda-licentie van Salonized apart)",
          "Intake en consult direct vanaf je site naar je agenda",
          "Technische SEO + schema + tracking-basis",
          "Domeinnaam, hosting, beveiliging en technisch onderhoud",
          "Kleine sitewijzigingen in je abonnement (teksten, tarieven, foto's)",
          "Remote bereikbaar: ik regel je wensen direct",
        ],
      },
      {
        id: "local-growth",
        name: "Local Growth",
        eyebrow: "Meest gekozen",
        tagline:
          "Huidproblemen, apparatuur en behandeling. Landings + SEO die intakes opleveren.",
        ladderLabel: "Website + huidproblemen SEO",
        recommended: true,
        monthly: { amount: 179, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Local Growth is mijn ding",
        inclusions: [
          "Alles uit Clinic Edition (hosting, domein, Salonized, onderhoud)",
          "Landingspagina's per huidprobleem (acne, pigment, roodheid, …)",
          "Elk probleem gekoppeld aan jouw apparatuur en behandeling",
          "SEO op symptoom + behandeling + [jouw stad]",
          "Pagina's voor laser, peelings, injectables waar relevant",
          "Actieve lokale SEO + maandelijkse bijsturing",
          "Google Business Profile-optimalisatie",
          "Keywordstrategie, Search Console en rank tracking",
          "SEO-dashboard / rapportage",
          "Lokale concurrentieanalyse",
          "Maandelijkse rank- en Maps-bijsturing",
          "Stadsexclusiviteit binnen dit programma",
        ],
      },
      {
        id: "growth-partner",
        name: "Growth Partner",
        eyebrow: "Shop, ads, influencers",
        tagline:
          "Huidproblemen-SEO blijft lopen. Shopify shop, Google Ads, Meta Ads en creators erbovenop.",
        ladderLabel: "Complete groei + shop",
        monthly: { amount: 399, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Praat over Growth Partner",
        inclusions: [
          "Alles uit Local Growth (hosting, huidproblemen-landings, SEO)",
          "Shopify shop setup + koppeling aan je site (Shopify-plan apart)",
          "Homecare, serums en retail naast je behandelingen",
          "Productpagina's, collecties en merkstijl in lijn met je kliniek",
          "Koppeling shop → behandeling → Salonized-intake",
          "Google Ads-beheer (advertentiebudget niet inbegrepen)",
          "Meta Ads waar bereik en retargeting het verschil maken",
          "Campagne-landingspagina's die naar shop of intake leiden",
          "Influencer-matches en collabs die bij jouw kliniek passen",
          "Creator-boosts: content die klikt én boekt",
          "Conversion tracking op shop, intake en herhaalafspraak",
          "Funnel-analyse shop → behandeling + CRO",
          "Retargeting / aanvullende campagnes waar relevant",
          "Maandelijkse groeianalyse",
        ],
      },
    ],
    signatureCustom: {
      name: "Signature Custom",
      heading: "Alles op maat, vanaf nul.",
      lead: "Past je kliniek niet in een vakje? Dan bouw ik site, eigen boekingssysteem en flows from scratch. Jouw proces, jouw UX. Hosting en beheer regel je daarna zelf of los bij me.",
      fromPrice: {
        amount: 2950,
        unit: "eur",
        cadence: "one_time",
        prefix: "Vanaf",
      },
      bullets: [
        "Eigen boekingssysteem from scratch",
        "Volledig unieke art direction",
        "Custom UX en componentarchitectuur",
        "Shop, portaal of CRM-koppeling waar nodig",
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
      title: "Salonized of bestaand systeem",
      lead: "Voor Clinic Edition en Local Growth koppel ik je site aan Salonized, Treatwell of wat jij al gebruikt. Intake blijft in je vertrouwde agenda.",
      bullets: [
        "Salonized, Treatwell of vergelijkbaar",
        "Intake en consult vanaf je site",
        "Standaard in Clinic Edition en Local Growth",
      ],
      providerExample: "Salonized",
    },
    {
      id: "branded-app",
      title: "Branded kliniek-app",
      lead: "Salonized (of vergelijkbaar) met jouw logo en huisstijl. Professioneel, zonder custom-app-prijskaartje.",
      bullets: [
        "App met jouw logo en huisstijl",
        "Agenda, boeken, herinneringen",
        "Klantbeheer waar de provider dat biedt",
        "Integratie met de website",
      ],
      priceNote:
        "Meneer Marketing setup vanaf €395 eenmalig. Softwarelicentie van de provider apart.",
      providerExample: "Salonized",
    },
    {
      id: "custom",
      title: "Signature · eigen boekingssysteem",
      lead: "Alleen bij Signature Custom: ik bouw je booking funnel from scratch. Voor klinieken met eigen proces, meerdere locaties of bijzondere intake-flows.",
      bullets: [
        "Custom booking funnel from scratch",
        "Eigen regels, eigen stappen, eigen UX",
        "Koppeling met shop, portaal of CRM mogelijk",
        "Scope en prijs op maat in Signature",
      ],
    },
  ],
  bookingProviderNote:
    "Salonized- en Shopify-licenties betaal je rechtstreeks aan de provider. Ik regel de koppeling en setup. Hosting, domein en onderhoud zitten in je abonnement (twv. €25/m).",
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
        "Dan houd je dat. In Clinic Edition en Local Growth koppel ik standaard aan Salonized of wat jij al gebruikt. Intake en consult lopen vanaf je site naar je bestaande agenda.",
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
        "Clinic Edition zet site + Salonized + basis op huidkliniek [jouw stad]. Local Growth voegt huidproblemen-landings toe: acne, pigment, roodheid gekoppeld aan jouw apparatuur, met SEO per probleem. Growth Partner voegt daar een Shopify shop voor homecare en Google Ads, Meta Ads en creators bovenop; mediabudget blijft apart.",
    },
    {
      question: "Wat zijn die huidproblemen-landings precies?",
      answer:
        "Pagina's per klacht of huidprobleem die mensen echt zoeken. Acne, donkere kringen, roodheid, pigment. Elke pagina koppelt het probleem aan jouw behandeling en apparatuur, met lokale SEO. Zo land je op intentie, niet alleen op huidkliniek [stad].",
    },
    {
      question: "Zit een webshop in Growth Partner?",
      answer:
        "Ja. Ik bouw en koppel een Shopify shop aan je site: homecare, serums, retail naast je behandelingen. Producten, collecties en checkout in lijn met je kliniek. Advertentiebudget voor Google en Meta blijft apart.",
    },
    {
      question: "Zit hosting en domein in het abonnement?",
      answer:
        "Ja. Domeinnaam, hosting, beveiliging en technisch onderhoud zitten in Clinic Edition en blijven in Local Growth en Growth Partner. Dat is twv. €25 per maand, inbegrepen in je maandbedrag. Kleine sitewijzigingen ook.",
    },
    {
      question: "Wanneer kies ik Signature Custom?",
      answer:
        "Als Salonized of standaard koppelingen niet passen. Dan bouw ik site én eigen boekingssysteem from scratch. Multi-locatie, eigen intake-flow of shop op maat. SEO en Growth kun je daarna los bij me regelen.",
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
      body: "Salonized-koppeling, lokale structuur scherp, knop naar afspraak die klopt.",
    },
    {
      title: "Live in circa 5 werkdagen",
      body: "Clinic Edition online met SEO-injectie op huidkliniek [jouw stad].",
    },
    {
      title: "Groeien op jouw tempo",
      body: "Local Growth voor huidproblemen-landings en Maps. Growth Partner plus Shopify, Google Ads, Meta Ads en creators.",
    },
  ],
  localSeoExamples: {
    queries: [
      "huidkliniek Utrecht",
      "donkere kringen behandeling Utrecht",
      "acne behandeling Utrecht",
      "laser huidverbetering Utrecht",
    ],
    pages: [
      "Homepage",
      "Huidkliniek [stad]",
      "Donkere kringen",
      "Acne & huidproblemen",
      "Apparatuur & behandeling",
      "Intake / consult",
      "Shop homecare",
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
    href: "/pilates-studios",
    label: "Pilates studio's",
    hint: "Zelfde Local Growth Engine, andere branche",
  },
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
