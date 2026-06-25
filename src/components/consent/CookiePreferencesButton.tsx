"use client";

import { openCookiePreferences } from "@/components/consent/consent-storage";

export function CookiePreferencesButton({
  className = "",
  children = "Cookievoorkeuren",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openCookiePreferences()}
    >
      {children}
    </button>
  );
}
