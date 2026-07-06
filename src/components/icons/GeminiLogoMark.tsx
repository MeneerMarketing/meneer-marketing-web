"use client";

import { useId } from "react";

interface GeminiLogoMarkProps {
  className?: string;
  title?: string;
}

/** Google Gemini ster-mark met merkgradient. */
export function GeminiLogoMark({ className, title = "Gemini" }: GeminiLogoMarkProps) {
  const gradId = useId();

  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#9B72F2" />
          <stop offset="65%" stopColor="#D96570" />
          <stop offset="100%" stopColor="#F4B400" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M12 2.5 14.8 9.2 21.5 12 14.8 14.8 12 21.5 9.2 14.8 2.5 12 9.2 9.2 12 2.5Z"
      />
    </svg>
  );
}
