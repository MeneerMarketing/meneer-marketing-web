"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DISCOVERY_LAUNCHER_MODES,
  type DiscoveryLauncherMode,
  type DiscoveryPipelinePhase,
} from "@/config/discoveryLauncherModes";
import { DiscoveryRunProgress } from "@/components/dashboard/DiscoveryRunProgress";
import { Badge } from "@/components/dashboard/ui";
import type { VerticalPackStatus } from "@/verticals/launcher-catalog";

export interface LauncherVerticalOption {
  slug: string;
  name: string;
  status: VerticalPackStatus;
}

export interface LauncherCountryOption {
  code: "NL" | "BE";
  label: string;
  regions?: Array<{ code: string; label: string }>;
}

interface ExistingSummary {
  hasData: boolean;
  businessCount: number;
  qualifiedCount: number;
  lastRunAt: string | null;
  lastRunMode: string | null;
  coverageLabel: string | null;
}

type RerunAction = "USE_EXISTING" | "REFRESH" | "DEEPER";

interface DiscoveryLauncherFormProps {
  verticals: LauncherVerticalOption[];
  countriesByVertical: Record<string, LauncherCountryOption[]>;
}

export function DiscoveryLauncherForm({
  verticals,
  countriesByVertical,
}: DiscoveryLauncherFormProps) {
  const router = useRouter();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeVerticals = verticals.filter((v) => v.status === "ACTIVE");
  const [verticalSlug, setVerticalSlug] = useState(activeVerticals[0]?.slug ?? "pilates");
  const [countryCode, setCountryCode] = useState<"NL" | "BE">("NL");
  const [region, setRegion] = useState("");
  const [cityName, setCityName] = useState("");
  const [mode, setMode] = useState<DiscoveryLauncherMode>("STANDARD");
  const [rerunAction, setRerunAction] = useState<RerunAction | null>(null);

  const [estimateLabel, setEstimateLabel] = useState<string | null>(null);
  const [existing, setExisting] = useState<ExistingSummary | null>(null);
  const [estimating, setEstimating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [phase, setPhase] = useState<DiscoveryPipelinePhase | null>(null);
  const [runSnapshot, setRunSnapshot] = useState<Record<string, unknown> | null>(null);
  const [coverageQueries, setCoverageQueries] = useState<
    Array<{ label: string; results: number; unique_new?: number; relevant_new?: number }>
  >([]);

  const countries = useMemo(
    () => countriesByVertical[verticalSlug] ?? [],
    [countriesByVertical, verticalSlug]
  );

  const regions = useMemo(
    () => countries.find((c) => c.code === countryCode)?.regions ?? [],
    [countries, countryCode]
  );

  useEffect(() => {
    if (countries[0] && !countries.some((c) => c.code === countryCode)) {
      setCountryCode(countries[0].code);
    }
  }, [countries, countryCode]);

  const fetchEstimate = useCallback(async () => {
    if (!cityName.trim() || cityName.trim().length < 2) {
      setEstimateLabel(null);
      setExisting(null);
      return;
    }
    setEstimating(true);
    try {
      const response = await fetch("/api/discovery/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verticalSlug, countryCode, cityName: cityName.trim(), mode }),
      });
      const json = (await response.json()) as {
        ok: boolean;
        estimate?: { costLabel: string };
        existing?: ExistingSummary;
      };
      if (json.ok && json.estimate) {
        setEstimateLabel(json.estimate.costLabel);
        setExisting(json.existing ?? null);
      }
    } catch {
      /* estimate is optional UX */
    } finally {
      setEstimating(false);
    }
  }, [verticalSlug, countryCode, cityName, mode]);

  useEffect(() => {
    const timer = setTimeout(() => void fetchEstimate(), 400);
    return () => clearTimeout(timer);
  }, [fetchEstimate]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function pollRunStatus(id: string): Promise<string | null> {
    const response = await fetch(`/api/discovery/runs/${id}`);
    const json = (await response.json()) as {
      ok: boolean;
      run?: {
        pipeline_phase?: string;
        status?: string;
        businesses_found?: number;
        qualified?: number;
        api_cost?: number;
        coverage_summary?: Record<string, unknown>;
      };
      coverage?: {
        incremental_unique_by_query?: Array<{
          label: string;
          results: number;
          unique_new?: number;
          relevant_new?: number;
        }>;
      };
      redirectUrl?: string;
    };

    if (!json.ok || !json.run) return null;

    setPhase((json.run.pipeline_phase as DiscoveryPipelinePhase) ?? null);
    setRunSnapshot(json.run as Record<string, unknown>);

    if (json.coverage?.incremental_unique_by_query) {
      setCoverageQueries(json.coverage.incremental_unique_by_query);
    }

    const done =
      json.run.pipeline_phase === "COMPLETED" ||
      json.run.pipeline_phase === "FAILED" ||
      json.run.status === "COMPLETED" ||
      json.run.status === "FAILED";

    if (done) return json.redirectUrl ?? null;
    return undefined as unknown as string | null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cityName.trim()) {
      setError("Vul een stad in");
      return;
    }

    if (existing?.hasData && !rerunAction) {
      setError("Er bestaat al discoverydata voor deze stad. Kies een optie hieronder.");
      return;
    }

    setLoading(true);
    setError(null);
    setRunId(null);
    setPhase("PREPARING");
    setCoverageQueries([]);

    try {
      if (rerunAction === "USE_EXISTING") {
        const response = await fetch("/api/discovery/launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verticalSlug,
            countryCode,
            cityName: cityName.trim(),
            region: region || null,
            mode,
            rerunAction: "USE_EXISTING",
          }),
        });
        const json = (await response.json()) as { ok: boolean; redirectUrl?: string; error?: string };
        if (!response.ok || !json.ok) {
          setError(json.error ?? "Kon bestaande data niet openen");
          return;
        }
        if (json.redirectUrl) {
          router.push(json.redirectUrl);
          return;
        }
      }

      const launchResponse = await fetch("/api/discovery/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verticalSlug,
          countryCode,
          cityName: cityName.trim(),
          region: region || null,
          mode,
          rerunAction: rerunAction ?? undefined,
          execute: false,
        }),
      });
      const launchJson = (await launchResponse.json()) as {
        ok: boolean;
        runId?: string;
        citySlug?: string;
        error?: string;
      };

      if (!launchResponse.ok || !launchJson.ok || !launchJson.runId) {
        setError(launchJson.error ?? "Discovery starten mislukt");
        return;
      }

      const id = launchJson.runId;
      setRunId(id);

      pollRef.current = setInterval(() => {
        void pollRunStatus(id).then((redirect) => {
          if (redirect === null) return;
          if (redirect) {
            if (pollRef.current) clearInterval(pollRef.current);
            router.push(redirect);
          }
        });
      }, 1500);

      const execResponse = await fetch(`/api/discovery/runs/${id}`, { method: "POST" });
      const execJson = (await execResponse.json()) as {
        ok: boolean;
        redirectUrl?: string;
        error?: string;
      };

      if (pollRef.current) clearInterval(pollRef.current);

      if (!execResponse.ok || !execJson.ok) {
        setError(execJson.error ?? "Pipeline mislukt");
        await pollRunStatus(id);
        return;
      }

      await pollRunStatus(id);
      if (execJson.redirectUrl) {
        router.push(execJson.redirectUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  const verticalLabel = verticals.find((v) => v.slug === verticalSlug)?.name ?? verticalSlug;
  const showExistingWarning = existing?.hasData && cityName.trim().length >= 2;

  return (
    <form onSubmit={onSubmit} className="border border-mm-border bg-white p-5 shadow-mm-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
            Discovery Launcher
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Kies branche, land en stad. Het systeem draait de volledige pipeline server-side.
          </p>
        </div>
        <Link
          href="/dashboard/discovery"
          className="text-sm font-semibold text-slate-500 hover:text-[#C2410C]"
        >
          ← Terug naar overzicht
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Branche / vertical
          </span>
          <select
            value={verticalSlug}
            onChange={(e) => setVerticalSlug(e.target.value)}
            className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
          >
            {verticals.map((vertical) => (
              <option
                key={vertical.slug}
                value={vertical.slug}
                disabled={vertical.status !== "ACTIVE"}
              >
                {vertical.name.toUpperCase()}
                {vertical.status === "COMING_SOON" ? " · COMING SOON" : " · ACTIVE"}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Land
          </span>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value as "NL" | "BE")}
            className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </label>

        {regions.length > 0 ? (
          <label className="block text-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Regio (optioneel)
            </span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
            >
              <option value="">Geen voorkeur</option>
              {regions.map((r) => (
                <option key={r.code} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block text-sm sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Stad
          </span>
          <input
            type="text"
            value={cityName}
            onChange={(e) => {
              setCityName(e.target.value);
              setRerunAction(null);
            }}
            placeholder="Bijv. Apeldoorn"
            className="mt-1 w-full border border-mm-border bg-white px-3 py-2.5"
            autoComplete="address-level2"
          />
          <span className="mt-1 block text-[11px] text-slate-400">
            Nieuwe steden worden automatisch aangemaakt na normalisatie.
          </span>
        </label>
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Discovery mode
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {DISCOVERY_LAUNCHER_MODES.map((modeConfig) => (
            <button
              key={modeConfig.mode}
              type="button"
              onClick={() => setMode(modeConfig.mode)}
              className={`border p-3 text-left transition-colors ${
                mode === modeConfig.mode
                  ? "border-[#FF5722] bg-white shadow-mm-card"
                  : "border-mm-border bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{modeConfig.label}</span>
                {modeConfig.recommended ? <Badge tone="brand">Aanbevolen</Badge> : null}
              </div>
              <p className="mt-1 text-xs text-slate-500">{modeConfig.description}</p>
              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                Max ~${modeConfig.maxCostUsd.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Geschatte max spend
          </p>
          <p className="mt-1 text-lg font-extrabold text-slate-900">
            {estimating ? "…" : estimateLabel ?? "Vul een stad in"}
          </p>
        </div>
        {existing?.hasData ? (
          <div className="text-sm text-slate-600">
            Bestaand: {existing.businessCount} businesses · {existing.qualifiedCount} qualified
            {existing.coverageLabel ? ` · ${existing.coverageLabel} coverage` : ""}
          </div>
        ) : null}
      </div>

      {showExistingWarning ? (
        <div
          className="mt-4 border border-mm-border bg-mm-surface/70 px-4 py-3"
          role="alert"
        >
          <p className="text-sm font-semibold text-slate-800">
            Er bestaat al discoverydata voor {verticalLabel} · {cityName.trim()}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["USE_EXISTING", "Bestaande data gebruiken"],
                ["REFRESH", "Discovery verversen"],
                ["DEEPER", "Diepere coverage"],
              ] as const
            ).map(([action, label]) => (
              <button
                key={action}
                type="button"
                onClick={() => setRerunAction(action)}
                className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
                  rerunAction === action
                    ? "bg-[#FF5722] text-white"
                    : "border border-mm-border bg-white text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading || !cityName.trim()}
        className="mt-5 bg-[#FF5722] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#C2410C] disabled:opacity-50"
      >
        {loading ? "Discovery draait…" : "Start discovery"}
      </button>

      {error ? (
        <p className="mt-3 text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}

      {runId || phase ? (
        <DiscoveryRunProgress
          phase={phase}
          run={runSnapshot as Parameters<typeof DiscoveryRunProgress>[0]["run"]}
          coverageQueries={coverageQueries}
        />
      ) : null}
    </form>
  );
}
