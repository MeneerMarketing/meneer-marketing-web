import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, Panel, SectionTitle } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";
import { ConceptActions } from "./ConceptActions";

export const dynamic = "force-dynamic";

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: candidate, error } = await supabase
    .from("coe_concept_candidates")
    .select(
      `*, brands (
        id, name, normalized_domain, platform, business_type,
        business_maturity_score, retailer_scale_score, pre_fit_score,
        confirmed_google_advertiser, eligibility_status
      )`
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!candidate) {
    return (
      <AppShell activePath="/concepts">
        <SectionTitle title="Concept niet gevonden" />
        <Link href="/concepts" className="text-[#FF5722]">
          Terug naar Concepts
        </Link>
      </AppShell>
    );
  }

  const brand = Array.isArray(candidate.brands)
    ? candidate.brands[0]
    : candidate.brands;

  const { data: briefs } = await supabase
    .from("coe_concept_briefs")
    .select("*")
    .eq("concept_candidate_id", id)
    .order("concept_version", { ascending: false })
    .limit(5);

  const latestBrief = briefs?.[0] ?? null;

  let audit: {
    conversion_leaks: unknown;
    strengths: unknown;
    screenshot_paths: Record<string, string | null> | null;
    cro_scores: Record<string, number | null> | null;
  } | null = null;
  if (candidate.opportunity_id) {
    const { data } = await supabase
      .from("audits")
      .select("conversion_leaks, strengths, screenshot_paths, cro_scores, status")
      .eq("opportunity_id", candidate.opportunity_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    audit = data;
  }

  const components = (candidate.concept_ready_components ?? {}) as Record<
    string,
    unknown
  >;
  const sectionPlan = (latestBrief?.recommended_section_plan ??
    []) as Array<{ section: string; reason?: string; content_source?: string }>;
  const heroCandidates = Array.isArray(candidate.hero_candidates)
    ? candidate.hero_candidates
    : [];

  const assetComponents = (candidate.asset_readiness_components ??
    {}) as Record<string, number | null>;

  return (
    <AppShell activePath="/concepts">
      <div className="mb-4">
        <Link href="/concepts" className="text-xs font-bold text-slate-400 hover:text-[#FF5722]">
          ← Concepts
        </Link>
      </div>

      <SectionTitle
        eyebrow="Concept detail"
        title={brand?.name ?? brand?.normalized_domain ?? "Concept"}
        description={`${brand?.normalized_domain ?? ""} · score ${candidate.concept_ready_score ?? "—"} · ${candidate.concept_verdict ?? ""}`}
      />

      <ConceptActions
        id={candidate.id}
        status={candidate.status}
        currentProduct={candidate.primary_concept_product_title}
        heroCandidates={heroCandidates as Array<{ product_title: string }>}
        templateFamily={
          candidate.manual_template_family ??
          candidate.suggested_template_family
        }
        operatorNote={candidate.operator_note}
        needsAssets={candidate.needs_assets}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Why this brand">
          <dl className="space-y-2 text-sm">
            <Row label="Business maturity" value={brand?.business_maturity_score} />
            <Row label="Platform" value={brand?.platform} />
            <Row label="Commerce model" value={candidate.brand_commerce_model} />
            <Row
              label="Catalog focus"
              value={`${candidate.catalog_focus_score ?? "—"} (${candidate.catalog_size_tier ?? "—"})`}
            />
            <Row
              label="Est. products"
              value={candidate.estimated_product_count}
            />
            <Row
              label="Google / paid"
              value={brand?.confirmed_google_advertiser ? "Confirmed advertiser" : "Weak / unknown"}
            />
            <Row label="Retailer scale" value={brand?.retailer_scale_score} />
            <Row label="Own-brand ratio" value={candidate.own_brand_ratio_estimate} />
            <Row label="Own-brand confidence" value={candidate.own_brand_confidence} />
          </dl>
        </Panel>

        <Panel title="Why this product">
          <dl className="space-y-2 text-sm">
            <Row label="Product" value={candidate.primary_concept_product_title} />
            <Row label="Hero score" value={candidate.hero_product_score} />
            <Row label="Hero confidence" value={candidate.hero_product_confidence} />
            <Row
              label="Price"
              value={
                candidate.primary_concept_product_price != null
                  ? `${candidate.primary_concept_product_currency ?? "€"} ${candidate.primary_concept_product_price}`
                  : null
              }
            />
            <Row
              label="Commercial signal"
              value={candidate.product_commercial_signal_score}
            />
            <Row label="Manual override" value={candidate.manual_product_override ? "Yes" : "No"} />
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {candidate.hero_product_reasoning ?? "Geen hero reasoning."}
          </p>
          {heroCandidates.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {(heroCandidates as Array<{ product_title: string; hero_product_score?: number }>).map(
                (h) => (
                  <li key={h.product_title}>
                    {h.product_title} · {h.hero_product_score ?? "—"}
                  </li>
                )
              )}
            </ul>
          ) : null}
        </Panel>

        <Panel title="Asset inventory">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(assetComponents).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5"
              >
                <span className="text-slate-500">{k}</span>
                <span className="font-bold text-slate-800">
                  {v == null ? "NULL" : v}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Asset readiness:{" "}
            <strong>{candidate.concept_asset_readiness_score ?? "—"}</strong>
            {candidate.needs_assets ? " · needs assets" : ""}
          </p>
        </Panel>

        <Panel title="Current PDP">
          <p className="mb-2 text-xs text-slate-500">
            Screenshots / audit signals (geen fictieve redesign).
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {audit?.screenshot_paths
              ? Object.entries(audit.screenshot_paths)
                  .filter(([, v]) => Boolean(v))
                  .map(([k]) => (
                    <Badge key={k} tone="sky">
                      {k}
                    </Badge>
                  ))
              : (
                <EmptyValue label="Geen screenshots" />
              )}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Strengths
          </p>
          <ul className="mt-1 mb-3 list-disc pl-4 text-xs text-slate-600">
            {Array.isArray(audit?.strengths) && audit!.strengths.length
              ? audit!.strengths.slice(0, 5).map((s, i) => (
                  <li key={i}>
                    {typeof s === "string"
                      ? s
                      : JSON.stringify(s).slice(0, 100)}
                  </li>
                ))
              : (
                <li>
                  <EmptyValue />
                </li>
              )}
          </ul>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Supported leaks
          </p>
          <ul className="mt-1 list-disc pl-4 text-xs text-slate-600">
            {Array.isArray(audit?.conversion_leaks) && audit!.conversion_leaks.length
              ? audit!.conversion_leaks.slice(0, 5).map((s, i) => (
                  <li key={i}>
                    {typeof s === "string"
                      ? s
                      : JSON.stringify(s).slice(0, 100)}
                  </li>
                ))
              : (
                <li>
                  <EmptyValue />
                </li>
              )}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Concept plan">
          <dl className="space-y-2 text-sm">
            <Row label="Concept type" value={candidate.recommended_concept_type} />
            <Row label="Project type" value={candidate.recommended_project_type} />
            <Row
              label="Template family"
              value={
                candidate.manual_template_family ??
                candidate.suggested_template_family
              }
            />
            <Row label="PDP transformation" value={candidate.pdp_transformation_potential} />
            <Row label="Status" value={candidate.status} />
          </dl>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recommended section plan
          </p>
          {sectionPlan.length ? (
            <ol className="mt-2 space-y-1 text-xs text-slate-700">
              {sectionPlan.map((s) => (
                <li key={s.section} className="flex flex-wrap gap-2">
                  <Badge tone="brand">{s.section}</Badge>
                  <span className="text-slate-400">{s.content_source}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-xs text-slate-400">
              Nog geen brief. Run `concepts:build-briefs` na approve.
            </p>
          )}
          <p className="mt-4 text-xs text-amber-700">
            Preview lifecycle: INTERNAL_PREVIEW tot handmatige visual review.
            {latestBrief?.preview_url ? (
              <>
                {" "}
                <Link
                  className="font-semibold underline"
                  href={String(latestBrief.preview_url)}
                >
                  Open concept preview
                </Link>
              </>
            ) : null}
          </p>
        </Panel>

        <Panel title="Concept Ready components">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(components)
              .filter(([k]) => !["weights", "formula", "retailer_scale_penalty"].includes(k))
              .map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between rounded-lg bg-slate-50 px-2 py-1.5"
                >
                  <span className="text-slate-500">{k}</span>
                  <span className="font-bold">{String(v)}</span>
                </div>
              ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Penalty: {String(components.retailer_scale_penalty ?? 0)} ·{" "}
            {String(components.formula ?? "")}
          </p>
        </Panel>
      </div>

      {latestBrief ? (
        <div className="mt-6">
          <Panel title={`Brief v${latestBrief.concept_version}`}>
            <p className="text-xs text-slate-500">
              preview_slug: {latestBrief.preview_slug ?? "—"} · preview_url:{" "}
              <strong>null</strong> (nog geen echte preview)
            </p>
            <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-[11px] text-slate-100">
              {JSON.stringify(latestBrief.brief, null, 2).slice(0, 6000)}
            </pre>
          </Panel>
        </div>
      ) : null}
    </AppShell>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-semibold text-slate-800">
        {value == null || value === "" ? <EmptyValue /> : value}
      </dd>
    </div>
  );
}
