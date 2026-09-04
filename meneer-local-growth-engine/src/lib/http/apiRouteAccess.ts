/** Public campaign tracking + context (rate-limited in route handlers). */
export function isPublicApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/public/");
}

/** External webhooks with their own signature verification. */
export function isWebhookApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/webhooks/");
}

export function isProtectedApiPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") &&
    !isPublicApiPath(pathname) &&
    !isWebhookApiPath(pathname)
  );
}
