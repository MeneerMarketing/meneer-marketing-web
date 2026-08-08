export type MeneerImpactVisual = "experience" | "intake" | "focus";

export interface MeneerImpactPanel {
  id: string;
  visual: MeneerImpactVisual;
  label: string;
  headline: string;
  body: string;
  href: string;
  linkLabel: string;
}

export interface MeneerImpactContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  headingId: string;
  items: readonly MeneerImpactPanel[];
}

const IMPACT_PANELS: readonly MeneerImpactPanel[] = [
  {
    id: "experience",
    visual: "experience",
    label: "Even voorstellen",
    headline: "12 jaar. Nog hands-on.",
    body: "Begonnen als app-developer. Nu groeipartner voor MKB: Shopify custom, Next.js from scratch, SEO, Google Ads en Meta. Ik pak alles zelf aan, geen template-verkoper.",
    href: "/over",
    linkLabel: "Wie is Meneer",
  },
  {
    id: "intake",
    visual: "intake",
    label: "Intake",
    headline: "Twee minuten. Live, geen deck.",
    body: "Jij vult in waar het wringt. Ik stel soms ongemakkelijke vragen. Zeg je 'ads' terwijl je site op 0,4% converteert? Dan beginnen we ergens anders. Eerlijk, soms droog.",
    href: "/werkwijze",
    linkLabel: "Zo start een traject",
  },
  {
    id: "focus",
    visual: "focus",
    label: "Focus",
    headline: "Max drie. Jij kiest.",
    body: "SEO en mail eerst, of per productlijn, of site en app in één lijn. Jouw fase bepaalt de volgorde. Op maat, niet copy-paste.",
    href: "/werkwijze",
    linkLabel: "Het proces",
  },
] as const;

export const CASES_PAGE_IMPACT: MeneerImpactContent = {
  eyebrow: "Achter de cases",
  title: "Wie je inhuurt.",
  titleAccent: "En hoe.",
  lead: "Ik ben geen agency met twintig handjes. Wel iemand die sinds 2012 sites bouwt, shops runt en campagnes stuurt. Dit is wie je aan tafel krijgt.",
  headingId: "cases-impact-heading",
  items: IMPACT_PANELS,
};

export const OVER_IMPACT: MeneerImpactContent = {
  eyebrow: "Samenwerken",
  title: "Wie je inhuurt.",
  titleAccent: "En hoe.",
  lead: "Sinds 2012 bouw ik, meet en stuur ik zelf. Jij praat met mij, niet met een postbus of wisselende accountmanager. Dit is wie je aan tafel krijgt.",
  headingId: "over-impact-heading",
  items: [
    { ...IMPACT_PANELS[0]!, href: "#verhaal", linkLabel: "Mijn verhaal" },
    IMPACT_PANELS[1]!,
    IMPACT_PANELS[2]!,
  ],
};
