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
      "Alleen een intake met behandeladvies kost 50 euro en duurt dertig minuten. Boek je een behandeling op advies, dan reserveren we twee uur als je nieuw bent en een uur als je al klant bent; het bedrag van de intake vervalt zodra we behandelen.",
  },

  {
    id: "alleen-intake",

    question: "Kan ik ook alleen een intake boeken?",

    answer:
      "Ja, en dat is een van de twee manieren om te beginnen als je nog niet weet wat je nodig hebt. Het huidconsult duurt dertig minuten: meten, uitleg en een plan dat je mee naar huis krijgt. De andere manier is een behandeling op advies, waarin we in dezelfde afspraak ook behandelen als dat kan. Je beslist zelf welke van de twee.",
  },

  {
    id: "huidanalyse",

    question: "Is een huidanalyse altijd nodig?",

    highlight: "altijd",

    answer:
      "Niet altijd. Wanneer een huidscan waarde toevoegt, leggen we uit wat we meten en waarom. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;
