"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DiscoveryStartForm() {
  const router = useRouter();
  const [scope, setScope] = useState<"NL" | "VL" | "BOTH">("NL");
  const [mode, setMode] = useState<"TEST" | "FULL">("TEST");
  const [cityPreset, setCityPreset] = useState<"arnhem" | "all">("arnhem");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        scope,
        mode,
        citySlugs: cityPreset === "arnhem" && scope === "NL" ? ["arnhem"] : undefined,
      };

      const response = await fetch("/api/discovery/pilates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: {
          status: string;
          new_businesses: number;
          duplicates: number;
          businesses_found: number;
          qualified: number;
          api_cost: number;
          api_calls: number;
          errors: string[];
        };
      };

      if (!response.ok || !json.ok || !json.result) {
        setError(json.error ?? "Discovery mislukt");
        return;
      }

      const r = json.result;
      setResult(
        `${r.status}: ${r.new_businesses} nieuw · ${r.duplicates} duplicates · ${r.businesses_found} hits · ${r.qualified} qualified · $${r.api_cost.toFixed(4)} · ${r.api_calls} calls`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-mm-border bg-white p-5 shadow-mm-card"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
        Nieuwe discovery starten
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Vertical
          </span>
          <select
            disabled
            className="mt-1 w-full border border-mm-border bg-mm-bg px-3 py-2.5"
            defaultValue="pilates"
          >
            <option value="pilates">Pilates</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Gebied
          </span>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as typeof scope)}
            className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
          >
            <option value="NL">Nederland</option>
            <option value="VL">Vlaanderen</option>
            <option value="BOTH">Beide</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Modus
          </span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
          >
            <option value="TEST">Test (budgetlimiet)</option>
            <option value="FULL">Full (nog voorzichtig)</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Test preset
        </span>
        <select
          value={cityPreset}
          onChange={(e) => setCityPreset(e.target.value as typeof cityPreset)}
          className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5 sm:max-w-sm"
        >
          <option value="arnhem">Alleen Arnhem (aanbevolen eerste run)</option>
          <option value="all">Volledige scope-steden (binnen budget)</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 bg-[#FF5722] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#C2410C] disabled:opacity-50"
      >
        {loading ? "Discovery draait…" : "Start discovery"}
      </button>

      {error ? (
        <p className="mt-3 text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
      {result ? (
        <p className="mt-3 text-sm text-emerald-700" role="status">
          {result}
        </p>
      ) : null}
    </form>
  );
}
