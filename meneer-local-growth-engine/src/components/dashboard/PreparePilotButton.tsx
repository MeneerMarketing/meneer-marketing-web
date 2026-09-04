"use client";

import { useState } from "react";

export function PreparePilotButton({ campaignId }: { campaignId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/campaigns/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          action: "prepare_for_pilot",
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        readiness?: { ready: boolean; blocking_reasons: string[] };
        recomputed?: { engagement_level: string; conversion_status: string };
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Mislukt");
        return;
      }
      setStatus("ok");
      setMessage(
        data.readiness?.ready
          ? `Ready · ${data.recomputed?.engagement_level}/${data.recomputed?.conversion_status}`
          : `Niet ready · ${data.readiness?.blocking_reasons?.length ?? 0} blockers`
      );
      window.location.reload();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={() => void run()}
        disabled={status === "loading"}
        className="border border-mm-border bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 hover:border-[#FF5722] hover:text-[#C2410C] disabled:opacity-50"
      >
        {status === "loading" ? "Bezig…" : "Prepare for pilot"}
      </button>
      {message ? (
        <p
          className={`text-xs ${
            status === "error" ? "text-rose-700" : "text-slate-600"
          }`}
        >
          {message}
        </p>
      ) : null}
      <p className="text-[11px] text-slate-400">
        Herberekent journey zonder testevents. Verstuurt geen mail.
      </p>
    </div>
  );
}
