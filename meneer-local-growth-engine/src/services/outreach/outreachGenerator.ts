import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { getBrandSettings } from "@/services/outreach/brandSettingsLoader";
import { resolveBusinessContact } from "@/services/outreach/contactResolver";
import { buildPersonalizationContext } from "@/services/outreach/personalizationBuilder";
import { renderOutreachHtml } from "@/services/outreach/emailRenderer";
import { qualifyForOutreachDraft } from "@/services/outreach/outreachQualification";
import {
  deterministicSlots,
  renderHardenedOutreach,
} from "@/services/outreach/hardenedTemplate";
import {
  personalizationSchema,
  type OutreachPersonalizationSlots,
} from "@/services/outreach/personalizationSchema";
import { validateOutreachCopy } from "@/services/outreach/copyValidation";
import { formatPublicPreviewUrl } from "@/services/outreach/previewUrl";
import {
  getMeneerMarketingBaseUrl,
  getVerticalOfferConfig,
} from "@/config/verticalOffers";
import type { Business, OutreachMessage, PreviewRecord, SeoOpportunity } from "@/types/domain";

export type GenerationMethod = "HARDENED_TEMPLATE" | "LEGACY_AI" | "MANUAL_EDIT";

export interface GeneratedMail {
  subject: string;
  body_text: string;
  body_html: string;
  personalization_notes: string;
  facts_used: string[];
  facts_omitted: string[];
  confidence: number;
  anthropic_cost_usd: number;
  model: string | null;
  used_claude: boolean;
  generation_method: GenerationMethod;
  fixed_parts: string[];
  ai_parts: string[];
  slots: OutreachPersonalizationSlots;
  word_count: number;
}

function estimateCost(usage?: { input_tokens?: number; output_tokens?: number }): number {
  const input = usage?.input_tokens ?? 0;
  const output = usage?.output_tokens ?? 0;
  return (input / 1_000_000) * 1 + (output / 1_000_000) * 5;
}

function firstNameFromContact(name: string | null, businessName: string): string | null {
  if (!name) return null;
  const cleaned = name.trim();
  if (!cleaned || cleaned.toLowerCase() === businessName.toLowerCase()) return null;
  if (/studio|pilates|yoga|@/i.test(cleaned)) return null;
  const first = cleaned.split(/\s+/)[0] ?? "";
  if (first.length < 2 || first.length > 20) return null;
  return first;
}

/**
 * Eigenaren stellen zich op hun eigen site vaak voor. Die naam is beter dan een
 * generieke aanhef, en hij bepaalt ook of we "je" of "jullie" schrijven.
 */
const SELF_INTRODUCTION = [
  // De hoofdletter in "Mijn" mag variëren, de naam zelf moet er een hebben.
  /\b[Mm]ijn naam is\s+([A-Z][a-zà-ÿ]{2,15})\b/,
  /\b[Ii]k (?:ben|heet)\s+([A-Z][a-zà-ÿ]{2,15})\b/,
  /\b([A-Z][a-zà-ÿ]{2,15}),?\s+(?:oprichter|eigenaar|eigenares|instructeur|instructrice)\b/,
  /\b(?:oprichter|eigenaar|eigenares|instructeur|instructrice)\s+([A-Z][a-zà-ÿ]{2,15})\b/,
];

const NOT_A_NAME =
  /^(pilates|reformer|studio|somatics|arnhem|welkom|body|mind|move|movement|balance|core|flow)$/i;

function ownerFirstName(sentences: string[], businessName: string): string | null {
  const business = businessName.toLowerCase();
  for (const sentence of sentences) {
    for (const pattern of SELF_INTRODUCTION) {
      const match = pattern.exec(sentence);
      const candidate = match?.[1];
      if (!candidate) continue;
      if (NOT_A_NAME.test(candidate)) continue;
      if (business.includes(candidate.toLowerCase())) continue;
      return candidate;
    }
  }
  return null;
}

function pickObservationCandidates(input: {
  services: string[];
  primary_service: string | null;
  template_variant: string | null;
  studio_own_words: string[];
}): string[] {
  const out: string[] = [];
  // Hun eigen woorden zijn het meest herkenbaar, dus die gaan voorop.
  for (const sentence of input.studio_own_words.slice(0, 3)) {
    out.push(`Op je site staat "${sentence.replace(/"/g, "")}". Die toon heb ik aangehouden.`);
  }
  const blob = [...input.services, input.primary_service ?? ""].join(" ").toLowerCase();
  if (/reformer/.test(blob)) {
    out.push("Vooral de focus op Reformer Pilates viel me op.");
  }
  return out;
}

/**
 * Deterministische terugvaloptie voor de zin over hun site. Neemt de scherpste
 * constatering en maakt er gewone taal van, zodat de mail ook zonder Claude
 * concreet blijft.
 */
/** Woorden die de kern van een constatering dragen. */
function contentWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zà-ÿ\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 5);
}

/**
 * De zin over hun site mag alleen gaan over wat we werkelijk hebben gezien.
 * Zonder overlap met de constateringen valt hij terug op de deterministische
 * versie, want een verzonnen gebrek kost direct het vertrouwen.
 */
function guardSiteGap(
  candidate: string | null | undefined,
  findings: string[],
  fallback: string | null
): string | null {
  const sentence = tidyGapSentence(candidate);
  const reject = (reason: string): string | null => {
    if (process.env.OUTREACH_DEBUG === "1") {
      console.warn(`[site_gap] afgekeurd (${reason}): ${sentence ?? "leeg"}`);
    }
    return fallback;
  };

  if (!sentence) return reject("leeg");
  if (sentence.length < 20 || sentence.length > 240) return reject("lengte");
  // Negatie-openers en opsommingen mogen niet in de mail belanden.
  if (/(^|[.!?]\s+|,\s*)geen\b/i.test(sentence)) return reject("negatie");
  if (MARKETING_JARGON.test(sentence)) return reject("jargon");

  if (findings.length === 0) return null;

  // Claude mag herformuleren, maar niet over een ander probleem beginnen dan we
  // hebben vastgesteld. Thema's vergelijken laat parafrase toe, verzinsels niet.
  const knownThemes = new Set(gapThemes(findings.join(" ")));
  const claimedThemes = gapThemes(sentence);
  if (claimedThemes.length > 0) {
    const invented = claimedThemes.filter((theme) => !knownThemes.has(theme));
    return invented.length === 0 ? sentence : reject(`verzonnen: ${invented.join(", ")}`);
  }

  // Zonder herkenbaar thema valt hij terug op letterlijke overlap.
  const vocabulary = new Set(findings.flatMap(contentWords));
  const words = contentWords(sentence);
  const grounded = words.filter((word) => vocabulary.has(word)).length;
  return grounded >= 2 ? sentence : reject("niet onderbouwd");
}

/** Bureautaal waar een studio-eigenaar niets aan heeft. */
const MARKETING_JARGON =
  /onder de fold|above the fold|\bux\b|\bcta\b|funnel|conversieratio|responsive|viewport|bounce/i;

/** Lange streepjes en puntkomma's horen niet in onze copy. */
function tidyGapSentence(value: string | null | undefined): string | null {
  const sentence = value
    ?.replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
  return sentence && sentence.length > 0 ? sentence : null;
}

/**
 * Vaste, menselijke formuleringen per soort constatering. Rauwe judge-output
 * ("0% beschrijvende alt-teksten") zegt een studio-eigenaar niets, dus we
 * hertalen naar wat zij zelf op hun scherm zien.
 */
const GAP_PHRASINGS: Array<{ id: string; match: RegExp; weight: number; text: string }> = [
  {
    id: "empty",
    match: /witruimte|leeg|wit vlak|halverwege|onder de fold|blijft de pagina|scrolt/i,
    weight: 5,
    text: "zodra je naar beneden scrolt blijft de pagina grotendeels leeg",
  },
  {
    id: "schedule",
    match: /rooster|lesschema|schema|lestijden|tijden/i,
    weight: 4,
    text: "je lesrooster is nergens direct te vinden",
  },
  {
    id: "booking",
    match: /boekknop|boekingsplatform|boeken|boekingsknop|bsport|inschrijv|navigatie|menu/i,
    weight: 3,
    text: "je boekknop staat niet in het menu",
  },
  {
    id: "mobile",
    match: /mobiel|afgekapt|hamburger|telefoon/i,
    weight: 3,
    text: "op mobiel valt de opbouw uit elkaar",
  },
  {
    id: "imagery",
    match: /foto|beeldmateriaal|afbeelding|portret|beeld/i,
    weight: 2,
    text: "er staat nauwelijks eigen beeld van de studio op",
  },
  {
    id: "stale",
    match: /copyright|jaartal|20(1[0-9]|2[0-4])/i,
    weight: 1,
    text: "de footer staat nog op een oud jaartal",
  },
];

/** Welke soorten problemen een tekst aanraakt. */
function gapThemes(text: string): string[] {
  return GAP_PHRASINGS.filter((phrasing) => phrasing.match.test(text)).map(
    (phrasing) => phrasing.id
  );
}

function fallbackSiteGap(findings: string[]): string | null {
  const blob = findings.join(" ").toLowerCase();
  const picked = GAP_PHRASINGS.filter((phrasing) => phrasing.match.test(blob))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2)
    .map((phrasing) => phrasing.text);

  if (picked.length === 0) return null;
  return `Wat me op je huidige site opviel: ${picked.join(" en ")}.`;
}

async function fetchPersonalizationSlots(input: {
  ctx: ReturnType<typeof buildPersonalizationContext>;
  observationCandidates: string[];
  addressing: "singular" | "plural";
}): Promise<{ slots: OutreachPersonalizationSlots; cost: number; model: string | null; used: boolean }> {
  const fallback = deterministicSlots({
    primary_keyword: input.ctx.primary_keyword,
    secondary_keywords: input.ctx.secondary_keywords.filter((k) =>
      /reformer|studio/i.test(k)
    ),
    city: input.ctx.city,
    relevant_service: input.ctx.primary_service,
    opening_observation: input.observationCandidates[0] ?? null,
    site_gap: fallbackSiteGap(input.ctx.site_findings),
  });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { slots: fallback, cost: 0, model: null, used: false };
  }

  const model =
    process.env.OUTREACH_CLAUDE_MODEL ??
    process.env.CLAUDE_MODEL ??
    "claude-haiku-4-5-20251001";

  const client = new Anthropic({ apiKey });
  const prompt = `Je vult ALLEEN personalisatie-slots voor een vaste Meneer Marketing outreach-mail.
Je schrijft GEEN volledige mail.

Toon: Nederlands, informeel, "je" en "jouw", alsof één specialist de eigenaar
persoonlijk aanschrijft. Zakelijk jargon en lange streepjes zijn verboden.

Regels:
- site_gap: precies één zin over wat er nu op HUN site mist of stukloopt, in
  gewone taal, uitsluitend gebaseerd op de constateringen hieronder. Noem één of
  twee concrete dingen, niet een opsomming van alles. Zeg het feitelijk en
  zonder verwijt. Nooit iets toevoegen dat niet in de constateringen staat.
  Kies wat een bezoeker zelf merkt boven techniek onder de motorkap. Staat er
  een constatering over lege vlakken, witruimte of secties die halverwege
  stoppen? Begin daar dan mee, want dat is wat een bezoeker als eerste ziet.
  Daarna pas een verstopte boekknop of een rooster dat nergens staat.
  Spreek de eigenaar aan met "${input.addressing === "singular" ? "je" : "jullie"}".
  Verboden in deze zin: lange streepjes (— of –), puntkomma's, constructies die
  met "geen" beginnen, en bureautaal als "onder de fold", "UX", "CTA" of
  "funnel". Schrijf in plaats daarvan wat er ontbreekt of niet zichtbaar staat,
  bijvoorbeeld "een rooster ontbreekt", "je boekingsknop staat niet in het menu"
  of "zodra je naar beneden scrolt blijft de pagina leeg".
  Voorbeeldvorm: "Je opening staat er sterk, maar daaronder blijft de pagina
  leeg en een rooster ontbreekt." Als er geen constateringen zijn: null.
- opening_observation: max 1 korte zin uit de toegestane lijst, of null.
- primary_keyword: kies het beste beschikbare lokale keyword
- secondary_keyword: optioneel 1 extra, of null
- relevant_service: optioneel 1 echte dienst, of null
- subject_variant: chosen | city. Standaard chosen.
- Geen rankings, volumes, scores, garanties, salesjargon
- Geen nieuwe claims

Constateringen over hun huidige site, gesorteerd op wat een bezoeker het eerst
merkt. Dit is de enige bron voor site_gap en de bovenste weegt het zwaarst:
${
  input.ctx.site_findings
    .map((f, index) => (index === 0 ? `- (zwaarst) ${f}` : `- ${f}`))
    .join("\n") || "- (niets vastgesteld)"
}

Beschikbare keywords:
${[input.ctx.primary_keyword, ...input.ctx.secondary_keywords].filter(Boolean).join("\n")}

Diensten:
${input.ctx.services.join(", ") || input.ctx.primary_service || "Pilates"}

Voorkeur: primary_keyword bij voorkeur "Pilates ${input.ctx.city}" wanneer beschikbaar.
secondary_keyword mag Reformer/studio-variant zijn.

Toegestane observation candidates (kies er 0 of 1, of null):
${input.observationCandidates.map((c) => `- ${c}`).join("\n") || "- (geen)"}

Antwoord ALLEEN JSON:
{
  "site_gap": string|null,
  "opening_observation": string|null,
  "primary_keyword": string,
  "secondary_keyword": string|null,
  "relevant_service": string|null,
  "wording_variant": "A"|"B"|"C"|null,
  "subject_variant": "chosen"|"city"
}`;

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 400,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { slots: fallback, cost: estimateCost(response.usage), model, used: true };

    const parsed = personalizationSchema.safeParse(JSON.parse(jsonMatch[0]));
    if (!parsed.success) {
      return { slots: fallback, cost: estimateCost(response.usage), model, used: true };
    }

    // Guard: observation must be from candidates or null
    let observation = parsed.data.opening_observation;
    if (
      observation &&
      !input.observationCandidates.some(
        (c) => c.toLowerCase() === observation!.trim().toLowerCase()
      )
    ) {
      // Allow slight variation only if it mentions a known service
      const ok = input.ctx.services.some((s) =>
        observation!.toLowerCase().includes(s.toLowerCase())
      );
      if (!ok) observation = input.observationCandidates[0] ?? null;
    }

    const primaryAllowed = [
      input.ctx.primary_keyword,
      ...input.ctx.secondary_keywords,
      `Pilates ${input.ctx.city}`,
    ]
      .filter(Boolean)
      .map((k) => String(k).toLowerCase());

    let primary = parsed.data.primary_keyword;
    if (!primaryAllowed.includes(primary.toLowerCase())) {
      primary = fallback.primary_keyword;
    }

    let secondary = parsed.data.secondary_keyword;
    if (
      secondary &&
      !primaryAllowed.includes(secondary.toLowerCase())
    ) {
      secondary = fallback.secondary_keyword;
    }
    if (secondary && secondary.toLowerCase() === primary.toLowerCase()) {
      secondary = null;
    }

    const subject_variant = parsed.data.subject_variant === "city" ? "city" : "chosen";

    return {
      slots: {
        ...parsed.data,
        opening_observation: observation,
        site_gap: guardSiteGap(parsed.data.site_gap, input.ctx.site_findings, fallback.site_gap),
        primary_keyword: primary,
        secondary_keyword: secondary,
        subject_variant,
      },
      cost: estimateCost(response.usage),
      model,
      used: true,
    };
  } catch {
    return { slots: fallback, cost: 0, model: null, used: false };
  }
}

/**
 * De pagina op meneermarketing.nl met het aanbod voor deze branche. De
 * preview-slug gaat mee als herkomst, zodat een klik op die pagina terug te
 * leiden is naar deze mail.
 */
function buildOfferLandingUrl(previewSlug: string | null): string | null {
  // De engine draait voorlopig alleen Pilates; de config blijft de bron.
  const config = getVerticalOfferConfig("pilates");
  if (!config || !config.landingPageLive) return null;
  const base = getMeneerMarketingBaseUrl();
  const url = new URL(`${base}${config.landingPagePath}`);
  if (previewSlug) url.searchParams.set("ref", previewSlug);
  return url.toString();
}

function resolvePreviewUrl(input: {
  preview: PreviewRecord | null;
  brandPreviewBase: string;
}): string | null {
  if (!input.preview?.slug) return null;
  const base =
    input.brandPreviewBase ||
    process.env.OUTREACH_PREVIEW_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";
  if (base) return formatPublicPreviewUrl(base, input.preview.slug);
  return `/preview/${input.preview.slug}`;
}

export interface OutreachDraftResult {
  message: OutreachMessage;
  generated: GeneratedMail;
  contact_source: string | null;
  qualification_reasons: string[];
  validation_warnings: string[];
}

export async function generateOutreachDraft(input: {
  businessId: string;
  regenerate?: boolean;
  /**
   * Rendert de mail zonder poortjes en zonder iets op te slaan. Bedoeld om copy
   * te beoordelen voordat een studio de definitieve status heeft.
   */
  dryRun?: boolean;
  /** Dashboard-generatie gebruikt manual (soepelere poortjes). */
  qualificationMode?: "pipeline" | "manual";
}): Promise<OutreachDraftResult> {
  const client = createAdminClient();
  const { data: businessRow } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();
  if (!businessRow) throw new Error("Business niet gevonden");
  const business = businessRow as Business;

  const qualification = await qualifyForOutreachDraft(business, {
    mode: input.qualificationMode ?? "pipeline",
  });
  if (!qualification.ok && !input.dryRun) {
    throw new Error(`Niet klaar voor outreach draft: ${qualification.reasons.join(", ")}`);
  }

  const brand = await getBrandSettings();
  const resolved = await resolveBusinessContact(business);
  if (!resolved?.contact.email) {
    throw new Error("Geen bruikbaar zakelijk e-mailadres gevonden");
  }

  const [{ data: city }, { data: seo }, { data: preview }, { data: exclusivity }, { data: template }] =
    await Promise.all([
      client.from("cities").select("name").eq("id", business.city_id).single(),
      client.from("seo_opportunities").select("*").eq("business_id", business.id).maybeSingle(),
      client
        .from("previews")
        .select("*")
        .eq("business_id", business.id)
        .eq("status", "READY")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("city_exclusivity")
        .select("status, business_id")
        .eq("city_id", business.city_id)
        .eq("vertical_id", business.vertical_id)
        .maybeSingle(),
      business.selected_template_id
        ? client
            .from("templates")
            .select("variant")
            .eq("id", business.selected_template_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  if (!city?.name) throw new Error("City ontbreekt");
  if (!preview) throw new Error("READY preview ontbreekt");

  const previewUrl = resolvePreviewUrl({
    preview: preview as PreviewRecord,
    brandPreviewBase: brand.preview_base_url,
  });
  if (!previewUrl) throw new Error("Preview URL kon niet worden opgebouwd");

  // M8.4: geen city exclusivity pitch meer in outreach copy.
  const cityExclusivityAvailable = false;

  const ctx = buildPersonalizationContext({
    business,
    cityName: city.name as string,
    contact: resolved.contact,
    contactSource: resolved.source,
    seo: (seo as SeoOpportunity | null) ?? null,
    preview: preview as PreviewRecord,
    previewPublicUrl: previewUrl,
    templateVariant: (template as { variant?: string } | null)?.variant ?? null,
    cityExclusivityAvailable,
    brand,
  });

  const observationCandidates = pickObservationCandidates({
    services: ctx.services,
    primary_service: ctx.primary_service,
    template_variant: ctx.template_variant,
    studio_own_words: ctx.studio_own_words,
  });

  const owner = ownerFirstName(ctx.studio_own_words, ctx.business_name);
  // Eén studio, één eigenaar: "jij" past beter dan "jullie".
  const addressing: "singular" | "plural" = "singular";

  const { slots, cost, model, used } = await fetchPersonalizationSlots({
    ctx,
    observationCandidates,
    addressing,
  });

  const landingPageUrl = buildOfferLandingUrl(ctx.preview_slug);

  const rendered = renderHardenedOutreach({
    business_name: ctx.business_name,
    city: ctx.city,
    contact_first_name: firstNameFromContact(ctx.contact_name, ctx.business_name) ?? owner,
    preview_url: previewUrl,
    landing_page_url: landingPageUrl,
    city_exclusivity_available: cityExclusivityAvailable,
    addressing,
    brand,
    slots,
  });

  const validation = validateOutreachCopy({
    stage: "draft",
    subject: rendered.subject,
    body_text: rendered.body_text,
    business_name: ctx.business_name,
    city: ctx.city,
    preview_url: previewUrl,
    primary_keyword: slots.primary_keyword,
    city_exclusivity_available: cityExclusivityAvailable,
    brand,
  });

  if (!validation.ok) {
    throw new Error(`Hardened draft validation failed: ${validation.errors.join(", ")}`);
  }

  const generated: GeneratedMail = {
    subject: rendered.subject,
    body_text: rendered.body_text,
    body_html: renderOutreachHtml({
      bodyText: rendered.body_text,
      previewUrl,
      brand,
    }),
    personalization_notes: "HARDENED_TEMPLATE + structured slots",
    facts_used: [
      `Studio: ${ctx.business_name}`,
      `City: ${ctx.city}`,
      `Keyword: ${slots.primary_keyword}`,
      slots.secondary_keyword ? `Secondary: ${slots.secondary_keyword}` : null,
      slots.opening_observation ? `Observation: ${slots.opening_observation}` : null,
      cityExclusivityAvailable ? "Exclusivity paragraph" : null,
      `Years: ${brand.years_experience}`,
      `Sender mode: ${brand.outreach_sender_mode}`,
    ].filter(Boolean) as string[],
    facts_omitted: [
      "Exact rank",
      "Search volume numbers",
      "Lead score",
      "Winner confidence",
      "SEO opportunity score",
      "Ads upsell",
      "Prices",
    ],
    confidence: used ? 0.9 : 0.75,
    anthropic_cost_usd: cost,
    model,
    used_claude: used,
    generation_method: "HARDENED_TEMPLATE",
    fixed_parts: rendered.fixed_parts,
    ai_parts: rendered.ai_parts,
    slots,
    word_count: rendered.word_count,
  };

  if (input.dryRun) {
    return {
      message: {
        id: "dry-run",
        business_id: business.id,
        contact_id: resolved.contact.id,
        version: 0,
        subject: generated.subject,
        body: generated.body_text,
        body_text: generated.body_text,
        body_html: generated.body_html,
        preview_url: previewUrl,
        status: "DRAFT",
      } as unknown as OutreachMessage,
      generated,
      contact_source: resolved.source,
      qualification_reasons: qualification.reasons,
      validation_warnings: validation.warnings,
    };
  }

  const { data: existing } = await client
    .from("outreach_messages")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_test", false)
    .in("status", ["DRAFT", "REVIEW_REQUIRED", "APPROVED"])
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Prefer non-superseded active draft
  const now = new Date().toISOString();
  const status = validation.warnings.length ? "REVIEW_REQUIRED" : "DRAFT";

  const payload = {
    business_id: business.id,
    contact_id: resolved.contact.id,
    subject: generated.subject,
    body: generated.body_text,
    body_text: generated.body_text,
    body_html: generated.body_html,
    preview_url: previewUrl,
    status,
    generated_at: now,
    approved_at: null,
    personalization_metadata: {
      method: "HARDENED_TEMPLATE",
      slots,
      fixed_parts: generated.fixed_parts,
      ai_parts: generated.ai_parts,
      word_count: generated.word_count,
      warnings: validation.warnings,
      context: {
        city: ctx.city,
        contact_source: ctx.contact_source,
        city_exclusivity_available: cityExclusivityAvailable,
        sender_mode: brand.outreach_sender_mode,
      },
      used_claude: used,
    },
    generation_cost: generated.anthropic_cost_usd,
    generation_model: generated.model,
    generation_method: "HARDENED_TEMPLATE",
    facts_used: generated.facts_used,
    facts_omitted: generated.facts_omitted,
    outreach_basis: "primary_candidate_preview_seo",
    metadata: { regenerate: Boolean(input.regenerate) },
    updated_at: now,
  };

  let message: OutreachMessage;

  if (input.regenerate && existing) {
    await client
      .from("outreach_messages")
      .update({
        metadata: {
          ...((existing.metadata as Record<string, unknown>) ?? {}),
          superseded: true,
          superseded_at: now,
          previous_body_text: existing.body_text ?? existing.body,
          previous_subject: existing.subject,
        },
        updated_at: now,
      })
      .eq("id", existing.id);

    const { data: inserted, error } = await client
      .from("outreach_messages")
      .insert({
        ...payload,
        version: Number(existing.version ?? 1) + 1,
        previous_version_id: existing.id,
      })
      .select("*")
      .single();
    if (error || !inserted) throw new Error(error?.message ?? "Insert outreach mislukt");
    message = inserted as OutreachMessage;

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "OUTREACH_REGENERATED",
      title: `Outreach hardened v${message.version} · ${business.studio_name}`,
      description: generated.subject,
      metadata: {
        message_id: message.id,
        cost: generated.anthropic_cost_usd,
        method: "HARDENED_TEMPLATE",
      },
    });
  } else if (existing) {
    const { data: updated, error } = await client
      .from("outreach_messages")
      .update({
        ...payload,
        version: Number(existing.version ?? 1),
        metadata: {
          ...((existing.metadata as Record<string, unknown>) ?? {}),
          previous_body_text: existing.body_text ?? existing.body,
          previous_subject: existing.subject,
        },
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error(error?.message ?? "Update outreach mislukt");
    message = updated as OutreachMessage;

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "OUTREACH_DRAFT_GENERATED",
      title: `Outreach hardened draft · ${business.studio_name}`,
      description: generated.subject,
      metadata: { message_id: message.id, method: "HARDENED_TEMPLATE" },
    });
  } else {
    const { data: inserted, error } = await client
      .from("outreach_messages")
      .insert({ ...payload, version: 1 })
      .select("*")
      .single();
    if (error || !inserted) throw new Error(error?.message ?? "Insert outreach mislukt");
    message = inserted as OutreachMessage;

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "OUTREACH_DRAFT_GENERATED",
      title: `Outreach hardened draft · ${business.studio_name}`,
      description: generated.subject,
      metadata: { message_id: message.id, method: "HARDENED_TEMPLATE" },
    });
  }

  return {
    message,
    generated,
    contact_source: resolved.source,
    qualification_reasons: qualification.reasons,
    validation_warnings: validation.warnings,
  };
}
