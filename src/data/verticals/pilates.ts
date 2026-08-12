import type { VerticalLandingConfig } from "@/data/verticals/types";

const PREVIEW_BASE = "https://preview.meneermarketing.nl";

/**
 * Centrale config voor /pilates-studios.
 * Pricing, looptijd en demo-URLs hier aanpassen. Niet in componenten hardcoden.
 */
export const PILATES_VERTICAL: VerticalLandingConfig = {
  slug: "pilates-studios",
  path: "/pilates-studios",
  verticalName: "Pilates studio",
  verticalNamePlural: "Pilates studio's",
  themeAccent: "#FF5722",
  seo: {
    title: "Website & SEO voor Pilates studio's | Meneer Marketing",
    description:
      "Pilates studio website laten maken? High-end webdesign, lokale SEO en boekingsflow in één traject. Studio Edition vanaf €89 per maand.",
    keywords: [
      "website pilates studio",
      "webdesign pilates studio",
      "seo pilates studio",
      "marketing pilates studio",
      "pilates studio website laten maken",
      "lokale seo pilates",
    ],
  },
  pricing: {
    currency: "EUR",
    minTermMonths: 12,
    termDisclaimer:
      "Maandbedragen gelden bij een minimale looptijd van 12 maanden.",
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
        name: "Studio Edition",
        eyebrow: "Instap die voelt als premium",
        tagline: "Je studio digitaal. Eindelijk op niveau.",
        ladderLabel: "Website",
        monthly: { amount: 89, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Ik wil Studio Edition",
        inclusions: [
          "Website live binnen 5 werkdagen",
          "SEO-injectie op Pilates [jouw stad]",
          "Eén van de high-end Pilates Studio Editions",
          "Aangepast aan naam, logo en huisstijl",
          "Mobiel geoptimaliseerd (daar gebeurt het echte boeken)",
          "Lessen, trainers, tarieven, contact en locatie",
          "Boekingskoppeling met bestaand systeem (waar technisch redelijk)",
          "Technische SEO + schema + tracking-basis",
          "Hosting, onderhoud, beveiliging en kleine wijzigingen",
        ],
      },
      {
        id: "local-growth",
        name: "Local Growth",
        eyebrow: "Meest gekozen",
        tagline: "Online staan is makkelijk. Lokaal gevonden worden niet.",
        ladderLabel: "Website + vindbaarheid",
        recommended: true,
        monthly: { amount: 179, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Local Growth is mijn ding",
        inclusions: [
          "Alles uit Studio Edition",
          "Meerdere landingspagina's (Reformer, Mat, Private, …)",
          "SEO op bredere lokale zoektermen, niet alleen Pilates [stad]",
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
        eyebrow: "Site, Google, boekingen",
        tagline: "Site, SEO en Google Ads. Jij runt de studio.",
        ladderLabel: "Complete groei",
        monthly: { amount: 399, unit: "eur", cadence: "monthly" },
        setup: { amount: 295, unit: "eur", cadence: "one_time" },
        ctaLabel: "Praat over Growth Partner",
        inclusions: [
          "Alles uit Local Growth",
          "Extra campagne-landingspagina's voor Ads",
          "Google Ads-beheer (advertentiebudget niet inbegrepen)",
          "Conversion tracking",
          "Advertenties gekoppeld aan relevante lessen",
          "Booking funnel-analyse",
          "CRO-optimalisaties",
          "Retargeting / aanvullende campagnes waar relevant",
          "Maandelijkse groeianalyse",
        ],
      },
    ],
    signatureCustom: {
      name: "Signature Custom",
      heading: "Alles op maat, vanaf nul.",
      lead: "Past je studio niet in een vakje? Dan bouw ik een complete from-scratch site. Eigen art direction, UX en architectuur. Zoals Hills Pilates.",
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
        "Multi-location en complexe studio's",
        "SEO en Growth daarna optioneel erbij",
      ],
      ctaLabel: "Bespreek Signature Custom",
    },
  },
  demo: {
    primaryHref: `${PREVIEW_BASE}/studio-forma-arnhem-editorial`,
    primaryLabel: "Bekijk de Pilates website",
  },
  artDirections: [
    {
      id: "editorial",
      name: "Editorial Pilates",
      blurb: "Magazine-achtig. Sterke typografie. Premium rust die blijft hangen.",
      demoHref: `${PREVIEW_BASE}/studio-forma-arnhem-editorial`,
    },
    {
      id: "reformer-minimal",
      name: "Reformer Minimal",
      blurb: "Architecturaal. Reformer-first. Strak genoeg om een interieurmag te zijn.",
      demoHref: `${PREVIEW_BASE}/studio-forma-arnhem-reformer`,
    },
    {
      id: "soft-movement",
      name: "Soft Movement",
      blurb: "Warm, organisch, soft focus. Alsof je al bijna op de mat ligt.",
      demoHref: `${PREVIEW_BASE}/studio-forma-arnhem-soft`,
    },
  ],
  bookingRoutes: [
    {
      id: "existing",
      title: "Bestaande boeking koppelen",
      lead: "Heb je al een systeem dat werkt? Mooi. Dan koppel ik rooster, boeken, proefles en memberships netjes aan de nieuwe site.",
      bullets: [
        "Rooster en lessen",
        "Proefles en memberships",
        "Zit in Studio Edition waar technisch redelijk",
      ],
    },
    {
      id: "branded-app",
      title: "Branded studio app",
      lead: "Een professionele route via geschikte studio-software, bijvoorbeeld Trainin wanneer dat past. Jouw logo, jouw huisstijl, zonder custom-app-prijskaartje.",
      bullets: [
        "App met jouw logo en huisstijl",
        "Lesrooster, boeken, memberships, betalingen",
        "Klantbeheer en pushmeldingen",
        "Integratie met de website",
      ],
      priceNote:
        "Meneer Marketing setup vanaf €395 eenmalig. Softwarelicentie van de provider apart.",
      providerExample: "Trainin",
    },
    {
      id: "custom",
      title: "Volledig maatwerk",
      lead: "Voor studio's met bijzondere processen: custom funnel, portaal of app. Alleen als de scope dat echt vraagt.",
      bullets: [
        "Custom booking funnel vanaf €750",
        "Custom app / klantomgeving vanaf €4.950 of op aanvraag",
        "Alleen wanneer scope dat echt vraagt",
      ],
    },
  ],
  bookingProviderNote:
    "Externe softwareprijzen hardcode ik bewust niet. Die wijzigen. Ik kies wat bij budget en studio past, niet automatisch het duurste.",
  flowPhases: [
    {
      id: "found",
      title: "Gevonden worden",
      body: "Lokale Google-zoekvraag en vindbaarheid.",
      detail:
        "Local SEO, Google Business Profile, structuur rond echte intentie.",
    },
    {
      id: "trust",
      title: "Vertrouwen",
      body: "Website en branding op studioniveau.",
      detail: "Art direction, lessen, trainers, prijzen, bewijs van kwaliteit.",
    },
    {
      id: "book",
      title: "Boeken",
      body: "Van interesse naar rooster.",
      detail: "Boekingsflow die past bij jouw systeem of app.",
    },
    {
      id: "return",
      title: "Terugkomen",
      body: "Lidmaatschap en retentie.",
      detail: "App, memberships, herinneringen. Digitaal pad dat blijft werken.",
    },
  ],
  exclusivity: {
    headline: "Één studio. Één stad. Één aanspreekpunt.",
    lead: "Één Pilates partner per stad. Bewust.",
    body: "Als ik jouw lokale vindbaarheid bouw, help ik niet tegelijk jouw directe Pilates-concurrent om dezelfde Google-positie te pakken. Dat is hoe dit programma werkt zolang de exclusieve samenwerking actief is.",
    cities: [],
  },
  caseStudy: {
    enabled: true,
    client: "Hills Pilates",
    city: "Apeldoorn",
    href: "/cases/hills-pilates",
    websiteUrl: "https://hillsstudio.nl",
    imageSrc: "/cases/hills-pilates-hero.png",
    imageAlt: "Hills Pilates website en boekingservaring",
    eyebrow: "Case · Hills Pilates",
    title: "Website, boekingen en app. Eén lijn.",
    lead: "Voor Hills Pilates in Apeldoorn bouwde ik een custom website from scratch, e-mailflows en een boekingsapp met agenda. Alles gekoppeld, in plaats van losse tools die elkaar negeren.",
    facets: [
      { label: "Website", text: "From scratch, op studioniveau" },
      { label: "Booking", text: "Agenda voor klant én team" },
      { label: "App", text: "Boeken en overzicht op één plek" },
      { label: "Locatie", text: "Apeldoorn" },
    ],
  },
  faq: [
    {
      question: "Is dit een template?",
      answer:
        "Nee. Studio Edition is een gespecialiseerde Pilates-foundation: een design system dat ik aanpas aan jouw studio. ThemeForest en pagebuilders horen hier niet bij. Voor volledige unieke architectuur is er Signature Custom.",
    },
    {
      question: "Kan mijn huidige boekingssysteem blijven?",
      answer:
        "Vaak wel. Heb je al iets dat werkt, dan koppel ik rooster, boeken en memberships aan de nieuwe site wanneer dat technisch redelijk is. Dat zit in Studio Edition.",
    },
    {
      question: "Regel jij Trainin?",
      answer:
        "Trainin is een voorbeeld van geschikte studio-software. Past het functioneel, dan regel ik setup en koppeling. De softwarelicentie loopt via de provider.",
    },
    {
      question: "Krijg ik een eigen app?",
      answer:
        "Alleen als dat past. Soms is koppelen genoeg. Soms is een branded studio-app slim. Maatwerk-app alleen bij bijzondere processen. Ik kies wat je studio nodig heeft, niet wat het hardst klinkt op een offerte.",
    },
    {
      question: "Help je met SEO voor mijn Pilates studio?",
      answer:
        "Ja. Bij Studio Edition injecteer ik SEO al op Pilates [jouw stad], plus technische SEO. Local Growth en Growth Partner pakken meer zoektermen en meerdere landingspagina's, met maandelijkse bijsturing. Dat is waar de meeste studio's landen.",
    },
    {
      question: "Hoe snel staat mijn website live?",
      answer:
        "Bij Studio Edition mik ik op oplevering binnen 5 werkdagen, inclusief SEO-injectie op Pilates [jouw stad]. Content en assets van jouw kant op tijd aanleveren helpt enorm.",
    },
    {
      question: "Kom ik op pagina 1 in Google?",
      answer:
        "Daar is de strategie op gebouwd. Ik weet hoe Google werkt: intentie, structuur, snelheid, content, Maps. Voor de kernzoekterm Pilates [stad] mikken we hard op pagina 1, met serieuze kans op topposities. Local Growth en Growth Partner verbreden dat naar meer zoektermen. Magische garanties zonder werk beloof ik niet. Wel een aanpak die Google beloont.",
    },
    {
      question: "Wat betekent één studio per stad?",
      answer:
        "Binnen dit Pilates-programma werk ik met maximaal één actieve Pilates-partner per stad. Zo help ik niet twee directe concurrenten tegelijk om dezelfde lokale Google-positie.",
    },
    {
      question: "Wat als er al een Meneer Marketing Pilates-klant in mijn stad zit?",
      answer:
        "Dan neem ik binnen dit programma geen tweede directe Pilates-concurrent aan zolang die exclusieve samenwerking actief is. Dat zeg ik vooraf, niet halverwege.",
    },
    {
      question: "Kan ik later upgraden?",
      answer:
        "Ja. Van Studio Edition naar Local Growth of Growth Partner. Signature Custom blijft een apart traject wanneer je volledig from scratch wilt.",
    },
    {
      question: "Kan ik ook alleen een website nemen?",
      answer:
        "Ja. Studio Edition is precies die start: je Pilates-website op de Studio Edition-foundation, plus hosting en onderhoud. Groei er later bij als je klaar bent.",
    },
    {
      question: "Kan ik een volledig custom website krijgen?",
      answer:
        "Ja. Signature Custom, vanaf €2.950 eenmalig. Eigen art direction, UX en architectuur. SEO en Growth kun je daarna aanvullen.",
    },
    {
      question: "Wie beheert de website?",
      answer:
        "Ik. Hosting, onderhoud, beveiliging en kleine wijzigingen zitten in de maandpakketten. Jij hebt één aanspreekpunt. Je mailt mij, niet een ticketwachtrij.",
    },
    {
      question: "Zit advertentiebudget inbegrepen?",
      answer:
        "Nee. Growth Partner bevat Google Ads-beheer. Het mediabudget bij Google betaal je apart. Zo houd je zicht op wat je uitgeeft aan clicks.",
    },
  ],
  howItWorks: [
    {
      title: "Ik bekijk je studio",
      body: "Locatie, lessen, boeking, merkstijl. Kort en concreet. Intake past op één koffie.",
    },
    {
      title: "Art direction kiezen of verfijnen",
      body: "Eén van de Pilates Studio Editions, of Signature Custom als je studio dat vraagt.",
    },
    {
      title: "Branding, lessen en booking",
      body: "Jouw content, huisstijl en boekingsroute erin. Dan voelt het als jouw studio.",
    },
    {
      title: "Website live",
      body: "Binnen 5 werkdagen live. Inclusief SEO-injectie op Pilates [jouw stad].",
    },
    {
      title: "Growth waar je voor kiest",
      body: "Local Growth: meer zoektermen en landingspagina's. Growth Partner: plus Google Ads.",
    },
  ],
  localSeoExamples: {
    queries: [
      "Pilates Arnhem",
      "Reformer Pilates Arnhem",
      "Pilates studio Arnhem",
    ],
    pages: [
      "Homepage",
      "Reformer Pilates",
      "Mat Pilates",
      "Private Pilates",
      "Prijzen",
      "Studio / locatie",
      "FAQ",
    ],
  },
};

export const PILATES_PACKAGE_BY_ID = Object.fromEntries(
  PILATES_VERTICAL.pricing.packages.map((p) => [p.id, p]),
) as Record<
  (typeof PILATES_VERTICAL.pricing.packages)[number]["id"],
  (typeof PILATES_VERTICAL.pricing.packages)[number]
>;

/** Interne links voor discovery en topical authority (niet in footer/nav). */
export const PILATES_RELATED_LINKS = [
  {
    href: "/bouwen",
    label: "Websites from scratch",
    hint: "Custom build, echt vanaf nul",
  },
  {
    href: "/diensten/webdesign",
    label: "Webdesign",
    hint: "Design dat mensen laat boeken",
  },
  {
    href: "/diensten/seo",
    label: "SEO",
    hint: "Technisch + content dat rankt",
  },
  {
    href: "/diensten/local-seo",
    label: "Lokale SEO",
    hint: "Stad, Maps, Google Business",
  },
  {
    href: "/vindbaarheid",
    label: "SEO & vindbaarheid",
    hint: "Google + AI-antwoorden",
  },
  {
    href: "/campagnes",
    label: "Google Ads & campagnes",
    hint: "Ads die naar het rooster leiden",
  },
  {
    href: "/diensten/google-ads",
    label: "Google Ads",
    hint: "Search die boeken oplevert",
  },
  {
    href: "/cases/hills-pilates",
    label: "Case Hills Pilates",
    hint: "Site, app en mail in Apeldoorn",
  },
] as const;
