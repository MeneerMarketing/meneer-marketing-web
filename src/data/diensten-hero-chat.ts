import type { PillarSlug } from "@/lib/navigation";

export interface DienstenChatOption {
  id: PillarSlug;
  anchor: string;
  label: string;
  userReply: string;
  meneerReply: string;
  ctaLabel: string;
}

export const DIENSTEN_CHAT_INTRO = [
  "Hoi. Wat zit je dwars? SEO, shop, ads, alles?",
  "Tik iets. Ik spring je naar het juiste hoofdstuk op deze pagina.",
] as const;

export const DIENSTEN_CHAT_OPTIONS: readonly DienstenChatOption[] = [
  {
    id: "strategie",
    anchor: "hub-strategie",
    label: "Strategie",
    userReply: "Geen plan, wel budget",
    meneerReply:
      "Dan beginnen we niet met ads. Eerst route. BestRest kreeg per productlijn een eigen koers, geen Canva-funnel.",
    ctaLabel: "Naar strategie",
  },
  {
    id: "bouwen",
    anchor: "hub-bouwen",
    label: "Iets bouwen",
    userReply: "Site of shop",
    meneerReply:
      "From scratch. SkinComplete had om 2 uur 's nachts Excel-bestellingen. Nu een B2B-portaal dat 24/7 draait.",
    ctaLabel: "Naar bouwen",
  },
  {
    id: "vindbaarheid",
    anchor: "hub-vindbaarheid",
    label: "Vindbaar worden",
    userReply: "Hoger in Google",
    meneerReply:
      "12 jaar SEO. Plus ChatGPT, want daar begint je klant steeds vaker. Organisch vóór paid, altijd.",
    ctaLabel: "Naar vindbaarheid",
  },
  {
    id: "campagnes",
    anchor: "hub-campagnes",
    label: "Ads",
    userReply: "Google of Meta",
    meneerReply:
      "Beide kan. Maar niet op een homepage die vijf dingen tegelijk schreeuwt. Landings die converteren, dan pas budget.",
    ctaLabel: "Naar campagnes",
  },
  {
    id: "behoud",
    anchor: "hub-behoud",
    label: "Klanten vasthouden",
    userReply: "Mail & flows",
    meneerReply:
      "Ads zonder e-mail is een emmer met gaten. Klaviyo, flows, koppelingen. Vasthouden is goedkoper dan jagen.",
    ctaLabel: "Naar behoud",
  },
] as const;
