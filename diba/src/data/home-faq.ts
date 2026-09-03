export type HomeFaqItem = {
  readonly id: string;

  readonly question: string;

  readonly highlight?: string;

  readonly answer: string;
};

export const HOME_FAQ_ITEMS: readonly HomeFaqItem[] = [
  {
    id: "behandeling",

    question: "Moet ik al weten welke behandeling ik wil?",

    highlight: "welke behandeling",

    answer:
      "Nee. Je komt juist voor advies. We kijken samen wat voor jouw huid en doel passend is.",
  },

  {
    id: "kosten",

    question: "Wat kost een eerste afspraak?",

    answer:
      "Alleen een intake met behandeladvies kost 50 euro en duurt maximaal een uur. Boek je de afspraak waarin ook behandeld kan worden, dan reserveren we maximaal twee uur en vervalt dat bedrag zodra we behandelen.",
  },

  {
    id: "alleen-intake",

    question: "Kan ik ook alleen een intake boeken?",

    answer:
      "Ja. Het huidconsult is precies dat: meten, uitleg en een plan dat je mee naar huis krijgt. Je beslist daarna zelf of en wanneer je verdergaat.",
  },

  {
    id: "huidanalyse",

    question: "Is een huidanalyse altijd nodig?",

    highlight: "altijd",

    answer:
      "Niet altijd. Wanneer een huidscan waarde toevoegt, leggen we uit wat we meten en waarom. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;
