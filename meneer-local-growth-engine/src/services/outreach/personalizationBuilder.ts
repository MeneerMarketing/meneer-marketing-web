import type { Business, Contact, PreviewRecord, SeoOpportunity } from "@/types/domain";
import type { MeneerMarketingBrandSettings } from "@/config/brandSettings";

export interface OutreachPersonalizationContext {
  business_id: string;
  business_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_source: string | null;
  city: string;
  country: string;
  services: string[];
  primary_service: string | null;
  website_url: string | null;
  winner_reason: string | null;
  winner_confidence: number | null;
  lead_score: number | null;
  seo_opportunity: number | null;
  primary_keyword: string | null;
  secondary_keywords: string[];
  primary_search_volume: number | null;
  current_rank: number | null;
  preview_url: string;
  preview_slug: string | null;
  review_rating: number | null;
  review_count: number | null;
  template_variant: string | null;
  city_exclusivity_available: boolean;
  brand: MeneerMarketingBrandSettings;
  facts_for_prompt: string[];
  facts_to_omit_if_needed: string[];
  /**
   * Wat er op hun huidige site opvalt, uit de visuele beoordeling en de
   * deterministische signalen. Dit is de enige bron voor de zin over hun site,
   * zodat de mail nooit iets beweert dat we niet gezien hebben.
   */
  site_findings: string[];
  /** Zinnen uit hun eigen sitecopy, gebruikt om de eigenaar bij naam te vinden. */
  studio_own_words: string[];
}

/** Korte, concrete constateringen over de huidige site. */
function siteFindings(business: Business): string[] {
  const visual = business.visual_assessment as
    | { reason_negative?: unknown }
    | null
    | undefined;
  const signals = business.website_signals as { negatives?: unknown } | null | undefined;

  const fromVisual = Array.isArray(visual?.reason_negative)
    ? visual.reason_negative.map(String)
    : [];
  const fromSignals = Array.isArray(signals?.negatives) ? signals.negatives.map(String) : [];

  return [...fromVisual, ...fromSignals]
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 12 && line.length <= 160)
    .filter((line, index, list) => list.indexOf(line) === index)
    .sort((a, b) => findingWeight(b) - findingWeight(a))
    .slice(0, 8);
}

/**
 * Wat een bezoeker zelf ziet weegt zwaarder dan wat een crawler ziet: een lege
 * sectie of een verstopte boekknop overtuigt een eigenaar, alt-teksten niet.
 */
function findingWeight(line: string): number {
  if (/witruimte|leeg|wit vlak|afgekapt|kapot|mobiel|niet zichtbaar|ontbreekt/i.test(line)) return 3;
  if (/boek|rooster|schema|foto|beeld|contact/i.test(line)) return 2;
  if (/alt-tekst|responsive|resolutie|schema\.org|seo/i.test(line)) return 0;
  return 1;
}

/**
 * Zinnen uit de conceptcopy, die op hun eigen site gebaseerd is. Lang genoeg om
 * inhoud te hebben, kort genoeg om een losse zin te blijven.
 */
function studioOwnWords(preview: PreviewRecord | null): string[] {
  const snapshot = preview?.content_snapshot as Record<string, unknown> | null | undefined;
  if (!snapshot) return [];
  return ["tagline", "description", "about_section", "intro_text", "reformer_section"]
    .map((key) => snapshot[key])
    .filter((value): value is string => typeof value === "string")
    .flatMap((value) => value.split(/(?<=[.!?])\s+/))
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 25 && sentence.length <= 180)
    .filter((sentence, index, list) => list.indexOf(sentence) === index)
    .slice(0, 14);
}

function serviceNames(business: Business): string[] {
  if (!Array.isArray(business.services)) return [];
  return business.services
    .map((s) => {
      if (s && typeof s === "object" && "name" in s) {
        return String((s as { name?: string }).name ?? "").trim();
      }
      if (s && typeof s === "object" && "service_name" in s) {
        return String((s as { service_name?: string }).service_name ?? "").trim();
      }
      return "";
    })
    .filter(Boolean)
    .slice(0, 6);
}

export function buildPersonalizationContext(input: {
  business: Business;
  cityName: string;
  contact: Contact | null;
  contactSource: string | null;
  seo: SeoOpportunity | null;
  preview: PreviewRecord | null;
  previewPublicUrl: string;
  templateVariant: string | null;
  cityExclusivityAvailable: boolean;
  brand: MeneerMarketingBrandSettings;
}): OutreachPersonalizationContext {
  const { business, seo, brand } = input;
  const services = serviceNames(business);
  const secondary = seo?.secondary_keywords ?? business.secondary_seo_keywords ?? [];

  const facts_for_prompt = [
    `Studio: ${business.studio_name}`,
    `Plaats: ${input.cityName}`,
    input.contact?.name ? `Contact: ${input.contact.name}` : null,
    services.length ? `Diensten: ${services.join(", ")}` : null,
    business.primary_service ? `Primaire dienst: ${business.primary_service}` : null,
    seo?.primary_keyword
      ? `Primair zoekwoord: ${seo.primary_keyword}${
          seo.primary_search_volume != null
            ? ` (volume ~${seo.primary_search_volume}/maand)`
            : ""
        }`
      : null,
    seo?.current_rank != null
      ? `Huidige organische positie op primair zoekwoord: #${seo.current_rank} (subtiel gebruiken, geen harde claims)`
      : null,
    business.winner_reason ? `Selectiereden intern: ${business.winner_reason}` : null,
    `Preview URL: ${input.previewPublicUrl}`,
    input.cityExclusivityAvailable
      ? "City exclusivity beschikbaar: mag subtiel één studio per stad noemen"
      : "City exclusivity NIET gebruiken",
    `Ervaring: ${brand.years_experience} jaar`,
    `Afzender: ${brand.sender_name} van ${brand.brand_name}`,
  ].filter(Boolean) as string[];

  const facts_to_omit_if_needed = [
    "Exacte lead score cijfers",
    "Winner confidence cijfers",
    "Interne scorecomponenten",
    "Concurrentnamen",
    "Ads / Meta / Google Ads upsell",
    "Prijzen",
  ];

  return {
    business_id: business.id,
    business_name: business.studio_name,
    contact_name: input.contact?.name ?? null,
    contact_email: input.contact?.email ?? null,
    contact_source: input.contactSource,
    city: input.cityName,
    country: business.country,
    services,
    primary_service: business.primary_service,
    website_url: business.website_url,
    winner_reason: business.winner_reason ?? null,
    winner_confidence:
      business.winner_confidence != null ? Number(business.winner_confidence) : null,
    lead_score: business.lead_score != null ? Number(business.lead_score) : null,
    seo_opportunity:
      business.seo_opportunity_score != null
        ? Number(business.seo_opportunity_score)
        : seo?.seo_opportunity_score != null
          ? Number(seo.seo_opportunity_score)
          : null,
    primary_keyword: seo?.primary_keyword ?? business.primary_seo_keyword,
    secondary_keywords: secondary.slice(0, 4),
    primary_search_volume: seo?.primary_search_volume ?? null,
    current_rank: seo?.current_rank ?? null,
    preview_url: input.previewPublicUrl,
    preview_slug: input.preview?.slug ?? null,
    review_rating: business.google_rating ?? business.review_rating,
    review_count: business.google_review_count ?? business.review_count,
    template_variant: input.templateVariant,
    city_exclusivity_available: input.cityExclusivityAvailable,
    brand,
    facts_for_prompt,
    facts_to_omit_if_needed,
    site_findings: siteFindings(business),
    studio_own_words: studioOwnWords(input.preview),
  };
}
