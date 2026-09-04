"use client";

import { useState } from "react";
import type { InboundSubmissionStatus } from "@/lib/data/customer-labels";

const STATUS_OPTIONS: { value: InboundSubmissionStatus; label: string }[] = [
  { value: "new", label: "Nieuw" },
  { value: "contacted", label: "Contact gehad" },
  { value: "qualified", label: "Gekwalificeerd" },
  { value: "won", label: "Gewonnen" },
  { value: "lost", label: "Verloren" },
];

export function CustomerDetailEditor({
  submissionId,
  initialStatus,
  initialNotes,
}: {
  submissionId: string;
  initialStatus: string;
  initialNotes: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(false);
    try {
      const res = await fetch(`/api/klanten/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status as InboundSubmissionStatus,
          internalNotes: notes,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(true);
        setMessage(data.error ?? "Opslaan mislukt");
        return;
      }
      setMessage("Opgeslagen");
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  const dirty =
    status !== initialStatus || notes !== (initialNotes ?? "");

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="customer-status"
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"
        >
          Aanvraagstatus
        </label>
        <select
          id="customer-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-mm-border bg-white px-3 py-2 text-sm text-slate-800"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="customer-notes"
          className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"
        >
          Interne notities
        </label>
        <textarea
          id="customer-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="Gesprekken, vervolgstappen, interne context…"
          className="w-full resize-y border border-mm-border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Alleen zichtbaar in LGE. Niet op meneermarketing.nl.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !dirty}
          className="bg-[#FF5722] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-40"
        >
          {saving ? "Opslaan…" : "Opslaan"}
        </button>
        {message ? (
          <p className={`text-xs ${error ? "text-rose-700" : "text-emerald-700"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
