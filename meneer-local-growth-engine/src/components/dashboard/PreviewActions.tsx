"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatErrorMessage } from "@/lib/errors";
import type { PreviewRecord, TemplateRecord } from "@/types/domain";
import type { TemplateVariant } from "@/types/studio";

export function PreviewActions({
  businessId,
  isDemo,
  qualificationStatus,
  previewStatus,
  selectedTemplate,
  templates,
  previews,
  confidence,
  reasoning,
}: {
  businessId: string;
  isDemo: boolean;
  qualificationStatus: string;
  previewStatus: string;
  selectedTemplate: TemplateRecord | null;
  templates: TemplateRecord[];
  previews: PreviewRecord[];
  confidence: number | null;
  reasoning: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forceTemplate, setForceTemplate] = useState<TemplateVariant | "">(
    (selectedTemplate?.variant as TemplateVariant) ?? ""
  );

  const ready = previews.find((p) => p.status === "READY" || p.status === "APPROVED");

  async function call(action: "generate" | "archive" | "change_template") {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/preview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          action,
          allowDemo: isDemo,
          forceTemplate: forceTemplate || undefined,
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: unknown;
        result?: {
          ok: boolean;
          error?: unknown;
          slug?: string;
          variant?: string;
          confidence?: number;
          anthropic_cost_usd?: number;
          previewUrl?: string;
          status?: string;
        };
      };
      if (!res.ok || !json.ok) {
        setError(
          formatErrorMessage(json.error ?? json.result?.error ?? "Actie mislukt")
        );
        return;
      }
      if (json.result && !json.result.ok) {
        setError(formatErrorMessage(json.result.error ?? "Preview mislukt"));
        return;
      }
      const r = json.result;
      setMessage(
        r?.slug
          ? `READY · ${r.variant} · ${Math.round((r.confidence ?? 0) * 100)}% · $${(r.anthropic_cost_usd ?? 0).toFixed(4)} · ${r.previewUrl}`
          : `Status: ${r?.status ?? "ok"}`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Preview status
          </p>
          <p className="mt-1 font-semibold">{previewStatus}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Selected template
          </p>
          <p className="mt-1 font-semibold">{selectedTemplate?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Confidence
          </p>
          <p className="mt-1 font-semibold">
            {confidence != null ? `${Math.round(confidence * 100)}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Qualificatie
          </p>
          <p className="mt-1 font-semibold">{qualificationStatus}</p>
        </div>
      </dl>
      {reasoning ? <p className="text-xs text-slate-500">{reasoning}</p> : null}

      <label className="block text-sm">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Template keuze
        </span>
        <select
          value={forceTemplate}
          onChange={(e) => setForceTemplate(e.target.value as TemplateVariant | "")}
          className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
        >
          <option value="">Automatisch selecteren</option>
          {templates.map((t) => (
            <option key={t.id} value={t.variant}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => call("generate")}
          className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
        >
          {loading ? "Bezig…" : ready ? "Preview regenereren" : "Preview genereren"}
        </button>
        {ready ? (
          <a
            href={`/preview/${ready.slug}`}
            target="_blank"
            rel="noreferrer"
            className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700"
          >
            Bekijk preview
          </a>
        ) : null}
        <button
          type="button"
          disabled={loading || !forceTemplate}
          onClick={() => call("change_template")}
          className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 disabled:opacity-40"
        >
          Andere template + regenerate
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => call("archive")}
          className="border border-rose-200 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-rose-700 disabled:opacity-50"
        >
          Preview archiveren
        </button>
      </div>

      {error ? (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      ) : null}

      {previews.length > 0 ? (
        <ul className="space-y-2 border-t border-slate-100 pt-4">
          {previews.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {p.template_variant} · {p.status}
                <span className="ml-2 text-xs text-slate-400">/{p.slug}</span>
              </span>
              {(p.status === "READY" || p.status === "APPROVED") && (
                <a
                  href={`/preview/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#C2410C]"
                >
                  Open ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
