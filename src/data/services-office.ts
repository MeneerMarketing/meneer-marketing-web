import type { PillarSlug } from "@/lib/navigation";

export interface OfficeServiceLink {
  name: string;
  href: string;
}

export interface OfficePillar {
  id: PillarSlug;
  /** Korte naam op de hotspot en de chip onder de scène */
  label: string;
  /** Naam van het object in het kantoor */
  objectLabel: string;
  title: string;
  body: string;
  links: OfficeServiceLink[];
  pillarHref: string;
  /** Camera-zoom als fractie van de scène (0..1) */
  x: number;
  y: number;
  /** Klikgebied in viewBox-coördinaten (1600×900) */
  hitBox: { x: number; y: number; w: number; h: number };
  /** Kant waar het infopaneel opent op desktop */
  panelSide: "left" | "right";
}

export const OFFICE_PILLARS: OfficePillar[] = [
  {
    id: "strategie",
    label: "Strategie & groei",
    objectLabel: "Het strategiebord",
    title: "Eerst het plan, dan de euro's.",
    body: "Op dit bord begint elk traject: waar zit jouw groei, welke kanalen en in welke volgorde. Pas daarna gaat er budget aan.",
    links: [
      { name: "Marketingstrategie & groeiplan", href: "/diensten/strategie" },
      { name: "Conversie-optimalisatie (CRO)", href: "/diensten/cro" },
      { name: "Leadgeneratie", href: "/diensten/leadgeneratie" },
      { name: "Data tracking & analytics", href: "/diensten/tracking" },
    ],
    pillarHref: "/strategie",
    x: 0.18,
    y: 0.29,
    hitBox: { x: 118, y: 128, w: 348, h: 282 },
    panelSide: "right",
  },
  {
    id: "bouwen",
    label: "Bouwen from scratch",
    objectLabel: "De bouwlaptop",
    title: "Bouwen zonder plafond.",
    body: "Websites from scratch, Shopify-webshops en web-apps. Eigen code, geen templates, klaar om mee te groeien.",
    links: [
      { name: "Websites from scratch", href: "/diensten/webdevelopment" },
      { name: "Shopify webshops", href: "/diensten/shopify-enterprise" },
      { name: "Web-apps & portalen", href: "/diensten/web-apps" },
      { name: "UI/UX design", href: "/diensten/webdesign" },
    ],
    pillarHref: "/bouwen",
    x: 0.335,
    y: 0.565,
    hitBox: { x: 428, y: 432, w: 224, h: 168 },
    panelSide: "right",
  },
  {
    id: "vindbaarheid",
    label: "Vindbaarheid & content",
    objectLabel: "Het vergrootglas",
    title: "Gevonden worden, overal.",
    body: "Bovenaan in Google én het antwoord in ChatGPT, Gemini en Claude. Content en techniek die autoriteit opbouwen.",
    links: [
      { name: "SEO", href: "/diensten/seo" },
      { name: "AI-zoek & vindbaarheid", href: "/diensten/ai-zoek" },
      { name: "Contentmarketing", href: "/diensten/content-marketing" },
      { name: "Lokale SEO & Google Maps", href: "/diensten/local-seo" },
    ],
    pillarHref: "/vindbaarheid",
    x: 0.615,
    y: 0.59,
    hitBox: { x: 912, y: 478, w: 152, h: 112 },
    panelSide: "left",
  },
  {
    id: "campagnes",
    label: "Acquisitie & creators",
    objectLabel: "De megafoon",
    title: "Campagnes die terugverdienen.",
    body: "Google Ads, Meta Ads en creators die jouw verhaal vertellen. Klein testen, meten en opschalen wat werkt.",
    links: [
      { name: "Google Ads", href: "/diensten/google-ads" },
      { name: "Meta Ads", href: "/diensten/meta-ads" },
      { name: "Social media", href: "/diensten/social-media" },
      { name: "UGC & creatorcontent", href: "/diensten/ugc" },
    ],
    pillarHref: "/campagnes",
    x: 0.755,
    y: 0.6,
    hitBox: { x: 1128, y: 498, w: 196, h: 108 },
    panelSide: "left",
  },
  {
    id: "behoud",
    label: "Behoud & koppelingen",
    objectLabel: "De mailmachine",
    title: "Klanten die terugkomen.",
    body: "E-mailflows, retentie en systemen die met elkaar praten. Deze machine draait door terwijl jij slaapt.",
    links: [
      { name: "E-mailmarketing", href: "/diensten/email" },
      { name: "Retentie & loyaliteit", href: "/diensten/retentie" },
      { name: "Processen automatiseren", href: "/diensten/automatisering" },
      { name: "E-commerce workflows", href: "/diensten/workflows" },
    ],
    pillarHref: "/behoud",
    x: 0.9,
    y: 0.55,
    hitBox: { x: 1340, y: 418, w: 228, h: 198 },
    panelSide: "left",
  },
];

export function getOfficePillar(id: PillarSlug): OfficePillar {
  const pillar = OFFICE_PILLARS.find((p) => p.id === id);
  if (!pillar) throw new Error(`Onbekende office pillar: ${id}`);
  return pillar;
}
