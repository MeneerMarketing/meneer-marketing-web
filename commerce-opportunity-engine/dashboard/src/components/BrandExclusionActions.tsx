"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const REASONS = [
  { value: "GENERAL_RETAILER", label: "General retailer" },
  { value: "TOO_LARGE", label: "Te groot" },
  { value: "MARKETPLACE", label: "Marketplace" },
  { value: "IRRELEVANT_BUSINESS", label: "Irrelevant business" },
  { value: "POOR_PROSPECT", label: "Slechte prospect" },
  { value: "EXISTING_CLIENT", label: "Bestaande klant" },
  { value: "COMPETITOR", label: "Concurrent" },
  { value: "DO_NOT_CONTACT", label: "Niet benaderen" },
  { value: "OTHER", label: "Overig" },
] as const;

export function BrandExclusionActions({
  brandId,
  manualExcluded,
  exclusionReason,
  exclusionNote,
  doNotContact,
}: {
  brandId: string;
  manualExcluded: boolean;
  exclusionReason: string | null;
  exclusionNote: string | null;
  doNotContact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState<string>(REASONS[0].value);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dnc, setDnc] = useState(Boolean(doNotContact));

  async function excludeBrand() {
    setError(null);
    const res = await fetch(`/api/brands/${brandId}/exclude`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, note: note.trim() || null }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Uitsluiten mislukt");
      return;
    }
    setOpen(false);
    setNote("");
    startTransition(() => router.refresh());
  }

  async function liftExclusion() {
    setError(null);
    const res = await fetch(`/api/brands/${brandId}/unexclude`, {
      method: "POST",
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Opheffen mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function toggleDnc() {
    setError(null);
    const next = !dnc;
    const res = await fetch(`/api/brands/${brandId}/dnc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "DNC wijzigen mislukt");
      return;
    }
    setDnc(next);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Do Not Contact
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Apart van uitsluiting. Geen outreach, audits blijven mogelijk.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={toggleDnc}
          className={`mt-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-60 ${
            dnc
              ? "bg-rose-600 text-white hover:bg-rose-700"
              : "border border-slate-300 bg-white text-slate-700 hover:border-rose-300"
          }`}
        >
          {dnc ? "DNC aan · klik om uit" : "DNC markeren"}
        </button>
      </div>

      {manualExcluded ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700">
            Handmatig uitgesloten
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {exclusionReason ?? "EXCLUDED"}
          </p>
          {exclusionNote ? (
            <p className="mt-1 text-sm text-slate-600">{exclusionNote}</p>
          ) : null}
          <p className="mt-2 text-xs text-slate-500">
            Geen CRO audits, scoring, shortlist of nieuwe opportunities totdat jij dit opheft.
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={liftExclusion}
            className="mt-3 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722] hover:text-[#C2410C] disabled:opacity-60"
          >
            Uitsluiting opheffen
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Handmatige actie
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Brand-level uitsluiting heeft voorrang op AI/deterministische qualification.
          </p>

          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-slate-800"
            >
              Uitsluiten
            </button>
          ) : (
            <div className="mt-3 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Reden
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-800"
                >
                  {REASONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Notitie (optioneel)
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-800"
                  placeholder="Korte interne toelichting…"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={excludeBrand}
                  className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  Bevestig uitsluiting
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700"
                >
                  Annuleren
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
