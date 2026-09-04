import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui";
import { HighTicketDiscoverySection, loadHighTicketReport } from "./HighTicketDiscoverySection";

export const dynamic = "force-dynamic";

export default async function HighTicketPage() {
  const report = await loadHighTicketReport();

  if (!report) {
    return (
      <AppShell activePath="/concepts/high-ticket">
        <div className="space-y-6 p-6 lg:p-10">
          <SectionTitle
            eyebrow="M9.4"
            title="High-ticket brands"
            description="Merken met hetzelfde commerciële profiel als SkinComplete, ongeacht de branche."
          />
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-sm text-slate-600">
            Geen rapport gevonden. Draai eerst{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run discover:high-ticket</code>.
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/concepts/high-ticket">
      <div className="space-y-8 p-6 lg:p-10">
        <HighTicketDiscoverySection report={report} />

        <div className="rounded-2xl border border-mm-border bg-white p-5 text-sm text-slate-600">
          <h2 className="text-sm font-bold text-slate-900">Waar kijk je verder</h2>
          <p className="mt-2">
            <Link
              href="/concepts/design-target"
              className="font-semibold text-[#C2410C] hover:underline"
            >
              Design target
            </Link>{" "}
            toont de audits op de vorige pool.{" "}
            <Link
              href="/concepts/prospect-quality"
              className="font-semibold text-[#C2410C] hover:underline"
            >
              Prospect quality
            </Link>{" "}
            toont waar keywords en prospects vandaan komen.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
