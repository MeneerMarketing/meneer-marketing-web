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

function keywordSentence(slots: OutreachPersonalizationSlots): string {
  const primary = slots.primary_keyword;
  if (slots.secondary_keyword) {
    return `'${primary}' en '${slots.secondary_keyword}'`;
  }
  return `'${primary}'`;
}

function subjectFromSlots(
  businessName: string,
  city: string,
  variant: OutreachPersonalizationSlots["subject_variant"]
): string {
  switch (variant) {
    case "city":
      return `Pilates in ${city}: ${businessName}`;
    case "idea":
      return `Een idee voor ${businessName}`;
    case "concept":
      return `Concept voor ${businessName}`;
    case "website":
      return `Een website-concept voor ${businessName}`;
    case "made":
      return `Ik heb iets gemaakt voor ${businessName}`;
    case "chosen":
    default:
      return `Voor ${businessName} in ${city}`;
  }
}

/** Aanspreekvormen die met het aantal eigenaren meebewegen, inclusief vervoeging. */
function voice(addressing: "singular" | "plural") {
  const singular = addressing === "singular";
  return {
    you: singular ? "je" : "jullie",
    yourPossessive: singular ? "je" : "jullie",
    subject: singular ? "jij" : "jullie",
    verbFind: singular ? "vindt" : "vinden",
  };
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
  const you = voice(input.addressing ?? "singular");

  const open = greeting(input.contact_first_name);
  fixed_parts.push("greeting");

  const paraIntent = `Ik help Pilates studio's online sterker worden: website, vindbaarheid in Google en zichtbaarheid die nieuwe mensen op de mat trekt. In ${city} viel mijn oog op ${business_name}. Ik wil graag helpen ${you.yourPossessive} studio online naar een hoger niveau te tillen.`;
  fixed_parts.push("intent");

  let paraGap = "";
  if (slots.site_gap?.trim()) {
    paraGap = slots.site_gap.trim().replace(/\s+/g, " ");
    ai_parts.push("site_gap");
  } else if (slots.opening_observation?.trim()) {
    paraGap = slots.opening_observation.trim().replace(/\s+/g, " ");
    ai_parts.push("opening_observation");
  }

  const paraConcept = `Daarom heb ik geen standaard pitch gestuurd, maar een persoonlijk concept uitgewerkt in ${you.yourPossessive} kleuren en met ${you.yourPossessive} sfeer.${paraGap ? ` ${paraGap}` : ""}`;
  fixed_parts.push("concept");

  const previewBlock = `→ Bekijk ${you.yourPossessive} conceptwebsite
${input.preview_url}

Veilig voorbeeld via Meneer Marketing. Je opent het direct in je browser.`;
  fixed_parts.push("preview_trust");

  const keywords = keywordSentence(slots);
  ai_parts.push("primary_keyword");
  if (slots.secondary_keyword) ai_parts.push("secondary_keyword");

  const paraValue = `De opzet is gebouwd op ${keywords}, zodat mensen in ${city} ${you.yourPossessive} studio vinden als ze een proefles zoeken. Studio's die zo live gaan zien vaak meer verkeer, meer proeflessen en meer naamsbekendheid in de buurt.`;
  fixed_parts.push("value");

  const paraFeedback = `Ook als ${you.subject} er nu niet voor kiest: ik hoor graag wat ${you.subject} van de richting ${you.verbFind}. Eerlijke feedback is altijd welkom, met of zonder vervolgstap.`;
  fixed_parts.push("feedback");

  const paraOffer = `Studio Edition start vanaf €${STUDIO_EDITION_MONTHLY_EXCL_EUR} per maand ex. btw. Eén vast aanspreekpunt: ik ben bereikbaar en pak ${you.yourPossessive} online wensen direct op.`;
  fixed_parts.push("offer");

  let paraLanding = "";
  if (input.landing_page_url) {
    paraLanding = `Meer over hoe ik voor Pilates studio's werk:\n${input.landing_page_url}`;
    fixed_parts.push("landing_page");
  }

  const paraClose = `Ik ben vooral benieuwd wat ${you.subject} van het concept ${you.verbFind}. Stuur gerust een kort antwoord.`;
  fixed_parts.push("close");

  const sig = signatureBlock(brand);
  fixed_parts.push("signature");

  if (slots.relevant_service) ai_parts.push("relevant_service");

  const body_text = [
    open,
    "",
    paraIntent,
    "",
    paraConcept,
    "",
    previewBlock,
    "",
    paraValue,
    "",
    paraFeedback,
    "",
    paraOffer,
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
    subject_variant: "made",
  };
}
