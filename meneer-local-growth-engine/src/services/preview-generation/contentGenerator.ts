import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { parseLlmJsonObject } from "@/lib/parseLlmJson";
import type {
  BrandProfile,
  ExtractedService,
  GeneratedContent,
  TemplateSelection,
  WebsiteIntelligence,
} from "./types";

const contentSchema = z.object({
  hero_eyebrow: z.string(),
  hero_title: z.string(),
  hero_subtitle: z.string(),
  intro_title: z.string(),
  intro_text: z.string(),
  tagline: z.string(),
  description: z.string(),
  service_cards: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      highlight: z.boolean().optional(),
    })
  ),
  reformer_section: z.string().nullable(),
  benefits: z.array(z.object({ title: z.string(), description: z.string() })),
  about_section: z.string(),
  location_section: z.string(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  cta_text: z.string(),
  reviews: z
    .array(z.object({ author: z.string(), rating: z.number(), text: z.string() }))
    .optional()
    .default([]),
});

export interface ContentGenerationResult {
  content: GeneratedContent;
  anthropic_cost_usd: number;
  model: string | null;
  used_claude: boolean;
}

function fallbackContent(input: {
  studioName: string;
  city: string;
  primaryService: string;
  services: ExtractedService[];
  rating: number | null;
  reviewCount: number | null;
  isClinic?: boolean;
}): GeneratedContent {
  const isClinic = input.isClinic ?? false;
  const primary = isClinic
    ? input.primaryService.replace(/\bpilates\b/gi, "huidbehandelingen") || "Medisch esthetische zorg"
    : input.primaryService;

  const cards = input.services.slice(0, 4).map((s, i) => ({
    name: isClinic ? s.service_name.replace(/\bpilates\b/gi, "behandeling") : s.service_name,
    description: s.short_factual_description,
    highlight: i === 0,
  }));
  if (cards.length === 0) {
    cards.push({
      name: primary,
      description: isClinic
        ? `${primary} in ${input.city}. Intake en huidanalyse als startpunt.`
        : `${primary} in ${input.city}.`,
      highlight: true,
    });
  }

  if (isClinic) {
    return {
      hero_eyebrow: `${input.city} · Huidkliniek`,
      hero_title: input.studioName,
      hero_subtitle: `Medisch esthetische zorg in ${input.city}`,
      intro_title: `Welkom bij ${input.studioName}`,
      intro_text: `${input.studioName} is een huidkliniek in ${input.city}. Je start met analyse en een plan dat bij jouw huid past.`,
      tagline: `Huidkliniek in ${input.city}`,
      description: `${input.studioName} in ${input.city}. Focus op ${primary.toLowerCase()} met persoonlijke intake en nazorg.`,
      service_cards: cards,
      reformer_section: null,
      benefits: [
        {
          title: "Gratis intake",
          description: "Start met huidanalyse en een helder behandelvoorstel.",
        },
        {
          title: "Clinical-grade aanpak",
          description: "Professionele behandelingen met duidelijke verwachtingen.",
        },
        {
          title: "Nazorg & onderhoud",
          description: "Plan dat meebeweegt met je huid op de lange termijn.",
        },
      ],
      about_section: `${input.studioName} is een huidkliniek in ${input.city}.`,
      location_section: `Bezoek ${input.studioName} in ${input.city}.`,
      faq: [
        {
          question: `Waar zit ${input.studioName}?`,
          answer: `In ${input.city}. Bekijk de huidige website voor het exacte adres.`,
        },
        {
          question: "Hoe start ik een behandeling?",
          answer: "Met een intake en huidanalyse. Daarna krijg je een voorstel op maat.",
        },
      ],
      cta_text: "Plan gratis intake",
      reviews: [],
    };
  }

  const cardsPilates = input.services.slice(0, 4).map((s, i) => ({
    name: s.service_name,
    description: s.short_factual_description,
    highlight: i === 0,
  }));
  if (cardsPilates.length === 0) {
    cardsPilates.push({
      name: input.primaryService,
      description: `${input.primaryService} in ${input.city}.`,
      highlight: true,
    });
  }

  return {
    hero_eyebrow: `${input.city} · ${input.primaryService}`,
    hero_title: input.studioName,
    hero_subtitle: `${input.primaryService} in ${input.city}`,
    intro_title: `Welkom bij ${input.studioName}`,
    intro_text: `${input.studioName} biedt ${input.primaryService.toLowerCase()} in ${input.city}. Dit conceptvoorstel is opgebouwd uit publieke studio-informatie.`,
    tagline: `${input.primaryService} in ${input.city}`,
    description: `${input.studioName} in ${input.city}. Focus op ${input.primaryService.toLowerCase()}${
      input.services.length > 1
        ? `, met ook ${input.services
            .slice(1, 3)
            .map((s) => s.service_name.toLowerCase())
            .join(" en ")}`
        : ""
    }.`,
    service_cards: cardsPilates,
    reformer_section: input.services.some((s) => s.service_type === "reformer")
      ? `Reformer training staat centraal bij ${input.studioName}. Gecontroleerde weerstand, scherpe instructie.`
      : null,
    benefits: [
      {
        title: "Lokaal en concreet",
        description: `Gevestigd in ${input.city}, met een aanbod dat past bij deze studio.`,
      },
      {
        title: "Heldere lessen",
        description: "Copy gebaseerd op wat publiek op de bestaande site te vinden is.",
      },
      {
        title: "Rustige uitstraling",
        description: "Premium, persoonlijk en zonder holle wellness-claims.",
      },
    ],
    about_section: `${input.studioName} is een Pilates-studio in ${input.city}.`,
    location_section: `Bezoek ${input.studioName} in ${input.city}.`,
    faq: [
      {
        question: `Waar zit ${input.studioName}?`,
        answer: `In ${input.city}. Bekijk de huidige website of Google-vermelding voor het exacte adres.`,
      },
      {
        question: "Welke lessen worden genoemd?",
        answer:
          input.services.map((s) => s.service_name).join(", ") || input.primaryService,
      },
    ],
    cta_text: "Plan een kennismaking",
    reviews: [],
  };
}

function estimateCost(usage: { input_tokens?: number; output_tokens?: number }): number {
  // Haiku rough public pricing estimate
  const inTokens = usage.input_tokens ?? 0;
  const outTokens = usage.output_tokens ?? 0;
  return (inTokens / 1_000_000) * 1.0 + (outTokens / 1_000_000) * 5.0;
}

export async function generateContent(input: {
  studioName: string;
  city: string;
  country: string;
  address: string | null;
  phone: string | null;
  primaryService: string;
  services: ExtractedService[];
  brand: BrandProfile;
  template: TemplateSelection;
  intelligence: WebsiteIntelligence;
  rating: number | null;
  reviewCount: number | null;
  maxCostRemaining: number;
  verticalSlug?: string;
}): Promise<ContentGenerationResult> {
  const isClinic = input.verticalSlug === "skin-clinics";
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

  if (!apiKey || input.maxCostRemaining <= 0.005) {
    return {
      content: fallbackContent({ ...input, isClinic }),
      anthropic_cost_usd: 0,
      model: null,
      used_claude: false,
    };
  }

  const facts = {
    studio: input.studioName,
    city: input.city,
    country: input.country,
    address: input.address,
    phone: input.phone,
    primaryService: input.primaryService,
    services: input.services.map((s) => ({
      name: s.service_name,
      type: s.service_type,
      note: s.short_factual_description,
    })),
    headings: input.intelligence.raw_headings.slice(0, 20),
    page_excerpts: input.intelligence.pages.map((p) => ({
      url: p.url,
      title: p.title,
      text: p.text.slice(0, 900),
    })),
    rating: input.rating,
    reviewCount: input.reviewCount,
    template: input.template.variant,
    brand: {
      primary: input.brand.primary_color,
      secondary: input.brand.secondary_color,
      accent: input.brand.accent_color,
    },
  };

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    max_tokens: 2200,
    temperature: 0.4,
    system: isClinic
      ? `Je schrijft premium Nederlandse webcopy voor een huidkliniek conceptwebsite van Meneer Marketing.
Regels:
- Gebruik ALLEEN feiten uit de input. Verzin geen medische diagnoses, resultaatbeloftes of prijzen.
- Schrijf clinical-grade, professioneel en rustig. Geen "medical-grade" of absolute behandelclaims.
- Gebruik "jij/je", informeel maar professioneel.
- Vermijd Pilates-, fitness- of reformer-taal volledig.
- Antwoord ALLEEN met geldige JSON volgens het gevraagde schema.`
      : `Je schrijft premium Nederlandse webcopy voor een Pilates conceptwebsite van Meneer Marketing.
Regels:
- Gebruik ALLEEN feiten uit de input. Verzin geen certificeringen, aantallen klanten, resultaten of prijzen.
- Vermijd clichés: "transform your body", "unlock your potential", overdreven wellness-taal.
- Toon: premium, rustig, persoonlijk, modern, professioneel.
- Schrijf in het Nederlands.
- Antwoord ALLEEN met geldige JSON volgens het gevraagde schema.`,
    messages: [
      {
        role: "user",
        content: isClinic
          ? `Maak gestructureerde sitecopy als JSON met keys:
hero_eyebrow, hero_title, hero_subtitle, intro_title, intro_text, tagline, description,
service_cards[{name,description,highlight?}], reformer_section|null (altijd null voor huidkliniek),
benefits[{title,description}], about_section, location_section, faq[{question,answer}], cta_text,
reviews[{author,rating,text}] (alleen als reviews/rating feitelijk bekend; anders []).

Feiten:
${JSON.stringify(facts, null, 2)}`
          : `Maak gestructureerde sitecopy als JSON met keys:
hero_eyebrow, hero_title, hero_subtitle, intro_title, intro_text, tagline, description,
service_cards[{name,description,highlight?}], reformer_section|null, benefits[{title,description}],
about_section, location_section, faq[{question,answer}], cta_text, reviews[{author,rating,text}] (alleen als reviews/rating feitelijk bekend; anders []).

Feiten:
${JSON.stringify(facts, null, 2)}`,
      },
    ],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n");

  const jsonObject = parseLlmJsonObject(text);
  if (!jsonObject) {
    return {
      content: fallbackContent({ ...input, isClinic }),
      anthropic_cost_usd: estimateCost(response.usage ?? {}),
      model,
      used_claude: true,
    };
  }

  const parsed = contentSchema.safeParse(jsonObject);
  if (!parsed.success) {
    return {
      content: fallbackContent({ ...input, isClinic }),
      anthropic_cost_usd: estimateCost(response.usage ?? {}),
      model,
      used_claude: true,
    };
  }

  return {
    content: parsed.data,
    anthropic_cost_usd: estimateCost(response.usage ?? {}),
    model,
    used_claude: true,
  };
}
