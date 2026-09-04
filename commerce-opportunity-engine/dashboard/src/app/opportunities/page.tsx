import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OpportunitiesTable } from "@/components/OpportunitiesTable";
import { SectionTitle } from "@/components/ui";
import { listOpportunities } from "@/lib/queries";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(sp: Record<string, string | string[] | undefined>, key: string) {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}

const QUICK_FILTERS = [
  { key: "best", label: "Beste prospects" },
  { key: "shopify", label: "Shopify" },
  { key: "mmFit85", label: "MM Fit 85+" },
  { key: "opp85", label: "Opportunity 85+" },
  { key: "exactPaid", label: "Exact Paid" },
  { key: "highConf", label: "High Confidence" },
  { key: "needsRetry", label: "Needs Retry" },
  { key: "notAudited", label: "Not Audited" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "favorites", label: "Favorites" },
] as const;

function buildFilterHref(
  base: Record<string, string | number | undefined>,
  quickView?: string
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined && value !== "" && key !== "quickView") {
      params.set(key, String(value));
    }
  }
  if (quickView) params.set("quickView", quickView);
  const qs = params.toString();
  return qs ? `/opportunities?${qs}` : "/opportunities";
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters = {
    q: param(sp, "q"),
    status: param(sp, "status"),
    confirmed: param(sp, "confirmed"),
    platform: param(sp, "platform"),
    businessType: param(sp, "businessType"),
    leadEligible: param(sp, "leadEligible"),
    hasProduct: param(sp, "hasProduct"),
    maturityMin: param(sp, "maturityMin"),
    scaleMax: param(sp, "scaleMax"),
    keywordCategory: param(sp, "keywordCategory"),
    verdict: param(sp, "verdict"),
    audited: param(sp, "audited"),
    auditStatus: param(sp, "auditStatus"),
    scoreMin: param(sp, "scoreMin"),
    confidenceMin: param(sp, "confidenceMin"),
    sort: param(sp, "sort"),
    quickView: param(sp, "quickView"),
    tagSlug: param(sp, "tagSlug"),
    favorite: param(sp, "favorite"),
    shortlisted: param(sp, "shortlisted"),
    page: Number(param(sp, "page") ?? "1"),
  };

  const { rows, total, page, pageSize } = await listOpportunities(filters);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeQuick = filters.quickView;

  return (
    <AppShell activePath="/opportunities">
      <SectionTitle
        eyebrow="Opportunities"
        title="Commerciële landing targets"
        description="Opportunity Score = commerciële verbeterkans. MM Fit = hoe goed dit bedrijf als klant past. Samengevoegde duplicates zijn verborgen."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={buildFilterHref(filters)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            !activeQuick
              ? "bg-[#FF5722] text-white"
              : "border border-mm-border bg-white text-slate-600 hover:border-[#FF5722]/40"
          }`}
        >
          Alles
        </Link>
        {QUICK_FILTERS.map((item) => (
          <Link
            key={item.key}
            href={buildFilterHref(filters, item.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              activeQuick === item.key
                ? "bg-[#FF5722] text-white"
                : "border border-mm-border bg-white text-slate-600 hover:border-[#FF5722]/40"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <form className="mb-6 grid gap-3 rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card md:grid-cols-3 xl:grid-cols-4">
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Zoek brand, domain, product, keyword…"
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm outline-none focus:border-mm-sky-deep md:col-span-2"
        />
        {activeQuick ? (
          <input type="hidden" name="quickView" value={activeQuick} />
        ) : null}
        <select
          name="sort"
          defaultValue={filters.sort ?? "recent"}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="recent">Recent discovered</option>
          <option value="best">Best prospects</option>
          <option value="score">Opportunity Score</option>
          <option value="mmFit">Meneer Marketing Fit</option>
          <option value="maturity">Business maturity</option>
          <option value="keywords">Paid keyword coverage</option>
          <option value="price">Price</option>
          <option value="reviews">Review count</option>
        </select>
        <select
          name="keywordCategory"
          defaultValue={filters.keywordCategory ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Keyword category</option>
          <option value="Beauty / Skincare">Beauty / Skincare</option>
          <option value="Haircare">Haircare</option>
          <option value="Sleep">Sleep</option>
          <option value="Pets">Pets</option>
          <option value="Home">Home</option>
          <option value="Fitness">Fitness</option>
          <option value="Wellness">Wellness</option>
        </select>
        <select
          name="scoreMin"
          defaultValue={filters.scoreMin ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Score filter</option>
          <option value="85">Score 85+</option>
          <option value="93">Score 93+</option>
        </select>
        <select
          name="verdict"
          defaultValue={filters.verdict ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Verdict</option>
          <option value="HIGH_PRIORITY">High Priority</option>
          <option value="CONTACT_IMMEDIATELY">Contact Immediately</option>
          <option value="INTERESTING">Interesting</option>
          <option value="LOW_PRIORITY">Low Priority</option>
          <option value="SKIP">Skip</option>
        </select>
        <select
          name="audited"
          defaultValue={filters.audited ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Audited filter</option>
          <option value="true">Audited (completed)</option>
          <option value="false">Not audited</option>
        </select>
        <select
          name="auditStatus"
          defaultValue={filters.auditStatus ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Audit status</option>
          <option value="completed">Completed</option>
          <option value="needs_retry">Needs retry</option>
          <option value="blocked">Blocked</option>
          <option value="not_audited">Not audited</option>
        </select>
        <select
          name="confidenceMin"
          defaultValue={filters.confidenceMin ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Audit confidence</option>
          <option value="70">Confidence &gt;= 70</option>
        </select>
        <select
          name="confirmed"
          defaultValue={filters.confirmed ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Paid filter</option>
          <option value="true">Confirmed Google advertiser</option>
          <option value="false">Not confirmed</option>
        </select>
        <select
          name="platform"
          defaultValue={filters.platform ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Platform</option>
          <option value="SHOPIFY">Shopify</option>
          <option value="WOOCOMMERCE">WooCommerce / migration</option>
        </select>
        <select
          name="businessType"
          defaultValue={filters.businessType ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Business type</option>
          <option value="BRAND">BRAND</option>
          <option value="SPECIALIST_WEBSHOP">SPECIALIST_WEBSHOP</option>
          <option value="GENERAL_RETAILER">GENERAL_RETAILER</option>
          <option value="SERVICE_BUSINESS">SERVICE_BUSINESS</option>
        </select>
        <select
          name="leadEligible"
          defaultValue={filters.leadEligible ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Lead eligible</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <select
          name="hasProduct"
          defaultValue={filters.hasProduct ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Product page</option>
          <option value="true">Has product page</option>
          <option value="false">No product page</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
        >
          Filter
        </button>
      </form>

      <p className="mb-3 text-xs text-slate-500">
        {total} opportunities · pagina {page}/{totalPages}
      </p>

      <OpportunitiesTable rows={rows} />

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 ? (
            <Link
              href={buildFilterHref({ ...filters, page: page - 1 }, activeQuick)}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
            >
              Vorige
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={buildFilterHref({ ...filters, page: page + 1 }, activeQuick)}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
            >
              Volgende
            </Link>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}
