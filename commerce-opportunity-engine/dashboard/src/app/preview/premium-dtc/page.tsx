import Link from "next/link";
import {
  PREMIUM_DTC_COMPONENT_MAPPING,
  PREMIUM_DTC_DEMO_MODEL,
  PREMIUM_DTC_SC_SOURCES,
  PremiumPdpShell,
  SKINCOMPLETE_ONLY_DO_NOT_HARDCODE,
} from "@/preview/premium-dtc/PremiumPdpShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "PREMIUM_DTC demo · COE",
  description:
    "Interne demo van de Meneer Marketing Conversion PDP (PREMIUM_DTC), gebaseerd op SkinComplete-principes.",
};

export default function PremiumDtcDemoPage() {
  return (
    <>
      <PremiumPdpShell
        model={PREMIUM_DTC_DEMO_MODEL}
        demoBanner={
          <div className="pdtc-demo-banner">
            INTERNE DEMO · PREMIUM_DTC · pets storytelling op SC design language ·{" "}
            <Link href="/concepts">Terug naar Concepts</Link>
          </div>
        }
      />

      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 24px 80px",
          fontFamily: "system-ui, sans-serif",
          color: "#334155",
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        <h2 style={{ fontSize: 18, color: "#0f172a" }}>Operator notes</h2>
        <p>
          Deze pagina is geen SkinComplete-kloon en geen prospectmail. Het is één
          samengestelde PREMIUM_DTC preview met dynamische section planning
          (pets: size/materials i.p.v. golflengtes).
        </p>

        <h3 style={{ marginTop: 28, fontSize: 15, color: "#0f172a" }}>
          SkinComplete sources
        </h3>
        <ul>
          {PREMIUM_DTC_SC_SOURCES.map((s) => (
            <li key={s}>
              <code>{s}</code>
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: 28, fontSize: 15, color: "#0f172a" }}>
          Component mapping
        </h3>
        <ul>
          {PREMIUM_DTC_COMPONENT_MAPPING.map((row) => (
            <li key={row.component}>
              <strong>{row.skinCompletePattern}</strong> →{" "}
              <code>{row.component}</code> → <code>{row.sectionType}</code>
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: 28, fontSize: 15, color: "#0f172a" }}>
          Niet hardcoden (SC-only)
        </h3>
        <ul>
          {SKINCOMPLETE_ONLY_DO_NOT_HARDCODE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
