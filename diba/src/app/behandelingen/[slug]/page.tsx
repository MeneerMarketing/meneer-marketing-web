import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BehandelTemplate from "@/components/templates/BehandelTemplate";
import { TREATMENTS } from "@/data/treatments";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { isPaginaAf, robotsVoor } from "@/lib/pagina-af";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = TREATMENTS.find((x) => x.slug === slug);
  if (!t) return {};
  return {
    title: t.titel.replace(/\*/g, ""),
    ...robotsVoor(isPaginaAf(t)),
  };
}

export default async function BehandelingPage({ params }: PageProps) {
  const { slug } = await params;
  const content = TREATMENTS.find((t) => t.slug === slug);
  if (!content) notFound();

  return (
    <BehandelTemplate content={content} {...PAGE_DEFAULTS} />
  );
}
