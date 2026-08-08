import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";
import { siteOrigin } from "@/lib/site";

const INDEXNOW_API = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 100;

export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && key.length >= 8 ? key : null;
}

export function getIndexNowKeyLocation(): string | null {
  const key = getIndexNowKey();
  if (!key) return null;
  return `${siteOrigin}/${key}.txt`;
}

export function getIndexNowHost(): string {
  return new URL(siteOrigin).host;
}

export type IndexNowScope = "priority" | "kennisbank" | "zoeken" | "all";

/** Hubs + pillars + cases + recente kennisbank. Voor wekelijkse cron. */
export function getIndexNowUrls(scope: IndexNowScope): string[] {
  const entries = buildSitemapEntries();

  if (scope === "all") {
    return entries.map((e) => e.url);
  }

  if (scope === "kennisbank") {
    return entries.filter((e) => e.url.includes("/kennisbank")).map((e) => e.url);
  }

  if (scope === "zoeken") {
    return entries.filter((e) => e.url.includes("/zoeken")).map((e) => e.url);
  }

  return entries
    .filter((e) => (e.priority ?? 0) >= 0.86)
    .map((e) => e.url);
}

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  batches: number;
  scope: IndexNowScope;
  message?: string;
}

export async function submitToIndexNow(
  urls: string[],
  scope: IndexNowScope = "priority",
): Promise<IndexNowResult> {
  const key = getIndexNowKey();
  const keyLocation = getIndexNowKeyLocation();

  if (!key || !keyLocation) {
    return {
      ok: false,
      status: 503,
      submitted: 0,
      batches: 0,
      scope,
      message: "INDEXNOW_KEY niet geconfigureerd",
    };
  }

  if (urls.length === 0) {
    return {
      ok: false,
      status: 400,
      submitted: 0,
      batches: 0,
      scope,
      message: "Niets om in te dienen",
    };
  }

  const host = getIndexNowHost();
  let batches = 0;
  let lastStatus = 200;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const urlList = urls.slice(i, i + BATCH_SIZE);
    batches += 1;

    const response = await fetch(INDEXNOW_API, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    lastStatus = response.status;

    // 200 = OK, 202 = Accepted
    if (response.status !== 200 && response.status !== 202) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        status: response.status,
        submitted: i,
        batches,
        scope,
        message: text.slice(0, 200) || `IndexNow HTTP ${response.status}`,
      };
    }
  }

  return {
    ok: true,
    status: lastStatus,
    submitted: urls.length,
    batches,
    scope,
  };
}

export async function submitIndexNowScope(scope: IndexNowScope): Promise<IndexNowResult> {
  const urls = getIndexNowUrls(scope);
  return submitToIndexNow(urls, scope);
}

export function isIndexNowAuthorized(request: Request): boolean {
  const secret =
    process.env.INDEXNOW_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const headerSecret = request.headers.get("x-indexnow-secret");
  return headerSecret === secret;
}
