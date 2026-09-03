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
      "Een intake kost 50 euro en duurt maximaal een uur. Behandelen we dezelfde afspraak, dan betaal je alleen de behandeling en vervalt dat bedrag. Je hoort de prijs dus voordat je beslist.",
  },

  {
    id: "second-opinion",

    question: "Kan ik ook alleen een intake boeken?",

    answer:
      "Ja. We kijken onafhankelijk mee naar een plan dat je elders hebt gekregen. Ook als ons advies is om daar verder te gaan.",
  },

  {
    id: "huidanalyse",

    question: "Is een huidanalyse altijd nodig?",

    highlight: "altijd",

    answer:
      "Niet altijd. Wanneer een huidscan waarde toevoegt, leggen we uit wat we meten en waarom. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;
