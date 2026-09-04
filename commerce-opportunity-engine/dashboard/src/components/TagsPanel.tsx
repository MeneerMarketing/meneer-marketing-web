"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { OperatorTagRow } from "@/lib/types";

export function TagsPanel({
  brandId,
  opportunityId,
  initialTags,
}: {
  brandId?: string;
  opportunityId?: string;
  initialTags: OperatorTagRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [assigned, setAssigned] = useState(initialTags);
  const [allTags, setAllTags] = useState<OperatorTagRow[]>([]);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/tags")
      .then((res) => res.json())
      .then((body: { tags?: OperatorTagRow[] }) => {
        setAllTags(body.tags ?? []);
      })
      .catch(() => undefined);
  }, []);

  async function assignTag(tagId: string) {
    setError(null);
    const res = await fetch("/api/tags/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tagId,
        brandId,
        opportunityId,
        action: "add",
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Tag toevoegen mislukt");
      return;
    }
    const tag = allTags.find((item) => item.id === tagId);
    if (tag && !assigned.some((item) => item.id === tagId)) {
      setAssigned((prev) => [...prev, tag]);
    }
    startTransition(() => router.refresh());
  }

  async function removeTag(tagId: string) {
    setError(null);
    const res = await fetch("/api/tags/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tagId,
        brandId,
        opportunityId,
        action: "remove",
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Tag verwijderen mislukt");
      return;
    }
    setAssigned((prev) => prev.filter((item) => item.id !== tagId));
    startTransition(() => router.refresh());
  }

  async function createTag(event: React.FormEvent) {
    event.preventDefault();
    const name = newTagName.trim();
    if (!name) return;
    setError(null);

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      tag?: OperatorTagRow;
    };
    if (!res.ok || !body.tag) {
      setError(body.error ?? "Tag aanmaken mislukt");
      return;
    }
    setAllTags((prev) => [...prev, body.tag!].sort((a, b) => a.name.localeCompare(b.name)));
    setNewTagName("");
    await assignTag(body.tag.id);
  }

  const available = allTags.filter(
    (tag) => !assigned.some((item) => item.id === tag.id)
  );

  return (
    <section className="rounded-2xl border border-mm-border bg-white shadow-mm-card">
      <div className="border-b border-mm-border px-5 py-4">
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Tags</h3>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {assigned.length === 0 ? (
            <span className="text-sm italic text-slate-400">Geen tags</span>
          ) : (
            assigned.map((tag) => (
              <button
                key={tag.id}
                type="button"
                disabled={pending}
                onClick={() => removeTag(tag.id)}
                className="rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3 py-1 text-xs font-bold text-[#C2410C] hover:bg-[#FF5722]/20"
                title="Klik om te verwijderen"
              >
                {tag.name} ×
              </button>
            ))
          )}
        </div>

        {available.length > 0 ? (
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Bestaande tag
              <select
                value={selectedTagId}
                onChange={(e) => setSelectedTagId(e.target.value)}
                className="mt-1 block min-w-[160px] rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
              >
                <option value="">Kies…</option>
                {available.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={pending || !selectedTagId}
              onClick={() => assignTag(selectedTagId)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722]"
            >
              Toevoegen
            </button>
          </div>
        ) : null}

        <form onSubmit={createTag} className="flex flex-wrap items-end gap-2">
          <label className="flex-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Nieuwe tag
            <input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="bijv. hot-lead"
              className="mt-1 w-full rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
            />
          </label>
          <button
            type="submit"
            disabled={pending || !newTagName.trim()}
            className="rounded-full bg-[#FF5722] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-orange-600 disabled:opacity-60"
          >
            Aanmaken
          </button>
        </form>

        {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
