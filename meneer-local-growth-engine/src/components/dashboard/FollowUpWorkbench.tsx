"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/dashboard/ui";
import {
  FOLLOWUP_TEMPLATE_OPTIONS,
  followupTemplateLabel,
} from "@/services/followup/followupTemplateOptions";
import type { FollowupCandidate } from "@/services/followup/followupCandidates";
import type { FollowupQueueRow } from "@/services/followup/followupCandidates";
import type { FollowupTemplateId } from "@/types/domain";

function statusTone(
  status: string,
): "neutral" | "warn" | "success" | "brand" | "danger" | "sky" {
  if (status === "APPROVED" || status === "DELIVERED") return "success";
  if (status === "SCHEDULED") return "sky";
  if (status === "SENT" || status === "OPENED" || status === "CLICKED") return "brand";
  if (status === "DRAFT" || status === "REVIEW_REQUIRED") return "warn";
  if (status === "BOUNCED" || status === "FAILED") return "danger";
  return "neutral";
}

export function FollowUpWorkbench({
  candidates,
  queue,
  initialTab,
}: {
  candidates: FollowupCandidate[];
  queue: FollowupQueueRow[];
  initialTab: "candidates" | "list" | "drafts";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState(initialTab);
  const [template, setTemplate] = useState<FollowupTemplateId>("check_in");
  const [selected, setSelected] = useState<Set<string>>(() => {
    return new Set(
      candidates.filter((c) => c.selectedForFollowup).map((c) => c.business.id),
    );
  });
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const listCandidates = useMemo(() => {
    if (tab === "list") return candidates.filter((c) => c.selectedForFollowup);
    return candidates;
  }, [candidates, tab]);

  async function toggleList(businessId: string, next: boolean) {
    setError(null);
    const res = await fetch("/api/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_list", businessId, selected: next }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!json.ok) {
      setError(json.error ?? "Kon follow-up lijst niet bijwerken");
      return;
    }
    setSelected((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(businessId);
      else copy.delete(businessId);
      return copy;
    });
    startTransition(() => router.refresh());
  }

  async function generateOne(businessId: string) {
    setError(null);
    setInfo(null);
    const res = await fetch("/api/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate", businessId, template }),
    });
    const json = (await res.json()) as {
      ok: boolean;
      error?: string;
      message?: { id: string };
    };
    if (!json.ok) {
      setError(json.error ?? "Genereren mislukt");
      return;
    }
    startTransition(() => {
      if (json.message?.id) router.push(`/dashboard/outreach/${json.message.id}`);
      else router.refresh();
    });
  }

  async function generateBatch() {
    const ids = [...selected];
    if (!ids.length) {
      setError("Selecteer minstens één lead");
      return;
    }
    setError(null);
    setInfo(null);
    const res = await fetch("/api/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_batch", businessIds: ids, template }),
    });
    const json = (await res.json()) as {
      ok: boolean;
      error?: string;
      generated?: number;
      failed?: { businessId: string; error: string }[];
    };
    if (!json.ok) {
      setError(json.error ?? "Batch mislukt");
      return;
    }
    const count = json.generated ?? 0;
    const failed = json.failed?.length ?? 0;
    setInfo(`${count} follow-up draft(s) klaar${failed ? `, ${failed} mislukt` : ""}`);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["candidates", "Kandidaten"],
            ["list", "Follow-up lijst"],
            ["drafts", "Drafts & verzonden"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              tab === key ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab !== "drafts" ? (
        <div className="rounded border border-mm-border bg-white/70 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Sjabloon voor nieuwe follow-ups
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="block min-w-[12rem]">
              <span className="sr-only">Sjabloon</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as FollowupTemplateId)}
                className="w-full border border-mm-border bg-white px-3 py-2.5 text-sm"
              >
                {FOLLOWUP_TEMPLATE_OPTIONS.map((id) => (
                  <option key={id} value={id}>
                    {followupTemplateLabel(id)}
                  </option>
                ))}
              </select>
            </label>
            {tab === "list" ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => void generateBatch()}
                className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
              >
                Genereer drafts voor lijst ({selected.size})
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Kies zelf wie een follow-up krijgt. Geen automatische verzending.
          </p>
        </div>
      ) : null}

      {tab === "drafts" ? (
        <div className="space-y-3">
          {queue.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen follow-up mails.</p>
          ) : null}
          {queue.map(({ message, business, cityName, parentSentAt }) => (
            <article
              key={message.id}
              className="border border-mm-border bg-white p-5 shadow-mm-card"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="sky">Follow-up</Badge>
                    {message.followup_template ? (
                      <Badge tone="neutral">
                        {followupTemplateLabel(message.followup_template)}
                      </Badge>
                    ) : null}
                    <Badge tone={statusTone(message.status)}>{message.status}</Badge>
                  </div>
                  <h2 className="mt-2 text-base font-extrabold text-slate-900">
                    {message.subject}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {business.studio_name} · {cityName ?? "—"}
                    {parentSentAt
                      ? ` · eerste mail ${new Date(parentSentAt).toLocaleDateString("nl-NL")}`
                      : ""}
                  </p>
                </div>
                <Link
                  href={`/dashboard/outreach/${message.id}`}
                  className="text-sm font-bold text-[#C2410C]"
                >
                  Open editor →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {listCandidates.length === 0 ? (
            <p className="text-sm text-slate-500">
              {tab === "list"
                ? "Nog niemand op je follow-up lijst. Zet kandidaten aan via het vinkje."
                : "Geen kandidaten. Verstuur eerst een eerste outreach mail."}
            </p>
          ) : null}
          {listCandidates.map((row) => {
            const onList = row.selectedForFollowup || selected.has(row.business.id);
            return (
              <article
                key={row.business.id}
                className="flex flex-col gap-3 border border-mm-border bg-white p-5 shadow-mm-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={onList}
                    disabled={pending}
                    onChange={(e) => void toggleList(row.business.id, e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#FF5722]"
                    aria-label={`${row.business.studio_name} op follow-up lijst`}
                  />
                  <div>
                    <p className="font-extrabold text-slate-900">{row.business.studio_name}</p>
                    <p className="text-sm text-slate-500">
                      {row.cityName ?? "—"} · {row.verticalName ?? "—"} · eerste mail{" "}
                      {row.parentMessage.status}
                      {row.daysSinceSent != null ? ` · ${row.daysSinceSent}d geleden` : ""}
                    </p>
                    {row.hasFollowupDraft && row.followupDraftStatus ? (
                      <p className="mt-1 text-xs text-emerald-700">
                        Draft: {row.followupDraftStatus}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.followupMessageId ? (
                    <Link
                      href={`/dashboard/outreach/${row.followupMessageId}`}
                      className="border border-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C2410C]"
                    >
                      Naar draft
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void generateOne(row.business.id)}
                      className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
                    >
                      Genereer follow-up
                    </button>
                  )}
                  <Link
                    href={`/dashboard/leads/${row.business.id}?tab=outreach`}
                    className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700"
                  >
                    Lead
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {info ? <p className="text-sm text-emerald-700">{info}</p> : null}
    </div>
  );
}
