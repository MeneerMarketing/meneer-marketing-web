import { CustomersTable } from "@/components/dashboard/CustomersTable";
import { MetricTile } from "@/components/dashboard/ui";
import {
  getCustomerListRows,
  getCustomerOverviewMetrics,
} from "@/lib/data/inbound-customers";

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function KlantenPage() {
  const [rows, metrics] = await Promise.all([
    getCustomerListRows(),
    getCustomerOverviewMetrics(),
  ]);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricTile label="Aanvragen" value={metrics.totalSubmissions} />
        <MetricTile label="Betaald" value={metrics.paidCount} />
        <MetricTile label="€0 promo" value={metrics.waivedCount} />
        <MetricTile
          label="Via outreach"
          value={metrics.withCampaignRef}
          hint="met ?ref="
        />
        <MetricTile
          label="Omzet launch"
          value={formatEuro(metrics.paidRevenueCents)}
        />
      </div>

      <CustomersTable rows={rows} />
    </div>
  );
}
