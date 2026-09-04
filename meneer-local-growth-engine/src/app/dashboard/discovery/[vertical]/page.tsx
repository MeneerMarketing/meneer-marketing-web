import Link from "next/link";
import { Badge, Panel, SectionTitle } from "@/components/dashboard/ui";
import { GenerateWinnerPreviewsButton } from "@/components/dashboard/CityRankingActions";
import { getCityOpportunityRows } from "@/lib/data/dashboard";

interface Props {
  params: Promise<{ vertical: string }>;
}

export default async function DiscoveryVerticalPage({ params }: Props) {
  const { vertical } = await params;
  const cityRows = await getCityOpportunityRows(vertical);

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard/discovery" className="text-sm font-semibold text-[#C2410C]">
          ← Discovery
        </Link>
      </div>
      <SectionTitle
        eyebrow="City overview"
        title={
          vertical === "pilates"
            ? "Pilates steden"
            : vertical === "skin-clinics"
              ? "Huidklinieken steden"
              : vertical
        }
        description="Klik een stad voor ranking, scorebreakdown en winner overrides."
      />

      <div className="mb-6">
        <GenerateWinnerPreviewsButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cityRows.map((row) => (
          <Link
            key={row.city.id}
            href={`/dashboard/discovery/${vertical}/${row.city.slug}`}
            className="border border-mm-border bg-white p-5 shadow-mm-card transition hover:border-[#FF5722]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-extrabold text-slate-900">{row.city.name}</h2>
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
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {row.found} studios · {row.qualified} qualified
            </p>
            <p className="mt-4 text-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Winner
              </span>
              <br />
              <span className="font-semibold">
                {row.winner?.primary_candidate
                  ? row.winner.studio_name
                  : row.hasScored
                    ? "Geen geschikte kandidaat"
                    : "Nog niet gescoord"}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Score:{" "}
              <span className="font-bold text-slate-800">
                {row.winnerScore != null ? Math.round(Number(row.winnerScore)) : "—"}
              </span>
              {" · "}
              Preview: {row.winnerPreview ?? "—"}
            </p>
          </Link>
        ))}
      </div>

      {cityRows.length === 0 ? (
        <Panel title="Geen steden">
          <p className="text-sm text-slate-500">Nog geen discovery-data voor deze vertical.</p>
        </Panel>
      ) : null}
    </div>
  );
}
