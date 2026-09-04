"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatDate } from "@/lib/format";
import type { OperatorNoteRow } from "@/lib/types";

export function NotesPanel({
  brandId,
  opportunityId,
  initialNotes,
}: {
  brandId?: string;
  opportunityId?: string;
  initialNotes: OperatorNoteRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState(initialNotes);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function addNote(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setError(null);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, opportunityId, body: trimmed }),
    });

    const payload = (await res.json().catch(() => ({}))) as {
      error?: string;
      note?: OperatorNoteRow;
    };

    if (!res.ok) {
      setError(payload.error ?? "Notitie opslaan mislukt");
      return;
    }

    if (payload.note) {
      setNotes((prev) => [payload.note!, ...prev]);
    }
    setBody("");
    startTransition(() => router.refresh());
  }

  return (
    <section className="rounded-2xl border border-mm-border bg-white shadow-mm-card">
      <div className="border-b border-mm-border px-5 py-4">
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Notities</h3>
      </div>
      <div className="space-y-4 p-5">
        <form onSubmit={addNote} className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Interne notitie…"
            className="w-full rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#FF5722]"
          />
          <button
            type="submit"
            disabled={pending || !body.trim()}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-slate-800 disabled:opacity-60"
          >
            Notitie toevoegen
          </button>
          {error ? <p className="text-xs text-rose-600">{error}</p> : null}
        </form>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm italic text-slate-400">Nog geen notities</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-mm-border bg-mm-bg p-3"
              >
                <p className="text-sm text-slate-700">{note.body}</p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {formatDate(note.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
