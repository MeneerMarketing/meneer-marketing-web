/** Alle primaire conversieknoppen. Verspreid over de site. */
export const siteCtas = {
  groeiscan: { label: "Doe de Groeiscan", href: "/groeiscan" },
  startIntake: { label: "Start intake", href: "/intake" },
  schaalOp: { label: "Schaal op", href: "/schaal-op" },
  samenwerken: { label: "Samenwerken", href: "/samenwerken" },
  projectStarten: { label: "Project starten", href: "/project-starten" },
} as const;

export type SiteCta = (typeof siteCtas)[keyof typeof siteCtas];

/** Volgorde voor footer / overzicht */
export const siteCtaList: readonly SiteCta[] = [
  siteCtas.startIntake,
  siteCtas.schaalOp,
  siteCtas.samenwerken,
  siteCtas.projectStarten,
  siteCtas.groeiscan,
] as const;
