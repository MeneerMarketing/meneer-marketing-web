export type BouwenToolId = "shopify" | "nextjs";

export interface BouwenTool {
  id: BouwenToolId;
  label: string;
  hint: string;
  caseId: "skincomplete" | "hills-pilates";
}

export const HOME_MOBILE_BOUWEN_INTRO = {
  eyebrow: "Bouwen from scratch",
  title: "Vertel wat je wilt.",
  titleAccent: "Ik bouw het.",
  lead:
    "Geen templates, geen page builders. Jij beschrijft het idee, ik schrijf de code. Webshop, website from scratch, app, landingspagina of boekingssysteem: als het online moet draaien, regelen we het.",
} as const;

/** Vertellend: één intro, geen opsomming */
export const HOME_MOBILE_BOUWEN_STORY = [
  "Sommige bureaus verkopen een standaardpakket. Ik niet. Jij vertelt waar je naartoe wilt, ik kijk wat past en bouw het from scratch. Concreet of vaag, maakt niet uit.",
  "Webshop op Shopify? Custom site? B2B-portaal, boekingsflow, landingspagina voor je ads? Allemaal gedaan. Ooit zelfs een game gebouwd. Geen AAA-blockbuster, wel het bewijs dat 'kan niet' zelden een technisch probleem is.",
] as const;

export const HOME_MOBILE_BOUWEN_CAN_BUILD = [
  "Shopify theme",
  "B2B-portaal",
  "Website from scratch",
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
    label: "From scratch",
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
  "Gekochte templates en page builders zijn als een pak van de Hema. Past, maar niemand onthoudt je naam.";

/** @deprecated use BouwenToolId */
export type BouwenStackId = BouwenToolId;

/** @deprecated use HOME_MOBILE_BOUWEN_TOOLS */
export const HOME_MOBILE_BOUWEN_STACKS = HOME_MOBILE_BOUWEN_TOOLS;
