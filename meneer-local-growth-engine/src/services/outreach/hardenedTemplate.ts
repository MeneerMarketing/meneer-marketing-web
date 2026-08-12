import {
  getSenderDisplay,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";
import type { OutreachPersonalizationSlots } from "./personalizationSchema";

export interface HardenedTemplateInput {
  business_name: string;
  city: string;
  contact_first_name: string | null;
  preview_url: string;
  city_exclusivity_available: boolean;
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

function experienceSentence(brand: MeneerMarketingBrandSettings): string {
  return brand.years_experience_phrase.replace(
    /\{\{years\}\}/g,
    String(brand.years_experience)
  );
}

function keywordSentence(slots: OutreachPersonalizationSlots): string {
  const primary = slots.primary_keyword;
  if (slots.secondary_keyword) {
    return `'${primary}' en '${slots.secondary_keyword}'`;
  }
  return `'${primary}'`;
}

function subjectFromSlots(
  businessName: string,
  variant: OutreachPersonalizationSlots["subject_variant"]
): string {
  switch (variant) {
    case "idea":
      return `Een idee voor ${businessName}`;
    case "concept":
      return `Concept voor ${businessName}`;
    case "website":
      return `Een website-concept voor ${businessName}`;
    case "made":
    default:
      return `Ik heb iets gemaakt voor ${businessName}`;
  }
}

function signatureBlock(brand: MeneerMarketingBrandSettings): string {
  const sender = getSenderDisplay(brand);
  const lines = ["Groet,", "", sender.signature_name];
  if (sender.signature_company) lines.push(sender.signature_company);
  lines.push(brand.tagline);
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

  const open = greeting(input.contact_first_name);
  fixed_parts.push("greeting");

  let observation = "";
  if (slots.opening_observation?.trim()) {
    observation = ` ${slots.opening_observation.trim().replace(/\s+/g, " ")}`;
    ai_parts.push("opening_observation");
  }

  const para1 = `Ik kwam ${business_name} tegen toen ik naar Pilates studio's in ${city} keek en jullie sprongen er voor mij uit.${observation} Daarom heb ik jullie studio gekozen om iets voor uit te werken.`;
  fixed_parts.push("opening_structure");

  const para2 = `Ik heb alvast een nieuwe high-end website-opzet voor ${business_name} gemaakt, helemaal in jullie eigen uitstraling:`;
  fixed_parts.push("preview_intro");

  const previewBlock = `→ Bekijk hier jullie conceptwebsite
${input.preview_url}

Geen download of login nodig. Het is gewoon een veilige voorbeeldpagina via Meneer Marketing.`;
  fixed_parts.push("preview_trust");

  const keywords = keywordSentence(slots);
  ai_parts.push("primary_keyword");
  if (slots.secondary_keyword) ai_parts.push("secondary_keyword");

  const paraSeo = `Ik heb daarbij niet alleen naar het design gekeken. De website is ook opgezet rondom lokale vindbaarheid, onder andere voor ${keywords}, zodat er vanuit Google nog veel meer uit de website gehaald kan worden.`;
  fixed_parts.push("seo_structure");

  const paraExp = `${experienceSentence(brand)} Ik houd het bewust persoonlijk en laagdrempelig, zonder accountmanagers of onnodige tussenlagen.`;
  fixed_parts.push("experience");

  let paraExcl = "";
  if (input.city_exclusivity_available) {
    paraExcl = `\n\nVoor dit concept kies ik één Pilates studio per stad. Als we met ${business_name} aan de slag gaan, bied ik dit dus niet ook aan een directe Pilates-concurrent in ${city} aan.`;
    fixed_parts.push("exclusivity");
  }

  const paraClose = `Ben vooral benieuwd wat jullie van de opzet vinden.`;
  fixed_parts.push("close");

  const sig = signatureBlock(brand);
  fixed_parts.push("signature");

  if (slots.relevant_service) ai_parts.push("relevant_service");

  const body_text = [
    open,
    "",
    para1,
    "",
    para2,
    "",
    previewBlock,
    "",
    paraSeo,
    "",
    paraExp + paraExcl,
    "",
    paraClose,
    "",
    sig,
  ].join("\n");

  const subject = subjectFromSlots(business_name, slots.subject_variant);
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
}): OutreachPersonalizationSlots {
  return {
    opening_observation: input.opening_observation,
    primary_keyword: input.primary_keyword ?? `Pilates ${input.city}`,
    secondary_keyword: input.secondary_keywords[0] ?? null,
    relevant_service: input.relevant_service,
    wording_variant: "A",
    subject_variant: "made",
  };
}
