import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, SectionTitle } from "@/components/ui";
import {
  eligibilityLabel,
  eligibilityTone,
  resolveEligibilityStatus,
} from "@/lib/eligibility";
import { formatDomain, formatScore } from "@/lib/format";
import { listBrands } from "@/lib/queries";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(sp: Record<string, string | string[] | undefined>, key: string) {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = param(sp, "q");
  const eligibility = param(sp, "eligibility");
  const page = Number(param(sp, "page") ?? "1");
  const { rows, total } = await listBrands({ q, eligibility, page });

  return (
    <AppShell activePath="/brands">
      <SectionTitle
        eyebrow="Brands"
        title="Merk-level intelligence"
        description="Een brand kan meerdere opportunities hebben. Alleen volledig gekwalificeerde merken zijn Lead eligible."
      />

      <form className="mb-6 flex flex-col gap-3 rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card sm:flex-row">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Zoek brand of domain…"
          className="flex-1 rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        />
        <select
          name="eligibility"
          defaultValue={eligibility ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Alle brands</option>
          <option value="LEAD_ELIGIBLE">Lead eligible</option>
          <option value="PENDING_QUALIFICATION">Pending qualification</option>
          <option value="EXCLUDED">Excluded</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white"
        >
          Zoeken
        </button>
      </form>

      <p className="mb-3 text-xs text-slate-500">{total} brands</p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((brand) => {
          const status = resolveEligibilityStatus(brand);
          return (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card transition hover:-translate-y-0.5 hover:shadow-mm-float"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-extrabold text-slate-900">
                    {formatDomain(brand.normalized_domain)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{brand.name}</p>
                </div>
                <Badge tone={eligibilityTone(status)}>
                  {eligibilityLabel(status)}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="sky">{brand.business_type}</Badge>
                {brand.manual_excluded ? <Badge tone="danger">Manual</Badge> : null}
                <Badge tone="neutral">
                  {brand.platform && brand.platform !== "UNKNOWN"
                    ? brand.platform
                    : brand.platform_candidate && brand.platform_candidate !== "UNKNOWN"
                      ? `${brand.platform_candidate}*`
                      : "Platform onbekend"}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span>Maturity {formatScore(brand.business_maturity_score)}</span>
                <span>Scale {formatScore(brand.retailer_scale_score)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
