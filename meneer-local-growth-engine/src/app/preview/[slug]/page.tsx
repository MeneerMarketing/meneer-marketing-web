import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { PreviewCampaignTracker } from "@/components/preview/PreviewCampaignTracker";
import { PreviewFeedbackWidget } from "@/components/preview/PreviewFeedbackWidget";
import { buildLandingPageUrl, getVerticalOfferConfig } from "@/config/verticalOffers";
import { resolvePublicCampaignContext, resolveActiveCampaignRefForPreviewSlug } from "@/services/campaigns/campaignService";
import { resolvePreview } from "@/data/registry";
import { enrichStudioBrandColors } from "@/lib/enrichStudioBrand";
import { enrichStudioLogo } from "@/lib/enrichStudioLogo";
import { enrichStudioTeam } from "@/lib/enrichStudioTeam";
import { preparePreviewStudio } from "@/lib/preparePreviewStudio";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";
import { toCanonicalPreviewSlug } from "@/lib/previewSlug";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { StudioData, TemplateVariant } from "@/types/studio";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ template?: string; ref?: string }>;
}

async function withBrandStudio(
  studio: StudioData,
  websiteUrl?: string | null
): Promise<StudioData> {
  const prepared = preparePreviewStudio(studio);
  const withLogo = await enrichStudioLogo(prepared, websiteUrl);
  const withTeam = await enrichStudioTeam(withLogo, websiteUrl);
  return enrichStudioBrandColors(withTeam);
}

async function loadFromSupabase(slug: string): Promise<{
  studio: StudioData;
  variant: TemplateVariant;
} | null> {
  if (!isAdminConfigured()) return null;
  try {
    const client = createAdminClient();
    const canonical = toCanonicalPreviewSlug(slug);
    const previewSelect =
      "studio_snapshot, template_variant, status, slug, business_id, brand_profile_snapshot, businesses:business_id(logo, google_logo_url, primary_color, secondary_color, accent_color, website_url, vertical_id, verticals:vertical_id(slug))";

    let { data } = await client
      .from("previews")
      .select(previewSelect)
      .eq("slug", slug)
      .in("status", ["READY", "APPROVED", "DRAFT"])
      .maybeSingle();

    if (!data?.studio_snapshot && canonical !== slug) {
      const legacy = await client
        .from("previews")
        .select(previewSelect)
        .eq("slug", canonical)
        .in("status", ["READY", "APPROVED", "DRAFT"])
        .maybeSingle();
      if (!legacy.error) data = legacy.data;
    }

    if (!data?.studio_snapshot) {
      const fuzzy = await client
        .from("previews")
        .select(previewSelect)
        .like("slug", `${canonical}-%`)
        .in("status", ["READY", "APPROVED", "DRAFT"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!fuzzy.error) data = fuzzy.data;
    }

    if (!data?.studio_snapshot) return null;

    const snapshot = data.studio_snapshot as StudioData;
    const brandSnap = data.brand_profile_snapshot as
      | {
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          accent_color?: string;
        }
      | null;
    const businessJoin = data.businesses as
      | {
          logo?: string | null;
          google_logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          accent_color?: string | null;
          website_url?: string | null;
          vertical_id?: string;
          verticals?: { slug?: string } | null;
        }
      | null;
    const businessVerticalSlug = businessJoin?.verticals?.slug;
    const logoCandidate =
      snapshot.logo ??
      brandSnap?.logo_url ??
      businessJoin?.google_logo_url ??
      businessJoin?.logo ??
      null;
    const resolvedLogo = resolveStudioLogoUrl(logoCandidate);

    return {
      studio: await withBrandStudio({
        ...snapshot,
        vertical_slug: snapshot.vertical_slug ?? businessVerticalSlug ?? undefined,
        logo: resolvedLogo ?? logoCandidate,
        primary_color: snapshot.primary_color || brandSnap?.primary_color || businessJoin?.primary_color || snapshot.primary_color,
        secondary_color: snapshot.secondary_color || brandSnap?.secondary_color || businessJoin?.secondary_color || snapshot.secondary_color,
        accent_color: snapshot.accent_color || brandSnap?.accent_color || businessJoin?.accent_color || snapshot.accent_color,
      }, businessJoin?.website_url),
      variant: data.template_variant as TemplateVariant,
    };
  } catch {
    return null;
  }
}

async function resolveDynamic(slug: string, template?: string) {
  // Lokale demo's (Studio Forma) altijd uit registry — niet uit incomplete DB-snapshots.
  const fromRegistry = resolvePreview(slug, template);
  if (fromRegistry) {
    return {
      studio: await withBrandStudio(fromRegistry.studio),
      variant: fromRegistry.variant,
    };
  }

  const fromDb = await loadFromSupabase(slug);
  if (fromDb) {
    if (template && ["editorial", "reformer-minimal", "soft-movement", "clinical-atelier"].includes(template)) {
      return {
        studio: await withBrandStudio(fromDb.studio),
        variant: template as TemplateVariant,
      };
    }
    return fromDb;
  }

  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { template } = await searchParams;
  const resolved = await resolveDynamic(slug, template);

  if (!resolved) {
    return {
      title: "Preview niet gevonden",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Concept · ${resolved.studio.studio_name} · ${resolved.variant}`,
    description: `Conceptpreview voor ${resolved.studio.studio_name} in ${resolved.studio.city}. Samengesteld door Meneer Marketing.`,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const { template, ref: campaignRefParam } = await searchParams;
  const canonicalSlug = toCanonicalPreviewSlug(slug);

  if (canonicalSlug !== slug) {
    const qs = new URLSearchParams();
    if (template) qs.set("template", template);
    if (campaignRefParam) qs.set("ref", campaignRefParam);
    const query = qs.toString();
    redirect(query ? `/preview/${canonicalSlug}?${query}` : `/preview/${canonicalSlug}`);
  }

  const resolved = await resolveDynamic(slug, template);

  if (!resolved) {
    notFound();
  }

  let campaignRef: string | null = campaignRefParam ?? null;
  let landingUrl: string | null = null;
  let ctaLabel = "Dit concept laten bouwen?";
  let ctaSubline = "Bekijk mogelijkheden & prijzen →";

  if (!campaignRef) {
    campaignRef = await resolveActiveCampaignRefForPreviewSlug(slug);
  }

  if (campaignRef) {
    const ctx = await resolvePublicCampaignContext(campaignRef);
    if (ctx.valid) {
      landingUrl = buildLandingPageUrl({
        verticalSlug: ctx.vertical,
        campaignRef,
      });
      ctaLabel = ctx.preview_cta_label;
      const offer = getVerticalOfferConfig(ctx.vertical);
      if (offer?.previewCtaSubline) {
        ctaSubline = `${offer.previewCtaSubline} →`;
      }
    } else {
      campaignRef = null;
    }
  }

  return (
    <>
      <TemplateRenderer studio={resolved.studio} variant={resolved.variant} />
      <PreviewCampaignTracker
        campaignRef={campaignRef}
        landingUrl={landingUrl}
        ctaLabel={ctaLabel}
        ctaSubline={ctaSubline}
      />
      {campaignRef ? <PreviewFeedbackWidget campaignRef={campaignRef} /> : null}
    </>
  );
}
