"use client";

import { useEffect, useRef } from "react";

import { trackCampaignEvent } from "@/lib/lge/track-client";

/**
 * One LANDING_PAGE_VIEWED per browser session / campaign ref.
 */
export function HuidkliniekCampaignTracker({
  campaignRef,
}: {
  campaignRef: string | null;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (!campaignRef || sent.current) return;
    sent.current = true;

    const hourBucket = new Date().toISOString().slice(0, 13);
    const storageKey = `lge:lpv:${campaignRef}:${hourBucket}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // private mode: still fire once via ref guard
    }

    void trackCampaignEvent(
      campaignRef,
      "LANDING_PAGE_VIEWED",
      { path: "/huidklinieken", section: "landing" },
      `LANDING_PAGE_VIEWED:${campaignRef}:${hourBucket}`,
    );
  }, [campaignRef]);

  return null;
}
