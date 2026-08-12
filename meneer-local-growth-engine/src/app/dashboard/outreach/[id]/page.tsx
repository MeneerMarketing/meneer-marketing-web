import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  DemoBanner,
  KeyValue,
  Panel,
  SectionTitle,
  TextLink,
} from "@/components/dashboard/ui";
import { OutreachActions } from "@/components/dashboard/OutreachActions";
import { getSenderConfig } from "@/lib/email/provider";
import {
  getBusinessById,
  getCities,
  getContactsForBusiness,
  getOutreachMessageById,
  getSeoForBusiness,
} from "@/lib/data/dashboard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OutreachDetailPage({ params }: Props) {
  const { id } = await params;
  const message = await getOutreachMessageById(id);
  if (!message) notFound();

  const business = await getBusinessById(message.business_id);
  const [contacts, cities, seo] = await Promise.all([
    business ? getContactsForBusiness(business.id) : Promise.resolve([]),
    getCities(),
    business ? getSeoForBusiness(business.id) : Promise.resolve(undefined),
  ]);
  const contact = contacts.find((c) => c.id === message.contact_id) ?? null;
  const city = business ? cities.find((c) => c.id === business.city_id) : null;
  const sender = getSenderConfig();

  return (
    <div>
      <div className="mb-6">
        <TextLink href="/dashboard/outreach">← Terug naar outreach</TextLink>
      </div>
      <SectionTitle
        eyebrow="Outreach editor"
        title={message.subject}
        description="Review, bewerk, approve. Echte send alleen met Resend + APPROVED."
      />
      <DemoBanner />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Generated mail">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge tone="warn">{message.status}</Badge>
            {message.version ? <Badge tone="sky">v{message.version}</Badge> : null}
            {message.generation_cost != null ? (
              <Badge tone="neutral">${Number(message.generation_cost).toFixed(4)}</Badge>
            ) : null}
          </div>
          <OutreachActions
            messageId={message.id}
            businessId={message.business_id}
            status={message.status}
            providerConfigured={sender.configured}
            testEmailConfigured={Boolean(sender.testEmail)}
            realSendEnabled={sender.realSendEnabled}
            initialSubject={message.subject}
            initialBody={message.body_text ?? message.body}
          />
        </Panel>

        <div className="space-y-6">
          <Panel title="Studio intelligence">
            <dl>
              <KeyValue label="Studio" value={business?.studio_name ?? "—"} />
              <KeyValue label="City" value={city?.name ?? "—"} />
              <KeyValue label="Contact" value={contact?.email ?? "—"} />
              <KeyValue
                label="Winner confidence"
                value={
                  business?.winner_confidence != null
                    ? Math.round(Number(business.winner_confidence))
                    : "—"
                }
              />
              <KeyValue
                label="Lead score"
                value={
                  business?.lead_score != null ? Math.round(Number(business.lead_score)) : "—"
                }
              />
              <KeyValue label="Winner reason" value={business?.winner_reason ?? "—"} />
            </dl>
            {business ? (
              <Link
                href={`/dashboard/leads/${business.id}`}
                className="mt-4 inline-block text-sm font-semibold text-[#C2410C]"
              >
                Open lead →
              </Link>
            ) : null}
          </Panel>

          <Panel title="SEO opportunity">
            <dl>
              <KeyValue label="Primary" value={seo?.primary_keyword ?? "—"} />
              <KeyValue
                label="Volume"
                value={
                  seo?.primary_search_volume != null
                    ? String(seo.primary_search_volume)
                    : "—"
                }
              />
              <KeyValue
                label="Current rank"
                value={seo?.current_rank != null ? `#${seo.current_rank}` : "not found"}
              />
              <KeyValue
                label="SEO opportunity"
                value={
                  seo?.seo_opportunity_score != null
                    ? Math.round(Number(seo.seo_opportunity_score))
                    : "—"
                }
              />
            </dl>
          </Panel>

          <Panel title="Preview">
            {message.preview_url ? (
              <a
                href={message.preview_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-[#C2410C]"
              >
                Bekijk conceptwebsite ↗
              </a>
            ) : (
              <p className="text-sm text-slate-500">Geen preview URL</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Preview status: {business?.preview_status ?? "—"}
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
