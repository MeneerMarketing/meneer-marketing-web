import { Badge, KeyValue, Panel } from "@/components/dashboard/ui";
import { PreparePilotButton } from "@/components/dashboard/PreparePilotButton";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildLeadJourney,
  getCampaignEventSplit,
  getCampaignLandingUrl,
  getCampaignPreviewUrl,
} from "@/services/campaigns/campaignService";
import { maskCampaignRef } from "@/services/campaigns/types";
import type { CampaignRow } from "@/services/campaigns/types";

function toneForEngagement(
  level: string
): "neutral" | "warn" | "success" | "brand" | "sky" {
  if (level === "INBOUND") return "success";
  if (level === "HIGH_INTENT") return "brand";
  if (level === "ENGAGED") return "sky";
  if (level === "OPENED") return "warn";
  return "neutral";
}

function formatCampaignEventLabel(eventType: string): string {
  switch (eventType) {
    case "PREVIEW_FEEDBACK_UP":
      return "Preview feedback · positief";
    case "PREVIEW_FEEDBACK_DOWN":
      return "Preview feedback · negatief";
    default:
      return eventType;
  }
}

export async function LeadJourneyPanel({ businessId }: { businessId: string }) {
  let migrationMissing = false;
  let campaign: CampaignRow | null = null;

  try {
    const client = createAdminClient();
    const { data, error } = await client
      .from("campaigns")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      migrationMissing = /relation .*campaigns.* does not exist|Could not find the table/i.test(
        error.message
      );
    } else if (data) {
      campaign = data as CampaignRow;
    }
  } catch {
    migrationMissing = true;
  }

  if (migrationMissing) {
    return (
      <Panel title="Campaign journey">
        <p className="text-sm text-slate-600">
          Campaign-tabellen ontbreken. Pas migration toe:{" "}
          <code className="text-xs">
            supabase/migrations/20260812220000_milestone8_campaign_bridge.sql
          </code>
        </p>
      </Panel>
    );
  }

  const [steps, eventSplit, landingUrl, previewUrl] = await Promise.all([
    buildLeadJourney(businessId),
    campaign ? getCampaignEventSplit(campaign.id) : Promise.resolve({ real: [], test: [] }),
    campaign ? getCampaignLandingUrl(campaign) : Promise.resolve(null),
    campaign ? getCampaignPreviewUrl(campaign) : Promise.resolve(null),
  ]);

  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-6">
      <Panel title="Journey voortgang">
        <p className="mb-4 text-sm text-slate-600">
          {doneCount} van {steps.length} stappen afgerond · alleen real events (
          <code className="text-xs">is_test=false</code>)
        </p>
        <ol className="space-y-0">
          {steps.map((step, index) => (
            <li key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.done
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step.done ? "✓" : index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span
                    className={`my-1 w-px flex-1 ${
                      step.done ? "bg-emerald-200" : "bg-slate-200"
                    }`}
                    style={{ minHeight: "1.5rem" }}
                  />
                ) : null}
              </div>
              <div className="pb-6">
                <p
                  className={`text-sm font-semibold ${
                    step.done ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.at ? (
                  <time className="text-xs text-slate-500">
                    {new Date(step.at).toLocaleString("nl-NL")}
                  </time>
                ) : (
                  <p className="text-xs text-slate-400">Nog niet</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      {campaign ? (
        <>
          <Panel title="Actieve campaign">
            <div className="mb-3 flex flex-wrap gap-2">
              {campaign.environment !== "PRODUCTION" ? (
                <Badge tone="warn">DEV</Badge>
              ) : (
                <Badge tone="success">PROD</Badge>
              )}
              <Badge tone="neutral">{campaign.lifecycle_status}</Badge>
              <Badge tone={toneForEngagement(campaign.engagement_level)}>
                {campaign.engagement_level}
              </Badge>
              <Badge tone="neutral">{campaign.conversion_status}</Badge>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              <KeyValue
                label="Campaign ref"
                value={maskCampaignRef(campaign.campaign_ref)}
              />
              <KeyValue
                label="Aanbevolen pakket"
                value={campaign.recommended_package ?? "—"}
              />
              <KeyValue
                label="Geselecteerd pakket"
                value={campaign.selected_package ?? "—"}
              />
              <KeyValue
                label="Real / test events"
                value={`${campaign.real_event_count ?? 0} / ${campaign.test_event_count ?? 0}`}
              />
              {previewUrl ? (
                <KeyValue
                  label="Preview + ref"
                  value={
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-[#C2410C] hover:underline"
                    >
                      {previewUrl}
                    </a>
                  }
                />
              ) : null}
              {landingUrl ? (
                <KeyValue
                  label="Offer landing"
                  value={
                    <a
                      href={landingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-[#C2410C] hover:underline"
                    >
                      {landingUrl}
                    </a>
                  }
                />
              ) : null}
            </dl>
            <PreparePilotButton campaignId={campaign.id} />
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Real events">
              {eventSplit.real.length === 0 ? (
                <p className="text-sm text-slate-500">Nog geen real events.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {eventSplit.real.map((ev) => (
                    <li key={`${ev.event_type}-${ev.created_at}`} className="py-2">
                      <span className="font-semibold">{formatCampaignEventLabel(ev.event_type)}</span>
                      {typeof ev.metadata?.comment === "string" && ev.metadata.comment ? (
                        <p className="mt-1 text-xs italic text-slate-600">
                          “{String(ev.metadata.comment)}”
                        </p>
                      ) : null}
                      <time className="ml-2 text-xs text-slate-400">
                        {new Date(ev.created_at).toLocaleString("nl-NL")}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Test events (QA)">
              {eventSplit.test.length === 0 ? (
                <p className="text-sm text-slate-500">Geen test events.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {eventSplit.test.map((ev) => (
                    <li key={`${ev.event_type}-${ev.created_at}`} className="py-2">
                      <span className="font-semibold text-amber-800">{ev.event_type}</span>
                      <time className="ml-2 text-xs text-slate-400">
                        {new Date(ev.created_at).toLocaleString("nl-NL")}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      ) : (
        <Panel title="Campaign">
          <p className="text-sm text-slate-500">
            Nog geen campaign. Genereer een outreach draft om de preview → offer bridge te
            starten.
          </p>
        </Panel>
      )}
    </div>
  );
}
