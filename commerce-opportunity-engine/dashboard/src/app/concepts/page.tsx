import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type ViewKey =
  | "ready"
  | "strong"
  | "needs-assets"
  | "not-suitable"
  | "brief-ready"
  | "all";

const VIEWS: Array<{ key: ViewKey; label: string }> = [
  { key: "ready", label: "Concept Ready" },
  { key: "strong", label: "Strong Candidates" },
  { key: "needs-assets", label: "Needs Assets" },
  { key: "not-suitable", label: "Not Suitable" },
  { key: "brief-ready", label: "Brief Ready" },
  { key: "all", label: "All" },
];

function param(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}

function toneForVerdict(
  v: string | null
): "success" | "warn" | "danger" | "sky" | "neutral" {
  if (v === "CONCEPT_READY" || v === "STRONG_CONCEPT") return "success";
  if (v === "POSSIBLE_CONCEPT" || v === "WEAK_CONCEPT_CANDIDATE") return "warn";
  if (v === "NOT_SUITABLE") return "danger";
  return "neutral";
}

export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const view = (param(sp, "view") as ViewKey) || "ready";
  const shopify = param(sp, "shopify") === "1";
  const ownBrand = param(sp, "ownBrand") === "1";
  const focused = param(sp, "focused") === "1";
  const score80 = param(sp, "score80") === "1";
  const score90 = param(sp, "score90") === "1";
  const hasHero = param(sp, "hasHero") === "1";
  const assets75 = param(sp, "assets75") === "1";
  const transform70 = param(sp, "transform70") === "1";
  const category = param(sp, "category");

  const supabase = getSupabase();
  let query = supabase
    .from("coe_concept_candidates")
    .select(
      `id, status, concept_ready_score, concept_verdict, brand_commerce_model,
       catalog_focus_score, catalog_size_tier, primary_concept_product_title,
       primary_concept_product_price, primary_concept_product_currency,
       hero_product_score, concept_asset_readiness_score, pdp_transformation_potential,
       recommended_concept_type, needs_assets, suggested_template_family,
       brands ( id, name, normalized_domain, platform, business_type )`
    )
    .order("concept_ready_score", { ascending: false, nullsFirst: false })
    .limit(200);

  if (view === "ready") query = query.gte("concept_ready_score", 90);
  if (view === "strong")
    query = query.gte("concept_ready_score", 80).lt("concept_ready_score", 90);
  if (view === "needs-assets") query = query.eq("needs_assets", true);
  if (view === "not-suitable")
    query = query.or("status.eq.NOT_SUITABLE,concept_ready_score.lt.50");
  if (view === "brief-ready") query = query.eq("status", "BRIEF_READY");
  if (score80) query = query.gte("concept_ready_score", 80);
  if (score90) query = query.gte("concept_ready_score", 90);
  if (hasHero) query = query.not("primary_concept_product_title", "is", null);
  if (assets75) query = query.gte("concept_asset_readiness_score", 75);
  if (transform70) query = query.gte("pdp_transformation_potential", 70);
  if (ownBrand)
    query = query.in("brand_commerce_model", [
      "DTC_OWN_BRAND",
      "MOSTLY_OWN_BRAND",
    ]);
  if (focused) query = query.gte("catalog_focus_score", 65);

  const { data, error } = await query;
  if (error) throw error;

  let rows = data ?? [];
  if (shopify) {
    rows = rows.filter((r) => {
      const b = Array.isArray(r.brands) ? r.brands[0] : r.brands;
      return (b?.platform ?? "").toUpperCase() === "SHOPIFY";
    });
  }
  if (category) {
    const needle = category.toLowerCase();
    rows = rows.filter((r) => {
      const b = Array.isArray(r.brands) ? r.brands[0] : r.brands;
      const hay = `${b?.normalized_domain ?? ""} ${r.primary_concept_product_title ?? ""}`.toLowerCase();
      if (needle === "beauty")
        return /skin|beauty|cosmetic|body|boozy|currentbody|huid/.test(hay);
      if (needle === "sleep") return /dekbed|slaap|kussen|sleep|matras/.test(hay);
      if (needle === "pets") return /huisdier|pet|hond|dog|dier/.test(hay);
      return hay.includes(needle);
    });
  }

  function href(next: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      view,
      shopify: shopify ? "1" : undefined,
      ownBrand: ownBrand ? "1" : undefined,
      focused: focused ? "1" : undefined,
      score80: score80 ? "1" : undefined,
      score90: score90 ? "1" : undefined,
      hasHero: hasHero ? "1" : undefined,
      assets75: assets75 ? "1" : undefined,
      transform70: transform70 ? "1" : undefined,
      category,
      ...next,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/concepts?${qs}` : "/concepts";
  }

  const FILTERS = [
    { key: "shopify", label: "Shopify", on: shopify },
    { key: "ownBrand", label: "Own brand", on: ownBrand },
    { key: "focused", label: "Focused catalog", on: focused },
    { key: "score80", label: "Concept Ready 80+", on: score80 },
    { key: "score90", label: "Concept Ready 90+", on: score90 },
    { key: "hasHero", label: "Has hero product", on: hasHero },
    { key: "assets75", label: "Asset readiness 75+", on: assets75 },
    { key: "transform70", label: "PDP transformation 70+", on: transform70 },
  ] as const;

  return (
    <AppShell activePath="/concepts">
      <SectionTitle
        eyebrow="Concepts"
        title="Concept Ready queue"
        description="Interne ranking voor concept-first PDP previews. Geen visuele templates, geen prospectmail."
      />
      <div className="mb-4 flex flex-wrap gap-4">
        <Link
          href="/concepts/outreach-pool"
          className="text-sm font-semibold text-[#C2410C] hover:underline"
        >
          Outreach pool ranking (CRO coverage) →
        </Link>
        <Link
          href="/concepts/ideal-prospects"
          className="text-sm font-semibold text-[#C2410C] hover:underline"
        >
          Ideal prospects (M9.3) →
        </Link>
        <Link
          href="/concepts/prospect-quality"
          className="text-sm font-semibold text-[#C2410C] hover:underline"
        >
          Prospect quality &amp; keyword gates (M9.3.1) →
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={href({ view: v.key })}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              view === v.key
                ? "bg-[#FF5722] text-white"
                : "border border-mm-border bg-white text-slate-600 hover:border-[#FF5722]/40"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={href({ [f.key]: f.on ? undefined : "1" })}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              f.on
                ? "bg-slate-900 text-white"
                : "border border-mm-border bg-white text-slate-500"
            }`}
          >
            {f.label}
          </Link>
        ))}
        {(["beauty", "sleep", "pets"] as const).map((cat) => (
          <Link
            key={cat}
            href={href({ category: category === cat ? undefined : cat })}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize ${
              category === cat
                ? "bg-slate-900 text-white"
                : "border border-mm-border bg-white text-slate-500"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mm-border bg-slate-50 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Commerce model</th>
              <th className="px-4 py-3">Catalog focus</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Hero</th>
              <th className="px-4 py-3">Assets</th>
              <th className="px-4 py-3">PDP Δ</th>
              <th className="px-4 py-3">Concept Ready</th>
              <th className="px-4 py-3">Concept</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-slate-400">
                  Geen concept candidates voor deze view. Run `npm run concepts:score`.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const brand = Array.isArray(row.brands)
                  ? row.brands[0]
                  : row.brands;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-mm-border/70 hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/concepts/${row.id}`}
                        className="font-semibold text-slate-900 hover:text-[#FF5722]"
                      >
                        {brand?.name ?? brand?.normalized_domain ?? "—"}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {brand?.normalized_domain}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold">
                      {brand?.platform ?? <EmptyValue />}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {row.brand_commerce_model ?? <EmptyValue />}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {row.catalog_focus_score ?? "—"}
                      <span className="ml-1 text-slate-400">
                        {row.catalog_size_tier}
                      </span>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs">
                      {row.primary_concept_product_title ?? <EmptyValue />}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {row.primary_concept_product_price != null
                        ? `${row.primary_concept_product_currency ?? "€"}${row.primary_concept_product_price}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      {row.hero_product_score ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      {row.concept_asset_readiness_score ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      {row.pdp_transformation_potential ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900">
                        {row.concept_ready_score ?? "—"}
                      </div>
                      <Badge tone={toneForVerdict(row.concept_verdict)}>
                        {row.concept_verdict ?? "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      {row.recommended_concept_type ?? <EmptyValue />}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          row.status === "BRIEF_READY"
                            ? "success"
                            : row.needs_assets
                              ? "warn"
                              : "sky"
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
