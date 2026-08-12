import Link from "next/link";
import {
  Badge,
  DemoBanner,
  SectionTitle,
} from "@/components/dashboard/ui";
import { GenerateOutreachButton } from "@/components/dashboard/OutreachActions";
import {
  getBusinesses,
  getCities,
  getContactsForBusiness,
  getOutreachMessages,
} from "@/lib/data/dashboard";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const FILTERS = [
  "all",
  "ready_to_draft",
  "DRAFT",
  "REVIEW_REQUIRED",
  "APPROVED",
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
  if (status === "SENT" || status === "OPENED" || status === "CLICKED") return "brand";
  if (status === "DRAFT" || status === "REVIEW_REQUIRED") return "warn";
  if (status === "BOUNCED" || status === "FAILED" || status === "SUPPRESSED") return "danger";
  if (status === "REPLIED") return "sky";
  return "neutral";
}

export default async function OutreachPage({ searchParams }: Props) {
  const sp = await searchParams;
  const statusFilter = sp.status ?? "all";

  const [messages, businesses, cities] = await Promise.all([
    getOutreachMessages(),
    getBusinesses(),
    getCities(),
  ]);

  const readyToDraft = businesses.filter(
    (b) =>
      !b.is_demo &&
      b.lead_status === "READY_FOR_OUTREACH" &&
      b.primary_candidate &&
      !messages.some(
        (m) =>
          m.business_id === b.id &&
          !m.is_test &&
          !["FAILED", "SUPPRESSED"].includes(m.status)
      )
  );

  const enriched = await Promise.all(
    messages
      .filter((m) => !m.is_test)
      .filter((m) => {
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
        description="Drafts reviewen en handmatig versturen. Geen autonome bulkverzending."
      />
      <DemoBanner />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/dashboard/outreach" : `/dashboard/outreach?status=${f}`}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              statusFilter === f ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {f === "ready_to_draft" ? "Ready to draft" : f}
          </Link>
        ))}
      </div>

      {(statusFilter === "all" || statusFilter === "ready_to_draft") &&
      readyToDraft.length > 0 ? (
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-slate-500">
            Ready to draft
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

      {statusFilter !== "ready_to_draft" ? (
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
