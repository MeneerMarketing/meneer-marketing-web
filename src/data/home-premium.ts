export const HOME_CONTEXT = {
  angleTitle: "Waarom de meeste bureaus je geld kosten",
  angleBody:
    "Niet uit kwaadwilligheid. Gewoon omdat iedereen een ander stukje doet en niemand het geheel bewaakt.",
  funFact:
    "De gemiddelde ondernemer werkt met 3 tot 5 aparte partijen voor website, ads en SEO. Dan praat niemand met elkaar en betaal je dubbel.",
  funFactSource: "Daarom doe ik alles onder één dak",
  funFactStat: "3–5",
} as const;

export const HOME_PROOF = {
  tag: "Resultaat",
  title: "Bewijs dat het werkt",
  body: "Twee trajecten. Geen praatjes. Tik door voor het volledige verhaal.",
  featuredHref: "/cases",
  featuredLabel: "Alle cases bekijken",
} as const;

/** Homepage-sectie tussen resultaat en weetjes: waarom Meneer. */
export const HOME_WHY_MENEER = {
  tag: "Waarom Meneer",
  title: "Van strategie tot Google Ads, alles in één lijn.",
  body: "Websites from scratch, SEO, Google Ads, Meta en e-mail. Ik schrijf de code, zet de campagnes en lees de cijfers. Jij hoeft niemand achterna te bellen.",
  quote: "Templates heb ik genoeg gezien. Ik bouw iets dat je kunt meten en opschalen.",
  strengths: [
    {
      label: "Custom build",
      detail: "Shopify en Next.js from scratch. Geen page builder die je remt als je groeit.",
    },
    {
      label: "SEO-expert",
      detail:
        "Landingspagina's, techniek en content die bovenaan scoren. Gratis organisch verkeer, maand na maand.",
    },
    {
      label: "Google Ads & Meta",
      detail: "Campagnes op pagina's die converteren. Niet op gok.",
    },
  ],
  pillars: ["Strategie", "Bouwen", "Vindbaarheid", "Campagnes", "Behoud"],
  pillarsCaption: "Vijf specialismen. Eén aanspreekpunt.",
} as const;

export interface HomeTrajectoryStage {
  id: string;
  short: string;
  title: string;
  headline: string;
  body: string;
  tags: readonly string[];
  scene: "discover" | "route" | "build" | "scale";
}

export const HOME_TRAJECTORY_STAGES: HomeTrajectoryStage[] = [
  {
    id: "discover",
    short: "Snappen",
    title: "Waar zit je?",
    headline: "We starten met jouw werkelijkheid, niet met een pitch.",
    body: "Intake, data, doelen en je huidige stack. Geen offerte vóór er helderheid is over waar groei zit en wat eerst moet.",
    tags: ["Intake", "Stack in kaart", "Quick wins"],
    scene: "discover",
  },
  {
    id: "route",
    short: "Volgorde",
    title: "Wat eerst?",
    headline: "Maximaal drie focuspunten. De rest wacht zijn beurt.",
    body: "Welke kanalen, welke volgorde en wat het kost. Geen alles-tegelijk-plan dat niemand uitvoert.",
    tags: ["Volgorde per kanaal", "Budget", "Meetplan"],
    scene: "route",
  },
  {
    id: "build",
    short: "Live zetten",
    title: "Bouwen & meten",
    headline: "Van plan naar live. Met meetpunten vanaf dag één.",
    body: "Site, shop, campagnes of mail. Alles custom, alles meetbaar. Je ziet wat live gaat en wat het doet.",
    tags: ["Custom build", "Tracking", "Eerste cijfers"],
    scene: "build",
  },
  {
    id: "scale",
    short: "Gas geven",
    title: "Opschalen",
    headline: "Wat werkt krijgt gas. Wat niet werkt gaat eruit.",
    body: "Klein testen was het begin. Nu schalen we wat geld oplevert en snijden we wat alleen ruis was weg.",
    tags: ["Budget verschuiven", "Nieuwe tests", "Maandelijks sturen"],
    scene: "scale",
  },
] as const;

export const HOME_CTA = {
  eyebrow: "Afsluiter",
  title: "Jouw bureau heeft een receptionist.",
  titleAccent: "Ik heb de code.",
  body: "Vertel waar het nu wringt. Geen warme-overdracht naar een stagiair die je verhaal half snapt. Ik bouw je site of shop, fix je vindbaarheid en zet je Google Ads en Meta aan. Eén aanspreekpunt dat ook echt de knoppen indrukt.",
  buttonLabel: "Vertel me je verhaal",
  secondaryLead: "Liever geen call?",
  secondaryLink: "Mail me even",
  secondarySuffix: "Ik antwoord zelf. Geen chatbot.",
  scrollHint: "Afsluiter. Vertel je verhaal. Ik reageer zelf, snor en al.",
} as const;

export const HOME_CONTACT_CHAT = {
  eyebrow: "Contact",
  title: "Typ alsof je me app't",
  subtitle:
    "Geen formulier-gevoel. Kies twee keer een richting, typ daarna je bericht. Op contact kun je meteen versturen.",
  ctaLabel: "Ga verder op contact",
  ctaHref: "/contact#gesprek",
} as const;
