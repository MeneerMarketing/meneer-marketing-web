import type { BehandelContent } from "@/components/templates/BehandelTemplate";

const beeld = {
  src: "/dev/behandeling.svg",
  alt: "[BEELD-NODIG: echte behandelfoto]",
} as const;

const prijsRij = {
  name: "[COPY-NODIG]",
  single: 0,
  traject: { price: 0, sessions: "[COPY-NODIG]", perMonth: 0 },
};

function maakBehandeling(opts: {
  slug: string;
  titel: string;
  gerelateerd: { label: string; href: string }[];
}): BehandelContent {
  return {
    slug: opts.slug,
    titel: opts.titel,
    intro: "[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]",
    beeld,
    werking: {
      kop: "Hoe deze behandeling *werkt*",
      alineas: ["[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]"],
    },
    welNiet: { wel: ["[COPY-NODIG]"], niet: ["[COPY-NODIG]"] },
    prijzen: {
      caption: "[COPY-NODIG: prijstabeltitel]",
      rows: [prijsRij],
    },
    gerelateerdeProblemen: opts.gerelateerd,
    faq: [{ question: "[COPY-NODIG]", answer: "[COPY-NODIG]" }],
  };
}

export const TREATMENTS: BehandelContent[] = [
  maakBehandeling({
    slug: "chemische-peeling",
    titel: "Chemische peeling: gericht en *meetbaar*",
    gerelateerd: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
    ],
  }),
  maakBehandeling({
    slug: "microneedling",
    titel: "Microneedling: van meting naar *resultaat*",
    gerelateerd: [
      { label: "Littekens", href: "/huidproblemen/littekens" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
    ],
  }),
  maakBehandeling({
    slug: "lasertherapie",
    titel: "Lasertherapie: precies op *jouw* huid",
    gerelateerd: [
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
    ],
  }),
  maakBehandeling({
    slug: "ipl",
    titel: "IPL: alleen waar het *nodig* is",
    gerelateerd: [
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
    ],
  }),
  maakBehandeling({
    slug: "huidanalyse",
    titel: "De *Nulmeting* met Eve-M",
    gerelateerd: [{ label: "Alle huidproblemen", href: "/huidproblemen" }],
  }),
];

export const TREATMENT_CARDS = TREATMENTS.map((t) => ({
  slug: t.slug,
  href: `/behandelingen/${t.slug}`,
  image: t.beeld,
  name: t.titel.replace(/\*/g, ""),
  forWho: "[COPY-NODIG: voor wie, één regel]",
  priceFrom: 0,
}));
