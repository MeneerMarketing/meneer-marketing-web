import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { resolvePreview } from "@/data/registry";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { StudioData, TemplateVariant } from "@/types/studio";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ template?: string }>;
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
} | null> {
  if (!isAdminConfigured()) return null;
  try {
    const client = createAdminClient();
    const { data } = await client
      .from("previews")
      .select("studio_snapshot, template_variant, status, slug")
      .eq("slug", slug)
      .in("status", ["READY", "APPROVED", "DRAFT"])
      .maybeSingle();

    // Seeded rows often have studio_snapshot = {} (truthy but unusable).
    // Fall through to the demo registry instead of crashing templates.
    if (!isUsableStudioSnapshot(data?.studio_snapshot)) return null;
    return {
      studio: data.studio_snapshot,
      variant: data.template_variant as TemplateVariant,
    };
  } catch {
    return null;
  }
}

async function resolveDynamic(slug: string, template?: string) {
  const fromDb = await loadFromSupabase(slug);
  if (fromDb) {
    if (template && ["editorial", "reformer-minimal", "soft-movement"].includes(template)) {
      return { studio: fromDb.studio, variant: template as TemplateVariant };
    }
    return fromDb;
  }
  return resolvePreview(slug, template);
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
  const { template } = await searchParams;
  const resolved = await resolveDynamic(slug, template);

  if (!resolved) {
    notFound();
  }

  return <TemplateRenderer studio={resolved.studio} variant={resolved.variant} />;
}
