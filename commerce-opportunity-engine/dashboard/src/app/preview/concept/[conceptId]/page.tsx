import Link from "next/link";
import { notFound } from "next/navigation";
import { PremiumPdpShell } from "@/preview/premium-dtc/PremiumPdpShell";
import {
  ConceptPreviewMark,
  DesignRationalePanel,
} from "@/preview/concepts/DesignRationalePanel";
import { loadConceptSnapshot } from "@/preview/concepts/loadConceptSnapshot";
import "@/preview/premium-dtc/tokens.css";
import "@/preview/premium-dtc/components.css";
import "@/preview/concepts/concept-chrome.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ conceptId: string }>;
  searchParams: Promise<{ review?: string; mode?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { conceptId } = await params;
  const snap = loadConceptSnapshot(conceptId);
  if (!snap) return { title: "Concept preview" };
  return {
    title: `${snap.model.product.title} · INTERNAL_PREVIEW`,
    description: `PREMIUM_DTC concept preview for ${snap.meta.domain}`,
    robots: { index: false, follow: false },
  };
}

export default async function ConceptPreviewPage({ params, searchParams }: Props) {
  const { conceptId } = await params;
  const sp = await searchParams;
  const snap = loadConceptSnapshot(conceptId);
  if (!snap) notFound();

  const mode =
    sp.review === "1" || sp.mode === "internal"
      ? "INTERNAL_REVIEW"
      : "PROSPECT_PREVIEW";

  return (
    <>
      <ConceptPreviewMark lifecycle={snap.meta.previewLifecycle} mode={mode} />
      <PremiumPdpShell
        model={snap.model}
        sectionVariants={snap.meta.sectionVariants}
      />
      <DesignRationalePanel
        items={snap.meta.rationale}
        brandName={snap.model.chrome.brandName}
        mode={mode}
      />
      {mode === "INTERNAL_REVIEW" ? (
        <div className="pdtc-internal-tools">
          <Link href={`/concepts/${snap.meta.conceptId}`}>Concept dossier</Link>
          <Link href={`/preview/concept/${snap.meta.conceptId}/compare`}>
            Current vs Concept
          </Link>
          <Link href="/preview/premium-dtc">NordTrail fixture</Link>
        </div>
      ) : null}
    </>
  );
}
