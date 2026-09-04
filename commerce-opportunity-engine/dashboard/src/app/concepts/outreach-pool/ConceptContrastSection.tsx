import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge, SectionTitle } from "@/components/ui";

type ContrastRow = {
  domain: string;
  band: string;
  contrast: number;
  confidence: number;
  ceiling: string | null;
  roomScore: number;
  capabilityScore: number;
  currentPdpQuality: number | null;
  transformation: number | null;
  salesFit: number;
  croDataSource: string;
  designTargetEligible: boolean;
  outreachEligible: boolean;
  blockedOnContrastOnly: boolean;
  evidence: string[];
};

export type ContrastReport = {
  milestone: string;
  finishedAt: string;
  thresholds: { designTarget: number; outreach: number };
  regression: {
    passed: number;
    total: number;
    cases: Array<{
      label: string;
      score: number;
      band: string;
      designTarget: boolean;
      passed: boolean;
      ceilingApplied: string | null;
    }>;
  };
  scored: number;
  bandCounts: Record<string, number>;
  designTargetEligible: number;
  newlyBlocked: ContrastRow[];
  rows: ContrastRow[];
};

const BAND_TONE: Record<string, "success" | "warn" | "danger" | "neutral"> = {
  ZEER_HOOG: "success",
  HOOG: "success",
  GEMIDDELD: "warn",
  LAAG: "danger",
  GEEN_CONTRAST: "danger",
};

export async function loadContrastReport(): Promise<ContrastReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/concept-contrast-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as ContrastReport;
  } catch {
    return null;
  }
}

export function ConceptContrastSection({ report }: { report: ContrastReport }) {
  const regressionOk = report.regression.passed === report.regression.total;

  return (
    <section className="space-y-5">
      <div>
        <SectionTitle eyebrow="M9.3.4" title="Concept contrast" />
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Hoe indrukwekkend wordt het verschil tussen de huidige productpagina en onze
          PREMIUM_DTC preview? Dit staat los van de vraag of het een goed bedrijf is. Een
          winkel die er al high-end uitziet, scoort hier laag en hoort dus niet als design
          target gekozen te worden, ook al klopt alles zakelijk.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {report.scored} kandidaten · design target vanaf {report.thresholds.designTarget} ·
          outreach vanaf {report.thresholds.outreach} ·{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            npm run concepts:contrast
          </code>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Contrast hoog genoeg
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {report.designTargetEligible}
          </p>
          <p className="text-xs text-slate-500">van {report.scored} kandidaten</p>
        </div>
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Verdeling
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(report.bandCounts).map(([band, count]) => (
              <Badge key={band} tone={BAND_TONE[band] ?? "neutral"}>
                {band} {count}
              </Badge>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Regressie
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {report.regression.passed}/{report.regression.total}
          </p>
          <p className="text-xs text-slate-500">
            {regressionOk ? "logica bewaakt door fixtures" : "let op: fixture faalt"}
          </p>
        </div>
      </div>

      {report.newlyBlocked.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">Alleen op contrast geblokkeerd</p>
          <p className="mt-1 text-xs">
            Zakelijk in orde, maar de preview zou te weinig verschil laten zien.
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            {report.newlyBlocked.map((row) => (
              <li key={row.domain}>
                <span className="font-medium">{row.domain}</span> · contrast {row.contrast} (
                {row.band}) · sales fit {row.salesFit}
                {row.ceiling ? ` · plafond: ${row.ceiling}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Domein</th>
                <th className="px-3 py-2">Contrast</th>
                <th className="px-3 py-2">Ruimte</th>
                <th className="px-3 py-2">Materiaal</th>
                <th className="px-3 py-2">Huidige PDP</th>
                <th className="px-3 py-2">Sales fit</th>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Plafond</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={row.domain} className="border-t border-mm-border align-top">
                  <td className="px-3 py-2 font-medium">{row.domain}</td>
                  <td className="px-3 py-2">
                    <Badge tone={BAND_TONE[row.band] ?? "neutral"}>
                      {row.contrast} {row.band}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.roomScore}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.capabilityScore}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {row.currentPdpQuality ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.salesFit}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{row.croDataSource}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{row.ceiling ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
