import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Megaphone,
  Search,
  Target,
  UserRound,
} from "lucide-react";

export interface HomeUsp {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const HOME_USPS: HomeUsp[] = [
  {
    icon: UserRound,
    title: "Eén aanspreekpunt",
    body: "Strategie, bouw, SEO, ads en e-mail. Je praat met mij, niet met een wisselend team.",
  },
  {
    icon: Target,
    title: "Plan én uitvoering",
    body: "Geen strategie-PDF in een la. Ik bedenk het plan en voer het ook echt uit.",
  },
  {
    icon: Code2,
    title: "From scratch",
    body: "Websites en Shopify zonder templates. Alles custom build, snel en klaar om te groeien.",
  },
  {
    icon: Megaphone,
    title: "Google Ads & Meta Ads",
    body: "Echte campagne-expertise. Klein testen, meten en opschalen wat werkt.",
  },
  {
    icon: Search,
    title: "Vindbaar overal",
    body: "Google én AI-zoek. ChatGPT, Gemini en Claude. Content die autoriteit opbouwt.",
  },
];

export const HOME_USP_STICKERS = [
  "Geen templates",
  "Shopify-expert",
  "SEO",
  "AI-zoek",
  "CRO",
  "E-mailflows",
  "Automatisering",
  "Meetbaar",
] as const;
