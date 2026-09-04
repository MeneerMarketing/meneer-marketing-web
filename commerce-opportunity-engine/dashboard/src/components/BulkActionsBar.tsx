"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type BulkEntity = "brands" | "opportunities";
type BulkAction = "exclude" | "reject" | "shortlist" | "dnc" | "reviewed" | "tag";

const EXCLUSION_REASONS = [
  { value: "POOR_PROSPECT", label: "Slechte prospect" },
  { value: "COMPETITOR", label: "Concurrent" },
  { value: "GENERAL_RETAILER", label: "General retailer" },
  { value: "OTHER", label: "Overig" },
] as const;

export function BulkActionsBar({
  entity,
  selectedIds,
  onClear,
}: {
  entity: BulkEntity;
  selectedIds: string[];
  onClear: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<BulkAction | "">("");
  const [reason, setReason] = useState<string>(EXCLUSION_REASONS[0].value);
  const [tagId, setTagId] = useState("");
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/tags")
      .then((res) => res.json())
      .then((body: { tags?: Array<{ id: string; name: string }> }) => {
        setTags(body.tags ?? []);
        if (body.tags?.[0]) setTagId(body.tags[0].id);
      })
      .catch(() => undefined);
  }, []);

  if (selectedIds.length === 0) return null;

  async function runBulk() {
    if (!action) return;
    setError(null);
    setMessage(null);

    const res = await fetch("/api/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity,
        ids: selectedIds,
        action,
        reason: action === "exclude" ? reason : undefined,
        tagId: action === "tag" ? tagId : undefined,
      }),
    });

    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      succeeded?: number;
      failed?: number;
    };

    if (!res.ok) {
      setError(body.error ?? "Bulk actie mislukt");
      return;
    }

    setMessage(`${body.succeeded ?? 0} gelukt${body.failed ? `, ${body.failed} mislukt` : ""}`);
    setAction("");
    onClear();
    startTransition(() => router.refresh());
  }

  const opportunityOnly: BulkAction[] = ["reject", "shortlist"];

  const allActions = [
    { value: "reviewed", label: "Markeer reviewed" },
    { value: "shortlist", label: "Shortlisten" },
    { value: "reject", label: "Afwijzen" },
    { value: "exclude", label: "Uitsluiten" },
    { value: "dnc", label: "Niet benaderen (DNC)" },
    { value: "tag", label: "Tag toevoegen" },
  ] as const satisfies ReadonlyArray<{ value: BulkAction; label: string }>;

  const actions = allActions.filter((item) => {
    if (entity === "brands" && opportunityOnly.includes(item.value)) return false;
    return true;
  });

  return (
    <div className="sticky bottom-4 z-30 rounded-2xl border border-[#FF5722]/30 bg-white p-4 shadow-lg">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-sm font-bold text-slate-800">
          {selectedIds.length} geselecteerd
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Actie
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as BulkAction | "")}
              className="mt-1 block rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
            >
              <option value="">Kies actie…</option>
              {actions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {action === "exclude" ? (
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Reden
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
              >
                {EXCLUSION_REASONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {action === "tag" ? (
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Tag
              <select
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
                className="mt-1 block rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
              >
                {tags.length === 0 ? (
                  <option value="">Geen tags</option>
                ) : (
                  tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))
                )}
              </select>
            </label>
          ) : null}

          <button
            type="button"
            disabled={pending || !action || (action === "tag" && !tagId)}
            onClick={runBulk}
            className="rounded-full bg-[#FF5722] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-orange-600 disabled:opacity-60"
          >
            Uitvoeren
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-700"
          >
            Wis selectie
          </button>
        </div>
      </div>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      {message ? <p className="mt-2 text-xs text-emerald-600">{message}</p> : null}
    </div>
  );
}
