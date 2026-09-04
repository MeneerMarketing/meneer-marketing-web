import { Badge, Panel } from "@/components/dashboard/ui";
import type { Business } from "@/types/domain";

/**
 * ACQUISITION FIT block (M8.3): why this studio is or is not a redesign
 * prospect, in plain language plus the numbers behind it.
 */

const PROSPECT_COPY: Record<string, { label: string; tone: "success" | "sky" | "warn" | "neutral" }> =
  {
    WEBSITE_TRANSFORMATION: { label: "WEBSITE TRANSFORMATION", tone: "success" },
    GROWTH_ONLY: { label: "GROWTH ONLY", tone: "sky" },
    WEAK_BUSINESS: { label: "ZWAK BEDRIJF", tone: "warn" },
    NOT_ELIGIBLE: { label: "NIET GESCHIKT", tone: "neutral" },
    UNKNOWN: { label: "NOG NIET BEOORDEELD", tone: "neutral" },
  };

interface ComponentRow {
  key: string;
  label: string;
  raw: number;
  weight: number;
  contribution: number;
}

interface TransformationComponents {
  components?: ComponentRow[];
  effective_website_quality?: number;
  effective_website_opportunity?: number;
  visual_included?: boolean;
  contactability?: number;
  reasons?: { positives?: string[]; negatives?: string[] };
  gates_failed?: string[];
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-mm-border bg-mm-surface/40 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 text-lg font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

export function AcquisitionFitPanel({ business }: { business: Business }) {
  const type = String(business.prospect_type ?? "UNKNOWN");
  const copy = PROSPECT_COPY[type] ?? PROSPECT_COPY.UNKNOWN;
  const parts = (business.transformation_components ?? null) as TransformationComponents | null;

  const quality = parts?.effective_website_quality ?? business.website_quality_score ?? null;
  const opportunity =
    parts?.effective_website_opportunity ?? business.website_opportunity_score ?? null;
  const positives = parts?.reasons?.positives ?? [];
  const negatives = parts?.reasons?.negatives ?? [];

  if (!business.prospect_type) {
    return (
      <Panel title="Acquisition fit">
        <p className="text-sm text-slate-500">
          Deze studio is nog niet beoordeeld. Draai de acquisition fit voor deze stad om prospect
          type, transformation score en preview-eligibility te bepalen.
        </p>
      </Panel>
    );
  }

  return (
    <Panel title="Acquisition fit">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={copy.tone}>{copy.label}</Badge>
        {business.preview_eligible ? (
          <Badge tone="success">PREVIEW ELIGIBLE</Badge>
        ) : (
          <Badge tone="neutral">GEEN AUTO-PREVIEW</Badge>
        )}
        {business.transformation_city_rank != null ? (
          <Badge tone="sky">TRANSFORMATION #{business.transformation_city_rank}</Badge>
        ) : null}
        {business.visual_transformation_fit ? (
          <Badge tone="warn">VISUELE FIT {business.visual_transformation_fit}</Badge>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {business.prospect_type_reason ?? "Geen toelichting opgeslagen."}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Transformation score"
          value={
            business.website_transformation_score != null
              ? Math.round(Number(business.website_transformation_score))
              : "—"
          }
        />
        <Metric label="Website kwaliteit" value={quality != null ? Math.round(Number(quality)) : "—"} />
        <Metric
          label="Website opportunity"
          value={opportunity != null ? Math.round(Number(opportunity)) : "—"}
        />
        <Metric
          label="Merkmateriaal"
          value={
            business.brand_asset_usability_score != null
              ? Math.round(Number(business.brand_asset_usability_score))
              : "—"
          }
        />
      </div>

      {business.visual_assessment_source ? (
        <div className="mt-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Visuele beoordeling
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {business.visual_assessment_source === "CLAUDE_VISION"
              ? `Claude Vision (${business.visual_assessment_model ?? "onbekend model"}) · vertrouwen ${business.visual_assessment_confidence ?? "—"}`
              : "Deterministische fallback op basis van HTML-signalen, geen screenshotbeoordeling."}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Visuele kwaliteit" value={business.visual_quality_score ?? "—"} />
            <Metric label="Moderniteit" value={business.visual_modernity_score ?? "—"} />
            <Metric label="Mobiel" value={business.visual_mobile_score ?? "—"} />
            <Metric
              label="Gat studio vs site"
              value={business.business_presentation_gap_score ?? "—"}
            />
          </div>
        </div>
      ) : null}

      {business.screenshot_desktop_url || business.screenshot_mobile_url ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {business.screenshot_desktop_url ? (
            <a
              href={business.screenshot_desktop_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-[0.12em] text-[#C2410C] hover:underline"
            >
              Desktop screenshot
            </a>
          ) : null}
          {business.screenshot_mobile_url ? (
            <a
              href={business.screenshot_mobile_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-[0.12em] text-[#C2410C] hover:underline"
            >
              Mobiele screenshot
            </a>
          ) : null}
        </div>
      ) : null}

      {positives.length || negatives.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {positives.length ? (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Waarom wel
              </div>
              <ul className="mt-1 space-y-1 text-sm text-slate-700">
                {positives.map((reason) => (
                  <li key={reason}>· {reason}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {negatives.length ? (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Wat er tegen pleit
              </div>
              <ul className="mt-1 space-y-1 text-sm text-slate-700">
                {negatives.map((reason) => (
                  <li key={reason}>· {reason}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {!business.preview_eligible && business.preview_eligibility_reason ? (
        <p className="mt-4 border-l-2 border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {business.preview_eligibility_reason}
        </p>
      ) : null}

      {parts?.components?.length ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Score-opbouw
          </summary>
          <table className="mt-2 w-full text-left text-xs">
            <thead className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="py-1 font-bold">Component</th>
                <th className="py-1 font-bold">Waarde</th>
                <th className="py-1 font-bold">Gewicht</th>
                <th className="py-1 font-bold">Bijdrage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parts.components.map((component) => (
                <tr key={component.key}>
                  <td className="py-1 text-slate-700">{component.label}</td>
                  <td className="py-1 text-slate-600">{Math.round(component.raw)}</td>
                  <td className="py-1 text-slate-600">
                    {Math.round(component.weight * 100)}%
                  </td>
                  <td className="py-1 font-semibold text-slate-800">
                    {component.contribution.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ) : null}
    </Panel>
  );
}
