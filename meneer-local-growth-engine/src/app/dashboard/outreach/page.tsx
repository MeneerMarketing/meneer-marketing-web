import Link from "next/link";
import {
  Badge,
  DemoBanner,
  SectionTitle,
} from "@/components/dashboard/ui";
import { GenerateOutreachButton } from "@/components/dashboard/OutreachActions";
import { ReplyInboxPanel } from "@/components/dashboard/ReplyInboxPanel";
import { WishlistCampaignPanel } from "@/components/dashboard/WishlistCampaignPanel";
import { getSenderConfig } from "@/lib/email/provider";
import { getWishlistCampaignSummary } from "@/services/outreach/wishlistCampaign";
import {
  getBusinesses,
  getCities,
  getContactsForBusiness,
  getOutreachMessages,
  getVerticals,
} from "@/lib/data/dashboard";
import {
  countMailListByVertical,
  resolveMailListVerticalFilter,
} from "@/lib/mailListVerticals";
import { MailListVerticalFilter } from "@/components/dashboard/MailListVerticalFilter";
import { listReplyInbox } from "@/services/inbox/replyInboxService";
import { formatAmsterdamNl } from "@/lib/amsterdamTime";
import {
  describeSendTimeRules,
  nextPreferredSendSlot,
} from "@/lib/sendTimeRules";

interface Props {
  searchParams: Promise<{ status?: string; vertical?: string }>;
}

const FILTERS = [
  "all",
  "mail_list",
  "ready_to_draft",
  "DRAFT",
  "REVIEW_REQUIRED",
  "APPROVED",
  "SCHEDULED",
  "SENT",
  "DELIVERED",
  "OPENED",
  "CLICKED",
  "REPLIED",
  "BOUNCED",
  "SUPPRESSED",
] as const;

function statusTone(
  status: string
): "neutral" | "warn" | "success" | "brand" | "danger" | "sky" {
  if (status === "APPROVED" || status === "DELIVERED") return "success";
  if (status === "SCHEDULED") return "sky";
  if (status === "SENT" || status === "OPENED" || status === "CLICKED") return "brand";
  if (status === "DRAFT" || status === "REVIEW_REQUIRED") return "warn";
  if (status === "BOUNCED" || status === "FAILED" || status === "SUPPRESSED") return "danger";
  if (status === "REPLIED") return "sky";
  return "neutral";
}

export default async function OutreachPage({ searchParams }: Props) {
  const sp = await searchParams;
  const statusFilter = sp.status ?? "all";
  const verticalSlug = sp.vertical ?? "all";

  const [messages, businesses, cities, verticals, replyInbox] = await Promise.all([
    getOutreachMessages(),
    getBusinesses(),
    getCities(),
    getVerticals(),
    listReplyInbox(6),
  ]);
  const verticalFilterId = resolveMailListVerticalFilter(verticals, verticalSlug);
  const campaignSummary = await getWishlistCampaignSummary(verticalFilterId ?? undefined);
  const sender = getSenderConfig();
  const sendTimeRulesLabel = describeSendTimeRules();
  const nextOptimizedSlotLabel = formatAmsterdamNl(nextPreferredSendSlot(new Date()));

  const campaignByBusiness = new Map(
    campaignSummary.rows.map((row) => [row.businessId, row])
  );

  const mailWishlistAll = businesses
    .filter((b) => !b.is_demo && b.selected_for_outreach)
    .map((b) => ({
      business: b,
      city: cities.find((c) => c.id === b.city_id) ?? null,
      vertical: verticals.find((v) => v.id === b.vertical_id) ?? null,
      hasDraft: messages.some(
        (m) =>
          m.business_id === b.id &&
          !m.is_test &&
          !["FAILED", "SUPPRESSED"].includes(m.status)
      ),
    }));

  const mailListVerticalOptions = countMailListByVertical(businesses, verticals);
  const mailWishlist = mailWishlistAll.filter(
    (row) => !verticalFilterId || row.business.vertical_id === verticalFilterId
  );

  const readyToDraft = mailWishlist
    .filter((row) => !row.hasDraft)
    .map((row) => row.business);

  const enriched = await Promise.all(
    messages
      .filter((m) => !m.is_test)
      .filter((m) => (m.message_kind ?? "initial") === "initial")
      .filter((m) => {
        if (statusFilter === "mail_list") return false;
        if (statusFilter === "all" || statusFilter === "ready_to_draft") return true;
        return m.status === statusFilter;
      })
      .map(async (message) => {
        const business = businesses.find((b) => b.id === message.business_id);
        const city = business ? cities.find((c) => c.id === business.city_id) : null;
        const contacts = business ? await getContactsForBusiness(business.id) : [];
        const contact = contacts.find((c) => c.id === message.contact_id) ?? null;
        return { message, business, contact, city };
      })
  );

  return (
    <div>
      <SectionTitle
        eyebrow="Outreach"
        title="Outreach inbox"
        description="Mail-lijst vullen, drafts goedkeuren, batch plannen voor morgenochtend."
      />
      <DemoBanner />

      <div className="mb-6">
        <ReplyInboxPanel
          unreadCount={replyInbox.unreadCount}
          inboxAddress={replyInbox.inboxAddress}
          items={replyInbox.items}
        />
      </div>

      <WishlistCampaignPanel
        summary={campaignSummary}
        realSendEnabled={sender.realSendEnabled}
        providerConfigured={sender.configured}
        verticalSlug={verticalSlug}
        verticalName={
          verticalFilterId
            ? verticals.find((v) => v.id === verticalFilterId)?.name ?? null
            : null
        }
        verticalId={verticalFilterId}
        sendTimeRulesLabel={sendTimeRulesLabel}
        nextOptimizedSlotLabel={nextOptimizedSlotLabel}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/dashboard/outreach" : `/dashboard/outreach?status=${f}`}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              statusFilter === f ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {f === "ready_to_draft"
              ? "Ready to draft"
              : f === "mail_list"
                ? "Mail-lijst"
                : f}
          </Link>
        ))}
      </div>

      {(statusFilter === "all" || statusFilter === "ready_to_draft") &&
      readyToDraft.length > 0 ? (
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-slate-500">
            Klaar voor draft (mail-lijst)
          </h2>
          {readyToDraft.map((b) => (
            <article
              key={b.id}
              className="flex flex-col gap-3 border border-mm-border bg-white p-5 shadow-mm-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-extrabold text-slate-900">{b.studio_name}</p>
                <p className="text-sm text-slate-500">
                  confidence{" "}
                  {b.winner_confidence != null
                    ? Math.round(Number(b.winner_confidence))
                    : "—"}{" "}
                  · SEO{" "}
                  {b.seo_opportunity_score != null
                    ? Math.round(Number(b.seo_opportunity_score))
                    : "—"}{" "}
                  · preview {b.preview_status}
                </p>
              </div>
              <GenerateOutreachButton businessId={b.id} />
            </article>
          ))}
        </div>
      ) : null}

      {statusFilter === "all" || statusFilter === "mail_list" ? (
        <div className="mb-4">
          <MailListVerticalFilter
            options={mailListVerticalOptions}
            activeSlug={verticalSlug}
            baseHref={
              statusFilter === "mail_list"
                ? "/dashboard/outreach?status=mail_list"
                : "/dashboard/outreach"
            }
            totalCount={mailWishlistAll.length}
          />
        </div>
      ) : null}

      {statusFilter === "all" || statusFilter === "mail_list" ? (
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-slate-500">
              {verticalFilterId
                ? `${verticals.find((v) => v.id === verticalFilterId)?.name ?? "Branche"} mail-lijst (${mailWishlist.length})`
                : `Mail-lijst (${mailWishlist.length})`}
            </h2>
            <Link href="/dashboard/leads" className="text-xs font-bold text-[#C2410C]">
              Beheer op leads →
            </Link>
          </div>
          {mailWishlist.length === 0 ? (
            <p className="text-sm text-slate-500">
              {verticalFilterId
                ? "Nog geen studios op deze branche-mail-lijst."
                : "Nog geen studios op je mail-lijst."}{" "}
              Open een lead, kies de branche en klik op <strong>Op mail-lijst</strong>.
            </p>
          ) : (
            mailWishlist.map(({ business, city, vertical, hasDraft }) => {
              const campaign = campaignByBusiness.get(business.id);
              return (
              <article
                key={business.id}
                className="flex flex-col gap-3 border border-mm-border bg-white p-5 shadow-mm-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-extrabold text-slate-900">{business.studio_name}</p>
                  <p className="text-sm text-slate-500">
                    {city?.name ?? "—"} · {vertical?.name ?? "—"} · preview{" "}
                    {business.preview_status ?? "—"}
                    {business.assigned_template
                      ? ` · template ${business.assigned_template}`
                      : ""}
                    {campaign?.messageStatus
                      ? ` · mail ${campaign.messageStatus}`
                      : " · nog geen draft"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/leads/${business.id}`}
                    className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700"
                  >
                    Open lead
                  </Link>
                  {hasDraft ? (
                    <Link
                      href={`/dashboard/leads/${business.id}?tab=outreach`}
                      className="border border-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C2410C]"
                    >
                      Naar draft
                    </Link>
                  ) : (
                    <GenerateOutreachButton businessId={business.id} />
                  )}
                </div>
              </article>
            );
            })
          )}
        </div>
      ) : null}

      {statusFilter !== "ready_to_draft" && statusFilter !== "mail_list" ? (
        <div className="space-y-3">
          {enriched.length === 0 ? (
            <p className="text-sm text-slate-500">Geen berichten in deze filter.</p>
          ) : null}
          {enriched.map(({ message, business, contact, city }) => (
            <article
              key={message.id}
              className="border border-mm-border bg-white p-5 shadow-mm-card"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900">
                      {message.subject}
                    </h2>
                    <Badge tone={statusTone(message.status)}>{message.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {business?.studio_name ?? "—"} · {city?.name ?? "—"} ·{" "}
                    {contact?.email ?? "geen contact"} · confidence{" "}
                    {business?.winner_confidence != null
                      ? Math.round(Number(business.winner_confidence))
                      : "—"}{" "}
                    · SEO{" "}
                    {business?.seo_opportunity_score != null
                      ? Math.round(Number(business.seo_opportunity_score))
                      : "—"}
                  </p>
                </div>
                <Link
                  href={`/dashboard/outreach/${message.id}`}
                  className="text-sm font-bold text-[#C2410C]"
                >
                  Open editor →
                </Link>
              </div>
              <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm text-slate-600">
                {message.body_text ?? message.body}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
