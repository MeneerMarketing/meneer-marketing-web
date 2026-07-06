import type { PillarSlug } from "@/lib/navigation";

export type MobileBillboardVariant = "dark" | "orange";

export interface MobileBillboardSegment {
  text: string;
  /** Accentkleur binnen de regel */
  accent?: boolean;
}

export interface MobileBillboardLine {
  segments: readonly MobileBillboardSegment[];
}

export type MobileBillboardStampIcon = "meneer" | "magnifier";

export interface MobileBillboard {
  id: string;
  /** Regels met gecontroleerde breaks, geen losse woorden */
  lines: readonly MobileBillboardLine[];
  variant: MobileBillboardVariant;
  /** Stamp onder de headline */
  stamp: string;
  /** Icoon in stamp. Default: Meneer-hoofd */
  stampIcon?: MobileBillboardStampIcon;
}

export type MobileChapterTheme = "dark" | "light" | "midnight";

export type MobileChapterVisual = "pillar" | "vindbaarheid-dual" | "campagnes-dual";

export interface MobileChapter {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  hotTake: string;
  inlineProof?: string;
  href: string;
  linkLabel: string;
  pillarId: PillarSlug;
  theme: MobileChapterTheme;
  visual?: MobileChapterVisual;
}

export interface MobileMyth {
  id: string;
  /** Wisselende section-eyebrow per kaart */
  eyebrow: string;
  myth: string;
  meneer: string;
  href: string;
  linkLabel: string;
}

export interface MobileMythSectionCopy {
  /** Fallback als mythe geen eigen eyebrow heeft */
  eyebrow: string;
  title: string;
  subtitle: string;
  mythLabel: string;
  meneerLabel: string;
}

export const HOME_MOBILE_MYTH_SECTION: MobileMythSectionCopy = {
  eyebrow: "Even rechtzetten",
  title: "Iedereen gelooft dit. Klopt niet.",
  subtitle:
    "Swipe. Ik zeg wat je moet horen, niet wat influencers je willen verkopen.",
  mythLabel: "LinkedIn zegt",
  meneerLabel: "Meneer zegt",
};

export const HOME_MOBILE_BILLBOARD_SEO: MobileBillboard = {
  id: "seo-organic",
  lines: [
    { segments: [{ text: "BOVEN IN GOOGLE." }] },
    { segments: [{ text: "ORGANISCH.", accent: true }] },
    { segments: [{ text: "GRATIS KLIKS." }] },
  ],
  variant: "dark",
  stamp: "SEO · geen cent per klik",
  stampIcon: "magnifier",
};

export const HOME_MOBILE_BILLBOARD_AI: MobileBillboard = {
  id: "ai-search",
  lines: [
    { segments: [{ text: "CHATGPT KENT JE MERK" }] },
    { segments: [{ text: "NOG NIET. " }, { text: "FIX DAT.", accent: true }] },
  ],
  variant: "orange",
  stamp: "AI-zoek · nu zichtbaar",
};

export const HOME_MOBILE_CHAPTER_BOUWEN: MobileChapter = {
  id: "bouwen",
  eyebrow: "Bouwen from scratch",
  title: "Je site is je verkoper, geen digitaal visitekaartje.",
  body: "Custom Next.js of Shopify. Geen page builder die vastloopt zodra je gaat adverteren. Snel, technisch strak en gebouwd om te converteren.",
  hotTake:
    "Templates zijn als een pak van de Hema. Past, maar niemand onthoudt je naam.",
  inlineProof:
    "SkinComplete: custom Shopify, B2B-portaal en e-mailmarketing from scratch.",
  href: "/bouwen",
  linkLabel: "Meer over bouwen",
  pillarId: "bouwen",
  theme: "dark",
};

export const HOME_MOBILE_CHAPTER_VINDBAARHEID: MobileChapter = {
  id: "vindbaarheid",
  eyebrow: "SEO & AI-vindbaarheid",
  title: "Google én AI. Jij hoort in het antwoord.",
  body: "Landingspagina's die ranken. Autoriteit die ook in ChatGPT en Gemini verschijnt. Twee kanalen, één strategie. Organisch verkeer kost niks per klik.",
  hotTake:
    "Ads stoppen als je budget stopt. Een pagina op positie 1 levert gewoon door. Gratis.",
  inlineProof:
    "SkinComplete domineerde organisch met landingspagina's op de vragen die salons echt stellen.",
  href: "/vindbaarheid",
  linkLabel: "Meer over vindbaarheid",
  pillarId: "vindbaarheid",
  theme: "light",
  visual: "vindbaarheid-dual",
};

export const HOME_MOBILE_CHAPTER_CAMPAGNES: MobileChapter = {
  id: "campagnes",
  eyebrow: "Google Ads & Meta Ads",
  title: "Adverteren is geen gokken met jouw budget.",
  body: "Klein testen, scherp meten, alleen opschalen wat ROAS oplevert. Google Ads en Meta op landingspagina's die technisch en inhoudelijk kloppen.",
  hotTake:
    "Een campagne zonder tracking is als autorijden met dichte ogen. Leuk tot de eerste bocht.",
  inlineProof:
    "BestRest: eigen strategie per product, geen generieke funnel.",
  href: "/campagnes",
  linkLabel: "Meer over campagnes",
  pillarId: "campagnes",
  theme: "midnight",
  visual: "campagnes-dual",
};

export const HOME_MOBILE_MYTHS: readonly MobileMyth[] = [
  {
    id: "viral",
    eyebrow: "Even rechtzetten",
    myth: "Als het viral gaat, ben je klaar",
    meneer:
      "Viral is loterij. SEO en e-mail zijn verhuur met sleutel. Bouw iets dat morgen nog werkt.",
    href: "/vindbaarheid",
    linkLabel: "Vindbaarheid",
  },
  {
    id: "more-budget",
    eyebrow: "Dat hoor je overal",
    myth: "Meer adsbudget = meer omzet",
    meneer:
      "Nee. Eerst een pagina die converteert. Anders schaal je alleen je verlies netjes op.",
    href: "/campagnes",
    linkLabel: "Campagnes",
  },
  {
    id: "template",
    eyebrow: "Klinkt slim, klopt niet",
    myth: "Een template is sneller klaar, dus beter",
    meneer:
      "Sneller live, trager groeien. Custom build kost meer vooraf, maar adverteren wordt goedkoper.",
    href: "/bouwen",
    linkLabel: "Bouwen",
  },
];
