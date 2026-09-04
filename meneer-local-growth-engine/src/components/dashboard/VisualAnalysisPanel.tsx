"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Panel, WebsiteLink } from "@/components/dashboard/ui";

interface VisualCandidate {
  business_id: string;
  studio_name: string;
  website_url: string | null;
  website_transformation_score: number | null;
  website_opportunity_score: number | null;
  business_quality_score: number | null;
  prospect_type: string | null;
  preview_eligible: boolean;
  recommended: boolean;
  recommend_reason: string | null;
  already_judged: boolean;
}

interface VisualResult {
  business_id: string;
  studio_name: string;
  visual_quality_score?: number | null;
  website_modernity_score?: number | null;
  mobile_experience_score?: number | null;
  business_presentation_gap?: number | null;
  redesign_impact_score?: number | null;
  website_transformation_score?: number | null;
  prospect_type?: string | null;
  preview_eligible?: boolean;
}

interface WinnerInfo {
  businessId: string;
  name: string;
  confidence: number | null;
  reason: string | null;
}

export function VisualAnalysisPanel({
  cityId,
  verticalSlug,
}: {
  cityId: string;
  verticalSlug: string;
}) {
  const [candidates, setCandidates] = useState<VisualCandidate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preset, setPreset] = useState<"top3" | "top5" | "manual">("top5");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<VisualResult[]>([]);
  const [winner, setWinner] = useState<WinnerInfo | null>(null);
  const [costTop3, setCostTop3] = useState(0.036);
  const [costTop5, setCostTop5] = useState(0.06);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/acquisition-fit/visual?cityId=${cityId}&verticalSlug=${verticalSlug}`
      );
      const json = (await response.json()) as {
        ok: boolean;
        candidates?: VisualCandidate[];
        estimatedCostTop3?: number;
        estimatedCostTop5?: number;
        error?: string;
      };
      if (!response.ok || !json.ok) {
        setError(json.error ?? "Kandidaten laden mislukt");
        return;
      }
      setCandidates(json.candidates ?? []);
      if (json.estimatedCostTop3 != null) setCostTop3(json.estimatedCostTop3);
      if (json.estimatedCostTop5 != null) setCostTop5(json.estimatedCostTop5);

      const recommended = (json.candidates ?? [])
        .filter((c) => c.recommended && !c.already_judged)
        .slice(0, 5)
        .map((c) => c.business_id);
      setSelected(new Set(recommended));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }, [cityId, verticalSlug]);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const estimatedCost = useMemo(() => {
    const count =
      preset === "top3" ? 3 : preset === "top5" ? 5 : selected.size;
    return Math.round(count * 0.012 * 1000) / 1000;
  }, [preset, selected.size]);

  function applyPreset(next: "top3" | "top5" | "manual") {
    setPreset(next);
    if (next === "manual") return;
    const count = next === "top3" ? 3 : 5;
    const ids = candidates
      .filter((c) => c.recommended && !c.already_judged)
      .slice(0, count)
      .map((c) => c.business_id);
    setSelected(new Set(ids));
  }

  function toggleId(id: string) {
    setPreset("manual");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function startVisualAnalysis() {
    setRunning(true);
    setError(null);
    setResults([]);
    setWinner(null);

    try {
      const body: Record<string, unknown> = {
        cityId,
        verticalSlug,
        preset,
      };
      if (preset === "manual") {
        body.businessIds = Array.from(selected);
      }

      const response = await fetch("/api/acquisition-fit/visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as {
        ok: boolean;
        error?: string;
        analyzed?: number;
        anthropicCost?: number;
        winner?: WinnerInfo | null;
        ranking?: { results?: VisualResult[] };
      };

      if (!response.ok || !json.ok) {
        setError(json.error ?? "Visual analysis mislukt");
        return;
      }

      if (json.winner) setWinner(json.winner);
      void loadCandidates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setRunning(false);
    }
  }

  const recommendedCount = candidates.filter((c) => c.recommended && !c.already_judged).length;

  return (
    <Panel title="Visual analysis (fase B)">
      <p className="text-sm text-slate-600">
        Fase A is afgerond: Google Local discovery, deterministische kwalificatie en
        website-crawl. Kies nu bewust welke kandidaten Claude Vision krijgen.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Kandidaten laden…</p>
      ) : candidates.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nog geen geschikte kandidaten. Draai eerst discovery of verdiep de coverage.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("top3")}
              className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
                preset === "top3"
                  ? "border-[#FF5722] bg-[#FF5722]/10 text-[#C2410C]"
                  : "border-mm-border bg-white text-slate-600"
              }`}
            >
              Analyseer top 3 · ~${costTop3.toFixed(3)}
            </button>
            <button
              type="button"
              onClick={() => applyPreset("top5")}
              className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
                preset === "top5"
                  ? "border-[#FF5722] bg-[#FF5722]/10 text-[#C2410C]"
                  : "border-mm-border bg-white text-slate-600"
              }`}
            >
              Analyseer top 5 · ~${costTop5.toFixed(3)}
            </button>
            <button
              type="button"
              onClick={() => applyPreset("manual")}
              className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
                preset === "manual"
                  ? "border-[#FF5722] bg-[#FF5722]/10 text-[#C2410C]"
                  : "border-mm-border bg-white text-slate-600"
              }`}
            >
              Selecteer handmatig
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {recommendedCount} aanbevolen kandidaten op basis van business quality, eigen
            website en website opportunity.
          </p>

          <ul className="mt-4 max-h-72 divide-y divide-slate-100 overflow-y-auto text-sm">
            {candidates.map((candidate) => (
              <li key={candidate.business_id} className="flex items-start gap-3 py-2.5">
                <input
                  type="checkbox"
                  checked={selected.has(candidate.business_id)}
                  onChange={() => toggleId(candidate.business_id)}
                  disabled={candidate.already_judged}
                  className="mt-1"
                  aria-label={`Selecteer ${candidate.studio_name}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {candidate.studio_name}
                    </span>
                    {candidate.recommended ? (
                      <Badge tone="success">AANBEVOLEN</Badge>
                    ) : null}
                    {candidate.already_judged ? (
                      <Badge tone="sky">AL BEOORDEELD</Badge>
                    ) : null}
                    {candidate.prospect_type ? (
                      <Badge tone="neutral">{candidate.prospect_type}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    <WebsiteLink
                      url={candidate.website_url}
                      className="text-xs font-semibold"
                      showIcon={false}
                    />
                    {candidate.website_url ? " · " : ""}
                    Opportunity {candidate.website_opportunity_score ?? "—"} · Quality{" "}
                    {candidate.business_quality_score ?? "—"}
                    {candidate.recommend_reason ? ` · ${candidate.recommend_reason}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-sm text-slate-600">
              Geschatte Anthropic-kosten:{" "}
              <span className="font-bold text-slate-900">
                ~${estimatedCost.toFixed(3)}
              </span>
            </p>
            <button
              type="button"
              onClick={() => void startVisualAnalysis()}
              disabled={running || (preset === "manual" && selected.size === 0)}
              className="bg-[#FF5722] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#C2410C] disabled:opacity-50"
            >
              {running ? "Claude analyseert…" : "Start Claude visual analysis"}
            </button>
          </div>
        </>
      )}

      {error ? (
        <p className="mt-3 text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}

      {winner ? (
        <div className="mt-5 border-t border-slate-100 bg-mm-surface/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
            Website redesign winner
          </p>
          <p className="mt-2 text-lg font-extrabold text-slate-900">{winner.name}</p>
          {winner.confidence != null ? (
            <p className="mt-1 text-sm text-slate-600">
              Winner confidence: {Math.round(winner.confidence)}
            </p>
          ) : null}
          {winner.reason ? (
            <p className="mt-2 text-sm text-slate-600">{winner.reason}</p>
          ) : null}
        </div>
      ) : !loading && candidates.length > 0 && recommendedCount === 0 ? (
        <div className="mt-5 border-t border-slate-100 bg-mm-surface/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Geen geschikte website transformation prospect gevonden
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Probeer een diepere discovery, kies een andere stad, of bekijk de resultaten
            handmatig hieronder.
          </p>
        </div>
      ) : null}
    </Panel>
  );
}
