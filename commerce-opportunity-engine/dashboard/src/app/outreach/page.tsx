import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type ViewKey =
  | "ready"
  | "drafts"
  | "review"
  | "approved"
  | "blocked"
  | "test"
  | "sent"
  | "needs-contact"
  | "dnc";

const VIEWS: Array<{ key: ViewKey; label: string }> = [
  { key: "ready", label: "Ready for Draft" },
  { key: "drafts", label: "Drafts" },
  { key: "review", label: "Ready for Review" },
  { key: "approved", label: "Approved" },
  { key: "blocked", label: "Blocked / Revoked" },
  { key: "test", label: "Test Sent" },
  { key: "sent", label: "Sent" },
  { key: "needs-contact", label: "Needs Contact" },
  { key: "dnc", label: "Do Not Contact" },
];

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function statusTone(status: string): "success" | "danger" | "warn" | "sky" {
  if (status === "APPROVED" || status === "TEST_SENT" || status === "SENT")
    return "success";
  if (
    status === "BLOCKED" ||
    status === "APPROVAL_REVOKED" ||
    status === "DRAFT_INVALID"
  )
    return "danger";
  if (status === "READY_FOR_REVIEW" || status === "DRAFT") return "warn";
  return "sky";
}

export default async function OutreachPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const view = (VIEWS.some((v) => v.key === params.view)
    ? params.view
    : "drafts") as ViewKey;

  const supabase = getSupabase();
  let rows: Array<Record<string, unknown>> = [];
  let loadError: string | null = null;

  const realSendEnabled =
    process.env.OUTREACH_REAL_SEND_ENABLED === "true" ||
    process.env.OUTREACH_REAL_SEND_ENABLED === "1";

  try {
    if (view === "ready" || view === "needs-contact" || view === "dnc") {
      let query = supabase
        .from("opportunities")
        .select(
          `id, outreach_status, outreach_eligible, outreach_priority_score,
           meneer_marketing_fit_score, recommended_project_type, opportunity_score,
           brands!inner ( normalized_domain, do_not_contact, contact_status, preferred_contact_id, eligibility_status )`
        )
        .order("outreach_priority_score", {
          ascending: false,
          nullsFirst: false,
        })
        .limit(50);

      if (view === "ready") {
        query = query
          .eq("outreach_eligible", true)
          .eq("outreach_status", "READY_FOR_DRAFT");
      } else if (view === "needs-contact") {
        query = query.eq("outreach_status", "NO_CONTACT");
      } else {
        query = query.eq("outreach_status", "DO_NOT_CONTACT");
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      rows = (data ?? []) as Array<Record<string, unknown>>;
    } else {
      const statusMap: Record<string, string[]> = {
        drafts: ["DRAFT", "DRAFT_INVALID", "READY_FOR_DRAFT"],
        review: ["READY_FOR_REVIEW"],
        approved: ["APPROVED"],
        blocked: ["BLOCKED", "APPROVAL_REVOKED"],
        test: ["TEST_SENT"],
        sent: ["SENT", "DELIVERED"],
      };
      const { data, error } = await supabase
        .from("coe_outreach_messages")
        .select(
          `id, subject, status, strategy, version, claim_validation_status,
           opportunity_id, brand_id, selected_finding_title, updated_at,
           copy_style, blocked_reason, prompt_version,
           brands!inner ( normalized_domain ),
           coe_brand_contacts ( email, first_name, full_name ),
           opportunities ( outreach_priority_score, meneer_marketing_fit_score, recommended_project_type )`
        )
        .in("status", statusMap[view] ?? ["DRAFT"])
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      rows = (data ?? []) as Array<Record<string, unknown>>;
    }
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Kon outreach niet laden";
  }

  return (
    <AppShell activePath="/outreach">
      <SectionTitle
        eyebrow="Milestone 8.1"
        title="Outreach"
        description="State-safe drafts, Meneer Marketing copy V2, Resend test-only. Geen automatische koude mails."
      />

      {!realSendEnabled ? (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
          REAL SEND DISABLED · OUTREACH_REAL_SEND_ENABLED=false
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/outreach?view=${v.key}`}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              view === v.key
                ? "bg-[#FF5722] text-white"
                : "bg-mm-surface text-slate-600 hover:bg-mm-sky-subtle"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      {loadError ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-3">Brand</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Subject / Opportunity</th>
              <th className="px-3 py-3">Style</th>
              <th className="px-3 py-3">MM Fit</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actie</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  <EmptyValue label="Geen rijen in deze view" />
                </td>
              </tr>
            ) : view === "ready" ||
              view === "needs-contact" ||
              view === "dnc" ? (
              rows.map((row) => {
                const brand = one(
                  row.brands as
                    | Record<string, unknown>
                    | Record<string, unknown>[]
                );
                return (
                  <tr key={String(row.id)} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-bold">
                      {String(brand?.normalized_domain ?? "—")}
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      {String(brand?.contact_status ?? "—")}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {row.opportunity_score != null
                        ? Math.round(Number(row.opportunity_score))
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-xs">—</td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {row.meneer_marketing_fit_score != null
                        ? Math.round(Number(row.meneer_marketing_fit_score))
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-extrabold tabular-nums">
                      {row.outreach_priority_score != null
                        ? Math.round(Number(row.outreach_priority_score))
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={statusTone(String(row.outreach_status ?? ""))}>
                        {String(row.outreach_status ?? "—")}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/opportunities/${row.id}`}
                        className="text-xs font-bold text-[#C2410C] hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              rows.map((row) => {
                const brand = one(
                  row.brands as
                    | Record<string, unknown>
                    | Record<string, unknown>[]
                );
                const contact = one(
                  row.coe_brand_contacts as
                    | Record<string, unknown>
                    | Record<string, unknown>[]
                );
                const opp = one(
                  row.opportunities as
                    | Record<string, unknown>
                    | Record<string, unknown>[]
                );
                return (
                  <tr key={String(row.id)} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-bold">
                      {String(brand?.normalized_domain ?? "—")}
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      {contact?.email ? (
                        <span>
                          {contact.first_name
                            ? `${contact.first_name} · `
                            : ""}
                          {String(contact.email)}
                        </span>
                      ) : (
                        <EmptyValue label="—" />
                      )}
                    </td>
                    <td className="max-w-[240px] px-3 py-2.5 text-xs">
                      <div className="truncate font-medium">
                        {String(row.subject ?? "—")}
                      </div>
                      {row.blocked_reason ? (
                        <div className="mt-0.5 truncate text-[11px] text-rose-700">
                          Reden: {String(row.blocked_reason)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      {String(row.copy_style ?? "—")}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {opp?.meneer_marketing_fit_score != null
                        ? Math.round(Number(opp.meneer_marketing_fit_score))
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-extrabold tabular-nums">
                      {opp?.outreach_priority_score != null
                        ? Math.round(Number(opp.outreach_priority_score))
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={statusTone(String(row.status))}>
                        {String(row.status)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/outreach/${row.id}`}
                        className="text-xs font-bold text-[#C2410C] hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
