const SCROLL_HINTS_STORAGE_KEY = "mm-scroll-hints";

export function readScrollHintsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SCROLL_HINTS_STORAGE_KEY) === "on";
}

export function writeScrollHintsEnabled(enabled: boolean): void {
  localStorage.setItem(SCROLL_HINTS_STORAGE_KEY, enabled ? "on" : "off");
}
