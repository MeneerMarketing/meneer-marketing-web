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
  title: "Bewijs dat het werkt",
  body: "Geen stockfoto's van handen schudden. Wel echte trajecten waar strategie, bouw en marketing in de juiste volgorde kwamen.",
  metrics: [
    { label: "SkinComplete", value: "SEO eerst, ads later" },
    { label: "BestRest", value: "Eigen koers per product" },
    { label: "Aanpak", value: "Plan én uitvoering" },
  ],
  featuredHref: "/cases",
  featuredLabel: "Bekijk cases",
} as const;

export interface HomeTrajectoryStage {
  id: string;
  tag: string;
  title: string;
  headline: string;
  body: string;
  deliverables: readonly string[];
  punchline: string;
  scene: "discover" | "route" | "build" | "scale";
}

export const HOME_TRAJECTORY_STAGES: HomeTrajectoryStage[] = [
  {
    id: "discover",
    tag: "Begrijpen",
    title: "Begrijpen",
    headline: "We starten met jouw werkelijkheid, niet met een pitch.",
    body: "Intake, data, doelen en je huidige stack. Geen offerte vóór er helderheid is over waar groei zit en wat eerst moet.",
    deliverables: ["Groeiscan & prioriteiten", "Stack in kaart", "Eerste quick wins"],
    punchline: "Jij praat. Ik luister en stel de scherpe vragen.",
    scene: "discover",
  },
  {
    id: "route",
    tag: "Route",
    title: "Route kiezen",
    headline: "Maximaal drie focuspunten. De rest wacht zijn beurt.",
    body: "Welke kanalen, welke volgorde en wat het kost. Geen alles-tegelijk-plan dat niemand uitvoert.",
    deliverables: ["Volgorde per kanaal", "Realistisch budget", "Meetplan & KPI's"],
    punchline: "SEO eerst of ads eerst? Dat beslissen we op data, niet op gevoel.",
    scene: "route",
  },
  {
    id: "build",
    tag: "Bouwen",
    title: "Bouwen & meten",
    headline: "Van plan naar live. Met meetpunten vanaf dag één.",
    body: "Site, shop, campagnes of flows. Alles custom, alles meetbaar. Je ziet wat live gaat en wat het doet.",
    deliverables: ["Custom build live", "Tracking & events", "Eerste resultaten"],
    punchline: "Geen templates. Geen page builders. Wel code die je kunt opschalen.",
    scene: "build",
  },
  {
    id: "scale",
    tag: "Opschalen",
    title: "Opschalen",
    headline: "Wat werkt krijgt gas. Wat niet werkt gaat eruit.",
    body: "Klein testen was het begin. Nu schalen we wat geld oplevert en snijden we wat alleen ruis was weg.",
    deliverables: ["Budget verschuiven", "Nieuwe tests", "Maandelijkse stuur"],
    punchline: "Geen sentiment. Wel resultaat waar je op kunt bouwen.",
    scene: "scale",
  },
] as const;

export const HOME_CTA = {
  title: "Klaar om te weten waar jouw groei zit?",
  body: "Geen losse acties meer. We brengen je doelen, data en kanalen in kaart en maken er een plan van dat we ook echt uitvoeren.",
} as const;
