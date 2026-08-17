/** Alle primaire conversieknoppen. Verspreid over de site. */
export const siteCtas = {
  groeiscan: { label: "Start intake", href: "/intake" },
  startIntake: { label: "Start intake", href: "/intake" },
  contact: { label: "Contact opnemen", href: "/contact" },
  schaalOp: { label: "Schaal op", href: "/schaal-op" },
  samenwerken: { label: "Samenwerken", href: "/samenwerken" },
  projectStarten: { label: "Project starten", href: "/project-starten" },
  meter: { label: "De Meneer Meter", href: "/meter" },
} as const;

export type SiteCta = (typeof siteCtas)[keyof typeof siteCtas];

/** Volgorde voor footer / overzicht */
export const siteCtaList: readonly SiteCta[] = [
  siteCtas.startIntake,
  siteCtas.projectStarten,
  siteCtas.schaalOp,
  siteCtas.samenwerken,
  siteCtas.contact,
] as const;
