"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PreviewShareLinkView } from "@/services/preview/previewShareService";

export function PreviewShareLinkPanel({
  businessId,
  initialLinks,
}: {
  businessId: string;
  initialLinks: PreviewShareLinkView[];
}) {
  const router = useRouter();
  const [links, setLinks] = useState(initialLinks);
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createLink() {
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/preview/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          password: usePassword ? password : null,
          expiresInDays: 30,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        link?: PreviewShareLinkView;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.link) {
        setError(data.error ?? "Share link aanmaken mislukt");
        return;
      }
      setLinks((prev) => [data.link!, ...prev]);
      setPassword("");
      setUsePassword(false);
      setMessage("Nieuwe share link aangemaakt (30 dagen geldig).");
      router.refresh();
    } catch {
      setError("Share link aanmaken mislukt");
    } finally {
      setPending(false);
    }
  }

  async function revokeLink(linkId: string) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/preview/share", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, linkId }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Intrekken mislukt");
        return;
      }
      setLinks((prev) => prev.map((l) => (l.id === linkId ? { ...l, revoked: true } : l)));
      router.refresh();
    } catch {
      setError("Intrekken mislukt");
    } finally {
      setPending(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link gekopieerd.");
    } catch {
      setError("Kopiëren mislukt");
    }
  }

  const activeLinks = links.filter((l) => !l.revoked && new Date(l.expiresAt) > new Date());

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-mm-border bg-mm-surface/40 p-4">
        <p className="text-sm text-slate-600">
          Korte link voor mondeling delen. Verloopt na 30 dagen. Optioneel met wachtwoord.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
          />
          Wachtwoord instellen
        </label>
        {usePassword ? (
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Bijv. studio2026"
            className="mt-2 w-full max-w-xs border border-mm-border px-3 py-2 text-sm"
          />
        ) : null}
        <button
          type="button"
          disabled={pending || (usePassword && password.trim().length < 4)}
          onClick={() => void createLink()}
          className="mt-3 border border-[#FF5722] bg-[#FF5722] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#E64A19] disabled:opacity-50"
        >
          Nieuwe share link
        </button>
        {message ? <p className="mt-2 text-xs text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
      </div>

      {activeLinks.length === 0 ? (
        <p className="text-sm text-slate-500">Nog geen actieve share links.</p>
      ) : (
        <ul className="space-y-3">
          {activeLinks.map((link) => (
            <li key={link.id} className="border border-mm-border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-all font-mono text-sm text-[#C2410C]">{link.url}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Verloopt {new Date(link.expiresAt).toLocaleDateString("nl-NL")}
                    {link.hasPassword ? " · met wachtwoord" : " · open"}
                    {link.accessCount > 0 ? ` · ${link.accessCount}× geopend` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => void copyUrl(link.url)}
                    className="border border-mm-border px-3 py-1.5 text-xs font-semibold hover:border-[#FF5722]"
                  >
                    Kopieer
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void revokeLink(link.id)}
                    className="border border-mm-border px-3 py-1.5 text-xs font-semibold text-rose-700 hover:border-rose-300"
                  >
                    Intrekken
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
