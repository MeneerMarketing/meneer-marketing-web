"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Badge,
  SectionTitle,
  WebsiteLink,
  leadStatusTone,
} from "@/components/dashboard/ui";
import { LeadDispositionActions } from "@/components/dashboard/LeadDispositionActions";
import { LeadBulkActionsBar } from "@/components/dashboard/LeadBulkActionsBar";
import { LeadMailWishlistToggle } from "@/components/dashboard/LeadMailWishlistToggle";
import { countMailListByVertical, mailListOutreachHref } from "@/lib/mailListVerticals";
import { BULK_LEAD_ACTION_MAX } from "@/lib/leads/bulkLeadActions.shared";
import type {
  City,
  LeadListItem,
  LeadStatus,
  PreviewStatus,
  TemplateRecord,
  Vertical,
} from "@/types/domain";

type SortKey = "name" | "score" | "lead_score" | "status" | "activity";
type QuickFilter =
  | "all"
  | "score90"
  | "score80"
  | "primary"
  | "preview_ready"
  | "ready_outreach"
  | "mail_list"
  | `mail_list:${string}`;

export function LeadsTableClient({
  initialRows,
  verticals,
  cities,
  templates,
}: {
  initialRows: LeadListItem[];
  verticals: Vertical[];
  cities: City[];
  templates: TemplateRecord[];
}) {
  const all = initialRows;
  const mailListOptions = useMemo(
    () =>
      countMailListByVertical(
        all.map((row) => row.business),
        verticals
      ),
    [all, verticals]
  );

  const [q, setQ] = useState("");
  const [vertical, setVertical] = useState("all");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");
  const [previewStatus, setPreviewStatus] = useState("all");
  const [seoFilter, setSeoFilter] = useState("all");
  const [exclusivity, setExclusivity] = useState("all");
  const [template, setTemplate] = useState("all");
  const [country, setCountry] = useState("all");
  const [quick, setQuick] = useState<QuickFilter>("all");
  const [sort, setSort] = useState<SortKey>("lead_score");
  const [hideDismissed, setHideDismissed] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let rows = [...all];
    const query = q.trim().toLowerCase();

    if (query) {
      rows = rows.filter((r) => {
        const hay = [
          r.business.studio_name,
          r.business.domain,
          r.city.name,
          r.business.website_url,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }

    if (vertical !== "all") rows = rows.filter((r) => r.vertical.id === vertical);
    if (city !== "all") rows = rows.filter((r) => r.city.id === city);
    if (status !== "all") {
      rows = rows.filter((r) => r.business.lead_status === status);
    } else if (hideDismissed) {
      rows = rows.filter(
        (r) =>
          r.business.lead_status !== "REJECTED" &&
          r.business.lead_status !== "DO_NOT_CONTACT"
      );
    }
    if (previewStatus !== "all") {
      rows = rows.filter(
        (r) => (r.preview?.status ?? r.business.preview_status ?? "NONE") === previewStatus
      );
    }
    if (seoFilter !== "all") {
      rows = rows.filter((r) => (r.seo?.status ?? "NONE") === seoFilter);
    }
    if (exclusivity !== "all") {
      rows = rows.filter((r) => (r.exclusivity?.status ?? "AVAILABLE") === exclusivity);
    }
    if (template !== "all") {
      rows = rows.filter((r) => r.template?.id === template);
    }
    if (country !== "all") {
      rows = rows.filter((r) => r.business.country === country);
    }

    if (quick === "score90") {
      rows = rows.filter((r) => Number(r.business.lead_score ?? 0) >= 90);
    } else if (quick === "score80") {
      rows = rows.filter((r) => Number(r.business.lead_score ?? 0) >= 80);
    } else if (quick === "primary") {
      rows = rows.filter((r) => r.business.primary_candidate);
    } else if (quick === "preview_ready") {
      rows = rows.filter(
        (r) => r.preview?.status === "READY" || r.business.preview_status === "READY"
      );
    } else if (quick === "ready_outreach") {
      rows = rows.filter((r) => r.business.lead_status === "READY_FOR_OUTREACH");
    } else if (quick === "mail_list") {
      rows = rows.filter((r) => r.business.selected_for_outreach);
    } else if (quick.startsWith("mail_list:")) {
      const verticalSlug = quick.slice("mail_list:".length);
      const verticalMatch = verticals.find((v) => v.slug === verticalSlug);
      rows = rows.filter(
        (r) =>
          r.business.selected_for_outreach &&
          (!verticalMatch || r.business.vertical_id === verticalMatch.id)
      );
    }

    rows.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.business.studio_name.localeCompare(b.business.studio_name);
        case "score":
          return (b.business.qualification_score ?? 0) - (a.business.qualification_score ?? 0);
        case "lead_score":
          return Number(b.business.lead_score ?? 0) - Number(a.business.lead_score ?? 0);
        case "status":
          return a.business.lead_status.localeCompare(b.business.lead_status);
        default:
          return b.business.last_activity_at.localeCompare(a.business.last_activity_at);
      }
    });

    return rows;
  }, [
    all,
    q,
    vertical,
    city,
    status,
    previewStatus,
    seoFilter,
    exclusivity,
    template,
    country,
    quick,
    sort,
    hideDismissed,
  ]);

  const selectableRows = useMemo(
    () => filtered.filter((row) => !row.business.is_demo),
    [filtered],
  );

  const allVisibleSelected =
    selectableRows.length > 0 &&
    selectableRows
      .slice(0, BULK_LEAD_ACTION_MAX)
      .every((row) => selectedIds.includes(row.business.id));

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= BULK_LEAD_ACTION_MAX) return prev;
      return [...prev, id];
    });
  }

  function toggleAllVisible() {
    const visibleIds = selectableRows.slice(0, BULK_LEAD_ACTION_MAX).map((row) => row.business.id);
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds((prev) =>
      Array.from(new Set([...prev, ...visibleIds])).slice(0, BULK_LEAD_ACTION_MAX),
    );
  }

  const statuses: LeadStatus[] = [
    "DISCOVERED",
    "QUALIFIED",
    "PREVIEW_GENERATING",
    "PREVIEW_READY",
    "READY_FOR_OUTREACH",
    "CONTACTED",
    "REPLIED",
    "INBOUND",
    "MEETING",
    "CLIENT",
    "REJECTED",
    "DO_NOT_CONTACT",
  ];

  const previewStatuses: Array<PreviewStatus | "NONE" | "NOT_GENERATED"> = [
    "NONE",
    "NOT_GENERATED",
    "DRAFT",
    "GENERATING",
    "READY",
    "APPROVED",
    "ARCHIVED",
  ];

  return (
    <div>
      <SectionTitle
        eyebrow="Leads"
        title="Lead pipeline"
        description="Live Supabase. Zet studios per branche op je mail-lijst, of filter op primary candidate."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "Alle"],
            ["score90", "Score 90+"],
            ["score80", "Score 80+"],
            ["primary", "Primary candidate"],
            ["preview_ready", "Preview ready"],
            ["ready_outreach", "Ready for outreach"],
            ["mail_list", `Mail-lijst (${mailListOptions.reduce((sum, row) => sum + row.count, 0)})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setQuick(id)}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
              quick === id
                ? "bg-[#FF5722] text-white"
                : "border border-mm-border bg-white text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mailListOptions.some((option) => option.count > 0) ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Mail-lijst per branche
          </span>
          {mailListOptions.map((option) => (
            <button
              key={option.slug}
              type="button"
              onClick={() => setQuick(`mail_list:${option.slug}`)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                quick === `mail_list:${option.slug}`
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.name} ({option.count})
            </button>
          ))}
          <a
            href={mailListOutreachHref(
              quick.startsWith("mail_list:") ? quick.slice("mail_list:".length) : undefined
            )}
            className="text-xs font-bold text-[#C2410C]"
          >
            Naar outreach →
          </a>
        </div>
      ) : null}

      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek naam / domein / plaats"
          className="border border-mm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF5722] md:col-span-2"
        />
        <select value={vertical} onChange={(e) => setVertical(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">Alle branches</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">Alle plaatsen</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">Alle lead statussen</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={previewStatus} onChange={(e) => setPreviewStatus(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">Preview status</option>
          {previewStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={seoFilter} onChange={(e) => setSeoFilter(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">SEO opportunity</option>
          <option value="NONE">Geen</option>
          <option value="NOT_ANALYZED">NOT_ANALYZED</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="VERY_HIGH">VERY_HIGH</option>
        </select>
        <select value={exclusivity} onChange={(e) => setExclusivity(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">City exclusivity</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="PRIMARY_CANDIDATE">PRIMARY_CANDIDATE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="EXCLUSIVE">EXCLUSIVE</option>
          <option value="RELEASED">RELEASED</option>
        </select>
        <select value={template} onChange={(e) => setTemplate(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">Alle templates</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="all">Alle landen</option>
          <option value="Nederland">Nederland</option>
          <option value="België">België</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="border border-mm-border bg-white px-3 py-2.5 text-sm">
          <option value="lead_score">Sorteer: lead score</option>
          <option value="activity">Sorteer: activity</option>
          <option value="name">Sorteer: naam</option>
          <option value="score">Sorteer: qual score</option>
          <option value="status">Sorteer: status</option>
        </select>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <p className="text-xs text-slate-500">{filtered.length} leads</p>
        {status === "all" ? (
          <button
            type="button"
            onClick={() => setHideDismissed((v) => !v)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
              hideDismissed
                ? "border border-mm-border bg-white text-slate-600"
                : "bg-slate-800 text-white"
            }`}
          >
            {hideDismissed ? "Toon afgewezen" : "Verberg afgewezen"}
          </button>
        ) : null}
      </div>

      <LeadBulkActionsBar selectedIds={selectedIds} onClear={() => setSelectedIds([])} />

      <div className="overflow-x-auto border border-mm-border bg-white shadow-mm-card">
        <table className="min-w-[1200px] w-full text-left text-sm">
          <thead className="border-b border-mm-border bg-mm-surface/60 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-3 font-bold">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  aria-label={`Selecteer max ${BULK_LEAD_ACTION_MAX} zichtbare leads`}
                />
              </th>
              <th className="px-4 py-3 font-bold">Mail</th>
              <th className="px-4 py-3 font-bold">Acties</th>
              <th className="px-4 py-3 font-bold">Studio</th>
              <th className="px-4 py-3 font-bold">Plaats</th>
              <th className="px-4 py-3 font-bold">Lead score</th>
              <th className="px-4 py-3 font-bold">City rank</th>
              <th className="px-4 py-3 font-bold">Website</th>
              <th className="px-4 py-3 font-bold">Rating</th>
              <th className="px-4 py-3 font-bold">Qual</th>
              <th className="px-4 py-3 font-bold">Preview</th>
              <th className="px-4 py-3 font-bold">SEO</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((row) => (
              <tr
                key={row.business.id}
                className={`hover:bg-mm-surface/40 ${
                  selectedIds.includes(row.business.id) ? "bg-[#FFF7F3]/60" : ""
                }`}
              >
                <td className="px-3 py-3">
                  {!row.business.is_demo ? (
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={selectedIds.includes(row.business.id)}
                      disabled={
                        !selectedIds.includes(row.business.id) &&
                        selectedIds.length >= BULK_LEAD_ACTION_MAX
                      }
                      onChange={() => toggleRow(row.business.id)}
                      aria-label={`Selecteer ${row.business.studio_name}`}
                    />
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {!row.business.is_demo ? (
                    <LeadMailWishlistToggle
                      businessId={row.business.id}
                      selected={Boolean(row.business.selected_for_outreach)}
                      studioName={row.business.studio_name}
                      cityName={row.city.name}
                      businessVerticalId={row.business.vertical_id}
                      verticals={verticals}
                      compact
                    />
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {!row.business.is_demo ? (
                    <LeadDispositionActions
                      businessId={row.business.id}
                      studioName={row.business.studio_name}
                      leadStatus={row.business.lead_status}
                      compact
                    />
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/leads/${row.business.id}`}
                    className="font-semibold text-slate-900 hover:text-[#C2410C]"
                  >
                    {row.business.studio_name}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {row.business.is_demo ? <Badge tone="demo">DEMO</Badge> : null}
                    {row.business.selected_for_outreach ? (
                      <Badge tone="brand">MAIL</Badge>
                    ) : null}
                    {row.business.primary_candidate ? (
                      <Badge tone="warn">PRIMARY</Badge>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.city.name}
                  <div className="text-[11px] text-slate-400">{row.vertical.name}</div>
                </td>
                <td className="px-4 py-3 font-extrabold">
                  {row.business.lead_score != null
                    ? Math.round(Number(row.business.lead_score))
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.business.city_rank != null ? `#${row.business.city_rank}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <WebsiteLink
                    url={row.business.website_url}
                    domain={row.business.domain}
                    emptyLabel="—"
                  />
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {(row.business.google_rating ?? row.business.review_rating) != null
                    ? `${row.business.google_rating ?? row.business.review_rating} (${row.business.google_review_count ?? row.business.review_count})`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      row.business.qualification_status === "QUALIFIED"
                        ? "success"
                        : row.business.qualification_status === "POTENTIAL"
                          ? "warn"
                          : "neutral"
                    }
                  >
                    {row.business.qualification_status ?? "—"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      row.preview || row.business.preview_status === "READY" ? "sky" : "neutral"
                    }
                  >
                    {row.preview?.status ?? row.business.preview_status ?? "NONE"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={row.seo ? "warn" : "neutral"}>
                    {row.seo?.status ?? "NONE"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={leadStatusTone(row.business.lead_status)}>
                    {row.business.lead_status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
