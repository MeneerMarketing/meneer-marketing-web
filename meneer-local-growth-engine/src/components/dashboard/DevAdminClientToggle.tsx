"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { DevAdminClientMode } from "@/lib/supabase/devClientPreference.shared";
import { devAdminClientModeLabel } from "@/lib/supabase/devClientPreference.shared";

interface Props {
  mode: DevAdminClientMode;
}

export function DevAdminClientToggle({ mode }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(mode.enabled);
  const [error, setError] = useState<string | null>(null);

  async function toggle(next: boolean) {
    setError(null);
    setEnabled(next);
    const res = await fetch("/api/settings/dev-admin-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!json.ok) {
      setEnabled(!next);
      setError(json.error ?? "Opslaan mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  if (!mode.isDevelopment) return null;

  return (
    <div className="mt-4 rounded border border-amber-200 bg-amber-50/80 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-amber-950">Admin client lokaal</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/90">
            Bij een verkeerde Windows-klok krijg je PGRST303 (JWT issued at future). Met
            deze optie leest het dashboard via de service key in plaats van je sessie-JWT.
            Je blijft ingelogd, maar data-queries omzeilen RLS. Alleen lokaal in dev.
          </p>
          {!mode.adminConfigured ? (
            <p className="mt-2 text-xs font-semibold text-rose-800">
              SUPABASE_SECRET_KEY ontbreekt. Toggle werkt pas als admin key gezet is.
            </p>
          ) : null}
          <p className="mt-2 text-[11px] text-amber-800/80">
            Actief via: {devAdminClientModeLabel(mode.source)}
          </p>
        </div>

        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-900">
            {enabled ? "Aan" : "Uit"}
          </span>
          <input
            type="checkbox"
            checked={enabled}
            disabled={pending || !mode.canToggle || !mode.adminConfigured}
            onChange={(e) => void toggle(e.target.checked)}
            className="h-5 w-5 accent-[#FF5722] disabled:cursor-not-allowed"
          />
        </label>
      </div>

      {!mode.canToggle && mode.enabled ? (
        <p className="mt-3 text-xs text-amber-900">
          Vastgezet via env (
          {mode.source === "env"
            ? "LGE_DEV_USE_ADMIN_CLIENT=true"
            : "LGE_DEV_AUTH_BYPASS=true"}
          ). Toggle is uitgeschakeld.
        </p>
      ) : null}

      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
