"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function OutreachActions({
  messageId,
  businessId,
  status,
  providerConfigured,
  testEmailConfigured,
  realSendEnabled,
  initialSubject,
  initialBody,
}: {
  messageId: string;
  businessId: string;
  status: string;
  providerConfigured: boolean;
  testEmailConfigured: boolean;
  realSendEnabled: boolean;
  initialSubject: string;
  initialBody: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function run(action: string, extra?: Record<string, unknown>) {
    setError(null);
    setInfo(null);
    const res = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, messageId, businessId, ...extra }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!json.ok) {
      setError(json.error ?? "Actie mislukt");
      return;
    }
    setInfo("Opgeslagen");
    startTransition(() => router.refresh());
  }

  const canEdit = !["SENT", "SENDING", "DELIVERED", "OPENED", "CLICKED", "REPLIED"].includes(
    status
  );

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Subject
        </span>
        <input
          value={subject}
          disabled={!canEdit || pending}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 w-full border border-mm-border bg-mm-bg px-3 py-2.5 text-sm disabled:opacity-60"
        />
      </label>
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Body
        </span>
        <textarea
          value={body}
          disabled={!canEdit || pending}
          onChange={(e) => setBody(e.target.value)}
          rows={16}
          className="mt-1.5 w-full border border-mm-border bg-mm-bg px-3 py-2.5 text-sm leading-relaxed disabled:opacity-60"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || !canEdit}
          onClick={() => run("edit", { subject, bodyText: body })}
          className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-40"
        >
          Opslaan
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run("regenerate")}
          className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-40"
        >
          Regenerate
        </button>
        <button
          type="button"
          disabled={pending || !["DRAFT", "REVIEW_REQUIRED"].includes(status)}
          onClick={() => run("approve")}
          className="bg-emerald-700 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-40"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={pending || !providerConfigured || !testEmailConfigured}
          onClick={() => run("send_test")}
          title={
            !providerConfigured
              ? "Resend niet geconfigureerd"
              : !testEmailConfigured
                ? "OUTREACH_TEST_EMAIL ontbreekt"
                : "Stuur testmail"
          }
          className="border border-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C2410C] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send test
        </button>
        <button
          type="button"
          disabled={
            pending || !providerConfigured || !realSendEnabled || status !== "APPROVED"
          }
          onClick={() => run("send")}
          title={
            !realSendEnabled
              ? "OUTREACH_REAL_SEND_ENABLED=false"
              : !providerConfigured
                ? "Resend niet geconfigureerd"
                : "Echte verzending"
          }
          className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Send
        </button>
      </div>

      {!providerConfigured ? (
        <p className="text-xs text-amber-800">
          Verzenden disabled: RESEND_API_KEY / RESEND_FROM_EMAIL ontbreken.
        </p>
      ) : null}
      {!realSendEnabled ? (
        <p className="text-xs text-slate-600">
          REAL OUTREACH DISABLED. Alleen Send test naar OUTREACH_TEST_EMAIL.
        </p>
      ) : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {info ? <p className="text-sm text-emerald-700">{info}</p> : null}
    </div>
  );
}

export function GenerateOutreachButton({ businessId }: { businessId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    const res = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate", businessId }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string; message?: { id: string } };
    if (!json.ok) {
      setError(json.error ?? "Genereren mislukt");
      return;
    }
    startTransition(() => {
      if (json.message?.id) router.push(`/dashboard/outreach/${json.message.id}`);
      else router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={generate}
        className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
      >
        {pending ? "Bezig…" : "Genereer outreach draft"}
      </button>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
