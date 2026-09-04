"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PreviewShareGate({
  token,
  expiresAt,
}: {
  token: string;
  expiresAt: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/public/preview-share/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(
          data.error === "wrong_password"
            ? "Onjuist wachtwoord."
            : "Deze link is niet meer geldig.",
        );
        return;
      }
      router.refresh();
    } catch {
      setError("Controle mislukt. Probeer opnieuw.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF] px-4">
      <div className="w-full max-w-md border border-[#E5DFD4] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
          Concept preview
        </p>
        <h1 className="mt-2 text-xl font-extrabold text-[#2C2621]">Beveiligde preview-link</h1>
        <p className="mt-2 text-sm text-[#6B635C]">
          Deze link is persoonlijk. Vul het wachtwoord in dat je van Meneer Marketing hebt
          gekregen.
        </p>
        <p className="mt-1 text-xs text-[#8A8178]">
          Geldig t/m {new Date(expiresAt).toLocaleDateString("nl-NL")}
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-5 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#6B635C]">
            Wachtwoord
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-[#E5DFD4] px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#E64A19] disabled:opacity-50"
          >
            {pending ? "Bezig…" : "Preview openen"}
          </button>
        </form>
      </div>
    </div>
  );
}
