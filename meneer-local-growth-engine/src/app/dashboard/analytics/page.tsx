import {
  DemoBanner,
  MetricTile,
  Panel,
  SectionTitle,
} from "@/components/dashboard/ui";
import { getOverviewMetrics, getOutreachMessages, getPreviews } from "@/lib/data/dashboard";

export default async function AnalyticsPage() {
  const [m, messages, previews] = await Promise.all([
    getOverviewMetrics(),
    getOutreachMessages(),
    getPreviews(),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Analytics"
        title="Vroege signalen"
        description="Live Supabase counts. Geen fake conversies."
      />
      <DemoBanner />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile label="Live leads" value={m.liveCount} />
        <MetricTile label="DEMO leads" value={m.demoCount} />
        <MetricTile label="Previews ready/approved" value={m.previewsReady} />
        <MetricTile label="Outreach drafts" value={messages.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Funnel">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-slate-100 py-2">
              <span>Discovered</span>
              <span className="font-bold">{m.newLeads}</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 py-2">
              <span>Qualified+</span>
              <span className="font-bold">{m.qualifiedLeads}</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 py-2">
              <span>Ready for outreach</span>
              <span className="font-bold">{m.readyForOutreach}</span>
            </li>
            <li className="flex justify-between py-2">
              <span>Contacted / replied / client</span>
              <span className="font-bold">
                {m.contacted} / {m.replied} / {m.clients}
              </span>
            </li>
          </ul>
        </Panel>
        <Panel title="Preview volume">
          <p className="text-3xl font-extrabold">{previews.length}</p>
          <p className="mt-1 text-sm text-slate-500">Preview records in Supabase</p>
        </Panel>
      </div>
    </div>
  );
}
