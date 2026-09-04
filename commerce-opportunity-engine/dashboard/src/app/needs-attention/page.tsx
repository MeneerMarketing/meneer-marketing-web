import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle } from "@/components/ui";
import { formatDate, formatDomain } from "@/lib/format";
import { listNeedsAttention } from "@/lib/queries";
import { NeedsAttentionActions } from "./NeedsAttentionActions";

export const dynamic = "force-dynamic";

export default async function NeedsAttentionPage() {
  const rows = await listNeedsAttention(80);

  return (
    <AppShell activePath="/needs-attention">
      <SectionTitle
        eyebrow="Operator"
        title="Needs Attention"
        description="Technische auditfouten, geblokkeerde runs en ongeldige scores. Samengevoegde opportunities zijn uitgesloten."
      />

      <p className="mb-4 text-xs text-slate-500">{rows.length} items in deze view</p>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-center shadow-mm-card">
            <p className="text-sm text-slate-500">Alles rustig. Geen open aandachtspunten.</p>
          </div>
        ) : (
          rows.map((row) => (
            <article
              key={`${row.kind}-${row.id}`}
              className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="danger">{row.issue_label}</Badge>
                    {row.cro_audit_status ? (
                      <Badge tone="warn">{row.cro_audit_status}</Badge>
                    ) : null}
                    {row.page_health_status === "ERROR" ? (
                      <Badge tone="danger">Page health ERROR</Badge>
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                    <Link
                      href={`/brands/${row.brand_id}`}
                      className="hover:text-[#C2410C]"
                    >
                      {formatDomain(row.domain)}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {row.product_name ?? <EmptyValue label="Geen product" />}
                  </p>
                  {row.last_audit_error ? (
                    <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">
                      {row.last_audit_error}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-slate-400">
                    Retries:{" "}
                    {row.audit_retry_count != null ? row.audit_retry_count : "—"} · Laatste
                    poging: {formatDate(row.last_audit_attempt_at)}
                  </p>
                </div>

                {row.opportunity_id ? (
                  <NeedsAttentionActions
                    opportunityId={row.opportunity_id}
                    brandId={row.brand_id}
                  />
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </AppShell>
  );
}
