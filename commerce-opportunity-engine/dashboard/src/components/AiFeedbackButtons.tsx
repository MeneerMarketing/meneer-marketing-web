"use client";

import { useState } from "react";

export function AiFeedbackButtons({
  brandId,
  opportunityId,
  auditId,
  targetType,
  targetKey,
  originalPayload,
}: {
  brandId?: string;
  opportunityId?: string;
  auditId?: string;
  targetType: string;
  targetKey: string;
  originalPayload?: Record<string, unknown>;
}) {
  const [status, setStatus] = useState<"idle" | "up" | "down" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function send(feedback: "UP" | "DOWN") {
    setMessage(null);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId,
        opportunityId,
        auditId,
        targetType,
        targetKey,
        feedback,
        originalPayload,
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(body.error ?? "Feedback opslaan mislukt");
      return;
    }

    setStatus(feedback === "UP" ? "up" : "down");
    setMessage(feedback === "UP" ? "Bedankt, opgeslagen" : "Genoteerd, wordt meegenomen");
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => send("UP")}
          title="Klopt"
          className={`rounded-lg border px-2 py-1 text-sm transition ${
            status === "up"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200"
          }`}
        >
          👍
        </button>
        <button
          type="button"
          onClick={() => send("DOWN")}
          title="Klopt niet"
          className={`rounded-lg border px-2 py-1 text-sm transition ${
            status === "down"
              ? "border-rose-300 bg-rose-50 text-rose-700"
              : "border-slate-200 bg-white text-slate-500 hover:border-rose-200"
          }`}
        >
          👎
        </button>
      </div>
      {message ? (
        <p className={`text-[11px] ${status === "error" ? "text-rose-600" : "text-slate-400"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
