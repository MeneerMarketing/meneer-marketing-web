import { AI_ANSWERS } from "@/lib/ai-visibility-copy";

export type UspSceneId =
  | "contact"
  | "plan"
  | "build"
  | "ads"
  | "discover";

export interface HomeUsp {
  scene: UspSceneId;
  title: string;
  body: string;
  accent: string;
}

export const HOME_USPS: HomeUsp[] = [
  {
    scene: "contact",
    title: "Eén aanspreekpunt",
    body: "Strategie, bouw, SEO, ads en e-mail. Altijd dezelfde stem, geen wisselend team dat opnieuw moet uitleggen.",
    accent: "#FF5722",
  },
  {
    scene: "plan",
    title: "Plan én uitvoering",
    body: "Het plan belandt niet in een la. Ik schrijf het, bouw het systeem en stuur campagnes ook echt zelf.",
    accent: "#0F172A",
  },
  {
    scene: "build",
    title: "From scratch",
    body: "Websites en Shopify custom gebouwd from scratch. Snel en klaar om op te schalen.",
    accent: "#0284c7",
  },
  {
    scene: "ads",
    title: "Google Ads & Meta Ads",
    body: "Campagne-expertise die telt. Klein testen, scherp meten en alleen opschalen wat echt geld oplevert nu.",
    accent: "#FF5722",
  },
  {
    scene: "discover",
    title: "Vindbaar overal",
    body: "Google én AI-antwoorden: ChatGPT en Gemini. Content en techniek die elke dag autoriteit voor je opbouwen.",
    accent: "#00BCD4",
  },
];

export const HOME_USP_STICKERS = [
  "From scratch",
  "Shopify-expert",
  "SEO",
  AI_ANSWERS.sticker,
  "Ads",
  "Mailautomatisering",
  "Meetbaar",
] as const;
