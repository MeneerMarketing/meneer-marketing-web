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

export function mollieCheckoutRedirectUrl(
  verticalPath: string,
  paymentId: string,
): string {
  const path = verticalPath.startsWith("/") ? verticalPath : `/${verticalPath}`;
  return `${SITE_URL}${path}?checkout=bedankt&payment=${encodeURIComponent(paymentId)}`;
}
