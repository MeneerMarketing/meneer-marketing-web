"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CityRankingActions({
  cityId,
  verticalSlug = "pilates",
}: {
  cityId: string;
  verticalSlug?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function rank() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rank_city",
          cityId,
          verticalSlug,
          selectWinner: true,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErr(json.error ?? "Ranking mislukt");
        return;
      }
      const r = json.result;
      setMsg(
        `Ranked ${r.ranked.length} · winner: ${r.winnerName ?? "geen (onder drempel)"}`
      );
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={rank}
        className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
      >
        {loading ? "Scoren…" : "Rank & selecteer winner"}
      </button>
      {msg ? <p className="text-sm text-emerald-700">{msg}</p> : null}
      {err ? <p className="text-sm text-rose-600">{err}</p> : null}
    </div>
  );
}

export function CityLeadOverrideActions({
  businessId,
  cityId,
  isPrimary,
  verticalSlug = "pilates",
}: {
  businessId: string;
  cityId: string;
  isPrimary: boolean;
  verticalSlug?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function call(body: Record<string, unknown>) {
    setLoading(true);
    try {
      await fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verticalSlug, ...body }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!isPrimary ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => call({ action: "set_primary", businessId, note: "Handmatige override" })}
          className="border border-mm-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        >
          Maak winner
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => call({ action: "clear_primary", cityId })}
          className="border border-mm-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        >
          Winner verwijderen
        </button>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={() => call({ action: "exclude_lead", businessId })}
        className="border border-rose-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700"
      >
        DO_NOT_CONTACT
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          call({
            action: "set_exclusivity",
            cityId,
            businessId,
            exclusivityStatus: "RESERVED",
            note: "Handmatig gereserveerd",
          })
        }
        className="border border-mm-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
      >
        Reserveer city
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          call({
            action: "set_exclusivity",
            cityId,
            businessId,
            exclusivityStatus: "EXCLUSIVE",
            note: "Handmatig exclusief",
          })
        }
        className="border border-emerald-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800"
      >
        Zet EXCLUSIVE
      </button>
    </div>
  );
}

export function GenerateWinnerPreviewsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setInfo(null);
    try {
      const probe = await fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_winner_previews" }),
      });
      const probeJson = await probe.json();
      if (!probe.ok || !probeJson.ok) {
        setInfo(probeJson.error ?? "Mislukt");
        return;
      }
      const count = Number(probeJson.count ?? 0);
      if (count === 0) {
        setInfo("Geen winners zonder preview.");
        return;
      }
      const ok = window.confirm(
        `Previews genereren voor ${count} city winner(s)? Dit gebruikt crawl + Claude budget.`
      );
      if (!ok) {
        setInfo("Geannuleerd.");
        return;
      }
      const res = await fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_winner_previews", confirm: true }),
      });
      const json = await res.json();
      setInfo(
        json.ok
          ? `Klaar: ${json.results?.length ?? 0} preview(s)`
          : json.error ?? "Mislukt"
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={run}
        className="border border-mm-border bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-50"
      >
        {loading ? "Bezig…" : "Genereer previews voor city winners"}
      </button>
      {info ? <p className="mt-2 text-sm text-slate-600">{info}</p> : null}
    </div>
  );
}
