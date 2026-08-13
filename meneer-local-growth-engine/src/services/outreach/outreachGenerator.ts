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
import { ensureCampaignForBusiness } from "@/services/campaigns/campaignService";
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

function pickObservationCandidates(input: {
  services: string[];
  primary_service: string | null;
  template_variant: string | null;
}): string[] {
  const out: string[] = [];
  const blob = [...input.services, input.primary_service ?? ""].join(" ").toLowerCase();
  if (/reformer/.test(blob)) {
    out.push("Vooral jullie focus op Reformer Pilates viel me op.");
  }
  if (input.template_variant === "reformer-minimal" || input.template_variant === "soft-movement") {
    out.push(
      "Jullie studio heeft al een mooie rustige uitstraling, daarom heb ik het concept bewust in die richting gehouden."
    );
  }
  return out;
}

async function fetchPersonalizationSlots(input: {
  ctx: ReturnType<typeof buildPersonalizationContext>;
  observationCandidates: string[];
}): Promise<{ slots: OutreachPersonalizationSlots; cost: number; model: string | null; used: boolean }> {
  const fallback = deterministicSlots({
    primary_keyword: input.ctx.primary_keyword,
    secondary_keywords: input.ctx.secondary_keywords.filter((k) =>
      /reformer|studio/i.test(k)
    ),
    city: input.ctx.city,
    relevant_service: input.ctx.primary_service,
    opening_observation: input.observationCandidates[0] ?? null,
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

Regels:
- opening_observation: max 1 korte zin, of null. Alleen als betrouwbaar. Geen generieke complimenten.
- primary_keyword: kies het beste beschikbare lokale keyword
- secondary_keyword: optioneel 1 extra, of null
- relevant_service: optioneel 1 echte dienst, of null
- subject_variant: made | idea | concept | website
- Standaard subject_variant is made ("Ik heb iets gemaakt voor …"). concept is alleen als bewust alternatief.
- Geen rankings, volumes, scores, garanties, salesjargon
- Geen nieuwe claims
- Nederlandse output in de observation

Beschikbare keywords:
${[input.ctx.primary_keyword, ...input.ctx.secondary_keywords].filter(Boolean).join("\n")}

Diensten:
${input.ctx.services.join(", ") || input.ctx.primary_service || "Pilates"}

Voorkeur: primary_keyword bij voorkeur "Pilates ${input.ctx.city}" wanneer beschikbaar.
secondary_keyword mag Reformer/studio-variant zijn.
Voorkeur subject_variant: made.

Toegestane observation candidates (kies er 0 of 1, of null):
${input.observationCandidates.map((c) => `- ${c}`).join("\n") || "- (geen)"}

Antwoord ALLEEN JSON:
{
  "opening_observation": string|null,
  "primary_keyword": string,
  "secondary_keyword": string|null,
  "relevant_service": string|null,
  "wording_variant": "A"|"B"|"C"|null,
  "subject_variant": "made"|"idea"|"concept"|"website"
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

    // Product default subject; "concept" remains available via template / manual edit.
    const subject_variant = "made" as const;

    return {
      slots: {
        ...parsed.data,
        opening_observation: observation,
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
  if (base) {
    return formatPublicPreviewUrl(base.replace(/\/$/, ""), input.preview.slug);
  }
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
}): Promise<OutreachDraftResult> {
  const client = createAdminClient();
  const { data: businessRow } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();
  if (!businessRow) throw new Error("Business niet gevonden");
  const business = businessRow as Business;

  const qualification = await qualifyForOutreachDraft(business);
  if (!qualification.ok) {
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

  // Exclusivity pitch only when city can still be offered exclusively
  const cityExclusivityAvailable =
    !exclusivity ||
    exclusivity.status === "AVAILABLE" ||
    (exclusivity.status === "PRIMARY_CANDIDATE" &&
      exclusivity.business_id === business.id);

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
  });

  const { slots, cost, model, used } = await fetchPersonalizationSlots({
    ctx,
    observationCandidates,
  });

  const rendered = renderHardenedOutreach({
    business_name: ctx.business_name,
    city: ctx.city,
    contact_first_name: firstNameFromContact(ctx.contact_name, ctx.business_name),
    preview_url: previewUrl,
    city_exclusivity_available: cityExclusivityAvailable,
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

  // Ensure opaque campaign exists for preview → offer bridge
  try {
    await ensureCampaignForBusiness({
      businessId: business.id,
      outreachMessageId: message.id,
      createReservation: true,
    });
  } catch {
    // Campaign is additive; draft remains valid if campaign create fails
  }

  return {
    message,
    generated,
    contact_source: resolved.source,
    qualification_reasons: qualification.reasons,
    validation_warnings: validation.warnings,
  };
}
