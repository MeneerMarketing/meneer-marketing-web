"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  datetimeLocalToIso,
  defaultScheduleLocalValue,
  formatScheduledNl,
} from "@/lib/outreachSchedule";
import type { WishlistCampaignSummary } from "@/services/outreach/wishlistCampaign";

interface Props {
  summary: WishlistCampaignSummary;
  realSendEnabled: boolean;
  providerConfigured: boolean;
  verticalSlug?: string;
  verticalName?: string | null;
  verticalId?: string | null;
  sendTimeRulesLabel: string;
  nextOptimizedSlotLabel: string;
}

export function WishlistCampaignPanel({
  summary: initialSummary,
  realSendEnabled,
  providerConfigured,
  verticalSlug = "all",
  verticalName = null,
  verticalId = null,
  sendTimeRulesLabel,
  nextOptimizedSlotLabel,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [scheduleMode, setScheduleMode] = useState<"optimized" | "manual">("optimized");
  const [scheduleAt, setScheduleAt] = useState(() => defaultScheduleLocalValue());
  const [staggerMinutes, setStaggerMinutes] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [lastSkipped, setLastSkipped] = useState<
    Array<{ studioName: string; reason: string }>
  >([]);

  const { counts } = initialSummary;
  const canSchedule = realSendEnabled && providerConfigured && counts.approved > 0;

  async function run(action: string, body?: Record<string, unknown>) {
    setError(null);
    setInfo(null);
    setLastSkipped([]);

    const payload =
      verticalId && verticalSlug !== "all"
        ? { action, verticalId, ...body }
        : { action, ...body };

    const res = await fetch("/api/outreach/wishlist-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as {
      ok: boolean;
      error?: string;
      result?: {
        scheduled?: number;
        cancelled?: number;
        generated?: number;
        sent?: number;
        processed?: number;
        failed?: number;
        skipped?: Array<{ studioName: string; reason: string }>;
        firstSendAt?: string;
        lastSendAt?: string | null;
        sendDays?: Array<{ label: string; count: number }>;
        rulesLabel?: string;
        mode?: string;
        errors?: Array<{ studioName: string; error: string }>;
      };
    };

    if (!json.ok) {
      setError(json.error ?? "Actie mislukt");
      return;
    }

    const result = json.result;
    if (action === "schedule_batch" && result) {
      const daySpread =
        result.sendDays && result.sendDays.length > 1
          ? ` · verdeeld over ${result.sendDays.map((d) => `${d.count} op ${d.label}`).join(", ")}`
          : "";
      setInfo(
        `${result.scheduled ?? 0} mails gepland (${result.mode === "optimized" ? "slim" : "handmatig"}). Eerste: ${formatScheduledNl(result.firstSendAt) ?? "—"}${
          result.lastSendAt && result.lastSendAt !== result.firstSendAt
            ? ` · laatste: ${formatScheduledNl(result.lastSendAt)}`
            : ""
        }${daySpread}`
      );
      if (result.skipped?.length) setLastSkipped(result.skipped);
    }
    if (action === "cancel_batch" && result) {
      setInfo(`${result.cancelled ?? 0} geplande mails geannuleerd.`);
    }
    if (action === "generate_drafts" && result) {
      const errCount = result.errors?.length ?? 0;
      setInfo(
        `${result.generated ?? 0} drafts gegenereerd${errCount ? ` · ${errCount} mislukt` : ""}`
      );
      if (result.skipped?.length) setLastSkipped(result.skipped.slice(0, 8));
    }
    if (action === "process_due" && result && (result.sent ?? 0) > 0) {
      setInfo(`${result.sent} geplande mail${result.sent === 1 ? "" : "s"} verzonden.`);
    }

    startTransition(() => router.refresh());
  }

  const pollRef = useRef(false);
  useEffect(() => {
    if (!realSendEnabled || counts.scheduled === 0) return;
    const tick = () => {
      if (pollRef.current) return;
      pollRef.current = true;
      void run("process_due").finally(() => {
        pollRef.current = false;
      });
    };
    const id = window.setInterval(tick, 60_000);
    tick();
    return () => window.clearInterval(id);
  }, [counts.scheduled, realSendEnabled]);

  function scheduleBatch() {
    try {
      const body: Record<string, unknown> = {
        mode: scheduleMode,
        staggerMinutes,
      };
      if (scheduleMode === "manual") {
        body.scheduledAt = datetimeLocalToIso(scheduleAt);
      } else if (scheduleAt) {
        body.scheduledAt = datetimeLocalToIso(scheduleAt);
      }
      void run("schedule_batch", body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ongeldige datum");
    }
  }

  if (counts.total === 0) {
    return (
      <div className="mb-6 rounded border border-dashed border-mm-border bg-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Campagne vanuit mail-lijst
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Zet eerst studios op je mail-lijst via Leads of Discovery. Daarna plan je hier
          in één keer alle goedgekeurde mails.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 border border-mm-border bg-white p-5 shadow-mm-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Campagne vanuit mail-lijst
            {verticalName ? ` · ${verticalName}` : ""}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {verticalName
              ? `Batch-acties alleen voor ${verticalName}.`
              : "Speuren → mail-lijst → preview + draft → approve → slim plannen op di/do 09:30."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Stat label="Op lijst" value={counts.total} />
            <Stat label="Geen draft" value={counts.noDraft} tone="warn" />
            <Stat label="Review" value={counts.needsReview} tone="warn" />
            <Stat label="Approved" value={counts.approved} tone="ok" />
            <Stat label="Gepland" value={counts.scheduled} tone="sky" />
            <Stat label="Verzonden" value={counts.sent} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {counts.noDraft > 0 ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => run("generate_drafts", { limit: 15 })}
              className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-50"
            >
              Genereer drafts ({counts.noDraft})
            </button>
          ) : null}
          {counts.scheduled > 0 ? (
            <>
              <button
                type="button"
                disabled={pending}
                onClick={() => run("process_due")}
                className="border border-emerald-200 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 disabled:opacity-50"
              >
                Verstuur nu ({counts.scheduled})
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run("cancel_batch")}
                className="border border-rose-200 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-rose-700 disabled:opacity-50"
              >
                Annuleer planning
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded border border-mm-border bg-mm-surface/40 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Batch verzending plannen
        </p>
        <p className="mt-2 text-xs text-slate-600">{sendTimeRulesLabel}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => setScheduleMode("optimized")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              scheduleMode === "optimized"
                ? "bg-[#FF5722] text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Slimme tijden
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setScheduleMode("manual")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              scheduleMode === "manual"
                ? "bg-[#FF5722] text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Handmatig
          </button>
        </div>

        {scheduleMode === "optimized" ? (
          <p className="mt-3 text-sm text-slate-700">
            Volgende slot: <span className="font-semibold">{nextOptimizedSlotLabel}</span>
            {counts.approved > 0
              ? `. Bij meer dan de daglimiet schuift de batch door naar het volgende di/do slot.`
              : ""}
          </p>
        ) : null}

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="block min-w-[14rem] flex-1">
            <span className="text-xs text-slate-500">
              {scheduleMode === "optimized" ? "Niet eerder dan (optioneel)" : "Starttijd (lokale tijd)"}
            </span>
            <input
              type="datetime-local"
              value={scheduleAt}
              disabled={pending}
              onChange={(e) => setScheduleAt(e.target.value)}
              className="mt-1 w-full border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block w-40">
            <span className="text-xs text-slate-500">Tussenpozen (min)</span>
            <select
              value={staggerMinutes}
              disabled={pending}
              onChange={(e) => setStaggerMinutes(Number(e.target.value))}
              className="mt-1 w-full border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
            >
              <option value={0}>Tegelijk</option>
              <option value={1}>1 minuut</option>
              <option value={2}>2 minuten</option>
              <option value={5}>5 minuten</option>
            </select>
          </label>
          <button
            type="button"
            disabled={pending || !canSchedule}
            onClick={scheduleBatch}
            title={
              !realSendEnabled
                ? "OUTREACH_REAL_SEND_ENABLED=false"
                : counts.approved === 0
                  ? "Geen APPROVED mails op de lijst"
                  : "Plan alle goedgekeurde mails"
            }
            className="bg-[#FF5722] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Plan {counts.approved} mail{counts.approved === 1 ? "" : "s"}
            {scheduleMode === "optimized" ? " slim" : ""}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Slimme modus: dinsdag en donderdag 09:30, geen maandagochtend, max per dag via
          OUTREACH_MAX_MAILS_PER_DAY. Tussenpozen blijven staggered.
        </p>
        {!realSendEnabled ? (
          <p className="mt-2 text-xs text-amber-800">
            Echte send staat uit. Herstart het dashboard na env-wijziging.
          </p>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      {info ? <p className="mt-3 text-sm text-emerald-700">{info}</p> : null}
      {lastSkipped.length > 0 ? (
        <details className="mt-3 text-xs text-slate-600">
          <summary className="cursor-pointer font-semibold">
            Overgeslagen ({lastSkipped.length})
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {lastSkipped.map((s) => (
              <li key={`${s.studioName}-${s.reason}`}>
                {s.studioName}: {s.reason}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "warn" | "ok" | "sky";
}) {
  const toneClass =
    tone === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : tone === "sky"
          ? "border-sky-200 bg-sky-50 text-sky-900"
          : "border-mm-border bg-white text-slate-800";

  return (
    <span
      className={`inline-flex min-w-[4.5rem] flex-col rounded border px-3 py-2 text-center ${toneClass}`}
    >
      <span className="text-lg font-extrabold tabular-nums">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
        {label}
      </span>
    </span>
  );
}
