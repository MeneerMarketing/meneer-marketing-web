"use client";

import type {
  LgeCampaignEventMetadata,
  LgeCampaignEventType,
} from "@/lib/lge/types";

/**
 * Client → MM proxy → LGE.
 * Tracking mag nooit de UX blokkeren.
 */
export async function trackCampaignEvent(
  campaignRef: string | null | undefined,
  eventType: LgeCampaignEventType,
  metadata?: LgeCampaignEventMetadata,
  idempotencyKey?: string,
): Promise<void> {
  if (!campaignRef) return;

  try {
    await fetch("/api/lge/campaign-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_ref: campaignRef,
        event_type: eventType,
        metadata,
        idempotency_key: idempotencyKey,
      }),
      keepalive: true,
    });
  } catch {
    // Silent: conversion path stays open
  }
}
