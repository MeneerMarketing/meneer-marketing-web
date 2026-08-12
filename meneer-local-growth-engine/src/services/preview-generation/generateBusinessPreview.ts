import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { slugify } from "@/lib/utils/normalize";
import type { StudioData, StudioImage, TemplateVariant } from "@/types/studio";
import { analyzeWebsite } from "./websiteIntelligence";
import { extractBrand } from "./brandExtractor";
import { extractServices } from "./serviceExtractor";
import { extractImages } from "./imageExtractor";
import { selectTemplate } from "./templateSelector";
import { generateContent } from "./contentGenerator";
import { personalizeSeo } from "./seoPersonalizer";
import type { ImageCandidate } from "./types";

export interface GeneratePreviewResult {
  ok: boolean;
  businessId: string;
  previewId?: string;
  slug?: string;
  variant?: TemplateVariant;
  confidence?: number;
  anthropic_cost_usd: number;
  images_selected: number;
  services: string[];
  seo?: { primary: string; secondary: string[] };
  brand?: {
    logo: boolean;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    confidence: number;
  };
  status: string;
  error?: string;
  previewUrl?: string;
}

function mapImages(candidates: ImageCandidate[], studioName: string): StudioImage[] {
  const used = new Set<string>();
  const pick = (
    type: ImageCandidate["semantic_type"] | "any",
    role: StudioImage["role"]
  ): StudioImage | null => {
    const hit =
      type === "any"
        ? candidates.find((c) => !used.has(c.url))
        : candidates.find((c) => c.semantic_type === type && !used.has(c.url)) ??
          candidates.find((c) => !used.has(c.url));
    if (!hit) return null;
    used.add(hit.url);
    return {
      id: `${role}-${used.size}`,
      url: hit.url,
      alt: hit.alt_text || `${studioName} ${role}`,
      role,
    };
  };

  const images: StudioImage[] = [];
  const hero = pick("hero", "hero") ?? pick("any", "hero");
  if (hero) images.push(hero);
  const studio = pick("studio", "studio") ?? pick("any", "studio");
  if (studio) images.push(studio);
  const reformer = pick("reformer", "reformer") ?? pick("any", "reformer");
  if (reformer) images.push(reformer);
  const atmosphere = pick("atmosphere", "atmosphere") ?? pick("any", "atmosphere");
  if (atmosphere) images.push(atmosphere);
  while (images.filter((i) => i.role === "gallery").length < 2) {
    const g = pick("gallery", "gallery") ?? pick("any", "gallery");
    if (!g) break;
    images.push(g);
  }
  return images;
}

function buildStudioData(input: {
  businessId: string;
  slug: string;
  studioName: string;
  city: string;
  country: string;
  brand: ReturnType<typeof extractBrand>;
  content: Awaited<ReturnType<typeof generateContent>>["content"];
  servicesPrimary: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  postal: string | null;
  booking: string | null;
  instagram: string | null;
  rating: number | null;
  reviewCount: number | null;
  images: StudioImage[];
  seo: ReturnType<typeof personalizeSeo>;
}): StudioData {
  return {
    id: input.businessId,
    slug: input.slug,
    studio_name: input.studioName,
    city: input.city,
    country: input.country,
    logo: input.brand.logo_url,
    primary_color: input.brand.primary_color,
    secondary_color: input.brand.secondary_color,
    accent_color: input.brand.accent_color,
    tagline: input.content.tagline || input.content.hero_subtitle,
    description: input.content.description || input.content.intro_text,
    primary_service: input.servicesPrimary,
    services: input.content.service_cards.map((s, i) => ({
      id: `svc-${i}`,
      name: s.name,
      description: s.description,
      highlight: s.highlight,
    })),
    phone: input.phone ?? "",
    email: input.email ?? "",
    address: input.address ?? "",
    postal_code: input.postal ?? "",
    booking_url: input.booking ?? (input.phone ? `tel:${input.phone.replace(/\s/g, "")}` : "#contact"),
    instagram_url: input.instagram ?? "",
    review_rating: input.rating ?? 0,
    review_count: input.reviewCount ?? 0,
    team: [],
    images: input.images,
    memberships: [],
    reviews: input.content.reviews.map((r, i) => ({
      id: `rev-${i}`,
      author: r.author,
      rating: r.rating,
      text: r.text,
    })),
    faqs: input.content.faq.map((f, i) => ({
      id: `faq-${i}`,
      question: f.question,
      answer: f.answer,
    })),
    benefits: input.content.benefits.map((b, i) => ({
      id: `ben-${i}`,
      title: b.title,
      description: b.description,
    })),
    primary_seo_keyword: input.seo.primary_keyword,
    secondary_seo_keywords: input.seo.secondary_keywords,
    opening_hours: "",
    founded_year: 0,
  };
}

export async function generateBusinessPreview(
  businessId: string,
  options?: { forceTemplate?: TemplateVariant; allowDemo?: boolean }
): Promise<GeneratePreviewResult> {
  const client = createAdminClient();
  const maxAnthropic = Number(process.env.PREVIEW_MAX_ANTHROPIC_COST_PER_RUN ?? 0.25);
  let anthropicCost = 0;

  const { data: business, error } = await client
    .from("businesses")
    .select("*, cities:city_id(id,name,slug,country_code)")
    .eq("id", businessId)
    .single();

  if (error || !business) {
    return {
      ok: false,
      businessId,
      anthropic_cost_usd: 0,
      images_selected: 0,
      services: [],
      status: "FAILED",
      error: "Business niet gevonden",
    };
  }

  const city = business.cities as { id: string; name: string; slug: string; country_code: string };
  const gates: string[] = [];
  if (business.is_demo && !options?.allowDemo) gates.push("DEMO record");
  if (business.qualification_status !== "QUALIFIED") gates.push("niet QUALIFIED");
  if (business.lead_eligible === false) gates.push("niet lead_eligible");
  if (business.is_chain) gates.push("keten");
  if (/permanently_closed|closed_forever/i.test(String(business.google_status ?? ""))) {
    gates.push("permanent gesloten");
  }
  if (!business.website_url) gates.push("geen website");

  if (gates.length) {
    return {
      ok: false,
      businessId,
      anthropic_cost_usd: 0,
      images_selected: 0,
      services: [],
      status: "FAILED",
      error: `Preview geweigerd: ${gates.join(", ")}`,
    };
  }

  await client
    .from("businesses")
    .update({
      preview_status: "ANALYZING",
      lead_status: business.lead_status === "DISCOVERED" ? "PREVIEW_GENERATING" : business.lead_status,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", businessId);

  await writeActivity(client, {
    business_id: businessId,
    activity_type: "PREVIEW_ANALYSIS_STARTED",
    title: `Preview analyse gestart · ${business.studio_name}`,
    description: city?.name ?? "",
  });

  try {
    const intelligence = await analyzeWebsite(business.website_url as string);
    await client
      .from("businesses")
      .update({ website_intelligence: intelligence, preview_status: "GENERATING" })
      .eq("id", businessId);

    const brand = extractBrand(
      intelligence,
      (business.google_logo_url as string | null) ?? (business.logo as string | null)
    );
    await writeActivity(client, {
      business_id: businessId,
      activity_type: "BRANDING_EXTRACTED",
      title: `Branding geëxtraheerd · confidence ${Math.round(brand.confidence * 100)}%`,
      description: `${brand.primary_color} / ${brand.accent_color} · logo ${brand.logo_source ?? "tekst"}`,
      metadata: brand as unknown as Record<string, unknown>,
    });

    const serviceResult = extractServices(intelligence);
    await writeActivity(client, {
      business_id: businessId,
      activity_type: "SERVICES_EXTRACTED",
      title: `Services geëxtraheerd · ${serviceResult.services.length}`,
      description: serviceResult.services.map((s) => s.service_name).join(", "),
    });

    const images = extractImages(intelligence, {
      google_main_image: business.google_main_image_url as string | null,
      google_logo: business.google_logo_url as string | null,
    });

    let template = selectTemplate({
      brand,
      services: serviceResult.services,
      images,
      intelligence,
      primaryService: serviceResult.primary_service,
    });
    if (options?.forceTemplate) {
      template = {
        variant: options.forceTemplate,
        confidence: 1,
        reasoning: `Handmatig gekozen: ${options.forceTemplate}`,
      };
    }

    await writeActivity(client, {
      business_id: businessId,
      activity_type: "TEMPLATE_SELECTED",
      title: `Template · ${template.variant}`,
      description: template.reasoning,
      metadata: { confidence: template.confidence },
    });

    await writeActivity(client, {
      business_id: businessId,
      activity_type: "PREVIEW_GENERATION_STARTED",
      title: `Copy generatie gestart · ${business.studio_name}`,
    });

    const contentResult = await generateContent({
      studioName: business.studio_name as string,
      city: city.name,
      country: (business.country as string) || "Nederland",
      address: business.address as string | null,
      phone: business.phone as string | null,
      primaryService: serviceResult.primary_service,
      services: serviceResult.services,
      brand,
      template,
      intelligence,
      rating: (business.google_rating as number | null) ?? (business.review_rating as number | null),
      reviewCount:
        (business.google_review_count as number | null) ?? (business.review_count as number | null),
      maxCostRemaining: maxAnthropic - anthropicCost,
    });
    anthropicCost += contentResult.anthropic_cost_usd;

    const seo = personalizeSeo({
      studioName: business.studio_name as string,
      city: city.name,
      primaryService: serviceResult.primary_service,
      services: serviceResult.services,
    });

    const studioImages = mapImages(images, business.studio_name as string);
    const previewSlug = `${slugify(business.studio_name as string)}-${city.slug}-${template.variant}`.slice(
      0,
      80
    );

    const studioSnapshot = buildStudioData({
      businessId,
      slug: previewSlug,
      studioName: business.studio_name as string,
      city: city.name,
      country: (business.country as string) || "Nederland",
      brand,
      content: contentResult.content,
      servicesPrimary: serviceResult.primary_service,
      phone: (business.phone as string | null) ?? intelligence.phones[0] ?? null,
      email: (business.email as string | null) ?? intelligence.emails[0] ?? null,
      address: business.address as string | null,
      postal: business.postal_code as string | null,
      booking: business.booking_url as string | null,
      instagram:
        (business.instagram_url as string | null) ?? intelligence.socials.instagram ?? null,
      rating: (business.google_rating as number | null) ?? (business.review_rating as number | null),
      reviewCount:
        (business.google_review_count as number | null) ?? (business.review_count as number | null),
      images: studioImages,
      seo,
    });

    const { data: templateRow } = await client
      .from("templates")
      .select("id, variant")
      .eq("variant", template.variant)
      .maybeSingle();

    if (!templateRow) throw new Error(`Template ${template.variant} ontbreekt in DB`);

    const generationMetadata = {
      anthropic_cost_usd: anthropicCost,
      model: contentResult.model,
      used_claude: contentResult.used_claude,
      pages_crawled: intelligence.pages.length,
      crawl_errors: intelligence.errors,
      generated_at: new Date().toISOString(),
    };

    // Archive previous ready previews for this business+variant
    await client
      .from("previews")
      .update({ status: "ARCHIVED", updated_at: new Date().toISOString() })
      .eq("business_id", businessId)
      .eq("template_variant", template.variant)
      .in("status", ["READY", "DRAFT", "GENERATING"]);

    const { data: preview, error: previewError } = await client
      .from("previews")
      .insert({
        business_id: businessId,
        template_id: templateRow.id,
        slug: previewSlug,
        template_variant: template.variant,
        status: "READY",
        published_at: new Date().toISOString(),
        generated_at: new Date().toISOString(),
        brand_profile_snapshot: brand,
        content_snapshot: contentResult.content,
        services_snapshot: serviceResult.services,
        images_snapshot: images,
        seo_snapshot: seo,
        studio_snapshot: studioSnapshot,
        generation_metadata: generationMetadata,
        template_selection_confidence: template.confidence,
        template_selection_reasoning: template.reasoning,
      })
      .select("id, slug")
      .single();

    if (previewError) throw previewError;

    const seoPayload = {
      business_id: businessId,
      vertical_id: business.vertical_id,
      city_id: business.city_id,
      primary_keyword: seo.primary_keyword,
      secondary_keywords: seo.secondary_keywords,
      status: "MEDIUM",
      seo_title: seo.seo_title,
      meta_description: seo.meta_description,
      h1_recommendation: seo.h1_recommendation,
      notes: "Gegenereerd tijdens preview pipeline (geen keyword API)",
      updated_at: new Date().toISOString(),
    };
    const { data: existingSeo } = await client
      .from("seo_opportunities")
      .select("id")
      .eq("business_id", businessId)
      .maybeSingle();
    if (existingSeo?.id) {
      await client.from("seo_opportunities").update(seoPayload).eq("id", existingSeo.id);
    } else {
      await client.from("seo_opportunities").insert(seoPayload);
    }

    await client
      .from("businesses")
      .update({
        brand_profile: brand,
        selected_template_id: templateRow.id,
        template_selection_confidence: template.confidence,
        template_selection_reasoning: template.reasoning,
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        accent_color: brand.accent_color,
        logo: brand.logo_url,
        tagline: studioSnapshot.tagline,
        description: studioSnapshot.description,
        primary_service: serviceResult.primary_service,
        services: studioSnapshot.services,
        images: studioSnapshot.images,
        benefits: studioSnapshot.benefits,
        faqs: studioSnapshot.faqs,
        reviews: studioSnapshot.reviews,
        primary_seo_keyword: seo.primary_keyword,
        secondary_seo_keywords: seo.secondary_keywords,
        preview_status: "READY",
        lead_status: "PREVIEW_READY",
        email: studioSnapshot.email || business.email,
        phone: studioSnapshot.phone || business.phone,
        instagram_url: studioSnapshot.instagram_url || business.instagram_url,
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", businessId);

    await writeActivity(client, {
      business_id: businessId,
      activity_type: "PREVIEW_CREATED",
      title: `Preview klaar · ${previewSlug}`,
      description: `${template.variant} · $${anthropicCost.toFixed(4)} · ${studioImages.length} beelden`,
      metadata: { preview_id: preview.id, slug: preview.slug },
    });

    return {
      ok: true,
      businessId,
      previewId: preview.id as string,
      slug: preview.slug as string,
      variant: template.variant,
      confidence: template.confidence,
      anthropic_cost_usd: anthropicCost,
      images_selected: studioImages.length,
      services: serviceResult.services.map((s) => s.service_name),
      seo: { primary: seo.primary_keyword, secondary: seo.secondary_keywords },
      brand: {
        logo: Boolean(brand.logo_url),
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        accent_color: brand.accent_color,
        confidence: brand.confidence,
      },
      status: "READY",
      previewUrl: `/preview/${preview.slug}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await client
      .from("businesses")
      .update({ preview_status: "FAILED", last_activity_at: new Date().toISOString() })
      .eq("id", businessId);
    await writeActivity(client, {
      business_id: businessId,
      activity_type: "PREVIEW_FAILED",
      title: `Preview mislukt · ${business.studio_name}`,
      description: message,
    });
    return {
      ok: false,
      businessId,
      anthropic_cost_usd: anthropicCost,
      images_selected: 0,
      services: [],
      status: "FAILED",
      error: message,
    };
  }
}
