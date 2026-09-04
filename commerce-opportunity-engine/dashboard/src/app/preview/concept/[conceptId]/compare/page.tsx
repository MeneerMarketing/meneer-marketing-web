import Link from "next/link";
import { notFound } from "next/navigation";
import { loadConceptSnapshot } from "@/preview/concepts/loadConceptSnapshot";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ conceptId: string }> };

export default async function ConceptComparePage({ params }: Props) {
  const { conceptId } = await params;
  const snap = loadConceptSnapshot(conceptId);
  if (!snap) notFound();

  const shots = snap.meta.currentScreenshots;

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 20px 80px",
        fontFamily: "system-ui, sans-serif",
        color: "#1c1917",
      }}
    >
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#78716c" }}>
        Internal only · INTERNAL_PREVIEW
      </p>
      <h1 style={{ fontSize: 28, margin: "8px 0 12px" }}>Current PDP vs Concept</h1>
      <p style={{ color: "#57534e", maxWidth: 60 + "ch" }}>
        {snap.model.chrome.brandName} · {snap.model.product.title}. Dit is geen prospect-facing
        vergelijking, alleen voor interne beoordeling van de transformatie.
      </p>

      <div style={{ display: "flex", gap: 12, margin: "20px 0 32px", flexWrap: "wrap" }}>
        <Link href={`/preview/concept/${snap.meta.conceptId}`}>Open concept preview</Link>
        <a href={snap.meta.productUrl} target="_blank" rel="noopener noreferrer">
          Open huidige PDP
        </a>
        <Link href={`/concepts/${snap.meta.conceptId}`}>Concept dossier</Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <section style={{ border: "1px solid #e7e5e4", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>CURRENT PDP</h2>
          {shots.length > 0 ? (
            <ul style={{ paddingLeft: 18, color: "#57534e", fontSize: 14 }}>
              {shots.map((s) => (
                <li key={s.url}>
                  <code>{s.kind}</code>: {s.url}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#78716c", fontSize: 14 }}>
              Geen CRO-screenshot in brief. Open de live PDP-link hierboven voor vergelijking.
            </p>
          )}
        </section>
        <section style={{ border: "1px solid #e7e5e4", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>CONCEPT</h2>
          <p style={{ fontSize: 14, color: "#57534e" }}>
            PREMIUM_DTC {snap.meta.templateVersion} · lifecycle {snap.meta.previewLifecycle}
          </p>
          <ul style={{ fontSize: 14, color: "#57534e" }}>
            <li>Sections: {snap.model.sectionPlan.map((s) => s.section).join(", ")}</li>
            <li>
              Variants:{" "}
              {Object.entries(snap.meta.sectionVariants)
                .map(([k, v]) => `${k}=${v}`)
                .join(" · ") || "n/a"}
            </li>
            <li>
              Omitted:{" "}
              {snap.meta.omittedSections.map((o) => o.section).join(", ") || "none"}
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
