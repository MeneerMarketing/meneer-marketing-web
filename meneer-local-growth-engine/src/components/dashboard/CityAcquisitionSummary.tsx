import Link from "next/link";
import { Badge, MetricTile, Panel } from "@/components/dashboard/ui";
import type { Business } from "@/types/domain";

/**
 * City-level acquisition summary (M8.3): how many studios were discovered,
 * which of them fit the redesign campaign, and who the redesign winner is.
 */

interface CoverageQueryRow {
  label: string;
  results: number;
  unique_new: number;
  relevant_new: number;
  duplicates: number;
}

export interface CityCoverageView {
  queries_run: number;
  unique_businesses: number;
  relevant_businesses: number;
  eligible_businesses: number;
  coverage_confidence: number;
  coverage_label: string;
  saturated: boolean;
  incremental_unique_by_query: CoverageQueryRow[];
  created_at?: string | null;
}

function scoreOf(business: Business): number {
  return business.website_transformation_score != null
    ? Math.round(Number(business.website_transformation_score))
    : 0;
}

export function CityAcquisitionSummary({
  cityName,
  businesses,
  coverage,
}: {
  cityName: string;
  businesses: Business[];
  coverage: CityCoverageView | null;
}) {
  const transformation = businesses
    .filter((b) => b.prospect_type === "WEBSITE_TRANSFORMATION")
    .sort(
      (a, b) =>
        (a.transformation_city_rank ?? 99) - (b.transformation_city_rank ?? 99) ||
        scoreOf(b) - scoreOf(a)
    );
  const growth = businesses.filter((b) => b.prospect_type === "GROWTH_ONLY");
  const weak = businesses.filter((b) => b.prospect_type === "WEAK_BUSINESS");
  const notEligible = businesses.filter((b) => b.prospect_type === "NOT_ELIGIBLE");
  const unassessed = businesses.filter((b) => !b.prospect_type);
  const qualified = businesses.filter((b) =>
    ["QUALIFIED", "POTENTIAL"].includes(String(b.qualification_status))
  );

  const winner = transformation.find((b) => b.transformation_primary_candidate) ?? null;
  const runnerUp = transformation.find((b) => b.transformation_city_rank === 1) ?? null;

  return (
    <>
      <Panel title={`Acquisition fit · ${cityName}`}>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricTile label="Studios gevonden" value={businesses.length} />
          <MetricTile label="Gekwalificeerd" value={qualified.length} />
          <MetricTile label="Website transformation" value={transformation.length} />
          <MetricTile label="Growth only" value={growth.length} />
          <MetricTile label="Zwak" value={weak.length} />
          <MetricTile label="Niet geschikt" value={notEligible.length} />
        </div>

        {unassessed.length ? (
          <p className="mt-3 text-xs text-slate-500">
            {unassessed.length} studio&apos;s zijn nog niet beoordeeld op acquisition fit.
          </p>
        ) : null}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Website redesign winner
          </p>
          {winner ? (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/dashboard/leads/${winner.id}`}
                  className="text-lg font-extrabold text-slate-900 hover:text-[#C2410C]"
                >
                  {winner.studio_name}
                </Link>
                <Badge tone="success">TRANSFORMATION SCORE {scoreOf(winner)}</Badge>
                {winner.transformation_winner_confidence != null ? (
                  <Badge tone="sky">
                    CONFIDENCE {Math.round(Number(winner.transformation_winner_confidence))}
                  </Badge>
                ) : null}
              </div>
              {winner.transformation_winner_reason ? (
                <p className="mt-2 text-sm text-slate-600">
                  {winner.transformation_winner_reason}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Nog geen redesign-winner. Er is geen kandidaat die alle voorwaarden haalt
              {runnerUp
                ? `. Hoogste kandidaat is ${runnerUp.studio_name} met score ${scoreOf(runnerUp)}.`
                : "."}
            </p>
          )}
        </div>

        {transformation.length ? (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Website transformation kandidaten
            </p>
            <ul className="mt-2 divide-y divide-slate-100 text-sm">
              {transformation.map((business) => (
                <li key={business.id} className="flex flex-wrap items-center gap-2 py-2">
                  <span className="w-8 font-bold text-slate-400">
                    #{business.transformation_city_rank ?? "—"}
                  </span>
                  <Link
                    href={`/dashboard/leads/${business.id}`}
                    className="font-semibold text-slate-900 hover:text-[#C2410C]"
                  >
                    {business.studio_name}
                  </Link>
                  <span className="tabular-nums text-slate-500">score {scoreOf(business)}</span>
                  {business.transformation_primary_candidate ? (
                    <Badge tone="warn">REDESIGN WINNER</Badge>
                  ) : null}
                  {business.preview_eligible ? (
                    <Badge tone="success">PREVIEW</Badge>
                  ) : (
                    <Badge tone="neutral">GEEN PREVIEW</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {growth.length ? (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Growth-only kansen
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {growth.map((business) => (
                <li key={business.id}>
                  <Link
                    href={`/dashboard/leads/${business.id}`}
                    className="font-semibold text-slate-900 hover:text-[#C2410C]"
                  >
                    {business.studio_name}
                  </Link>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {business.prospect_type_reason ?? "Website is al sterk genoeg."}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Panel>

      {coverage ? (
        <Panel title="Discovery coverage">
          <p className="text-sm text-slate-600">
            Bron: Google Local / DataForSEO business listings. Zoekcontext: meerdere lokale
            intenties rond Pilates en Reformer in {cityName}.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricTile label="Queries" value={coverage.queries_run} />
            <MetricTile label="Unieke bedrijven" value={coverage.unique_businesses} />
            <MetricTile label="Relevante aanbieders" value={coverage.relevant_businesses} />
            <MetricTile
              label="Coverage"
              value={`${coverage.coverage_confidence} (${coverage.coverage_label})`}
              hint={coverage.saturated ? "Verzadigd: extra queries leveren niets nieuws op" : undefined}
            />
          </div>

          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {coverage.incremental_unique_by_query.map((row) => (
              <li key={row.label} className="flex flex-wrap justify-between gap-2 py-2">
                <span className="font-semibold text-slate-700">{row.label}</span>
                <span className="tabular-nums text-slate-500">
                  {row.results} resultaten · {row.relevant_new} nieuwe relevante ·{" "}
                  {row.duplicates} duplicaten
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Pipeline: gevonden → gekwalificeerd → website geanalyseerd → visueel beoordeeld →
            acquisition fit → gerangschikt → preview eligible.
          </p>
        </Panel>
      ) : null}
    </>
  );
}
