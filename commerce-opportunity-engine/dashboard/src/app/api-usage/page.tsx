import { AppShell } from "@/components/AppShell";
import { EmptyValue, SectionTitle, StatCard } from "@/components/ui";
import { getRunsAndUsage } from "@/lib/queries";

export const dynamic = "force-dynamic";

function formatCost(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Niet beschikbaar";
  return `$${value.toFixed(6)}`;
}

export default async function ApiUsagePage() {
  const { usage, runs } = await getRunsAndUsage();

  return (
    <AppShell activePath="/api-usage">
      <SectionTitle
        eyebrow="API Usage"
        title="Geschatte kosten uit run-metadata"
        description="Alleen echte opgeslagen waarden uit runs.metadata. Geen reconstructie van ontbrekende kosten."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="DataForSEO vandaag"
          value={formatCost(usage.dataForSeoToday)}
          hint="dataForSeoCost / totalCost"
        />
        <StatCard
          label="DataForSEO deze maand"
          value={formatCost(usage.dataForSeoMonth)}
        />
        <StatCard
          label="DataForSEO totaal (view)"
          value={formatCost(usage.dataForSeoTotal)}
          hint={`${usage.runCount} runs in aggregatie`}
        />
        <StatCard
          label="Kosten per geldige audit"
          value={
            usage.costPerValidAudit !== null
              ? formatCost(usage.costPerValidAudit)
              : "Niet berekenbaar"
          }
          hint={
            usage.validAuditCount != null
              ? `${usage.validAuditCount} audits met anthropicCost in metadata`
              : "Geen auditsCompleted + anthropicCost combinatie"
          }
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Anthropic vandaag"
          value={formatCost(usage.anthropicToday)}
          hint="haikuCost / anthropicCost"
        />
        <StatCard
          label="Anthropic deze maand"
          value={formatCost(usage.anthropicMonth)}
        />
        <StatCard
          label="Anthropic totaal (view)"
          value={formatCost(usage.anthropicTotal)}
        />
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card">
        <h3 className="text-sm font-extrabold text-slate-900">Per run</h3>
        <div className="mt-4 divide-y divide-slate-100">
          {runs.map((run) => {
            const meta = (run.metadata ?? {}) as Record<string, unknown>;
            const dfs =
              typeof meta.dataForSeoCost === "number"
                ? meta.dataForSeoCost
                : typeof meta.totalCost === "number"
                  ? meta.totalCost
                  : null;
            const anth =
              typeof meta.haikuCost === "number"
                ? meta.haikuCost
                : typeof meta.anthropicCost === "number"
                  ? meta.anthropicCost
                  : null;
            return (
              <div
                key={run.id as string}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">{run.run_type as string}</p>
                  <p className="text-xs text-slate-400">{run.status as string}</p>
                </div>
                <div className="flex gap-4 text-xs text-slate-600">
                  <span>
                    DFS:{" "}
                    {dfs !== null ? (
                      `$${dfs.toFixed(6)}`
                    ) : (
                      <EmptyValue label="n/a" />
                    )}
                  </span>
                  <span>
                    Anthropic:{" "}
                    {anth !== null ? (
                      `$${anth.toFixed(6)}`
                    ) : (
                      <EmptyValue label="n/a" />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
