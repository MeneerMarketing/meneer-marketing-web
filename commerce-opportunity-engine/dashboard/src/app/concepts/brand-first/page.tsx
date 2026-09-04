import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui";
import { BrandFirstDiscoverySection, loadBrandFirstReport } from "./BrandFirstDiscoverySection";
import { BrandFirstBalancedSection, loadBrandFirstBalancedReport } from "./BrandFirstBalancedSection";
import {
  ThirdPartyBrandMiningSection,
  loadThirdPartyBrandMiningReport,
} from "./ThirdPartyBrandMiningSection";
import { PdpGapFirstSection, loadPdpGapFirstReport } from "./PdpGapFirstSection";
import {
  HighTicketPdpGapFirstSection,
  loadHighTicketPdpGapFirstReport,
} from "./HighTicketPdpGapFirstSection";

export const dynamic = "force-dynamic";

export default async function BrandFirstPage() {
  const htPdpGapReport = await loadHighTicketPdpGapFirstReport();
  const pdpGapReport = await loadPdpGapFirstReport();
  const miningReport = await loadThirdPartyBrandMiningReport();
  const balancedReport = await loadBrandFirstBalancedReport();
  const legacyReport = await loadBrandFirstReport();

  if (!htPdpGapReport && !pdpGapReport && !miningReport && !balancedReport && !legacyReport) {
    return (
      <AppShell activePath="/concepts/brand-first">
        <div className="space-y-6 p-6 lg:p-10">
          <SectionTitle
            eyebrow="M9.6"
            title="Brand-first opportunities"
            description="Kleine/middelgrote eigen-merk ecommerce brands met high-ticket hero en design gap."
          />
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-sm text-slate-600">
            Geen rapport gevonden. Draai eerst{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">
              npm run discover:high-ticket-pdp-gap
            </code>
            .
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/concepts/brand-first">
      <div className="space-y-10 p-6 lg:p-10">
        {htPdpGapReport && <HighTicketPdpGapFirstSection report={htPdpGapReport} />}
        {pdpGapReport && (
          <div className={htPdpGapReport ? "border-t border-mm-border pt-10" : ""}>
            <PdpGapFirstSection report={pdpGapReport} />
          </div>
        )}
        {miningReport && (
          <div className={pdpGapReport ? "border-t border-mm-border pt-10" : ""}>
            <ThirdPartyBrandMiningSection report={miningReport} />
          </div>
        )}
        {balancedReport && (
          <div
            className={
              pdpGapReport || miningReport ? "border-t border-mm-border pt-10" : ""
            }
          >
            <BrandFirstBalancedSection report={balancedReport} />
          </div>
        )}
        {legacyReport && (
          <div className="border-t border-mm-border pt-10">
            <BrandFirstDiscoverySection report={legacyReport} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
