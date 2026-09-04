"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type CSSProperties } from "react";

function swatchStyle(color: string | null | undefined): CSSProperties {
  return {
    backgroundColor: color && /^#[0-9a-f]{3,8}$/i.test(color) ? color : "#E5E7EB",
  };
}

export function BrandColorOverridePanel({
  businessId,
  primaryColor,
  secondaryColor,
  accentColor,
  previewSlug,
}: {
  businessId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  previewSlug: string | null;
}) {
  const router = useRouter();
  const defaults = useMemo(
    () => ({
      primary: primaryColor ?? "#1A1614",
      secondary: secondaryColor ?? "#F4EFE6",
      accent: accentColor ?? "#C4A484",
    }),
    [primaryColor, secondaryColor, accentColor],
  );

  const [primary, setPrimary] = useState(defaults.primary);
  const [secondary, setSecondary] = useState(defaults.secondary);
  const [accent, setAccent] = useState(defaults.accent);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/preview/brand-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          primaryColor: primary,
          accentColor: accent,
          secondaryColor: secondary,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        result?: { previewUpdated?: boolean };
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Opslaan mislukt");
        return;
      }
      setMessage(
        data.result?.previewUpdated
          ? "Kleuren opgeslagen. Preview is direct bijgewerkt."
          : "Kleuren opgeslagen op lead. Genereer preview opnieuw voor live resultaat.",
      );
      router.refresh();
    } catch {
      setError("Opslaan mislukt");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Auto-extract pakt soms de verkeerde kleur (bijv. groen i.p.v. bruin). Pas primary en accent
        handmatig aan vóór verzenden. De live preview past direct mee.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <ColorField label="Primary" value={primary} onChange={setPrimary} />
        <ColorField label="Secondary" value={secondary} onChange={setSecondary} />
        <ColorField label="Accent" value={accent} onChange={setAccent} />
      </div>

      <div className="flex flex-wrap items-center gap-3 border border-mm-border bg-slate-50 p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Preview
        </span>
        <span className="h-10 w-16 rounded-sm border border-black/10" style={swatchStyle(primary)} />
        <span className="h-10 w-16 rounded-sm border border-black/10" style={swatchStyle(secondary)} />
        <span className="h-10 w-16 rounded-sm border border-black/10" style={swatchStyle(accent)} />
        {previewSlug ? (
          <a
            href={`/preview/${previewSlug}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-xs font-semibold text-[#C2410C]"
          >
            Bekijk live preview ↗
          </a>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="bg-[#FF5722] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
        >
          {pending ? "Opslaan…" : "Kleuren opslaan"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setPrimary(defaults.primary);
            setSecondary(defaults.secondary);
            setAccent(defaults.accent);
            setMessage(null);
            setError(null);
          }}
          className="border border-mm-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 disabled:opacity-50"
        >
          Reset naar huidige
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
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const pickerValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";

  return (
    <label className="block text-sm">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-11 w-11 cursor-pointer border border-mm-border bg-white p-1"
          aria-label={`${label} kleurkiezer`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 border border-mm-border bg-white px-3 py-2.5 font-mono text-xs uppercase"
          spellCheck={false}
        />
      </div>
    </label>
  );
}
