import Link from "next/link";
import {
  Badge,
  DemoBanner,
  MetricTile,
  Panel,
  SectionTitle,
  TextLink,
} from "@/components/dashboard/ui";
import { getActivity, getOverviewMetrics } from "@/lib/data/dashboard";

export default async function DashboardOverviewPage() {
  const [m, activityItems] = await Promise.all([
    getOverviewMetrics(),
    getActivity(8),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Overzicht"
        title="Local Growth Engine"
        description="Live Supabase metrics. DEMO-records blijven zichtbaar, echte discovery apart geteld."
      />
      <DemoBanner />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricTile label="Live leads" value={m.liveCount} hint="is_demo = false" />
        <MetricTile label="DEMO leads" value={m.demoCount} hint="is_demo = true" />
        <MetricTile label="Databron" value="Supabase" />
        <MetricTile label="Total" value={m.totalLeads} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <MetricTile label="Nieuwe leads" value={m.newLeads} hint="DISCOVERED" />
        <MetricTile label="Gekwalificeerd+" value={m.qualifiedLeads} />
        <MetricTile label="Previews klaar" value={m.previewsReady} />
        <MetricTile label="Klaar voor outreach" value={m.readyForOutreach} />
        <MetricTile label="Outreach drafts" value={m.outreachDrafts} />
        <MetricTile label="Benaderd" value={m.contacted} />
        <MetricTile label="Reacties" value={m.replied} />
        <MetricTile label="Gesprekken" value={m.meetings} />
        <MetricTile label="Klanten" value={m.clients} />
        <MetricTile label="Leads deze week" value={m.leadsThisWeek} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Previews deze week" value={m.previewsThisWeek} />
        <MetricTile label="Conversie → reactie" value={m.replyRateLabel} />
        <MetricTile label="Conversie → klant" value={m.clientRateLabel} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Recent activity">
          <ul className="divide-y divide-slate-100">
            {activityItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone="neutral">{item.activity_type}</Badge>
                  <time className="text-[11px] text-slate-400">
                    {new Date(item.created_at).toLocaleString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Snel naar">
          <ul className="space-y-3 text-sm">
            <li>
              <TextLink href="/dashboard/leads">Leads beheren</TextLink>
            </li>
            <li>
              <TextLink href="/dashboard/discovery">Discovery starten</TextLink>
            </li>
            <li>
              <TextLink href="/dashboard/previews">Preview gallery</TextLink>
            </li>
            <li>
              <Link
                href="/preview/studio-forma-arnhem-reformer"
                className="font-semibold text-slate-600 underline-offset-2 hover:underline"
                target="_blank"
              >
                Open Studio Forma preview ↗
              </Link>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
