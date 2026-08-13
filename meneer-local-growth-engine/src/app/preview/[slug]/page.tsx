import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { PreviewCampaignTracker } from "@/components/preview/PreviewCampaignTracker";
import { resolvePreview } from "@/data/registry";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import {
  ensureCampaignForBusiness,
  getCampaignLandingUrl,
} from "@/services/campaigns/campaignService";
import { buildLandingPageUrl } from "@/config/verticalOffers";
import type { StudioData, TemplateVariant } from "@/types/studio";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ template?: string; ref?: string }>;
}

function isUsableStudioSnapshot(value: unknown): value is StudioData {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const studio = value as Partial<StudioData>;
  return Boolean(
    studio.studio_name &&
      studio.city &&
      studio.tagline &&
      Array.isArray(studio.services)
  );
}

async function loadFromSupabase(slug: string): Promise<{
  studio: StudioData;
  variant: TemplateVariant;
  previewId: string | null;
  businessId: string | null;
} | null> {
  if (!isAdminConfigured()) return null;
  try {
    const client = createAdminClient();
    const { data } = await client
      .from("previews")
      .select("id, business_id, studio_snapshot, template_variant, status, slug")
      .eq("slug", slug)
      .in("status", ["READY", "APPROVED", "DRAFT"])
      .maybeSingle();

    if (!isUsableStudioSnapshot(data?.studio_snapshot)) return null;
    return {
      studio: data.studio_snapshot,
      variant: data.template_variant as TemplateVariant,
      previewId: (data.id as string) ?? null,
      businessId: (data.business_id as string) ?? null,
    };
  } catch {
    return null;
  }
}

async function resolveDynamic(slug: string, template?: string) {
  const fromDb = await loadFromSupabase(slug);
  if (fromDb) {
    if (template && ["editorial", "reformer-minimal", "soft-movement"].includes(template)) {
      return {
        studio: fromDb.studio,
        variant: template as TemplateVariant,
        previewId: fromDb.previewId,
        businessId: fromDb.businessId,
      };
    }
    return fromDb;
  }
  const demo = resolvePreview(slug, template);
  if (!demo) return null;
  return {
    studio: demo.studio,
    variant: demo.variant,
    previewId: null,
    businessId: null,
  };
}

async function resolveCampaignForPreview(input: {
  ref?: string;
  businessId: string | null;
}): Promise<{ ref: string; landingUrl: string } | null> {
  if (!isAdminConfigured()) return null;
  try {
    const client = createAdminClient();

    if (input.ref) {
      const { data } = await client
        .from("campaigns")
        .select("campaign_ref, status, business_id")
        .eq("campaign_ref", input.ref)
        .eq("status", "ACTIVE")
        .maybeSingle();
      if (data?.campaign_ref) {
        const landing =
          buildLandingPageUrl({
            verticalSlug: "pilates",
            campaignRef: data.campaign_ref as string,
          }) || null;
        if (landing) return { ref: data.campaign_ref as string, landingUrl: landing };
      }
    }

    if (!input.businessId) return null;

    const { data: existing } = await client
      .from("campaigns")
      .select("*")
      .eq("business_id", input.businessId)
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const campaign =
      existing ||
      (await ensureCampaignForBusiness({
        businessId: input.businessId,
        createReservation: false,
      }));

    const landing = await getCampaignLandingUrl(campaign);
    if (!landing) return null;
    return { ref: campaign.campaign_ref, landingUrl: landing };
  } catch {
    return null;
  }
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
  const { template, ref } = await searchParams;
  const resolved = await resolveDynamic(slug, template);

  if (!resolved) {
    notFound();
  }

  const campaign = await resolveCampaignForPreview({
    ref,
    businessId: resolved.businessId,
  });

  return (
    <>
      <TemplateRenderer studio={resolved.studio} variant={resolved.variant} />
      <PreviewCampaignTracker
        campaignRef={campaign?.ref ?? null}
        landingUrl={campaign?.landingUrl ?? null}
      />
    </>
  );
}
