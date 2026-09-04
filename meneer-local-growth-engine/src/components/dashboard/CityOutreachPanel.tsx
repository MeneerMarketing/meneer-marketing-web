"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Panel } from "@/components/dashboard/ui";
import { isUnlimitedCityOutreach } from "@/verticals/pilates/outreachCapacity";
import type { Business } from "@/types/domain";

const TEMPLATE_LABELS: Record<string, string> = {
  editorial: "Editorial",
  "reformer-minimal": "Reformer Minimal",
  "soft-movement": "Soft Movement",
};

interface TemplateUsageRow {
  template: string;
  label: string;
  status: "AVAILABLE" | "IN_USE";
  business_id: string | null;
  studio_name: string | null;
}

interface CapacityView {
  active: number;
  max: number;
  available: number;
}

interface Props {
  verticalSlug: string;
  cityId: string;
  cityName: string;
  verticalName: string;
  businesses: Business[];
  capacity: CapacityView;
  templateUsage: TemplateUsageRow[];
  acquisitionProtected: boolean;
  protectionReason: string | null;
  activeClientsInCity: number;
}

function scoreOf(business: Business): number {
  return business.website_transformation_score != null
    ? Math.round(Number(business.website_transformation_score))
    : 0;
}

export function CityOutreachPanel({
  verticalSlug,
  cityId,
  cityName,
  verticalName,
  businesses,
  capacity,
  templateUsage,
  acquisitionProtected,
  protectionReason,
  activeClientsInCity,
}: Props) {
  const router = useRouter();
  const eligible = useMemo(
    () =>
      businesses
        .filter(
          (b) =>
            b.prospect_type === "WEBSITE_TRANSFORMATION" && b.preview_eligible
        )
        .sort(
          (a, b) =>
            (a.transformation_city_rank ?? 99) - (b.transformation_city_rank ?? 99)
        ),
    [businesses]
  );

  const [selected, setSelected] = useState<string[]>(() =>
    businesses.filter((b) => b.selected_for_outreach).map((b) => b.id)
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (!isUnlimitedCityOutreach(capacity.max) && prev.length >= capacity.max) {
        setError(`Maximaal ${capacity.max} actieve prospects per stad`);
        return prev;
      }
      setError(null);
      return [...prev, id];
    });
  }

  async function prepare() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/city-outreach/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verticalSlug,
          cityId,
          businessIds: selected,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Voorbereiden mislukt");
        return;
      }
      setMessage(
        `Voorbereid: ${json.prepared?.length ?? 0} prospects · capacity ${json.capacity?.active}/${json.capacity?.max}`
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  const selectedCount = businesses.filter((b) => b.selected_for_outreach).length;

  return (
    <Panel title={`${cityName.toUpperCase()} · ${verticalName.toUpperCase()}`}>
      {acquisitionProtected ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-bold uppercase tracking-wide">Acquisition protected</p>
          <p className="mt-1">
            Reason: {protectionReason ?? "manual"} · geen nieuwe outreach tenzij protection
            wordt verwijderd.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Discovered
          </p>
          <p className="text-xl font-extrabold text-slate-900">{businesses.length}</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Website transformation
          </p>
          <p className="text-xl font-extrabold text-slate-900">{eligible.length}</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Selected for outreach
          </p>
          <p className="text-xl font-extrabold text-slate-900">{selectedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Outreach capacity
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {isUnlimitedCityOutreach(capacity.max)
              ? `${capacity.active} actief`
              : `${capacity.active} / ${capacity.max}`}
          </p>
        </div>
      </div>

      {activeClientsInCity > 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          Actieve klanten in deze stad (informatief): {activeClientsInCity}
        </p>
      ) : null}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Template usage
        </p>
        <ul className="mt-2 space-y-2 text-sm">
          {templateUsage.map((row) => (
            <li key={row.template} className="flex flex-wrap items-center gap-2">
              <span className="min-w-[8rem] font-semibold text-slate-800">{row.label}</span>
              {row.status === "IN_USE" ? (
                <>
                  <Badge tone="warn">IN USE</Badge>
                  <span className="text-slate-600">{row.studio_name}</span>
                </>
              ) : (
                <Badge tone="neutral">AVAILABLE</Badge>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Ranking · selectie
        </p>
        <ul className="mt-2 divide-y divide-slate-100 text-sm">
          {eligible.map((business) => {
            const isSelected =
              selected.includes(business.id) || business.selected_for_outreach;
            const isBackup = !isSelected;
            return (
              <li key={business.id} className="flex flex-wrap items-center gap-2 py-2">
                {!acquisitionProtected ? (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={selected.includes(business.id)}
                    disabled={loading}
                    onChange={() => toggle(business.id)}
                  />
                ) : null}
                <span className="w-8 font-bold text-slate-400">
                  #{business.transformation_city_rank ?? "—"}
                </span>
                <span className="font-semibold text-slate-900">{business.studio_name}</span>
                <span className="tabular-nums text-slate-500">
                  Transformation {scoreOf(business)}
                </span>
                {isSelected ? <Badge tone="success">SELECTED</Badge> : null}
                {isBackup ? <Badge tone="neutral">BACKUP</Badge> : null}
                {business.assigned_template ? (
                  <Badge tone="sky">
                    {TEMPLATE_LABELS[business.assigned_template] ?? business.assigned_template}
                  </Badge>
                ) : business.recommended_template ? (
                  <Badge tone="neutral">
                    rec. {TEMPLATE_LABELS[business.recommended_template] ?? business.recommended_template}
                  </Badge>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {!acquisitionProtected ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={loading || !selected.length}
            onClick={() => void prepare()}
            className="rounded-lg bg-[#C2410C] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "Bezig…" : "Prepare selected for outreach"}
          </button>
          <p className="text-xs text-slate-500">
            {isUnlimitedCityOutreach(capacity.max)
              ? "Unieke template per actieve prospect · nog geen mail versturen."
              : `Selecteer max ${capacity.max} · unieke template per actieve prospect · nog geen mail versturen.`}
          </p>
        </div>
      ) : null}

      {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
    </Panel>
  );
}
