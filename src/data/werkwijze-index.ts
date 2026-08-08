export const WERKWIJZE_HERO = {
  eyebrow: "Werkwijze",
  title: "Twaalf jaar online. Één route die je eindelijk snapt.",
  subtitle:
    "Afgestudeerd als app developer, twaalf jaar webdesign en marketing op mijn naam. Jij krijgt geen copy-paste traject, wel dezelfde scherpte: eerst snappen, dan bouwen, dan meten, dan opschalen.",
  aside:
    "Fun fact: ik stuur liever 'hoi, dit staat live' dan een PDF van acht pagina's. Sneller. En je leest het ook echt.",
  stats: [
    { label: "Formulier", value: "± 2 min" },
    { label: "Gesprek", value: "30 min" },
    { label: "Ervaring", value: "12+ jr" },
  ],
} as const;

export interface WerkwijzePhase {
  id: string;
  tag: string;
  title: string;
  headline: string;
  body: string;
  punchline: string;
  tags: readonly string[];
  scene: "intake" | "route" | "build" | "steer";
  metric: { label: string; value: string };
}

export const WERKWIJZE_PHASES: WerkwijzePhase[] = [
  {
    id: "snappen",
    tag: "Snappen",
    title: "Eerst jouw werkelijkheid",
    headline: "Luisteren vóór er een euro op tafel ligt.",
    body: "Intake, stack, cijfers en ambities. Waar zit marge, waar lekt tijd, wat moet over een half jaar anders? Pas als dat helder is, praten we over volgorde en budget.",
    punchline: "Offerte zonder context is gokken met je bankrekening.",
    tags: ["Intake ± 2 min", "Stack in kaart", "Eerlijke prioriteit"],
    scene: "intake",
    metric: { label: "Start", value: "Luisteren" },
  },
  {
    id: "route",
    tag: "Routekaart",
    title: "Volgorde die rendeert",
    headline: "Max drie focuspunten. De rest wacht geduldig.",
    body: "Niet alles tegelijk. Soms techniek eerst, soms SEO, soms ads. Organisch vóór paid is vaak de slimme volgorde. Per product of lijn kan de route anders zijn.",
    punchline: "Alles tegelijk is een verzekering dat niets af komt.",
    tags: ["Volgorde per kanaal", "Meetplan", "SEO vóór paid"],
    scene: "route",
    metric: { label: "Focus", value: "Max 3" },
  },
  {
    id: "bouwen",
    tag: "Bouwen & meten",
    title: "From scratch, met cijfers",
    headline: "Live zetten met meetpunten vanaf dag één.",
    body: "Websites from scratch, Shopify, Google Ads, Meta Ads, koppelingen. Jij ziet wat live gaat, wat het meet en waarom ik iets aanpas. Alles transparant, geen zwarte doos achter een agency-portaal.",
    punchline: "Mooi zonder cijfers is een hobby. Groei vraagt data.",
    tags: ["Custom build", "Tracking", "Core Web Vitals"],
    scene: "build",
    metric: { label: "Tempo", value: "Sprints" },
  },
  {
    id: "sturen",
    tag: "Sturen",
    title: "Leren en opschalen",
    headline: "Winnaars krijgen gas. Rest gaat eruit.",
    body: "Live betekent leren. Ik stuur bij op data én op wat jij merkt in de praktijk. Maandelijks scherp. Budget verschuift naar wat rendeert.",
    punchline: "Opschalen is geen knop. Het is een gewoonte.",
    tags: ["Maandelijks sturen", "Budget verschuiven", "Eerlijk stoppen"],
    scene: "steer",
    metric: { label: "Eind", value: "Groei" },
  },
];

export interface WerkwijzeClientPath {
  id: string;
  name: string;
  tagline: string;
  body: string;
  steps: readonly { label: string; detail: string }[];
  accent: string;
  quip: string;
}

export const WERKWIJZE_CLIENT_PATHS: WerkwijzeClientPath[] = [
  {
    id: "b2b-shop",
    name: "B2B-webshop",
    tagline: "Portaal, SEO eerst, ads later",
    body: "Eerst organisch verkeer domineren. Pas toen dat verkocht, ads aangezet. Portaal from scratch, e-mailmarketing opgezet, alles op één lijn.",
    steps: [
      { label: "SEO & content", detail: "Organisch vóór paid" },
      { label: "Shopify B2B", detail: "Portaal from scratch" },
      { label: "E-mail & retentie", detail: "Marge vasthouden" },
      { label: "Ads opschalen", detail: "Toen het al verkocht" },
    ],
    accent: "#45382C",
    quip: "Ads pas toen de site al convert. Logische volgorde.",
  },
  {
    id: "ecom-multi",
    name: "E-commerce multi-lijn",
    tagline: "Eigen strategie per productlijn",
    body: "Per product een andere route: vindbaarheid, landings, campagnes. Compleet eigen aanpak, want elke klant krijgt die.",
    steps: [
      { label: "Strategie per product", detail: "Eigen playbook per lijn" },
      { label: "Landings from scratch", detail: "Conversie per SKU" },
      { label: "Google & Meta Ads", detail: "Meetbaar per product" },
      { label: "Doorsturen op data", detail: "Budget naar winnaars" },
    ],
    accent: "#0284C7",
    quip: "Verschillende producten vragen om andere hooks. Logisch.",
  },
];

export const WERKWIJZE_INBOX = {
  title: "Zo klinkt contact met mij",
  subtitle:
    "Duidelijk en menselijk. Mail, WhatsApp of bellen: wat voor jou het fijnst is.",
  channelsIntro:
    "Kies het kanaal dat bij je past. Deadlines en cijfers zijn professioneel. De toon blijft gewoon menselijk.",
  corporate: {
    label: "Bureau-mail",
    subject: "Betreft: uw online marketingstrategie",
    body: "Geachte heer/mevrouw, naar aanleiding van uw e-mail berichten wij u dat wij uw aanvraag in behandeling hebben genomen. Wij komen spoedig bij u terug met een voorstel.",
  },
  meneer: {
    label: "Meneer-mail",
    subject: "Re: je website en advertenties",
    body: "Hoi! Bedankt voor je mail, ik heb het gelezen. Mijn advies: zet eerst SEO goed neer. Advertenties kunnen later, als je landingspagina's goed staan. Zullen we donderdag even bellen? Stuur je website-URL mee, dan hoef ik minder heen en weer te mailen.",
  },
} as const;

export interface WerkwijzeWelItem {
  title: string;
  body: string;
  quip: string;
  emoji: string;
}

export const WERKWIJZE_WEL = {
  title: "Wat je wél krijgt",
  subtitle:
    "Alles vooraf helder. Handig om te weten voordat ik start.",
  items: [
    {
      title: "Custom build die meegroeit",
      body: "Websites from scratch, Shopify custom waar het moet. Code die opschaalt als jij opschaalt.",
      quip: "Page builders zijn fijn tot je groeit. Dan worden ze een rem.",
      emoji: "🛠️",
    },
    {
      title: "Één senior die het uitvoert",
      body: "Jij praat met mij. Ik bouw, meet en stuur bij. Eén senior die je dossier kent, geen keten van juniors.",
      quip: "Accountmanager die je shop googelt = rode vlag.",
      emoji: "👋",
    },
    {
      title: "Cijfers die actie opleveren",
      body: "ROAS, CPA, organisch verkeer: in normale taal. Drie regels die actie geven, geen kwartaaldeck van 40 slides.",
      quip: "Mooie grafiek zonder beslissing is decoratie.",
      emoji: "📊",
    },
    {
      title: "Volgorde die rendement geeft",
      body: "Max drie focuspunten tegelijk. Eerst wat het meeste oplevert, daarna pas de rest.",
      quip: "Twintig kanalen tegelijk = twintig halve resultaten.",
      emoji: "🎯",
    },
  ] satisfies WerkwijzeWelItem[],
} as const;

/** @deprecated Use WERKWIJZE_WEL */
export const WERKWIJZE_NOT = WERKWIJZE_WEL;

export const WERKWIJZE_SPRINTS = {
  title: "Zo voelt een traject",
  subtitle:
    "Duidelijke stukken met oplevermomenten. Je ziet waar je bent en wat de volgende stap is.",
  cards: [
    {
      id: "kickoff",
      label: "Kick-off",
      emoji: "🚀",
      body: "Doelen, stack, volgorde. Iedereen snapt wat eerst.",
      deliverable: "Routekaart + meetplan",
      quip: "Een plan dat past op één scherm. Kort en scherp.",
    },
    {
      id: "sprint",
      label: "Sprint",
      emoji: "⚡",
      body: "Bouwen, campagnes of content. Zichtbare stappen elke week.",
      deliverable: "Live stuk + cijfers",
      quip: "'Even bezig' is geen statusupdate. Live wel.",
    },
    {
      id: "review",
      label: "Review",
      emoji: "🔍",
      body: "Wat werkte, wat niet. Budget en focus bijstellen.",
      deliverable: "Eerlijk advies + next steps",
      quip: "Slecht nieuws mag. Stilte over slechte cijfers niet.",
    },
    {
      id: "scale",
      label: "Opschalen",
      emoji: "📈",
      body: "Gas op wat rendeert. Stoppen met wat alleen ruis was.",
      deliverable: "Groei die blijft",
      quip: "Budget omhoog zonder fundament is duurder gokken.",
    },
  ],
} as const;

export const WERKWIJZE_FAQ = [
  {
    question: "Moet ik eerst de intake invullen?",
    answer:
      "Handig, niet verplicht. Twee minuten en ik weet genoeg om het gesprek scherp te starten. Liever mailen? Het contactformulier werkt ook.",
  },
  {
    question: "Hoe snel kan ik starten?",
    answer:
      "Als de intake binnen is, meestal binnen één à twee werkdagen reactie. Urgent? Zet het in je bericht. Dan kijk ik eerder.",
  },
  {
    question: "Werk je met vaste pakketten?",
    answer:
      "Elk bedrijf krijgt een mix op maat. Soms eerst SEO, soms per productlijn een eigen route. Jij krijgt wat bij jouw fase past, niet wat bij de vorige klant werkte.",
  },
  {
    question: "Moet alles bij jou?",
    answer:
      "Niet per se. Website bij A, ads bij B en SEO bij C betekent dat jij projectmanager bent. Eén partner houdt de lijn strakker.",
  },
  {
    question: "Hoe communiceer je?",
    answer:
      "Mail, WhatsApp of bellen. Wat voor jou fijn is. Afspraken en cijfers zijn professioneel. De toon is gewoon menselijk.",
  },
] as const;

export const WERKWIJZE_CTA = {
  title: "Klaar om te weten wat bij jou eerst moet?",
  body: "Vul de intake in. Twee minuten. Daarna plan ik een gesprek van dertig minuten. Verplicht traject niet, wel helderheid.",
} as const;
