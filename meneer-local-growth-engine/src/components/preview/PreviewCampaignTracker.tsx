"use client";

import { useEffect, useRef } from "react";

/**
 * First-party campaign tracking on preview pages.
 * No fingerprinting — only campaign_ref + event type.
 */
export function PreviewCampaignTracker({
  campaignRef,
  landingUrl,
}: {
  campaignRef: string | null;
  landingUrl: string | null;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (!campaignRef || sent.current) return;
    sent.current = true;

    const idem = `PREVIEW_OPENED:${campaignRef}:${new Date().toISOString().slice(0, 13)}`;
    void fetch("/api/public/campaign-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idem,
      },
      body: JSON.stringify({
        campaign_ref: campaignRef,
        event_type: "PREVIEW_OPENED",
        idempotency_key: idem,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [campaignRef]);

  async function onCtaClick() {
    if (!campaignRef) return;
    const idem = `PREVIEW_CTA_CLICKED:${campaignRef}:${Date.now()}`;
    try {
      await fetch("/api/public/campaign-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idem,
        },
        body: JSON.stringify({
          campaign_ref: campaignRef,
          event_type: "PREVIEW_CTA_CLICKED",
          idempotency_key: idem,
        }),
        keepalive: true,
      });
    } catch {
      // navigation still proceeds
    }
  }

  if (!campaignRef || !landingUrl) return null;

  return (
    <div className="pointer-events-auto fixed bottom-28 right-4 z-[60] sm:bottom-20 sm:right-6">
      <a
        href={landingUrl}
        onClick={() => void onCtaClick()}
        className="group flex max-w-[240px] flex-col gap-1 rounded-sm border border-[#E5DFD4] bg-[#F7F4EF]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition hover:border-[#FF5722]/50"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8A8178]">
          Meneer Marketing
        </span>
        <span className="text-sm font-semibold text-[#2C2621] group-hover:text-[#C2410C]">
          Dit concept laten bouwen?
        </span>
        <span className="text-xs text-[#6B635C]">Bekijk mogelijkheden &amp; prijzen →</span>
      </a>
    </div>
  );
}
