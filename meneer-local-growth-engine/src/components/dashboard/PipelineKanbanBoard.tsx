"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, SectionTitle } from "@/components/dashboard/ui";
import {
  PIPELINE_STAGES,
  isPipelineExcludedLead,
} from "@/lib/leads/pipelineKanban.shared";
import type { PipelineStageId } from "@/types/domain";
import type { City, PipelineKanbanItem, Vertical } from "@/types/domain";

function formatRelative(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return "vandaag";
  if (days === 1) return "gisteren";
  if (days < 7) return `${days}d geleden`;
  if (days < 30) return `${Math.floor(days / 7)}w geleden`;
  return `${Math.floor(days / 30)}m geleden`;
}

function PipelineCard({ item }: { item: PipelineKanbanItem }) {
  const activity = formatRelative(
    item.latestOutreach?.sent_at ??
      item.preview?.updated_at ??
      item.business.last_activity_at ??
      item.business.updated_at
  );

  return (
    <Link
      href={`/dashboard/leads/${item.business.id}`}
      className="group block border border-mm-border bg-white p-3 shadow-sm transition hover:border-[#FF5722]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold leading-snug text-slate-900 group-hover:text-[#C2410C]">
          {item.business.studio_name}
        </p>
        {item.business.is_demo ? <Badge tone="demo">Demo</Badge> : null}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {item.city.name} · {item.vertical.name}
      </p>
      {item.latestOutreach ? (
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
          {item.latestOutreach.subject}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {item.latestOutreach ? (
          <Badge tone="neutral">{item.latestOutreach.status}</Badge>
        ) : null}
        {activity ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {activity}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export function PipelineKanbanBoard({
  initialRows,
  verticals,
  cities,
}: {
  initialRows: PipelineKanbanItem[];
  verticals: Vertical[];
  cities: City[];
}) {
  const [q, setQ] = useState("");
  const [vertical, setVertical] = useState("all");
  const [city, setCity] = useState("all");
  const [hideDemo, setHideDemo] = useState(true);
  const [hideDismissed, setHideDismissed] = useState(true);

  const filtered = useMemo(() => {
    let rows = [...initialRows];
    const query = q.trim().toLowerCase();

    if (query) {
      rows = rows.filter((row) => {
        const hay = [row.business.studio_name, row.business.domain, row.city.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }

    if (vertical !== "all") {
      rows = rows.filter((row) => row.vertical.id === vertical);
    }
    if (city !== "all") {
      rows = rows.filter((row) => row.city.id === city);
    }
    if (hideDemo) {
      rows = rows.filter((row) => !row.business.is_demo);
    }
    if (hideDismissed) {
      rows = rows.filter((row) => !isPipelineExcludedLead(row.business.lead_status));
    }

    return rows;
  }, [initialRows, q, vertical, city, hideDemo, hideDismissed]);

  const byStage = useMemo(() => {
    const map = Object.fromEntries(
      PIPELINE_STAGES.map((stage) => [stage.id, [] as PipelineKanbanItem[]])
    ) as Record<PipelineStageId, PipelineKanbanItem[]>;

    for (const row of filtered) {
      map[row.stage].push(row);
    }

    for (const stage of PIPELINE_STAGES) {
      map[stage.id].sort((a, b) => {
        const aTime = new Date(a.business.last_activity_at ?? a.business.updated_at).getTime();
        const bTime = new Date(b.business.last_activity_at ?? b.business.updated_at).getTime();
        return bTime - aTime;
      });
    }

    return map;
  }, [filtered]);

  const activeCount = filtered.length;

  return (
    <div>
      <SectionTitle
        eyebrow="Pipeline"
        title="Kanban"
        description="Van discovery tot klant in één board. Klik op een kaart voor lead-detail, preview of outreach."
      />

      <div className="mb-6 flex flex-wrap items-end gap-3 border border-mm-border bg-white p-4 shadow-mm-card">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Zoeken
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Studio, domein, stad…"
            className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
          />
        </label>

        <label className="flex min-w-[140px] flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Vertical
          </span>
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
          >
            <option value="all">Alle</option>
            {verticals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[140px] flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Stad
          </span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
          >
            <option value="all">Alle</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 pb-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={hideDemo}
            onChange={(e) => setHideDemo(e.target.checked)}
            className="accent-[#FF5722]"
          />
          Verberg demo
        </label>

        <label className="flex items-center gap-2 pb-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={hideDismissed}
            onChange={(e) => setHideDismissed(e.target.checked)}
            className="accent-[#FF5722]"
          />
          Verberg dismissed
        </label>

        <p className="ml-auto pb-2 text-sm font-semibold text-slate-500">
          {activeCount} leads in pipeline
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const cards = byStage[stage.id];
            return (
              <section
                key={stage.id}
                className={`flex w-[min(100vw-2rem,300px)] shrink-0 flex-col border-t-4 bg-white shadow-mm-card ${stage.accent}`}
              >
                <header className="border-b border-mm-border px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-extrabold tracking-tight text-slate-900">
                      {stage.label}
                    </h2>
                    <span className="bg-mm-surface px-2 py-0.5 text-xs font-bold text-slate-600">
                      {cards.length}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{stage.hint}</p>
                </header>

                <div className="flex max-h-[calc(100vh-22rem)] min-h-[240px] flex-col gap-2 overflow-y-auto p-3">
                  {cards.length === 0 ? (
                    <p className="px-1 py-6 text-center text-xs text-slate-400">Leeg</p>
                  ) : (
                    cards.map((item) => <PipelineCard key={item.business.id} item={item} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
