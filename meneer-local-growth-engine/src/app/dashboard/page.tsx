import { SectionTitle } from "@/components/dashboard/ui";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
import { ReplyInboxPanel } from "@/components/dashboard/ReplyInboxPanel";
import { getActivity, getOverviewMetrics } from "@/lib/data/dashboard";
import { listReplyInbox } from "@/services/inbox/replyInboxService";

export default async function DashboardOverviewPage() {
  const [metrics, activityItems, replyInbox] = await Promise.all([
    getOverviewMetrics(),
    getActivity(10),
    listReplyInbox(8),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Overzicht"
        title="Local Growth Engine"
        description="Live pipeline van discovery tot klant. DEMO-records tellen apart mee."
      />

      <div className="mb-6">
        <ReplyInboxPanel
          unreadCount={replyInbox.unreadCount}
          inboxAddress={replyInbox.inboxAddress}
          items={replyInbox.items}
        />
      </div>

      <OverviewDashboard metrics={metrics} activity={activityItems} />
    </div>
  );
}
