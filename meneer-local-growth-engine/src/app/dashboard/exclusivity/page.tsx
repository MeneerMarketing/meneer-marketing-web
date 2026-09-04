import Link from "next/link";
import {
  Badge,
  DemoBanner,
  SectionTitle,
} from "@/components/dashboard/ui";
import {
  getBusinesses,
  getCities,
  getExclusivity,
  getVerticals,
} from "@/lib/data/dashboard";

function toneFor(status: string) {
  switch (status) {
    case "EXCLUSIVE":
      return "success" as const;
    case "PRIMARY_CANDIDATE":
      return "warn" as const;
    case "RESERVED":
      return "warn" as const;
    case "RELEASED":
      return "danger" as const;
    default:
      return "sky" as const;
  }
}

export default async function ExclusivityPage() {
  const [rows, verticals, cities, businesses] = await Promise.all([
    getExclusivity(),
    getVerticals(),
    getCities(),
    getBusinesses(),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Exclusiviteit"
        title="City exclusivity"
        description="Live Supabase. Geen automatische toewijzing in Milestone 3."
      />
      <DemoBanner />

      <div className="overflow-x-auto border border-mm-border bg-white shadow-mm-card">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="border-b border-mm-border bg-mm-surface/60 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Vertical</th>
              <th className="px-4 py-3 font-bold">City</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Business</th>
              <th className="px-4 py-3 font-bold">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const vertical = verticals.find((v) => v.id === row.vertical_id);
              const city = cities.find((c) => c.id === row.city_id);
              const business = row.business_id
                ? businesses.find((b) => b.id === row.business_id)
                : undefined;
              return (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-semibold">{vertical?.name ?? "—"}</td>
                  <td className="px-4 py-3">{city?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={toneFor(row.status)}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {business ? (
                      <Link
                        href={`/dashboard/leads/${business.id}`}
                        className="font-semibold text-[#C2410C]"
                      >
                        {business.studio_name}
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.notes ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
