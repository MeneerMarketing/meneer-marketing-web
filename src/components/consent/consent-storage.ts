export const CONSENT_STORAGE_KEY = "mm_consent_v1";
export const CONSENT_OPEN_EVENT = "mm-open-cookie-preferences";
export const CONSENT_CHANGED_EVENT = "mm-consent-changed";

export interface StoredConsent {
  v: 1;
  analytics: boolean;
  decidedAt: string;
}

export function parseConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as StoredConsent;
    if (o.v !== 1 || typeof o.analytics !== "boolean") return null;
    return o;
  } catch {
    return null;
  }
}

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function writeConsent(analytics: boolean): void {
  const payload: StoredConsent = {
    v: 1,
    analytics,
    decidedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
