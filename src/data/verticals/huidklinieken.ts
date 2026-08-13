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
    title: "Website & SEO voor huidklinieken | Meneer Marketing",
    description:
      "Huidkliniek website laten maken? Custom build, lokale SEO en afspraakflow in één traject. Clinic Edition vanaf €89 per maand.",
    keywords: [
      "website huidkliniek",
      "webdesign huidkliniek",
      "seo huidkliniek",
      "marketing huidkliniek",
      "huidkliniek website laten maken",
      "lokale seo cosmetische kliniek",
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
        name: "Clinic Edition",
        eyebrow: "Instap die voelt als premium",
        tagline: "Je kliniek digitaal. Eindelijk op niveau.",
        ladderLabel: "Website",
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
        eyebrow: "Meest gekozen",
        tagline: "Online staan is makkelijk. Lokaal gevonden worden niet.",
        ladderLabel: "Website + vindbaarheid",
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
        eyebrow: "Site, ads, influencers",
        tagline:
          "SEO, Google Ads, Meta Ads en creators. Jij runt de kliniek.",
        ladderLabel: "Complete groei",
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
    headline: "Eén kliniek. Eén stad. Eén aanspreekpunt.",
    lead: "Eén huidkliniek-partner per stad. Bewust.",
    body: "Als ik jouw lokale vindbaarheid bouw, help ik niet tegelijk jouw directe concurrent om dezelfde Google-positie te pakken. Dat is hoe dit programma werkt zolang de exclusieve samenwerking actief is.",
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
      question: "Is dit een template?",
      answer:
        "Clinic Edition is een gespecialiseerde kliniek-foundation die ik aanpas aan jouw merk. Pagebuilders horen hier niet bij. Voor volledige unieke architectuur is er Signature Custom.",
    },
    {
      question: "Kan mijn huidige agendasysteem blijven?",
      answer:
        "Vaak wel. Werkt je huidige systeem, dan koppel ik intake, consult en herhaalafspraken aan de nieuwe site wanneer dat technisch redelijk is. Dat zit in Clinic Edition.",
    },
    {
      question: "Help je met lokale SEO voor mijn huidkliniek?",
      answer:
        "Ja. Bij Clinic Edition injecteer ik SEO al op huidkliniek [jouw stad], plus technische SEO. Local Growth en Growth Partner pakken bredere zoektermen, Maps en maandelijkse bijsturing.",
    },
    {
      question: "Hoe snel staat mijn website live?",
      answer:
        "Bij Clinic Edition mik ik op oplevering binnen circa 5 werkdagen. Content en assets van jouw kant op tijd aanleveren helpt enorm.",
    },
    {
      question: "Wat betekent één partner per stad?",
      answer:
        "Binnen dit huidklinieken-programma werk ik met maximaal één actieve kliniek-partner per stad. Zo help ik niet twee directe concurrenten tegelijk op dezelfde lokale zoekvraag.",
    },
    {
      question: "Zit advertentiebudget inbegrepen?",
      answer:
        "Nee. Growth Partner bevat Google Ads- en Meta Ads-beheer, plus influencer-matches. Mediabudget en creator-fees betaal je apart.",
    },
    {
      question: "Kan ik later upgraden?",
      answer:
        "Ja. Van Clinic Edition naar Local Growth of Growth Partner. Signature Custom blijft een apart from-scratch traject.",
    },
    {
      question: "Wie beheert de website?",
      answer:
        "Ik. Hosting, onderhoud, beveiliging en kleine wijzigingen zitten in de maandpakketten. Jij mailt mij, niet een ticketwachtrij.",
    },
  ],
  howItWorks: [
    {
      title: "Ik bekijk je kliniek",
      body: "Locatie, behandelingen, agenda, merkstijl. Intake past op één koffie.",
    },
    {
      title: "Art direction kiezen",
      body: "Clinical Editorial, Soft Clinical of Precision Dark. Of Signature Custom.",
    },
    {
      title: "Branding, aanbod en afspraken",
      body: "Jouw content, huisstijl en boekingsroute erin.",
    },
    {
      title: "Website live",
      body: "Binnen circa 5 werkdagen. Inclusief SEO-injectie op huidkliniek [jouw stad].",
    },
    {
      title: "Growth waar je voor kiest",
      body: "Local Growth voor meer zoektermen. Growth Partner plus Google Ads, Meta Ads en influencers.",
    },
  ],
  localSeoExamples: {
    queries: [
      "huidkliniek Utrecht",
      "cosmetische kliniek Utrecht",
      "botox Utrecht",
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
    href: "/pilates-studios",
    label: "Pilates studio's",
    hint: "Zelfde Local Growth Engine, andere branche",
  },
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
    hint: "Ads die naar de intake leiden",
  },
  {
    href: "/diensten/google-ads",
    label: "Google Ads",
    hint: "Search die afspraken oplevert",
  },
] as const;
