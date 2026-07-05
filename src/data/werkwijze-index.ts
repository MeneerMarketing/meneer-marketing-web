export const WERKWIJZE_HERO = {
  eyebrow: "Werkwijze",
  title: "Geen standaardpakket. Wel een proces dat je kunt vertrouwen.",
  subtitle:
    "Afgestudeerd als app developer, twaalf jaar webdesign en marketing op mijn naam. Ik weet wat werkt en wat vooral geld kost. Jij krijgt geen copy-paste traject, maar wel dezelfde scherpte bij elke klant: eerst snappen, dan bouwen, dan meten, dan opschalen.",
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
    headline: "Geen pitch-deck. Wel scherpe vragen.",
    body: "Intake, stack, cijfers en ambities. Waar zit marge, waar lekt tijd, wat moet over een half jaar anders? Pas als dat helder is, praten we over volgorde en budget.",
    punchline: "Geen offerte vóór er context is. Anders gok je met je geld.",
    tags: ["Intake ± 2 min", "Stack in kaart", "Eerlijke prioriteit"],
    scene: "intake",
    metric: { label: "Start", value: "Luisteren" },
  },
  {
    id: "route",
    tag: "Routekaart",
    title: "Volgorde die rendeert",
    headline: "Maximaal drie focuspunten. De rest wacht.",
    body: "Niet alles tegelijk. Soms techniek eerst, soms SEO, soms ads. Jouw niche bepaalt de mix. SkinComplete begon organisch, ads kwamen pas toen het verkocht. BestRest kreeg per product een eigen koers.",
    punchline: "Alles tegelijk is een verzekering dat niets af komt.",
    tags: ["Volgorde per kanaal", "Meetplan", "Geen alles-tegelijk"],
    scene: "route",
    metric: { label: "Focus", value: "Max 3" },
  },
  {
    id: "bouwen",
    tag: "Bouwen & meten",
    title: "From scratch, met cijfers",
    headline: "Live zetten met meetpunten vanaf dag één.",
    body: "Websites from scratch, Shopify, Google Ads, Meta Ads, koppelingen. Geen page builder die vastloopt. Geen zwarte doos: je ziet wat live gaat, wat het meet en waarom we iets aanpassen.",
    punchline: "Mooi zonder cijfers is een hobby. Geen groei.",
    tags: ["Custom build", "Tracking", "Core Web Vitals"],
    scene: "build",
    metric: { label: "Tempo", value: "Sprints" },
  },
  {
    id: "sturen",
    tag: "Sturen",
    title: "Leren en opschalen",
    headline: "Wat werkt krijgt gas. Wat niet werkt gaat eruit.",
    body: "Live betekent leren. We sturen bij op data én op wat jij merkt in de praktijk. Maandelijks scherp, geen kwartaalrapport dat niemand leest. Budget verschuift naar winnaars.",
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
    id: "skincomplete",
    name: "SkinComplete",
    tagline: "Shopify B2B-portaal, SEO eerst",
    body: "Eerst organisch verkeer domineren. Pas toen dat verkocht, ads aangezet. Portaal from scratch, e-mailmarketing opgezet, alles op één lijn.",
    steps: [
      { label: "SEO & content", detail: "Organisch vóór paid" },
      { label: "Shopify B2B", detail: "Portaal from scratch" },
      { label: "E-mail & retentie", detail: "Marge vasthouden" },
      { label: "Ads opschalen", detail: "Toen het al verkocht" },
    ],
    accent: "#45382C",
    quip: "Geen euro aan ads voordat de site convert.",
  },
  {
    id: "bestrest",
    name: "BestRest",
    tagline: "Matrassen, eigen strategie per lijn",
    body: "Geen one-size-fits-all. Per product een andere route: vindbaarheid, landings, campagnes. Compleet eigen aanpak, want elke klant krijgt die.",
    steps: [
      { label: "Strategie per product", detail: "Geen standaard playbook" },
      { label: "Landings from scratch", detail: "Conversie per lijn" },
      { label: "Google & Meta Ads", detail: "Meetbaar per SKU" },
      { label: "Doorsturen op data", detail: "Budget naar winnaars" },
    ],
    accent: "#0284C7",
    quip: "Toppers en matrassen vragen om andere hooks. Logisch.",
  },
];

export const WERKWIJZE_INBOX = {
  title: "Zo klinkt contact met mij",
  subtitle:
    "Duidelijk en menselijk. Geen corporate masker. Mail, WhatsApp of bellen: wat voor jou het fijnst is.",
  channelsIntro:
    "Kies het kanaal dat bij je past. Deadlines en cijfers zijn professioneel. De toon blijft gewoon menselijk.",
  corporate: {
    label: "Zo niet",
    subject: "Betreft: uw online marketingstrategie",
    body: "Geachte heer/mevrouw, naar aanleiding van uw e-mail berichten wij u dat wij uw aanvraag in behandeling hebben genomen. Wij komen spoedig bij u terug met een voorstel.",
  },
  meneer: {
    label: "Zo wel",
    subject: "Re: je website en advertenties",
    body: "Hoi! Bedankt voor je mail, ik heb het gelezen. Mijn advies: zet eerst SEO goed neer. Advertenties kunnen later, als je landingspagina's goed staan. Zullen we donderdag even bellen? Stuur je website-URL mee, dan hoef ik minder heen en weer te mailen.",
  },
} as const;

export const WERKWIJZE_NOT = {
  title: "Wat je níet krijgt",
  subtitle: "Handig om te weten voordat je tekent. Scheelt teleurstelling.",
  items: [
    {
      title: "Geen template-truc",
      body: "Geen page builder die na een half jaar vastloopt. Websites from scratch, Shopify custom waar het moet.",
    },
    {
      title: "Geen junior op je account",
      body: "Geen accountmanager die jouw dossier leert kennen terwijl de deadline nadert. Ik doe het werk.",
    },
    {
      title: "Geen rapport zonder actie",
      body: "Geen slides vol moeilijke woorden. Wel cijfers die je snapt en keuzes die je morgen kunt uitvoeren.",
    },
    {
      title: "Geen alles-tegelijk-plan",
      body: "Geen twintig kanalen in één keer. Wel een volgorde die rendement oplevert en haalbaar blijft.",
    },
  ],
} as const;

export const WERKWIJZE_SPRINTS = {
  title: "Hoe een traject voelt",
  subtitle: "Geen zwarte doos van maanden. Wel duidelijke stukken met oplevermomenten.",
  cards: [
    {
      id: "kickoff",
      label: "Kick-off",
      body: "Doelen, stack, volgorde. Iedereen snapt wat eerst.",
      deliverable: "Routekaart + meetplan",
    },
    {
      id: "sprint",
      label: "Sprint",
      body: "Bouwen, campagnes of content. Zichtbare stappen, geen verrassingen.",
      deliverable: "Live stuk + cijfers",
    },
    {
      id: "review",
      label: "Review",
      body: "Wat werkte, wat niet. Budget en focus bijstellen.",
      deliverable: "Eerlijk advies + next steps",
    },
    {
      id: "scale",
      label: "Opschalen",
      body: "Gas op wat rendeert. Stoppen met wat alleen ruis was.",
      deliverable: "Groei die blijft",
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
    question: "Hoe snel kunnen we starten?",
    answer:
      "Als de intake binnen is, meestal binnen één à twee werkdagen reactie. Urgent? Zet het in je bericht. Dan kijk ik eerder.",
  },
  {
    question: "Werk je met vaste pakketten?",
    answer:
      "Nee. Elk bedrijf krijgt een mix op maat. SkinComplete anders dan BestRest. Jij krijgt wat bij jouw fase past, niet wat bij de vorige klant werkte.",
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
  body: "Vul de intake in. Twee minuten. Daarna plannen we een gesprek van dertig minuten. Geen verplicht traject, wel helderheid.",
} as const;
