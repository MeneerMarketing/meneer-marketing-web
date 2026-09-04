"use client";

import { useEffect, useRef, useState } from "react";
import type { OutreachMailPreview } from "@/services/outreach/outreachPreviewService";

export function useOutreachLivePreview(input: {
  messageId: string;
  subject: string;
  bodyText: string;
  enabled?: boolean;
}): {
  preview: OutreachMailPreview | null;
  loading: boolean;
  error: string | null;
} {
  const [preview, setPreview] = useState<OutreachMailPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (input.enabled === false) return;

    const currentRequest = ++requestId.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/outreach/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messageId: input.messageId,
              subject: input.subject,
              bodyText: input.bodyText,
            }),
          });
          const json = (await res.json()) as {
            ok: boolean;
            error?: string;
            preview?: OutreachMailPreview;
          };
          if (currentRequest !== requestId.current) return;
          if (!json.ok || !json.preview) {
            setError(json.error ?? "Preview mislukt");
            return;
          }
          setPreview(json.preview);
        } catch (err) {
          if (currentRequest !== requestId.current) return;
          setError(err instanceof Error ? err.message : "Preview mislukt");
        } finally {
          if (currentRequest === requestId.current) setLoading(false);
        }
      })();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [input.messageId, input.subject, input.bodyText, input.enabled]);

  return { preview, loading, error };
}
