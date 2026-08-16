export type HuidkliniekAnalyticsEvent =
  | "huidkliniek_page_view"
  | "huidkliniek_demo_click"
  | "huidkliniek_package_view"
  | "huidkliniek_package_select"
  | "huidkliniek_booking_app_click"
  | "huidkliniek_custom_click"
  | "huidkliniek_contact_start"
  | "huidkliniek_contact_submit";

export type PilatesAnalyticsEvent =
  | "pilates_page_view"
  | "pilates_demo_click"
  | "pilates_package_view"
  | "pilates_package_select"
  | "pilates_booking_app_click"
  | "pilates_custom_click"
  | "pilates_contact_start"
  | "pilates_contact_submit";

export function trackPilatesEvent(
  event: PilatesAnalyticsEvent,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({
    event,
    vertical: "pilates",
    ...payload,
  });
}

<<<<<<< HEAD
=======
export type HuidkliniekAnalyticsEvent =
  | "huidkliniek_page_view"
  | "huidkliniek_demo_click"
  | "huidkliniek_package_view"
  | "huidkliniek_package_select"
  | "huidkliniek_booking_app_click"
  | "huidkliniek_custom_click"
  | "huidkliniek_contact_start"
  | "huidkliniek_contact_submit";

>>>>>>> b574992 (Add pilates inbound API, Mollie launch payments, and LGE lead storage.)
export function trackHuidkliniekEvent(
  event: HuidkliniekAnalyticsEvent,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({
    event,
    vertical: "huidklinieken",
    ...payload,
  });
}
