"use client";

import { useState } from "react";

export function PreviewFeedbackWidget({ campaignRef }: { campaignRef: string }) {
  const [sentiment, setSentiment] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(nextSentiment: "up" | "down", withComment = false) {
    if (pending || done) return;
    setPending(true);
    setError(null);
    setSentiment(nextSentiment);

    const eventType =
      nextSentiment === "up" ? "PREVIEW_FEEDBACK_UP" : "PREVIEW_FEEDBACK_DOWN";
    const trimmedComment = withComment ? comment.trim().slice(0, 500) : "";
    const idem = `${eventType}:${campaignRef}:${Date.now()}`;

    try {
      const res = await fetch("/api/public/campaign-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idem,
        },
        body: JSON.stringify({
          campaign_ref: campaignRef,
          event_type: eventType,
          idempotency_key: idem,
          metadata: trimmedComment ? { comment: trimmedComment } : undefined,
        }),
        keepalive: true,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError("Feedback versturen mislukt. Probeer het later opnieuw.");
        setSentiment(null);
        return;
      }
      setDone(true);
      setShowComment(false);
    } catch {
      setError("Feedback versturen mislukt.");
      setSentiment(null);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="fixed bottom-4 left-4 z-[60] max-w-[280px] rounded-sm border border-[#E5DFD4] bg-[#F7F4EF]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <p className="text-sm font-semibold text-[#2C2621]">Bedankt voor je reactie.</p>
        <p className="mt-1 text-xs text-[#6B635C]">
          {sentiment === "up"
            ? "Mooi om te horen dat het concept aansluit."
            : "Helder. Ik neem je feedback mee."}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60] w-[min(100vw-2rem,320px)] rounded-sm border border-[#E5DFD4] bg-[#F7F4EF]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8A8178]">
        Jouw mening
      </p>
      <p className="mt-1 text-sm font-semibold text-[#2C2621]">Wat vind je ervan?</p>

      {!showComment ? (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit("up")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DFD4] bg-white text-lg transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50"
            aria-label="Positief"
          >
            👍
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit("down")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DFD4] bg-white text-lg transition hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
            aria-label="Negatief"
          >
            👎
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setShowComment(true)}
            className="ml-1 text-xs font-medium text-[#6B635C] underline-offset-2 hover:text-[#C2410C] hover:underline"
          >
            + toelichting
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Optioneel: wat springt eruit, of wat mist?"
            className="w-full resize-none border border-[#E5DFD4] bg-white px-3 py-2 text-sm text-[#2C2621] outline-none focus:border-[#FF5722]"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => void submit("up", true)}
              className="rounded-sm bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              Positief versturen
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void submit("down", true)}
              className="rounded-sm bg-[#45382C] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2C2217] disabled:opacity-50"
            >
              Negatief versturen
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setShowComment(false)}
              className="px-2 py-1.5 text-xs text-[#6B635C] hover:text-[#2C2621]"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
