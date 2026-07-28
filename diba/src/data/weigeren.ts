export type WeigerCategorie = {
  readonly id: string;
  readonly kop: string;
  readonly intro: string;
  readonly items: readonly string[];
};

/**
 * Klinische en praktische grenzen — placeholders tot Rojda/Okan leveren.
 * Structuur staat; inhoud nooit verzonnen.
 */
export const WEIGER_CATEGORIEEN: readonly WeigerCategorie[] = [
  {
    id: "medisch",
    kop: "Medische *grenzen*",
    intro: "[COPY-NODIG: medische grenzen intro] [MEDISCHE-CHECK-ROJDA]",
    items: [
      "[COPY-NODIG: situatie 1 — medische afwijzing]",
      "[COPY-NODIG: situatie 2 — medische afwijzing]",
      "[COPY-NODIG: situatie 3 — doorverwijzing huisarts/dermatoloog]",
    ],
  },
  {
    id: "cosmetisch",
    kop: "Cosmetisch wat we *niet* doen",
    intro: "[COPY-NODIG: cosmetische grenzen intro]",
    items: [
      "[COPY-NODIG: cosmetische behandeling 1]",
      "[COPY-NODIG: cosmetische behandeling 2]",
      "[COPY-NODIG: trendbehandeling die we afwijzen]",
    ],
  },
  {
    id: "verwachting",
    kop: "Wanneer we *nee* zeggen",
    intro: "Soms is het advies om niet te behandelen. Dat is ook een uitkomst van Behandeling Nul.",
    items: [
      "[COPY-NODIG: verwachting die niet realistisch is]",
      "[COPY-NODIG: situatie zonder meetbaar doel]",
      "[COPY-NODIG: situatie waarbij thuisbehandeling eerst beter is]",
    ],
  },
] as const;
