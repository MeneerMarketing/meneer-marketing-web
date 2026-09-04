"use client";

import { useEffect, useRef, useState } from "react";

/**
 * First-party campaign tracking on preview pages.
 * No fingerprinting — only campaign_ref + event type.
 */
export function PreviewCampaignTracker({
  campaignRef,
  landingUrl,
  ctaLabel = "Dit concept laten bouwen?",
  ctaSubline = "Bekijk mogelijkheden & prijzen →",
}: {
  campaignRef: string | null;
  landingUrl: string | null;
  ctaLabel?: string;
  ctaSubline?: string;
}) {
  const sent = useRef(false);
  const [pastHero, setPastHero] = useState(false);

  // The hero is the moment that has to land. Our own card sits over its call to
  // action, so it only appears once the visitor has scrolled past the opening.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div
      className={`fixed bottom-28 right-4 z-[60] transition-all duration-500 sm:bottom-20 sm:right-6 ${
        pastHero
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!pastHero}
    >
      <a
        href={landingUrl}
        onClick={() => void onCtaClick()}
        tabIndex={pastHero ? 0 : -1}
        className="group flex max-w-[240px] flex-col gap-1 rounded-sm border border-[#E5DFD4] bg-[#F7F4EF]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition hover:border-[#FF5722]/50"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8A8178]">
          Meneer Marketing
        </span>
        <span className="text-sm font-semibold text-[#2C2621] group-hover:text-[#C2410C]">
          {ctaLabel}
        </span>
        <span className="text-xs text-[#6B635C]">{ctaSubline}</span>
      </a>
    </div>
  );
}
