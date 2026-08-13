import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  DemoBanner,
  KeyValue,
  Panel,
  TextLink,
  leadStatusTone,
} from "@/components/dashboard/ui";
import { PreviewActions } from "@/components/dashboard/PreviewActions";
import { GenerateOutreachButton } from "@/components/dashboard/OutreachActions";
import {
  getActivityForBusiness,
  getBusinessById,
  getCities,
  getContactsForBusiness,
  getExclusivity,
  getOutreachMessages,
  getPreviewsForBusiness,
  getSeoForBusiness,
  getTemplates,
  getVerticals,
} from "@/lib/data/dashboard";
import { buildLeadJourney, getCampaignEventSplit } from "@/services/campaigns/campaignService";
import { createAdminClient } from "@/lib/supabase/admin";
import { maskCampaignRef } from "@/services/campaigns/types";
import { PreparePilotButton } from "@/components/dashboard/PreparePilotButton";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

const TABS = [
  "overview",
  "journey",
  "website",
  "preview",
  "seo",
  "contact",
  "outreach",
  "activity",
] as const;

export default async function LeadDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab: tabParam } = await searchParams;
  const business = await getBusinessById(id);
  if (!business) notFound();

  const tab = TABS.includes(tabParam as (typeof TABS)[number])
    ? (tabParam as (typeof TABS)[number])
    : "overview";

  const [verticals, cities, templates, previews, seo, contacts, messages, activity, exclusivityRows, journey] =
    await Promise.all([
      getVerticals(),
      getCities(),
      getTemplates(),
      getPreviewsForBusiness(business.id),
      getSeoForBusiness(business.id),
      getContactsForBusiness(business.id),
      getOutreachMessages(),
      getActivityForBusiness(business.id),
      getExclusivity(),
      buildLeadJourney(business.id).catch(() => []),
    ]);

  const campaignRes = await createAdminClient()
    .from("campaigns")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const campaign = campaignRes.error
    ? null
    : ((campaignRes.data as Record<string, unknown> | null) ?? null);

  const eventSplit = campaign?.id
    ? await getCampaignEventSplit(String(campaign.id)).catch(() => ({
        real: [],
        test: [],
      }))
    : { real: [], test: [] };

  const vertical = verticals.find((v) => v.id === business.vertical_id)!;
  const city = cities.find((c) => c.id === business.city_id)!;
  const template = business.selected_template_id
    ? templates.find((t) => t.id === business.selected_template_id) ?? null
    : null;
  const outreachMessages = messages.filter((m) => m.business_id === business.id);
  const exclusivity = exclusivityRows.find(
    (e) => e.vertical_id === business.vertical_id && e.city_id === business.city_id
  );

  return (
    <div>
      <div className="mb-6">
        <TextLink href="/dashboard/leads">← Terug naar leads</TextLink>
      </div>

      <div className="mb-6 flex flex-col gap-4 border border-mm-border bg-white p-5 shadow-mm-card sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-mm-surface text-lg font-extrabold text-slate-500">
            {business.studio_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {business.studio_name}
              </h1>
              {business.is_demo ? <Badge tone="demo">DEMO</Badge> : null}
              <Badge tone={leadStatusTone(business.lead_status)}>{business.lead_status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {city.name} · {vertical.name} · score {business.qualification_score ?? "—"}
            </p>
            {business.website_url ? (
              <a
                href={business.website_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-[#C2410C]"
              >
                {business.domain ?? business.website_url} ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {business.is_demo ? <DemoBanner /> : null}

      <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-mm-border pb-px">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/dashboard/leads/${business.id}?tab=${t}`}
            className={`shrink-0 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
              tab === t
                ? "border-b-2 border-[#FF5722] text-[#C2410C]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </Link>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Bedrijfsgegevens">
              <dl>
                <KeyValue label="Naam" value={business.studio_name} />
                <KeyValue label="Branche" value={vertical.name} />
                <KeyValue label="Plaats" value={`${city.name}, ${business.country}`} />
                <KeyValue
                  label="Adres"
                  value={`${business.address ?? "—"}, ${business.postal_code ?? ""}`}
                />
                <KeyValue label="Primaire dienst" value={business.primary_service ?? "—"} />
                <KeyValue label="Telefoon" value={business.phone ?? "—"} />
                <KeyValue label="E-mail" value={business.email ?? "—"} />
                <KeyValue
                  label="Reviews"
                  value={
                    business.review_rating != null
                      ? `${business.review_rating} · ${business.review_count}`
                      : "—"
                  }
                />
              </dl>
            </Panel>
            <Panel title="Pipeline">
              <dl>
                <KeyValue label="Lead status" value={business.lead_status} />
                <KeyValue
                  label="Lead score"
                  value={
                    business.lead_score != null
                      ? Math.round(Number(business.lead_score))
                      : "—"
                  }
                />
                <KeyValue
                  label="Winner confidence"
                  value={
                    business.winner_confidence != null
                      ? Math.round(Number(business.winner_confidence))
                      : "—"
                  }
                />
                <KeyValue
                  label="City rank"
                  value={business.city_rank != null ? `#${business.city_rank}` : "—"}
                />
                <KeyValue
                  label="Primary candidate"
                  value={business.primary_candidate ? "Ja" : "Nee"}
                />
                <KeyValue label="Winner path" value={business.winner_path ?? "—"} />
                <KeyValue label="Qualification" value={business.qualification_score ?? "—"} />
                <KeyValue label="Template" value={template?.name ?? "Nog niet gekozen"} />
                <KeyValue label="City exclusivity" value={exclusivity?.status ?? "AVAILABLE"} />
                <KeyValue label="Business exclusive" value={business.exclusive_status} />
                <KeyValue label="Instagram" value={business.instagram_url ?? "—"} />
                <KeyValue label="Tagline" value={business.tagline ?? "—"} />
              </dl>
            </Panel>
          </div>

          <Panel title="Waarom geselecteerd">
            {business.winner_reason ? (
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                {business.winner_reason}
              </p>
            ) : (
              <p className="mb-4 text-sm text-slate-500">Nog geen winner evaluation.</p>
            )}
            <div className="grid gap-4 md:grid-cols-2 text-xs">
              <div>
                <p className="font-bold text-emerald-800">Positieve signalen</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
                  {(
                    (
                      business.winner_evidence as
                        | { positives?: string[] }
                        | undefined
                    )?.positives ??
                    (business.score_components as { explanations?: { positives?: string[] } })
                      ?.explanations?.positives ??
                    []
                  )
                    .slice(0, 8)
                    .map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-rose-800">Negatieve signalen</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
                  {(
                    (
                      business.winner_evidence as
                        | { negatives?: string[] }
                        | undefined
                    )?.negatives ??
                    (business.score_components as { explanations?: { negatives?: string[] } })
                      ?.explanations?.negatives ??
                    []
                  )
                    .slice(0, 8)
                    .map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                </ul>
              </div>
            </div>
            {business.lead_status === "READY_FOR_OUTREACH" ? (
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                READY FOR OUTREACH — nog geen e-mail verzonden.
              </p>
            ) : null}
          </Panel>
        </div>
      ) : null}

      {tab === "journey" ? (
        <div className="space-y-6">
          <Panel title={`${business.studio_name} — ${city.name}`}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Real activity
            </p>
            <ol className="space-y-3">
              {journey.map((step, index) => (
                <li key={step.key} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[11px] font-bold ${
                      step.done
                        ? "bg-emerald-700 text-white"
                        : "border border-mm-border bg-white text-slate-400"
                    }`}
                  >
                    {step.done ? "✓" : index + 1}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        step.done ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {step.at
                        ? new Date(step.at).toLocaleString("nl-NL")
                        : "Nog niet"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Test activity">
            {eventSplit.test.length === 0 ? (
              <p className="text-sm text-slate-500">Geen testevents.</p>
            ) : (
              <ul className="space-y-2">
                {eventSplit.test.map((ev, i) => (
                  <li
                    key={`${ev.event_type}-${ev.created_at}-${i}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      <Badge tone="warn">TEST</Badge>{" "}
                      {ev.event_type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(ev.created_at).toLocaleString("nl-NL")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Campaign">
            <dl>
              <KeyValue
                label="Ref"
                value={
                  campaign?.campaign_ref
                    ? maskCampaignRef(String(campaign.campaign_ref))
                    : "geen actieve campaign"
                }
              />
              <KeyValue
                label="Environment"
                value={String(campaign?.environment ?? "—")}
              />
              <KeyValue
                label="Lifecycle"
                value={String(campaign?.lifecycle_status ?? "—")}
              />
              <KeyValue
                label="Engagement (real)"
                value={String(campaign?.engagement_level ?? business.engagement_level ?? "COLD")}
              />
              <KeyValue
                label="Conversion (real)"
                value={String(campaign?.conversion_status ?? "NONE")}
              />
              <KeyValue
                label="Real events"
                value={String(campaign?.real_event_count ?? eventSplit.real.length)}
              />
              <KeyValue
                label="Test events"
                value={String(campaign?.test_event_count ?? eventSplit.test.length)}
              />
              <KeyValue
                label="Recommended package"
                value={String(campaign?.recommended_package ?? "—")}
              />
              <KeyValue
                label="Recommendation reason"
                value={String(campaign?.recommendation_reason ?? "—")}
              />
              <KeyValue
                label="Selected package (real)"
                value={String(campaign?.selected_package ?? "—")}
              />
            </dl>
            {campaign?.id ? (
              <PreparePilotButton campaignId={String(campaign.id)} />
            ) : null}
          </Panel>
        </div>
      ) : null}

      {tab === "website" ? (
        <Panel title="Website intelligence">
          <dl>
            <KeyValue label="URL" value={business.website_url ?? "—"} />
            <KeyValue label="Domain" value={business.domain ?? "—"} />
            <KeyValue label="Normalized domain" value={business.normalized_domain ?? "—"} />
            <KeyValue label="Google place_id" value={business.google_place_id ?? "—"} />
            <KeyValue label="Google cid" value={business.google_cid ?? "—"} />
            <KeyValue label="Category" value={business.google_category ?? "—"} />
            <KeyValue
              label="Additional categories"
              value={(business.additional_categories ?? []).join(", ") || "—"}
            />
            <KeyValue label="Google status" value={business.google_status ?? "—"} />
            <KeyValue
              label="Rating / reviews"
              value={
                business.google_rating != null
                  ? `${business.google_rating} · ${business.google_review_count ?? 0}`
                  : "—"
              }
            />
            <KeyValue label="Source" value={business.source} />
            <KeyValue
              label="Brand primary"
              value={
                (business.brand_profile as { primary_color?: string } | undefined)?.primary_color ??
                business.primary_color ??
                "—"
              }
            />
            <KeyValue
              label="Pages crawled"
              value={
                Array.isArray(
                  (business.website_intelligence as { pages?: unknown[] } | undefined)?.pages
                )
                  ? String(
                      ((business.website_intelligence as { pages: unknown[] }).pages ?? []).length
                    )
                  : "Nog niet geanalyseerd"
              }
            />
          </dl>
        </Panel>
      ) : null}

      {tab === "preview" ? (
        <div className="space-y-4">
          <Panel title="Preview generation">
            <PreviewActions
              businessId={business.id}
              isDemo={business.is_demo}
              qualificationStatus={business.qualification_status}
              previewStatus={business.preview_status}
              selectedTemplate={template}
              templates={templates.filter((t) => t.vertical_id === business.vertical_id)}
              previews={previews}
              confidence={business.template_selection_confidence ?? null}
              reasoning={business.template_selection_reasoning ?? null}
            />
          </Panel>
        </div>
      ) : null}

      {tab === "seo" ? (
        <div className="space-y-4">
          {seo && seo.analyzed_at ? (
            <>
              <Panel title="SEO opportunity">
                <div className="mb-4 flex flex-wrap items-end gap-3">
                  <p className="text-4xl font-extrabold text-slate-900">
                    {seo.seo_opportunity_score != null
                      ? Math.round(Number(seo.seo_opportunity_score))
                      : "—"}
                    <span className="text-lg font-bold text-slate-400"> / 100</span>
                  </p>
                  <Badge
                    tone={
                      seo.status === "VERY_HIGH"
                        ? "success"
                        : seo.status === "HIGH"
                          ? "brand"
                          : seo.status === "MEDIUM"
                            ? "warn"
                            : "neutral"
                    }
                  >
                    {seo.status}
                  </Badge>
                </div>
                <dl>
                  <KeyValue label="Primary" value={seo.primary_keyword} />
                  <KeyValue
                    label="Volume"
                    value={
                      seo.primary_search_volume != null
                        ? String(seo.primary_search_volume)
                        : "—"
                    }
                  />
                  <KeyValue
                    label="Current position"
                    value={
                      seo.current_rank != null ? `#${seo.current_rank}` : "not found"
                    }
                  />
                  <KeyValue
                    label="Ranking URL"
                    value={seo.current_ranking_url ?? "—"}
                  />
                </dl>
              </Panel>

              <Panel title="Secondary keywords">
                <ul className="space-y-3 text-sm">
                  {(
                    (seo.keyword_metrics as Array<{
                      keyword?: string;
                      search_volume?: number | null;
                      rank?: number | null;
                    }> | null) ?? []
                  )
                    .filter((k) => k.keyword && k.keyword !== seo.primary_keyword)
                    .slice(0, 6)
                    .map((k) => (
                      <li
                        key={k.keyword}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2"
                      >
                        <span className="font-semibold">{k.keyword}</span>
                        <span className="text-slate-500">
                          Volume: {k.search_volume ?? "—"} · Position:{" "}
                          {k.rank != null ? `#${k.rank}` : "not found"}
                        </span>
                      </li>
                    ))}
                  {!(seo.keyword_metrics as unknown[] | null)?.length ? (
                    <li className="text-slate-500">
                      {(seo.secondary_keywords ?? []).join(" · ") || "—"}
                    </li>
                  ) : null}
                </ul>
              </Panel>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Current visibility", seo.visibility_score ?? business.seo_visibility_score],
                  ["SEO readiness", seo.seo_readiness_score ?? business.seo_readiness_score],
                  [
                    "Search demand",
                    (seo.opportunity_components as { search_demand?: number } | null)
                      ?.search_demand,
                  ],
                  [
                    "Competition",
                    (seo.opportunity_components as { serp_competition?: number } | null)
                      ?.serp_competition,
                  ],
                ].map(([label, value]) => (
                  <div key={String(label)} className="border border-mm-border bg-white p-4 shadow-mm-card">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold">
                      {value != null ? Math.round(Number(value)) : "—"}
                    </p>
                  </div>
                ))}
              </div>

              <Panel title="Top local competitors">
                <ul className="space-y-2 text-sm">
                  {(
                    (seo.competitor_snapshot as Array<{
                      competitor_domain?: string;
                      keyword?: string;
                      rank?: number | null;
                      result_type?: string;
                      title?: string | null;
                      is_directory?: boolean;
                    }> | null) ?? []
                  )
                    .slice(0, 5)
                    .map((c, idx) => (
                      <li key={`${c.competitor_domain}-${idx}`} className="border border-slate-100 p-3">
                        <p className="font-semibold">
                          {c.competitor_domain}
                          {c.is_directory ? (
                            <span className="ml-2 text-[10px] font-bold uppercase text-slate-400">
                              directory
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-slate-500">
                          {c.keyword} · rank {c.rank ?? "—"} · {c.result_type}
                        </p>
                        {c.title ? (
                          <p className="mt-1 text-xs text-slate-600">{c.title}</p>
                        ) : null}
                      </li>
                    ))}
                  {!(seo.competitor_snapshot as unknown[] | null)?.length ? (
                    <li className="text-slate-500">Nog geen concurrent snapshot.</li>
                  ) : null}
                </ul>
              </Panel>
            </>
          ) : (
            <Panel title="SEO opportunity">
              <p className="text-sm text-slate-500">
                Nog niet geanalyseerd. Run SEO analysis voor deze stad eerst.
              </p>
            </Panel>
          )}
        </div>
      ) : null}

      {tab === "contact" ? (
        <Panel title="Contactpersonen">
          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen contacten. Enrichment volgt later.</p>
          ) : (
            <ul className="space-y-4">
              {contacts.map((c) => (
                <li key={c.id} className="border border-mm-border p-4">
                  <p className="font-semibold">{c.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{c.role ?? "—"}</p>
                  <p className="mt-2 text-sm">{c.email ?? "geen e-mail"}</p>
                  <p className="text-sm text-slate-500">{c.phone ?? "—"}</p>
                  <p className="mt-2 text-xs text-slate-400">Bron: {c.source ?? "—"}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === "outreach" ? (
        <Panel title="Outreach">
          {business.lead_status === "READY_FOR_OUTREACH" || business.primary_candidate ? (
            <div className="mb-4">
              <GenerateOutreachButton businessId={business.id} />
            </div>
          ) : null}
          {outreachMessages.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen berichten.</p>
          ) : (
            <ul className="space-y-3">
              {outreachMessages.map((m) => (
                <li key={m.id} className="border border-mm-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{m.subject}</p>
                    <Badge tone="warn">{m.status}</Badge>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                    {m.body_text ?? m.body}
                  </p>
                  <div className="mt-3">
                    <TextLink href={`/dashboard/outreach/${m.id}`}>Open in outreach editor</TextLink>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-slate-400">
            Geen autonome verzending. Review en send vanuit de editor.
          </p>
        </Panel>
      ) : null}

      {tab === "activity" ? (
        <Panel title="Activity timeline">
          <ul className="divide-y divide-slate-100">
            {activity.map((a) => (
              <li key={a.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{a.activity_type}</Badge>
                  <time className="text-[11px] text-slate-400">
                    {new Date(a.created_at).toLocaleString("nl-NL")}
                  </time>
                </div>
                <p className="mt-1 text-sm font-semibold">{a.title}</p>
                {a.description ? (
                  <p className="text-xs text-slate-500">{a.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}
