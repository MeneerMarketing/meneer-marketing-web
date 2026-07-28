import type { PillarContent } from "@/components/templates/PillarTemplate";

/** Volledig 8-staps skelet met placeholders — geen dunne pagina, wel wachten op echte copy. */
export function maakPillarSkelet(opts: {
  slug: string;
  titel: string;
  planNaam: string;
  nazorgSlug?: string;
}): PillarContent {
  return {
    slug: opts.slug,
    titel: opts.titel,
    nazorgSlug: opts.nazorgSlug,
    herkenning: "[COPY-NODIG] [MENSELIJKE-ZIN] [MEDISCHE-CHECK-ROJDA]",
    beeld: { src: "/dev/behandeling.svg", alt: "[BEELD-NODIG: echte huidsituatie]" },
    uitleg: {
      kop: "Wat er in je huid *gebeurt*",
      alineas: ["[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]"],
    },
    welNiet: { wel: ["[COPY-NODIG]"], niet: ["[COPY-NODIG]"] },
    pad: {
      naam: opts.planNaam,
      belofte: "De Nulmeting + [x] behandelingen + thuisfase",
      stappen: [
        { titel: "De Nulmeting", tekst: "[COPY-NODIG]" },
        { titel: "Behandelplan", tekst: "[COPY-NODIG]" },
        { titel: "Behandelingen", tekst: "[COPY-NODIG]" },
        { titel: "Thuisfase", tekst: "[COPY-NODIG]" },
      ],
    },
    resultaten: [],
    reviews: [],
    vergoeding: {
      tekst: "[COPY-NODIG: zorgprofiel-uitleg] [MEDISCHE-CHECK-ROJDA]",
    },
    faq: [{ question: "[COPY-NODIG]", answer: "[COPY-NODIG]" }],
  };
}
