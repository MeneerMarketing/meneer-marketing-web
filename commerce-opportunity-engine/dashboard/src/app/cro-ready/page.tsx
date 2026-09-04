import { AppShell } from "@/components/AppShell";
import {
  Badge,
  EmptyValue,
  Panel,
  SectionTitle,
} from "@/components/ui";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type CroReadyRow = {
  id: string;
  landing_url: string | null;
  cro_readiness_level: string | null;
  source_quality_score: number | null;
  target_priority_score: number | null;
  cro_audit_eligible: boolean | null;
  status: string | null;
  ad_headline: string | null;
  opportunity_score: number | null;
  meneer_marketing_fit_score: number | null;
  product_merchant_relationship: string | null;
  recommended_project_type: string | null;
  pdp_improvement_potential: number | null;
  full_rebuild_potential: number | null;
  cro_audit_status: string | null;
  brands: {
    normalized_domain: string | null;
    platform: string | null;
    pre_fit_score: number | null;
    confirmed_google_advertiser: boolean | null;
    transparency_status: string | null;
  } | null;
  keywords: {
    keyword: string | null;
  } | null;
};

type UnresolvedBrand = {
  normalized_domain: string | null;
  platform: string | null;
  pre_fit_score: number | null;
  paid_target_status: string | null;
  confirmed_google_advertiser: boolean | null;
  transparency_status: string | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function CroReadyPage() {
  const supabase = getSupabase();
  let ready: CroReadyRow[] = [];
  let unresolved: UnresolvedBrand[] = [];
  let loadError: string | null = null;

  try {
    const [readyRes, unresolvedRes] = await Promise.all([
      supabase
        .from("opportunities")
        .select(
          `id, landing_url, cro_readiness_level, source_quality_score, target_priority_score,
           cro_audit_eligible, status, ad_headline, opportunity_score, meneer_marketing_fit_score,
           product_merchant_relationship, recommended_project_type, pdp_improvement_potential,
           full_rebuild_potential, cro_audit_status,
           brands(normalized_domain, platform, pre_fit_score, confirmed_google_advertiser, transparency_status),
           keywords(keyword)`
        )
        .eq("cro_audit_eligible", true)
        .in("cro_readiness_level", ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET"])
        .order("target_priority_score", { ascending: false, nullsFirst: false })
        .limit(40),
      supabase
        .from("brands")
        .select(
          "normalized_domain, platform, pre_fit_score, paid_target_status, confirmed_google_advertiser, transparency_status"
        )
        .eq("confirmed_google_advertiser", true)
        .eq("manual_excluded", false)
        .or(
          "paid_target_status.eq.NOT_RESOLVED,paid_target_status.is.null,paid_target_status.eq.PARTIAL"
        )
        .order("pre_fit_score", { ascending: false, nullsFirst: false })
        .limit(40),
    ]);

    if (readyRes.error) throw new Error(readyRes.error.message);
    if (unresolvedRes.error) throw new Error(unresolvedRes.error.message);

    ready = (readyRes.data ?? []).map((row) => ({
      ...row,
      brands: one(row.brands as CroReadyRow["brands"] | CroReadyRow["brands"][]),
      keywords: one(row.keywords as CroReadyRow["keywords"] | CroReadyRow["keywords"][]),
    })) as CroReadyRow[];

    unresolved = (unresolvedRes.data ?? []) as UnresolvedBrand[];
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Kon CRO Ready niet laden";
  }

  return (
    <AppShell activePath="/cro-ready">
      <SectionTitle
        eyebrow="Milestone 7.2.2"
        title="CRO Ready"
        description="Confirmed advertisers met betrouwbare Search/Shopping targets. Commercial fit na audit zichtbaar."
      />

      {loadError ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : null}

      <div className="mb-8 overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-extrabold text-slate-900">CRO Ready</h3>
          <p className="mt-1 text-xs text-slate-500">
            Exact paid funnels en high-confidence product targets, gesorteerd op
            target priority
          </p>
        </div>
        <table className="w-full min-w-[1400px] text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-3">Brand</th>
              <th className="px-3 py-3">Platform</th>
              <th className="px-3 py-3">Pre-fit</th>
              <th className="px-3 py-3">Ads</th>
              <th className="px-3 py-3">Target type</th>
              <th className="px-3 py-3">Keyword</th>
              <th className="px-3 py-3">Target URL</th>
              <th className="px-3 py-3">Opp / MM</th>
              <th className="px-3 py-3">Product rel</th>
              <th className="px-3 py-3">Project</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Audit</th>
            </tr>
          </thead>
          <tbody>
            {ready.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-slate-500">
                  <EmptyValue label="—" />
                  <span className="mt-1 block text-xs">
                    Run npm run harvest:confirmed-targets
                  </span>
                </td>
              </tr>
            ) : (
              ready.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-slate-100 hover:bg-mm-sky-subtle/40"
                >
                  <td className="px-3 py-2.5 font-bold text-slate-900">
                    <a
                      href={`/opportunities/${row.id}`}
                      className="hover:underline"
                    >
                      {row.brands?.normalized_domain ?? <EmptyValue label="—" />}
                    </a>
                  </td>
                  <td className="px-3 py-2.5">
                    {row.brands?.platform ? (
                      <Badge tone="neutral">{row.brands.platform}</Badge>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-extrabold tabular-nums text-[#C2410C]">
                    {row.brands?.pre_fit_score ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge
                      tone={
                        row.brands?.confirmed_google_advertiser
                          ? "success"
                          : "warn"
                      }
                    >
                      {row.brands?.confirmed_google_advertiser
                        ? "CONFIRMED"
                        : row.brands?.transparency_status ?? "—"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-xs">
                    {row.cro_readiness_level ?? <EmptyValue label="—" />}
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-2.5 text-xs text-slate-600">
                    {row.keywords?.keyword ?? <EmptyValue label="—" />}
                  </td>
                  <td className="max-w-[220px] truncate px-3 py-2.5 text-xs">
                    {row.landing_url ? (
                      <a
                        href={row.landing_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C2410C] underline-offset-2 hover:underline"
                      >
                        {row.landing_url}
                      </a>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs tabular-nums">
                    {row.opportunity_score != null ||
                    row.meneer_marketing_fit_score != null ? (
                      <span>
                        {row.opportunity_score != null
                          ? Math.round(Number(row.opportunity_score))
                          : "—"}
                        {" / "}
                        {row.meneer_marketing_fit_score != null
                          ? Math.round(Number(row.meneer_marketing_fit_score))
                          : "—"}
                      </span>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs">
                    {row.product_merchant_relationship ? (
                      <Badge
                        tone={
                          row.product_merchant_relationship === "OWN_BRAND"
                            ? "success"
                            : row.product_merchant_relationship ===
                                "RESELLER_PRODUCT"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {row.product_merchant_relationship === "OWN_BRAND"
                          ? "Own Brand"
                          : row.product_merchant_relationship ===
                              "RESELLER_PRODUCT"
                            ? "Reseller"
                            : row.product_merchant_relationship}
                      </Badge>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="max-w-[140px] truncate px-3 py-2.5 text-xs">
                    {row.recommended_project_type ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5 font-extrabold tabular-nums">
                    {row.target_priority_score ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge
                      tone={
                        row.cro_audit_status === "COMPLETED"
                          ? "success"
                          : row.cro_audit_status === "FAILED_TECHNICAL" ||
                              row.cro_audit_status === "NEEDS_RETRY"
                            ? "warn"
                            : "sky"
                      }
                    >
                      {row.cro_audit_status ?? row.status ?? "NEW"}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Panel title="TARGET UNRESOLVED">
        <p className="mb-4 text-xs text-slate-500">
          Confirmed advertisers zonder bruikbaar Search/Shopping target. Geen
          random product fallback.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-3">Brand</th>
                <th className="px-3 py-3">Platform</th>
                <th className="px-3 py-3">Pre-fit</th>
                <th className="px-3 py-3">Ads</th>
                <th className="px-3 py-3">Target status</th>
              </tr>
            </thead>
            <tbody>
              {unresolved.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    <EmptyValue label="—" />
                  </td>
                </tr>
              ) : (
                unresolved.map((row, i) => (
                  <tr
                    key={`${row.normalized_domain ?? "u"}-${i}`}
                    className="border-t border-slate-100"
                  >
                    <td className="px-3 py-2.5 font-bold">
                      {row.normalized_domain ?? <EmptyValue label="—" />}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.platform ?? <EmptyValue label="—" />}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {row.pre_fit_score ?? <EmptyValue label="—" />}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone="success">CONFIRMED</Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone="warn">
                        {row.paid_target_status ?? "NOT_RESOLVED"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
