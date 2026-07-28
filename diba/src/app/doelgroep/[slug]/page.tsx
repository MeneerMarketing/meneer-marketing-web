import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { doelgroepBySlug } from "@/data/doelgroep";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [
    { slug: "jongeren" },
    { slug: "mannen" },
    { slug: "huid-van-kleur" },
    { slug: "bruiden" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const d = doelgroepBySlug(slug);
  if (!d) return {};
  return { title: d.meta, description: "[COPY-NODIG]" };
}

export default async function DoelgroepPage({ params }: PageProps) {
  const { slug } = await params;
  const d = doelgroepBySlug(slug);
  if (!d) notFound();

  return (
    <ContentPageTemplate
      h1={d.titel}
      intro="[COPY-NODIG: doelgroep-intro] [MEDISCHE-CHECK-ROJDA]"
      breadcrumbLabel={d.meta}
      breadcrumbPath={`/doelgroep/${d.slug}`}
      secties={[
        {
          kop: "Wat speelt er *vaak*",
          alineas: ["[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]"],
        },
        {
          kop: "Het *Diba*-pad",
          alineas: ["[COPY-NODIG: traject en verwachtingen]"],
        },
      ]}
      primaireCta={{ label: "Start uw intake (4 min)", href: "/intake" }}
      {...PAGE_DEFAULTS}
    />
  );
}
