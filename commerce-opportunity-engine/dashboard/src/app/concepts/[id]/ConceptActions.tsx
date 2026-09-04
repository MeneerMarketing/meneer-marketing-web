"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConceptActions({
  id,
  status,
  currentProduct,
  heroCandidates,
  templateFamily,
  operatorNote,
  needsAssets,
}: {
  id: string;
  status: string;
  currentProduct: string | null;
  heroCandidates: Array<{ product_title: string }>;
  templateFamily: string | null;
  operatorNote: string | null;
  needsAssets: boolean;
}) {
  const router = useRouter();
  const [note, setNote] = useState(operatorNote ?? "");
  const [product, setProduct] = useState(currentProduct ?? "");
  const [family, setFamily] = useState(templateFamily ?? "PREMIUM_DTC");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function act(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/concepts/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "Actie mislukt");
      } else {
        setMsg("Opgeslagen");
        router.refresh();
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Fout");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Manual controls · status {status}
        {needsAssets ? " · needs assets" : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => act("approve")}
          className="rounded-full bg-[#FF5722] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          Approve for concept
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => act("reject")}
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 disabled:opacity-50"
        >
          Reject concept
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => act("needs_assets")}
          className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 disabled:opacity-50"
        >
          Mark needs assets
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => act("archive")}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-50"
        >
          Archive
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block text-xs">
          <span className="font-bold text-slate-500">Choose product (overrides automation)</span>
          <select
            className="mt-1 w-full rounded-xl border border-mm-border px-3 py-2 text-sm"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">—</option>
            {currentProduct ? (
              <option value={currentProduct}>{currentProduct}</option>
            ) : null}
            {heroCandidates
              .filter((h) => h.product_title !== currentProduct)
              .map((h) => (
                <option key={h.product_title} value={h.product_title}>
                  {h.product_title}
                </option>
              ))}
          </select>
          <button
            type="button"
            disabled={busy || !product}
            onClick={() =>
              act("choose_product", { product_title: product })
            }
            className="mt-2 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
          >
            Save product override
          </button>
        </label>

        <label className="block text-xs">
          <span className="font-bold text-slate-500">Template family</span>
          <select
            className="mt-1 w-full rounded-xl border border-mm-border px-3 py-2 text-sm"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="PREMIUM_DTC">PREMIUM_DTC</option>
            <option value="PRODUCT_ENGINEERING">PRODUCT_ENGINEERING</option>
            <option value="EDITORIAL_COMMERCE">EDITORIAL_COMMERCE</option>
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={() => act("choose_template_family", { template_family: family })}
            className="mt-2 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
          >
            Save template family
          </button>
        </label>
      </div>

      <label className="mt-4 block text-xs">
        <span className="font-bold text-slate-500">Note</span>
        <textarea
          className="mt-1 w-full rounded-xl border border-mm-border px-3 py-2 text-sm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => act("add_note", { note })}
          className="mt-2 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
        >
          Save note
        </button>
      </label>

      {msg ? <p className="mt-3 text-xs font-semibold text-slate-600">{msg}</p> : null}
    </div>
  );
}
