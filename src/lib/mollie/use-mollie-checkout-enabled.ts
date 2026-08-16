"use client";

import { useEffect, useState } from "react";

export function useMollieCheckoutEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/mollie/status")
      .then((response) => response.json())
      .then((payload: { configured?: boolean }) => {
        if (!cancelled) {
          setEnabled(Boolean(payload.configured));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEnabled(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return enabled;
}
