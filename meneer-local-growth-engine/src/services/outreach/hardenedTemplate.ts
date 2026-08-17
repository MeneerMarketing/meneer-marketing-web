import {
  getSenderDisplay,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";
import type { OutreachPersonalizationSlots } from "./personalizationSchema";

/** Zelfde instap als Studio Edition op meneermarketing.nl/pilates-studios (ex. btw). */
const STUDIO_EDITION_MONTHLY_EXCL_EUR = 89;

export interface HardenedTemplateInput {
  business_name: string;
  city: string;
  contact_first_name: string | null;
  preview_url: string;
  /** Pagina op meneermarketing.nl met het aanbod voor Pilates studio's. */
  landing_page_url: string | null;
  /** @deprecated M8.4 — city exclusivity is geen acquisition pitch meer. */
  city_exclusivity_available?: boolean;
  /** Eén eigenaar krijgt "je", een studio met een team krijgt "jullie". */
  addressing?: "singular" | "plural";
  brand: MeneerMarketingBrandSettings;
  slots: OutreachPersonalizationSlots;
}

export interface HardenedRenderResult {
  subject: string;
  body_text: string;
  fixed_parts: string[];
  ai_parts: string[];
  word_count: number;
}

function greeting(firstName: string | null): string {
  if (firstName && firstName.length >= 2 && firstName.length <= 20) {
    return `Hoi ${firstName},`;
  }
  return "Hoi,";
}

function subjectFromSlots(
  businessName: string,
  city: string,
  variant: OutreachPersonalizationSlots["subject_variant"]
): string {
  switch (variant) {
    case "city":
      return `Pilates in ${city}: samen groeien?`;
    case "idea":
      return `Samenwerking in ${city}?`;
    case "concept":
      return `Een plan voor ${businessName}`;
    case "website":
      return `Groei voor ${businessName}`;
    case "made":
      return `${businessName}: mijn voorstel`;
    case "chosen":
    default:
      return `Ik help Pilates studio's in ${city}`;
  }
}

/** Aanspreekvormen die met het aantal eigenaren meebewegen, inclusief vervoeging. */
function voice(addressing: "singular" | "plural") {
  const singular = addressing === "singular";
  return {
    yourPossessive: singular ? "je" : "jullie",
    subject: singular ? "jij" : "jullie",
    verbFind: singular ? "vindt" : "vinden",
  };
}

function signatureBlock(brand: MeneerMarketingBrandSettings): string {
  const sender = getSenderDisplay(brand);
  const lines = ["Groet,", "", sender.signature_name];
  if (sender.signature_company) lines.push(sender.signature_company);
  lines.push(brand.website_label);
  if (brand.kvk) lines.push(`KVK ${brand.kvk}`);
  return lines.join("\n");
}

/**
 * Approved Meneer Marketing outreach structure.
 * AI only fills slots; structure stays fixed.
 */
export function renderHardenedOutreach(input: HardenedTemplateInput): HardenedRenderResult {
  const { business_name, city, brand, slots } = input;
  const fixed_parts: string[] = [];
  const ai_parts: string[] = [];
  const you = voice(input.addressing ?? "singular");

  const open = greeting(input.contact_first_name);
  fixed_parts.push("greeting");

  let personalTail = "";
  if (slots.site_gap?.trim()) {
    personalTail = ` ${slots.site_gap.trim().replace(/\s+/g, " ")}`;
    ai_parts.push("site_gap");
  } else if (slots.opening_observation?.trim()) {
    personalTail = ` ${slots.opening_observation.trim().replace(/\s+/g, " ")}`;
    ai_parts.push("opening_observation");
  }

  const paraOpener = `Ik help Pilates studio's online groeien. Voor ${city} zoek ik nog een studio om mee samen te werken, en daarbij viel mijn oog op ${business_name}.${personalTail}`;
  fixed_parts.push("opener");

  const paraConcept = `Om je meteen een beeld te geven heb ik al een concept uitgewerkt:\n\n${input.preview_url}`;
  fixed_parts.push("concept");

  ai_parts.push("primary_keyword");
  if (slots.secondary_keyword) ai_parts.push("secondary_keyword");

  const keyword = slots.primary_keyword;
  const paraGrowthPlan = `Wat ik voor ${you.yourPossessive} studio wil neerzetten is een sterke online basis waar mensen in ${city} ${you.yourPossessive} studio vinden als ze zoeken op ${keyword}, makkelijk kunnen boeken en blijven terugkomen. Het doel is een voller rooster, meer leden en een agenda die loopt. Niet alleen bezoekers, maar echte boekingen en bekendheid in de buurt.`;
  fixed_parts.push("growth_plan");

  const paraPartnership = `Het concept staat al. Samen maken we het af tot het precies bij ${you.yourPossessive} studio past. Ik bouw alles zelf en blijf ${you.yourPossessive} vaste contact online. Voor €${STUDIO_EDITION_MONTHLY_EXCL_EUR} per maand ex. btw heb je iemand die met je meedenkt, elke maand doorwerkt op ${you.yourPossessive} vindbaarheid en direct oppakt als er iets moet veranderen.`;
  fixed_parts.push("partnership");

  let paraLanding = "";
  if (input.landing_page_url) {
    paraLanding = `Meer over hoe ik werk met Pilates studio's: ${input.landing_page_url}`;
    fixed_parts.push("landing_page");
  }

  const paraClose = `Kijk even naar het concept en laat me weten wat ${you.subject} ervan ${you.verbFind}.`;
  fixed_parts.push("close");

  const sig = signatureBlock(brand);
  fixed_parts.push("signature");

  if (slots.relevant_service) ai_parts.push("relevant_service");

  const body_text = [
    open,
    "",
    paraOpener,
    "",
    paraConcept,
    "",
    paraGrowthPlan,
    "",
    paraPartnership,
    ...(paraLanding ? ["", paraLanding] : []),
    "",
    paraClose,
    "",
    sig,
  ].join("\n");

  const subject = subjectFromSlots(business_name, city, slots.subject_variant);
  fixed_parts.push("subject_family");
  ai_parts.push("subject_variant");

  const word_count = body_text.trim().split(/\s+/).filter(Boolean).length;

  return { subject, body_text, fixed_parts, ai_parts, word_count };
}

export function deterministicSlots(input: {
  primary_keyword: string | null;
  secondary_keywords: string[];
  city: string;
  relevant_service: string | null;
  opening_observation: string | null;
  site_gap: string | null;
}): OutreachPersonalizationSlots {
  return {
    opening_observation: input.opening_observation,
    site_gap: input.site_gap,
    primary_keyword: input.primary_keyword ?? `Pilates ${input.city}`,
    secondary_keyword: input.secondary_keywords[0] ?? null,
    relevant_service: input.relevant_service,
    wording_variant: "A",
    subject_variant: "chosen",
  };
}
