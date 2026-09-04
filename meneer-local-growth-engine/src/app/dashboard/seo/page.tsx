import Link from "next/link";
import {
  Badge,
  DemoBanner,
  MetricTile,
  SectionTitle,
} from "@/components/dashboard/ui";
import {
  getBusinesses,
  getCities,
  getSeoOpportunities,
  getVerticals,
} from "@/lib/data/dashboard";

interface Props {
  searchParams: Promise<{
    status?: string;
    city?: string;
    vertical?: string;
  }>;
}

function statusTone(
  status: string
): "success" | "warn" | "sky" | "neutral" | "danger" | "brand" {
  if (status === "VERY_HIGH") return "success";
  if (status === "HIGH") return "brand";
  if (status === "MEDIUM") return "warn";
  if (status === "FAILED") return "danger";
  if (status === "LOW") return "sky";
  return "neutral";
}

export default async function SeoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [opportunities, businesses, cities, verticals] = await Promise.all([
    getSeoOpportunities(),
    getBusinesses(),
    getCities(),
    getVerticals(),
  ]);

  const filtered = opportunities.filter((seo) => {
    if (sp.status && seo.status !== sp.status) return false;
    if (sp.city) {
      const city = cities.find((c) => c.id === seo.city_id);
      if (city?.slug !== sp.city) return false;
    }
    if (sp.vertical) {
      const vertical = verticals.find((v) => v.id === seo.vertical_id);
      if (vertical?.slug !== sp.vertical) return false;
    }
    return true;
  });

  const statusFilters = ["VERY_HIGH", "HIGH", "MEDIUM", "LOW", "FAILED", "NOT_ANALYZED"] as const;

  return (
    <div>
      <SectionTitle
        eyebrow="SEO"
        title="SEO opportunities"
        description="Lokale zoekvraag, rankings en opportunity-scores. Volume komt uit keyword clusters, niet uit blinde optelling."
      />
      <DemoBanner />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <MetricTile label="Opportunities" value={filtered.length} />
        <MetricTile
          label="VERY HIGH"
          value={opportunities.filter((o) => o.status === "VERY_HIGH").length}
        />
        <MetricTile
          label="Analyzed"
          value={opportunities.filter((o) => o.analyzed_at).length}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/dashboard/seo"
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
            !sp.status ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Alle status
        </Link>
        {statusFilters.map((status) => (
          <Link
            key={status}
            href={`/dashboard/seo?status=${status}${sp.city ? `&city=${sp.city}` : ""}${
              sp.vertical ? `&vertical=${sp.vertical}` : ""
            }`}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              sp.status === status ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/dashboard/seo${sp.status ? `?status=${sp.status}` : ""}`}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
            !sp.city ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Alle steden
        </Link>
        {cities
          .filter((c) => opportunities.some((o) => o.city_id === c.id))
          .map((city) => (
            <Link
              key={city.id}
              href={`/dashboard/seo?city=${city.slug}${sp.status ? `&status=${sp.status}` : ""}`}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                sp.city === city.slug ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {city.name}
            </Link>
          ))}
      </div>

      <div className="overflow-x-auto border border-mm-border bg-white shadow-mm-card">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="border-b border-mm-border bg-mm-surface/60 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Business</th>
              <th className="px-4 py-3 font-bold">City</th>
              <th className="px-4 py-3 font-bold">Primary keyword</th>
              <th className="px-4 py-3 font-bold">Volume</th>
              <th className="px-4 py-3 font-bold">Current rank</th>
              <th className="px-4 py-3 font-bold">SEO opportunity</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Nog geen SEO analyses. Run city SEO analysis eerst.
                </td>
              </tr>
            ) : null}
            {filtered.map((seo) => {
              const business = businesses.find((b) => b.id === seo.business_id);
              const city = cities.find((c) => c.id === seo.city_id);
              return (
                <tr key={seo.id} className="hover:bg-mm-surface/40">
                  <td className="px-4 py-3">
                    {business ? (
                      <Link
                        href={`/dashboard/leads/${business.id}?tab=seo`}
                        className="font-semibold hover:text-[#C2410C]"
                      >
                        {business.studio_name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{city?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-medium">{seo.primary_keyword}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {seo.primary_search_volume != null ? seo.primary_search_volume : "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {seo.current_rank != null ? `#${seo.current_rank}` : "not found"}
                  </td>
                  <td className="px-4 py-3 font-extrabold tabular-nums">
                    {seo.seo_opportunity_score != null
                      ? Math.round(Number(seo.seo_opportunity_score))
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(seo.status)}>{seo.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
