import {
  getSenderDisplay,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";
import type { OutreachPersonalizationSlots } from "./personalizationSchema";

import {
  OUTREACH_OFFER_CTA,
  OUTREACH_PREVIEW_CTA,
} from "./outreachCopy";
import { getVerticalOfferConfig } from "@/config/verticalOffers";
import { normalizeVerticalSlug } from "@/verticals/runtime";

/** Zelfde instap als Studio/Clinic Edition op meneermarketing.nl (ex. btw). */
const DEFAULT_ENTRY_MONTHLY_EXCL_EUR = 89;

export interface HardenedTemplateInput {
  business_name: string;
  city: string;
  contact_first_name: string | null;
  preview_url: string;
  landing_page_url: string | null;
  website_url?: string | null;
  verticalSlug?: string;
  /** @deprecated M8.4 — city exclusivity is geen acquisition pitch meer. */
  city_exclusivity_available?: boolean;
  /** Eén eigenaar krijgt "je", een studio met een team krijgt "jullie". */
  addressing?: "singular" | "plural";
  brand: MeneerMarketingBrandSettings;
  slots: OutreachPersonalizationSlots;
  /** Deterministische concurrentiezin voor growth-plan alinea. */
  competitionSnippet?: string | null;
}

export interface HardenedRenderResult {
  subject: string;
  body_text: string;
  fixed_parts: string[];
  ai_parts: string[];
  word_count: number;
}

function experienceSentence(brand: MeneerMarketingBrandSettings): string {
  return brand.years_experience_phrase.replace(
    /\{\{years\}\}/g,
    String(brand.years_experience),
  );
}

function timeGreetingNl(date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("nl-NL", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Amsterdam",
    }).format(date),
  );
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

function salutationLine(firstName: string | null): string {
  const greeting = timeGreetingNl();
  if (firstName && firstName.length >= 2 && firstName.length <= 20) {
    return `${greeting} ${firstName},`;
  }
  return `${greeting},`;
}

function verticalCopy(verticalSlug: string) {
  const offer = getVerticalOfferConfig(verticalSlug);
  const outreach = offer?.outreach;
  const monthly = offer?.entryMonthlyExclEur ?? DEFAULT_ENTRY_MONTHLY_EXCL_EUR;
  const noun = offer?.businessNoun ?? "studio";

  return {
    introLead:
      outreach?.introLead ??
      "Ik help Pilates studio's met hun website en vindbaarheid in Google.",
    growthFocus: outreach?.growthFocus ?? "boekingen",
    partnershipTail: outreach?.partnershipTail ?? "studio",
    offerParagraphLabel: outreach?.offerParagraphLabel ?? "pilates",
    offerPageTeaser:
      outreach?.offerPageTeaser ??
      "Wil je meer weten hoe ik met pilates samenwerk en wat je van mij kunt verwachten?",
    defaultKeyword:
      outreach?.defaultPrimaryKeyword ??
      ((city: string) => `Pilates ${city}`),
    entryMonthlyExclEur: monthly,
    possessive: noun,
  };
}

function buildMeterUrl(
  brand: MeneerMarketingBrandSettings,
  websiteUrl: string | null | undefined,
): string | null {
  if (!websiteUrl?.trim()) return null;
  const base = brand.website.replace(/\/$/, "");
  return `${base}/meter?url=${encodeURIComponent(websiteUrl.trim())}`;
}

function buildWhatsAppUrl(
  brand: MeneerMarketingBrandSettings,
  businessName: string,
): string | null {
  const digits = brand.contact_phone.replace(/\D/g, "");
  if (!digits) return null;
  const text = `Hoi! Ik las je mail over ${businessName}. Ik heb een vraag.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function subjectFromSlots(
  businessName: string,
  city: string,
  variant: OutreachPersonalizationSlots["subject_variant"],
): string {
  switch (variant) {
    case "idea":
      return `Samenwerking met ${businessName}?`;
    case "city":
      return `Concept voor ${businessName} in ${city}`;
    case "concept":
      return `Concept voor ${businessName}`;
    case "website":
      return `Even over de website van ${businessName}`;
    case "made":
      return `${businessName}: kijk even mee`;
    case "chosen":
    default:
      return `Concept voor ${businessName}`;
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
  const email = brand.reply_to || brand.from_email || "info@meneermarketing.nl";
  const lines = ["Groet,", "", sender.signature_name];
  if (sender.signature_company) lines.push(sender.signature_company);
  lines.push(brand.tagline);
  lines.push(email);
  if (brand.contact_phone.trim()) lines.push(brand.contact_phone.trim());
  lines.push(`KVK ${brand.kvk || "42095913"}`);
  return lines.join("\n");
}

/**
 * Approved Meneer Marketing outreach structure.
 * AI only fills slots; structure stays fixed.
 */
export function renderHardenedOutreach(input: HardenedTemplateInput): HardenedRenderResult {
  const { business_name, city, brand, slots } = input;
  const verticalSlug = normalizeVerticalSlug(input.verticalSlug);
  const copy = verticalCopy(verticalSlug);
  const fixed_parts: string[] = [];
  const ai_parts: string[] = [];
  const you = voice(input.addressing ?? "singular");

  const salutation = salutationLine(input.contact_first_name);
  fixed_parts.push("salutation");

  let personalTail = "";
  if (slots.site_gap?.trim()) {
    personalTail = ` ${slots.site_gap.trim().replace(/\s+/g, " ")}`;
    ai_parts.push("site_gap");
  } else if (slots.opening_observation?.trim()) {
    personalTail = ` ${slots.opening_observation.trim().replace(/\s+/g, " ")}`;
    ai_parts.push("opening_observation");
  }

  const paraIntro = `${copy.introLead.trim()} ${experienceSentence(brand)} Voor ${city} zoek ik nog een ${copy.partnershipTail} om mee samen te werken. Daarbij viel mijn oog op ${business_name}.${personalTail}`;
  fixed_parts.push("intro");

  const paraConcept = `Om je meteen een beeld te geven heb ik al een concept uitgewerkt:\n\n${OUTREACH_PREVIEW_CTA}`;
  fixed_parts.push("concept");

  ai_parts.push("primary_keyword");
  if (slots.secondary_keyword) ai_parts.push("secondary_keyword");

  const keyword = slots.primary_keyword;
  const competitionTail = input.competitionSnippet?.trim();
  const paraGrowthPlan = `Wat ik voor ${you.yourPossessive} ${copy.partnershipTail} wil neerzetten is een sterke website en een plek in Google als mensen in ${city} zoeken op ${keyword}.${competitionTail ? ` ${competitionTail}` : ""} Makkelijke intake, mensen die terugkomen, meer ${copy.growthFocus} en meer bekendheid in de buurt. Niet alleen bezoekers, maar echte aanvragen en vertrouwen in de buurt.`;
  fixed_parts.push("growth_plan");

  const paraPartnership = `Het concept staat al. Dat is het startpunt. Samen bouwen we daar verder op tot het precies bij ${you.yourPossessive} ${copy.partnershipTail} past. Ik bouw alles zelf en blijf ${you.yourPossessive} vaste contact. Voor €${copy.entryMonthlyExclEur} per maand ex. btw heb je iemand die met je meedenkt, elke maand doorwerkt op Google en direct oppakt als er iets moet veranderen.`;
  fixed_parts.push("partnership");

  const paraOfferPage = `${copy.offerPageTeaser} Dat lees je hier (persoonlijke link, alleen voor jou):\n\n${OUTREACH_OFFER_CTA}`;
  fixed_parts.push("offer_page");

  const meterUrl = buildMeterUrl(brand, input.website_url);
  const paraMeter = meterUrl
    ? `Wil je alvast zien waar je site lekt? Plak je URL in de Meneer Meter:\n\n${meterUrl}`
    : null;
  if (paraMeter) fixed_parts.push("meter");

  const waUrl = buildWhatsAppUrl(brand, business_name);
  const paraWhatsApp = waUrl
    ? `Liever appen? Dat kan ook:\n\n${waUrl}`
    : null;
  if (paraWhatsApp) fixed_parts.push("whatsapp");

  const paraClose = `Bekijk het concept gerust wanneer het uitkomt. Ik ben benieuwd wat ${you.subject} ervan ${you.verbFind}.`;
  fixed_parts.push("close");

  const sig = signatureBlock(brand);
  fixed_parts.push("signature");

  if (slots.relevant_service) ai_parts.push("relevant_service");

  const body_text = [
    salutation,
    "",
    paraIntro,
    "",
    paraConcept,
    "",
    paraGrowthPlan,
    "",
    paraPartnership,
    "",
    paraOfferPage,
    "",
    ...(paraMeter ? [paraMeter, ""] : []),
    ...(paraWhatsApp ? [paraWhatsApp, ""] : []),
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
  verticalSlug?: string;
}): OutreachPersonalizationSlots {
  const verticalSlug = normalizeVerticalSlug(input.verticalSlug);
  const offer = getVerticalOfferConfig(verticalSlug);
  const defaultKeyword =
    offer?.outreach.defaultPrimaryKeyword(input.city) ??
    `Pilates ${input.city}`;

  return {
    opening_observation: input.opening_observation,
    site_gap: input.site_gap,
    primary_keyword: input.primary_keyword ?? defaultKeyword,
    secondary_keyword: input.secondary_keywords[0] ?? null,
    relevant_service: input.relevant_service,
    wording_variant: "A",
    subject_variant: "chosen",
  };
}