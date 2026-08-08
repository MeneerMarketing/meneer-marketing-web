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

/** @deprecated Vervangen door HOME_MOBILE_CHAPTER_CAMPAGNES in editorial flow */
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

/** Copy voor interactief AI-billboard (mobiel). */
export const HOME_MOBILE_AI_BILLBOARD = {
  id: "ai-search",
  title: "ChatGPT kent je merk",
  titleAccent: "nog niet.",
  subtitle:
    "Steeds meer klanten vragen ChatGPT, Gemini en andere AI om advies. Zo zou het klinken als jij wél vindbaar bent.",
  swipeHint: "Swipe voor Gemini",
  geminiModelLabel: "2.0 Flash",
  liveStatus: "Iemand vraagt het nu al",
  userQuestion:
    "Welk marketingbureau raad je aan voor een groeiende webshop in Nederland?",
  aiReplyLead:
    "Op basis van reviews, cases en wat online te vinden is, val ik voor ",
  aiReplyHighlight: "Meneer Marketing",
  aiReplyTail:
    ". Ze bouwen webshops from scratch, pakken SEO en AI-vindbaarheid aan en zetten ads pas aan als het converteert.",
  footer: "Wil jij ook zo genoemd worden in ChatGPT, Gemini en andere AI? Dat regelen wij.",
} as const;

/** @deprecated Vervangen door HOME_MOBILE_AI_BILLBOARD + HomeMobileAiBillboard */
export const HOME_MOBILE_BILLBOARD_AI: MobileBillboard = {
  id: "ai-search-legacy",
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
  body: "Custom Next.js of Shopify. Custom build die meeschaaft zodra je gaat adverteren. Snel, technisch strak en gebouwd om te converteren.",
  hotTake:
    "Gekochte templates en page builders zijn als een pak van de Hema. Past, maar niemand onthoudt je naam.",
  inlineProof:
    "Custom Shopify, B2B-portaal en e-mailmarketing from scratch.",
  href: "/bouwen",
  linkLabel: "Meer over bouwen",
  pillarId: "bouwen",
  theme: "dark",
};

export const HOME_MOBILE_CHAPTER_VINDBAARHEID: MobileChapter = {
  id: "vindbaarheid",
  eyebrow: "Google SEO",
  title: "12 jaar Google. Ik ken het spel.",
  body: "AI-zoek hebben we net gehad. Hier draait het om Google: ranken, landingspagina's en autoriteit die blijft staan. Vakmanschap dat ik al meer dan een decennium oefen, geen trucjes uit 2014.",
  hotTake:
    "Google verandert constant. Ik ook. Daarom win je van concurrenten die SEO al drie jaar niet hebben bijgewerkt.",
  inlineProof:
    "Organisch domineren met landingspagina's op de vragen die klanten echt stellen.",
  href: "/vindbaarheid",
  linkLabel: "Meer over Google SEO",
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
    "Eigen strategie per product, geen generieke funnel.",
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
  {
    id: "ai-replaces-seo",
    eyebrow: "LinkedIn hot take",
    myth: "SEO is dood. Alleen AI-zoek telt nog",
    meneer:
      "AI-zoek is erbij. Een aanvulling, geen vervanging. Wie SEO laat liggen en alleen ChatGPT optimaliseert, bouwt op zand.",
    href: "/vindbaarheid",
    linkLabel: "Vindbaarheid",
  },
  {
    id: "daily-posts",
    eyebrow: "Influencer advies",
    myth: "Post elke dag en het groeit vanzelf",
    meneer:
      "Dertig posts zonder plan is drukte. Eén landingspagina die rankt verslaat een maand scroll-content die niemand bewaart.",
    href: "/vindbaarheid",
    linkLabel: "SEO & content",
  },
];
