"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function FavoriteButton({
  entity,
  id,
  isFavorite,
  size = "md",
}: {
  entity: "brands" | "opportunities";
  id: string;
  isFavorite: boolean;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [favorite, setFavorite] = useState(isFavorite);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setError(null);
    const next = !favorite;
    const res = await fetch(`/api/${entity}/${id}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Favoriet opslaan mislukt");
      return;
    }
    setFavorite(next);
    startTransition(() => router.refresh());
  }

  const sizeClass = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        disabled={pending}
        onClick={toggle}
        title={favorite ? "Verwijder favoriet" : "Markeer als favoriet"}
        aria-label={favorite ? "Verwijder favoriet" : "Markeer als favoriet"}
        className={`inline-flex items-center justify-center rounded-full border transition disabled:opacity-60 ${sizeClass} ${
          favorite
            ? "border-amber-300 bg-amber-50 text-amber-500"
            : "border-slate-200 bg-white text-slate-300 hover:border-amber-200 hover:text-amber-400"
        }`}
      >
        {favorite ? "★" : "☆"}
      </button>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
