export type BouwenToolId = "shopify" | "nextjs";

export interface BouwenTool {
  id: BouwenToolId;
  label: string;
  hint: string;
  caseId: "skincomplete" | "hills-pilates";
}

export const HOME_MOBILE_BOUWEN_INTRO = {
  eyebrow: "Bouwen from scratch",
  title: "Meneer bouwt wat er maar kan.",
  titleAccent: "Geen grenzen.",
  lead: "Shopify, Next.js, portals, apps, mails. Ik schrijf het zelf. SEO-proof, ad-ready en gebouwd om te verkopen.",
} as const;

/** Vertellend: hoe Meneer bouwt voor vindbaarheid, ads en resultaat */
export const HOME_MOBILE_BOUWEN_STORY = [
  "Eerst iets dat Google snapt. SEO zit in de code, niet in een plugin die je later erop plakt.",
  "Dan pagina's waar je ads naartoe kunnen. Snel, strak, geen bouncegolf na de eerste klik.",
  "Daarna mail, portal of app erachter. Alles praat met elkaar. Jij hoeft niet te puzzelen.",
  "Bedenk maar wat. Theme, B2B-portaal, boekingsapp, landingspagina. Ik kijk of het kan. Meestal wel.",
] as const;

export const HOME_MOBILE_BOUWEN_CAN_BUILD = [
  "Shopify theme",
  "B2B-portaal",
  "Next.js site",
  "Web-app",
  "E-mail flows",
  "Landingspagina's",
  "Boekingssysteem",
] as const;

export const HOME_MOBILE_BOUWEN_TOOLS: readonly BouwenTool[] = [
  {
    id: "shopify",
    label: "Shopify",
    hint: "Shops & B2B",
    caseId: "skincomplete",
  },
  {
    id: "nextjs",
    label: "Next.js",
    hint: "Sites & apps",
    caseId: "hills-pilates",
  },
] as const;

export const HOME_MOBILE_BOUWEN_CASE_IDS = ["skincomplete", "hills-pilates"] as const;

export type BouwenCaseId = (typeof HOME_MOBILE_BOUWEN_CASE_IDS)[number];

export const HOME_MOBILE_BOUWEN_CASE_LABELS: Record<BouwenCaseId, readonly string[]> = {
  skincomplete: ["Shopify theme", "B2B-portaal", "E-mail flows"],
  "hills-pilates": ["Website from scratch", "Boekingsapp", "E-mail flows"],
};

export const HOME_MOBILE_BOUWEN_HOT_TAKE =
  "Templates zijn als een pak van de Hema. Past, maar niemand onthoudt je naam.";

/** @deprecated use BouwenToolId */
export type BouwenStackId = BouwenToolId;

/** @deprecated use HOME_MOBILE_BOUWEN_TOOLS */
export const HOME_MOBILE_BOUWEN_STACKS = HOME_MOBILE_BOUWEN_TOOLS;
