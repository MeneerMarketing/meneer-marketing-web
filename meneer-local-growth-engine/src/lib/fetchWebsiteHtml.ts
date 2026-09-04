const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 MeneerMarketing-LGE/1.0";

function looksLikeHtml(body: string): boolean {
  const head = body.slice(0, 4000).trimStart();
  return /<!doctype html|<html[\s>]/i.test(head) || /<head[\s>]/i.test(head) || /<body[\s>]/i.test(head);
}

export async function fetchWebsiteHtml(
  url: string,
  timeoutMs = 15000,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": DEFAULT_UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;

    const text = await res.text();
    if (text.length < 40) return null;

    const contentType = res.headers.get("content-type") ?? "";
    if (
      contentType.includes("text/html") ||
      contentType.includes("application/xhtml") ||
      contentType.includes("text/plain") ||
      looksLikeHtml(text)
    ) {
      return text;
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
