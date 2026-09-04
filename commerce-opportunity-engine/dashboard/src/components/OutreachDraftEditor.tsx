"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type Props = {
  messageId: string;
  initialSubject: string;
  initialBody: string;
  initialHtml: string | null;
  status: string;
  claimValidationStatus: string | null;
  blockedReason: string | null;
  copyStyle: string | null;
  promptVersion: string | null;
  generatorModel: string | null;
  generationMode: string | null;
  fixedCopy: string | null;
  personalisationCopy: string | null;
  fromAddress: string;
  toAddress: string;
  realSendEnabled: boolean;
  testEmailConfigured: boolean;
  resendConfigured: boolean;
  feedbackVote: string | null;
};

export function OutreachDraftEditor({
  messageId,
  initialSubject,
  initialBody,
  initialHtml,
  status,
  claimValidationStatus,
  blockedReason,
  copyStyle,
  promptVersion,
  generatorModel,
  generationMode,
  fixedCopy,
  personalisationCopy,
  fromAddress,
  toAddress,
  realSendEnabled,
  testEmailConfigured,
  resendConfigured,
  feedbackVote,
}: Props) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [feedbackNote, setFeedbackNote] = useState("");

  const isBlocked =
    status === "BLOCKED" ||
    status === "APPROVAL_REVOKED" ||
    status === "DO_NOT_CONTACT";

  const previewHtml = useMemo(() => {
    if (initialHtml && body === initialBody) return initialHtml;
    const paragraphs = body
      .trim()
      .split(/\n{2,}/)
      .map((p) =>
        `<p style="margin:0 0 1em 0;font-size:15px;line-height:1.55;color:#1e293b;">${p
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>")}</p>`
      )
      .join("");
    return `<div style="font-family:Georgia,serif;max-width:560px;">${paragraphs}</div>`;
  }, [body, initialBody, initialHtml]);

  async function call(action: string, payload: Record<string, unknown> = {}) {
    setError(null);
    setNote(null);
    const res = await fetch(`/api/outreach/${messageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, subject, body, ...payload }),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      message?: string;
      status?: string;
    };
    if (!res.ok || !json.ok) {
      setError(json.error ?? "Actie mislukt");
      return;
    }
    setNote(json.message ?? `OK · ${json.status ?? action}`);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-5">
      {!realSendEnabled ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-900">
          REAL SEND DISABLED
        </div>
      ) : null}

      {isBlocked ? (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          <span className="font-bold">{status}</span>
          {blockedReason ? (
            <span className="mt-1 block text-xs">Reden: {blockedReason}</span>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-xl border border-mm-border bg-mm-surface/60 px-3 py-2 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800">From:</span> {fromAddress}
        </div>
        <div>
          <span className="font-bold text-slate-800">To (prospect):</span>{" "}
          {toAddress || "—"}
        </div>
        <div>
          <span className="font-bold text-slate-800">Mode:</span>{" "}
          {generationMode ?? "—"} · {copyStyle ?? "—"} · {promptVersion ?? "—"} ·{" "}
          {generatorModel ?? "deterministic"}
        </div>
      </div>

      {(fixedCopy || personalisationCopy) && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Fixed copy
            </p>
            <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
              {fixedCopy || "—"}
            </pre>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50/60 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-800">
              Personalisation
            </p>
            <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-800">
              {personalisationCopy || "—"}
            </pre>
          </div>
        </div>
      )}

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Subject
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={pending}
          className="mt-1 w-full rounded-xl border border-mm-border bg-white px-3 py-2 text-sm font-semibold text-slate-900"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Plain-text body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          disabled={pending}
          className="mt-1 w-full rounded-xl border border-mm-border bg-white px-3 py-2 text-sm leading-relaxed text-slate-800"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          HTML preview (zoals ontvanger ziet)
        </label>
        <div
          className="mt-1 rounded-xl border border-mm-border bg-white px-4 py-4"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => void call("feedback", { feedback_vote: "up", feedback_note: feedbackNote || null })}
          className={`rounded-full border px-3 py-2 text-xs font-bold ${
            feedbackVote === "up"
              ? "border-emerald-400 bg-emerald-50 text-emerald-800"
              : "border-mm-border bg-white text-slate-700"
          }`}
        >
          Goede mail
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            void call("feedback", {
              feedback_vote: "down",
              feedback_note: feedbackNote || null,
            })
          }
          className={`rounded-full border px-3 py-2 text-xs font-bold ${
            feedbackVote === "down"
              ? "border-rose-400 bg-rose-50 text-rose-800"
              : "border-mm-border bg-white text-slate-700"
          }`}
        >
          Niet goed
        </button>
        <input
          value={feedbackNote}
          onChange={(e) => setFeedbackNote(e.target.value)}
          placeholder="Optionele feedback note"
          className="min-w-[180px] flex-1 rounded-full border border-mm-border bg-white px-3 py-2 text-xs"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => void call("save")}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white"
        >
          Opslaan
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => void call("regenerate")}
          className="rounded-full border border-mm-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700"
        >
          Regenerate
        </button>
        <button
          type="button"
          disabled={
            pending ||
            claimValidationStatus === "FAILED" ||
            isBlocked
          }
          onClick={() => void call("approve")}
          className="rounded-full bg-[#FF5722] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white disabled:opacity-40"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={pending || !testEmailConfigured || !resendConfigured}
          title={
            !resendConfigured
              ? "RESEND_API_KEY niet geconfigureerd"
              : !testEmailConfigured
                ? "OUTREACH_TEST_EMAIL niet gezet"
                : "Stuurt alleen naar OUTREACH_TEST_EMAIL"
          }
          onClick={() => void call("test_send")}
          className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-900 disabled:opacity-40"
        >
          Send test
        </button>
        <button
          type="button"
          disabled
          title="OUTREACH_REAL_SEND_ENABLED=false"
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"
        >
          Send (locked)
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Status: <span className="font-bold text-slate-800">{status}</span>
        {" · "}
        Validation:{" "}
        <span className="font-bold text-slate-800">
          {claimValidationStatus ?? "—"}
        </span>
        {" · "}
        Real send:{" "}
        <span className="font-bold text-slate-800">
          {realSendEnabled ? "ENABLED" : "DISABLED"}
        </span>
        {" · "}
        Resend:{" "}
        <span className="font-bold text-slate-800">
          {resendConfigured ? "configured" : "NOT_CONFIGURED"}
        </span>
      </p>

      {note ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {note}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
