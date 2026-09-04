import { AppShell } from "@/components/AppShell";
import { Badge, SectionTitle, StatCard, signalTone } from "@/components/ui";
import { formatDate, formatDomain, signalLabel } from "@/lib/format";
import { getDiscoveryData } from "@/lib/queries";
import { one } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(sp: Record<string, string | string[] | undefined>, key: string) {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = param(sp, "q");
  const signal = param(sp, "signal");
  const page = Number(param(sp, "page") ?? "1");

  const data = await getDiscoveryData({ q, signal, page });

  return (
    <AppShell activePath="/discovery">
      <div className="mb-4 rounded-2xl border border-slate-300 bg-slate-100 px-5 py-4">
        <Badge tone="neutral">Raw Google intelligence</Badge>
        <p className="mt-2 text-sm text-slate-700">
          Dit scherm toont het volledige advertentielandschap, inclusief ketens, marketplaces en
          vergelijkers. Deze domeinen zijn geen prospects. De prospectlijst staat op{" "}
          <a
            href="/concepts/ideal-prospects"
            className="font-semibold text-[#C2410C] hover:underline"
          >
            Ideal prospects
          </a>
          , de keyword-verklaring op{" "}
          <a
            href="/concepts/prospect-quality"
            className="font-semibold text-[#C2410C] hover:underline"
          >
            Prospect quality
          </a>
          .
        </p>
      </div>

      <SectionTitle
        eyebrow="Google Discovery"
        title="Paid signals uit bestaande SERP-data"
        description="Confirmed vs candidate. Geen nieuwe DataForSEO calls vanuit dit scherm."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Keywords tracked" value={data.keywords.length} />
        <StatCard
          label="Confirmed paid ads"
          value={data.signalCounts.CONFIRMED_PAID}
        />
        <StatCard
          label="Paid candidates"
          value={data.signalCounts.PAID_CANDIDATE}
        />
        <StatCard
          label="Confirmed advertisers"
          value={data.confirmedAdvertisers}
        />
      </div>

      <form className="mb-6 flex flex-col gap-3 rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card sm:flex-row">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Zoek keyword, domain, headline…"
          className="flex-1 rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        />
        <select
          name="signal"
          defaultValue={signal ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Alle signalen</option>
          <option value="CONFIRMED_PAID">CONFIRMED_PAID</option>
          <option value="PAID_CANDIDATE">PAID_CANDIDATE</option>
          <option value="NON_PAID">NON_PAID</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white"
        >
          Filter
        </button>
      </form>

      <div className="mb-6 rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Keywords
        </p>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((kw) => (
            <Badge key={kw.id} tone="sky">
              {kw.keyword}
            </Badge>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-slate-500">{data.total} ad occurrences</p>

      <div className="space-y-3">
        {data.rows.map((row) => {
          const brand = one(
            (row as { brands?: { normalized_domain?: string; name?: string } })
              .brands
          );
          const keyword = one(
            (row as { keywords?: { keyword?: string } }).keywords
          );
          return (
            <div
              key={row.id as string}
              className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card"
            >
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge tone={signalTone(row.ad_signal_type as string)}>
                  {signalLabel(row.ad_signal_type as string)}
                </Badge>
                {keyword?.keyword ? (
                  <Badge tone="neutral">{keyword.keyword}</Badge>
                ) : null}
                <Badge tone="sky">
                  {formatDomain(brand?.normalized_domain ?? null)}
                </Badge>
              </div>
              <p className="font-extrabold text-slate-900">
                {(row.headline as string) || "Geen headline"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {(row.description as string) || "Geen description"}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="truncate">
                  {(row.landing_url as string) || "Geen landing"}
                </span>
                <span>{formatDate(row.found_at as string)}</span>
                {row.confirmation_source ? (
                  <span>via {row.confirmation_source as string}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
