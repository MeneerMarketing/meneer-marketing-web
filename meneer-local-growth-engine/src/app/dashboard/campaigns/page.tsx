import Link from "next/link";
import {
  Badge,
  DemoBanner,
  KeyValue,
  Panel,
  SectionTitle,
} from "@/components/dashboard/ui";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusinesses, getCities } from "@/lib/data/dashboard";
import { maskCampaignRef } from "@/services/campaigns/types";

function toneForEngagement(
  level: string
): "neutral" | "warn" | "success" | "brand" | "sky" {
  if (level === "INBOUND") return "success";
  if (level === "HIGH_INTENT") return "brand";
  if (level === "ENGAGED") return "sky";
  if (level === "OPENED") return "warn";
  return "neutral";
}

export default async function CampaignsPage() {
  let campaigns: Record<string, unknown>[] = [];
  let migrationMissing = false;
  try {
    const client = createAdminClient();
    const campaignsRes = await client
      .from("campaigns")
      .select("*")
      .order("last_activity_at", { ascending: false })
      .limit(100);
    if (campaignsRes.error) {
      migrationMissing = /relation .*campaigns.* does not exist|Could not find the table/i.test(
        campaignsRes.error.message
      );
    } else {
      campaigns = (campaignsRes.data ?? []) as Record<string, unknown>[];
    }
  } catch {
    migrationMissing = true;
  }

  const [businesses, cities] = await Promise.all([getBusinesses(), getCities()]);

  if (migrationMissing) {
    return (
      <div>
        <SectionTitle
          eyebrow="Campaigns"
          title="Preview → offer bridge"
          description="Database migration Milestone 8 ontbreekt nog."
        />
        <Panel title="Actie vereist">
          <p className="text-sm text-slate-600">
            Pas migration toe:{" "}
            <code className="text-xs">
              supabase/migrations/20260812220000_milestone8_campaign_bridge.sql
            </code>
          </p>
        </Panel>
      </div>
    );
  }

  // Commercial KPIs: PRODUCTION campaigns only, engagement already excludes test events
  const commercial = campaigns.filter((c) => c.environment === "PRODUCTION");
  const qaCampaigns = campaigns.filter((c) => c.environment !== "PRODUCTION");

  const funnel = {
    campaigns: commercial.length,
    opened: commercial.filter((c) =>
      ["OPENED", "ENGAGED", "HIGH_INTENT", "INBOUND"].includes(
        c.engagement_level as string
      )
    ).length,
    offer: commercial.filter((c) =>
      ["ENGAGED", "HIGH_INTENT", "INBOUND"].includes(c.engagement_level as string)
    ).length,
    interest: commercial.filter((c) => Boolean(c.selected_package)).length,
    inbound: commercial.filter((c) => c.conversion_status === "INBOUND_LEAD")
      .length,
  };

  const qaMetrics = {
    campaigns: qaCampaigns.length,
    testEvents: qaCampaigns.reduce(
      (sum, c) => sum + Number(c.test_event_count ?? 0),
      0
    ),
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Campaigns"
        title="Preview → offer bridge"
        description="Commerciële funnel telt alleen PRODUCTION + real events (is_test=false)."
      />
      <DemoBanner />

      <div className="mb-6 grid gap-3 sm:grid-cols-5">
        {[
          ["Campaigns", funnel.campaigns],
          ["Preview viewed", funnel.opened],
          ["Offer viewed", funnel.offer],
          ["Package interest", funnel.interest],
          ["Inbound", funnel.inbound],
        ].map(([label, value]) => (
          <div key={String(label)} className="border border-mm-border bg-white p-4 shadow-mm-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <Panel title="Funnel (production / real)">
        <p className="text-sm text-slate-600">
          OUTREACH → PREVIEW → OFFER → INTEREST → INBOUND
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {funnel.campaigns} / {funnel.opened} / {funnel.offer} / {funnel.interest} /{" "}
          {funnel.inbound}
        </p>
      </Panel>

      <Panel title="QA metrics (development)">
        <dl className="mt-1 grid gap-2 sm:grid-cols-2">
          <KeyValue label="Dev campaigns" value={String(qaMetrics.campaigns)} />
          <KeyValue label="Test events" value={String(qaMetrics.testEvents)} />
        </dl>
      </Panel>

      <div className="mt-6 space-y-3">
        {campaigns.length === 0 ? (
          <p className="text-sm text-slate-500">Nog geen campaigns. Genereer een outreach draft.</p>
        ) : (
          campaigns.map((campaign) => {
            const business = businesses.find((b) => b.id === campaign.business_id);
            const city = business
              ? cities.find((c) => c.id === business.city_id)
              : null;
            const isDev = campaign.environment !== "PRODUCTION";
            return (
              <article
                key={campaign.id as string}
                className="border border-mm-border bg-white p-4 shadow-mm-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      {business?.studio_name ?? "Studio"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {city?.name ?? "—"} · ref {maskCampaignRef(String(campaign.campaign_ref))}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isDev ? <Badge tone="warn">DEV</Badge> : <Badge tone="success">PROD</Badge>}
                    <Badge tone="neutral">{String(campaign.lifecycle_status ?? "DRAFT")}</Badge>
                    <Badge tone={toneForEngagement(String(campaign.engagement_level))}>
                      {String(campaign.engagement_level)}
                    </Badge>
                    <Badge tone="neutral">{String(campaign.conversion_status)}</Badge>
                  </div>
                </div>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  <KeyValue
                    label="Recommended"
                    value={String(campaign.recommended_package ?? "—")}
                  />
                  <KeyValue
                    label="Selected (real)"
                    value={String(campaign.selected_package ?? "—")}
                  />
                  <KeyValue
                    label="Real events"
                    value={String(campaign.real_event_count ?? 0)}
                  />
                  <KeyValue
                    label="Test events"
                    value={String(campaign.test_event_count ?? 0)}
                  />
                  <KeyValue
                    label="Last real activity"
                    value={
                      campaign.last_real_activity_at
                        ? new Date(String(campaign.last_real_activity_at)).toLocaleString("nl-NL")
                        : "—"
                    }
                  />
                </dl>
                {business ? (
                  <Link
                    href={`/dashboard/leads/${business.id}?tab=journey`}
                    className="mt-3 inline-block text-sm font-semibold text-[#C2410C]"
                  >
                    Open journey →
                  </Link>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
