import Link from "next/link";
import {
  Badge,
  Panel,
  SectionTitle,
} from "@/components/dashboard/ui";
import { DiscoveryStartForm } from "@/components/dashboard/DiscoveryStartForm";
import {
  CityRankingActions,
  GenerateWinnerPreviewsButton,
} from "@/components/dashboard/CityRankingActions";
import {
  getCityOpportunityRows,
  getDiscoveryRuns,
  getDiscoveryStats,
} from "@/lib/data/dashboard";

export default async function DiscoveryPage() {
  const [stats, cityRows, runs] = await Promise.all([
    getDiscoveryStats(),
    getCityOpportunityRows("pilates"),
    getDiscoveryRuns(10),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Discovery"
        title="Lead discovery & city ranking"
        description="Live Supabase. Rank steden, kies PRIMARY_CANDIDATE, koppel previews."
      />

      <div className="mb-6">
        <DiscoveryStartForm />
      </div>

      <div className="mb-6">
        <GenerateWinnerPreviewsButton />
        <p className="mt-2 text-xs text-slate-400">
          AUTO_GENERATE_WINNER_PREVIEW staat standaard uit. Gebruik deze knop bewust.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {stats.map((row) => (
          <Panel
            key={row.vertical.id}
            title={row.vertical.name}
            action={
              <Badge tone={row.vertical.active ? "success" : "neutral"}>
                {row.vertical.active ? "Actief" : "Later"}
              </Badge>
            }
          >
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Steden in pack
                </p>
                <p className="mt-1 text-xl font-extrabold">{row.cityCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Businesses
                </p>
                <p className="mt-1 text-xl font-extrabold">{row.businessCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Qualified/Potential
                </p>
                <p className="mt-1 text-xl font-extrabold">{row.qualifiedCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Exclusief
                </p>
                <p className="mt-1 text-xl font-extrabold">{row.exclusiveCities}</p>
              </div>
            </dl>
            <Link
              href={`/dashboard/discovery/${row.vertical.slug}`}
              className="mt-4 inline-block text-sm font-bold text-[#C2410C]"
            >
              Open city overview →
            </Link>
          </Panel>
        ))}
      </div>

      <Panel title="City opportunity · Pilates">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="border-b border-mm-border text-[10px] uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-bold">City</th>
                <th className="py-2 pr-4 font-bold">Gevonden</th>
                <th className="py-2 pr-4 font-bold">Qualified</th>
                <th className="py-2 pr-4 font-bold">Winner</th>
                <th className="py-2 pr-4 font-bold">Score</th>
                <th className="py-2 pr-4 font-bold">Preview</th>
                <th className="py-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cityRows.map((row) => (
                <tr key={row.city.id}>
                  <td className="py-2.5 pr-4 font-semibold">
                    <Link
                      href={`/dashboard/discovery/pilates/${row.city.slug}`}
                      className="text-[#C2410C] hover:underline"
                    >
                      {row.city.name}
                    </Link>
                    <span className="ml-2 text-xs text-slate-400">
                      {row.city.country_code}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">{row.found}</td>
                  <td className="py-2.5 pr-4">{row.qualified}</td>
                  <td className="py-2.5 pr-4">
                    {row.winner?.primary_candidate
                      ? row.winner.studio_name
                      : row.hasScored
                        ? "Geen geschikte kandidaat"
                        : "Nog niet gescoord"}
                  </td>
                  <td className="py-2.5 pr-4 font-bold">
                    {row.winnerScore != null ? Math.round(Number(row.winnerScore)) : "—"}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge tone="neutral">{row.winnerPreview ?? "—"}</Badge>
                  </td>
                  <td className="py-2.5">
                    <Badge
                      tone={
                        row.exclusiveStatus === "EXCLUSIVE"
                          ? "success"
                          : row.exclusiveStatus === "PRIMARY_CANDIDATE"
                            ? "warn"
                            : "sky"
                      }
                    >
                      {row.exclusiveStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cityRows[0] ? (
          <div className="mt-4">
            <CityRankingActions cityId={cityRows[0].city.id} />
          </div>
        ) : null}
      </Panel>

      <div className="mt-6">
        <Panel title="Discovery runs">
          {runs.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen runs.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {runs.map((run) => (
                <li
                  key={run.id}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        tone={
                          run.status === "COMPLETED"
                            ? "success"
                            : run.status === "FAILED"
                              ? "danger"
                              : "warn"
                        }
                      >
                        {run.status}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {run.scope} · {run.mode}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {run.new_businesses} nieuw · {run.duplicates} duplicates ·{" "}
                      {run.qualified} qualified · ${Number(run.api_cost).toFixed(4)} ·{" "}
                      {run.api_calls} calls
                    </p>
                  </div>
                  <time className="text-[11px] text-slate-400">
                    {new Date(run.created_at).toLocaleString("nl-NL")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
