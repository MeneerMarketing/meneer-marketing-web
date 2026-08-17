const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://meneermarketing.nl";

export function getMollieApiKey(): string | null {
  const key = process.env.MOLLIE_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function isMollieConfigured(): boolean {
  return getMollieApiKey() !== null;
}

export function getSiteUrl(): string {
  return SITE_URL;
}

export function mollieWebhookUrl(): string {
  return `${SITE_URL}/api/mollie/webhook`;
}

export interface MollieCheckoutRedirectOptions {
  submissionId?: string | null;
  studioName?: string;
  city?: string;
  packageId?: string;
  campaignRef?: string | null;
}

function verticalBedanktPath(verticalPath: string): string {
  const path = verticalPath.startsWith("/") ? verticalPath : `/${verticalPath}`;
  if (path === "/pilates-studios") return "/pilates-studios/bedankt";
  if (path === "/huidklinieken") return "/huidklinieken/bedankt";
  return `${path}/bedankt`;
}

export function mollieCheckoutRedirectUrl(
  verticalPath: string,
  paymentId: string,
  options?: MollieCheckoutRedirectOptions,
): string {
  const params = new URLSearchParams({
    betaald: "1",
    mollie: paymentId,
    status: "pending",
    pay: "0",
    launch: "0",
    pakket: options?.packageId?.trim() || "unsure",
  });

  if (options?.submissionId) {
    params.set("submission", options.submissionId);
  }
  if (options?.studioName?.trim()) {
    params.set("studio", options.studioName.trim());
  }
  if (options?.city?.trim()) {
    params.set("stad", options.city.trim());
  }
  if (options?.campaignRef) {
    params.set("ref", options.campaignRef);
  }

  return `${SITE_URL}${verticalBedanktPath(verticalPath)}?${params.toString()}`;
}
