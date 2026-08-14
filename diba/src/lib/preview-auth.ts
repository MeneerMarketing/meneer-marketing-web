export const PREVIEW_AUTH_COOKIE = "diba_preview_auth";

/** Cookie-waarde afgeleid van het wachtwoord (Edge + Node). */
export async function previewAuthToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`diba-preview-v1:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function previewPasswordConfigured(): boolean {
  const pwd = process.env.PREVIEW_PASSWORD?.trim();
  return Boolean(pwd && pwd.length >= 8);
}

/** Constant-time vergelijking (Edge-safe). */
export function passwordsMatch(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < input.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
