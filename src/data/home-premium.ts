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
    tags: ["Groeiscan", "Stack in kaart", "Quick wins"],
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
  title: "Klaar om te weten waar jouw groei zit?",
  body: "Geen losse acties meer. We brengen je doelen, data en kanalen in kaart en maken er een plan van dat we ook echt uitvoeren.",
} as const;
