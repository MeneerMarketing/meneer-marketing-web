import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui";
import {
  SalesProspectAuditSection,
  loadSalesProspectAuditReport,
} from "./SalesProspectAuditSection";

export const dynamic = "force-dynamic";

export default async function DesignTargetPage() {
  const report = await loadSalesProspectAuditReport();

  if (!report) {
    return (
      <AppShell activePath="/concepts/design-target">
        <div className="space-y-6 p-6 lg:p-10">
          <SectionTitle
            eyebrow="M9.3.4"
            title="Design target"
            description="De sterke prospects uit de nieuwe discovery, geaudit op hun productpagina."
          />
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-sm text-slate-600">
            Geen rapport gevonden. Draai eerst{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">
              npm run concepts:audit-new-sales-prospects
            </code>
            .
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/concepts/design-target">
      <div className="space-y-8 p-6 lg:p-10">
        <SalesProspectAuditSection report={report} />

        <div className="rounded-2xl border border-mm-border bg-white p-5 text-sm text-slate-600">
          <h2 className="text-sm font-bold text-slate-900">Waar kijk je verder</h2>
          <p className="mt-2">
            <Link
              href="/concepts/prospect-quality"
              className="font-semibold text-[#C2410C] hover:underline"
            >
              Prospect quality
            </Link>{" "}
            toont waar deze prospects vandaan komen.{" "}
            <Link
              href="/concepts/outreach-pool"
              className="font-semibold text-[#C2410C] hover:underline"
            >
              Outreach pool
            </Link>{" "}
            toont de bestaande pool en de contrastverdeling.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
