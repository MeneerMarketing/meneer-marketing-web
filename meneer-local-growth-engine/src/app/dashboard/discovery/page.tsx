import Link from "next/link";
import {
  ActionPanel,
  Badge,
  Panel,
  SectionTitle,
} from "@/components/dashboard/ui";
import {
  CityRankingActions,
  GenerateWinnerPreviewsButton,
} from "@/components/dashboard/CityRankingActions";
import {
  getCityOpportunityRows,
  getDiscoveryRunsEnriched,
  getDiscoveryStats,
} from "@/lib/data/dashboard";
import { getVerticalPack, listActiveVerticals } from "@/verticals/registry";
import { isVerticalOutreachBlockedCity } from "@/verticals/runtime";

export default async function DiscoveryPage() {
  const [stats, cityRows, runs] = await Promise.all([
    getDiscoveryStats(),
    getCityOpportunityRows("pilates"),
    getDiscoveryRunsEnriched(15),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Discovery"
        title="Lead discovery & city ranking"
        description="Start discovery vanuit de launcher, rank steden en kies je beste kandidaten per stad."
      />

      <ActionPanel
        eyebrow="Discovery Launcher"
        description="Kies branche, land en stad. Het systeem draait discovery, kwalificatie en acquisition fit automatisch."
        href="/dashboard/discovery/new"
        cta="+ Nieuwe discovery"
      />

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
                    {isVerticalOutreachBlockedCity("pilates", row.city.slug) ? (
                      <Badge tone="neutral">Outreach geblokkeerd</Badge>
                    ) : null}
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
        <Panel title="Discovery history">
          {runs.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen runs.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="border-b border-mm-border text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="py-2 pr-3 font-bold">Vertical</th>
                    <th className="py-2 pr-3 font-bold">City</th>
                    <th className="py-2 pr-3 font-bold">Datum</th>
                    <th className="py-2 pr-3 font-bold">Mode</th>
                    <th className="py-2 pr-3 font-bold">Businesses</th>
                    <th className="py-2 pr-3 font-bold">Transform</th>
                    <th className="py-2 pr-3 font-bold">Winner</th>
                    <th className="py-2 pr-3 font-bold">Cost</th>
                    <th className="py-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {runs.map((row) => (
                    <tr key={row.run.id}>
                      <td className="py-2.5 pr-3 font-semibold capitalize">
                        {row.verticalName}
                      </td>
                      <td className="py-2.5 pr-3">
                        {row.citySlug ? (
                          <Link
                            href={`/dashboard/discovery/${row.verticalSlug}/${row.citySlug}`}
                            className="font-semibold text-[#C2410C] hover:underline"
                          >
                            {row.cityName ?? row.citySlug}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-slate-500">
                        {new Date(row.run.created_at).toLocaleString("nl-NL")}
                      </td>
                      <td className="py-2.5 pr-3">
                        {row.run.launcher_mode ?? row.run.mode}
                      </td>
                      <td className="py-2.5 pr-3">{row.run.businesses_found}</td>
                      <td className="py-2.5 pr-3">{row.transformationCandidates}</td>
                      <td className="py-2.5 pr-3">{row.winnerName ?? "—"}</td>
                      <td className="py-2.5 pr-3 tabular-nums">
                        ${Number(row.run.api_cost).toFixed(2)}
                      </td>
                      <td className="py-2.5">
                        <Badge
                          tone={
                            row.run.status === "COMPLETED"
                              ? "success"
                              : row.run.status === "FAILED"
                                ? "danger"
                                : "warn"
                          }
                        >
                          {row.run.pipeline_phase ?? row.run.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
