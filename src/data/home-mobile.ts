import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Flag,
  Hammer,
  Heart,
  Megaphone,
  Search,
} from "lucide-react";
import type { PillarSlug } from "@/lib/navigation";

export const HOME_MOBILE_HERO = {
  eyebrow: "Bouwen. Groeien. Winnen.",
  title: "Van site tot Google Ads.",
  titleAccent: "Ik regel het hele plaatje.",
  body: "Websites, Shopify, SEO en ads. Eén partner, geen gedoe met tussenpersonen.",
} as const;

export interface HomeMobileRouteStep {
  id: PillarSlug | "succes";
  label: string;
  hook: string;
  href: string;
  icon: LucideIcon;
  accent: string;
}

export const HOME_MOBILE_ROUTE: HomeMobileRouteStep[] = [
  {
    id: "strategie",
    label: "Strategie",
    hook: "Eerst weten waar groei zit. Dan pas budget.",
    href: "/strategie",
    icon: Compass,
    accent: "#FF5722",
  },
  {
    id: "bouwen",
    label: "Bouwen",
    hook: "From scratch. Snel live, klaar om te verkopen.",
    href: "/bouwen",
    icon: Hammer,
    accent: "#45382C",
  },
  {
    id: "vindbaarheid",
    label: "Vindbaarheid",
    hook: "Google én AI-antwoorden. Organisch eerst.",
    href: "/vindbaarheid",
    icon: Search,
    accent: "#0284C7",
  },
  {
    id: "campagnes",
    label: "Campagnes",
    hook: "Google Ads & Meta op pagina's die converteren.",
    href: "/campagnes",
    icon: Megaphone,
    accent: "#0081FB",
  },
  {
    id: "behoud",
    label: "Behoud",
    hook: "E-mail en koppelingen. Omzet vasthouden.",
    href: "/behoud",
    icon: Heart,
    accent: "#0D9488",
  },
  {
    id: "succes",
    label: "Eindstation: succes",
    hook: "Alles op één lijn. Meetbaar en opschaalbaar.",
    href: "/intake",
    icon: Flag,
    accent: "#FF5722",
  },
];

export const HOME_MOBILE_WHY = {
  title: "Eén Meneer. Vijf specialismen.",
  points: [
    "Custom build: Shopify en Next.js from scratch.",
    "Google Ads & Meta op data, niet op gok.",
    "Meten is sturen: ROAS, conversies, Core Web Vitals.",
  ],
} as const;
