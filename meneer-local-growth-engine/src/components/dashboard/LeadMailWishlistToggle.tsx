"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Vertical } from "@/types/domain";

interface Props {
  businessId: string;
  selected: boolean;
  studioName: string;
  cityName: string;
  businessVerticalId: string;
  verticals: Vertical[];
  compact?: boolean;
}

export function LeadMailWishlistToggle({
  businessId,
  selected,
  studioName,
  cityName,
  businessVerticalId,
  verticals,
  compact = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState(selected);
  const [open, setOpen] = useState(false);
  const [mailListVerticalId, setMailListVerticalId] = useState(businessVerticalId);
  const popoverRef = useRef<HTMLDivElement>(null);

  const activeVerticals = verticals.filter((v) => v.active);
  const businessVertical =
    activeVerticals.find((v) => v.id === businessVerticalId) ??
    activeVerticals[0] ??
    null;
  const selectedVertical =
    activeVerticals.find((v) => v.id === mailListVerticalId) ?? businessVertical;

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  useEffect(() => {
    setMailListVerticalId(businessVerticalId);
  }, [businessVerticalId]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function submit(selectedState: boolean, verticalId?: string) {
    setError(null);
    const res = await fetch("/api/leads/mail-wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId,
        selected: selectedState,
        verticalId: verticalId ?? mailListVerticalId,
      }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!json.ok) {
      setError(json.error ?? "Kon mail-lijst niet bijwerken");
      return false;
    }
    setIsSelected(selectedState);
    setOpen(false);
    startTransition(() => router.refresh());
    return true;
  }

  async function addToList() {
    if (mailListVerticalId !== businessVerticalId) {
      setError("Deze lead hoort bij een andere branche.");
      return;
    }
    await submit(true, mailListVerticalId);
  }

  async function removeFromList() {
    await submit(false);
  }

  function handleCompactClick() {
    if (pending) return;
    if (isSelected) {
      void removeFromList();
      return;
    }
    setOpen((value) => !value);
  }

  if (compact) {
    return (
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          disabled={pending}
          onClick={handleCompactClick}
          title={
            isSelected
              ? `Op ${selectedVertical?.name ?? "mail"}-lijst`
              : "Kies mail-lijst"
          }
          className={`inline-flex h-8 w-8 items-center justify-center border text-sm disabled:opacity-50 ${
            isSelected
              ? "border-[#FF5722] bg-[#FF5722] text-white"
              : "border-mm-border bg-white text-slate-400 hover:border-[#FF5722] hover:text-[#C2410C]"
          }`}
          aria-pressed={isSelected}
          aria-label={isSelected ? "Op mail-lijst" : "Zet op mail-lijst"}
          aria-expanded={open}
        >
          {pending ? "…" : isSelected ? "✓" : "+"}
        </button>

        {open && !isSelected ? (
          <div className="absolute left-0 top-full z-20 mt-1 w-56 border border-mm-border bg-white p-3 shadow-mm-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Mail-lijst
            </p>
            <select
              value={mailListVerticalId}
              onChange={(e) => setMailListVerticalId(e.target.value)}
              className="mt-2 w-full border border-mm-border bg-white px-2 py-1.5 text-xs"
            >
              {activeVerticals.map((vertical) => (
                <option
                  key={vertical.id}
                  value={vertical.id}
                  disabled={vertical.id !== businessVerticalId}
                >
                  {vertical.name}
                  {vertical.id !== businessVerticalId ? " (andere branche)" : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={pending}
              onClick={() => void addToList()}
              className="mt-2 w-full bg-[#FF5722] px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
            >
              Toevoegen
            </button>
            {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded border border-mm-border bg-mm-surface/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Mail-lijst
            {selectedVertical ? ` · ${selectedVertical.name}` : ""}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {isSelected
              ? `${studioName} staat op je ${selectedVertical?.name ?? "mail"}-lijst.`
              : `Zet ${studioName} op je lijst met studios die je echt gaat benaderen.`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {cityName} · mail-lijst per branche
          </p>
          {!isSelected ? (
            <label className="mt-3 block max-w-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Branche
              </span>
              <select
                value={mailListVerticalId}
                onChange={(e) => setMailListVerticalId(e.target.value)}
                className="mt-1 w-full border border-mm-border bg-white px-3 py-2 text-sm"
              >
                {activeVerticals.map((vertical) => (
                  <option
                    key={vertical.id}
                    value={vertical.id}
                    disabled={vertical.id !== businessVerticalId}
                  >
                    {vertical.name}
                    {vertical.id !== businessVerticalId ? " (andere branche)" : ""}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => (isSelected ? void removeFromList() : void addToList())}
          className={`shrink-0 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-50 ${
            isSelected
              ? "border border-mm-border bg-white text-slate-700"
              : "bg-[#FF5722] text-white"
          }`}
        >
          {pending
            ? "Bezig…"
            : isSelected
              ? "Uit mail-lijst"
              : `Op ${selectedVertical?.name ?? "mail"}-lijst`}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
