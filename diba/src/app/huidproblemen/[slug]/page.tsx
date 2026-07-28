import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillarTemplate from "@/components/templates/PillarTemplate";
import { PILLARS } from "@/data/pillars";
import { reviewsForPillar } from "@/lib/review-mining";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = PILLARS.find((p) => p.slug === slug);
  if (!pillar) return {};

  return {
    title: pillar.titel.replace(/\*/g, ""),
    description: "[COPY-NODIG]",
  };
}

export default async function PillarPage({ params }: PageProps) {
  const { slug } = await params;
  const content = PILLARS.find((p) => p.slug === slug);
  if (!content) notFound();

  const enriched = {
    ...content,
    reviews: content.reviews.length > 0 ? content.reviews : reviewsForPillar(slug),
  };

  return (
    <PillarTemplate
      content={enriched}
      proofItems={[...DIBA_PROOF_STRIP_ITEMS]}
      whatsappHref={DIBA_WHATSAPP_URL}
      siteUrl={DIBA_SITE_URL}
    />
  );
}
