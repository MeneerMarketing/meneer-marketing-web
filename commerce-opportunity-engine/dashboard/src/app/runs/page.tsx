import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getRunsAndUsage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RunsPage() {
  const { runs } = await getRunsAndUsage();

  return (
    <AppShell activePath="/runs">
      <SectionTitle
        eyebrow="Runs"
        title="Pipeline uitvoeringen"
        description="Discovery, qualification en opportunity generation. Kosten alleen wanneer opgeslagen in metadata."
      />

      <div className="space-y-3">
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
              className="rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-slate-900">
                  {run.run_type as string}
                </p>
                <Badge
                  tone={
                    run.status === "completed"
                      ? "success"
                      : run.status === "failed"
                        ? "danger"
                        : "warn"
                  }
                >
                  {run.status as string}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Gestart
                  </p>
                  <p>{formatDate(run.started_at as string)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Afgerond
                  </p>
                  <p>{formatDate(run.completed_at as string)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    DataForSEO
                  </p>
                  <p>
                    {dfs !== null ? `$${dfs.toFixed(6)}` : <EmptyValue label="Niet opgeslagen" />}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Anthropic
                  </p>
                  <p>
                    {anth !== null ? (
                      `$${anth.toFixed(6)}`
                    ) : (
                      <EmptyValue label="Niet opgeslagen" />
                    )}
                  </p>
                </div>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-bold text-slate-500">
                  Metadata
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-[11px] text-slate-200">
                  {JSON.stringify(meta, null, 2)}
                </pre>
              </details>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
